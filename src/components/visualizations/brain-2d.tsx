'use client';

import { useMemo } from 'react';
import type { BrainRegionActivation } from '@/lib/analysis/types';

interface Brain2DProps {
  activations: BrainRegionActivation | null;
  className?: string;
}

// Lobe colors matching anatomical diagrams
const LOBE_COLORS = {
  frontal: { base: '#F4A460', active: '#FF8C00' },      // Orange
  parietal: { base: '#4AA8D8', active: '#1E90FF' },     // Blue
  temporal: { base: '#FFB6C1', active: '#FF69B4' },     // Pink
  occipital: { base: '#90EE90', active: '#32CD32' },    // Green
  cerebellum: { base: '#DC143C', active: '#FF0000' },   // Red
  brainstem: { base: '#FFD700', active: '#FFA500' },    // Yellow/Gold
};

// Map brain regions to lobes for activation calculation
function getLobeActivation(activations: BrainRegionActivation | null, lobe: string): number {
  if (!activations) return 0.3;

  switch (lobe) {
    case 'frontal':
      return Math.max(activations.prefrontalCortex, activations.motorCortex * 0.7);
    case 'temporal':
      return Math.max(activations.auditoryCortex, activations.hippocampus, activations.amygdala);
    case 'parietal':
      return Math.max(activations.motorCortex * 0.5, activations.basalGanglia * 0.4, 0.3);
    case 'occipital':
      return 0.35; // Visual cortex - baseline
    case 'cerebellum':
      return Math.max(activations.basalGanglia * 0.6, activations.motorCortex * 0.4);
    case 'brainstem':
      return 0.25;
    default:
      return 0.3;
  }
}

function interpolateColor(base: string, active: string, intensity: number): string {
  const parseHex = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const baseColor = parseHex(base);
  const activeColor = parseHex(active);
  const t = Math.min(1, Math.max(0, intensity));

  const r = Math.round(baseColor.r + (activeColor.r - baseColor.r) * t);
  const g = Math.round(baseColor.g + (activeColor.g - baseColor.g) * t);
  const b = Math.round(baseColor.b + (activeColor.b - baseColor.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export function Brain2D({ activations, className = '' }: Brain2DProps) {
  const lobeColors = useMemo(() => {
    const colors: Record<string, string> = {};
    Object.entries(LOBE_COLORS).forEach(([lobe, { base, active }]) => {
      const intensity = getLobeActivation(activations, lobe);
      colors[lobe] = interpolateColor(base, active, intensity);
    });
    return colors;
  }, [activations]);

  const lobeActivations = useMemo(() => {
    return {
      frontal: getLobeActivation(activations, 'frontal'),
      parietal: getLobeActivation(activations, 'parietal'),
      temporal: getLobeActivation(activations, 'temporal'),
      occipital: getLobeActivation(activations, 'occipital'),
      cerebellum: getLobeActivation(activations, 'cerebellum'),
      brainstem: getLobeActivation(activations, 'brainstem'),
    };
  }, [activations]);

  return (
    <div className={`${className}`}>
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Brain SVG */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 400 320"
            className="w-full max-w-[450px] h-auto"
            role="img"
            aria-label="Brain lateral view showing activation levels"
          >
            <defs>
              {/* Glow filter for active regions */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Frontal Lobe - Orange */}
            <path
              d="M 50 180
                 C 40 140, 50 90, 80 60
                 C 110 35, 150 25, 180 30
                 C 200 32, 210 40, 215 55
                 L 200 70
                 C 195 85, 185 100, 175 115
                 L 160 135
                 C 150 150, 140 165, 130 175
                 L 100 190
                 C 80 195, 60 190, 50 180
                 Z"
              fill={lobeColors.frontal}
              stroke="#1a1a1a"
              strokeWidth="2.5"
              style={{ filter: lobeActivations.frontal > 0.6 ? 'url(#glow)' : 'none' }}
            />
            {/* Frontal gyri details */}
            <path
              d="M 70 100 Q 100 90, 130 100
                 M 65 120 Q 95 108, 125 118
                 M 60 145 Q 90 130, 120 142
                 M 80 165 Q 105 155, 125 162"
              stroke="#c47a3a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />

            {/* Parietal Lobe - Blue */}
            <path
              d="M 215 55
                 C 235 45, 270 40, 300 50
                 C 330 60, 350 80, 355 110
                 C 358 130, 350 150, 335 165
                 L 300 175
                 L 260 170
                 L 220 155
                 L 200 130
                 L 190 110
                 L 200 70
                 L 215 55
                 Z"
              fill={lobeColors.parietal}
              stroke="#1a1a1a"
              strokeWidth="2.5"
              style={{ filter: lobeActivations.parietal > 0.6 ? 'url(#glow)' : 'none' }}
            />
            {/* Parietal gyri */}
            <path
              d="M 230 70 Q 270 60, 310 75
                 M 225 95 Q 265 82, 305 95
                 M 220 120 Q 260 105, 300 118
                 M 225 145 Q 260 135, 295 145"
              stroke="#3080a8"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />

            {/* Occipital Lobe - Green */}
            <path
              d="M 335 165
                 C 355 175, 370 195, 375 220
                 C 378 245, 365 270, 340 280
                 C 320 288, 295 285, 275 275
                 L 285 250
                 L 300 220
                 L 320 190
                 L 335 165
                 Z"
              fill={lobeColors.occipital}
              stroke="#1a1a1a"
              strokeWidth="2.5"
              style={{ filter: lobeActivations.occipital > 0.6 ? 'url(#glow)' : 'none' }}
            />
            {/* Occipital gyri */}
            <path
              d="M 340 190 Q 355 210, 350 240
                 M 320 200 Q 335 225, 325 255
                 M 300 215 Q 310 240, 300 265"
              stroke="#228822"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />

            {/* Temporal Lobe - Pink */}
            <path
              d="M 100 190
                 L 130 175
                 C 145 165, 160 160, 180 162
                 L 220 165
                 L 260 170
                 L 300 175
                 L 285 200
                 L 275 230
                 L 275 275
                 C 255 290, 220 295, 180 292
                 C 140 288, 100 275, 75 255
                 C 55 238, 50 215, 55 195
                 C 60 185, 75 185, 100 190
                 Z"
              fill={lobeColors.temporal}
              stroke="#1a1a1a"
              strokeWidth="2.5"
              style={{ filter: lobeActivations.temporal > 0.6 ? 'url(#glow)' : 'none' }}
            />
            {/* Temporal gyri */}
            <path
              d="M 80 210 Q 140 200, 200 205 Q 250 210, 280 220
                 M 75 235 Q 130 225, 190 230 Q 240 235, 275 245
                 M 85 258 Q 140 250, 200 255 Q 245 260, 270 268"
              stroke="#d48090"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />

            {/* Cerebellum - Red */}
            <path
              d="M 275 275
                 L 340 280
                 C 355 285, 365 295, 360 310
                 C 355 325, 335 335, 310 335
                 L 260 332
                 L 220 325
                 C 200 320, 195 305, 205 290
                 C 215 280, 240 275, 275 275
                 Z"
              fill={lobeColors.cerebellum}
              stroke="#1a1a1a"
              strokeWidth="2.5"
              style={{ filter: lobeActivations.cerebellum > 0.6 ? 'url(#glow)' : 'none' }}
            />
            {/* Cerebellum folia pattern */}
            <path
              d="M 230 300 Q 270 295, 310 300 Q 340 305, 350 315
                 M 225 312 Q 265 308, 305 312 Q 335 316, 345 322"
              stroke="#a01020"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />

            {/* Brainstem - Yellow */}
            <path
              d="M 205 290
                 C 195 295, 185 305, 180 320
                 L 175 345
                 C 173 355, 178 360, 190 360
                 L 210 358
                 C 222 356, 228 350, 225 340
                 L 220 315
                 C 218 300, 212 290, 205 290
                 Z"
              fill={lobeColors.brainstem}
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />

            {/* Central sulcus - dividing line between frontal and parietal */}
            <path
              d="M 200 70 C 195 100, 190 130, 195 160"
              stroke="#1a1a1a"
              strokeWidth="3"
              fill="none"
            />

            {/* Lateral sulcus - dividing temporal from frontal/parietal */}
            <path
              d="M 130 175 C 160 168, 200 165, 260 170 C 290 173, 310 178, 320 185"
              stroke="#1a1a1a"
              strokeWidth="3"
              fill="none"
            />

            {/* Labels */}
            <text x="110" y="110" className="text-[11px] font-semibold fill-gray-800">Frontal</text>
            <text x="260" y="100" className="text-[11px] font-semibold fill-gray-800">Parietal</text>
            <text x="330" y="230" className="text-[11px] font-semibold fill-gray-800">Occipital</text>
            <text x="150" y="245" className="text-[11px] font-semibold fill-gray-800">Temporal</text>
            <text x="270" y="318" className="text-[10px] font-semibold fill-gray-100">Cerebellum</text>
          </svg>
        </div>

        {/* Stats Panel */}
        <div className="flex-1 w-full lg:w-auto">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Brain Region Activity</h4>

          {/* Lobe Stats */}
          <div className="space-y-3 mb-4">
            {Object.entries(LOBE_COLORS).map(([lobe, { base }]) => {
              const activation = lobeActivations[lobe as keyof typeof lobeActivations];
              return (
                <div key={lobe} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm border border-gray-600"
                    style={{ backgroundColor: base }}
                  />
                  <span className="text-sm text-gray-300 capitalize w-24">{lobe}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${activation * 100}%`,
                        backgroundColor: base,
                      }}
                    />
                  </div>
                  <span className="text-sm text-cyan-400 w-12 text-right font-medium">
                    {Math.round(activation * 100)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Region Stats */}
          {activations && (
            <>
              <h4 className="text-sm font-medium text-gray-400 mb-3 mt-5">Specific Regions</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Auditory Cortex</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.auditoryCortex * 100)}%</span>
                </div>
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Motor Cortex</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.motorCortex * 100)}%</span>
                </div>
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Prefrontal</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.prefrontalCortex * 100)}%</span>
                </div>
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Amygdala</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.amygdala * 100)}%</span>
                </div>
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Hippocampus</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.hippocampus * 100)}%</span>
                </div>
                <div className="flex justify-between px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Reward Center</span>
                  <span className="text-cyan-400 font-medium">{Math.round(activations.nucleusAccumbens * 100)}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
