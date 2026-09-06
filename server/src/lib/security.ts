import type { RequestHandler } from 'express';
import { env, isProduction } from '../env.js';

/**
 * Security headers and CORS.
 *
 * Written by hand rather than pulling in Helmet and the cors package, because
 * this service is a JSON API with exactly one endpoint and one allowed origin
 * list. Helmet's value is breadth — CSP builders, referrer policies for HTML
 * documents, a dozen toggles — and none of that applies to a response that is
 * always `application/json`. Eight explicit headers are easier to audit than a
 * configuration object.
 */

/** Applied to every response. */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  // This API never serves HTML or scripts, so lock the CSP down completely.
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  // Never let a browser second-guess the declared content type.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  // No reason for a browser to grant this origin any powerful features.
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()',
  );
  // Do not cache submission responses.
  res.setHeader('Cache-Control', 'no-store');
  // Don't advertise the framework.
  res.removeHeader('X-Powered-By');

  if (isProduction) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }

  next();
};

/**
 * Origin allowlist.
 *
 * Reflects the request's origin only when it is on the list, rather than
 * echoing whatever arrived or using `*`. Credentials are not enabled, since the
 * endpoint uses no cookies or auth — so there is nothing for a hostile origin
 * to ride on even if it could reach it.
 */
export const cors: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && env.ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    // Caches must not serve one origin's CORS response to another.
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Answer the preflight without touching the route handlers.
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
};
