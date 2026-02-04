import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }) {
  return function checkRateLimit(request: NextRequest): {
    success: boolean;
    remaining: number;
    retryAfter?: number;
  } {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const now = Date.now();
    const record = requestCounts.get(ip);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of requestCounts.entries()) {
        if (value.resetTime < now) {
          requestCounts.delete(key);
        }
      }
    }

    if (!record || record.resetTime < now) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { success: true, remaining: config.maxRequests - 1 };
    }

    if (record.count >= config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { success: false, remaining: 0, retryAfter };
    }

    record.count++;
    return { success: true, remaining: config.maxRequests - record.count };
  };
}
