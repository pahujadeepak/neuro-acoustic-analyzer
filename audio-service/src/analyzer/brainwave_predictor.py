from dataclasses import dataclass
from typing import Dict
from src.analyzer.audio_processor import AudioFeatures


@dataclass
class BrainwaveState:
    """
    Predicted brainwave state distribution.
    Values should sum to approximately 1.0.

    Brainwave types:
    - Delta (1-4 Hz): Deep sleep, healing
    - Theta (4-8 Hz): Meditation, creativity, drowsiness
    - Alpha (8-13 Hz): Relaxed, calm, reflective
    - Beta (13-38 Hz): Alert, focused, active
    - Gamma (30-100 Hz): High cognition, peak focus
    """
    delta: float
    theta: float
    alpha: float
    beta: float
    gamma: float

    def to_dict(self) -> Dict[str, float]:
        return {
            'delta': self.delta,
            'theta': self.theta,
            'alpha': self.alpha,
            'beta': self.beta,
            'gamma': self.gamma,
        }

    def normalize(self) -> 'BrainwaveState':
        """Ensure values sum to 1.0."""
        total = self.delta + self.theta + self.alpha + self.beta + self.gamma
        if total == 0:
            return BrainwaveState(0.2, 0.2, 0.2, 0.2, 0.2)
        return BrainwaveState(
            delta=self.delta / total,
            theta=self.theta / total,
            alpha=self.alpha / total,
            beta=self.beta / total,
            gamma=self.gamma / total,
        )


class BrainwavePredictor:
    """
    Predicts brainwave state based on audio features.

    Research basis:
    - Slow, quiet music (60-80 BPM) promotes alpha/theta states
    - Medium tempo (80-120 BPM) maintains alpha/beta balance
    - Fast, energetic music (120+ BPM) promotes beta/gamma states
    - Binaural beats research shows tempo can entrain brainwaves
    """

    def predict(self, features: AudioFeatures) -> BrainwaveState:
        """Predict brainwave distribution from audio features."""

        tempo = features.tempo
        energy = features.energy
        complexity = (features.spectral_centroid + features.spectral_rolloff) / 2

        # Determine dominant state based on tempo and energy
        state = self._calculate_state(tempo, energy, complexity)

        # Normalize to ensure sum = 1.0
        return state.normalize()

    def _calculate_state(self, tempo: float, energy: float, complexity: float) -> BrainwaveState:
        """Calculate raw brainwave values before normalization."""

        # Very slow, low energy = Delta/Theta dominant (sleep/meditation)
        if tempo < 60 and energy < 0.3:
            return BrainwaveState(
                delta=0.35,
                theta=0.40,
                alpha=0.18,
                beta=0.05,
                gamma=0.02,
            )

        # Slow, calm = Theta/Alpha dominant (deep relaxation)
        if tempo < 80 and energy < 0.4:
            return BrainwaveState(
                delta=0.15,
                theta=0.35,
                alpha=0.35,
                beta=0.12,
                gamma=0.03,
            )

        # Medium-slow, relaxed = Alpha dominant (calm awareness)
        if tempo < 100 and energy < 0.5:
            return BrainwaveState(
                delta=0.05,
                theta=0.15,
                alpha=0.50,
                beta=0.25,
                gamma=0.05,
            )

        # Medium tempo = Alpha/Beta balance (relaxed focus)
        if tempo < 120:
            return BrainwaveState(
                delta=0.03,
                theta=0.10,
                alpha=0.30,
                beta=0.45,
                gamma=0.12,
            )

        # Medium-fast = Beta dominant (active, alert)
        if tempo < 140:
            beta_boost = min(energy * 0.2, 0.15)
            return BrainwaveState(
                delta=0.02,
                theta=0.05,
                alpha=0.18,
                beta=0.55 + beta_boost,
                gamma=0.20 - beta_boost,
            )

        # Fast, high energy = Beta/Gamma (high focus, excitement)
        if tempo < 160:
            gamma_boost = min(complexity * 0.15, 0.10)
            return BrainwaveState(
                delta=0.01,
                theta=0.03,
                alpha=0.10,
                beta=0.56,
                gamma=0.30 + gamma_boost,
            )

        # Very fast = Gamma dominant (peak cognitive activity)
        return BrainwaveState(
            delta=0.01,
            theta=0.02,
            alpha=0.07,
            beta=0.50,
            gamma=0.40,
        )


# Singleton instance
brainwave_predictor = BrainwavePredictor()
