export const config = {
  audioServiceUrl: process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
  isProduction: process.env.NODE_ENV === 'production',
  websocketUrl: process.env.NEXT_PUBLIC_WS_URL || process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
};

// Validate required env vars in production
if (config.isProduction && !process.env.AUDIO_SERVICE_URL) {
  console.error('Missing required environment variable: AUDIO_SERVICE_URL');
}
