import numpy as np
import librosa
import logging
from typing import Generator
from dataclasses import dataclass

from src.config import settings

logger = logging.getLogger(__name__)


@dataclass
class AudioFeatures:
    """Features extracted from a 1-second audio chunk."""
    timestamp: float  # Start time in seconds

    # Frequency bands (normalized 0-1)
    bass: float       # 20-250 Hz
    low_mid: float    # 250-500 Hz
    mid: float        # 500-2000 Hz
    high_mid: float   # 2000-4000 Hz
    high: float       # 4000-20000 Hz

    # Rhythm
    tempo: float           # BPM
    beat_strength: float   # 0-1

    # Energy and dynamics
    energy: float          # RMS energy, 0-1
    loudness: float        # dB normalized to 0-1

    # Spectral features
    spectral_centroid: float  # Brightness, normalized
    spectral_rolloff: float   # High frequency content
    spectral_flatness: float  # Noise vs tone

    # Zero crossing rate (percussiveness)
    zcr: float


class AudioProcessor:
    """Processes audio files and extracts features per second."""

    def __init__(self, sample_rate: int = None):
        self.sr = sample_rate or settings.sample_rate
        self.hop_length = 512
        self.n_fft = 2048

        # Frequency band boundaries (in Hz)
        self.freq_bands = {
            'bass': (20, 250),
            'low_mid': (250, 500),
            'mid': (500, 2000),
            'high_mid': (2000, 4000),
            'high': (4000, 20000),
        }

    def load_audio(self, file_path: str) -> tuple[np.ndarray, int]:
        """Load audio file and return samples and sample rate."""
        logger.info(f"Loading audio: {file_path}")

        y, sr = librosa.load(file_path, sr=self.sr, mono=True)
        duration = len(y) / sr

        logger.info(f"Loaded {duration:.1f}s of audio at {sr}Hz")
        return y, sr

    def get_frequency_bands(self, y: np.ndarray) -> dict[str, float]:
        """Extract frequency band intensities from audio chunk."""
        # Compute FFT
        fft = np.abs(librosa.stft(y, n_fft=self.n_fft, hop_length=self.hop_length))

        # Get frequency bins
        freqs = librosa.fft_frequencies(sr=self.sr, n_fft=self.n_fft)

        # Calculate energy in each band
        bands = {}
        for band_name, (low, high) in self.freq_bands.items():
            mask = (freqs >= low) & (freqs < high)
            if np.any(mask):
                band_energy = np.mean(fft[mask, :])
                bands[band_name] = float(band_energy)
            else:
                bands[band_name] = 0.0

        # Normalize to 0-1
        max_energy = max(bands.values()) if bands.values() else 1.0
        if max_energy > 0:
            bands = {k: v / max_energy for k, v in bands.items()}

        return bands

    def get_tempo_features(self, y: np.ndarray, global_tempo: float = None) -> tuple[float, float]:
        """Extract tempo and beat strength."""
        try:
            # Use global tempo if provided, otherwise estimate
            if global_tempo is None:
                tempo, _ = librosa.beat.beat_track(y=y, sr=self.sr)
                tempo = float(tempo)
            else:
                tempo = global_tempo

            # Calculate onset strength as beat indicator
            onset_env = librosa.onset.onset_strength(y=y, sr=self.sr)
            beat_strength = float(np.mean(onset_env))

            # Normalize beat strength
            beat_strength = min(beat_strength / 2.0, 1.0)

            return tempo, beat_strength

        except Exception as e:
            logger.warning(f"Tempo extraction failed: {e}")
            return 120.0, 0.5

    def get_energy_features(self, y: np.ndarray) -> tuple[float, float]:
        """Extract energy and loudness."""
        # RMS energy
        rms = librosa.feature.rms(y=y)[0]
        energy = float(np.mean(rms))

        # Normalize energy (typical range 0-0.5)
        energy = min(energy * 2, 1.0)

        # Loudness in dB
        db = librosa.amplitude_to_db(rms, ref=np.max)
        loudness = float(np.mean(db))

        # Normalize loudness (-80 to 0 dB -> 0 to 1)
        loudness = (loudness + 80) / 80
        loudness = max(0, min(1, loudness))

        return energy, loudness

    def get_spectral_features(self, y: np.ndarray) -> tuple[float, float, float]:
        """Extract spectral features."""
        # Spectral centroid (brightness)
        centroid = librosa.feature.spectral_centroid(y=y, sr=self.sr)[0]
        centroid_mean = float(np.mean(centroid))
        # Normalize (typical range 500-4000 Hz)
        centroid_norm = (centroid_mean - 500) / 3500
        centroid_norm = max(0, min(1, centroid_norm))

        # Spectral rolloff (high frequency content)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=self.sr)[0]
        rolloff_mean = float(np.mean(rolloff))
        # Normalize (typical range 2000-10000 Hz)
        rolloff_norm = (rolloff_mean - 2000) / 8000
        rolloff_norm = max(0, min(1, rolloff_norm))

        # Spectral flatness (noise vs tone)
        flatness = librosa.feature.spectral_flatness(y=y)[0]
        flatness_mean = float(np.mean(flatness))

        return centroid_norm, rolloff_norm, flatness_mean

    def get_zcr(self, y: np.ndarray) -> float:
        """Extract zero crossing rate (percussiveness indicator)."""
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        zcr_mean = float(np.mean(zcr))
        # Normalize (typical range 0-0.2)
        return min(zcr_mean * 5, 1.0)

    def process_chunk(self, y: np.ndarray, timestamp: float, global_tempo: float = None) -> AudioFeatures:
        """Process a single audio chunk and extract all features."""
        # Frequency bands
        bands = self.get_frequency_bands(y)

        # Tempo and rhythm
        tempo, beat_strength = self.get_tempo_features(y, global_tempo)

        # Energy
        energy, loudness = self.get_energy_features(y)

        # Spectral
        centroid, rolloff, flatness = self.get_spectral_features(y)

        # ZCR
        zcr = self.get_zcr(y)

        return AudioFeatures(
            timestamp=timestamp,
            bass=bands['bass'],
            low_mid=bands['low_mid'],
            mid=bands['mid'],
            high_mid=bands['high_mid'],
            high=bands['high'],
            tempo=tempo,
            beat_strength=beat_strength,
            energy=energy,
            loudness=loudness,
            spectral_centroid=centroid,
            spectral_rolloff=rolloff,
            spectral_flatness=flatness,
            zcr=zcr,
        )

    def process_audio(self, file_path: str, chunk_duration: float = 1.0) -> Generator[AudioFeatures, None, None]:
        """
        Process entire audio file in chunks.

        Args:
            file_path: Path to audio file
            chunk_duration: Duration of each chunk in seconds

        Yields:
            AudioFeatures for each chunk
        """
        # Load audio
        y, sr = self.load_audio(file_path)
        total_duration = len(y) / sr

        # Get global tempo for consistency
        global_tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        global_tempo = float(global_tempo)
        logger.info(f"Global tempo: {global_tempo:.1f} BPM")

        # Process in chunks
        chunk_samples = int(chunk_duration * sr)

        for i in range(0, len(y), chunk_samples):
            chunk = y[i:i + chunk_samples]

            # Skip if chunk is too short
            if len(chunk) < chunk_samples // 2:
                continue

            # Pad if needed
            if len(chunk) < chunk_samples:
                chunk = np.pad(chunk, (0, chunk_samples - len(chunk)))

            timestamp = i / sr
            features = self.process_chunk(chunk, timestamp, global_tempo)

            yield features

        logger.info(f"Processed {total_duration:.1f}s of audio")


# Singleton instance
processor = AudioProcessor()
