# Product Specification: Neuro-Acoustic Analyzer

> **Version**: 1.0
> **Status**: Draft
> **Author**: Product Manager Agent
> **Created**: 2026-02-03
> **Last Updated**: 2026-02-03

---

## 1. Overview

### 1.1 Product Vision

**"See how music moves through your brain"**

Neuro-Acoustic Analyzer is a web application that analyzes music from YouTube to visualize brain activation patterns, emotional responses, frequency spectrums, and brainwave states - making the neuroscience of music accessible and interactive without requiring expensive EEG hardware.

### 1.2 Problem Statement

People are curious about why certain music affects them emotionally, but:
- EEG devices are expensive ($200-$500+)
- Neuroscience research is inaccessible to casual users
- No simple tool exists to visualize music's effect on the brain

### 1.3 Solution

A web app that uses audio analysis and neuroscience research to **predict** brain activation and emotional responses from any YouTube song, displayed through intuitive real-time visualizations.

### 1.4 Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Analysis completion rate | > 90% of valid URLs |
| Time to first visualization | < 15 seconds |
| User engagement | User explores timeline slider |

---

## 2. User Personas

### 2.1 Alex - Curious Music Lover

| Attribute | Details |
|-----------|---------|
| **Role** | Music enthusiast, casual user |
| **Age Range** | 18-35 |
| **Goal** | Understand why certain songs evoke strong emotions |
| **Tech Level** | Basic - uses YouTube daily |
| **Key Need** | Simple interface, quick results, visual appeal |
| **Quote** | "I want to know why this song gives me chills" |

### 2.2 Jordan - Music Producer / DJ

| Attribute | Details |
|-----------|---------|
| **Role** | Creates/selects music professionally |
| **Age Range** | 22-40 |
| **Goal** | Understand emotional impact of tracks for sets/productions |
| **Tech Level** | Intermediate |
| **Key Need** | Detailed frequency data, energy flow analysis |
| **Quote** | "I need to know where this track peaks for my mix" |

### 2.3 Sam - Wellness Practitioner

| Attribute | Details |
|-----------|---------|
| **Role** | Uses music for therapy/meditation |
| **Age Range** | 28-55 |
| **Goal** | Find music that promotes specific brain states |
| **Tech Level** | Basic to intermediate |
| **Key Need** | Brainwave information, calming vs energizing classification |
| **Quote** | "Is this track good for alpha state meditation?" |

---

## 3. User Scenarios

### 3.1 First-Time Analysis

**Actor**: Alex (Curious Music Lover)
**Trigger**: Heard a song that gave them chills, wants to understand why

**Flow**:
1. Opens neuro-acoustic-analyzer.com
2. Pastes YouTube URL of the song
3. Clicks "Analyze"
4. Sees YouTube video embed + "Analyzing..." indicator
5. After ~10 seconds, visualizations start appearing
6. Watches brain regions light up as song plays
7. Notices "Nucleus Accumbens" spikes during the drop
8. Explores timeline slider to revisit specific moments

**Success Outcome**: "Now I understand why this song hits different!"

### 3.2 Track Selection for DJ Set

**Actor**: Jordan (Music Producer)
**Trigger**: Preparing a DJ set, needs to understand energy flow

**Flow**:
1. Opens the app
2. Pastes URL of a potential track
3. Watches real-time analysis while video plays
4. Monitors frequency spectrum and emotion shifts
5. Uses timeline slider to identify transition points
6. Notes energy peaks for mixing decisions

**Success Outcome**: "I know exactly where this track fits in my set"

### 3.3 Finding Meditation Music

**Actor**: Sam (Wellness Practitioner)
**Trigger**: Wants music for a meditation session

**Flow**:
1. Opens the app
2. Pastes URL of ambient/meditation track
3. Analyzes the track
4. Checks brainwave predictions (looking for Alpha/Theta dominance)
5. Confirms emotion classification shows "Calm/Peaceful"

**Success Outcome**: "Confirmed this promotes alpha/theta states"

### 3.4 Error Recovery

**Actor**: Any user
**Trigger**: Pastes invalid or unavailable YouTube URL

**Flow**:
1. User pastes broken/private video URL
2. Clicks "Analyze"
3. System attempts to extract audio
4. Extraction fails
5. User sees friendly error message
6. Prompted to try another URL

**Success Outcome**: Clear feedback, user tries valid URL

---

## 4. Functional Requirements

### 4.1 Requirements Summary

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR1 | YouTube URL Input | P0 | Planned |
| FR2 | Video Embedding | P0 | Planned |
| FR3 | Audio Extraction | P0 | Planned |
| FR4 | Real-Time Analysis Streaming | P0 | Planned |
| FR5 | Brain Region Visualization | P0 | Planned |
| FR6 | Frequency Spectrum Display | P0 | Planned |
| FR7 | Brainwave State Display | P0 | Planned |
| FR8 | Emotion Classification | P0 | Planned |
| FR9 | Timeline Slider | P0 | Planned |
| FR10 | Error Handling | P0 | Planned |

### 4.2 Detailed Requirements

#### FR1: YouTube URL Input

**Description**: User can input a YouTube video URL to analyze

**Acceptance Criteria**:
- [ ] Input field prominently displayed on homepage
- [ ] Accepts youtube.com URLs (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
- [ ] Accepts youtu.be URLs (e.g., `https://youtu.be/VIDEO_ID`)
- [ ] Validates URL format before processing
- [ ] Extracts video ID from URL
- [ ] Shows inline validation error for invalid URLs
- [ ] "Analyze" button triggers processing

#### FR2: Video Embedding

**Description**: Display YouTube video in embedded player alongside analysis

**Acceptance Criteria**:
- [ ] YouTube iframe appears after valid URL submission
- [ ] Video is playable (play/pause controls work)
- [ ] Video timestamp is accessible for sync with visualizations
- [ ] Iframe is responsive (scales with container)
- [ ] Video and analysis panel displayed side-by-side (desktop)

#### FR3: Audio Extraction

**Description**: Extract audio from YouTube video using backend service

**Acceptance Criteria**:
- [ ] Backend receives YouTube URL from frontend
- [ ] Uses yt-dlp to extract audio stream
- [ ] Converts to MP3 format for analysis
- [ ] Stores temporarily for processing
- [ ] Cleans up audio file after analysis complete
- [ ] Returns appropriate error if extraction fails

#### FR4: Real-Time Analysis Streaming

**Description**: Stream analysis results to frontend as they're computed

**Acceptance Criteria**:
- [ ] WebSocket connection established on analysis start
- [ ] Analysis computed per-second of audio
- [ ] Results streamed as JSON chunks to frontend
- [ ] 10-second buffer delay before visualization starts
- [ ] Progress indicator shows "Analyzing... X%" during buffer
- [ ] "Analysis complete" message when finished
- [ ] Connection gracefully handles disconnects

#### FR5: Brain Region Visualization

**Description**: Display 2D brain diagram with region highlighting

**Acceptance Criteria**:
- [ ] SVG or Canvas-based brain diagram
- [ ] 7 regions visualized:
  - Auditory Cortex
  - Amygdala
  - Hippocampus
  - Nucleus Accumbens
  - Motor Cortex
  - Prefrontal Cortex
  - Basal Ganglia
- [ ] Regions highlight with color intensity (0-100%)
- [ ] Colors indicate activation level (e.g., blue→red gradient)
- [ ] Updates in sync with video playback / slider position
- [ ] Hover/tap on region shows name and function tooltip

#### FR6: Frequency Spectrum Display

**Description**: Show audio frequency bands visualization

**Acceptance Criteria**:
- [ ] Displays 5 frequency bands:
  - Bass (20-250 Hz)
  - Low-Mid (250-500 Hz)
  - Mid (500-2000 Hz)
  - High-Mid (2000-4000 Hz)
  - High (4000-20000 Hz)
- [ ] Visual bars show relative intensity (0-100%)
- [ ] Updates in real-time with analysis stream
- [ ] Labels clearly identify each band

#### FR7: Brainwave State Display

**Description**: Show predicted brainwave state percentages

**Acceptance Criteria**:
- [ ] Displays 5 brainwave types:
  - Delta (1-4 Hz) - Deep sleep
  - Theta (4-8 Hz) - Meditation
  - Alpha (8-13 Hz) - Relaxed
  - Beta (13-38 Hz) - Alert
  - Gamma (30-100 Hz) - Focus
- [ ] Shows percentage for each (totaling ~100%)
- [ ] Visual bars or pie chart representation
- [ ] Updates with timeline position
- [ ] Tooltip explains what each brainwave state means

#### FR8: Emotion Classification

**Description**: Display detected emotion category for current segment

**Acceptance Criteria**:
- [ ] Shows primary emotion from predefined categories:
  - Basic: Happy, Sad, Angry, Calm, Excited, Fearful
  - Music Moods: Energetic, Melancholic, Uplifting, Tense, Peaceful
- [ ] Displays confidence percentage (e.g., "Energetic 74%")
- [ ] Updates per segment as analysis progresses
- [ ] Overall song emotion displayed prominently

#### FR9: Timeline Slider

**Description**: Interactive timeline to explore song sections

**Acceptance Criteria**:
- [ ] Slider spans full song duration (0 to song length)
- [ ] Current position indicator (thumb)
- [ ] Time labels (current time / total duration)
- [ ] Dragging slider updates all visualizations instantly
- [ ] Segment markers shown if detected (intro, verse, chorus)
- [ ] Slider is view-only (does NOT control YouTube playback)
- [ ] Slider auto-advances during real-time analysis

#### FR10: Error Handling

**Description**: Graceful error handling for all failure scenarios

**Acceptance Criteria**:
- [ ] Invalid URL format: Inline validation message
- [ ] Private/unavailable video: "This video is unavailable. Please try another."
- [ ] yt-dlp extraction failure: "Couldn't analyze this video. Please try another."
- [ ] Network error: "Connection lost. Retrying..." with auto-retry
- [ ] WebSocket disconnect: Auto-reconnect with message
- [ ] All errors are user-friendly (no technical jargon)

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Initial page load | < 3 seconds | Lighthouse |
| Time to analysis start | < 15 seconds | From URL submit to first visualization |
| WebSocket chunk latency | < 500ms | Per-chunk delivery time |
| UI animation smoothness | 60fps | Browser dev tools |
| Audio extraction time | < 30 seconds | For 5-minute song |

### 5.2 Scalability (MVP)

| Requirement | Target |
|-------------|--------|
| Concurrent analyses | 10+ simultaneous users |
| Audio storage | Temporary only, auto-cleanup |
| Database | Not required for MVP |

### 5.3 Reliability

| Requirement | Target |
|-------------|--------|
| yt-dlp updates | Weekly check for updates |
| Graceful degradation | Show partial results if analysis interrupted |
| WebSocket reconnection | Auto-reconnect within 5 seconds |

### 5.4 Usability

| Requirement | Target |
|-------------|--------|
| Device support | Desktop-first, tablet responsive |
| Browser support | Chrome, Firefox, Safari, Edge (latest) |
| Accessibility | WCAG 2.1 Level A |
| No authentication | Anonymous usage |
| Onboarding | None required (self-explanatory UI) |

### 5.5 Security

| Requirement | Implementation |
|-------------|----------------|
| Input validation | Sanitize all URLs server-side |
| Rate limiting | 10 requests/minute/IP |
| No user data storage | MVP stores nothing |
| HTTPS only | All traffic encrypted |
| Content Security Policy | Restrict iframe sources |

---

## 6. User Interface

### 6.1 Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo + "Neuro-Acoustic Analyzer"                           │
├─────────────────────────────────────────────────────────────────────┤
│  [YouTube URL Input]                                    [Analyze]   │
├───────────────────────────────┬─────────────────────────────────────┤
│                               │                                     │
│   ┌───────────────────────┐   │   REAL-TIME ANALYSIS                │
│   │                       │   │                                     │
│   │    YouTube Video      │   │   EMOTION                           │
│   │    (iframe/embed)     │   │   ┌─────────────────────────────┐   │
│   │                       │   │   │ Energetic (74%)             │   │
│   │                       │   │   └─────────────────────────────┘   │
│   └───────────────────────┘   │                                     │
│                               │   BRAIN REGIONS                     │
│   Now playing: 1:23 / 3:45    │   ┌─────────────────────────────┐   │
│                               │   │      Brain Diagram          │   │
│                               │   │   [regions with intensity]  │   │
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
│  FREQUENCY SPECTRUM                                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Bass ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Highs  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  TIMELINE SLIDER                                                    │
│  ├─────────┼──────────────┼────────────┼──────────────┤             │
│  0:00     0:45          1:30        2:15          3:45              │
│  │ INTRO   │   VERSE 1    │  CHORUS    │   BRIDGE    │              │
│  ├─────────●──────────────────────────────────────────┤             │
│                                                                     │
│  ⏳ Analyzing... 45% complete                                       │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER: About | How it works | Disclaimer                          │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 States

| State | UI Behavior |
|-------|-------------|
| **Initial** | URL input visible, analysis panel hidden |
| **Loading** | URL submitted, iframe loading, "Preparing..." |
| **Buffering** | First 10 seconds, "Analyzing... X%" progress |
| **Analyzing** | Real-time visualizations updating |
| **Complete** | All visualizations available, slider fully interactive |
| **Error** | Error message with retry option |

---

## 7. Technical Architecture (Summary)

### 7.1 Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, TypeScript, TailwindCSS |
| Backend API | Next.js API Routes (validation, orchestration) |
| Audio Service | Separate server (Railway/Render) with yt-dlp + Python |
| Real-time | WebSocket (Socket.io) |
| Database | PostgreSQL + Prisma (future, for caching) |

### 7.2 Data Flow

```
User → Frontend → API → Audio Service → yt-dlp → Analyzer → WebSocket → Frontend
```

### 7.3 Key Dependencies

- **yt-dlp**: YouTube audio extraction
- **ffmpeg**: Audio format conversion
- **librosa** (Python) or **meyda** (Node.js): Audio analysis
- **Socket.io**: Real-time streaming

---

## 8. Out of Scope (MVP)

The following are explicitly **NOT** included in MVP:

- User accounts / authentication
- Saving analysis history
- Caching previously analyzed songs
- File upload (local audio files)
- Spotify / SoundCloud integration
- 3D brain visualization
- Export / share functionality
- Mobile-optimized UI
- Comparison of multiple songs
- AI-based emotion detection (using rule-based for MVP)

---

## 9. Compliance & Security

### 9.1 Legal Considerations

| Concern | Mitigation |
|---------|------------|
| YouTube ToS | Add disclaimer: "For personal/educational use only" |
| Copyright | No audio storage beyond temporary processing |
| Privacy | No user data collected or stored |

### 9.2 Disclaimer Text

> "This tool analyzes publicly available YouTube videos for educational purposes. Brain activation and emotion predictions are based on audio analysis and neuroscience research correlations - they are not medical diagnoses. We do not store any audio or user data."

### 9.3 Security Measures

- Input sanitization on all user inputs
- Rate limiting (10 req/min/IP)
- HTTPS enforced
- No secrets in client code
- Audio files deleted immediately after processing

---

## 10. Open Questions

| # | Question | Status | Decision |
|---|----------|--------|----------|
| 1 | Brain visualization: 2D SVG or Canvas? | Open | TBD in Architect phase |
| 2 | Segment detection: Auto or time-based? | Open | Start with time-based (1 sec) |
| 3 | Deployment: Vercel + Railway or single VPS? | Open | TBD in Architect phase |

---

## 11. Appendix

### 11.1 Related Documents

- [Brainstorm: Neuro-Acoustic Analyzer](.waypoint/specs/brainstorm-neuro-acoustic.md)
- [Project Constitution](.waypoint/constitution.md)

### 11.2 Research References

- [Harvard Medicine: How Music Resonates in the Brain](https://magazine.hms.harvard.edu/articles/how-music-resonates-brain)
- [PMC/NIH: Music and the Brain](https://pmc.ncbi.nlm.nih.gov/articles/PMC5618809/)
- [Stanford: Music Moves Brain to Pay Attention](https://med.stanford.edu/news/all-news/2007/07/music-moves-brain-to-pay-attention-stanford-study-finds.html)

---

_WayPoint Product Specification - neuro-acoustic-analyzer_
_Generated by Product Manager Agent_
