'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AnalysisProvider, useAnalysis } from '@/providers/analysis-provider';
import { AnalysisPanel } from '@/components/analysis-panel';
import { useWebSocket } from '@/hooks/use-websocket';
import type { AnalysisSegment, SongAnalysis } from '@/lib/analysis/types';

const AUDIO_SERVICE_URL = process.env.NEXT_PUBLIC_AUDIO_SERVICE_URL || 'http://localhost:8000';

function AnalysisOrchestrator({ videoId, youtubeUrl }: { videoId: string; youtubeUrl: string | null }) {
  const {
    setStatus,
    setProgress,
    setError,
    addSegment,
    setAnalysis,
    status,
  } = useAnalysis();

  const [jobId, setJobId] = useState<string | null>(null);
  const analysisStarted = useRef(false);

  // Fetch cached analysis for completed jobs
  const fetchCachedAnalysis = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`${AUDIO_SERVICE_URL}/api/job/${jobId}/analysis`);
      if (response.ok) {
        const analysis = await response.json();
        setAnalysis(analysis);
        return true;
      }
    } catch (err) {
      console.error('Failed to fetch cached analysis:', err);
    }
    return false;
  }, [setAnalysis]);

  // Start analysis when component mounts
  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    const startAnalysis = async () => {
      setStatus('pending');
      setProgress(0);

      try {
        const url = youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ youtubeUrl: url }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to start analysis');
        }

        const data = await response.json();
        setJobId(data.job_id);

        // If job is already complete, fetch the cached analysis
        if (data.status === 'complete') {
          setStatus('analyzing');
          setProgress(99);
          const success = await fetchCachedAnalysis(data.job_id);
          if (!success) {
            // If we can't get cached data, delete the job and retry
            await fetch(`${AUDIO_SERVICE_URL}/api/job/${data.job_id}`, { method: 'DELETE' });
            analysisStarted.current = false;
            // Trigger re-analysis
            window.location.reload();
          }
        } else {
          setStatus('extracting');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start analysis');
      }
    };

    startAnalysis();
  }, [videoId, youtubeUrl, setStatus, setProgress, setError, fetchCachedAnalysis]);

  // Handle WebSocket events
  const handleProgress = useCallback((wsStatus: string, progress: number, message: string) => {
    if (wsStatus === 'extracting') {
      setStatus('extracting');
    } else if (wsStatus === 'analyzing') {
      setStatus('analyzing');
    }
    setProgress(progress);
  }, [setStatus, setProgress]);

  const handleChunk = useCallback((timestamp: number, segment: AnalysisSegment) => {
    addSegment(segment);
  }, [addSegment]);

  const handleComplete = useCallback((analysis: SongAnalysis) => {
    setAnalysis(analysis);
  }, [setAnalysis]);

  const handleError = useCallback((code: string, message: string) => {
    setError(message);
  }, [setError]);

  // Connect to WebSocket when we have a jobId
  useWebSocket({
    url: AUDIO_SERVICE_URL,
    jobId: jobId || '',
    onProgress: handleProgress,
    onChunk: handleChunk,
    onComplete: handleComplete,
    onError: handleError,
  });

  return <AnalysisPanel videoId={videoId} />;
}

export default function AnalyzePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const videoId = params.videoId as string;
  const url = searchParams.get('url');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Analyzing Video
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-300 mb-2">
            Video ID: <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">{videoId}</code>
          </p>
          {url && (
            <p className="text-gray-300 mb-6">
              URL: <code className="bg-gray-800 px-2 py-1 rounded text-sm text-gray-400">{url}</code>
            </p>
          )}

          <AnalysisProvider>
            <AnalysisOrchestrator videoId={videoId} youtubeUrl={url} />
          </AnalysisProvider>
        </div>
      </div>
    </div>
  );
}
