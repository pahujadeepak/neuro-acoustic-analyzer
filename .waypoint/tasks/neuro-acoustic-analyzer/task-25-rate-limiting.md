# Task 25: Add Rate Limiting

> **Phase**: 5 - Polish & Deploy
> **Complexity**: Small
> **Dependencies**: Tasks 06, 07
> **Status**: Pending

## Description

Implement rate limiting on both frontend and backend to prevent abuse and ensure fair usage of the analysis service.

## Acceptance Criteria

- [ ] API route rate limiting (10 requests/minute per IP)
- [ ] Audio service rate limiting
- [ ] User feedback when rate limited
- [ ] Graceful queuing for excess requests

## Implementation

### Frontend Rate Limit Feedback

`src/hooks/use-rate-limit.ts`:

```typescript
'use client';

import { useState, useCallback } from 'react';

interface RateLimitState {
  isLimited: boolean;
  retryAfter: number | null;
  requestsRemaining: number;
}

export function useRateLimit() {
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    retryAfter: null,
    requestsRemaining: 10,
  });

  const handleResponse = useCallback((response: Response) => {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const retryAfter = response.headers.get('Retry-After');

    if (response.status === 429) {
      setState({
        isLimited: true,
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : 60,
        requestsRemaining: 0,
      });
      return false;
    }

    setState({
      isLimited: false,
      retryAfter: null,
      requestsRemaining: remaining ? parseInt(remaining, 10) : 10,
    });
    return true;
  }, []);

  const reset = useCallback(() => {
    setState({
      isLimited: false,
      retryAfter: null,
      requestsRemaining: 10,
    });
  }, []);

  return { ...state, handleResponse, reset };
}
```

### Next.js API Rate Limiting

`src/lib/rate-limit.ts`:

```typescript
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Simple in-memory store (use Redis for production)
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
      // New window
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
```

### Update API Route

Update `src/app/api/analyze/route.ts`:

```typescript
import { rateLimit } from '@/lib/rate-limit';

const checkLimit = rateLimit({ windowMs: 60000, maxRequests: 10 });

export async function POST(request: NextRequest) {
  // Check rate limit first
  const limit = checkLimit(request);

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests', code: 'RATE_LIMITED' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // ... rest of handler

  // Add rate limit headers to successful responses
  return NextResponse.json(data, {
    headers: {
      'X-RateLimit-Remaining': String(limit.remaining),
    },
  });
}
```

### Audio Service Rate Limiting

`audio-service/src/middleware/rate_limit.py`:

```python
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import time
from collections import defaultdict
from typing import Dict, Tuple

class RateLimiter:
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        now = time.time()
        minute_ago = now - 60

        # Clean old requests
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] if t > minute_ago
        ]

        if len(self.requests[client_ip]) >= self.requests_per_minute:
            oldest = min(self.requests[client_ip])
            retry_after = int(60 - (now - oldest))
            return False, max(retry_after, 1)

        self.requests[client_ip].append(now)
        remaining = self.requests_per_minute - len(self.requests[client_ip])
        return True, remaining


rate_limiter = RateLimiter(requests_per_minute=10)


async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"

    allowed, value = rate_limiter.is_allowed(client_ip)

    if not allowed:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests", "code": "RATE_LIMITED"},
            headers={"Retry-After": str(value)},
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Remaining"] = str(value)
    return response
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/hooks/use-rate-limit.ts` | Create |
| `src/lib/rate-limit.ts` | Create |
| `src/app/api/analyze/route.ts` | Update |
| `audio-service/src/middleware/rate_limit.py` | Create |
| `audio-service/src/main.py` | Update (add middleware) |

## Testing

- [ ] Rate limit triggers after 10 requests/minute
- [ ] Retry-After header is correct
- [ ] UI shows rate limit message
- [ ] Requests resume after cooldown

---

_Task 25 of 28 - neuro-acoustic-analyzer_
