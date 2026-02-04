'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { AnalysisSegment, SongAnalysis, AnalysisStatus } from '@/lib/analysis/types';

interface AnalysisState {
  status: AnalysisStatus;
  progress: number;
  segments: AnalysisSegment[];
  currentTime: number;
  duration: number;
  error: string | null;
  analysis: SongAnalysis | null;
}

interface AnalysisContextValue extends AnalysisState {
  currentSegment: AnalysisSegment | null;
  addSegment: (segment: AnalysisSegment) => void;
  setCurrentTime: (time: number) => void;
  setStatus: (status: AnalysisStatus) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setAnalysis: (analysis: SongAnalysis) => void;
  reset: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

const initialState: AnalysisState = {
  status: 'idle',
  progress: 0,
  segments: [],
  currentTime: 0,
  duration: 0,
  error: null,
  analysis: null,
};

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>(initialState);

  const addSegment = useCallback((segment: AnalysisSegment) => {
    setState((prev) => ({
      ...prev,
      segments: [...prev.segments, segment],
      duration: Math.max(prev.duration, segment.endTime),
    }));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setStatus = useCallback((status: AnalysisStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, status: error ? 'error' : prev.status }));
  }, []);

  const setAnalysis = useCallback((analysis: SongAnalysis) => {
    setState((prev) => ({
      ...prev,
      analysis,
      segments: analysis.segments,
      duration: analysis.video.duration,
      status: 'complete',
      progress: 100,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const currentSegment = useMemo(() => {
    return state.segments.find(
      (s) => s.startTime <= state.currentTime && s.endTime > state.currentTime
    ) || state.segments[state.segments.length - 1] || null;
  }, [state.segments, state.currentTime]);

  const value: AnalysisContextValue = {
    ...state,
    currentSegment,
    addSegment,
    setCurrentTime,
    setStatus,
    setProgress,
    setError,
    setAnalysis,
    reset,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
