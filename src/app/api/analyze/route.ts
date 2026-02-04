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
