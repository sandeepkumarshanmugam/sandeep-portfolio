import { z } from 'zod';

/**
 * Server-side validation for a contact submission.
 *
 * This mirrors src/lib/contact-schema.ts on the client, but it is the schema
 * that actually matters: the client's copy is a convenience for the visitor,
 * while this one is the trust boundary. Anything arriving over HTTP is
 * untrusted regardless of which form claims to have produced it.
 */

/**
 * Strips control characters, which have no legitimate place in a form field.
 *
 * C0 range minus the whitespace we want to keep, plus DEL and the C1 range.
 * Newlines and tabs survive inside the message body (`allowNewlines`) so
 * paragraph breaks are preserved; every other field is collapsed to a line.
 */
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
const CONTROL_CHARS_KEEP_WHITESPACE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

const stripControlChars = (value: string, allowNewlines = false): string =>
  value.replace(
    allowNewlines ? CONTROL_CHARS_KEEP_WHITESPACE : CONTROL_CHARS,
    '',
  );

export const contactSchema = z.object({
  name: z
    .string()
    .transform((value) => stripControlChars(value).trim())
    .pipe(
      z
        .string()
        .min(2, 'That looks too short — please enter your full name.')
        .max(80, 'Please keep your name under 80 characters.'),
    ),

  email: z
    .string()
    .transform((value) => stripControlChars(value).trim().toLowerCase())
    .pipe(
      z
        .string()
        .max(200, 'That email address is too long.')
        .email('Please enter a valid email address.'),
    ),

  subject: z
    .string()
    .transform((value) => stripControlChars(value).trim())
    .pipe(
      z
        .string()
        .min(3, 'Please write a slightly longer subject.')
        .max(120, 'Please keep the subject under 120 characters.'),
    ),

  message: z
    .string()
    .transform((value) => stripControlChars(value, true).trim())
    .pipe(
      z
        .string()
        .min(20, 'Please write at least 20 characters so I know how to help.')
        .max(3000, 'Please keep your message under 3000 characters.'),
    ),

  /**
   * Honeypot. Any value means a bot filled a field no human can see.
   *
   * Accepted as an ordinary string on purpose — it must NOT be a validation
   * constraint. Rejecting it here would return a 400 naming `botField`, which
   * tells the bot exactly which field gave it away and lets it retry without
   * one. The handler evaluates it instead and drops the request silently.
   */
  botField: z.string().max(500).optional().default(''),

  /** Milliseconds between the form mounting and submitting. Scripts post
   *  near-instantly; a human takes seconds at minimum. */
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Submissions faster than this are treated as automated. */
export const MIN_ELAPSED_MS = 2_000;

/**
 * Flattens Zod issues into the `{ field: message }` shape the client's form
 * expects, so server-side errors render in exactly the same place as local
 * ones.
 */
/** Only these are ever echoed back — they are the fields the form renders. */
const CLIENT_FACING_FIELDS = new Set(['name', 'email', 'subject', 'message']);

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    // Internal fields (botField, elapsedMs) are filtered out: the form has
    // nowhere to display them, and naming them would describe the spam checks
    // to whoever tripped them.
    if (
      typeof field === 'string' &&
      CLIENT_FACING_FIELDS.has(field) &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
