from fastapi import Request
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
