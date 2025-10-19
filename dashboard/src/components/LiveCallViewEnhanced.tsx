/**
 * Enhanced Live Call View with Performance Optimizations
 * Combines visual enhancements with performance-first design
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { apiClient } from '../services/api-client';
import { validateSentimentData } from '../utils/dataValidation';
import { useThrottledAnimation, usePerformanceMonitor, useOptimizedPolling } from '../hooks/useThrottledAnimation';
import { OptimizedSentimentMeter } from './ui/OptimizedSentimentMeter';

// Emotion color mapping
const EMOTION_STYLES: Record<string, string> = {
  happy: 'happy',
  sad: 'sad',
  anxious: 'anxious',
  content: 'calm',
  nostalgic: 'calm',
  worried: 'anxious',
  calm: 'calm',
  lonely: 'sad',
};

// Emotion icons
const EMOTION_ICONS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  content: '😌',
  nostalgic: '🥺',
  worried: '😟',
  calm: '😇',
  lonely: '🫂',
};

export default function LiveCallViewEnhanced() {
  // State management
  const [profile] = useState({ name: 'Mrs. Chen', id: 'mrs-chen' });
  const [rawSentiment, setRawSentiment] = useState<number>(0);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [language, setLanguage] = useState<'english' | 'mandarin'>('english');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Performance optimizations
  const sentiment = useThrottledAnimation(rawSentiment, 1000); // Throttle to 1 update per second
  const isPerformanceDegraded = usePerformanceMonitor(30); // Monitor for <30 FPS

  // Fetch sentiment data with validation
  const fetchSentiment = useCallback(async () => {
    try {
      const response = await apiClient.fetchLiveSentiment();

      if (response.error) {
        throw new Error(response.error);
      }

      const validated = validateSentimentData(response);

      // Update state with validated data
      setRawSentiment(validated.sentiment);
      setEmotions(validated.emotions);
      setLanguage(validated.language || 'english');
      setError(null);
      setIsLoading(false);
      setLastUpdate(new Date());

      // Show toast for significant sentiment changes
      if (Math.abs(validated.sentiment - rawSentiment) > 0.3) {
        const message = validated.sentiment > rawSentiment
          ? '😊 Sentiment improving!'
          : '😟 Monitoring emotional state';

        toast(message, {
          duration: 3000,
          position: 'bottom-right',
          style: {
            background: validated.sentiment > 0 ? '#06D6A0' : '#E63946',
            color: 'white',
          },
        });
      }
    } catch (err) {
      console.error('Failed to fetch sentiment:', err);
      if (isLoading) {
        setError('Unable to connect to live sentiment feed');
        setIsLoading(false);
      }
    }
  }, [isLoading, rawSentiment]);

  // Use optimized polling with exponential backoff
  useOptimizedPolling(fetchSentiment, 2000, !isPerformanceDegraded);

  // Sound wave visualization bars
  const soundBars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      height: Math.random() * 30 + 10,
      delay: i * 0.05,
      duration: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchSentiment();
            }}
            className="btn-gradient"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className={`glass-card p-6 ${isPerformanceDegraded ? 'performance-mode' : ''}`}>
        {/* Performance warning */}
        {isPerformanceDegraded && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-lg flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="text-sm">Performance mode enabled - animations reduced for optimal experience</span>
          </div>
        )}

        {/* Header with enhanced live indicator */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Live Call with {profile.name}
          </h2>

          {/* Enhanced LIVE indicator */}
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="font-medium">LIVE</span>
          </div>
        </div>

        {/* Optimized Sentiment Meter */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-600 mb-3 block">
            Real-time Emotional State
          </label>
          <OptimizedSentimentMeter
            sentiment={sentiment}
            isLive={true}
            isPerformanceDegraded={isPerformanceDegraded}
          />
        </div>

        {/* Animated Emotion Badges */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-3 block">
            Detected Emotions
          </label>
          <AnimatePresence mode="popLayout">
            <div className="flex flex-wrap gap-2">
              {emotions.length > 0 ? (
                emotions.map((emotion, index) => (
                  <motion.span
                    key={`${emotion}-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 500,
                      damping: 25,
                    }}
                    className={`emotion-badge ${EMOTION_STYLES[emotion.toLowerCase()] || ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="mr-1">{EMOTION_ICONS[emotion.toLowerCase()] || '💭'}</span>
                    {emotion}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">
                  No emotions detected yet
                </span>
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* Sound Wave Visualization */}
        {!isPerformanceDegraded && (
          <div className="sound-wave-container">
            {soundBars.map((bar, i) => (
              <div
                key={i}
                className="sound-bar"
                style={{
                  height: `${bar.height}px`,
                  animationDelay: `${bar.delay}s`,
                  animationDuration: `${bar.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Language & Status Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Language:</span>
              <span className="ml-2 font-medium">
                {language === 'mandarin' ? '🇨🇳 Mandarin' : '🇺🇸 English'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Update:</span>
              <span className="ml-2 font-medium">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Call Duration Timer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full">
            <span className="text-sm text-gray-600">Call Duration:</span>
            <span className="font-mono font-medium text-primary">
              {new Date(Date.now() - lastUpdate.getTime()).toISOString().substr(14, 5)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}