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
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error', code: 'SERVICE_ERROR' },
      { status: 500 }
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
