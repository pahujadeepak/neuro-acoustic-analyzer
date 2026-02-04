# Task 18: Build BrainDiagram Component

> **Phase**: 4 - Visualization
> **Complexity**: Large
> **Dependencies**: Tasks 02, 03, 16
> **Status**: Pending

## Description

Create an SVG-based brain visualization component that highlights active brain regions based on analysis data. Each region should light up with varying intensity based on activation levels.

## Acceptance Criteria

- [ ] SVG brain outline with labeled regions
- [ ] Dynamic highlighting based on activation levels
- [ ] Color intensity reflects activation strength (0-1)
- [ ] Smooth transitions between states
- [ ] Hover tooltips showing region details
- [ ] Responsive sizing

## Implementation

Create `src/components/visualizations/brain-diagram.tsx`:

```typescript
'use client';

import { useMemo } from 'react';
import { BRAIN_REGIONS } from '@/lib/constants';
import type { BrainRegion, BrainRegionActivation } from '@/lib/analysis/types';

interface BrainDiagramProps {
  activations: BrainRegionActivation[];
  className?: string;
}

// SVG path data for brain regions (simplified representations)
const REGION_PATHS: Record<BrainRegion, { path: string; cx: number; cy: number }> = {
  auditory_cortex: {
    path: 'M 180 120 Q 200 100 220 120 Q 240 140 220 160 Q 200 180 180 160 Q 160 140 180 120',
    cx: 200,
    cy: 140,
  },
  prefrontal_cortex: {
    path: 'M 80 80 Q 120 40 160 80 Q 140 120 120 120 Q 100 120 80 80',
    cx: 120,
    cy: 90,
  },
  amygdala: {
    path: 'M 140 180 Q 150 170 160 180 Q 170 190 160 200 Q 150 210 140 200 Q 130 190 140 180',
    cx: 150,
    cy: 190,
  },
  hippocampus: {
    path: 'M 170 190 Q 185 180 200 190 Q 215 200 200 210 Q 185 220 170 210 Q 155 200 170 190',
    cx: 185,
    cy: 200,
  },
  motor_cortex: {
    path: 'M 100 60 Q 130 30 160 60 Q 140 80 130 80 Q 120 80 100 60',
    cx: 130,
    cy: 60,
  },
  nucleus_accumbens: {
    path: 'M 130 160 Q 140 150 150 160 Q 160 170 150 180 Q 140 190 130 180 Q 120 170 130 160',
    cx: 140,
    cy: 170,
  },
  basal_ganglia: {
    path: 'M 150 140 Q 165 130 180 140 Q 195 150 180 160 Q 165 170 150 160 Q 135 150 150 140',
    cx: 165,
    cy: 150,
  },
};

function getActivationColor(activation: number): string {
  // Gradient from dark blue (inactive) to bright cyan (active)
  const hue = 180 + (activation * 30); // 180-210 (cyan range)
  const saturation = 70 + (activation * 30); // 70-100%
  const lightness = 20 + (activation * 50); // 20-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function BrainDiagram({ activations, className = '' }: BrainDiagramProps) {
  const activationMap = useMemo(() => {
    const map = new Map<BrainRegion, number>();
    activations.forEach((a) => map.set(a.region, a.activation));
    return map;
  }, [activations]);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 300 280"
        className="w-full h-full"
        role="img"
        aria-label="Brain region activation diagram"
      >
        {/* Brain outline */}
        <ellipse
          cx="150"
          cy="140"
          rx="130"
          ry="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-600"
        />

        {/* Brain regions */}
        {Object.entries(REGION_PATHS).map(([region, { path, cx, cy }]) => {
          const activation = activationMap.get(region as BrainRegion) || 0;
          const regionInfo = BRAIN_REGIONS[region as BrainRegion];

          return (
            <g key={region} className="cursor-pointer group">
              <path
                d={path}
                fill={getActivationColor(activation)}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-400 transition-all duration-500"
                style={{
                  filter: activation > 0.5 ? `drop-shadow(0 0 ${activation * 10}px ${getActivationColor(activation)})` : 'none',
                }}
              />
              {/* Label */}
              <text
                x={cx}
                y={cy + 30}
                textAnchor="middle"
                className="text-[8px] fill-gray-400 pointer-events-none"
              >
                {regionInfo?.name || region}
              </text>
              {/* Tooltip on hover */}
              <title>
                {regionInfo?.name}: {(activation * 100).toFixed(0)}% active
                {regionInfo?.function ? `\n${regionInfo.function}` : ''}
              </title>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10, 250)">
          <text className="text-[10px] fill-gray-400">Activation:</text>
          <rect x="60" y="-8" width="40" height="10" fill={getActivationColor(0)} />
          <rect x="100" y="-8" width="40" height="10" fill={getActivationColor(0.5)} />
          <rect x="140" y="-8" width="40" height="10" fill={getActivationColor(1)} />
          <text x="60" y="10" className="text-[8px] fill-gray-500">Low</text>
          <text x="180" y="10" className="text-[8px] fill-gray-500">High</text>
        </g>
      </svg>
    </div>
  );
}
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/visualizations/brain-diagram.tsx` | Brain visualization component |

## Testing

- [ ] All regions render correctly
- [ ] Activation colors update smoothly
- [ ] Hover tooltips display region info
- [ ] Responsive on different screen sizes
- [ ] Accessible with screen readers

---

_Task 18 of 28 - neuro-acoustic-analyzer_
