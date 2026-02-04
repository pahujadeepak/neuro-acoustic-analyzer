# Brainstorm: Neuro-Acoustic Analyzer

> Generated: 2026-02-03
> Updated: 2026-02-03 (Technical Architecture Finalized)
> Status: Complete
> Next Phase: Specify

## Vision Statement

**"See how music moves through your brain"**

An application that analyzes music from YouTube to visualize brain activation patterns, emotional responses, and brainwave states - making the neuroscience of music accessible and interactive.

---

## Core Features

### 1. YouTube URL Input (Primary & Only Input)
- User provides a YouTube URL
- Video displays in embedded iframe (user can watch)
- Backend extracts audio using **yt-dlp**
- Real-time analysis with ~10 second buffer delay
- Results stream to frontend via WebSocket

### 2. Emotion Classification
Predefined emotion categories displayed for the overall song:

**Basic Emotions:**
- Happy, Sad, Angry, Calm, Excited, Fearful

**Music Moods:**
- Energetic, Melancholic, Uplifting, Tense, Peaceful

### 3. Brain Region Visualization
Interactive brain diagram showing activation of 7 key regions:

| Region | Function | Activation Trigger |
|--------|----------|-------------------|
| Auditory Cortex | Sound processing | Always active during music |
| Amygdala | Emotional response | Intense/emotional moments |
| Hippocampus | Memory triggers | Nostalgic/familiar sounds |
| Nucleus Accumbens | Pleasure/reward (dopamine) | "Chills" moments, drops, climaxes |
| Motor Cortex | Rhythm, movement urge | Strong beats, groove |
| Prefrontal Cortex | Attention, pattern recognition | Complex passages, anticipation |
| Basal Ganglia | Beat/timing processing | Rhythmic sections |

### 4. Timeline Slider
- Per-second granularity
- Visual only (no audio playback from slider)
- Shows segment ranges with active brain regions noted
- As slider moves, all visualizations update
- Syncs with YouTube video playback position

### 5. Frequency Spectrum
Real-time visualization of audio frequencies (updates with slider/playback):

| Band | Frequency Range |
|------|-----------------|
| Bass | 20-250 Hz |
| Low-Mid | 250-500 Hz |
| Mid | 500-2000 Hz |
| High-Mid | 2000-4000 Hz |
| High | 4000-20000 Hz |

### 6. Brainwave State Prediction
Predicted mental state based on audio characteristics:

| Wave | Frequency | Mental State | Music Triggers |
|------|-----------|--------------|----------------|
| Delta | 1-4 Hz | Deep sleep, healing | Slow ambient drones |
| Theta | 4-8 Hz | Meditation, creativity | Lo-fi, nature sounds |
| Alpha | 8-13 Hz | Calm, relaxed | Soft classical, acoustic |
| Beta | 13-38 Hz | Alert, focused | Pop, rock, uptempo |
| Gamma | 30-100 Hz | Peak focus, cognition | Complex classical, jazz |

---

## UI Layout (Real-Time Mode)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [YouTube URL Input]                                    [Analyze]   │
├───────────────────────────────┬─────────────────────────────────────┤
│                               │                                     │
│   ┌───────────────────────┐   │   REAL-TIME ANALYSIS                │
│   │                       │   │                                     │
│   │    YouTube Video      │   │   EMOTION                           │
│   │    (iframe/embed)     │   │   ┌─────────────────────────────┐   │
│   │                       │   │   │ 🎭 Energetic (74%)          │   │
│   │     advancement time   │   │   └─────────────────────────────┘   │
│   │                       │   │                                     │
│   └───────────────────────┘   │   BRAIN REGIONS                     │
│                               │   ┌─────────────────────────────┐   │
│   Now playing: 1:23 / 3:45    │   │      🧠 Brain Diagram       │   │
│                               │   │   [regions lighting up      │   │
│                               │   │    with intensity colors]   │   │
│                               │   └─────────────────────────────┘   │
│                               │                                     │
│                               │   BRAINWAVE STATE                   │
│                               │   ┌─────────────────────────────┐   │
│                               │   │ Beta  ████████████░░ 72%    │   │
│                               │   │ Alpha ████░░░░░░░░░░ 18%    │   │
│                               │   │ Theta ██░░░░░░░░░░░░  7%    │   │
│                               │   │ Delta ░░░░░░░░░░░░░░  3%    │   │
│                               │   └─────────────────────────────┘   │
│                               │                                     │
├───────────────────────────────┴─────────────────────────────────────┤
│  FREQUENCY SPECTRUM (updates in real-time)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Bass ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Highs  │    │
│  │ 20Hz ──────────────────────────────────────────────── 20kHz │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  TIMELINE SLIDER                                                    │
│  ├─────────┼──────────────┼────────────┼──────────────┤             │
│  0:00     0:45          1:30        2:15          3:45              │
│  │ INTRO   │   VERSE 1    │  CHORUS    │   BRIDGE    │              │
│  │Auditory │ Aud+Hippo    │ Motor+Nuc  │ Amyg+Hippo  │              │
│  ├─────────●──────────────────────────────────────────┤             │
│                                                                     │
│  ⏳ Analyzing... 45% complete                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FRONTEND (Next.js)              BACKEND (Next.js API / Python)     │
│  ┌─────────────────┐            ┌─────────────────────────────┐     │
│  │ 1. User enters  │            │                             │     │
│  │    YouTube URL  │ ────────►  │ 2. Extract video ID         │     │
│  └─────────────────┘            │                             │     │
│                                 │ 3. Check cache (future)     │     │
│  ┌─────────────────┐            │    - If cached, return data │     │
│  │ 4. Embed YouTube│            │    - If not, continue...    │     │
│  │    iframe       │            │                             │     │
│  │    (video plays)│            │ 5. yt-dlp extracts audio    │     │
│  └─────────────────┘            │    --extract-audio          │     │
│                                 │    --audio-format mp3       │     │
│                                 │                             │     │
│  ┌─────────────────┐            │ 6. Analyze audio chunks     │     │
│  │ 8. Receive      │ ◄──────    │    - FFT (frequency)        │     │
│  │    analysis via │  WebSocket │    - Tempo detection        │     │
│  │    WebSocket    │            │    - Feature extraction     │     │
│  └─────────────────┘            │                             │     │
│          │                      │ 7. Map to brain/emotions    │     │
│          ▼                      │    (rule-based)             │     │
│  ┌─────────────────┐            │                             │     │
│  │ 9. Update UI    │            │ 10. Save to DB (future)     │     │
│  │    - Brain viz  │            │                             │     │
│  │    - Frequencies│            └─────────────────────────────┘     │
│  │    - Emotions   │                                                │
│  │    - Brainwaves │                                                │
│  └─────────────────┘                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Audio Extraction (yt-dlp)

```bash
# Dependencies required on server:
pip install yt-dlp
apt install ffmpeg

# Extraction command:
yt-dlp --extract-audio --audio-format mp3 -o "output.mp3" "https://youtube.com/watch?v=VIDEO_ID"
```

```typescript
// Node.js integration
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function extractAudioFromYouTube(videoUrl: string): Promise<string> {
  const videoId = extractVideoId(videoUrl);
  const outputPath = `/tmp/audio-${videoId}.mp3`;

  await execAsync(
    `yt-dlp --extract-audio --audio-format mp3 -o "${outputPath}" "${videoUrl}"`
  );

  return outputPath;
}
```

### Real-Time Analysis Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Audio   │    │  Chunk   │    │ Analyze  │    │  Stream  │
│  File    │───►│  Reader  │───►│  Chunk   │───►│  Result  │
│  (MP3)   │    │ (1 sec)  │    │  (FFT)   │    │ (WS)     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │               │
                     ▼               ▼               ▼
               Read 1 sec      Extract:        Send to
               of audio        - Frequencies    frontend
                               - Tempo
                               - Energy
                               - Map to brain
```

### 10-Second Buffer Delay

```
Video Timeline:  0s ────── 10s ────── 20s ────── 30s ─────►
                  │         │          │          │
                  │         │          │          │
Analysis:         │ BUFFER  │◄── Analysis starts showing here
                  │ "Loading│     (10s behind video)
                  │  ..."   │
                  │         │

Why: Ensures we have enough audio data for accurate analysis
```

---

## Data Architecture

### Data Model (per song)

```typescript
interface SongAnalysis {
  id: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  title: string;
  duration: number; // seconds
  thumbnailUrl: string;
  overallEmotion: EmotionCategory;
  analyzedAt: Date;
  segments: AnalysisSegment[];
}

interface AnalysisSegment {
  startTime: number;
  endTime: number;
  segmentLabel?: string; // "intro", "verse", "chorus", etc.

  frequencies: {
    bass: number;      // 0-1 intensity
    lowMid: number;
    mid: number;
    highMid: number;
    high: number;
  };

  brainRegions: {
    auditoryCortex: number;    // 0-1 intensity
    amygdala: number;
    hippocampus: number;
    nucleusAccumbens: number;
    motorCortex: number;
    prefrontalCortex: number;
    basalGanglia: number;
  };

  brainwaves: {
    delta: number;   // 0-1 percentage
    theta: number;
    alpha: number;
    beta: number;
    gamma: number;
  };

  emotion: EmotionCategory;
}

type EmotionCategory =
  | 'happy' | 'sad' | 'angry' | 'calm' | 'excited' | 'fearful'
  | 'energetic' | 'melancholic' | 'uplifting' | 'tense' | 'peaceful';
```

### WebSocket Message Format

```typescript
// Server sends to client
interface AnalysisChunkMessage {
  type: 'analysis_chunk';
  timestamp: number;      // seconds into song
  segment: AnalysisSegment;
}

interface AnalysisCompleteMessage {
  type: 'analysis_complete';
  songAnalysis: SongAnalysis;
}

interface AnalysisProgressMessage {
  type: 'progress';
  percent: number;
  message: string;
}
```

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, TypeScript |
| UI Components | TailwindCSS, Custom brain visualization (SVG/Canvas) |
| Backend API | Next.js API Routes |
| Audio Extraction | yt-dlp (Python CLI) |
| Audio Analysis | Python (librosa) OR Node.js (meyda) |
| Real-time Communication | WebSocket (Socket.io or native) |
| Database | PostgreSQL + Prisma |
| Deployment | Vercel (frontend) + separate server for yt-dlp |

### Why Separate Server for yt-dlp?

Vercel serverless functions have:
- 10-second timeout (hobby) / 60-second (pro)
- No persistent filesystem
- Limited binary execution

**Solution**: Use a separate backend service (Railway, Render, or VPS) for:
- Running yt-dlp
- Audio file processing
- WebSocket connections

---

## Analysis Approach (No AI for MVP)

### Rule-Based Mapping

```typescript
// Example: Map audio features to brain regions
function mapToBrainRegions(features: AudioFeatures): BrainRegions {
  return {
    auditoryCortex: 0.9, // Always high when music plays

    motorCortex: mapRange(features.tempo, 60, 180, 0.2, 1.0),
    // Fast tempo = high motor cortex

    nucleusAccumbens: features.energy > 0.7 ? 0.8 : 0.3,
    // High energy = reward center activation

    amygdala: features.emotionalIntensity,
    // Mapped from dynamics/crescendos

    hippocampus: features.familiarity || 0.3,
    // Could increase for common chord progressions

    prefrontalCortex: features.complexity,
    // Complex passages = more attention

    basalGanglia: features.rhythmStrength,
    // Strong beat = timing circuits
  };
}

// Example: Map to brainwaves
function mapToBrainwaves(features: AudioFeatures): Brainwaves {
  const tempo = features.tempo;
  const energy = features.energy;

  if (tempo < 70 && energy < 0.3) {
    return { delta: 0.4, theta: 0.4, alpha: 0.15, beta: 0.04, gamma: 0.01 };
  } else if (tempo < 100 && energy < 0.5) {
    return { delta: 0.05, theta: 0.2, alpha: 0.5, beta: 0.2, gamma: 0.05 };
  } else if (tempo < 130) {
    return { delta: 0.02, theta: 0.08, alpha: 0.2, beta: 0.6, gamma: 0.1 };
  } else {
    return { delta: 0.01, theta: 0.04, alpha: 0.1, beta: 0.6, gamma: 0.25 };
  }
}
```

---

## Research References

### Neuroscience Sources
- [Harvard Medicine: How Music Resonates in the Brain](https://magazine.hms.harvard.edu/articles/how-music-resonates-brain)
- [PMC/NIH: Music and the Brain](https://pmc.ncbi.nlm.nih.gov/articles/PMC5618809/)
- [Stanford: Music Moves Brain to Pay Attention](https://med.stanford.edu/news/all-news/2007/07/music-moves-brain-to-pay-attention-stanford-study-finds.html)
- [PMC: Impact of Music on Bioelectrical Oscillations](https://pmc.ncbi.nlm.nih.gov/articles/PMC6130927/)

### Key Findings
- Music activates entire brain, but certain regions more than others
- Right hemisphere preferentially activated for emotional experience
- Nucleus accumbens (reward center) activated during "chills" moments
- Brainwave entrainment: music can synchronize brain oscillations
- Different genres stimulate different brain areas

---

## Differentiators

| Us | Competitors |
|----|-------------|
| No hardware required | EEG headsets (BrainBit, NeuroSky) |
| Predicts from audio analysis | Requires real-time brain measurement |
| YouTube integration | Limited to local files |
| Educational + visual | Raw data output |
| Free/accessible | Expensive hardware |
| Real-time visualization | Post-analysis only |

---

## MVP Scope

### In Scope (MVP)
- YouTube URL input only
- Embedded YouTube player
- yt-dlp audio extraction
- Real-time analysis streaming
- Brain region visualization (2D SVG)
- Frequency spectrum display
- Brainwave state bars
- Emotion classification
- Timeline slider with segment markers
- 10-second buffer delay

### Out of Scope (Future)
- Caching/saved analyses
- User accounts
- Analysis history
- Song comparison
- File upload
- Spotify/SoundCloud integration
- 3D brain model
- Export functionality

---

## Open Questions for Specify Phase

1. **Brain Visualization**: 2D SVG diagram or simple regional highlights?
2. **Segment Detection**: Auto-detect verse/chorus or just time-based chunks?
3. **Mobile Support**: Responsive design priority?
4. **Error Handling**: What if yt-dlp fails or video is unavailable?

---

## Next Steps

1. **Specify** → Create formal feature specification with user stories
2. **Architect** → Design technical architecture in detail
3. **Plan** → Break into implementable tasks
4. **Implement** → Build the application

---

_WayPoint Brainstorm Session - neuro-acoustic-analyzer_
_Updated with YouTube-first architecture and yt-dlp integration_
