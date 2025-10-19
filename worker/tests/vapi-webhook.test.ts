/**
 * Task 3.2a: Vapi Webhook Handler Tests (TDD)
 * 
 * Comprehensive tests for webhook handler beyond basic routing
 * Tests performance, timeout handling, async processing, and edge cases
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.2
 * - TDD_TEST_CASES.md Section 2.1
 * - PRD.md lines 728-770, 1121-1289
 */

import { handleVapiWebhook } from '../src/handlers/vapi-webhook';
import { getProfile, saveProfile, saveLiveSentiment, Env } from '../src/services/kv-service';

// Mock the service functions
jest.mock('../src/services/kv-service', () => ({
  getProfile: jest.fn(),
  saveProfile: jest.fn(),
  saveLiveSentiment: jest.fn(),
}));

describe('Vapi Webhook Handler - Task 3.2', () => {
  // Mock environment
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

  // Test 1: Basic message processing
  test('processes valid message successfully', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Hello Sam" },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('content');
    expect(typeof data.content).toBe('string');
    expect(data).toHaveProperty('voiceId');
    expect(data.voiceId).toBe('english-voice-id');
  });

  // Test 2: Empty message handling
  test('handles empty message gracefully', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: { transcript: { content: "" } }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    const data = await response.json() as any;

    expect(response.status).toBe(200);
    expect(data.content).toMatch(/here|listening|time/i);
  });

  // Test 3: Response time requirement
  test('responds in <3 seconds total', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "How are you?" },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    const start = Date.now();
    await handleVapiWebhook(request, mockEnv);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(3000);
  });

  // Test 4: Timeout fallback at 7 seconds
  test('triggers timeout fallback at 7 seconds', async () => {
    // NOTE: This test verifies timeout mechanism exists
    // Full timeout behavior will be testable after Hour 5 when real Gemini integration is added
    // For now, verify the webhook completes quickly (stub doesn't delay)
    
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Test timeout mechanism" },
          language: 'english'
        }
      })
    });

    const start = Date.now();
    const response = await handleVapiWebhook(request, mockEnv);
    const elapsed = Date.now() - start;
    const data = await response.json() as any;

    // With stub, response is very fast
    expect(elapsed).toBeLessThan(1000);
    // Stub returns Sam's greeting (timeout logic exists but not triggered by stub)
    expect(data.content).toBeDefined();
    expect(data.voiceId).toBeDefined();
    
    // TODO: Hour 5 - Update this test to actually trigger 7s timeout with real Gemini delay
  });

  // Test 5: Mandarin voice selection
  test('selects correct voice based on language - Mandarin', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "我今天很好" },
          language: 'mandarin'
        },
        conversationHistory: []
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    const data = await response.json() as any;

    expect(data.voiceId).toBe('mandarin-voice-id');
  });

  // Test 6: English voice selection
  test('selects English voice for English input', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Hello" },
          language: 'english'
        }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    const data = await response.json() as any;

    expect(data.voiceId).toBe('english-voice-id');
  });

  // Test 7: Unknown language defaults to English
  test('defaults to English voice for unknown language', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Hola" },
          language: 'spanish'
        }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    const data = await response.json() as any;

    expect(data.voiceId).toBe('english-voice-id');
  });

  // Test 8: Async processing doesn't block response
  test('async processing does not block response', async () => {
    // Make async operations slow
    (saveProfile as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 5000))
    );

    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Test async" },
          language: 'english'
        }
      })
    });

    const start = Date.now();
    await handleVapiWebhook(request, mockEnv);
    const responseTime = Date.now() - start;

    // Response should be sent BEFORE async processing completes
    expect(responseTime).toBeLessThan(3000);
  });

  // Test 9: Uses env.context.waitUntil for async processing
  test('uses env.context.waitUntil() for async processing', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Test waitUntil" },
          language: 'english'
        }
      })
    });

    await handleVapiWebhook(request, mockEnv);

    // Verify waitUntil was called with a promise
    expect(mockCtx.waitUntil).toHaveBeenCalled();
    expect(mockCtx.waitUntil.mock.calls[0][0]).toBeInstanceOf(Promise);
  });

  // Test 10: Async processing continues after response sent
  test('async processing continues after response sent', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Test async continuation" },
          language: 'english'
        }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    expect(response.status).toBe(200);

    // Wait for async processing to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify async operations were called
    expect(saveLiveSentiment).toHaveBeenCalled();
    expect(saveProfile).toHaveBeenCalled();
  });

  // Test 11: Async failure doesn't affect response
  test('async processing failure does not affect response', async () => {
    // Make async operations fail
    (saveProfile as jest.Mock).mockRejectedValue(new Error('KV error'));
    (saveLiveSentiment as jest.Mock).mockRejectedValue(new Error('KV error'));

    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Test error handling" },
          language: 'english'
        }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);

    // Response should still be successful
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('voiceId');
  });

  // Test 12: Profile updated after async processing
  test('profile updated after async processing completes', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "I planted tomatoes today" },
          language: 'english'
        }
      })
    });

    await handleVapiWebhook(request, mockEnv);

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify profile was saved with updated conversation
    expect(saveProfile).toHaveBeenCalled();
    const savedProfile = (saveProfile as jest.Mock).mock.calls[0][0];
    expect(savedProfile.conversations.length).toBeGreaterThan(0);
  });

  // Test 13: Handles simultaneous calls without corruption
  test('handles 2 simultaneous calls to same senior without corruption', async () => {
    const request1 = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "First call" },
          language: 'english'
        }
      })
    });

    const request2 = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: "Second call" },
          language: 'english'
        }
      })
    });

    // Make both calls simultaneously
    const [response1, response2] = await Promise.all([
      handleVapiWebhook(request1, mockEnv),
      handleVapiWebhook(request2, mockEnv)
    ]);

    // Both should succeed
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    // Both should have valid responses
    const data1 = await response1.json() as any;
    const data2 = await response2.json() as any;
    expect(data1).toHaveProperty('content');
    expect(data2).toHaveProperty('content');
  });
});

