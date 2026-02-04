// ============ YouTube Video ============

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
}

// ============ Frequency Analysis ============

export interface FrequencyBands {
  bass: number;      // 20-250 Hz, normalized 0-1
  lowMid: number;    // 250-500 Hz
  mid: number;       // 500-2000 Hz
  highMid: number;   // 2000-4000 Hz
  high: number;      // 4000-20000 Hz
}

// ============ Brain Regions ============

export interface BrainRegionActivation {
  auditoryCortex: number;    // 0-1 intensity
  amygdala: number;
  hippocampus: number;
  nucleusAccumbens: number;
  motorCortex: number;
  prefrontalCortex: number;
  basalGanglia: number;
}

export type BrainRegionId = keyof BrainRegionActivation;

// ============ Brainwaves ============

export interface BrainwaveState {
  delta: number;   // 1-4 Hz, deep sleep
  theta: number;   // 4-8 Hz, meditation
  alpha: number;   // 8-13 Hz, relaxed
  beta: number;    // 13-38 Hz, alert
  gamma: number;   // 30-100 Hz, focus
}

export type BrainwaveType = keyof BrainwaveState;

// ============ Emotions ============

export type EmotionCategory =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'calm'
  | 'excited'
  | 'fearful'
  | 'energetic'
  | 'melancholic'
  | 'uplifting'
  | 'tense'
  | 'peaceful';

export interface EmotionClassification {
  primary: EmotionCategory;
  confidence: number; // 0-1
}

// ============ Analysis Segment ============

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
  analyzedAt: string; // ISO date string
}

// ============ Analysis Job State ============

export type AnalysisStatus =
  | 'idle'
  | 'pending'
  | 'extracting'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisJob {
  jobId: string;
  videoId: string;
  status: AnalysisStatus;
  progress: number; // 0-100
  error?: string;
}

// ============ API Types ============

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

// ============ WebSocket Messages ============

export type ServerMessage =
  | { type: 'connected'; jobId: string }
  | { type: 'progress'; status: AnalysisStatus; progress: number; message: string }
  | { type: 'chunk'; timestamp: number; segment: AnalysisSegment }
  | { type: 'complete'; analysis: SongAnalysis }
  | { type: 'error'; code: string; message: string };

export type ClientMessage =
  | { type: 'start'; videoId: string }
  | { type: 'seek'; timestamp: number };
