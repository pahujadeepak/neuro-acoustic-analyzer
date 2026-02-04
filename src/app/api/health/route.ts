import { NextResponse } from 'next/server';

export async function GET() {
  const audioServiceUrl = process.env.AUDIO_SERVICE_URL;

  let audioServiceStatus = 'unknown';
  try {
    if (audioServiceUrl) {
      const response = await fetch(`${audioServiceUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      audioServiceStatus = response.ok ? 'healthy' : 'unhealthy';
    }
  } catch {
    audioServiceStatus = 'unreachable';
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      audio: audioServiceStatus,
    },
  });
}
