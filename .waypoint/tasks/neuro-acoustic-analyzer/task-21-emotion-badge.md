# Task 21: Build EmotionBadge Component

> **Phase**: 4 - Visualization
> **Complexity**: Small
> **Dependencies**: Tasks 02, 03
> **Status**: Pending

## Description

Create a component that displays the predicted emotional state with an appropriate icon, color, and confidence indicator.

## Acceptance Criteria

- [ ] Displays emotion name prominently
- [ ] Shows appropriate emoji/icon for emotion
- [ ] Color-coded background matching emotion
- [ ] Displays confidence percentage
- [ ] Smooth transition between emotions
- [ ] Shows secondary emotions when available

## Implementation

Create `src/components/visualizations/emotion-badge.tsx`:

```typescript
'use client';

import { useMemo } from 'react';
import { EMOTIONS } from '@/lib/constants';
import type { EmotionType, EmotionPrediction } from '@/lib/analysis/types';

interface EmotionBadgeProps {
  primary: EmotionPrediction;
  secondary?: EmotionPrediction[];
  className?: string;
}

const EMOTION_EMOJIS: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  calm: '😌',
  excited: '🤩',
  fearful: '😨',
  energetic: '⚡',
  melancholic: '🥀',
  uplifting: '✨',
  tense: '😬',
  peaceful: '🕊️',
};

const EMOTION_COLORS: Record<EmotionType, { bg: string; text: string; glow: string }> = {
  happy: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' },
  sad: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  angry: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/50' },
  calm: { bg: 'bg-green-500/20', text: 'text-green-400', glow: 'shadow-green-500/50' },
  excited: { bg: 'bg-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
  fearful: { bg: 'bg-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
  energetic: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
  melancholic: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', glow: 'shadow-indigo-500/50' },
  uplifting: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
  tense: { bg: 'bg-rose-500/20', text: 'text-rose-400', glow: 'shadow-rose-500/50' },
  peaceful: { bg: 'bg-teal-500/20', text: 'text-teal-400', glow: 'shadow-teal-500/50' },
};

export function EmotionBadge({
  primary,
  secondary = [],
  className = '',
}: EmotionBadgeProps) {
  const emotionInfo = EMOTIONS[primary.emotion];
  const colors = EMOTION_COLORS[primary.emotion];
  const emoji = EMOTION_EMOJIS[primary.emotion];

  const confidencePercent = Math.round(primary.confidence * 100);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary emotion */}
      <div
        className={`
          relative p-4 rounded-xl ${colors.bg} border border-white/10
          transition-all duration-500 ${primary.confidence > 0.7 ? `shadow-lg ${colors.glow}` : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={primary.emotion}>
            {emoji}
          </span>
          <div className="flex-1">
            <h3 className={`text-xl font-bold capitalize ${colors.text}`}>
              {emotionInfo?.name || primary.emotion}
            </h3>
            <p className="text-sm text-gray-400">
              {emotionInfo?.description || 'Detected emotional state'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${colors.text}`}>
              {confidencePercent}%
            </div>
            <div className="text-xs text-gray-500">confidence</div>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.text.replace('text-', 'bg-')}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Secondary emotions */}
      {secondary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {secondary.slice(0, 3).map((emotion) => {
            const secColors = EMOTION_COLORS[emotion.emotion];
            const secEmoji = EMOTION_EMOJIS[emotion.emotion];
            return (
              <div
                key={emotion.emotion}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  ${secColors.bg} border border-white/5
                `}
              >
                <span className="text-sm">{secEmoji}</span>
                <span className={`text-xs capitalize ${secColors.text}`}>
                  {emotion.emotion}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(emotion.confidence * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

## Files to Create

| File | Description |
|------|-------------|
| `src/components/visualizations/emotion-badge.tsx` | Emotion display component |

## Testing

- [ ] Primary emotion displays with correct emoji and color
- [ ] Confidence percentage is accurate
- [ ] Secondary emotions show when provided
- [ ] Smooth transitions between emotion changes
- [ ] Glow effect appears at high confidence

---

_Task 21 of 28 - neuro-acoustic-analyzer_
