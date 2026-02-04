# Task 03: Create Constants

> **Phase**: 1 - Foundation
> **Complexity**: Small
> **Dependencies**: Task 02
> **Status**: Pending

## Description

Define constants for brain regions, brainwaves, and emotions. These provide metadata for display (names, descriptions, colors) and are used by visualization components.

## Acceptance Criteria

- [ ] Brain region metadata defined
- [ ] Brainwave metadata defined
- [ ] Emotion metadata defined with colors
- [ ] All constants typed properly
- [ ] Constants exported and usable

## Implementation

### Create `src/lib/analysis/constants.ts`

```typescript
import type { BrainRegionId, BrainwaveType, EmotionCategory } from './types';

// ============ Brain Regions ============

export interface BrainRegionInfo {
  id: BrainRegionId;
  name: string;
  description: string;
  location: string;
  color: string; // For visualization
}

export const BRAIN_REGIONS: Record<BrainRegionId, BrainRegionInfo> = {
  auditoryCortex: {
    id: 'auditoryCortex',
    name: 'Auditory Cortex',
    description: 'Processes sound and music',
    location: 'Temporal lobe',
    color: '#3B82F6', // blue
  },
  amygdala: {
    id: 'amygdala',
    name: 'Amygdala',
    description: 'Emotional processing center',
    location: 'Limbic system',
    color: '#EF4444', // red
  },
  hippocampus: {
    id: 'hippocampus',
    name: 'Hippocampus',
    description: 'Memory formation and recall',
    location: 'Medial temporal lobe',
    color: '#8B5CF6', // purple
  },
  nucleusAccumbens: {
    id: 'nucleusAccumbens',
    name: 'Nucleus Accumbens',
    description: 'Reward and pleasure center (dopamine)',
    location: 'Basal forebrain',
    color: '#F59E0B', // amber
  },
  motorCortex: {
    id: 'motorCortex',
    name: 'Motor Cortex',
    description: 'Movement and rhythm response',
    location: 'Frontal lobe',
    color: '#10B981', // emerald
  },
  prefrontalCortex: {
    id: 'prefrontalCortex',
    name: 'Prefrontal Cortex',
    description: 'Attention and anticipation',
    location: 'Frontal lobe',
    color: '#06B6D4', // cyan
  },
  basalGanglia: {
    id: 'basalGanglia',
    name: 'Basal Ganglia',
    description: 'Timing and beat processing',
    location: 'Deep brain nuclei',
    color: '#EC4899', // pink
  },
};

// ============ Brainwaves ============

export interface BrainwaveInfo {
  id: BrainwaveType;
  name: string;
  frequencyRange: string;
  description: string;
  color: string;
}

export const BRAINWAVES: Record<BrainwaveType, BrainwaveInfo> = {
  delta: {
    id: 'delta',
    name: 'Delta',
    frequencyRange: '1-4 Hz',
    description: 'Deep sleep, healing, regeneration',
    color: '#6366F1', // indigo
  },
  theta: {
    id: 'theta',
    name: 'Theta',
    frequencyRange: '4-8 Hz',
    description: 'Meditation, creativity, deep relaxation',
    color: '#8B5CF6', // violet
  },
  alpha: {
    id: 'alpha',
    name: 'Alpha',
    frequencyRange: '8-13 Hz',
    description: 'Calm, relaxed, reflective',
    color: '#22C55E', // green
  },
  beta: {
    id: 'beta',
    name: 'Beta',
    frequencyRange: '13-38 Hz',
    description: 'Alert, focused, active thinking',
    color: '#F59E0B', // amber
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    frequencyRange: '30-100 Hz',
    description: 'Peak focus, learning, high cognition',
    color: '#EF4444', // red
  },
};

// ============ Emotions ============

export interface EmotionInfo {
  id: EmotionCategory;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const EMOTIONS: Record<EmotionCategory, EmotionInfo> = {
  happy: {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    color: '#FBBF24',
    description: 'Joyful, upbeat music',
  },
  sad: {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    color: '#3B82F6',
    description: 'Melancholic, sorrowful music',
  },
  angry: {
    id: 'angry',
    name: 'Angry',
    emoji: '😠',
    color: '#EF4444',
    description: 'Aggressive, intense music',
  },
  calm: {
    id: 'calm',
    name: 'Calm',
    emoji: '😌',
    color: '#22C55E',
    description: 'Peaceful, serene music',
  },
  excited: {
    id: 'excited',
    name: 'Excited',
    emoji: '🤩',
    color: '#F97316',
    description: 'Thrilling, exhilarating music',
  },
  fearful: {
    id: 'fearful',
    name: 'Fearful',
    emoji: '😨',
    color: '#6366F1',
    description: 'Tense, suspenseful music',
  },
  energetic: {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    color: '#EAB308',
    description: 'High-energy, driving music',
  },
  melancholic: {
    id: 'melancholic',
    name: 'Melancholic',
    emoji: '🥀',
    color: '#8B5CF6',
    description: 'Wistful, bittersweet music',
  },
  uplifting: {
    id: 'uplifting',
    name: 'Uplifting',
    emoji: '🌟',
    color: '#14B8A6',
    description: 'Inspiring, elevating music',
  },
  tense: {
    id: 'tense',
    name: 'Tense',
    emoji: '😰',
    color: '#DC2626',
    description: 'Anxious, suspenseful music',
  },
  peaceful: {
    id: 'peaceful',
    name: 'Peaceful',
    emoji: '🕊️',
    color: '#0EA5E9',
    description: 'Tranquil, harmonious music',
  },
};

// ============ Frequency Bands ============

export const FREQUENCY_BANDS = {
  bass: { name: 'Bass', range: '20-250 Hz', color: '#EF4444' },
  lowMid: { name: 'Low Mid', range: '250-500 Hz', color: '#F97316' },
  mid: { name: 'Mid', range: '500-2kHz', color: '#EAB308' },
  highMid: { name: 'High Mid', range: '2-4 kHz', color: '#22C55E' },
  high: { name: 'High', range: '4-20 kHz', color: '#3B82F6' },
} as const;
```

### Update `src/lib/analysis/index.ts`

```typescript
export * from './types';
export * from './constants';
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/analysis/constants.ts` | Create |
| `src/lib/analysis/index.ts` | Update |

## Testing

- [ ] Constants can be imported: `import { BRAIN_REGIONS } from '@/lib/analysis'`
- [ ] All brain regions have required fields
- [ ] All emotions have colors and emojis
- [ ] TypeScript validates constant shapes

## Notes

- Colors are Tailwind-compatible hex values
- Emojis provide quick visual identification
- Descriptions are user-friendly for tooltips

---

_Task 03 of 28 - neuro-acoustic-analyzer_
