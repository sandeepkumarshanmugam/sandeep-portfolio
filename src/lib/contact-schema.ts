/**
 * Contact form validation, shared in spirit by client and server.
 *
 * These rules are intentionally dependency-free and mirrored by the server's
 * own Zod schema. Client-side validation is a convenience for the visitor and
 * nothing more — the server re-validates every field, because anything sent
 * from a browser can be forged.
 */

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFieldName = keyof ContactFormValues;

export const FIELD_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 200 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 3000 },
} as const;

/**
 * A pragmatic email check.
 *
 * Deliberately not RFC 5322 — that regex is famously unreadable and rejects
 * fewer real mistakes than it causes. This catches the actual typos (missing
 * @, missing TLD, spaces) and leaves true deliverability to the mail server.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateField(
  field: ContactFieldName,
  value: string,
): string | null {
  const trimmed = value.trim();

  switch (field) {
    case 'name': {
      if (!trimmed) return 'Please enter your name.';
      if (trimmed.length < FIELD_LIMITS.name.min)
        return 'That looks too short — please enter your full name.';
      if (trimmed.length > FIELD_LIMITS.name.max)
        return `Please keep your name under ${FIELD_LIMITS.name.max} characters.`;
      return null;
    }
    case 'email': {
      if (!trimmed) return 'Please enter your email address.';
      if (trimmed.length > FIELD_LIMITS.email.max)
        return 'That email address is too long.';
      if (!EMAIL_PATTERN.test(trimmed))
        return 'Please enter a valid email address.';
      return null;
    }
    case 'subject': {
      if (!trimmed) return 'Please add a subject.';
      if (trimmed.length < FIELD_LIMITS.subject.min)
        return 'Please write a slightly longer subject.';
      if (trimmed.length > FIELD_LIMITS.subject.max)
        return `Please keep the subject under ${FIELD_LIMITS.subject.max} characters.`;
      return null;
    }
    case 'message': {
      if (!trimmed) return 'Please write a message.';
      if (trimmed.length < FIELD_LIMITS.message.min)
        return `Please write at least ${FIELD_LIMITS.message.min} characters so I know how to help.`;
      if (trimmed.length > FIELD_LIMITS.message.max)
        return `Please keep your message under ${FIELD_LIMITS.message.max} characters.`;
      return null;
    }
  }
}

export type ContactErrors = Partial<Record<ContactFieldName, string>>;

export function validateAll(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(values) as ContactFieldName[]) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
