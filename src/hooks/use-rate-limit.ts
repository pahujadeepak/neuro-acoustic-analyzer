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
