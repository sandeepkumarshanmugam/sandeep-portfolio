import { createApp } from './app.js';
import { closeDatabase, ensureSchema } from './lib/db.js';
import { databaseEnabled, emailEnabled, env } from './env.js';

/**
 * Entry point.
 *
 * Ensures the schema before accepting traffic, then shuts down gracefully so
 * in-flight requests finish and the connection pool closes cleanly — platforms
 * like Render and Railway send SIGTERM on every redeploy.
 */
async function main() {
  if (databaseEnabled) {
    try {
      await ensureSchema();
      console.info('[startup] Database schema verified.');
    } catch (error) {
      // A database problem must not stop the API from booting: email is the
      // primary delivery channel, and refusing to start would take the whole
      // contact form down over a degraded secondary.
      console.error(
        '[startup] Could not verify the database schema. Continuing without persistence.',
        error,
      );
    }
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.info(
      `[startup] Contact API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
    );
    console.info(
      `[startup] Capabilities — database: ${databaseEnabled ? 'on' : 'off'}, email: ${emailEnabled ? 'on' : 'off'}`,
    );
    if (!emailEnabled) {
      console.warn(
        '[startup] Email is not configured: submissions will be validated and stored but not delivered. See server/.env.example.',
      );
    }
    console.info(
      `[startup] Allowed origins: ${env.ALLOWED_ORIGINS.join(', ')}`,
    );
  });

  let shuttingDown = false;

  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.info(`\n[shutdown] ${signal} received, closing down.`);

    server.close(async () => {
      await closeDatabase();
      console.info('[shutdown] Closed cleanly.');
      process.exit(0);
    });

    // Don't hang forever on a stuck connection.
    setTimeout(() => {
      console.warn('[shutdown] Forcing exit after timeout.');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('[fatal] Failed to start:', error);
  process.exit(1);
});
