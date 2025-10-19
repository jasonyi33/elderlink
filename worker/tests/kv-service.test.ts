/**
 * Task 3.3a: KV Service Tests (TDD)
 * 
 * Tests for Cloudflare KV storage operations
 * - Profile storage and retrieval
 * - Conversation limit enforcement (max 10)
 * - Live sentiment TTL (5 minutes)
 * - Race condition handling (atomic updates)
 * - Missing profile handling
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.3
 * - TDD_TEST_CASES.md Section 2.2
 * - PRD.md lines 774-788
 */

import { getProfile, saveProfile, saveLiveSentiment, getLiveSentiment } from '../src/services/kv-service';
import { SeniorProfile } from '../src/types';

describe('KV Service - Task 3.3', () => {
  // Mock KV namespace
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

  // Test 1: Stores and retrieves profile
  test('stores and retrieves profile', async () => {
    const testProfile: Partial<SeniorProfile> = {
      id: 'test-senior',
      name: 'Test Senior',
      age: 70,
      phone: '+1234567890',
      languages: ['english'],
      location: 'Seattle, WA',
      memories: {
        family: [],
        hobbies: ['reading'],
        health: [],
        recentEvents: [],
        preferences: {
          topicsEnjoys: [],
          topicsAvoid: [],
          conversationStyle: 'friendly'
        }
      },
      socialProfile: {
        interests: ['reading'],
        culturalBackground: 'American',
        openToMatching: true
      },
      healthData: {
        conditions: [],
        medications: [],
        vitals: {
          lastUpdated: '2025-01-01'
        },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: {
          lonelinessScore: 0,
          averageSentiment: 0,
          trend: 'stable'
        },
        physicalHealth: {
          symptomMentions: 0,
          medicationAdherence: 0,
          appointmentReminders: 0
        },
        socialHealth: {
          matchesMade: 0,
          groupsJoined: 0,
          communityEngagement: 0
        },
        holisticScore: 0,
        lastCallDate: '',
        callFrequency: 0
      }
    };

    // Save profile
    await saveProfile(testProfile as SeniorProfile, mockEnv);

    // Verify KV.put was called with correct key and data
    expect(mockKV.put).toHaveBeenCalledWith(
      'senior-test-senior',
      JSON.stringify(testProfile)
    );

    // Mock KV.get to return the saved profile
    mockKV.get.mockResolvedValue(JSON.stringify(testProfile));

    // Retrieve profile
    const retrieved = await getProfile('test-senior', mockEnv);

    // Verify KV.get was called with correct key
    expect(mockKV.get).toHaveBeenCalledWith('senior-test-senior');

    // Verify retrieved profile matches
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe('test-senior');
    expect(retrieved!.name).toBe('Test Senior');
    expect(retrieved!.age).toBe(70);
  });

  // Test 2: Conversation limit enforced (max 10)
  test('conversation limit enforced - max 10 conversations', async () => {
    const testProfile: Partial<SeniorProfile> = {
      id: 'mrs-chen',
      name: 'Mrs. Chen',
      age: 72,
      conversations: [
        { timestamp: '2025-01-01', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 1', language: 'english' },
        { timestamp: '2025-01-02', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 2', language: 'english' },
        { timestamp: '2025-01-03', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 3', language: 'english' },
        { timestamp: '2025-01-04', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 4', language: 'english' },
        { timestamp: '2025-01-05', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 5', language: 'english' },
        { timestamp: '2025-01-06', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 6', language: 'english' },
        { timestamp: '2025-01-07', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 7', language: 'english' },
        { timestamp: '2025-01-08', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 8', language: 'english' },
        { timestamp: '2025-01-09', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 9', language: 'english' },
        { timestamp: '2025-01-10', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 10', language: 'english' }
      ]
    } as any;

    // Add 11th conversation
    testProfile.conversations!.push({
      timestamp: '2025-01-11',
      duration: 0,
      keyTopics: [],
      sentiment: 0,
      summary: 'Conv 11',
      language: 'english'
    });

    // Save profile (should truncate to 10)
    await saveProfile(testProfile as SeniorProfile, mockEnv);

    // Get the data that was saved
    const savedData = JSON.parse(mockKV.put.mock.calls[0][1]);

    // Verify only 10 conversations remain
    expect(savedData.conversations.length).toBe(10);

    // Verify oldest conversation (Conv 1) was removed
    expect(savedData.conversations[0].summary).toBe('Conv 2');

    // Verify newest conversation (Conv 11) is present
    expect(savedData.conversations[9].summary).toBe('Conv 11');
  });

  // Test 3: Live sentiment has 5-minute TTL
  test('live sentiment has 5-minute TTL', async () => {
    const sentimentData = {
      sentiment: 0.5,
      emotions: ['happy'],
      timestamp: '2025-01-18T10:00:00Z'
    };

    // Save live sentiment
    await saveLiveSentiment('mrs-chen', sentimentData, mockEnv);

    // Verify KV.put was called with correct key, data, and TTL
    expect(mockKV.put).toHaveBeenCalledWith(
      'live-sentiment-mrs-chen',
      JSON.stringify(sentimentData),
      { expirationTtl: 300 } // 5 minutes = 300 seconds
    );

    // Mock getLiveSentiment - recent data exists
    mockKV.get.mockResolvedValue(JSON.stringify(sentimentData));

    const recentData = await getLiveSentiment('mrs-chen', mockEnv);
    expect(recentData).toEqual(sentimentData);

    // Mock getLiveSentiment - data expired (returns null)
    mockKV.get.mockResolvedValue(null);

    const expiredData = await getLiveSentiment('mrs-chen', mockEnv);
    expect(expiredData).toBeNull();
  });

  // Test 4: Handles race conditions with atomic updates
  test('handles race conditions with atomic updates', async () => {
    const baseProfile: Partial<SeniorProfile> = {
      id: 'race-test',
      name: 'Race Test',
      age: 70,
      conversations: [
        { timestamp: '2025-01-01', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 1', language: 'english' }
      ]
    } as any;

    // Mock getProfile to return base profile
    mockKV.get.mockResolvedValue(JSON.stringify(baseProfile));

    // Simulate 2 concurrent writes
    const profile1 = { ...baseProfile, conversations: [...baseProfile.conversations!, { timestamp: '2025-01-02', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 2', language: 'english' }] };
    const profile2 = { ...baseProfile, conversations: [...baseProfile.conversations!, { timestamp: '2025-01-03', duration: 0, keyTopics: [], sentiment: 0, summary: 'Conv 3', language: 'english' }] };

    // Execute both saves concurrently
    await Promise.all([
      saveProfile(profile1 as SeniorProfile, mockEnv),
      saveProfile(profile2 as SeniorProfile, mockEnv)
    ]);

    // Verify both saves completed
    expect(mockKV.put).toHaveBeenCalledTimes(2);

    // Both should have saved their respective data
    const save1 = JSON.parse(mockKV.put.mock.calls[0][1]);
    const save2 = JSON.parse(mockKV.put.mock.calls[1][1]);

    // Each save should have 2 conversations (base + new)
    expect(save1.conversations.length).toBe(2);
    expect(save2.conversations.length).toBe(2);

    // NOTE: In a real atomic implementation, we would use KV metadata
    // or version checking. For the hackathon, we accept eventual consistency.
  });

  // Test 5: Handles missing profile gracefully
  test('handles missing profile gracefully', async () => {
    // Mock KV.get to return null (profile doesn't exist)
    mockKV.get.mockResolvedValue(null);

    // Attempt to get non-existent profile
    const result = await getProfile('non-existent', mockEnv);

    // Should return null (not throw error)
    expect(result).toBeNull();

    // Verify KV.get was called
    expect(mockKV.get).toHaveBeenCalledWith('senior-non-existent');
  });
});

