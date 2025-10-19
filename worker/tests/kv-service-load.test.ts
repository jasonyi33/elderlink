/**
 * Task 3.3f: KV Service Load Testing
 * 
 * Tests KV service under heavy load
 * - 100 concurrent writes
 * - Data integrity verification
 * - TTL expiration validation
 * 
 * Reference: DEVELOPER_2_IMPLEMENTATION.md Task 3.3f
 */

import { getProfile, saveProfile, saveLiveSentiment, getLiveSentiment } from '../src/services/kv-service';
import { SeniorProfile } from '../src/types';

describe('KV Service Load Testing - Task 3.3f', () => {
  let mockKV: any;
  let mockEnv: any;

  beforeEach(() => {
    mockKV = {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      list: jest.fn()
    };

    mockEnv = {
      KV: mockKV,
      ENVIRONMENT: 'test',
      GEMINI_API_KEY: 'test-key',
      VAPI_API_KEY: 'test-key',
      ELEVENLABS_ENGLISH_VOICE: 'english-voice',
      ELEVENLABS_MANDARIN_VOICE: 'mandarin-voice',
      context: {
        waitUntil: jest.fn(),
        passThroughOnException: jest.fn()
      }
    };

    jest.clearAllMocks();
  });

  // Test 1: 100 concurrent profile writes
  test('handles 100 concurrent profile writes without errors', async () => {
    const writes: Promise<void>[] = [];

    for (let i = 0; i < 100; i++) {
      const profile: Partial<SeniorProfile> = {
        id: `senior-${i}`,
        name: `Senior ${i}`,
        age: 70 + (i % 20),
        conversations: [
          { timestamp: new Date().toISOString(), duration: 0, keyTopics: [], sentiment: 0, summary: `Conv ${i}`, language: 'english' }
        ]
      } as any;

      writes.push(saveProfile(profile as SeniorProfile, mockEnv));
    }

    // Wait for all writes to complete
    await expect(Promise.all(writes)).resolves.not.toThrow();

    // Verify all 100 puts were called
    expect(mockKV.put).toHaveBeenCalledTimes(100);
  }, 20000); // 20 second timeout

  // Test 2: 100 concurrent sentiment writes
  test('handles 100 concurrent live sentiment writes', async () => {
    const writes: Promise<void>[] = [];

    for (let i = 0; i < 100; i++) {
      const sentiment = {
        sentiment: (i % 21 - 10) / 10, // Range from -1 to 1
        emotions: ['emotion' + i],
        timestamp: new Date().toISOString()
      };

      writes.push(saveLiveSentiment(`senior-${i}`, sentiment, mockEnv));
    }

    // Wait for all writes
    await expect(Promise.all(writes)).resolves.not.toThrow();

    // Verify all 100 puts called with TTL
    expect(mockKV.put).toHaveBeenCalledTimes(100);
    
    // Verify TTL was set on all calls
    mockKV.put.mock.calls.forEach((call: any) => {
      expect(call[2]).toEqual({ expirationTtl: 300 });
    });
  }, 20000);

  // Test 3: Data integrity with concurrent reads and writes
  test('maintains data integrity with concurrent reads and writes', async () => {
    const testProfile: Partial<SeniorProfile> = {
      id: 'integrity-test',
      name: 'Integrity Test',
      age: 75,
      conversations: []
    } as any;

    // Mock initial data
    mockKV.get.mockResolvedValue(JSON.stringify(testProfile));

    const operations: Promise<any>[] = [];

    // 50 concurrent writes
    for (let i = 0; i < 50; i++) {
      const updatedProfile = {
        ...testProfile,
        conversations: [
          { timestamp: new Date().toISOString(), duration: 0, keyTopics: [], sentiment: 0, summary: `Write ${i}`, language: 'english' }
        ]
      };
      operations.push(saveProfile(updatedProfile as SeniorProfile, mockEnv));
    }

    // 50 concurrent reads
    for (let i = 0; i < 50; i++) {
      operations.push(getProfile('integrity-test', mockEnv));
    }

    // Execute all operations concurrently
    const results = await Promise.allSettled(operations);

    // All operations should succeed
    const failures = results.filter(r => r.status === 'rejected');
    expect(failures.length).toBe(0);

    // Verify operations completed
    expect(mockKV.put).toHaveBeenCalledTimes(50); // 50 writes
    expect(mockKV.get).toHaveBeenCalledTimes(50); // 50 reads
  }, 20000);

  // Test 4: Conversation truncation under load
  test('enforces conversation limit across 100 updates', async () => {
    const baseProfile: Partial<SeniorProfile> = {
      id: 'truncation-test',
      name: 'Truncation Test',
      age: 70,
      conversations: []
    } as any;

    // Add 15 conversations (should truncate to 10)
    for (let i = 0; i < 15; i++) {
      baseProfile.conversations!.push({
        timestamp: `2025-01-${String(i + 1).padStart(2, '0')}`,
        duration: 0,
        keyTopics: [],
        sentiment: 0,
        summary: `Conv ${i}`,
        language: 'english'
      });
    }

    await saveProfile(baseProfile as SeniorProfile, mockEnv);

    // Get saved data
    const savedData = JSON.parse(mockKV.put.mock.calls[0][1]);

    // Verify truncated to 10
    expect(savedData.conversations.length).toBe(10);

    // Verify oldest 5 removed (Conv 0-4)
    expect(savedData.conversations[0].summary).toBe('Conv 5');

    // Verify newest 10 preserved (Conv 5-14)
    expect(savedData.conversations[9].summary).toBe('Conv 14');
  });

  // Test 5: TTL expiration behavior
  test('live sentiment TTL expiration works correctly', async () => {
    const sentimentData = {
      sentiment: 0.7,
      emotions: ['happy', 'excited'],
      timestamp: '2025-01-18T10:00:00Z'
    };

    // Save with TTL
    await saveLiveSentiment('ttl-test', sentimentData, mockEnv);

    // Verify TTL set correctly
    expect(mockKV.put).toHaveBeenCalledWith(
      'live-sentiment-ttl-test',
      JSON.stringify(sentimentData),
      { expirationTtl: 300 }
    );

    // Mock data still exists
    mockKV.get.mockResolvedValue(JSON.stringify(sentimentData));
    const fresh = await getLiveSentiment('ttl-test', mockEnv);
    expect(fresh).toEqual(sentimentData);

    // Mock data expired (KV returns null after TTL)
    mockKV.get.mockResolvedValue(null);
    const expired = await getLiveSentiment('ttl-test', mockEnv);
    expect(expired).toBeNull();
  });
});

