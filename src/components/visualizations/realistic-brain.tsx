'use client';

import { useMemo } from 'react';
import type { BrainRegionActivation } from '@/lib/analysis/types';

interface RealisticBrainProps {
  activations: BrainRegionActivation | null;
  className?: string;
}

// Map our brain regions to anatomical lobes
const REGION_TO_LOBE: Record<string, string[]> = {
  prefrontalCortex: ['frontal'],
  motorCortex: ['frontal', 'parietal'],
  auditoryCortex: ['temporal'],
  hippocampus: ['temporal'],
  amygdala: ['temporal'],
  basalGanglia: ['subcortical'],
  nucleusAccumbens: ['subcortical'],
};

// Lobe colors (matching anatomical diagrams)
const LOBE_COLORS = {
  frontal: { base: '#FFB6C1', active: '#FF69B4' },      // Pink
  parietal: { base: '#90EE90', active: '#32CD32' },     // Green
  temporal: { base: '#87CEEB', active: '#1E90FF' },     // Blue
  occipital: { base: '#DDA0DD', active: '#9932CC' },    // Purple
  cerebellum: { base: '#F4A460', active: '#FF8C00' },   // Orange
  subcortical: { base: '#FFD700', active: '#FFA500' },  // Gold
  brainstem: { base: '#D2B48C', active: '#CD853F' },    // Tan
};

function getLobeActivation(activations: BrainRegionActivation | null, lobe: string): number {
  if (!activations) return 0;

  let total = 0;
  let count = 0;

  Object.entries(REGION_TO_LOBE).forEach(([region, lobes]) => {
    if (lobes.includes(lobe)) {
      const value = activations[region as keyof BrainRegionActivation];
      if (typeof value === 'number') {
        total += value;
        count++;
      }
    }
  });

  return count > 0 ? total / count : 0;
}

function interpolateColor(base: string, active: string, intensity: number): string {
  // Parse hex colors
  const parseHex = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const baseColor = parseHex(base);
  const activeColor = parseHex(active);

  const r = Math.round(baseColor.r + (activeColor.r - baseColor.r) * intensity);
  const g = Math.round(baseColor.g + (activeColor.g - baseColor.g) * intensity);
  const b = Math.round(baseColor.b + (activeColor.b - baseColor.b) * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}

// Side View (Lateral) - Most common brain diagram view
function SideView({ activations }: { activations: BrainRegionActivation | null }) {
  const lobeColors = useMemo(() => {
    const colors: Record<string, string> = {};
    Object.entries(LOBE_COLORS).forEach(([lobe, { base, active }]) => {
      const intensity = getLobeActivation(activations, lobe);
      colors[lobe] = interpolateColor(base, active, intensity);
    });
    return colors;
  }, [activations]);

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <title>Brain - Side View</title>

      {/* Brain outline */}
      <defs>
        <filter id="glow-side">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Frontal Lobe - Pink */}
      <path
        d="M 30 70
           C 30 40, 50 20, 80 20
           C 90 20, 95 25, 100 35
           L 85 55
           C 80 65, 75 75, 70 85
           L 45 90
           C 35 85, 30 80, 30 70"
        fill={lobeColors.frontal}
        stroke="#666"
        strokeWidth="1"
        className="transition-all duration-300"
        style={{ filter: getLobeActivation(activations, 'frontal') > 0.5 ? 'url(#glow-side)' : 'none' }}
      />

      {/* Parietal Lobe - Green */}
      <path
        d="M 100 35
           C 120 25, 145 25, 160 40
           C 165 50, 165 60, 160 70
           L 130 75
           L 100 70
           L 85 55
           Z"
        fill={lobeColors.parietal}
        stroke="#666"
        strokeWidth="1"
        className="transition-all duration-300"
        style={{ filter: getLobeActivation(activations, 'parietal') > 0.5 ? 'url(#glow-side)' : 'none' }}
      />

      {/* Occipital Lobe - Purple */}
      <path
        d="M 160 70
           C 175 75, 180 90, 175 105
           C 170 115, 160 120, 150 118
           L 140 100
           L 145 80
           Z"
        fill={lobeColors.occipital}
        stroke="#666"
        strokeWidth="1"
        className="transition-all duration-300"
      />

      {/* Temporal Lobe - Blue */}
      <path
        d="M 45 90
           L 70 85
           C 80 90, 100 95, 130 95
           L 140 100
           L 150 118
           C 140 125, 120 130, 90 128
           C 60 126, 40 115, 35 100
           C 35 95, 40 92, 45 90"
        fill={lobeColors.temporal}
        stroke="#666"
        strokeWidth="1"
        className="transition-all duration-300"
        style={{ filter: getLobeActivation(activations, 'temporal') > 0.5 ? 'url(#glow-side)' : 'none' }}
      />

      {/* Cerebellum - Orange */}
      <path
        d="M 150 118
           C 160 125, 170 130, 175 125
           C 180 120, 180 110, 175 105
           C 170 115, 160 120, 150 118"
        fill={lobeColors.cerebellum}
        stroke="#666"
        strokeWidth="1"
        className="transition-all duration-300"
      />
      <ellipse
        cx="165"
        cy="125"
        rx="18"
        ry="12"
        fill={lobeColors.cerebellum}
        stroke="#666"
        strokeWidth="1"
      />

      {/* Brain stem */}
      <path
        d="M 140 130
           C 145 135, 150 140, 148 150
           L 138 155
           C 132 150, 130 140, 135 130
           Z"
        fill={lobeColors.brainstem}
        stroke="#666"
        strokeWidth="1"
      />

      {/* Central sulcus line */}
      <path
        d="M 100 35 L 90 75"
        stroke="#555"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Lateral sulcus */}
      <path
        d="M 70 85 C 90 82, 110 85, 130 90"
        stroke="#555"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Gyri details */}
      <path
        d="M 50 50 Q 60 45, 70 50 M 55 60 Q 65 55, 75 60 M 60 70 Q 70 65, 80 70"
        stroke="#777"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M 110 40 Q 125 35, 140 40 M 115 50 Q 130 45, 145 50 M 120 60 Q 135 55, 150 60"
        stroke="#777"
        strokeWidth="0.5"
        fill="none"
      />

      <text x="100" y="155" textAnchor="middle" className="text-[9px] fill-gray-400">SIDE VIEW</text>
    </svg>
  );
}

// Top View (Superior)
function TopView({ activations }: { activations: BrainRegionActivation | null }) {
  const lobeColors = useMemo(() => {
    const colors: Record<string, string> = {};
    Object.entries(LOBE_COLORS).forEach(([lobe, { base, active }]) => {
      const intensity = getLobeActivation(activations, lobe);
      colors[lobe] = interpolateColor(base, active, intensity);
    });
    return colors;
  }, [activations]);

  return (
    <svg viewBox="0 0 160 180" className="w-full h-full">
      <title>Brain - Top View</title>

      <defs>
        <filter id="glow-top">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Left Hemisphere */}
      <g>
        {/* Left Frontal */}
        <path
          d="M 78 90
             C 78 60, 70 35, 50 25
             C 30 20, 15 35, 12 60
             C 10 75, 15 90, 25 95
             L 78 95
             Z"
          fill={lobeColors.frontal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'frontal') > 0.5 ? 'url(#glow-top)' : 'none' }}
        />

        {/* Left Parietal */}
        <path
          d="M 78 95
             L 25 95
             C 20 105, 18 120, 25 135
             L 78 135
             Z"
          fill={lobeColors.parietal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'parietal') > 0.5 ? 'url(#glow-top)' : 'none' }}
        />

        {/* Left Occipital */}
        <path
          d="M 78 135
             L 25 135
             C 30 150, 45 165, 60 168
             C 70 170, 78 165, 78 155
             Z"
          fill={lobeColors.occipital}
          stroke="#666"
          strokeWidth="1"
        />

        {/* Left Temporal (visible edges) */}
        <path
          d="M 12 60 C 8 75, 8 95, 12 110"
          stroke={lobeColors.temporal}
          strokeWidth="6"
          fill="none"
          className="transition-all duration-300"
        />
      </g>

      {/* Right Hemisphere */}
      <g>
        {/* Right Frontal */}
        <path
          d="M 82 90
             C 82 60, 90 35, 110 25
             C 130 20, 145 35, 148 60
             C 150 75, 145 90, 135 95
             L 82 95
             Z"
          fill={lobeColors.frontal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'frontal') > 0.5 ? 'url(#glow-top)' : 'none' }}
        />

        {/* Right Parietal */}
        <path
          d="M 82 95
             L 135 95
             C 140 105, 142 120, 135 135
             L 82 135
             Z"
          fill={lobeColors.parietal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'parietal') > 0.5 ? 'url(#glow-top)' : 'none' }}
        />

        {/* Right Occipital */}
        <path
          d="M 82 135
             L 135 135
             C 130 150, 115 165, 100 168
             C 90 170, 82 165, 82 155
             Z"
          fill={lobeColors.occipital}
          stroke="#666"
          strokeWidth="1"
        />

        {/* Right Temporal (visible edges) */}
        <path
          d="M 148 60 C 152 75, 152 95, 148 110"
          stroke={lobeColors.temporal}
          strokeWidth="6"
          fill="none"
          className="transition-all duration-300"
        />
      </g>

      {/* Central fissure */}
      <line x1="80" y1="20" x2="80" y2="170" stroke="#444" strokeWidth="2" />

      {/* Central sulcus */}
      <path d="M 25 95 L 135 95" stroke="#555" strokeWidth="1" />

      {/* Gyri patterns - left */}
      <path d="M 30 50 Q 45 45, 60 55 M 25 70 Q 40 65, 55 75" stroke="#777" strokeWidth="0.5" fill="none" />
      <path d="M 30 110 Q 45 105, 60 115 M 35 125 Q 50 120, 65 130" stroke="#777" strokeWidth="0.5" fill="none" />

      {/* Gyri patterns - right */}
      <path d="M 100 55 Q 115 45, 130 50 M 105 75 Q 120 65, 135 70" stroke="#777" strokeWidth="0.5" fill="none" />
      <path d="M 100 115 Q 115 105, 130 110 M 95 130 Q 110 120, 125 125" stroke="#777" strokeWidth="0.5" fill="none" />

      <text x="80" y="178" textAnchor="middle" className="text-[9px] fill-gray-400">TOP VIEW</text>
    </svg>
  );
}

// Front View (Anterior)
function FrontView({ activations }: { activations: BrainRegionActivation | null }) {
  const lobeColors = useMemo(() => {
    const colors: Record<string, string> = {};
    Object.entries(LOBE_COLORS).forEach(([lobe, { base, active }]) => {
      const intensity = getLobeActivation(activations, lobe);
      colors[lobe] = interpolateColor(base, active, intensity);
    });
    return colors;
  }, [activations]);

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <title>Brain - Front View</title>

      <defs>
        <filter id="glow-front">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Left Hemisphere */}
      <g>
        {/* Left Frontal */}
        <path
          d="M 78 75
             C 78 45, 65 20, 45 15
             C 25 12, 12 30, 10 55
             C 8 75, 15 90, 30 95
             L 78 95
             Z"
          fill={lobeColors.frontal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'frontal') > 0.5 ? 'url(#glow-front)' : 'none' }}
        />

        {/* Left Temporal */}
        <path
          d="M 30 95
             C 15 100, 8 110, 12 125
             C 18 138, 35 145, 55 142
             L 65 120
             L 78 95
             L 30 95
             Z"
          fill={lobeColors.temporal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'temporal') > 0.5 ? 'url(#glow-front)' : 'none' }}
        />
      </g>

      {/* Right Hemisphere */}
      <g>
        {/* Right Frontal */}
        <path
          d="M 82 75
             C 82 45, 95 20, 115 15
             C 135 12, 148 30, 150 55
             C 152 75, 145 90, 130 95
             L 82 95
             Z"
          fill={lobeColors.frontal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'frontal') > 0.5 ? 'url(#glow-front)' : 'none' }}
        />

        {/* Right Temporal */}
        <path
          d="M 130 95
             C 145 100, 152 110, 148 125
             C 142 138, 125 145, 105 142
             L 95 120
             L 82 95
             L 130 95
             Z"
          fill={lobeColors.temporal}
          stroke="#666"
          strokeWidth="1"
          className="transition-all duration-300"
          style={{ filter: getLobeActivation(activations, 'temporal') > 0.5 ? 'url(#glow-front)' : 'none' }}
        />
      </g>

      {/* Central fissure */}
      <line x1="80" y1="10" x2="80" y2="95" stroke="#444" strokeWidth="2" />

      {/* Cerebellum */}
      <ellipse
        cx="80"
        cy="135"
        rx="30"
        ry="12"
        fill={lobeColors.cerebellum}
        stroke="#666"
        strokeWidth="1"
      />

      {/* Brain stem */}
      <rect
        x="72"
        y="142"
        width="16"
        height="12"
        rx="3"
        fill={lobeColors.brainstem}
        stroke="#666"
        strokeWidth="1"
      />

      {/* Gyri patterns */}
      <path d="M 30 40 Q 45 35, 55 45 M 25 60 Q 40 55, 50 65" stroke="#777" strokeWidth="0.5" fill="none" />
      <path d="M 105 45 Q 115 35, 130 40 M 110 65 Q 120 55, 135 60" stroke="#777" strokeWidth="0.5" fill="none" />

      <text x="80" y="158" textAnchor="middle" className="text-[9px] fill-gray-400">FRONT VIEW</text>
    </svg>
  );
}

export function RealisticBrain({ activations, className = '' }: RealisticBrainProps) {
  // Calculate overall activation for display
  const overallActivation = useMemo(() => {
    if (!activations) return 0;
    const values = Object.values(activations).filter((v): v is number => typeof v === 'number');
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }, [activations]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900/50 rounded-lg p-2">
          <SideView activations={activations} />
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <TopView activations={activations} />
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <FrontView activations={activations} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LOBE_COLORS.frontal.base }} />
          <span className="text-gray-400">Frontal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LOBE_COLORS.parietal.base }} />
          <span className="text-gray-400">Parietal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LOBE_COLORS.temporal.base }} />
          <span className="text-gray-400">Temporal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LOBE_COLORS.occipital.base }} />
          <span className="text-gray-400">Occipital</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LOBE_COLORS.cerebellum.base }} />
          <span className="text-gray-400">Cerebellum</span>
        </div>
      </div>

      {/* Region activation details */}
      {activations && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Auditory Cortex</span>
            <span className="text-cyan-400">{Math.round(activations.auditoryCortex * 100)}%</span>
          </div>
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Motor Cortex</span>
            <span className="text-cyan-400">{Math.round(activations.motorCortex * 100)}%</span>
          </div>
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Prefrontal</span>
            <span className="text-cyan-400">{Math.round(activations.prefrontalCortex * 100)}%</span>
          </div>
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Amygdala</span>
            <span className="text-cyan-400">{Math.round(activations.amygdala * 100)}%</span>
          </div>
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Hippocampus</span>
            <span className="text-cyan-400">{Math.round(activations.hippocampus * 100)}%</span>
          </div>
          <div className="flex justify-between px-2 py-1 bg-gray-800/50 rounded">
            <span className="text-gray-400">Reward Center</span>
            <span className="text-cyan-400">{Math.round(activations.nucleusAccumbens * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
