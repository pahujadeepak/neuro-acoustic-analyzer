# Task 12: Implement Emotion Classifier

> **Phase**: 2 - Audio Service
> **Complexity**: Small
> **Dependencies**: Task 09
> **Status**: Pending

## Description

Implement the emotion classifier that categorizes music segments into predefined emotion categories based on audio features like tempo, energy, and spectral characteristics.

## Acceptance Criteria

- [ ] Classifies into 11 emotion categories
- [ ] Returns primary emotion and confidence score
- [ ] Based on music psychology research
- [ ] Handles ambiguous cases gracefully

## Implementation

### Create Emotion Classifier

`audio-service/src/analyzer/emotion_classifier.py`:

```python
from dataclasses import dataclass
from typing import Dict, List, Tuple
from enum import Enum
from src.analyzer.audio_processor import AudioFeatures


class EmotionCategory(str, Enum):
    # Basic emotions
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    CALM = "calm"
    EXCITED = "excited"
    FEARFUL = "fearful"

    # Music moods
    ENERGETIC = "energetic"
    MELANCHOLIC = "melancholic"
    UPLIFTING = "uplifting"
    TENSE = "tense"
    PEACEFUL = "peaceful"


@dataclass
class EmotionClassification:
    """Result of emotion classification."""
    primary: str
    confidence: float

    def to_dict(self) -> Dict[str, any]:
        return {
            'primary': self.primary,
            'confidence': self.confidence,
        }


class EmotionClassifier:
    """
    Classifies audio segments into emotion categories.

    Based on music psychology research:
    - Tempo: Fast = energetic/happy, Slow = sad/calm
    - Mode: Major = happy, Minor = sad (hard to detect without harmony analysis)
    - Energy: High = excited/angry, Low = peaceful/melancholic
    - Spectral: Bright = happy, Dark = sad/tense
    """

    def classify(self, features: AudioFeatures) -> EmotionClassification:
        """Classify emotion from audio features."""

        # Calculate scores for each emotion
        scores = self._calculate_scores(features)

        # Find primary emotion
        primary = max(scores, key=scores.get)
        confidence = scores[primary]

        # Normalize confidence
        total = sum(scores.values())
        if total > 0:
            confidence = confidence / total

        return EmotionClassification(
            primary=primary,
            confidence=round(confidence, 2)
        )

    def _calculate_scores(self, f: AudioFeatures) -> Dict[str, float]:
        """Calculate score for each emotion category."""

        tempo = f.tempo
        energy = f.energy
        bass = f.bass
        brightness = f.spectral_centroid
        beat = f.beat_strength

        scores = {}

        # ENERGETIC: Fast tempo + high energy + strong beat
        scores[EmotionCategory.ENERGETIC.value] = (
            self._tempo_score(tempo, 130, 180) * 0.4 +
            energy * 0.4 +
            beat * 0.2
        )

        # HAPPY: Medium-fast tempo + high energy + bright
        scores[EmotionCategory.HAPPY.value] = (
            self._tempo_score(tempo, 100, 140) * 0.3 +
            energy * 0.3 +
            brightness * 0.3 +
            (1 - f.spectral_flatness) * 0.1  # Tonal = happier
        )

        # EXCITED: Fast tempo + high energy + high freq
        scores[EmotionCategory.EXCITED.value] = (
            self._tempo_score(tempo, 120, 160) * 0.3 +
            energy * 0.4 +
            (f.high_mid + f.high) / 2 * 0.3
        )

        # UPLIFTING: Medium tempo + rising energy + bright
        scores[EmotionCategory.UPLIFTING.value] = (
            self._tempo_score(tempo, 100, 130) * 0.3 +
            energy * 0.3 +
            brightness * 0.4
        )

        # CALM: Slow tempo + low energy + smooth
        scores[EmotionCategory.CALM.value] = (
            self._tempo_score(tempo, 60, 90) * 0.3 +
            (1 - energy) * 0.4 +
            (1 - beat) * 0.3
        )

        # PEACEFUL: Very slow + very low energy
        scores[EmotionCategory.PEACEFUL.value] = (
            self._tempo_score(tempo, 50, 80) * 0.3 +
            (1 - energy) * 0.5 +
            (1 - f.zcr) * 0.2  # Low ZCR = smooth
        )

        # SAD: Slow tempo + low energy + dark
        scores[EmotionCategory.SAD.value] = (
            self._tempo_score(tempo, 50, 80) * 0.3 +
            (1 - energy) * 0.3 +
            (1 - brightness) * 0.4
        )

        # MELANCHOLIC: Slow-medium + moderate energy + dark
        scores[EmotionCategory.MELANCHOLIC.value] = (
            self._tempo_score(tempo, 60, 100) * 0.3 +
            self._energy_range_score(energy, 0.3, 0.6) * 0.3 +
            (1 - brightness) * 0.4
        )

        # ANGRY: Fast + high energy + harsh
        scores[EmotionCategory.ANGRY.value] = (
            self._tempo_score(tempo, 120, 180) * 0.3 +
            energy * 0.3 +
            f.spectral_flatness * 0.2 +  # Noise = harsh
            bass * 0.2
        )

        # TENSE: Any tempo + high spectral flatness + dissonance
        scores[EmotionCategory.TENSE.value] = (
            energy * 0.3 +
            f.spectral_flatness * 0.4 +
            f.zcr * 0.3  # High ZCR = harsh
        )

        # FEARFUL: Unpredictable, tense, low-mid energy
        scores[EmotionCategory.FEARFUL.value] = (
            f.spectral_flatness * 0.4 +
            (1 - brightness) * 0.3 +
            self._energy_range_score(energy, 0.3, 0.7) * 0.3
        )

        return scores

    def _tempo_score(self, tempo: float, ideal_min: float, ideal_max: float) -> float:
        """Score how well tempo fits ideal range."""
        if ideal_min <= tempo <= ideal_max:
            return 1.0
        elif tempo < ideal_min:
            return max(0, 1 - (ideal_min - tempo) / 50)
        else:
            return max(0, 1 - (tempo - ideal_max) / 50)

    def _energy_range_score(self, energy: float, min_val: float, max_val: float) -> float:
        """Score if energy is within range."""
        if min_val <= energy <= max_val:
            return 1.0
        return 0.5


# Singleton instance
emotion_classifier = EmotionClassifier()
```

### Update Module Export

Update `audio-service/src/analyzer/__init__.py`:

```python
from .audio_processor import AudioProcessor, AudioFeatures, processor
from .brain_mapper import BrainMapper, BrainRegionActivation, brain_mapper
from .brainwave_predictor import BrainwavePredictor, BrainwaveState, brainwave_predictor
from .emotion_classifier import EmotionClassifier, EmotionClassification, EmotionCategory, emotion_classifier

__all__ = [
    'AudioProcessor', 'AudioFeatures', 'processor',
    'BrainMapper', 'BrainRegionActivation', 'brain_mapper',
    'BrainwavePredictor', 'BrainwaveState', 'brainwave_predictor',
    'EmotionClassifier', 'EmotionClassification', 'EmotionCategory', 'emotion_classifier',
]
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `audio-service/src/analyzer/emotion_classifier.py` | Create |
| `audio-service/src/analyzer/__init__.py` | Update |

## Testing

```python
# test_emotion_classifier.py
from src.analyzer import processor, emotion_classifier

for features in processor.process_audio("test_audio.mp3"):
    emotion = emotion_classifier.classify(features)
    print(f"t={features.timestamp:.1f}s: {emotion.primary} ({emotion.confidence:.0%})")
```

## Notes

- Without harmonic analysis (major/minor mode detection), classification is approximate
- Confidence scores indicate how strongly features match the emotion
- Multiple emotions may score similarly for ambiguous music

---

_Task 12 of 28 - neuro-acoustic-analyzer_
