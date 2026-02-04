# Technical Architecture Plan: Neuro-Acoustic Analyzer

> **Version**: 1.0
> **Status**: Draft
> **Author**: Architect Agent
> **Created**: 2026-02-03
> **Specification**: [neuro-acoustic-analyzer.md](../specs/neuro-acoustic-analyzer.md)

---

## 1. Executive Summary

### 1.1 Architecture Overview

The Neuro-Acoustic Analyzer is a **two-service architecture**:

1. **Frontend Application** (Vercel) - Next.js app handling UI and API gateway
2. **Audio Processing Service** (Railway) - Python service for audio extraction and analysis

This separation is driven by Vercel's serverless limitations (no persistent processes, limited binary execution, short timeouts).

### 1.2 Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend hosting | Vercel | Optimal for Next.js, free tier sufficient for MVP |
| Audio service hosting | Railway | Supports Docker, persistent processes, WebSockets |
| Audio extraction | yt-dlp (Python) | Most reliable YouTube extractor, actively maintained |
| Audio analysis | librosa (Python) | Industry standard for audio analysis |
| Real-time communication | Socket.io | Battle-tested, handles reconnection gracefully |
| State management | React Context + hooks | Simple, no external deps for MVP |

---

## 2. System Architecture

### 2.1 High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE OVERVIEW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            ┌──────────────────┐                             │
│                            │      USER        │                             │
│                            │    (Browser)     │                             │
│                            └────────┬─────────┘                             │
│                                     │                                       │
│                    ┌────────────────┼────────────────┐                      │
│                    │ HTTPS          │           WSS  │                      │
│                    ▼                │                ▼                      │
│  ┌─────────────────────────────┐    │    ┌─────────────────────────────┐    │
│  │         VERCEL              │    │    │        RAILWAY              │    │
│  │    ┌─────────────────┐      │    │    │   ┌─────────────────┐       │    │
│  │    │   Next.js App   │      │    │    │   │  Audio Service  │       │    │
│  │    │  ┌───────────┐  │      │    │    │   │  ┌───────────┐  │       │    │
│  │    │  │  Pages    │  │      │    │    │   │  │  yt-dlp   │  │       │    │
│  │    │  │  API      │──┼──────┼────┼────┼───┼─►│  librosa  │  │       │    │
│  │    │  │  Components│ │      │    │    │   │  │  Socket.io│  │       │    │
│  │    │  └───────────┘  │      │    │    │   │  └───────────┘  │       │    │
│  │    └─────────────────┘      │    │    │   └─────────────────┘       │    │
│  └─────────────────────────────┘    │    └─────────────────────────────┘    │
│                                     │                                       │
│                            ┌────────┴─────────┐                             │
│                            │     YouTube      │                             │
│                            │    (External)    │                             │
│                            └──────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Service Responsibilities

#### Frontend (Vercel - Next.js)

| Responsibility | Implementation |
|----------------|----------------|
| Serve UI | Next.js App Router pages |
| URL validation | API route with Zod schema |
| Rate limiting | Middleware (IP-based) |
| Initiate analysis | POST to Audio Service |
| Display visualizations | React components |
| Manage WebSocket | Client-side Socket.io |

#### Audio Service (Railway - Python)

| Responsibility | Implementation |
|----------------|----------------|
| REST API | FastAPI |
| YouTube extraction | yt-dlp subprocess |
| Audio analysis | librosa (FFT, tempo, features) |
| Brain mapping | Rule-based mapper |
| Stream results | Socket.io server |
| Cleanup | Auto-delete temp files |

---

## 3. Component Design

### 3.1 Frontend Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── analyze/
│   │   └── [videoId]/
│   │       └── page.tsx          # Analysis page (dynamic route)
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles (Tailwind)
│
├── components/                   # React Components
│   ├── ui/                       # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── tooltip.tsx
│   │
│   ├── url-input.tsx             # YouTube URL input + validation
│   ├── video-player.tsx          # YouTube iframe embed
│   ├── analysis-panel.tsx        # Container for all visualizations
│   │
│   ├── brain-diagram/
│   │   ├── brain-diagram.tsx     # Main component
│   │   ├── brain-svg.tsx         # SVG paths for regions
│   │   └── region-tooltip.tsx    # Hover tooltip
│   │
│   ├── frequency-spectrum.tsx    # 5-band frequency bars
│   ├── brainwave-chart.tsx       # 5 brainwave type bars
│   ├── emotion-badge.tsx         # Current emotion display
│   └── timeline-slider.tsx       # Song timeline scrubber
│
├── lib/                          # Utilities and domain logic
│   ├── analysis/
│   │   ├── types.ts              # TypeScript types
│   │   ├── constants.ts          # Brain regions, emotions
│   │   └── mappers.ts            # Data transformation utilities
│   │
│   ├── youtube/
│   │   ├── url-parser.ts         # Extract video ID from URL
│   │   └── embed.ts              # Embed URL builder
│   │
│   └── api/
│       └── client.ts             # API client functions
│
├── hooks/
│   ├── use-analysis.ts           # Main analysis state management
│   ├── use-websocket.ts          # WebSocket connection
│   └── use-video-sync.ts         # Sync slider with video time
│
├── providers/
│   └── analysis-provider.tsx     # React context for analysis state
│
└── config/
    └── env.ts                    # Environment variables
```

### 3.2 Audio Service Structure

```
audio-service/
├── src/
│   ├── main.py                   # FastAPI app entry point
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py             # REST endpoints
│   │   └── schemas.py            # Pydantic models
│   │
│   ├── extractor/
│   │   ├── __init__.py
│   │   └── youtube.py            # yt-dlp wrapper
│   │
│   ├── analyzer/
│   │   ├── __init__.py
│   │   ├── audio_processor.py    # FFT, feature extraction
│   │   ├── brain_mapper.py       # Feature → brain region
│   │   ├── emotion_classifier.py # Feature → emotion
│   │   └── brainwave_predictor.py# Feature → brainwave state
│   │
│   ├── websocket/
│   │   ├── __init__.py
│   │   ├── server.py             # Socket.io server
│   │   └── messages.py           # Message types
│   │
│   └── utils/
│       ├── __init__.py
│       └── cleanup.py            # Temp file cleanup
│
├── tests/
│   └── ...
│
├── requirements.txt
├── Dockerfile
├── docker-compose.yml            # Local development
└── railway.json                  # Railway config
```

### 3.3 Component Details

#### URLInput Component

```typescript
// components/url-input.tsx
interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

// Responsibilities:
// - Render input field and submit button
// - Client-side URL format validation
// - Show validation errors inline
// - Disable during loading state
```

#### BrainDiagram Component

```typescript
// components/brain-diagram/brain-diagram.tsx
interface BrainDiagramProps {
  activation: BrainRegionActivation;
  onRegionHover?: (regionId: string | null) => void;
}

// Responsibilities:
// - Render SVG brain outline
// - Color each region based on activation (0-1)
// - Use gradient from blue (low) to red (high)
// - Show tooltip on hover with region name/description
// - Smooth transitions between states (CSS)
```

#### TimelineSlider Component

```typescript
// components/timeline-slider.tsx
interface TimelineSliderProps {
  duration: number;           // Total seconds
  currentTime: number;        // Current position
  segments: AnalysisSegment[];
  onSeek: (time: number) => void;
}

// Responsibilities:
// - Render slider track with segment markers
// - Display time labels (current / total)
// - Handle drag interactions
// - Call onSeek when user scrubs
// - Auto-advance during playback (controlled externally)
```

---

## 4. Data Models

### 4.1 Core Types

```typescript
// lib/analysis/types.ts

// ============ Value Objects ============

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
}

// ============ Analysis Domain ============

export interface FrequencyBands {
  bass: number;      // 20-250 Hz, normalized 0-1
  lowMid: number;    // 250-500 Hz
  mid: number;       // 500-2000 Hz
  highMid: number;   // 2000-4000 Hz
  high: number;      // 4000-20000 Hz
}

export interface BrainRegionActivation {
  auditoryCortex: number;
  amygdala: number;
  hippocampus: number;
  nucleusAccumbens: number;
  motorCortex: number;
  prefrontalCortex: number;
  basalGanglia: number;
}

export interface BrainwaveState {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface EmotionClassification {
  primary: EmotionCategory;
  confidence: number;
}

export type EmotionCategory =
  | 'happy' | 'sad' | 'angry' | 'calm' | 'excited' | 'fearful'
  | 'energetic' | 'melancholic' | 'uplifting' | 'tense' | 'peaceful';

// ============ Analysis Segment (1 second of audio) ============

export interface AnalysisSegment {
  startTime: number;
  endTime: number;
  frequencies: FrequencyBands;
  brainRegions: BrainRegionActivation;
  brainwaves: BrainwaveState;
  emotion: EmotionClassification;
}

// ============ Full Song Analysis ============

export interface SongAnalysis {
  id: string;
  video: YouTubeVideo;
  overallEmotion: EmotionClassification;
  segments: AnalysisSegment[];
  analyzedAt: string; // ISO date
}

// ============ Job State ============

export type AnalysisStatus =
  | 'pending'
  | 'extracting'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisJob {
  jobId: string;
  videoId: string;
  status: AnalysisStatus;
  progress: number;
  error?: string;
}
```

### 4.2 API Request/Response Types

```typescript
// lib/api/types.ts

// POST /api/analyze
export interface AnalyzeRequest {
  youtubeUrl: string;
}

export interface AnalyzeResponse {
  jobId: string;
  videoId: string;
  videoTitle: string;
  duration: number;
  websocketUrl: string;
}

export interface AnalyzeErrorResponse {
  error: string;
  code: 'INVALID_URL' | 'VIDEO_UNAVAILABLE' | 'RATE_LIMITED' | 'SERVICE_ERROR';
}
```

### 4.3 WebSocket Message Types

```typescript
// lib/websocket/types.ts

// Server → Client
export type ServerMessage =
  | { type: 'connected'; jobId: string }
  | { type: 'progress'; status: AnalysisStatus; progress: number; message: string }
  | { type: 'chunk'; timestamp: number; segment: AnalysisSegment }
  | { type: 'complete'; analysis: SongAnalysis }
  | { type: 'error'; code: string; message: string };

// Client → Server
export type ClientMessage =
  | { type: 'start'; videoId: string }
  | { type: 'seek'; timestamp: number };
```

---

## 5. API Contracts

### 5.1 REST Endpoints

#### POST /api/analyze

Initiates analysis of a YouTube video.

**Request:**
```http
POST /api/analyze
Content-Type: application/json

{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Success Response (200):**
```json
{
  "jobId": "job_abc123",
  "videoId": "dQw4w9WgXcQ",
  "videoTitle": "Rick Astley - Never Gonna Give You Up",
  "duration": 213,
  "websocketUrl": "wss://audio-service.railway.app/ws/job_abc123"
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_URL` | URL format is invalid |
| 400 | `VIDEO_UNAVAILABLE` | Video is private or doesn't exist |
| 429 | `RATE_LIMITED` | Too many requests (10/min/IP) |
| 503 | `SERVICE_ERROR` | Audio service unavailable |

### 5.2 WebSocket Protocol

#### Connection

```
wss://audio-service.railway.app/ws/{jobId}
```

#### Message Flow

```
Client                          Server
   │                               │
   │ ──── connect ────────────────►│
   │                               │
   │ ◄─── connected ──────────────│
   │      {type: "connected",     │
   │       jobId: "..."}          │
   │                               │
   │ ──── start ──────────────────►│
   │      {type: "start",         │
   │       videoId: "..."}        │
   │                               │
   │ ◄─── progress ───────────────│
   │      {status: "extracting",  │
   │       progress: 10}          │
   │                               │
   │ ◄─── progress ───────────────│
   │      {status: "analyzing",   │
   │       progress: 15}          │
   │                               │
   │ ◄─── chunk ──────────────────│
   │      {timestamp: 0,          │
   │       segment: {...}}        │
   │                               │
   │ ◄─── chunk ──────────────────│
   │      {timestamp: 1, ...}     │
   │        ... (per second)      │
   │                               │
   │ ◄─── complete ───────────────│
   │      {analysis: {...}}       │
   │                               │
```

---

## 6. Brain Mapping Algorithm

### 6.1 Audio Feature Extraction

Using librosa, we extract per-second:

```python
# analyzer/audio_processor.py

def extract_features(audio_chunk, sr=22050):
    """Extract audio features from a 1-second chunk."""

    # Frequency spectrum (FFT)
    fft = np.abs(librosa.stft(audio_chunk))

    # Split into frequency bands
    frequencies = {
        'bass': np.mean(fft[0:10]),      # 20-250 Hz
        'lowMid': np.mean(fft[10:20]),   # 250-500 Hz
        'mid': np.mean(fft[20:80]),      # 500-2000 Hz
        'highMid': np.mean(fft[80:160]), # 2000-4000 Hz
        'high': np.mean(fft[160:]),      # 4000+ Hz
    }

    # Normalize to 0-1
    max_val = max(frequencies.values()) or 1
    frequencies = {k: v/max_val for k, v in frequencies.items()}

    # Tempo and beat strength
    tempo, beat_frames = librosa.beat.beat_track(y=audio_chunk, sr=sr)

    # RMS energy
    energy = float(np.mean(librosa.feature.rms(y=audio_chunk)))

    # Spectral centroid (brightness)
    centroid = float(np.mean(librosa.feature.spectral_centroid(y=audio_chunk, sr=sr)))

    return {
        'frequencies': frequencies,
        'tempo': tempo,
        'energy': energy,
        'centroid': centroid,
        'beat_strength': len(beat_frames) / (len(audio_chunk) / sr),
    }
```

### 6.2 Brain Region Mapping Rules

```python
# analyzer/brain_mapper.py

def map_to_brain_regions(features):
    """Map audio features to brain region activation."""

    tempo = features['tempo']
    energy = features['energy']
    bass = features['frequencies']['bass']
    beat_strength = features['beat_strength']
    centroid = features['centroid']

    return {
        # Always active when music plays
        'auditoryCortex': min(0.6 + energy * 0.4, 1.0),

        # Rhythm and movement
        'motorCortex': _map_range(tempo, 60, 180, 0.2, 1.0) * beat_strength,

        # Beat timing
        'basalGanglia': beat_strength * 0.8 + bass * 0.2,

        # Reward/pleasure (high energy + bass = dopamine)
        'nucleusAccumbens': (energy * 0.6 + bass * 0.4) if energy > 0.6 else 0.3,

        # Emotional intensity
        'amygdala': _calculate_emotional_intensity(features),

        # Memory (familiarity proxy: common progressions, repetition)
        'hippocampus': 0.3,  # Base level, would need more analysis

        # Attention (complexity)
        'prefrontalCortex': _map_range(centroid, 1000, 4000, 0.3, 0.9),
    }

def _map_range(value, in_min, in_max, out_min, out_max):
    """Map value from input range to output range."""
    clamped = max(in_min, min(value, in_max))
    return out_min + (clamped - in_min) * (out_max - out_min) / (in_max - in_min)

def _calculate_emotional_intensity(features):
    """Calculate emotional intensity from dynamic range."""
    energy = features['energy']
    # High energy or very low energy = emotional
    if energy > 0.7 or energy < 0.2:
        return 0.8
    return 0.4
```

### 6.3 Brainwave Prediction Rules

```python
# analyzer/brainwave_predictor.py

def predict_brainwaves(features):
    """Predict brainwave state from audio features."""

    tempo = features['tempo']
    energy = features['energy']

    # Slow + low energy = relaxation states
    if tempo < 70 and energy < 0.3:
        return {
            'delta': 0.35, 'theta': 0.40, 'alpha': 0.20, 'beta': 0.04, 'gamma': 0.01
        }

    # Medium tempo + low-medium energy = relaxed alertness
    if tempo < 100 and energy < 0.5:
        return {
            'delta': 0.05, 'theta': 0.15, 'alpha': 0.50, 'beta': 0.25, 'gamma': 0.05
        }

    # Medium-high tempo = alert/active
    if tempo < 140:
        return {
            'delta': 0.02, 'theta': 0.08, 'alpha': 0.20, 'beta': 0.55, 'gamma': 0.15
        }

    # Fast tempo + high energy = high focus/excitement
    return {
        'delta': 0.01, 'theta': 0.04, 'alpha': 0.10, 'beta': 0.55, 'gamma': 0.30
    }
```

### 6.4 Emotion Classification Rules

```python
# analyzer/emotion_classifier.py

def classify_emotion(features):
    """Classify emotion from audio features."""

    tempo = features['tempo']
    energy = features['energy']
    frequencies = features['frequencies']

    # Major/minor mode detection would improve this
    # For MVP, use tempo + energy heuristics

    if energy > 0.7 and tempo > 120:
        return {'primary': 'energetic', 'confidence': 0.75}

    if energy > 0.6 and tempo > 100:
        return {'primary': 'happy', 'confidence': 0.65}

    if energy < 0.3 and tempo < 80:
        if frequencies['bass'] > 0.5:
            return {'primary': 'melancholic', 'confidence': 0.70}
        return {'primary': 'calm', 'confidence': 0.70}

    if energy > 0.7 and frequencies['bass'] > 0.7:
        return {'primary': 'excited', 'confidence': 0.65}

    if tempo > 140:
        return {'primary': 'tense', 'confidence': 0.60}

    # Default
    return {'primary': 'peaceful', 'confidence': 0.50}
```

---

## 7. Deployment Architecture

### 7.1 Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT DIAGRAM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                         VERCEL                               │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                   │   │
│  │  │   Edge Network  │  │   Serverless    │                   │   │
│  │  │   (CDN)         │  │   Functions     │                   │   │
│  │  │                 │  │                 │                   │   │
│  │  │  Static assets  │  │  /api/analyze   │                   │   │
│  │  │  Next.js pages  │  │                 │                   │   │
│  │  └─────────────────┘  └─────────────────┘                   │   │
│  │                                                              │   │
│  │  Domain: neuro-acoustic-analyzer.vercel.app                  │   │
│  │  (or custom domain)                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        RAILWAY                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │              Docker Container                        │    │   │
│  │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐          │    │   │
│  │  │  │  FastAPI  │ │  yt-dlp   │ │  librosa  │          │    │   │
│  │  │  │  + uvicorn│ │  + ffmpeg │ │  + numpy  │          │    │   │
│  │  │  └───────────┘ └───────────┘ └───────────┘          │    │   │
│  │  │                                                      │    │   │
│  │  │  Ports: 8000 (HTTP), 8001 (WebSocket)               │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                              │   │
│  │  Domain: audio-service-xxx.railway.app                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Environment Variables

#### Frontend (Vercel)

```env
# .env.local
NEXT_PUBLIC_AUDIO_SERVICE_URL=https://audio-service-xxx.railway.app
NEXT_PUBLIC_WEBSOCKET_URL=wss://audio-service-xxx.railway.app
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

#### Audio Service (Railway)

```env
# Railway environment
PORT=8000
WS_PORT=8001
TEMP_DIR=/tmp/audio
MAX_AUDIO_DURATION=600
CLEANUP_INTERVAL_SECONDS=300
ALLOWED_ORIGINS=https://neuro-acoustic-analyzer.vercel.app
```

### 7.3 Docker Configuration

```dockerfile
# audio-service/Dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp
RUN pip install yt-dlp

# Copy application
COPY src/ ./src/

# Run
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```txt
# audio-service/requirements.txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-socketio==5.10.0
librosa==0.10.1
numpy==1.26.3
pydantic==2.5.3
```

---

## 8. Error Handling Strategy

### 8.1 Error Categories

| Category | Example | User Message | Recovery |
|----------|---------|--------------|----------|
| Validation | Invalid URL format | "Please enter a valid YouTube URL" | User corrects input |
| Extraction | Video unavailable | "This video is unavailable or private" | User tries different video |
| Processing | Analysis failed | "Something went wrong. Please try again" | Retry button |
| Network | WebSocket disconnect | "Connection lost. Reconnecting..." | Auto-reconnect |
| Rate Limit | Too many requests | "Please wait before analyzing another video" | Show countdown |

### 8.2 Retry Strategy

```typescript
// lib/websocket/client.ts

const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

function connectWithRetry(url: string, attempt = 0): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const socket = io(url, { transports: ['websocket'] });

    socket.on('connect', () => resolve(socket));

    socket.on('connect_error', (error) => {
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
          RETRY_CONFIG.maxDelay
        );
        setTimeout(() => {
          connectWithRetry(url, attempt + 1).then(resolve).catch(reject);
        }, delay);
      } else {
        reject(error);
      }
    });
  });
}
```

---

## 9. Security Considerations

### 9.1 Input Validation

```typescript
// app/api/analyze/route.ts
import { z } from 'zod';

const youtubeUrlSchema = z.string()
  .url()
  .refine(
    (url) => {
      const patterns = [
        /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
        /^https?:\/\/youtu\.be\/[\w-]+/,
      ];
      return patterns.some(p => p.test(url));
    },
    { message: 'Must be a valid YouTube URL' }
  );
```

### 9.2 Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/analyze')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Rate limited', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
      );
    }
  }
}
```

### 9.3 CORS Configuration

```python
# audio-service/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

---

## 10. Testing Strategy

### 10.1 Frontend Tests

| Test Type | Tool | Coverage |
|-----------|------|----------|
| Unit | Vitest | Components, hooks, utils |
| Integration | Vitest + MSW | API routes, WebSocket mocking |
| E2E | Playwright (future) | Full user flows |

### 10.2 Audio Service Tests

| Test Type | Tool | Coverage |
|-----------|------|----------|
| Unit | pytest | Mapper functions, classifiers |
| Integration | pytest | Full analysis pipeline |
| Load | locust (future) | Concurrent analysis capacity |

---

## 11. Implementation Order

### Phase 1: Foundation
1. Set up Next.js project with TypeScript + Tailwind
2. Create basic page structure
3. Implement URLInput component
4. Set up API route skeleton

### Phase 2: Audio Service
5. Set up Python FastAPI project
6. Implement yt-dlp extraction
7. Implement librosa analysis
8. Implement brain mapping rules
9. Set up WebSocket server

### Phase 3: Integration
10. Connect frontend to audio service
11. Implement WebSocket client
12. Build real-time visualization components

### Phase 4: Visualization
13. Build BrainDiagram component (SVG)
14. Build FrequencySpectrum component
15. Build BrainwaveChart component
16. Build TimelineSlider component

### Phase 5: Polish
17. Error handling and loading states
18. Rate limiting
19. Deployment configuration
20. Testing

---

## 12. Architecture Decision Records (ADRs)

### ADR-001: Two-Service Architecture

**Status**: Accepted

**Context**: Vercel serverless functions have timeout limits (10s hobby, 60s pro) and cannot run binary executables like yt-dlp reliably.

**Decision**: Split into frontend (Vercel) and audio service (Railway).

**Consequences**:
- (+) Each service optimized for its purpose
- (+) Audio service can scale independently
- (-) More complex deployment
- (-) Network latency between services

### ADR-002: Python for Audio Service

**Status**: Accepted

**Context**: Need reliable audio analysis and YouTube extraction.

**Decision**: Use Python with librosa and yt-dlp.

**Consequences**:
- (+) librosa is the industry standard for audio analysis
- (+) yt-dlp has best YouTube support
- (+) Large ecosystem for audio/ML
- (-) Team needs Python knowledge
- (-) Slower than native implementations

### ADR-003: Rule-Based Analysis (No ML for MVP)

**Status**: Accepted

**Context**: ML models for emotion detection require training data and compute resources.

**Decision**: Use rule-based mapping from audio features to brain/emotions for MVP.

**Consequences**:
- (+) Simpler to implement and debug
- (+) No model training needed
- (+) Predictable results
- (-) Less accurate than ML approach
- (-) May need to add ML later for better accuracy

---

## 13. Appendix

### 13.1 Related Documents

- [Product Specification](../specs/neuro-acoustic-analyzer.md)
- [Brainstorm Document](../specs/brainstorm-neuro-acoustic.md)
- [Project Constitution](../constitution.md)

### 13.2 External References

- [librosa Documentation](https://librosa.org/doc/latest/index.html)
- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)

---

_WayPoint Technical Architecture Plan - neuro-acoustic-analyzer_
_Generated by Architect Agent_
