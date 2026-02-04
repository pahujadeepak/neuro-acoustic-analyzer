# Task 22: Build TimelineSlider Component

> **Phase**: 4 - Visualization
> **Complexity**: Medium
> **Dependencies**: Tasks 02, 16
> **Status**: Pending

## Description

Create an interactive timeline slider that allows users to scrub through the song and see analysis data at any point. Shows segment markers and current position.

## Acceptance Criteria

- [ ] Displays full timeline with duration
- [ ] Shows current playback position
- [ ] Allows scrubbing to any position
- [ ] Displays segment markers
- [ ] Shows time in MM:SS format
- [ ] Color-coded segments by emotion
- [ ] Syncs with video playback

## Implementation

Create `src/components/visualizations/timeline-slider.tsx`:

```typescript
'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { EMOTIONS } from '@/lib/constants';
import type { AnalysisSegment, EmotionType } from '@/lib/analysis/types';

interface TimelineSliderProps {
  currentTime: number;
  duration: number;
  segments: AnalysisSegment[];
  onSeek: (time: number) => void;
  className?: string;
}

const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#EAB308',
  sad: '#3B82F6',
  angry: '#EF4444',
  calm: '#22C55E',
  excited: '#F97316',
  fearful: '#A855F7',
  energetic: '#F59E0B',
  melancholic: '#6366F1',
  uplifting: '#06B6D4',
  tense: '#F43F5E',
  peaceful: '#14B8A6',
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TimelineSlider({
  currentTime,
  duration,
  segments,
  onSeek,
  className = '',
}: TimelineSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Find segment at given time
  const getSegmentAtTime = useCallback(
    (time: number) => {
      return segments.find((s) => s.startTime <= time && s.endTime > time);
    },
    [segments]
  );

  const currentSegment = useMemo(
    () => getSegmentAtTime(currentTime),
    [currentTime, getSegmentAtTime]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || duration <= 0) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;
      onSeek(newTime);
    },
    [duration, onSeek]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || duration <= 0) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      setHoverTime(percentage * duration);

      if (isDragging) {
        onSeek(percentage * duration);
      }
    },
    [duration, isDragging, onSeek]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    setIsDragging(false);
  }, []);

  const hoverSegment = hoverTime !== null ? getSegmentAtTime(hoverTime) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        {currentSegment && (
          <span className="text-gray-500">
            {currentSegment.emotion?.primary?.emotion || 'Analyzing...'}
          </span>
        )}
        <span>{formatTime(duration)}</span>
      </div>

      {/* Timeline track */}
      <div
        ref={trackRef}
        className="relative h-8 bg-gray-900 rounded-lg cursor-pointer overflow-hidden"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Segment colors */}
        {segments.map((segment, index) => {
          const left = (segment.startTime / duration) * 100;
          const width = ((segment.endTime - segment.startTime) / duration) * 100;
          const emotion = segment.emotion?.primary?.emotion || 'calm';
          const color = EMOTION_COLORS[emotion];

          return (
            <div
              key={index}
              className="absolute top-0 h-full opacity-50 transition-opacity hover:opacity-70"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: color,
              }}
            />
          );
        })}

        {/* Progress fill */}
        <div
          className="absolute top-0 h-full bg-white/20 pointer-events-none"
          style={{ width: `${progress}%` }}
        />

        {/* Current position indicator */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white shadow-lg shadow-white/50 pointer-events-none transition-all duration-100"
          style={{ left: `${progress}%` }}
        />

        {/* Hover indicator */}
        {hoverTime !== null && (
          <>
            <div
              className="absolute top-0 h-full w-0.5 bg-gray-400 pointer-events-none"
              style={{ left: `${(hoverTime / duration) * 100}%` }}
            />
            {/* Hover tooltip */}
            <div
              className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 rounded text-xs text-white pointer-events-none transform -translate-x-1/2"
              style={{ left: `${(hoverTime / duration) * 100}%` }}
            >
              {formatTime(hoverTime)}
              {hoverSegment?.emotion?.primary && (
                <span className="ml-2 capitalize">
                  {hoverSegment.emotion.primary.emotion}
                </span>
              )}
            </div>
          </>
        )}

        {/* Segment markers */}
        {segments.map((segment, index) => {
          if (index === 0) return null;
          const position = (segment.startTime / duration) * 100;
          return (
            <div
              key={`marker-${index}`}
              className="absolute top-0 h-full w-px bg-gray-700 pointer-events-none"
              style={{ left: `${position}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(EMOTION_COLORS)
          .filter(([emotion]) => segments.some((s) => s.emotion?.primary?.emotion === emotion))
          .slice(0, 6)
          .map(([emotion, color]) => (
            <div key={emotion} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-500 capitalize">{emotion}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/visualizations/timeline-slider.tsx` | Interactive timeline component |

## Testing

- [ ] Timeline displays correct duration
- [ ] Current position updates smoothly
- [ ] Click to seek works correctly
- [ ] Drag to scrub works correctly
- [ ] Segment colors match emotions
- [ ] Hover tooltip shows time and emotion
- [ ] Time format is correct (MM:SS)

---

_Task 22 of 28 - neuro-acoustic-analyzer_
