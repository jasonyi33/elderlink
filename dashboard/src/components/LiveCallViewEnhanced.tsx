/**
 * Enhanced Live Call View with Performance Optimizations
 * Combines visual enhancements with performance-first design
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../services/api-client';
import { validateSentimentData } from '../utils/dataValidation';
import { useThrottledAnimation, usePerformanceMonitor, useOptimizedPolling } from '../hooks/useThrottledAnimation';
import { OptimizedSentimentMeter } from './ui/OptimizedSentimentMeter';
import Icons from './ui/Icons';

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
  const [isCallActive, setIsCallActive] = useState(false);

  // Performance optimizations
  const sentiment = useThrottledAnimation(rawSentiment, 1000); // Throttle to 1 update per second
  const isPerformanceDegraded = usePerformanceMonitor(30); // Monitor for <30 FPS

  // Fetch sentiment data with validation
  const fetchSentiment = useCallback(async () => {
    try {
      // Fetch call state first
      const callStateResponse = await fetch('https://elderlink-dev.elderlinkhelper.workers.dev/api/call-state');
      const callState = await callStateResponse.json();

      // Update call state
      setIsCallActive(callState.isActive || false);

      // Only fetch sentiment if call is active
      if (!callState.isActive) {
        setIsLoading(false);
        return;
      }

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

  // No active call state
  if (!isCallActive && !isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Active Call</h3>
          <p className="text-gray-600 mb-4">
            Waiting for {profile.name} to call Sam...
          </p>
          <p className="text-sm text-gray-500">
            Real-time sentiment and emotions will appear when the call starts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Pulse Animation */}
      <div className="relative medical-card overflow-visible">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse"></div>
              {/* Center icon */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-glow-primary">
                <Icons.phone size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-display font-display bg-gradient-to-r from-primary via-teal to-purple bg-clip-text text-transparent mb-2">
            Live Monitoring
          </h1>
          <p className="text-body text-text-muted">
            Real-time emotional intelligence during active calls
          </p>
        </div>
      </div>

      {/* Glassmorphism Patient Info Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-lg">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary">{profile.name}</h3>
            <p className="text-sm text-text-muted">Active Call Session</p>
          </div>
          {isCallActive && (
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span className="font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className={`medical-card ${isPerformanceDegraded ? 'performance-mode' : ''}`}>
        {/* Performance warning */}
        {isPerformanceDegraded && (
          <div className="card-section bg-warning-light/30 border-l-4 border-warning">
            <div className="flex items-center gap-2">
              <Icons.alert size={20} className="text-warning-dark" />
              <span className="text-sm text-warning-dark font-medium">
                Performance mode enabled - animations reduced for optimal experience
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="card-header">
          <h2 className="card-title">Real-Time Emotional Analysis</h2>
        </div>

        {/* Optimized Sentiment Meter */}
        <div className="card-section">
          <label className="text-caption font-semibold text-text-muted mb-3 block uppercase tracking-wide">
            Real-time Emotional State
          </label>
          <OptimizedSentimentMeter
            sentiment={sentiment}
            isLive={true}
            isPerformanceDegraded={isPerformanceDegraded}
          />
        </div>

        {/* Animated Emotion Badges */}
        <div className="card-section">
          <label className="text-caption font-semibold text-text-muted mb-3 block uppercase tracking-wide">
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
                    className={`emotion-bubble ${EMOTION_STYLES[emotion.toLowerCase()] || ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-2xl mr-1">{EMOTION_ICONS[emotion.toLowerCase()] || '💭'}</span>
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
        <div className="card-section border-t border-clinical-border">
          <div className="grid grid-cols-2 gap-6">
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-1">
                <Icons.message size={16} className="text-primary" />
                <span className="text-caption text-text-muted uppercase tracking-wide">Language</span>
              </div>
              <p className="text-lg font-semibold text-primary">
                {language === 'mandarin' ? '🇨🇳 Mandarin' : '🇺🇸 English'}
              </p>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-1">
                <Icons.clock size={16} className="text-primary" />
                <span className="text-caption text-text-muted uppercase tracking-wide">Last Update</span>
              </div>
              <p className="text-lg font-semibold text-primary font-mono">
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Call Duration Timer */}
        <div className="card-section text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-primary rounded-full text-white shadow-glow-primary">
            <Icons.phone size={20} />
            <span className="text-caption uppercase tracking-wide">Call Duration</span>
            <span className="font-mono font-bold text-xl">
              {new Date(Date.now() - lastUpdate.getTime()).toISOString().substr(14, 5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}