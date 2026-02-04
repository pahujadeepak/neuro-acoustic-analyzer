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
        <div className="text-red-500 text-xl">!</div>
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
            X
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
