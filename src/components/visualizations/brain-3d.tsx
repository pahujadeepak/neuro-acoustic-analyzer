'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BrainRegionActivation } from '@/lib/analysis/types';

interface Brain3DProps {
  activations: BrainRegionActivation | null;
  className?: string;
}

// Lobe colors - matching anatomical references
const LOBE_COLORS = {
  frontal: { base: '#FFB6C1', active: '#FF1493' },      // Pink
  parietal: { base: '#90EE90', active: '#00FF00' },     // Green
  temporal: { base: '#87CEEB', active: '#1E90FF' },     // Blue
  occipital: { base: '#DDA0DD', active: '#9400D3' },    // Purple
  cerebellum: { base: '#F4A460', active: '#FF8C00' },   // Orange
  brainstem: { base: '#D2B48C', active: '#8B4513' },    // Tan
};

// Map our brain regions to lobes
function getLobeActivation(activations: BrainRegionActivation | null, lobe: string): number {
  if (!activations) return 0.2;

  switch (lobe) {
    case 'frontal':
      return Math.max(activations.prefrontalCortex, activations.motorCortex * 0.5);
    case 'temporal':
      return Math.max(activations.auditoryCortex, activations.hippocampus, activations.amygdala);
    case 'parietal':
      return Math.max(activations.motorCortex * 0.5, activations.basalGanglia * 0.3);
    case 'occipital':
      return 0.3; // Visual cortex - not directly mapped
    case 'cerebellum':
      return activations.basalGanglia * 0.5;
    case 'brainstem':
      return 0.2;
    default:
      return 0.2;
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

// Create brain lobe geometry
function createLobeGeometry(type: string): THREE.BufferGeometry {
  let geometry: THREE.BufferGeometry;

  switch (type) {
    case 'frontal-left':
      geometry = new THREE.SphereGeometry(0.45, 32, 32);
      geometry.scale(1.1, 0.9, 0.8);
      geometry.translate(-0.25, 0.15, 0.35);
      break;
    case 'frontal-right':
      geometry = new THREE.SphereGeometry(0.45, 32, 32);
      geometry.scale(1.1, 0.9, 0.8);
      geometry.translate(0.25, 0.15, 0.35);
      break;
    case 'parietal-left':
      geometry = new THREE.SphereGeometry(0.4, 32, 32);
      geometry.scale(0.9, 0.8, 0.9);
      geometry.translate(-0.25, 0.35, -0.1);
      break;
    case 'parietal-right':
      geometry = new THREE.SphereGeometry(0.4, 32, 32);
      geometry.scale(0.9, 0.8, 0.9);
      geometry.translate(0.25, 0.35, -0.1);
      break;
    case 'temporal-left':
      geometry = new THREE.SphereGeometry(0.35, 32, 32);
      geometry.scale(0.9, 0.6, 1.1);
      geometry.translate(-0.45, -0.15, 0.1);
      break;
    case 'temporal-right':
      geometry = new THREE.SphereGeometry(0.35, 32, 32);
      geometry.scale(0.9, 0.6, 1.1);
      geometry.translate(0.45, -0.15, 0.1);
      break;
    case 'occipital-left':
      geometry = new THREE.SphereGeometry(0.3, 32, 32);
      geometry.scale(0.8, 0.8, 0.9);
      geometry.translate(-0.2, 0.1, -0.5);
      break;
    case 'occipital-right':
      geometry = new THREE.SphereGeometry(0.3, 32, 32);
      geometry.scale(0.8, 0.8, 0.9);
      geometry.translate(0.2, 0.1, -0.5);
      break;
    case 'cerebellum':
      geometry = new THREE.SphereGeometry(0.35, 32, 32);
      geometry.scale(1.2, 0.6, 0.8);
      geometry.translate(0, -0.35, -0.45);
      break;
    case 'brainstem':
      geometry = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 16);
      geometry.translate(0, -0.55, -0.2);
      geometry.rotateX(Math.PI * 0.15);
      break;
    default:
      geometry = new THREE.SphereGeometry(0.3, 32, 32);
  }

  return geometry;
}

// Individual brain lobe mesh
function BrainLobe({
  type,
  lobe,
  activation,
  onHover
}: {
  type: string;
  lobe: string;
  activation: number;
  onHover: (lobe: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => createLobeGeometry(type), [type]);

  const colors = LOBE_COLORS[lobe as keyof typeof LOBE_COLORS] || LOBE_COLORS.frontal;
  const color = interpolateColor(colors.base, colors.active, activation);

  // Pulsing animation based on activation
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + activation * 5) * activation * 0.03;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => { setHovered(true); onHover(lobe); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={activation * 0.3 + (hovered ? 0.2 : 0)}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

// Add gyri texture (brain wrinkles) using bump effect
function BrainSurface({ activations }: { activations: BrainRegionActivation | null }) {
  const [hoveredLobe, setHoveredLobe] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const lobes = [
    { type: 'frontal-left', lobe: 'frontal' },
    { type: 'frontal-right', lobe: 'frontal' },
    { type: 'parietal-left', lobe: 'parietal' },
    { type: 'parietal-right', lobe: 'parietal' },
    { type: 'temporal-left', lobe: 'temporal' },
    { type: 'temporal-right', lobe: 'temporal' },
    { type: 'occipital-left', lobe: 'occipital' },
    { type: 'occipital-right', lobe: 'occipital' },
    { type: 'cerebellum', lobe: 'cerebellum' },
    { type: 'brainstem', lobe: 'brainstem' },
  ];

  return (
    <group ref={groupRef}>
      {lobes.map(({ type, lobe }) => (
        <BrainLobe
          key={type}
          type={type}
          lobe={lobe}
          activation={getLobeActivation(activations, lobe)}
          onHover={setHoveredLobe}
        />
      ))}

      {/* Central fissure line */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.8]} />
        <meshBasicMaterial color="#333" transparent opacity={0.5} />
      </mesh>

      {/* Hover label */}
      {hoveredLobe && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-gray-900/90 px-3 py-1 rounded-lg text-white text-sm font-medium capitalize whitespace-nowrap">
            {hoveredLobe} Lobe
            <div className="text-xs text-gray-400">
              {Math.round(getLobeActivation(activations, hoveredLobe) * 100)}% active
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Brain3D({ activations, className = '' }: Brain3DProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="h-[350px] w-full rounded-xl overflow-hidden bg-gray-950">
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#0a0a0f']} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#88ccff" />
          <pointLight position={[0, -2, 2]} intensity={0.3} color="#ff88cc" />

          {/* Brain */}
          <BrainSurface activations={activations} />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={1.5}
            maxDistance={4}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-4 text-xs">
        {Object.entries(LOBE_COLORS).map(([lobe, { base }]) => (
          <div key={lobe} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: base }}
            />
            <span className="text-gray-400 capitalize">{lobe}</span>
          </div>
        ))}
      </div>

      {/* Region activation details */}
      {activations && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-xs">
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
      )}

      <p className="text-center text-xs text-gray-500 mt-3">
        Drag to rotate  -  Scroll to zoom
      </p>
    </div>
  );
}
