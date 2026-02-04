# Task 14: Connect Frontend API to Audio Service

> **Phase**: 3 - Integration
> **Complexity**: Medium
> **Dependencies**: Tasks 06, 07
> **Status**: Pending

## Description

Update the Next.js API route to call the audio service and initiate analysis jobs. Replace the mock response with actual service communication.

## Acceptance Criteria

- [ ] API route calls audio service
- [ ] Handles service errors appropriately
- [ ] Returns WebSocket URL for client
- [ ] Validates video availability
- [ ] Timeout handling for slow responses

## Implementation

Update `src/app/api/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube/url-parser';

const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL || 'http://localhost:8000';

const analyzeRequestSchema = z.object({
  youtubeUrl: z.string().url().refine(isValidYouTubeUrl, 'Invalid YouTube URL'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = analyzeRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message, code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    const { youtubeUrl } = result.data;
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    // Call audio service
    const serviceResponse = await fetch(`${AUDIO_SERVICE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id: videoId, youtube_url: youtubeUrl }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!serviceResponse.ok) {
      const error = await serviceResponse.json();
      return NextResponse.json(
        { error: error.detail || 'Analysis failed', code: 'SERVICE_ERROR' },
        { status: serviceResponse.status }
      );
    }

    const data = await serviceResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Service timeout', code: 'SERVICE_ERROR' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Unexpected error', code: 'SERVICE_ERROR' },
      { status: 500 }
    );
  }
}
```

## Files to Modify

| File | Description |
|------|-------------|
| `src/app/api/analyze/route.ts` | Update with service call |
| `.env.local` | Add AUDIO_SERVICE_URL |

## Testing

- [ ] Returns job data when audio service is running
- [ ] Returns error when audio service is down
- [ ] Handles timeout gracefully

---

_Task 14 of 28 - neuro-acoustic-analyzer_
