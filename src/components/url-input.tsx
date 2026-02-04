'use client';

import { useState, useCallback } from 'react';
import { isValidYouTubeUrl, extractVideoId } from '@/lib/youtube/url-parser';

interface URLInputProps {
  onSubmit: (url: string, videoId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function URLInput({ onSubmit, isLoading = false, disabled = false }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a YouTube URL');
      return false;
    }
    if (!isValidYouTubeUrl(value)) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (touched) {
      validate(value);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validate(url)) return;

    const videoId = extractVideoId(url);
    if (videoId) {
      onSubmit(url, videoId);
    }
  };

  const isValid = url.trim() && isValidYouTubeUrl(url);
  const showError = touched && error;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <label htmlFor="youtube-url" className="sr-only">
          YouTube URL
        </label>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Paste YouTube URL here..."
              disabled={disabled || isLoading}
              className={`
                w-full px-4 py-3 rounded-lg border-2
                bg-gray-800
                text-gray-100
                placeholder-gray-400
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-cyan-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${showError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-cyan-500'
                }
              `}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading || disabled}
            className={`
              px-6 py-3 rounded-lg font-medium
              transition-all
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isValid && !isLoading
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-gray-700 text-gray-400'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {showError && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-500">
          Supports youtube.com and youtu.be links
        </p>
      </div>
    </form>
  );
}
