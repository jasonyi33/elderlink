/**
 * Optimized Sentiment Meter Component
 * GPU-accelerated animations with performance-first design
 */

import React, { memo, useMemo } from 'react';

interface SentimentMeterProps {
  sentiment: number; // -1 to 1 scale
  isLive?: boolean;
  isPerformanceDegraded?: boolean;
}

/**
 * Memoized sentiment meter to prevent unnecessary re-renders
 * Only updates when sentiment changes significantly
 */
export const OptimizedSentimentMeter = memo<SentimentMeterProps>(
  ({ sentiment, isLive = false, isPerformanceDegraded = false }) => {
    // Pre-calculate expensive values
    const meterStyles = useMemo(() => {
      const width = Math.abs(sentiment) * 50;
      const left = sentiment < 0 ? 50 - width : 50;

      // Determine gradient based on sentiment
      let gradientClass = 'neutral';
      if (sentiment > 0) gradientClass = 'positive';
      else if (sentiment < 0) gradientClass = 'negative';

      return {
        '--meter-width': `${width}%`,
        '--meter-left': `${left}%`,
        '--animation-duration': isPerformanceDegraded ? '0s' : '0.5s',
        fillClass: gradientClass,
      } as const;
    }, [sentiment, isPerformanceDegraded]);

    // Calculate emoji based on sentiment
    const emoji = useMemo(() => {
      if (sentiment > 0.5) return '😊';
      if (sentiment > 0) return '🙂';
      if (sentiment === 0) return '😐';
      if (sentiment > -0.5) return '😕';
      return '😔';
    }, [sentiment]);

    // Calculate percentage for display
    const percentage = useMemo(() => {
      const value = Math.round(sentiment * 100);
      return value > 0 ? `+${value}%` : `${value}%`;
    }, [sentiment]);

    return (
      <div className="sentiment-meter-wrapper">
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Distressed</span>
          <span>Neutral</span>
          <span>Happy</span>
        </div>

        {/* Meter Container */}
        <div
          className={`optimized-sentiment-meter ${isPerformanceDegraded ? 'performance-mode' : ''}`}
          style={meterStyles as React.CSSProperties}
        >
          <div className="sentiment-track">
            {/* Fill bar */}
            <div className={`sentiment-fill ${meterStyles.fillClass}`} />

            {/* Shimmer effect (only if live and not in performance mode) */}
            {isLive && !isPerformanceDegraded && (
              <div className="sentiment-shimmer" />
            )}

            {/* Center line */}
            <div className="sentiment-center-line" />

            {/* Floating indicator */}
            <div className="sentiment-indicator">
              <span>{emoji}</span>
            </div>
          </div>
        </div>

        {/* Numeric Display - Phase 4: Solid color for projector */}
        <div className="flex justify-center mt-3">
          <span className="text-2xl font-bold text-primary-900">
            {percentage}
          </span>
        </div>

        {/* Optional Live Status */}
        {isLive && (
          <div className="flex justify-center mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live tracking
            </span>
          </div>
        )}
      </div>
    );
  },
  // Custom comparison function - only re-render if sentiment actually changed
  (prevProps, nextProps) => {
    const sentimentUnchanged = Math.abs(prevProps.sentiment - nextProps.sentiment) < 0.01;
    const liveUnchanged = prevProps.isLive === nextProps.isLive;
    const performanceUnchanged = prevProps.isPerformanceDegraded === nextProps.isPerformanceDegraded;

    return sentimentUnchanged && liveUnchanged && performanceUnchanged;
  }
);

OptimizedSentimentMeter.displayName = 'OptimizedSentimentMeter';