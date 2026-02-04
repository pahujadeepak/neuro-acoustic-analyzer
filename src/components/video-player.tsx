'use client';

import { useEffect, useRef } from 'react';
import { getYouTubeEmbedUrl } from '@/lib/youtube/url-parser';

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
  className?: string;
}

export function VideoPlayer({
  videoId,
  onTimeUpdate,
  onReady,
  className = '',
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const embedUrl = `${getYouTubeEmbedUrl(videoId)}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  useEffect(() => {
    // Load YouTube IFrame API
    if (typeof window !== 'undefined' && !(window as unknown as { YT?: unknown }).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // For MVP, use simple iframe without API
  // Full YouTube API integration can be added later

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="YouTube video player"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
