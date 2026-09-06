import { useId, useRef, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import {
  FIELD_LIMITS,
  validateAll,
  validateField,
  type ContactErrors,
  type ContactFieldName,
  type ContactFormValues,
} from '@/lib/contact-schema';
import { profile } from '@/data/profile';
import { cx } from '@/lib/cx';

/**
 * The contact form.
 *
 * Behaviour worth noting:
 *
 *  - Fields validate on blur, not on every keystroke. Validating as someone
 *    types tells them their half-finished email is invalid, which is true and
 *    useless.
 *  - Errors are wired with `aria-describedby` + `aria-invalid` and announced
 *    via a live region, so a screen-reader user hears what went wrong.
 *  - A honeypot field catches naive bots. It is hidden from sight *and* from
 *    assistive technology, and never from the server's checks.
 *  - Submission failures distinguish "your input was rejected", "too many
 *    attempts" and "the server is unreachable", because the recovery action
 *    differs in each case. The email address is offered as a fallback whenever
 *    sending fails, so a broken API never means a dead end.
 */

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string; canRetry: boolean };

const EMPTY: ContactFormValues = { name: '', email: '', subject: '', message: '' };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  // Rendered but visually hidden; a real person never fills this in.
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Time-to-submit is a cheap bot signal: scripts post instantly.
  const mountedAt = useRef(Date.now());

  const formId = useId();
  const fieldId = (field: string) => `${formId}-${field}`;
  const errorId = (field: string) => `${formId}-${field}-error`;

  const setValue = (field: ContactFieldName, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear an existing error as soon as the field becomes valid, so the
    // message disappears the moment it stops being true.
    if (errors[field] && !validateField(field, value)) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: ContactFieldName) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors((previous) => {
      const next = { ...previous };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first problem so keyboard users are not left
      // hunting for it.
      const firstField = (Object.keys(nextErrors) as ContactFieldName[])[0];
      document.getElementById(fieldId(firstField))?.focus();
      return;
    }

    setStatus({ kind: 'submitting' });

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          // Spam signals, checked server-side.
          botField: honeypotRef.current?.value ?? '',
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });

      if (response.ok) {
        setStatus({ kind: 'success' });
        setValues(EMPTY);
        setTouched({});
        return;
      }

      if (response.status === 429) {
        setStatus({
          kind: 'error',
          message:
            "That's a few messages in quick succession — please wait a minute and try again.",
          canRetry: false,
        });
        return;
      }

      if (response.status === 400) {
        const payload = (await response.json().catch(() => null)) as
          | { errors?: ContactErrors }
          | null;
        if (payload?.errors) setErrors(payload.errors);
        setStatus({
          kind: 'error',
          message: 'Please check the highlighted fields and try again.',
          canRetry: false,
        });
        return;
      }

      setStatus({
        kind: 'error',
        message: "Something went wrong on my end and the message wasn't sent.",
        canRetry: true,
      });
    } catch {
      // Network failure, DNS, offline, or the API is not running.
      setStatus({
        kind: 'error',
        message: "I couldn't reach the server — you may be offline.",
        canRetry: true,
      });
    }
  };

  /* ----------------------------------------------------------- Success state */
  if (status.kind === 'success') {
    return (
      <div
        className="rounded-xl border border-hairline-accent accent-wash p-8 text-center sm:p-10"
        role="status"
        aria-live="polite"
      >
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full border border-hairline-accent bg-accent/[0.1] text-accent">
          <Icon name="check" size={24} />
        </span>
        <h3 className="mt-6 text-h3 font-semibold text-fg">Message sent.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-secondary">
          Thanks for reaching out — it&rsquo;s landed in my inbox and I&rsquo;ll
          reply as soon as I can, usually within a couple of days.
        </p>
        <Button
          variant="secondary"
          className="mt-8"
          onClick={() => setStatus({ kind: 'idle' })}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const isSubmitting = status.kind === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Announced to screen readers; visible errors live under each field. */}
      <div role="status" aria-live="polite" className="sr-only">
        {status.kind === 'error' ? status.message : ''}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={fieldId('name')}
          label="Name"
          value={values.name}
          error={touched.name ? errors.name : undefined}
          errorId={errorId('name')}
          onChange={(value) => setValue('name', value)}
          onBlur={() => handleBlur('name')}
          autoComplete="name"
          maxLength={FIELD_LIMITS.name.max}
          disabled={isSubmitting}
          required
        />
        <Field
          id={fieldId('email')}
          label="Email"
          type="email"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          errorId={errorId('email')}
          onChange={(value) => setValue('email', value)}
          onBlur={() => handleBlur('email')}
          autoComplete="email"
          maxLength={FIELD_LIMITS.email.max}
          disabled={isSubmitting}
          required
        />
      </div>

      <Field
        id={fieldId('subject')}
        label="Subject"
        value={values.subject}
        error={touched.subject ? errors.subject : undefined}
        errorId={errorId('subject')}
        onChange={(value) => setValue('subject', value)}
        onBlur={() => handleBlur('subject')}
        maxLength={FIELD_LIMITS.subject.max}
        disabled={isSubmitting}
        required
      />

      <Field
        id={fieldId('message')}
        label="Message"
        multiline
        value={values.message}
        error={touched.message ? errors.message : undefined}
        errorId={errorId('message')}
        onChange={(value) => setValue('message', value)}
        onBlur={() => handleBlur('message')}
        maxLength={FIELD_LIMITS.message.max}
        disabled={isSubmitting}
        hint={`${values.message.trim().length}/${FIELD_LIMITS.message.max}`}
        required
      />

      {/* Honeypot. Hidden from view and from assistive tech, so no human is
          ever offered it — which is what makes a filled value meaningful. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId('company-website')}>Company website</label>
        <input
          ref={honeypotRef}
          id={fieldId('company-website')}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status.kind === 'error' ? (
        <div className="rounded-lg border border-danger/30 bg-danger/[0.07] p-4">
          <div className="flex items-start gap-3">
            <Icon name="close" size={16} className="mt-0.5 shrink-0 text-danger" />
            <div className="text-sm">
              <p className="font-medium text-fg">{status.message}</p>
              {status.canRetry ? (
                <p className="mt-1.5 text-fg-secondary">
                  You can try again, or email me directly at{' '}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                  >
                    {profile.email}
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button
          type="submit"
          size="lg"
          icon={isSubmitting ? undefined : 'arrow-right'}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              Sending
            </span>
          ) : (
            'Send Message'
          )}
        </Button>
        <p className="text-[0.75rem] text-fg-muted">
          I&rsquo;ll only use your details to reply.
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field                                                                     */
/* -------------------------------------------------------------------------- */

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
  readonly error?: string | undefined;
  readonly errorId: string;
  readonly type?: string;
  readonly multiline?: boolean;
  readonly autoComplete?: string;
  readonly maxLength?: number;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly hint?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  errorId,
  type = 'text',
  multiline = false,
  autoComplete,
  maxLength,
  disabled,
  required,
  hint,
}: FieldProps) {
  const controlClasses = cx(
    'w-full rounded-lg border bg-bg-alt px-4 text-[0.9375rem] text-fg',
    'transition-[border-color,box-shadow,background-color] duration-200',
    'placeholder:text-fg-muted disabled:opacity-60',
    error
      ? 'border-danger/55 focus-visible:border-danger'
      : 'border-hairline-strong hover:border-white/20 focus-visible:border-accent',
    // A ring rather than the global outline, so it hugs the rounded corners.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35',
    multiline ? 'min-h-36 resize-y py-3 leading-relaxed' : 'h-12',
  );

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
          {required ? (
            <span className="ml-1 text-accent" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {hint ? (
          <span className="font-mono text-[0.6875rem] text-fg-muted">{hint}</span>
        ) : null}
      </div>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={controlClasses}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={controlClasses}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-[0.8125rem] text-danger">
          <Icon name="close" size={13} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
