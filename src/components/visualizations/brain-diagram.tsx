'use client';

import { useMemo } from 'react';
import { BRAIN_REGIONS } from '@/lib/analysis/constants';
import type { BrainRegionActivation, BrainRegionId } from '@/lib/analysis/types';

interface BrainDiagramProps {
  activations: BrainRegionActivation | null;
  className?: string;
}

const REGION_PATHS: Record<BrainRegionId, { path: string; cx: number; cy: number }> = {
  auditoryCortex: {
    path: 'M 180 120 Q 200 100 220 120 Q 240 140 220 160 Q 200 180 180 160 Q 160 140 180 120',
    cx: 200,
    cy: 140,
  },
  prefrontalCortex: {
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
  motorCortex: {
    path: 'M 100 60 Q 130 30 160 60 Q 140 80 130 80 Q 120 80 100 60',
    cx: 130,
    cy: 60,
  },
  nucleusAccumbens: {
    path: 'M 130 160 Q 140 150 150 160 Q 160 170 150 180 Q 140 190 130 180 Q 120 170 130 160',
    cx: 140,
    cy: 170,
  },
  basalGanglia: {
    path: 'M 150 140 Q 165 130 180 140 Q 195 150 180 160 Q 165 170 150 160 Q 135 150 150 140',
    cx: 165,
    cy: 150,
  },
};

function getActivationColor(activation: number): string {
  const hue = 180 + (activation * 30);
  const saturation = 70 + (activation * 30);
  const lightness = 20 + (activation * 50);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function BrainDiagram({ activations, className = '' }: BrainDiagramProps) {
  const activationMap = useMemo(() => {
    if (!activations) return new Map<BrainRegionId, number>();
    return new Map<BrainRegionId, number>([
      ['auditoryCortex', activations.auditoryCortex],
      ['amygdala', activations.amygdala],
      ['hippocampus', activations.hippocampus],
      ['nucleusAccumbens', activations.nucleusAccumbens],
      ['motorCortex', activations.motorCortex],
      ['prefrontalCortex', activations.prefrontalCortex],
      ['basalGanglia', activations.basalGanglia],
    ]);
  }, [activations]);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 300 280"
        className="w-full h-full"
        role="img"
        aria-label="Brain region activation diagram"
      >
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

        {Object.entries(REGION_PATHS).map(([region, { path, cx, cy }]) => {
          const activation = activationMap.get(region as BrainRegionId) || 0;
          const regionInfo = BRAIN_REGIONS[region as BrainRegionId];

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
              <text
                x={cx}
                y={cy + 30}
                textAnchor="middle"
                className="text-[8px] fill-gray-400 pointer-events-none"
              >
                {regionInfo?.name || region}
              </text>
              <title>
                {regionInfo?.name}: {(activation * 100).toFixed(0)}% active
                {regionInfo?.description ? `\n${regionInfo.description}` : ''}
              </title>
            </g>
          );
        })}

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
