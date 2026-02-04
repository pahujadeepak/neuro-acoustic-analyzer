export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  audioServiceUrl: process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8001',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
