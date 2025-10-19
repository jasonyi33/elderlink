/**
 * Task 3.8a: Gemini Service Tests (TDD)
 * 
 * Test Gemini API wrapper with timeout, retry, and error handling
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.8
 * - PRD.md lines 1397-1422 (callGemini implementation)
 * - PRD.md lines 792-834 (Modular Gemini Architecture)
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// This function will be implemented in gemini-service.ts
import { callGemini } from '../src/services/gemini-service';

// Mock fetch globally
global.fetch = jest.fn() as any;

describe('Gemini Service - API Wrapper', () => {
  
  const mockEnv = {
    GEMINI_API_KEY: 'test-api-key'
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  // Test 1: Memory extraction call completes in <7s
  test('memory extraction call completes in <7s', async () => {
    // Mock successful Gemini response
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: '{"newFacts": {"family": [], "hobbies": []}}' }]
          }
        }]
      })
    }));

    const start = Date.now();
    const prompt = 'Extract memories from: I love gardening';
    
    await callGemini(prompt, mockEnv);
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(7000); // Should complete in < 7s
  });

  // Test 2: Response generation call completes in <7s
  test('response generation call completes in <7s', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Hello Mrs. Chen! How are you today?' }]
          }
        }]
      })
    }));

    const start = Date.now();
    const prompt = 'Generate Sam response for: Hello';
    
    await callGemini(prompt, mockEnv);
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(7000);
  });

  // Test 3: Sentiment+health analysis call completes in <7s
  test('sentiment+health analysis call completes in <7s', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: '{"sentiment": 0.5, "emotions": ["happy"], "healthMentions": []}' }]
          }
        }]
      })
    }));

    const start = Date.now();
    const prompt = 'Analyze sentiment: I feel good today';
    
    await callGemini(prompt, mockEnv);
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(7000);
  });

  // Test 4: Interest extraction call completes in <7s
  test('interest extraction call completes in <7s', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: '{"interests": ["gardening", "piano"]}' }]
          }
        }]
      })
    }));

    const start = Date.now();
    const prompt = 'Extract interests from: I love gardening and piano';
    
    await callGemini(prompt, mockEnv);
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(7000);
  });

  // Test 5: Handles Gemini timeout gracefully (mock 8s delay → fallback)
  test('handles Gemini timeout gracefully', async () => {
    // Mock slow response (8 seconds)
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'Late response' }] } }]
          })
        }), 8000)
      )
    );

    const start = Date.now();
    const prompt = 'Test timeout';
    
    // Should timeout at 7s and throw error
    await expect(callGemini(prompt, mockEnv)).rejects.toThrow(/timeout/i);
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(7500); // Should timeout around 7s, not wait 8s
  }, 10000); // Increase Jest timeout to 10s to allow testing 7s Gemini timeout

  // Test 6: Handles malformed JSON response (returns safe fallback)
  test('handles malformed JSON response', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Not valid JSON {broken' }]
          }
        }]
      })
    }));

    const prompt = 'Test malformed JSON';
    
    // Should not throw, should return the raw text
    const result = await callGemini(prompt, mockEnv);
    expect(result).toBe('Not valid JSON {broken'); // Return raw text even if not JSON
  });

  // Test 7: Implements exponential backoff on retry
  test('implements exponential backoff on retry', async () => {
    let attemptCount = 0;
    const attemptTimes: number[] = [];

    (global.fetch as jest.Mock).mockImplementation(async () => {
      attemptTimes.push(Date.now());
      attemptCount++;
      
      if (attemptCount < 3) {
        // Fail first 2 attempts
        throw new Error('Network error');
      }
      
      // Succeed on 3rd attempt
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Success on retry' }] } }]
        })
      };
    });

    const result = await callGemini('Test retry', mockEnv);
    
    expect(result).toBe('Success on retry');
    expect(attemptCount).toBe(3);
    
    // Verify exponential backoff (delays should increase)
    if (attemptTimes.length === 3) {
      const delay1 = attemptTimes[1] - attemptTimes[0];
      const delay2 = attemptTimes[2] - attemptTimes[1];
      expect(delay2).toBeGreaterThan(delay1); // Second delay > first delay
    }
  });

  // Test 8: Handles 429 rate limit error
  test('handles 429 rate limit error', async () => {
    let attemptCount = 0;

    (global.fetch as jest.Mock).mockImplementation(async () => {
      attemptCount++;
      
      if (attemptCount === 1) {
        // First attempt: rate limit
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: 'Rate limit exceeded' })
        };
      }
      
      // Second attempt: success
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Success after rate limit' }] } }]
        })
      };
    });

    const result = await callGemini('Test rate limit', mockEnv);
    
    expect(result).toBe('Success after rate limit');
    expect(attemptCount).toBe(2); // Should retry after 429
  });
});

