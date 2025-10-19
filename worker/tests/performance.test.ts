/**
 * Task 3.12a: Performance Validation Tests (TDD)
 * 
 * Verify system meets performance requirements for production
 * 
 * CRITICAL: Webhook must respond <3s for natural conversation flow
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.12
 * - PRD.md lines 49, 105, 730-770 (latency requirements)
 * - PRD.md line 1126 (OPTIMIZED FOR <3s LATENCY)
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { handleVapiWebhook } from '../src/handlers/vapi-webhook';
import { getProfile, saveProfile } from '../src/services/kv-service';
import { Env } from '../src/services/kv-service';

// Mock environment for tests
const mockEnv: Env = {
  KV: {
    get: async (_key: string) => null,
    put: async (_key: string, _value: string) => undefined,
    delete: async (_key: string) => undefined,
    list: async () => ({ keys: [], list_complete: true, cursor: '' })
  } as any,
  ENVIRONMENT: 'test',
  GEMINI_API_KEY: 'test-key',
  VAPI_API_KEY: 'test-key',
  ELEVENLABS_ENGLISH_VOICE: 'test-voice-en',
  ELEVENLABS_MANDARIN_VOICE: 'test-voice-zh',
  context: {
    waitUntil: (_promise: Promise<any>) => {},
    passThroughOnException: () => {}
  } as any
};

// Mock profile for performance tests
const MOCK_PROFILE = {
  id: 'perf-test',
  name: 'Test User',
  age: 70,
  phone: '+1234567890',
  languages: ['english' as const],
  location: 'Seattle, WA',
  memories: {
    family: [],
    hobbies: ['gardening'],
    health: [],
    recentEvents: [],
    preferences: { topicsEnjoys: [], topicsAvoid: [], conversationStyle: 'warm' }
  },
  socialProfile: {
    interests: ['gardening'],
    culturalBackground: 'English',
    openToMatching: true
  },
  healthData: {
    conditions: [],
    medications: [],
    vitals: { lastUpdated: '', bloodPressure: '', weight: '', bloodSugar: '' },
    appointments: [],
    notes: []
  },
  matches: [],
  groups: [],
  conversations: [],
  wellnessMetrics: {
    mentalHealth: { lonelinessScore: 0, averageSentiment: 0, trend: 'stable' as const },
    physicalHealth: { symptomMentions: 0, medicationAdherence: 0, appointmentReminders: 0 },
    socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
    holisticScore: 70,
    lastCallDate: new Date().toISOString(),
    callFrequency: 0
  }
};

describe('Performance Validation', () => {

  beforeAll(() => {
    // Setup performance testing environment
    console.log('[PERF_TEST] Starting performance validation suite');
  });

  // Test 1: Webhook responds in <3 seconds (CRITICAL)
  test('webhook responds in <3 seconds', async () => {
    console.log('[PERF_TEST] Testing webhook latency...');
    
    const request = new Request('https://test.com/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          type: 'function-call',
          content: 'Hello, how are you today?',
          transcript: { content: 'Hello, how are you today?' },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    const start = Date.now();
    const response = await handleVapiWebhook(request, mockEnv);
    const elapsed = Date.now() - start;

    console.log(`[PERF_TEST] Webhook latency: ${elapsed}ms`);

    // CRITICAL: Must be under 3000ms
    expect(elapsed).toBeLessThan(3000);
    
    // Target: <2000ms for good experience
    if (elapsed < 2000) {
      console.log('[PERF_TEST] ✓ Excellent latency (<2s)');
    } else if (elapsed < 2500) {
      console.log('[PERF_TEST] ✓ Good latency (2-2.5s)');
    } else {
      console.log('[PERF_TEST] ⚠ Acceptable latency (2.5-3s) - could be optimized');
    }

    expect(response.status).toBe(200);
  }, 5000); // 5s timeout for test itself

  // Test 2: Average latency over 10 calls <2.5 seconds
  test('average latency over 10 calls <2.5 seconds', async () => {
    console.log('[PERF_TEST] Testing average latency over 10 calls...');
    
    const latencies: number[] = [];
    const request = new Request('https://test.com/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          type: 'function-call',
          content: 'Test message',
          transcript: { content: 'Test message' },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      await handleVapiWebhook(request, mockEnv);
      const elapsed = Date.now() - start;
      latencies.push(elapsed);
      console.log(`[PERF_TEST] Call ${i + 1}/10: ${elapsed}ms`);
    }

    const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    const maxLatency = Math.max(...latencies);
    const minLatency = Math.min(...latencies);

    console.log(`[PERF_TEST] Average: ${avgLatency.toFixed(0)}ms`);
    console.log(`[PERF_TEST] Min: ${minLatency}ms, Max: ${maxLatency}ms`);

    // Average must be under 2500ms
    expect(avgLatency).toBeLessThan(2500);
    
    // All calls should be under 3000ms
    expect(maxLatency).toBeLessThan(3000);
  }, 35000); // 35s timeout for 10 calls

  // Test 3: No timeouts in 20 consecutive calls
  test('no timeouts in 20 consecutive calls', async () => {
    console.log('[PERF_TEST] Testing 20 consecutive calls for reliability...');
    
    const request = new Request('https://test.com/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          type: 'function-call',
          content: 'Reliability test',
          transcript: { content: 'Reliability test' },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    let successCount = 0;
    let timeoutCount = 0;
    const latencies: number[] = [];

    for (let i = 0; i < 20; i++) {
      try {
        const start = Date.now();
        const response = await handleVapiWebhook(request, mockEnv);
        const elapsed = Date.now() - start;
        latencies.push(elapsed);

        if (response.status === 200) {
          successCount++;
        }

        // Consider it a timeout if >7s (our fallback threshold)
        if (elapsed > 7000) {
          timeoutCount++;
          console.log(`[PERF_TEST] Call ${i + 1}/20: TIMEOUT (${elapsed}ms)`);
        }
      } catch (error) {
        timeoutCount++;
        console.error(`[PERF_TEST] Call ${i + 1}/20: ERROR`, error);
      }
    }

    console.log(`[PERF_TEST] Success: ${successCount}/20`);
    console.log(`[PERF_TEST] Timeouts: ${timeoutCount}/20`);
    console.log(`[PERF_TEST] Avg latency: ${(latencies.reduce((sum, l) => sum + l, 0) / latencies.length).toFixed(0)}ms`);

    // No timeouts allowed
    expect(timeoutCount).toBe(0);
    expect(successCount).toBe(20);
  }, 65000); // 65s timeout for 20 calls

  // Test 4: KV read latency <200ms
  test('KV read latency <200ms', async () => {
    console.log('[PERF_TEST] Testing KV read latency...');
    
    // Mock KV with a profile
    const kvEnv = {
      ...mockEnv,
      KV: {
        get: async (key: string) => {
          // Simulate small delay
          await new Promise(resolve => setTimeout(resolve, 10));
          if (key === 'senior-perf-test') {
            return JSON.stringify(MOCK_PROFILE);
          }
          return null;
        },
        put: async () => undefined,
        delete: async () => undefined,
        list: async () => ({ keys: [], list_complete: true, cursor: '' })
      } as any
    };

    const start = Date.now();
    const profile = await getProfile('perf-test', kvEnv);
    const elapsed = Date.now() - start;

    console.log(`[PERF_TEST] KV read latency: ${elapsed}ms`);

    // KV reads must be fast (<200ms)
    expect(elapsed).toBeLessThan(200);
    expect(profile).not.toBeNull();
  });

  // Test 5: KV write latency <300ms
  test('KV write latency <300ms', async () => {
    console.log('[PERF_TEST] Testing KV write latency...');
    
    const kvEnv = {
      ...mockEnv,
      KV: {
        get: async () => null,
        put: async () => {
          // Simulate small delay
          await new Promise(resolve => setTimeout(resolve, 15));
        },
        delete: async () => undefined,
        list: async () => ({ keys: [], list_complete: true, cursor: '' })
      } as any
    };

    const start = Date.now();
    await saveProfile(MOCK_PROFILE, kvEnv);
    const elapsed = Date.now() - start;

    console.log(`[PERF_TEST] KV write latency: ${elapsed}ms`);

    // KV writes should be reasonably fast
    expect(elapsed).toBeLessThan(300);
  });

  // Test 6: Worker processes request efficiently
  test('worker response body size reasonable', async () => {
    console.log('[PERF_TEST] Testing response payload size...');
    
    const request = new Request('https://test.com/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          type: 'function-call',
          content: 'Hello',
          transcript: { content: 'Hello' },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    const body = await response.text();
    const sizeBytes = new TextEncoder().encode(body).length;
    const sizeKB = (sizeBytes / 1024).toFixed(2);

    console.log(`[PERF_TEST] Response size: ${sizeKB} KB`);

    // Response should be reasonably small (<10KB)
    expect(sizeBytes).toBeLessThan(10 * 1024);
    
    // Should have required fields
    const data = JSON.parse(body);
    expect(data).toHaveProperty('content');
  });

  // Test 7: Performance degradation check over time
  test('no performance degradation over multiple calls', async () => {
    console.log('[PERF_TEST] Testing for performance degradation...');
    
    const request = new Request('https://test.com/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          type: 'function-call',
          content: 'Degradation test',
          transcript: { content: 'Degradation test' },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    // First 5 calls
    const firstBatch: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await handleVapiWebhook(request, mockEnv);
      firstBatch.push(Date.now() - start);
    }

    // Next 5 calls (after some work)
    const secondBatch: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await handleVapiWebhook(request, mockEnv);
      secondBatch.push(Date.now() - start);
    }

    const firstAvg = firstBatch.reduce((sum, l) => sum + l, 0) / firstBatch.length;
    const secondAvg = secondBatch.reduce((sum, l) => sum + l, 0) / secondBatch.length;
    const maxFirst = Math.max(...firstBatch);
    const maxSecond = Math.max(...secondBatch);

    console.log(`[PERF_TEST] First batch avg: ${firstAvg.toFixed(0)}ms (max: ${maxFirst}ms)`);
    console.log(`[PERF_TEST] Second batch avg: ${secondAvg.toFixed(0)}ms (max: ${maxSecond}ms)`);

    // Both batches should maintain <3s latency (no degradation to timeout)
    expect(maxFirst).toBeLessThan(3000);
    expect(maxSecond).toBeLessThan(3000);
    
    // Second batch shouldn't be significantly slower
    // In mock environment with very fast responses, use absolute difference
    const absoluteDiff = Math.abs(secondAvg - firstAvg);
    console.log(`[PERF_TEST] Absolute difference: ${absoluteDiff.toFixed(1)}ms`);
    
    // Absolute difference should be reasonable (<500ms) for production
    expect(absoluteDiff).toBeLessThan(500);
  }, 35000); // 35s timeout for 10 calls
});

