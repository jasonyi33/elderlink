/**
 * Task 3.2f: Vapi Webhook Load Testing
 * 
 * Tests webhook handler under load conditions
 * Reference: DEVELOPER_2_IMPLEMENTATION.md Task 3.2f
 */

import { handleVapiWebhook } from '../src/handlers/vapi-webhook';
import { getProfile, saveProfile, saveLiveSentiment, Env } from '../src/services/kv-service';

jest.mock('../src/services/kv-service', () => ({
  getProfile: jest.fn(),
  saveProfile: jest.fn(),
  saveLiveSentiment: jest.fn(),
}));

describe('Vapi Webhook Load Testing - Task 3.2f', () => {
  const mockKV = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
  };

  const mockCtx = {
    waitUntil: jest.fn((promise: Promise<any>) => promise),
    passThroughOnException: jest.fn()
  } as any;

  const mockEnv: Env = {
    KV: mockKV as any,
    ENVIRONMENT: 'test',
    GEMINI_API_KEY: 'test-key',
    VAPI_API_KEY: 'test-key',
    ELEVENLABS_ENGLISH_VOICE: 'english-voice-id',
    ELEVENLABS_MANDARIN_VOICE: 'mandarin-voice-id',
    context: mockCtx
  };

  const mockProfile = {
    id: 'mrs-chen',
    name: 'Mrs. Chen',
    age: 72,
    conversations: [],
    wellnessMetrics: {
      mentalHealth: { averageSentiment: 0 }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue(mockProfile);
    (saveProfile as jest.Mock).mockResolvedValue(undefined);
    (saveLiveSentiment as jest.Mock).mockResolvedValue(undefined);
  });

  // Test 1: 20 consecutive calls without timeout
  test('handles 20 consecutive webhook calls without timeout', async () => {
    const calls: Promise<Response>[] = [];

    for (let i = 0; i < 20; i++) {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            transcript: { content: `Test message ${i}` },
            language: 'english'
          }
        })
      });

      calls.push(handleVapiWebhook(request, mockEnv));
    }

    const responses = await Promise.all(calls);

    // All should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    // Verify all returned valid data
    const dataPromises = responses.map(r => r.json());
    const allData = await Promise.all(dataPromises);
    
    allData.forEach(data => {
      expect(data).toHaveProperty('content');
      expect(data).toHaveProperty('voiceId');
    });
  }, 15000); // 15 second timeout

  // Test 2: Verify no timeouts in 20 calls
  test('no timeouts in 20 consecutive calls', async () => {
    const latencies: number[] = [];

    for (let i = 0; i < 20; i++) {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            transcript: { content: `Call ${i}` },
            language: 'english'
          }
        })
      });

      const start = Date.now();
      await handleVapiWebhook(request, mockEnv);
      const elapsed = Date.now() - start;
      
      latencies.push(elapsed);
    }

    // All calls should complete in <3 seconds
    latencies.forEach((latency) => {
      expect(latency).toBeLessThan(3000);
    });

    // Calculate average
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    console.log(`Average latency over 20 calls: ${avgLatency.toFixed(2)}ms`);
    
    // Average should be well under 3 seconds
    expect(avgLatency).toBeLessThan(2500);
  }, 15000);

  // Test 3: Async processing completes for all calls
  test('async processing completes for all 20 calls', async () => {
    const calls = [];

    for (let i = 0; i < 20; i++) {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            transcript: { content: `Message ${i}` },
            language: 'english'
          }
        })
      });

      calls.push(handleVapiWebhook(request, mockEnv));
    }

    await Promise.all(calls);

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify saveProfile called 20 times (once per call)
    expect(saveProfile).toHaveBeenCalledTimes(20);
    expect(saveLiveSentiment).toHaveBeenCalledTimes(20);
  }, 15000);

  // Test 4: No race conditions with concurrent calls
  test('handles concurrent calls without corruption', async () => {
    const concurrentCalls = 10;
    const calls = [];

    // Make 10 simultaneous calls
    for (let i = 0; i < concurrentCalls; i++) {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            transcript: { content: `Concurrent call ${i}` },
            language: i % 2 === 0 ? 'english' : 'mandarin'
          }
        })
      });

      calls.push(handleVapiWebhook(request, mockEnv));
    }

    const responses = await Promise.all(calls);

    // All should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Wait for async
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify no corruption (all calls processed)
    expect(saveProfile).toHaveBeenCalledTimes(concurrentCalls);
  }, 15000);
});

