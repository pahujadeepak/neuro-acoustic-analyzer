# Task 23: Build AnalysisPanel Component

> **Phase**: 4 - Visualization
> **Complexity**: Medium
> **Dependencies**: Tasks 16, 17, 18, 19, 20, 21, 22
> **Status**: Pending

## Description

Create the main analysis panel that composes all visualization components together, managing layout and data flow from the analysis context.

## Acceptance Criteria

- [ ] Integrates all visualization components
- [ ] Responsive grid layout
- [ ] Connects to AnalysisProvider context
- [ ] Shows loading state during analysis
- [ ] Displays progress indicator
- [ ] Error state handling

## Implementation

Create `src/components/analysis-panel.tsx`:

```typescript
'use client';

import { useAnalysis } from '@/providers/analysis-provider';
import { VideoPlayer } from '@/components/video-player';
import { BrainDiagram } from '@/components/visualizations/brain-diagram';
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

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Note: Video seeking would need to be implemented via YouTube API
  };

  // Loading state
  if (status === 'loading' || status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"
            style={{
              transform: `rotate(${progress * 3.6}deg)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-300">
            {status === 'loading' ? 'Preparing analysis...' : 'Analyzing audio...'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {status === 'analyzing' && 'Extracting audio features and mapping brain regions'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <div className="text-center">
          <p className="text-red-400 font-medium">Analysis Failed</p>
          <p className="text-sm text-gray-500 mt-1">{error || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  // No data yet
  if (!currentSegment && segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-600 text-6xl">🎵</div>
        <p className="text-gray-500">Waiting for analysis data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video */}
        <div>
          <VideoPlayer
            videoId={videoId}
            onTimeUpdate={handleTimeUpdate}
            className="w-full"
          />
        </div>

        {/* Brain Diagram */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Brain Activity</h3>
          <BrainDiagram
            activations={currentSegment?.brainRegions || []}
            className="h-64"
          />
        </div>
      </div>

      {/* Visualization Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Emotion */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Emotional State</h3>
          {currentSegment?.emotion?.primary ? (
            <EmotionBadge
              primary={currentSegment.emotion.primary}
              secondary={currentSegment.emotion.secondary}
            />
          ) : (
            <div className="text-gray-500 text-sm">No emotion data</div>
          )}
        </div>

        {/* Brainwaves */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <BrainwaveChart
            activities={currentSegment?.brainwaves || []}
          />
        </div>

        {/* Frequency Spectrum */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Frequency Spectrum</h3>
          <FrequencySpectrum
            frequencies={currentSegment?.audioFeatures?.frequencyBands || []}
          />
        </div>
      </div>

      {/* Audio Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Tempo"
          value={currentSegment?.audioFeatures?.tempo?.toFixed(0) || '--'}
          unit="BPM"
        />
        <StatCard
          label="Energy"
          value={((currentSegment?.audioFeatures?.energy || 0) * 100).toFixed(0)}
          unit="%"
        />
        <StatCard
          label="Key"
          value={currentSegment?.audioFeatures?.key || '--'}
          unit=""
        />
        <StatCard
          label="Mode"
          value={currentSegment?.audioFeatures?.mode || '--'}
          unit=""
        />
      </div>

      {/* Timeline */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <TimelineSlider
          currentTime={currentTime}
          duration={duration}
          segments={segments}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
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
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/analysis-panel.tsx` | Main analysis panel component |

## Testing

- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] All visualizations render when data available
- [ ] Layout is responsive on different screen sizes
- [ ] Stats update with current segment
- [ ] Timeline syncs with playback

---

_Task 23 of 28 - neuro-acoustic-analyzer_
