import type { AnalyzeRequest, AnalyzeResponse, AnalyzeErrorResponse } from '@/lib/analysis/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function analyzeVideo(url: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ youtubeUrl: url } satisfies AnalyzeRequest),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as AnalyzeErrorResponse;
    throw new APIError(
      errorData.error,
      errorData.code,
      response.status
    );
  }

  return data as AnalyzeResponse;
}
