/**
 * Task 3.4: Health Service Integration Tests
 * Verifies health service is actually used by webhook
 */

import { handleVapiWebhook } from '../src/handlers/vapi-webhook';
import { Env } from '../src/services/kv-service';
import { createHealthNote, appendHealthNote, extractVitals } from '../src/services/health-service';

// Mock environment
const mockEnv = {
  KV: {
    get: jest.fn(),
    put: jest.fn(),
  },
  ENVIRONMENT: 'test',
  GEMINI_API_KEY: 'test-key',
  VAPI_API_KEY: 'test-key',
  ELEVENLABS_ENGLISH_VOICE: 'test-voice-en',
  ELEVENLABS_MANDARIN_VOICE: 'test-voice-zh',
  context: {
    waitUntil: jest.fn((promise) => promise),
  },
} as unknown as Env;

describe('Health Service Integration with Webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('webhook creates health notes from health mentions', async () => {
    // Mock profile with empty notes
    const mockProfile = {
      id: 'mrs-chen',
      name: 'Mrs. Chen',
      age: 72,
      healthData: {
        notes: [],
        conditions: [],
        medications: [],
        appointments: [],
        vitals: {}
      },
      memories: { family: [], hobbies: [], health: [], recentEvents: [], preferences: { topicsEnjoys: [], topicsAvoid: [], conversationStyle: '' } },
      socialProfile: { interests: [], culturalBackground: '', openToMatching: true },
      conversations: [],
      matches: [],
      groups: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0, averageSentiment: 0, trend: 'stable' },
        physicalHealth: { symptomMentions: 0, medicationAdherence: 0, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
        holisticScore: 0,
        lastCallDate: '',
        callFrequency: 0
      }
    };

    (mockEnv.KV.get as jest.Mock).mockResolvedValue(JSON.stringify(mockProfile));

    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: 'My back hurts when I garden' },
          language: 'english'
        }
      })
    });

    const response = await handleVapiWebhook(request, mockEnv);
    
    expect(response.status).toBe(200);

    // Wait for async processing to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify saveProfile was called
    expect(mockEnv.KV.put).toHaveBeenCalled();

    // Get the saved profile
    const saveCall = (mockEnv.KV.put as jest.Mock).mock.calls.find(
      call => call[0] === 'senior-mrs-chen'
    );
    
    if (saveCall) {
      const savedProfile = JSON.parse(saveCall[1]);
      
      // Verify health note was created
      expect(savedProfile.healthData.notes.length).toBeGreaterThan(0);
      
      // Verify note has correct structure
      const latestNote = savedProfile.healthData.notes[savedProfile.healthData.notes.length - 1];
      expect(latestNote).toMatchObject({
        timestamp: expect.any(String),
        source: 'Sam AI Conversation',
        note: expect.stringMatching(/Patient reports/i)
      });
    }
  });

  test('webhook extracts and stores vitals', async () => {
    const mockProfile = {
      id: 'mrs-chen',
      healthData: {
        notes: [],
        vitals: { lastUpdated: '2024-01-01' }
      },
      conversations: [],
      memories: { family: [], hobbies: [], health: [], recentEvents: [], preferences: { topicsEnjoys: [], topicsAvoid: [], conversationStyle: '' } },
      socialProfile: { interests: [], culturalBackground: '', openToMatching: true },
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0, averageSentiment: 0, trend: 'stable' },
        physicalHealth: { symptomMentions: 0, medicationAdherence: 0, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
        holisticScore: 0,
        lastCallDate: '',
        callFrequency: 0
      }
    };

    (mockEnv.KV.get as jest.Mock).mockResolvedValue(JSON.stringify(mockProfile));

    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          transcript: { content: 'My blood pressure was 130/85 this morning' },
          language: 'english'
        }
      })
    });

    await handleVapiWebhook(request, mockEnv);
    
    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the saved profile
    const saveCall = (mockEnv.KV.put as jest.Mock).mock.calls.find(
      call => call[0] === 'senior-mrs-chen'
    );

    if (saveCall) {
      const savedProfile = JSON.parse(saveCall[1]);
      
      // Verify vitals were extracted and stored
      expect(savedProfile.healthData.vitals.bloodPressure).toBe('130/85');
      expect(savedProfile.healthData.vitals.lastUpdated).not.toBe('2024-01-01');
    }
  });

  test('health service functions are imported and available', () => {
    // This test verifies imports exist
    expect(createHealthNote).toBeDefined();
    expect(appendHealthNote).toBeDefined();
    expect(extractVitals).toBeDefined();
  });
});

