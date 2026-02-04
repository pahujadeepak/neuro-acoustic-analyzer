'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { EMOTIONS, BRAINWAVES } from '@/lib/analysis/constants';
import type { AnalysisSegment, EmotionCategory, BrainwaveType } from '@/lib/analysis/types';

interface TimelineSliderProps {
  currentTime: number;
  duration: number;
  segments: AnalysisSegment[];
  onSeek: (time: number) => void;
  className?: string;
}

const EMOTION_COLORS: Record<EmotionCategory, string> = {
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

const BRAINWAVE_COLORS: Record<BrainwaveType, string> = {
  delta: '#8B5CF6',
  theta: '#3B82F6',
  alpha: '#10B981',
  beta: '#F59E0B',
  gamma: '#EF4444',
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Detailed hover tooltip component
function SegmentTooltip({ segment, time }: { segment: AnalysisSegment; time: number }) {
  const emotionInfo = EMOTIONS[segment.emotion?.primary as EmotionCategory];
  const emotionColor = EMOTION_COLORS[segment.emotion?.primary as EmotionCategory] || '#666';

  // Find dominant brainwave
  const brainwaves = segment.brainwaves;
  let dominantWave: BrainwaveType = 'alpha';
  let maxWave = 0;
  if (brainwaves) {
    (Object.entries(brainwaves) as [BrainwaveType, number][]).forEach(([wave, value]) => {
      if (value > maxWave) {
        maxWave = value;
        dominantWave = wave;
      }
    });
  }

  // Get top brain regions
  const brainRegions = segment.brainRegions;
  const topRegions = brainRegions
    ? Object.entries(brainRegions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
    : [];

  const regionNames: Record<string, string> = {
    auditoryCortex: 'Auditory',
    amygdala: 'Amygdala',
    hippocampus: 'Hippocampus',
    nucleusAccumbens: 'Reward',
    motorCortex: 'Motor',
    prefrontalCortex: 'Prefrontal',
    basalGanglia: 'Rhythm',
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[220px] text-left">
      {/* Header with time */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
        <span className="text-white font-medium">{formatTime(time)}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xl">{emotionInfo?.emoji || '🎵'}</span>
          <span className="text-sm capitalize" style={{ color: emotionColor }}>
            {segment.emotion?.primary || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Frequencies */}
      <div className="mb-2">
        <div className="text-[10px] text-gray-500 uppercase mb-1">Frequencies</div>
        <div className="flex gap-1 h-4">
          {segment.frequencies && (
            <>
              <div
                className="flex-1 rounded-sm"
                style={{ backgroundColor: '#EF4444', opacity: segment.frequencies.bass }}
                title={`Bass: ${Math.round(segment.frequencies.bass * 100)}%`}
              />
              <div
                className="flex-1 rounded-sm"
                style={{ backgroundColor: '#F97316', opacity: segment.frequencies.lowMid }}
                title={`Low Mid: ${Math.round(segment.frequencies.lowMid * 100)}%`}
              />
              <div
                className="flex-1 rounded-sm"
                style={{ backgroundColor: '#EAB308', opacity: segment.frequencies.mid }}
                title={`Mid: ${Math.round(segment.frequencies.mid * 100)}%`}
              />
              <div
                className="flex-1 rounded-sm"
                style={{ backgroundColor: '#22C55E', opacity: segment.frequencies.highMid }}
                title={`High Mid: ${Math.round(segment.frequencies.highMid * 100)}%`}
              />
              <div
                className="flex-1 rounded-sm"
                style={{ backgroundColor: '#3B82F6', opacity: segment.frequencies.high }}
                title={`High: ${Math.round(segment.frequencies.high * 100)}%`}
              />
            </>
          )}
        </div>
        <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
          <span>Bass</span>
          <span>Treble</span>
        </div>
      </div>

      {/* Brainwaves */}
      <div className="mb-2">
        <div className="text-[10px] text-gray-500 uppercase mb-1">
          Brainwaves
          <span className="ml-2 text-gray-400">
            (Dominant: <span style={{ color: BRAINWAVE_COLORS[dominantWave] }}>{BRAINWAVES[dominantWave]?.name}</span>)
          </span>
        </div>
        <div className="flex gap-0.5">
          {brainwaves && (Object.entries(brainwaves) as [BrainwaveType, number][]).map(([wave, value]) => (
            <div key={wave} className="flex-1">
              <div
                className="h-6 rounded-sm transition-all"
                style={{
                  backgroundColor: BRAINWAVE_COLORS[wave],
                  height: `${value * 24}px`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
          <span>δ</span>
          <span>θ</span>
          <span>α</span>
          <span>β</span>
          <span>γ</span>
        </div>
      </div>

      {/* Top Brain Regions */}
      <div>
        <div className="text-[10px] text-gray-500 uppercase mb-1">Active Brain Regions</div>
        <div className="space-y-1">
          {topRegions.map(([region, value]) => (
            <div key={region} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-16">{regionNames[region] || region}</span>
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${(value as number) * 100}%` }}
                />
              </div>
              <span className="text-xs text-cyan-400 w-8 text-right">
                {Math.round((value as number) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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

      // Position tooltip above the cursor
      setHoverPosition({
        x: e.clientX - rect.left,
        y: rect.top,
      });

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
    setHoverPosition(null);
    setIsDragging(false);
  }, []);

  const hoverSegment = hoverTime !== null ? getSegmentAtTime(hoverTime) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        {currentSegment && (
          <span className="text-gray-500 capitalize">
            {EMOTIONS[currentSegment.emotion?.primary as EmotionCategory]?.emoji || '🎵'}{' '}
            {currentSegment.emotion?.primary || 'Analyzing...'}
          </span>
        )}
        <span>{formatTime(duration)}</span>
      </div>

      <div className="relative">
        {/* Hover tooltip */}
        {hoverTime !== null && hoverSegment && hoverPosition && (
          <div
            className="absolute z-50 bottom-full mb-3 pointer-events-none"
            style={{
              left: `${(hoverTime / duration) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <SegmentTooltip segment={hoverSegment} time={hoverTime} />
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #374151',
              }}
            />
          </div>
        )}

        <div
          ref={trackRef}
          className="relative h-10 bg-gray-900 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Segment colors */}
          {segments.map((segment, index) => {
            const left = duration > 0 ? (segment.startTime / duration) * 100 : 0;
            const width = duration > 0 ? ((segment.endTime - segment.startTime) / duration) * 100 : 0;
            const emotion = segment.emotion?.primary || 'calm';
            const color = EMOTION_COLORS[emotion as EmotionCategory];

            return (
              <div
                key={index}
                className="absolute top-0 h-full opacity-60 hover:opacity-80 transition-opacity"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: color,
                }}
              />
            );
          })}

          {/* Progress overlay */}
          <div
            className="absolute top-0 h-full bg-white/20 pointer-events-none"
            style={{ width: `${progress}%` }}
          />

          {/* Current position indicator */}
          <div
            className="absolute top-0 h-full w-1 bg-white shadow-lg shadow-white/50 pointer-events-none transition-all duration-100"
            style={{ left: `${progress}%` }}
          />

          {/* Hover indicator */}
          {hoverTime !== null && (
            <div
              className="absolute top-0 h-full w-0.5 bg-gray-400/50 pointer-events-none"
              style={{ left: `${(hoverTime / duration) * 100}%` }}
            />
          )}

          {/* Segment dividers */}
          {segments.map((segment, index) => {
            if (index === 0) return null;
            const position = duration > 0 ? (segment.startTime / duration) * 100 : 0;
            return (
              <div
                key={`marker-${index}`}
                className="absolute top-0 h-full w-px bg-gray-700/50 pointer-events-none"
                style={{ left: `${position}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Emotion legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(EMOTION_COLORS)
          .filter(([emotion]) => segments.some((s) => s.emotion?.primary === emotion))
          .slice(0, 8)
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
