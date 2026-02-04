import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube/url-parser';
import { rateLimit } from '@/lib/rate-limit';

const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL || 'http://localhost:8000';

const analyzeRequestSchema = z.object({
  youtubeUrl: z.string().url().refine(isValidYouTubeUrl, 'Invalid YouTube URL'),
});

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

  try {
    const body = await request.json();
    const result = analyzeRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message, code: 'INVALID_URL' },
        { status: 400, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } }
      );
    }

    const { youtubeUrl } = result.data;
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID', code: 'INVALID_URL' },
        { status: 400, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } }
      );
    }

    // Call audio service
    const serviceResponse = await fetch(`${AUDIO_SERVICE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id: videoId, youtube_url: youtubeUrl }),
      signal: AbortSignal.timeout(10000),
    });

    if (!serviceResponse.ok) {
      const error = await serviceResponse.json();
      return NextResponse.json(
        { error: error.detail || 'Analysis failed', code: 'SERVICE_ERROR' },
        { status: serviceResponse.status, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } }
      );
    }

    const data = await serviceResponse.json();
    return NextResponse.json(data, {
      headers: { 'X-RateLimit-Remaining': String(limit.remaining) },
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Service timeout', code: 'TIMEOUT' },
        { status: 504, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } }
      );
    }
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error', code: 'SERVICE_ERROR' },
      { status: 500, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } }
    );
  }
}

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
