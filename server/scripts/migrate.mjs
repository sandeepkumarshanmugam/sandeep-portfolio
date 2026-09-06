/**
 * Applies the database schema.
 *
 * The API also calls `ensureSchema()` on startup, which is convenient for a
 * single-instance deploy. This script exists for the cases where that is the
 * wrong place to do it: running migrations as a separate deploy step, or
 * verifying a connection string before the app goes live.
 *
 * Usage:  npm run db:migrate
 * Requires DATABASE_URL in server/.env
 */
import postgres from 'postgres';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error(
    'DATABASE_URL is not set. Add it to server/.env — see .env.example.',
  );
  process.exit(1);
}

const sql = postgres(url, { max: 1, ssl: 'prefer', onnotice: () => {} });

try {
  console.log('Connecting…');
  const [{ version }] = await sql`SELECT version()`;
  console.log(`Connected: ${version.split(',')[0]}`);

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
  console.log('Table contact_submissions is ready.');

  await sql`
    CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
      ON contact_submissions (created_at DESC)
  `;
  console.log('Index contact_submissions_created_at_idx is ready.');

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM contact_submissions`;
  console.log(`\nDone. ${count} submission(s) currently stored.`);
} catch (error) {
  console.error('\nMigration failed:', error.message);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
