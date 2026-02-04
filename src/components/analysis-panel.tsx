'use client';

import { useCallback } from 'react';
import { useAnalysis } from '@/providers/analysis-provider';
import { VideoPlayer } from '@/components/video-player';
import { Brain2D } from '@/components/visualizations/brain-2d';
import { FrequencySpectrum } from '@/components/visualizations/frequency-spectrum';
import { BrainwaveChart } from '@/components/visualizations/brainwave-chart';
import { EmotionBadge } from '@/components/visualizations/emotion-badge';
import { TimelineSlider } from '@/components/visualizations/timeline-slider';

interface AnalysisPanelProps {
  videoId: string;
}

export function AnalysisPanel({ videoId }: AnalysisPanelProps) {
  const {
    status,
    progress,
    segments,
    currentTime,
    duration,
    currentSegment,
    error,
    setCurrentTime,
  } = useAnalysis();

  // Stabilize callback to prevent player recreation
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, [setCurrentTime]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, [setCurrentTime]);

  if (status === 'pending' || status === 'extracting' || status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-300">
            {status === 'pending' ? 'Starting analysis...' :
             status === 'extracting' ? 'Extracting audio...' : 'Analyzing audio features...'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This may take a moment
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-6xl">X</div>
        <div className="text-center">
          <p className="text-red-400 font-medium">Analysis Failed</p>
          <p className="text-sm text-gray-500 mt-1">{error || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  if (!currentSegment && segments.length === 0 && status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-600 text-6xl">M</div>
        <p className="text-gray-500">Waiting for analysis data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        <VideoPlayer
          videoId={videoId}
          onTimeUpdate={handleTimeUpdate}
          className="w-full"
        />
      </div>

      {/* Timeline - Positioned right below video for easy scrubbing */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Timeline
          <span className="ml-2 text-xs text-gray-500">
            (hover for second-by-second analysis)
          </span>
        </h3>
        <TimelineSlider
          currentTime={currentTime}
          duration={duration}
          segments={segments}
          onSeek={handleSeek}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Segments Analyzed"
          value={segments.length.toString()}
          unit=""
        />
        <StatCard
          label="Progress"
          value={progress.toString()}
          unit="%"
        />
        <StatCard
          label="Current Time"
          value={formatTime(currentTime)}
          unit=""
        />
        <StatCard
          label="Duration"
          value={formatTime(duration)}
          unit=""
        />
      </div>

      {/* Brain Activity Visualization */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-4">
          Brain Activity Map
          <span className="ml-2 text-xs text-gray-500">
            (lateral view - colors show activation intensity)
          </span>
        </h3>
        <Brain2D activations={currentSegment?.brainRegions || null} />
      </div>

      {/* Analysis Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emotional State */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Emotional State</h3>
          <EmotionBadge emotion={currentSegment?.emotion || null} />
        </div>

        {/* Brainwave Activity */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <BrainwaveChart brainwaves={currentSegment?.brainwaves || null} />
        </div>

        {/* Frequency Spectrum */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Frequency Spectrum</h3>
          <FrequencySpectrum frequencies={currentSegment?.frequencies || null} />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-cyan-400">
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
