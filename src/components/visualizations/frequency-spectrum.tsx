'use client';

import { useMemo } from 'react';
import type { FrequencyBands } from '@/lib/analysis/types';

interface FrequencySpectrumProps {
  frequencies: FrequencyBands | null;
  className?: string;
}

const FREQUENCY_LABELS = [
  { freq: 60, label: '60Hz' },
  { freq: 250, label: '250Hz' },
  { freq: 1000, label: '1kHz' },
  { freq: 4000, label: '4kHz' },
  { freq: 16000, label: '16kHz' },
];

function getBarColor(index: number, total: number): string {
  const position = index / total;
  if (position < 0.33) {
    const hue = 0 + (position * 3) * 30;
    return `hsl(${hue}, 80%, 50%)`;
  } else if (position < 0.66) {
    const hue = 30 + ((position - 0.33) * 3) * 60;
    return `hsl(${hue}, 80%, 50%)`;
  } else {
    const hue = 180 + ((position - 0.66) * 3) * 90;
    return `hsl(${hue}, 80%, 50%)`;
  }
}

export function FrequencySpectrum({
  frequencies,
  className = '',
}: FrequencySpectrumProps) {
  const bands = useMemo(() => {
    if (!frequencies) return [0, 0, 0, 0, 0];
    return [
      frequencies.bass,
      frequencies.lowMid,
      frequencies.mid,
      frequencies.highMid,
      frequencies.high,
    ];
  }, [frequencies]);

  const peakIndex = useMemo(() => {
    let max = 0;
    let idx = 0;
    bands.forEach((v, i) => {
      if (v > max) {
        max = v;
        idx = i;
      }
    });
    return idx;
  }, [bands]);

  const bandLabels = ['Bass', 'Low Mid', 'Mid', 'High Mid', 'Treble'];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative h-32 bg-gray-900 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {bands.map((magnitude, index) => {
            const height = Math.max(magnitude * 100, 2);
            const barWidth = 100 / bands.length;
            const x = index * barWidth;
            const color = getBarColor(index, bands.length);

            return (
              <rect
                key={index}
                x={x + barWidth * 0.1}
                y={100 - height}
                width={barWidth * 0.8}
                height={height}
                fill={color}
                className="transition-all duration-150"
                style={{
                  filter: magnitude > 0.7 ? `drop-shadow(0 0 3px ${color})` : 'none',
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        {bandLabels.map((label, i) => (
          <span key={label} className={i === peakIndex ? 'text-cyan-400 font-medium' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
