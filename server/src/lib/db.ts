import postgres from 'postgres';
import { databaseEnabled, env, isProduction } from '../env.js';

/**
 * Postgres persistence for contact submissions.
 *
 * Why Postgres over MongoDB (the README carries the longer version): a contact
 * submission has a fixed, known shape, and the useful guarantees here are
 * relational ones — NOT NULL, length CHECKs and a typed timestamp enforced by
 * the database rather than hoped for by the application. There is no
 * schema-flexibility problem to solve, so the schemaless option would only
 * trade away constraints for nothing in return.
 *
 * The `postgres` driver is used rather than an ORM because there is one table
 * and two queries. An ORM would add a migration toolchain and a query builder
 * to save writing about six lines of SQL.
 *
 * Storage is optional. Without DATABASE_URL the API still validates and
 * emails; a database outage must never swallow someone's message, so failures
 * here are logged and the request continues.
 */

export const sql = databaseEnabled
  ? postgres(env.DATABASE_URL!, {
      // Small pool: this API is I/O-light and often runs on a free tier where
      // connection count is the binding constraint.
      max: 4,
      idle_timeout: 20,
      connect_timeout: 10,
      // Managed Postgres (Neon, Supabase, Render) terminates TLS with certs
      // that are not in Node's default trust store.
      ssl: isProduction ? 'require' : 'prefer',
      onnotice: () => {},
    })
  : null;

export interface StoredSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash: string | null;
  userAgent: string | null;
}

/** Creates the table if it does not exist. Called once at startup. */
export async function ensureSchema(): Promise<void> {
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id           BIGSERIAL   PRIMARY KEY,
      name         TEXT        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
      email        TEXT        NOT NULL CHECK (char_length(email) <= 200),
      subject      TEXT        NOT NULL CHECK (char_length(subject) BETWEEN 3 AND 120),
      message      TEXT        NOT NULL CHECK (char_length(message) BETWEEN 20 AND 3000),
      ip_hash      TEXT,
      user_agent   TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Supports "show me recent messages" without a full scan.
  await sql`
    CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
      ON contact_submissions (created_at DESC)
  `;
}

/**
 * Persists a submission.
 *
 * Values are passed as tagged-template parameters, so the driver sends them
 * out-of-band from the statement — the query text never contains user input,
 * which is what makes SQL injection structurally impossible here rather than
 * merely unlikely.
 */
export async function saveSubmission(input: StoredSubmission): Promise<void> {
  if (!sql) return;

  await sql`
    INSERT INTO contact_submissions
      (name, email, subject, message, ip_hash, user_agent)
    VALUES
      (${input.name}, ${input.email}, ${input.subject}, ${input.message},
       ${input.ipHash}, ${input.userAgent})
  `;
}

export async function closeDatabase(): Promise<void> {
  if (sql) await sql.end({ timeout: 5 });
}
