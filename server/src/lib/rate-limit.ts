import type { RequestHandler } from 'express';

/**
 * A fixed-window rate limiter, in memory.
 *
 * Written rather than installed, because the requirement here is narrow: one
 * endpoint, one process, a handful of requests per window. `express-rate-limit`
 * solves a much larger problem (stores, distributed counters, draft RFC
 * headers) than this API has.
 *
 * The tradeoff is explicit: counters live in this process, so they reset on
 * restart and are not shared between instances. For a single-instance contact
 * form that is fine. If this ever runs behind more than one instance, the
 * honest fix is a shared store (Redis) rather than pretending per-instance
 * counters are a global limit — email is still protected downstream by
 * Resend's own quotas.
 *
 * Sweeping expired entries on write keeps the map from growing without bound
 * under a scripted flood, which a plain Map would not.
 */

interface Bucket {
  count: number;
  /** Epoch ms at which this window expires. */
  resetAt: number;
}

export interface RateLimitOptions {
  readonly windowMs: number;
  readonly max: number;
  /** Message returned once the limit is exceeded. */
  readonly message?: string;
}

export function createRateLimiter({
  windowMs,
  max,
  message = 'Too many requests. Please try again shortly.',
}: RateLimitOptions): RequestHandler {
  const buckets = new Map<string, Bucket>();
  let lastSweep = Date.now();

  /** Drop expired buckets. Amortised: runs at most once per window. */
  const sweep = (now: number) => {
    if (now - lastSweep < windowMs) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
    lastSweep = now;
  };

  return (req, res, next) => {
    const now = Date.now();
    sweep(now);

    // `req.ip` is only trustworthy when Express has been told how many proxies
    // sit in front of it — see TRUST_PROXY in env.ts. Without that, a client
    // could set X-Forwarded-For freely and rotate its own identity.
    const key = req.ip ?? 'unknown';
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', max - 1);
      next();
      return;
    }

    existing.count += 1;

    if (existing.count > max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      );
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', 0);
      res.status(429).json({ ok: false, message });
      return;
    }

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - existing.count));
    next();
  };
}
