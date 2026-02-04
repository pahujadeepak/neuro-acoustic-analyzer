# Task 20: Build BrainwaveChart Component

> **Phase**: 4 - Visualization
> **Complexity**: Medium
> **Dependencies**: Tasks 02, 03, 16
> **Status**: Pending

## Description

Create a visualization showing predicted brainwave states (Delta, Theta, Alpha, Beta, Gamma) with animated indicators showing the relative strength of each wave type.

## Acceptance Criteria

- [ ] Displays all 5 brainwave categories
- [ ] Shows intensity bars for each wave type
- [ ] Includes frequency range labels
- [ ] Color-coded by wave type
- [ ] Highlights dominant wave state
- [ ] Animated transitions

## Implementation

Create `src/components/visualizations/brainwave-chart.tsx`:

```typescript
'use client';

import { useMemo } from 'react';
import { BRAINWAVE_STATES } from '@/lib/constants';
import type { BrainwaveState, BrainwaveActivity } from '@/lib/analysis/types';

interface BrainwaveChartProps {
  activities: BrainwaveActivity[];
  className?: string;
}

const WAVE_COLORS: Record<BrainwaveState, string> = {
  delta: '#8B5CF6', // Purple
  theta: '#3B82F6', // Blue
  alpha: '#10B981', // Green
  beta: '#F59E0B', // Amber
  gamma: '#EF4444', // Red
};

const WAVE_ORDER: BrainwaveState[] = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

export function BrainwaveChart({ activities, className = '' }: BrainwaveChartProps) {
  const activityMap = useMemo(() => {
    const map = new Map<BrainwaveState, number>();
    activities.forEach((a) => map.set(a.state, a.intensity));
    return map;
  }, [activities]);

  const dominantWave = useMemo(() => {
    let maxIntensity = 0;
    let dominant: BrainwaveState = 'alpha';
    activities.forEach((a) => {
      if (a.intensity > maxIntensity) {
        maxIntensity = a.intensity;
        dominant = a.state;
      }
    });
    return dominant;
  }, [activities]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Brainwave Activity</h3>
        <span className="text-xs text-gray-500">
          Dominant: <span style={{ color: WAVE_COLORS[dominantWave] }} className="font-medium">
            {BRAINWAVE_STATES[dominantWave]?.name || dominantWave}
          </span>
        </span>
      </div>

      <div className="space-y-2">
        {WAVE_ORDER.map((state) => {
          const intensity = activityMap.get(state) || 0;
          const info = BRAINWAVE_STATES[state];
          const color = WAVE_COLORS[state];
          const isDominant = state === dominantWave;

          return (
            <div key={state} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className={`text-xs ${isDominant ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {info?.name || state}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {info?.frequencyRange || ''}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${intensity * 100}%`,
                    backgroundColor: color,
                    boxShadow: isDominant ? `0 0 10px ${color}` : 'none',
                  }}
                />
              </div>

              {/* Tooltip on hover */}
              <div className="hidden group-hover:block text-xs text-gray-500 mt-1">
                {info?.description || `${state} waves`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Wave pattern visualization */}
      <div className="mt-4 h-12 bg-gray-900 rounded overflow-hidden">
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {WAVE_ORDER.map((state, index) => {
            const intensity = activityMap.get(state) || 0;
            const info = BRAINWAVE_STATES[state];
            const frequency = info ? (info.frequencyMin + info.frequencyMax) / 2 : 10;
            const color = WAVE_COLORS[state];
            const yOffset = 20;
            const amplitude = intensity * 15;

            // Generate sine wave path
            let path = `M 0 ${yOffset}`;
            for (let x = 0; x <= 200; x += 2) {
              const y = yOffset + Math.sin((x / 200) * Math.PI * frequency * 0.5) * amplitude;
              path += ` L ${x} ${y}`;
            }

            return (
              <path
                key={state}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity={intensity * 0.8 + 0.2}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/visualizations/brainwave-chart.tsx` | Brainwave activity chart |

## Testing

- [ ] All 5 wave types display correctly
- [ ] Intensity bars animate smoothly
- [ ] Dominant wave is highlighted
- [ ] Wave pattern visualization matches intensities
- [ ] Hover tooltips show descriptions

---

_Task 20 of 28 - neuro-acoustic-analyzer_
