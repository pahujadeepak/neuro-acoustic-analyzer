# Task 24: Implement Error Handling & Recovery

> **Phase**: 5 - Polish & Deploy
> **Complexity**: Medium
> **Dependencies**: Tasks 14, 15, 16
> **Status**: Pending

## Description

Add comprehensive error handling throughout the application, including user-friendly error messages, retry logic, and graceful degradation.

## Acceptance Criteria

- [ ] Global error boundary for React
- [ ] API error handling with user-friendly messages
- [ ] WebSocket reconnection with backoff
- [ ] Network error recovery
- [ ] Validation error display
- [ ] Error logging for debugging

## Implementation

### Create Error Boundary

`src/components/error-boundary.tsx`:

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Could send to error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-red-500 text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-center max-w-md mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Create Error Types

`src/lib/errors.ts`:

```typescript
export type ErrorCode =
  | 'INVALID_URL'
  | 'VIDEO_NOT_FOUND'
  | 'VIDEO_UNAVAILABLE'
  | 'EXTRACTION_FAILED'
  | 'ANALYSIS_FAILED'
  | 'SERVICE_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  retryable: boolean;
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_URL: 'Please enter a valid YouTube URL',
  VIDEO_NOT_FOUND: 'Video not found. Please check the URL and try again.',
  VIDEO_UNAVAILABLE: 'This video is not available for analysis (may be private or age-restricted)',
  EXTRACTION_FAILED: 'Failed to extract audio from the video',
  ANALYSIS_FAILED: 'Audio analysis failed. Please try again.',
  SERVICE_ERROR: 'Our analysis service is temporarily unavailable',
  NETWORK_ERROR: 'Network connection lost. Please check your internet.',
  TIMEOUT: 'Request timed out. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  UNKNOWN: 'An unexpected error occurred',
};

export function createAppError(code: ErrorCode, details?: string): AppError {
  return {
    code,
    message: ERROR_MESSAGES[code],
    details,
    retryable: ['NETWORK_ERROR', 'TIMEOUT', 'SERVICE_ERROR'].includes(code),
  };
}

export function parseApiError(error: any): AppError {
  if (error?.code && ERROR_MESSAGES[error.code as ErrorCode]) {
    return createAppError(error.code, error.details);
  }
  if (error?.message?.includes('timeout')) {
    return createAppError('TIMEOUT');
  }
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return createAppError('NETWORK_ERROR');
  }
  return createAppError('UNKNOWN', error?.message);
}
```

### Create Error Display Component

`src/components/error-display.tsx`:

```typescript
'use client';

import type { AppError } from '@/lib/errors';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-red-500 text-xl">⚠️</div>
        <div className="flex-1">
          <p className="text-red-400 font-medium">{error.message}</p>
          {error.details && (
            <p className="text-red-400/70 text-sm mt-1">{error.details}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>
      {error.retryable && onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

### Update WebSocket Hook with Retry Logic

Update `src/hooks/use-websocket.ts` to include reconnection with exponential backoff:

```typescript
// Add to existing hook
const [retryCount, setRetryCount] = useState(0);
const maxRetries = 5;
const baseDelay = 1000;

// Exponential backoff
const reconnectDelay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/error-boundary.tsx` | Create |
| `src/lib/errors.ts` | Create |
| `src/components/error-display.tsx` | Create |
| `src/hooks/use-websocket.ts` | Update |

## Testing

- [ ] Error boundary catches React errors
- [ ] API errors display user-friendly messages
- [ ] WebSocket reconnects automatically
- [ ] Retry button works for retryable errors
- [ ] Network offline state handled

---

_Task 24 of 28 - neuro-acoustic-analyzer_
