import { Router } from 'express';
import { createHash } from 'node:crypto';
import { contactSchema, MIN_ELAPSED_MS, toFieldErrors } from '../lib/schema.js';
import { saveSubmission } from '../lib/db.js';
import { sendContactEmail } from '../lib/mail.js';
import { createRateLimiter } from '../lib/rate-limit.js';
import { databaseEnabled, emailEnabled, env } from '../env.js';

/**
 * POST /api/contact
 *
 * Order of operations is deliberate: rate limit, then validate, then check
 * spam signals, then persist, then send. Cheap rejections happen before
 * expensive work, and nothing touches the database or an upstream API until
 * the payload is known to be well-formed.
 */
export const contactRouter = Router();

const limiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message:
    "That's a few messages in quick succession — please wait a minute and try again.",
});

/**
 * Stores a salted hash of the IP rather than the address itself.
 *
 * The address is genuinely useful for spotting abuse patterns, and genuinely
 * personal data. A hash keeps "were these two messages from the same sender?"
 * answerable while keeping the address itself out of the database. The salt is
 * the Resend key or database URL — already secret, already deployment-specific
 * — so hashes cannot be reversed with a precomputed table of the IPv4 space.
 */
function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  const salt = env.RESEND_API_KEY ?? env.DATABASE_URL ?? 'local-development-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

contactRouter.post('/', limiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      ok: false,
      message: 'Please check the highlighted fields and try again.',
      errors: toFieldErrors(parsed.error),
    });
    return;
  }

  const { name, email, subject, message, botField, elapsedMs } = parsed.data;

  // Spam signals. Both return 200: telling a bot which check caught it just
  // helps it iterate, and a human can never trigger either of these.
  const looksAutomated =
    botField.length > 0 ||
    (elapsedMs !== undefined && elapsedMs < MIN_ELAPSED_MS);

  if (looksAutomated) {
    console.warn(
      `[contact] Rejected a likely automated submission (honeypot=${botField.length > 0}, elapsedMs=${elapsedMs ?? 'n/a'}).`,
    );
    res.status(200).json({ ok: true });
    return;
  }

  const submittedAt = new Date();
  const submission = {
    name,
    email,
    subject,
    message,
    ipHash: hashIp(req.ip),
    // Truncated: enough to identify a client, not enough to be a fingerprint.
    userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
  };

  // Persist and send independently. A database outage must not lose the
  // message, and a mail failure must not discard a stored record — so each is
  // awaited separately and neither can reject the other.
  const [stored, mailed] = await Promise.allSettled([
    saveSubmission(submission),
    sendContactEmail({ name, email, subject, message, submittedAt }),
  ]);

  if (stored.status === 'rejected') {
    console.error('[contact] Failed to persist submission:', stored.reason);
  }

  const emailSent =
    mailed.status === 'fulfilled' ? mailed.value.sent : false;

  if (mailed.status === 'rejected') {
    console.error('[contact] Failed to send email:', mailed.reason);
  }

  const persisted = stored.status === 'fulfilled' && databaseEnabled;

  // If neither channel worked, the message is effectively lost — say so, so
  // the form can offer the direct email address instead of falsely confirming.
  if (!emailSent && !persisted) {
    // Last resort: at least get it into the logs so it is recoverable.
    console.error(
      '[contact] Message could not be delivered or stored. Payload:',
      JSON.stringify({ name, email, subject, message: message.slice(0, 500) }),
    );
    res.status(503).json({
      ok: false,
      message: "I couldn't deliver your message. Please email me directly.",
    });
    return;
  }

  if (!emailEnabled) {
    console.info(
      `[contact] Stored a submission from ${email}. Email is not configured, so no notification was sent.`,
    );
  }

  res.status(201).json({ ok: true });
});
