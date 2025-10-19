// Performance optimization hook for throttling animations
// Prevents jank during 2-second polling intervals

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Throttles value updates to prevent excessive re-renders during animations
 * Critical for maintaining 60fps during live sentiment updates
 */
export function useThrottledAnimation<T>(
  value: T,
  delay: number = 500
): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdate = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate.current;

    // Clear any pending updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (timeSinceLastUpdate >= delay) {
      // Update immediately if enough time has passed
      setThrottledValue(value);
      lastUpdate.current = now;
    } else {
      // Schedule update for later
      const remainingDelay = delay - timeSinceLastUpdate;
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdate.current = Date.now();
      }, remainingDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
}

/**
 * Hook for performance monitoring
 * Tracks FPS and warns when performance degrades
 */
export function usePerformanceMonitor(threshold: number = 30): boolean {
  const [isPerformanceDegraded, setIsPerformanceDegraded] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const checkPerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();

      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round(
          (frameCount.current * 1000) / (currentTime - lastTime.current)
        );

        // Check if FPS is below threshold
        if (fps < threshold) {
          console.warn(`Performance degraded: ${fps} FPS`);
          setIsPerformanceDegraded(true);
        } else if (fps >= threshold + 10) {
          // Add some buffer to prevent flickering
          setIsPerformanceDegraded(false);
        }

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(checkPerformance);
    };

    animationFrameId = requestAnimationFrame(checkPerformance);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [threshold]);

  return isPerformanceDegraded;
}

/**
 * Hook for optimized polling with exponential backoff
 * Prevents overwhelming the backend during failures
 */
export function useOptimizedPolling(
  callback: () => Promise<void>,
  interval: number = 2000,
  enabled: boolean = true
) {
  const failureCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const poll = useCallback(async () => {
    // Skip if tab is not visible
    if (document.visibilityState !== 'visible') {
      return;
    }

    try {
      await callback();
      failureCount.current = 0; // Reset on success
    } catch (error) {
      failureCount.current++;
      console.error('Polling failed:', error);

      // Exponential backoff
      const backoffDelay = Math.min(
        interval * Math.pow(2, failureCount.current),
        30000 // Cap at 30 seconds
      );

      if (enabled) {
        timeoutRef.current = setTimeout(poll, backoffDelay);
        return;
      }
    }

    // Schedule next poll with normal interval
    if (enabled) {
      timeoutRef.current = setTimeout(poll, interval);
    }
  }, [callback, interval, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Start polling
    poll();

    // Resume polling when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        poll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [poll, enabled]);
}