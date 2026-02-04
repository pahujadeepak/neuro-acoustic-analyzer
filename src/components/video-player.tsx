'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// YouTube IFrame API types
interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data?: number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: (event: YTPlayerEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
  className?: string;
}

// Track API loading state globally
let apiLoading = false;
let apiReady = false;
const readyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady && window.YT?.Player) {
      resolve();
      return;
    }

    readyCallbacks.push(resolve);

    if (!apiLoading) {
      apiLoading = true;

      window.onYouTubeIframeAPIReady = () => {
        apiReady = true;
        readyCallbacks.forEach(cb => cb());
        readyCallbacks.length = 0;
      };

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export function VideoPlayer({
  videoId,
  onTimeUpdate,
  onReady,
  className = '',
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Store callbacks in refs to avoid dependency issues
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onReadyRef = useRef(onReady);

  // Update refs when props change
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Start time tracking
  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current && onTimeUpdateRef.current) {
        try {
          const state = playerRef.current.getPlayerState();
          // Only update when playing (1) or paused (2)
          if (state === 1 || state === 2) {
            const time = playerRef.current.getCurrentTime();
            onTimeUpdateRef.current(time);
          }
        } catch {
          // Player not ready
        }
      }
    }, 200);
  }, []);

  // Initialize player - only depends on videoId
  useEffect(() => {
    let mounted = true;
    let player: YTPlayer | null = null;

    const initPlayer = async () => {
      try {
        await loadYouTubeAPI();

        if (!mounted || !containerRef.current || !window.YT?.Player) {
          return;
        }

        // Create player element
        const playerDiv = document.createElement('div');
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(playerDiv);

        player = new window.YT.Player(playerDiv, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!mounted) return;
              playerRef.current = player;
              setIsLoading(false);
              onReadyRef.current?.();
              startTimeTracking();
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (!mounted) return;
              // When playing starts, update time
              if (event.data === 1 && playerRef.current && onTimeUpdateRef.current) {
                onTimeUpdateRef.current(playerRef.current.getCurrentTime());
              }
            },
            onError: (event: YTPlayerEvent) => {
              console.error('YouTube error:', event.data);
              setError('Failed to load video');
              setIsLoading(false);
            },
          },
        });
      } catch (err) {
        console.error('Player init error:', err);
        if (mounted) {
          setError('Failed to initialize player');
          setIsLoading(false);
        }
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (player) {
        try {
          player.destroy();
        } catch {
          // Ignore
        }
      }
      playerRef.current = null;
    };
  }, [videoId, startTimeTracking]);

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading video...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
