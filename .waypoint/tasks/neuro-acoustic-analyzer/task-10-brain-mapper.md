# Task 10: Implement Brain Region Mapper

> **Phase**: 2 - Audio Service
> **Complexity**: Medium
> **Dependencies**: Task 09
> **Status**: Pending

## Description

Implement the rule-based mapper that converts audio features to brain region activation levels. Based on neuroscience research about how different audio properties affect different brain areas.

## Acceptance Criteria

- [ ] Maps audio features to 7 brain regions
- [ ] Returns activation levels (0-1) for each region
- [ ] Rules based on documented research
- [ ] Handles edge cases gracefully
- [ ] Outputs consistent, smooth values

## Implementation

### Create Brain Mapper

`audio-service/src/analyzer/brain_mapper.py`:

```python
from dataclasses import dataclass
from typing import Dict
from src.analyzer.audio_processor import AudioFeatures

@dataclass
class BrainRegionActivation:
    """Activation levels for each brain region (0-1)."""
    auditory_cortex: float
    amygdala: float
    hippocampus: float
    nucleus_accumbens: float
    motor_cortex: float
    prefrontal_cortex: float
    basal_ganglia: float

    def to_dict(self) -> Dict[str, float]:
        return {
            'auditory_cortex': self.auditory_cortex,
            'amygdala': self.amygdala,
            'hippocampus': self.hippocampus,
            'nucleus_accumbens': self.nucleus_accumbens,
            'motor_cortex': self.motor_cortex,
            'prefrontal_cortex': self.prefrontal_cortex,
            'basal_ganglia': self.basal_ganglia,
        }


def _clamp(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    """Clamp value to range."""
    return max(min_val, min(value, max_val))


def _map_range(value: float, in_min: float, in_max: float, out_min: float, out_max: float) -> float:
    """Map value from input range to output range."""
    clamped = max(in_min, min(value, in_max))
    return out_min + (clamped - in_min) * (out_max - out_min) / (in_max - in_min)


class BrainMapper:
    """
    Maps audio features to brain region activation.

    Based on neuroscience research:
    - Auditory cortex: Always active with sound, scales with complexity
    - Amygdala: Emotional intensity, dynamics, minor keys
    - Hippocampus: Memory, familiarity, common progressions
    - Nucleus Accumbens: Reward, pleasure, "chills", high energy peaks
    - Motor Cortex: Rhythm, movement urge, beat strength
    - Prefrontal Cortex: Attention, pattern recognition, complexity
    - Basal Ganglia: Timing, beat processing, rhythm regularity
    """

    def map(self, features: AudioFeatures) -> BrainRegionActivation:
        """Map audio features to brain region activation levels."""

        return BrainRegionActivation(
            auditory_cortex=self._calc_auditory_cortex(features),
            amygdala=self._calc_amygdala(features),
            hippocampus=self._calc_hippocampus(features),
            nucleus_accumbens=self._calc_nucleus_accumbens(features),
            motor_cortex=self._calc_motor_cortex(features),
            prefrontal_cortex=self._calc_prefrontal_cortex(features),
            basal_ganglia=self._calc_basal_ganglia(features),
        )

    def _calc_auditory_cortex(self, f: AudioFeatures) -> float:
        """
        Auditory cortex: Always active when processing sound.
        Scales with overall audio complexity and variety.
        """
        # Base activation when music is playing
        base = 0.6

        # Increase with spectral complexity
        complexity_boost = (f.spectral_centroid + f.spectral_rolloff) / 4

        # Increase with energy
        energy_boost = f.energy * 0.2

        return _clamp(base + complexity_boost + energy_boost)

    def _calc_amygdala(self, f: AudioFeatures) -> float:
        """
        Amygdala: Emotional processing.
        Activated by emotional intensity, dynamics, tension.
        """
        # High or very low energy indicates emotional content
        energy_factor = 0.0
        if f.energy > 0.7:
            energy_factor = (f.energy - 0.7) * 2  # High energy = intense
        elif f.energy < 0.3:
            energy_factor = (0.3 - f.energy) * 1.5  # Low energy = melancholic

        # Spectral flatness (noise/tension)
        tension = f.spectral_flatness * 0.3

        # Bass can indicate emotional weight
        bass_factor = f.bass * 0.2

        return _clamp(0.3 + energy_factor + tension + bass_factor)

    def _calc_hippocampus(self, f: AudioFeatures) -> float:
        """
        Hippocampus: Memory and familiarity.
        Harder to detect without melody analysis - use proxy indicators.
        """
        # Moderate tempo (common in memorable music)
        tempo_familiarity = 1.0 - abs(f.tempo - 120) / 120

        # Mid frequencies often carry melody
        melody_presence = f.mid * 0.3

        # Lower spectral flatness = more tonal (memorable)
        tonality = (1 - f.spectral_flatness) * 0.2

        return _clamp(0.25 + tempo_familiarity * 0.3 + melody_presence + tonality)

    def _calc_nucleus_accumbens(self, f: AudioFeatures) -> float:
        """
        Nucleus Accumbens: Reward center, dopamine, pleasure.
        Activated by musical "chills" - typically high energy peaks with bass.
        """
        # High energy + strong bass = reward response
        peak_factor = 0.0
        if f.energy > 0.6 and f.bass > 0.5:
            peak_factor = (f.energy + f.bass) / 2 * 0.5

        # Strong beat also triggers reward
        beat_reward = f.beat_strength * 0.3

        # Spectral "brightness" (exciting sounds)
        brightness = f.spectral_centroid * 0.2

        return _clamp(0.2 + peak_factor + beat_reward + brightness)

    def _calc_motor_cortex(self, f: AudioFeatures) -> float:
        """
        Motor Cortex: Movement and rhythm response.
        Activated by tempo and beat strength - the urge to move.
        """
        # Tempo mapping: 60-180 BPM maps to activation
        tempo_factor = _map_range(f.tempo, 60, 180, 0.2, 0.8)

        # Strong beat = strong motor response
        beat_factor = f.beat_strength * 0.4

        # Bass drives physical response
        bass_factor = f.bass * 0.2

        return _clamp(tempo_factor + beat_factor + bass_factor)

    def _calc_prefrontal_cortex(self, f: AudioFeatures) -> float:
        """
        Prefrontal Cortex: Attention, pattern recognition, anticipation.
        Activated by complexity and unexpected elements.
        """
        # Spectral complexity
        complexity = (f.spectral_centroid + f.spectral_rolloff) / 2 * 0.4

        # High frequency content requires more attention
        high_freq_attention = (f.high_mid + f.high) / 2 * 0.3

        # Faster tempo requires more cognitive processing
        tempo_attention = _map_range(f.tempo, 60, 180, 0.1, 0.3)

        return _clamp(0.3 + complexity + high_freq_attention + tempo_attention)

    def _calc_basal_ganglia(self, f: AudioFeatures) -> float:
        """
        Basal Ganglia: Timing and beat processing.
        Activated by rhythmic regularity and beat detection.
        """
        # Beat strength is primary driver
        beat_factor = f.beat_strength * 0.5

        # Low frequency (bass drum) timing
        bass_timing = f.bass * 0.3

        # Regular, strong rhythm
        rhythm_regularity = 0.2 if f.beat_strength > 0.4 else 0.1

        return _clamp(0.2 + beat_factor + bass_timing + rhythm_regularity)


# Singleton instance
brain_mapper = BrainMapper()
```

### Update Module Export

Update `audio-service/src/analyzer/__init__.py`:

```python
from .audio_processor import AudioProcessor, AudioFeatures, processor
from .brain_mapper import BrainMapper, BrainRegionActivation, brain_mapper

__all__ = [
    'AudioProcessor', 'AudioFeatures', 'processor',
    'BrainMapper', 'BrainRegionActivation', 'brain_mapper',
]
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `audio-service/src/analyzer/brain_mapper.py` | Create |
| `audio-service/src/analyzer/__init__.py` | Update |

## Testing

```python
# test_brain_mapper.py
from src.analyzer import processor, brain_mapper

for features in processor.process_audio("test_audio.mp3"):
    activation = brain_mapper.map(features)
    print(f"t={features.timestamp:.1f}s")
    print(f"  Motor Cortex: {activation.motor_cortex:.2f}")
    print(f"  Nucleus Accumbens: {activation.nucleus_accumbens:.2f}")
    print(f"  Amygdala: {activation.amygdala:.2f}")
```

## Research References

- Motor cortex: Rhythm processing correlates with tempo and beat strength
- Nucleus accumbens: Dopamine release during musical "chills"
- Amygdala: Emotional processing of musical tension/release
- Prefrontal cortex: Attention to complex musical patterns

## Notes

- All mappings are approximations based on research correlations
- Values smoothed to prevent jarring visual changes
- Can be refined with more sophisticated analysis later

---

_Task 10 of 28 - neuro-acoustic-analyzer_
