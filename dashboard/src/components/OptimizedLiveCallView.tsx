/**
 * Optimized Live Call View - Performance-first implementation
 * Addresses critical issues identified in performance audit:
 * 1. Throttled animations to prevent jank during 2-second polling
 * 2. Memoized components to prevent unnecessary re-renders
 * 3. CSS-based animations for GPU acceleration
 * 4. Data validation to handle empty/null responses
 */

import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useThrottledAnimation, useOptimizedPolling, usePerformanceMonitor } from '../hooks/useThrottledAnimation';
import { API_CONFIG } from '../config/api';

// Types with proper validation
interface SentimentData {
  sentiment: number;
  emotions: string[];
  timestamp: string;
  language?: 'english' | 'mandarin';
}

interface LiveCallViewProps {
  performanceMode?: boolean;
}

// Data validation to prevent crashes with empty/null data
function validateSentimentData(data: any): SentimentData {
  return {
    sentiment: typeof data?.sentiment === 'number'
      ? Math.max(-1, Math.min(1, data.sentiment))
      : 0,
    emotions: Array.isArray(data?.emotions)
      ? data.emotions.filter(e => typeof e === 'string').slice(0, 5) // Limit to 5 emotions
      : [],
    timestamp: data?.timestamp || new Date().toISOString(),
    language: data?.language === 'mandarin' ? 'mandarin' : 'english',
  };
}

// Memoized sentiment meter to prevent re-renders
const OptimizedSentimentMeter = memo<{ sentiment: number; isPerformanceDegraded: boolean }>(
  ({ sentiment, isPerformanceDegraded }) => {
    // Pre-calculate values for CSS variables
    const meterStyles = useMemo(() => {
      const width = Math.abs(sentiment) * 50;
      const left = sentiment < 0 ? 50 - width : 50;
      const hue = sentiment > 0 ? 120 : sentiment < 0 ? 0 : 60; // Green, Red, Yellow

      return {
        '--meter-width': `${width}%`,
        '--meter-left': `${left}%`,
        '--meter-hue': hue,
        '--animation-duration': isPerformanceDegraded ? '0s' : '0.5s',
      } as React.CSSProperties;
    }, [sentiment, isPerformanceDegraded]);

    const emoji = useMemo(() => {
      if (sentiment > 0.5) return '😊';
      if (sentiment > 0) return '🙂';
      if (sentiment === 0) return '😐';
      if (sentiment > -0.5) return '😕';
      return '😔';
    }, [sentiment]);

    return (
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-600 mb-3 block">
          Real-time Emotional State
        </label>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Distressed</span>
          <span>Neutral</span>
          <span>Happy</span>
        </div>

        {/* Optimized meter using CSS variables */}
        <div
          className="optimized-sentiment-meter"
          style={meterStyles}
        >
          <div className="sentiment-track">
            <div className="sentiment-fill" />
            <div className="sentiment-center-line" />
            <div className="sentiment-indicator">
              <span>{emoji}</span>
            </div>
          </div>
        </div>

        {/* Numeric value */}
        <div className="flex justify-center mt-3">
          <span className="text-2xl font-bold text-primary">
            {sentiment > 0 ? '+' : ''}{(sentiment * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    );
  },
  // Custom comparison to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    const sentimentChanged = Math.abs(prevProps.sentiment - nextProps.sentiment) < 0.01;
    const performanceChanged = prevProps.isPerformanceDegraded === nextProps.isPerformanceDegraded;
    return sentimentChanged && performanceChanged;
  }
);

OptimizedSentimentMeter.displayName = 'OptimizedSentimentMeter';

// Memoized emotion badges
const EmotionBadges = memo<{ emotions: string[] }>(
  ({ emotions }) => {
    if (emotions.length === 0) {
      return (
        <div className="text-gray-400 text-sm italic">
          No emotions detected yet
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion, index) => (
          <span
            key={`${emotion}-${index}`}
            className="emotion-badge"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {emotion}
          </span>
        ))}
      </div>
    );
  }
);

EmotionBadges.displayName = 'EmotionBadges';

// Main component
export function OptimizedLiveCallView({ performanceMode = false }: LiveCallViewProps) {
  const [profile] = useState({ name: 'Mrs. Chen', id: 'mrs-chen' });
  const [rawSentiment, setRawSentiment] = useState<number>(0);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [language, setLanguage] = useState<'english' | 'mandarin'>('english');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use throttled sentiment for smooth animations
  const sentiment = useThrottledAnimation(rawSentiment, 1000);

  // Monitor performance
  const isPerformanceDegraded = usePerformanceMonitor(30);

  // Fetch function with error handling
  const fetchSentiment = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LIVE_SENTIMENT}`,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const validated = validateSentimentData(data);

      setRawSentiment(validated.sentiment);
      setEmotions(validated.emotions);
      setLanguage(validated.language || 'english');
      setError(null);
      setIsLoading(false);

    } catch (err) {
      console.error('Failed to fetch sentiment:', err);

      // Don't update state on error - keep last known values
      if (isLoading) {
        setError('Unable to connect to live sentiment feed');
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  // Use optimized polling with exponential backoff
  useOptimizedPolling(
    fetchSentiment,
    API_CONFIG.POLLING.LIVE_SENTIMENT,
    !performanceMode // Disable in performance mode
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !sentiment) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchSentiment();
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${performanceMode ? 'performance-mode' : ''}`}>
      {/* Performance warning */}
      {isPerformanceDegraded && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
          ⚠️ Performance mode enabled - animations reduced
        </div>
      )}

      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Live Call with {profile.name}
        </h2>
        <span className="live-indicator">
          <span className="live-dot"></span>
          LIVE
        </span>
      </div>

      {/* Optimized sentiment meter */}
      <OptimizedSentimentMeter
        sentiment={sentiment}
        isPerformanceDegraded={isPerformanceDegraded || performanceMode}
      />

      {/* Emotion badges */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-3 block">
          Detected Emotions
        </label>
        <EmotionBadges emotions={emotions} />
      </div>

      {/* Language indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Language:</span>
        <span className="language-badge">
          {language === 'mandarin' ? '中文 Mandarin' : 'English'}
        </span>
      </div>
    </div>
  );
}

// Add CSS for GPU-accelerated animations
const styles = `
<style>
  /* Optimized sentiment meter with GPU acceleration */
  .optimized-sentiment-meter {
    position: relative;
    height: 4rem;
    background: linear-gradient(
      to right,
      hsl(0, 70%, 95%) 0%,
      hsl(60, 70%, 95%) 50%,
      hsl(120, 70%, 95%) 100%
    );
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sentiment-track {
    position: relative;
    height: 100%;
  }

  .sentiment-fill {
    position: absolute;
    height: 100%;
    width: var(--meter-width);
    left: var(--meter-left);
    background: linear-gradient(
      90deg,
      hsl(var(--meter-hue), 70%, 50%),
      hsl(var(--meter-hue), 60%, 45%)
    );
    border-radius: 2rem;
    transform: translateZ(0); /* Force GPU layer */
    will-change: width, left;
    transition: width var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1),
                left var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sentiment-center-line {
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    width: 2px;
    background: rgba(0, 0, 0, 0.2);
    transform: translateX(-50%);
  }

  .sentiment-indicator {
    position: absolute;
    top: 50%;
    left: calc(var(--meter-left) + var(--meter-width) / 2);
    transform: translate(-50%, -50%);
    width: 2.5rem;
    height: 2.5rem;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: left var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Live indicator with CSS animation */
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #dc2626;
    font-weight: 500;
  }

  .live-dot {
    width: 0.75rem;
    height: 0.75rem;
    background: #dc2626;
    border-radius: 50%;
    position: relative;
    animation: pulse 2s infinite;
  }

  .live-dot::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: #dc2626;
    opacity: 0.4;
    animation: ping 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes ping {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  /* Emotion badges with staggered animation */
  .emotion-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    animation: fadeInUp 0.5s ease-out backwards;
    transform: translateZ(0);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .language-badge {
    padding: 0.25rem 0.75rem;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: white;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Performance mode - disable animations */
  .performance-mode * {
    animation: none !important;
    transition: none !important;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
`;

// Export styles for injection
export const OptimizedLiveCallStyles = styles;