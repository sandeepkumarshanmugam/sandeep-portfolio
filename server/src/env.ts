import { z } from 'zod';

/**
 * Environment configuration, validated at startup.
 *
 * The process refuses to boot on invalid configuration rather than failing on
 * the first request — a misconfigured deploy should be obvious immediately,
 * not discovered by the first visitor who tries to send a message.
 *
 * Persistence and email are both optional and independent. The API degrades
 * rather than breaking: with neither configured it validates and logs, with
 * only a database it stores, with only Resend it emails. `/health` reports
 * exactly which capabilities are live.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  /** Comma-separated list of origins allowed to call this API. */
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  /** Postgres connection string. Omit to run without persistence. */
  DATABASE_URL: z.string().url().optional(),

  /** Resend API key. Omit to run without sending email. */
  RESEND_API_KEY: z.string().min(1).optional(),
  /** Verified sender on the Resend account. */
  CONTACT_FROM_EMAIL: z.string().email().optional(),
  /** Where contact submissions are delivered. */
  CONTACT_TO_EMAIL: z.string().email().optional(),

  /** Requests allowed per window, per IP. */
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(600_000),

  /** Set to 1 when running behind a proxy (Render, Railway, Fly, nginx) so
   *  Express reads the client IP from X-Forwarded-For instead of the socket. */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('\nInvalid environment configuration:\n');
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  console.error('\nSee server/.env.example for the expected values.\n');
  process.exit(1);
}

export const env = parsed.data;

/** Email is only usable when the key and both addresses are present. */
export const emailEnabled = Boolean(
  env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL,
);

export const databaseEnabled = Boolean(env.DATABASE_URL);

export const isProduction = env.NODE_ENV === 'production';
