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

export function parseApiError(error: unknown): AppError {
  if (error && typeof error === 'object') {
    const err = error as { code?: string; message?: string; details?: string };
    if (err.code && ERROR_MESSAGES[err.code as ErrorCode]) {
      return createAppError(err.code as ErrorCode, err.details);
    }
    if (err.message?.includes('timeout')) {
      return createAppError('TIMEOUT');
    }
    if (err.message?.includes('network') || err.message?.includes('fetch')) {
      return createAppError('NETWORK_ERROR');
    }
  }
  return createAppError('UNKNOWN', error instanceof Error ? error.message : undefined);
}
