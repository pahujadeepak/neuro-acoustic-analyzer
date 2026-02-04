'use client';

import { useMemo } from 'react';
import { BRAINWAVES } from '@/lib/analysis/constants';
import type { BrainwaveState, BrainwaveType } from '@/lib/analysis/types';

interface BrainwaveChartProps {
  brainwaves: BrainwaveState | null;
  className?: string;
}

const WAVE_COLORS: Record<BrainwaveType, string> = {
  delta: '#8B5CF6',
  theta: '#3B82F6',
  alpha: '#10B981',
  beta: '#F59E0B',
  gamma: '#EF4444',
};

const WAVE_ORDER: BrainwaveType[] = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

export function BrainwaveChart({ brainwaves, className = '' }: BrainwaveChartProps) {
  const activityMap = useMemo(() => {
    if (!brainwaves) return new Map<BrainwaveType, number>();
    return new Map<BrainwaveType, number>([
      ['delta', brainwaves.delta],
      ['theta', brainwaves.theta],
      ['alpha', brainwaves.alpha],
      ['beta', brainwaves.beta],
      ['gamma', brainwaves.gamma],
    ]);
  }, [brainwaves]);

  const dominantWave = useMemo(() => {
    let maxIntensity = 0;
    let dominant: BrainwaveType = 'alpha';
    activityMap.forEach((intensity, state) => {
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        dominant = state;
      }
    });
    return dominant;
  }, [activityMap]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Brainwave Activity</h3>
        <span className="text-xs text-gray-500">
          Dominant: <span style={{ color: WAVE_COLORS[dominantWave] }} className="font-medium">
            {BRAINWAVES[dominantWave]?.name || dominantWave}
          </span>
        </span>
      </div>

      <div className="space-y-2">
        {WAVE_ORDER.map((state) => {
          const intensity = activityMap.get(state) || 0;
          const info = BRAINWAVES[state];
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

              <div className="hidden group-hover:block text-xs text-gray-500 mt-1">
                {info?.description || `${state} waves`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 h-12 bg-gray-900 rounded overflow-hidden">
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {WAVE_ORDER.map((state) => {
            const intensity = activityMap.get(state) || 0;
            const color = WAVE_COLORS[state];
            const yOffset = 20;
            const amplitude = intensity * 15;
            const freqMultiplier = WAVE_ORDER.indexOf(state) + 1;

            let path = `M 0 ${yOffset}`;
            for (let x = 0; x <= 200; x += 2) {
              const y = yOffset + Math.sin((x / 200) * Math.PI * freqMultiplier * 2) * amplitude;
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
