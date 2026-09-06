import express, { type ErrorRequestHandler } from 'express';
import { contactRouter } from './routes/contact.js';
import { cors, securityHeaders } from './lib/security.js';
import { databaseEnabled, emailEnabled, env, isProduction } from './env.js';

/**
 * The Express application, exported separately from the listener so it can be
 * imported by a test or mounted as a serverless handler without binding a port.
 */
export function createApp() {
  const app = express();

  // How many proxies to trust when resolving req.ip. Left at 0 locally so a
  // client cannot spoof X-Forwarded-For and evade the rate limiter.
  app.set('trust proxy', env.TRUST_PROXY);
  app.disable('x-powered-by');

  app.use(securityHeaders);
  app.use(cors);

  // A contact payload is a few kilobytes at most; the default 100kb limit is
  // an unnecessarily large surface.
  app.use(express.json({ limit: '16kb' }));

  /** Readiness probe. Reports which optional capabilities are actually live. */
  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      environment: env.NODE_ENV,
      capabilities: {
        database: databaseEnabled,
        email: emailEnabled,
      },
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  app.use('/api/contact', contactRouter);

  app.use((_req, res) => {
    res.status(404).json({ ok: false, message: 'Not found.' });
  });

  /**
   * Terminal error handler.
   *
   * Express 5 forwards rejected async handlers here automatically. Clients get
   * a generic message — stack traces and driver errors can disclose schema
   * details and file paths — while the real error goes to the logs.
   */
  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    // Malformed JSON surfaces as a SyntaxError from the body parser; that is
    // the client's mistake, not a server fault.
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({ ok: false, message: 'Malformed request body.' });
      return;
    }

    console.error('[error]', error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong. Please try again later.',
      ...(isProduction ? {} : { detail: String(error) }),
    });
  };

  app.use(errorHandler);

  return app;
}
