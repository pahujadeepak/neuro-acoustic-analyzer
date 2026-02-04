# Task 06: Create API Route Skeleton

> **Phase**: 1 - Foundation
> **Complexity**: Small
> **Dependencies**: Task 02
> **Status**: Pending

## Description

Create the `/api/analyze` route that validates YouTube URLs and initiates analysis jobs with the audio service. For now, create a skeleton that returns mock data.

## Acceptance Criteria

- [ ] POST `/api/analyze` endpoint created
- [ ] Zod schema validates request body
- [ ] Returns proper error responses for invalid URLs
- [ ] Returns mock success response (job ID, websocket URL)
- [ ] CORS headers set correctly
- [ ] Error handling in place

## Implementation

### Create API Route

`src/app/api/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube/url-parser';

// Request validation schema
const analyzeRequestSchema = z.object({
  youtubeUrl: z
    .string()
    .url('Must be a valid URL')
    .refine(isValidYouTubeUrl, 'Must be a valid YouTube URL'),
});

// Environment variables
const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL || 'http://localhost:8000';
const WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'ws://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    const result = analyzeRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.errors[0]?.message || 'Invalid request',
          code: 'INVALID_URL',
        },
        { status: 400 }
      );
    }

    const { youtubeUrl } = result.data;
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return NextResponse.json(
        {
          error: 'Could not extract video ID from URL',
          code: 'INVALID_URL',
        },
        { status: 400 }
      );
    }

    // TODO: Call audio service to start analysis
    // For now, return mock response
    const jobId = `job_${Date.now()}_${videoId}`;

    // Mock response - will be replaced with actual service call
    const response = {
      jobId,
      videoId,
      videoTitle: 'Loading...', // Will come from audio service
      duration: 0, // Will come from audio service
      websocketUrl: `${WEBSOCKET_URL}/ws/${jobId}`,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analyze API error:', error);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        code: 'SERVICE_ERROR',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Create API Client

`src/lib/api/client.ts`:

```typescript
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
```

### Create Index Export

`src/lib/api/index.ts`:

```typescript
export * from './client';
```

### Create Environment Config

`src/config/env.ts`:

```typescript
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  audioServiceUrl: process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8001',
} as const;
```

### Create `.env.local` Template

`.env.local.example`:

```env
# Audio Service URLs (for development)
AUDIO_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8001

# API URL (leave empty for same-origin)
NEXT_PUBLIC_API_URL=

# Rate limiting (optional)
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

## Files to Create

| File | Description |
|------|-------------|
| `src/app/api/analyze/route.ts` | API route handler |
| `src/lib/api/client.ts` | API client functions |
| `src/lib/api/index.ts` | Barrel export |
| `src/config/env.ts` | Environment config |
| `.env.local.example` | Environment template |

## Testing

### Manual Testing

```bash
# Test valid URL
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Expected: { "jobId": "job_...", "videoId": "dQw4w9WgXcQ", ... }

# Test invalid URL
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "not-a-url"}'

# Expected: { "error": "...", "code": "INVALID_URL" }
```

### Acceptance Tests

- [ ] Valid YouTube URL returns 200 with job data
- [ ] Invalid URL returns 400 with INVALID_URL code
- [ ] Missing body returns 400
- [ ] Server errors return 500 with SERVICE_ERROR code

## Notes

- This is a skeleton - actual audio service integration in Task 14
- Using Zod for runtime validation
- Mock data allows frontend development to continue

---

_Task 06 of 28 - neuro-acoustic-analyzer_
