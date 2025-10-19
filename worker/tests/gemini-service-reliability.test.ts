/**
 * Task 3.8f: Gemini Service Reliability Tests
 * 
 * Test with 50 consecutive calls to verify no failures
 * Simulates real-world usage patterns
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.8f
 * - PRD.md lines 1397-1422
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { callGemini } from '../src/services/gemini-service';

// Mock fetch globally
global.fetch = jest.fn() as any;

describe('Gemini Service - Reliability Tests', () => {
  
  const mockEnv = {
    GEMINI_API_KEY: 'test-api-key'
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: 50 consecutive successful calls
  test('handles 50 consecutive calls without failures', async () => {
    let callCount = 0;

    (global.fetch as jest.Mock).mockImplementation(async () => {
      callCount++;
      return {
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: `Response ${callCount}` }]
            }
          }]
        })
      };
    });

    const results: string[] = [];
    
    for (let i = 0; i < 50; i++) {
      const result = await callGemini(`Test call ${i}`, mockEnv);
      results.push(result);
    }

    expect(results.length).toBe(50);
    expect(callCount).toBe(50);
    
    // All should be successful
    results.forEach((result, i) => {
      expect(result).toBe(`Response ${i + 1}`);
    });
  }, 30000); // 30s timeout for 50 calls

  // Test 2: Mix of successes and retryable failures
  test('recovers from intermittent failures', async () => {
    let callCount = 0;

    (global.fetch as jest.Mock).mockImplementation(async () => {
      callCount++;
      
      // Fail every 5th call on first attempt
      if (callCount % 5 === 0 && callCount <= 10) {
        throw new Error('Network error');
      }
      
      return {
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: 'Success' }]
            }
          }]
        })
      };
    });

    const results: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      const result = await callGemini(`Test call ${i}`, mockEnv);
      results.push(result);
    }

    expect(results.length).toBe(10);
    // All should eventually succeed due to retry logic
    results.forEach(result => {
      expect(result).toBe('Success');
    });
  }, 20000); // 20s timeout

  // Test 3: Handles rate limiting across multiple calls
  test('handles rate limiting gracefully across calls', async () => {
    let callCount = 0;

    (global.fetch as jest.Mock).mockImplementation(async () => {
      callCount++;
      
      // Simulate rate limit on calls 3 and 7
      if (callCount === 3 || callCount === 7) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: 'Rate limit' })
        };
      }
      
      return {
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: 'Success' }]
            }
          }]
        })
      };
    });

    const results: string[] = [];
    
    for (let i = 0; i < 5; i++) {
      const result = await callGemini(`Test call ${i}`, mockEnv);
      results.push(result);
    }

    expect(results.length).toBe(5);
    // Should recover from rate limits with retry
    results.forEach(result => {
      expect(result).toBe('Success');
    });
  }, 15000); // 15s timeout

  // Test 4: No memory leaks or degradation over time
  test('maintains performance across many calls', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Response' }]
          }
        }]
      })
    }));

    const latencies: number[] = [];
    
    for (let i = 0; i < 20; i++) {
      const start = Date.now();
      await callGemini(`Test ${i}`, mockEnv);
      const elapsed = Date.now() - start;
      latencies.push(elapsed);
    }

    // Calculate average latency
    const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    
    // All calls should be fast (< 100ms in mocked environment)
    expect(avgLatency).toBeLessThan(100);
    
    // No significant degradation (last 5 calls should be as fast as first 5)
    const firstFiveAvg = latencies.slice(0, 5).reduce((sum, l) => sum + l, 0) / 5;
    const lastFiveAvg = latencies.slice(-5).reduce((sum, l) => sum + l, 0) / 5;
    expect(lastFiveAvg).toBeLessThan(firstFiveAvg * 2); // Within 2x
  }, 15000); // 15s timeout

  // Test 5: Error logging doesn't cause issues
  test('error logging works without throwing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockImplementation(async () => {
      throw new Error('Test error');
    });

    await expect(callGemini('Test', mockEnv)).rejects.toThrow();
    
    // Should have logged errors
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});

