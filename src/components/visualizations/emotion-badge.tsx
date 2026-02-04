'use client';

import { EMOTIONS } from '@/lib/analysis/constants';
import type { EmotionClassification, EmotionCategory } from '@/lib/analysis/types';

interface EmotionBadgeProps {
  emotion: EmotionClassification | null;
  className?: string;
}

const EMOTION_COLORS: Record<EmotionCategory, { bg: string; text: string; glow: string }> = {
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
  emotion,
  className = '',
}: EmotionBadgeProps) {
  if (!emotion) {
    return (
      <div className={`p-4 rounded-xl bg-gray-800/50 border border-white/10 ${className}`}>
        <div className="text-gray-500 text-center">No emotion data</div>
      </div>
    );
  }

  const emotionInfo = EMOTIONS[emotion.primary];
  const colors = EMOTION_COLORS[emotion.primary];
  const confidencePercent = Math.round(emotion.confidence * 100);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          relative p-4 rounded-xl ${colors.bg} border border-white/10
          transition-all duration-500 ${emotion.confidence > 0.7 ? `shadow-lg ${colors.glow}` : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={emotion.primary}>
            {emotionInfo?.emoji || '🎵'}
          </span>
          <div className="flex-1">
            <h3 className={`text-xl font-bold capitalize ${colors.text}`}>
              {emotionInfo?.name || emotion.primary}
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

        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.text.replace('text-', 'bg-')}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
