# Task 19: Build FrequencySpectrum Component

> **Phase**: 4 - Visualization
> **Complexity**: Medium
> **Dependencies**: Tasks 02, 16
> **Status**: Pending

## Description

Create a frequency spectrum visualization that displays the audio frequency distribution as animated bars, showing bass, mid, and treble ranges.

## Acceptance Criteria

- [ ] Displays frequency bars (32-64 bands)
- [ ] Animates smoothly with analysis updates
- [ ] Shows frequency labels (Hz)
- [ ] Color gradient from bass (warm) to treble (cool)
- [ ] Responsive sizing
- [ ] Shows current frequency range touched

## Implementation

Create `src/components/visualizations/frequency-spectrum.tsx`:

```typescript
'use client';

import { useMemo } from 'react';

interface FrequencySpectrumProps {
  frequencies: number[]; // Array of frequency magnitudes (0-1)
  sampleRate?: number;
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
  // Gradient: bass (orange/red) -> mid (green/yellow) -> treble (blue/purple)
  const position = index / total;
  if (position < 0.33) {
    // Bass: warm colors
    const hue = 0 + (position * 3) * 30; // 0-30 (red to orange)
    return `hsl(${hue}, 80%, 50%)`;
  } else if (position < 0.66) {
    // Mid: yellow to green
    const hue = 30 + ((position - 0.33) * 3) * 60; // 30-90
    return `hsl(${hue}, 80%, 50%)`;
  } else {
    // Treble: cyan to purple
    const hue = 180 + ((position - 0.66) * 3) * 90; // 180-270
    return `hsl(${hue}, 80%, 50%)`;
  }
}

export function FrequencySpectrum({
  frequencies,
  sampleRate = 44100,
  className = '',
}: FrequencySpectrumProps) {
  // Calculate frequency range statistics
  const stats = useMemo(() => {
    if (!frequencies.length) return { min: 0, max: 0, peak: 0, peakIndex: 0 };

    let peakIndex = 0;
    let peak = 0;
    frequencies.forEach((mag, i) => {
      if (mag > peak) {
        peak = mag;
        peakIndex = i;
      }
    });

    const binWidth = sampleRate / (frequencies.length * 2);
    const peakFreq = peakIndex * binWidth;

    return {
      min: 20,
      max: sampleRate / 2,
      peak: peakFreq,
      peakIndex,
    };
  }, [frequencies, sampleRate]);

  const barCount = frequencies.length || 64;
  const barWidth = 100 / barCount;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Spectrum display */}
      <div className="relative h-32 bg-gray-900 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {frequencies.map((magnitude, index) => {
            const height = Math.max(magnitude * 100, 1);
            const x = index * barWidth;
            const color = getBarColor(index, barCount);

            return (
              <rect
                key={index}
                x={x}
                y={100 - height}
                width={barWidth * 0.8}
                height={height}
                fill={color}
                className="transition-all duration-75"
                style={{
                  filter: magnitude > 0.7 ? `drop-shadow(0 0 3px ${color})` : 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Frequency grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          {FREQUENCY_LABELS.map(({ freq, label }) => {
            // Calculate position based on logarithmic scale
            const logMin = Math.log10(20);
            const logMax = Math.log10(sampleRate / 2);
            const logFreq = Math.log10(freq);
            const position = ((logFreq - logMin) / (logMax - logMin)) * 100;

            if (position < 0 || position > 100) return null;

            return (
              <div
                key={freq}
                className="absolute top-0 h-full border-l border-gray-700"
                style={{ left: `${position}%` }}
              >
                <span className="absolute bottom-0 text-[8px] text-gray-500 transform -translate-x-1/2">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Bass</span>
        <span className="text-cyan-400">
          Peak: {stats.peak > 1000 ? `${(stats.peak / 1000).toFixed(1)}kHz` : `${stats.peak.toFixed(0)}Hz`}
        </span>
        <span>Treble</span>
      </div>
    </div>
  );
}
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/visualizations/frequency-spectrum.tsx` | Frequency spectrum component |

## Testing

- [ ] Bars render correctly for various frequency data
- [ ] Colors gradient from bass to treble
- [ ] Peak frequency displays correctly
- [ ] Responsive on different screen sizes
- [ ] Smooth animations on data updates

---

_Task 19 of 28 - neuro-acoustic-analyzer_
