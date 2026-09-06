import { emailEnabled, env } from '../env.js';

/**
 * Transactional email via Resend.
 *
 * Calls the REST API with `fetch` instead of installing the SDK: Node 22 has
 * fetch built in, the endpoint is a single POST, and the SDK's value is
 * types plus retries that this one call does not need. One fewer dependency in
 * the deploy, and nothing hidden between here and the wire.
 *
 * Two headers do the real work. `reply_to` is set to the visitor's address, so
 * replying from the inbox goes to them rather than to the sender identity —
 * without it every reply would need copy-pasting. The `from` address must be a
 * domain verified on the Resend account; the visitor's address cannot be used
 * there, or the mail fails SPF/DKIM and lands in spam.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface ContactEmail {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly submittedAt: Date;
}

/** HTML-escapes a value before it is interpolated into the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(input: ContactEmail): string {
  // Every interpolated value is escaped: the message is attacker-controlled
  // text, and an email client is an HTML renderer like any other.
  const rows: readonly [string, string][] = [
    ['From', `${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;`],
    ['Subject', escapeHtml(input.subject)],
    ['Received', escapeHtml(input.submittedAt.toISOString())],
  ];

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
      <div style="background:#030507;padding:18px 24px">
        <p style="margin:0;color:#00BFFF;font-size:12px;letter-spacing:2px;text-transform:uppercase">New contact message</p>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `<tr>
          <td style="padding:12px 24px;border-bottom:1px solid #f1f2f4;color:#6b7280;font-size:13px;width:96px;vertical-align:top">${label}</td>
          <td style="padding:12px 24px;border-bottom:1px solid #f1f2f4;font-size:14px">${value}</td>
        </tr>`,
          )
          .join('')}
      </table>
      <div style="padding:20px 24px">
        <p style="margin:0 0 10px;color:#6b7280;font-size:13px">Message</p>
        <div style="white-space:pre-wrap;font-size:15px;line-height:1.65">${escapeHtml(input.message)}</div>
      </div>
      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #f1f2f4">
        <p style="margin:0;color:#9ca3af;font-size:12px">Sent from the contact form on sandeepkumar.dev</p>
      </div>
    </div>
  </body>
</html>`;
}

function buildText(input: ContactEmail): string {
  return [
    'New contact message',
    '',
    `From:     ${input.name} <${input.email}>`,
    `Subject:  ${input.subject}`,
    `Received: ${input.submittedAt.toISOString()}`,
    '',
    '---',
    '',
    input.message,
  ].join('\n');
}

export interface SendResult {
  readonly sent: boolean;
  readonly reason?: string;
}

export async function sendContactEmail(input: ContactEmail): Promise<SendResult> {
  if (!emailEnabled) {
    return { sent: false, reason: 'email-not-configured' };
  }

  // Don't hang a request on a slow upstream.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: `Portfolio Contact <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `[Portfolio] ${input.subject}`,
        html: buildHtml(input),
        text: buildText(input),
      }),
    });

    if (!response.ok) {
      // Log the status, never the API key or the full request.
      const detail = await response.text().catch(() => '');
      console.error(
        `[mail] Resend rejected the request (${response.status}): ${detail.slice(0, 300)}`,
      );
      return { sent: false, reason: `resend-${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === 'AbortError'
        ? 'timeout'
        : 'network-error';
    console.error(`[mail] Failed to send (${reason}).`);
    return { sent: false, reason };
  } finally {
    clearTimeout(timeout);
  }
}
