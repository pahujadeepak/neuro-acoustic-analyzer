# Task 15: Implement WebSocket Client Hook

> **Phase**: 3 - Integration
> **Complexity**: Medium
> **Dependencies**: Task 13
> **Status**: Pending

## Description

Create a React hook that manages WebSocket connections to receive real-time analysis updates from the audio service.

## Acceptance Criteria

- [ ] Connects to WebSocket server
- [ ] Subscribes to analysis jobs
- [ ] Receives and parses analysis chunks
- [ ] Handles reconnection automatically
- [ ] Provides connection status

## Implementation

Create `src/hooks/use-websocket.ts`:

```typescript
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerMessage, AnalysisSegment, SongAnalysis } from '@/lib/analysis/types';

interface UseWebSocketOptions {
  url: string;
  jobId: string;
  onChunk?: (timestamp: number, segment: AnalysisSegment) => void;
  onProgress?: (status: string, progress: number, message: string) => void;
  onComplete?: (analysis: SongAnalysis) => void;
  onError?: (code: string, message: string) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  status: string;
  progress: number;
  error: string | null;
  disconnect: () => void;
}

export function useWebSocket({
  url,
  jobId,
  onChunk,
  onProgress,
  onComplete,
  onError,
}: UseWebSocketOptions): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('connecting');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('subscribe', { job_id: jobId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('progress', (data) => {
      setStatus(data.status);
      setProgress(data.progress);
      onProgress?.(data.status, data.progress, data.message);
    });

    socket.on('chunk', (data) => {
      onChunk?.(data.timestamp, data.segment);
    });

    socket.on('complete', (data) => {
      setStatus('complete');
      setProgress(100);
      onComplete?.(data.analysis);
    });

    socket.on('error', (data) => {
      setError(data.message);
      setStatus('error');
      onError?.(data.code, data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, jobId, onChunk, onProgress, onComplete, onError]);

  return { isConnected, status, progress, error, disconnect };
}
```

Install socket.io-client:

```bash
npm install socket.io-client
```

## Files to Create

| File | Description |
|------|-------------|
| `src/hooks/use-websocket.ts` | WebSocket hook |

## Testing

- [ ] Connects to WebSocket server
- [ ] Receives progress updates
- [ ] Receives analysis chunks
- [ ] Handles disconnection

---

_Task 15 of 28 - neuro-acoustic-analyzer_
