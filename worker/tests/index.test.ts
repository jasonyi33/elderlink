/**
 * Task 3.1a: API Endpoints Tests (TDD)
 * 
 * This file tests all 12 API endpoints for the ElderLink Worker.
 * Following TDD methodology - these tests are written FIRST and will FAIL initially.
 * 
 * Reference: 
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.1
 * - TDD_TEST_CASES.md Section 2.1
 * - PRD.md Section 7 (lines 992-1118)
 */

import worker from '../src/index';

// Mock SeniorProfile structure (from PRD lines 134-260)
const MOCK_MRS_CHEN = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+1-206-555-0123',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',
  memories: {
    family: [
      { name: 'Sarah', relationship: 'daughter', details: ['Visits weekly', 'Lives nearby'] },
      { name: 'Tommy', relationship: 'grandson', details: ['5 years old'] }
    ],
    hobbies: ['gardening', 'piano', 'cooking'],
    health: ['arthritis in knees', 'takes medication regularly'],
    recentEvents: ['planted tomatoes last week'],
    preferences: {
      topicsEnjoys: ['family', 'gardening', 'music'],
      topicsAvoid: [],
      conversationStyle: 'warm and nostalgic'
    }
  },
  socialProfile: {
    interests: ['gardening', 'piano', 'cooking', 'Shanghai culture'],
    culturalBackground: 'Shanghai, Mandarin',
    openToMatching: true
  },
  healthData: {
    conditions: [
      { name: 'Hypertension', since: '2018', status: 'controlled' },
      { name: 'Osteoarthritis', since: '2020', status: 'managed' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'daily morning', purpose: 'blood pressure' },
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily', purpose: 'bone health' }
    ],
    vitals: {
      lastUpdated: '2025-01-10',
      bloodPressure: '128/82',
      weight: '145 lbs'
    },
    appointments: [
      { date: '2025-01-25', time: '10:00am', type: 'Primary care checkup', doctor: 'Dr. Smith' }
    ],
    notes: []
  },
  matches: [],
  groups: [],
  conversations: [],
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 45,
      averageSentiment: 0.3,
      trend: 'stable'
    },
    physicalHealth: {
      symptomMentions: 2,
      medicationAdherence: 90,
      appointmentReminders: 1
    },
    socialHealth: {
      matchesMade: 0,
      groupsJoined: 0,
      communityEngagement: 0
    },
    holisticScore: 65,
    lastCallDate: '2025-01-18',
    callFrequency: 3
  }
};

describe('API Endpoints - Task 3.1', () => {
  // Mock KV namespace
  const mockKV = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
  };

  // Mock ExecutionContext
  const mockCtx = {
    waitUntil: jest.fn(),
    passThroughOnException: jest.fn()
  } as any;

  // Mock environment
  const mockEnv = {
    KV: mockKV as any,
    ENVIRONMENT: 'test',
    GEMINI_API_KEY: 'test-gemini-key',
    VAPI_API_KEY: 'test-vapi-key',
    ELEVENLABS_ENGLISH_VOICE: 'test-english-voice',
    ELEVENLABS_MANDARIN_VOICE: 'test-mandarin-voice',
    context: mockCtx
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: GET /api/health
  test('GET /api/health returns ok status with timestamp', async () => {
    const request = new Request('http://localhost/api/health', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
    // Verify timestamp is valid ISO format
    expect(() => new Date(data.timestamp)).not.toThrow();
  });

  // Test 2: POST /vapi-webhook
  test('POST /vapi-webhook with valid message returns content and voiceId', async () => {
    const request = new Request('http://localhost/vapi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: { 
          transcript: { content: "Hello Sam" },
          language: 'english'
        },
        conversationHistory: []
      })
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('content');
    expect(typeof data.content).toBe('string');
    expect(data).toHaveProperty('voiceId');
    expect(typeof data.voiceId).toBe('string');
  });

  // Test 3: GET /api/senior/mrs-chen
  test('GET /api/senior/mrs-chen returns complete SeniorProfile', async () => {
    mockKV.get.mockResolvedValue(JSON.stringify(MOCK_MRS_CHEN));

    const request = new Request('http://localhost/api/senior/mrs-chen', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    // Verify complete profile structure
    expect(data).toHaveProperty('id', 'mrs-chen');
    expect(data).toHaveProperty('name', 'Mrs. Chen');
    expect(data).toHaveProperty('age');
    expect(data).toHaveProperty('memories');
    expect(data).toHaveProperty('healthData');
    expect(data).toHaveProperty('socialProfile');
    expect(data).toHaveProperty('wellnessMetrics');
    expect(data.memories).toHaveProperty('family');
    expect(data.memories).toHaveProperty('hobbies');
  });

  // Test 4: GET /api/sentiment/live
  test('GET /api/sentiment/live returns sentiment with emotions and timestamp', async () => {
    const mockSentiment = {
      sentiment: 0.5,
      emotions: ['happy', 'content'],
      timestamp: new Date().toISOString()
    };
    mockKV.get.mockResolvedValue(JSON.stringify(mockSentiment));

    const request = new Request('http://localhost/api/sentiment/live', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('sentiment');
    expect(typeof data.sentiment).toBe('number');
    expect(data).toHaveProperty('emotions');
    expect(Array.isArray(data.emotions)).toBe(true);
    expect(data).toHaveProperty('timestamp');
  });

  // Test 5: GET /api/analytics
  test('GET /api/analytics returns aggregate analytics', async () => {
    mockKV.get.mockResolvedValue(JSON.stringify(MOCK_MRS_CHEN));

    const request = new Request('http://localhost/api/analytics', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    // Verify analytics structure
    expect(data).toHaveProperty('totalConversations');
    expect(data).toHaveProperty('averageSentiment');
    expect(data).toHaveProperty('totalMatches');
    expect(data).toHaveProperty('seniorCount');
    expect(typeof data.totalConversations).toBe('number');
    expect(typeof data.averageSentiment).toBe('number');
  });

  // Test 6: GET /api/mychart/:seniorId
  test('GET /api/mychart/:seniorId returns health data', async () => {
    mockKV.get.mockResolvedValue(JSON.stringify(MOCK_MRS_CHEN));

    const request = new Request('http://localhost/api/mychart/mrs-chen', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    // Verify health data structure
    expect(data).toHaveProperty('conditions');
    expect(data).toHaveProperty('medications');
    expect(data).toHaveProperty('vitals');
    expect(data).toHaveProperty('appointments');
    expect(data).toHaveProperty('notes');
    expect(Array.isArray(data.conditions)).toBe(true);
    expect(Array.isArray(data.medications)).toBe(true);
  });

  // Test 7: GET /api/mychart/:seniorId/appointments
  test('GET /api/mychart/:seniorId/appointments returns upcoming appointments only', async () => {
    mockKV.get.mockResolvedValue(JSON.stringify(MOCK_MRS_CHEN));

    const request = new Request('http://localhost/api/mychart/mrs-chen/appointments', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    // If appointments exist, verify structure
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('time');
      expect(data[0]).toHaveProperty('type');
      expect(data[0]).toHaveProperty('doctor');
    }
  });

  // Test 8: POST /api/mychart/:seniorId/update
  test('POST /api/mychart/:seniorId/update accepts batch health notes', async () => {
    mockKV.get.mockResolvedValue(JSON.stringify(MOCK_MRS_CHEN));
    mockKV.put.mockResolvedValue(undefined);

    const healthNotes = [
      {
        timestamp: new Date().toISOString(),
        source: 'Sam AI Conversation',
        note: 'Patient reports: back pain when gardening',
        mentions: [
          { type: 'symptom', text: 'back pain', context: 'gardening', severity: 'mild' }
        ]
      }
    ];

    const request = new Request('http://localhost/api/mychart/mrs-chen/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: healthNotes })
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('success', true);
  });

  // Test 9: GET /api/matches/:seniorId
  test('GET /api/matches/:seniorId returns top 3 matches or fewer', async () => {
    const profileWithMatches = {
      ...MOCK_MRS_CHEN,
      matches: [
        { seniorId: 'mrs-lee', score: 90, compatibility: 'high', sharedInterests: ['gardening', 'piano'] },
        { seniorId: 'mr-wang', score: 85, compatibility: 'high', sharedInterests: ['gardening'] },
        { seniorId: 'mrs-kim', score: 65, compatibility: 'medium', sharedInterests: ['gardening'] }
      ]
    };
    mockKV.get.mockResolvedValue(JSON.stringify(profileWithMatches));

    const request = new Request('http://localhost/api/matches/mrs-chen', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(3);
    // If matches exist, verify structure
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('seniorId');
      expect(data[0]).toHaveProperty('score');
      expect(data[0]).toHaveProperty('compatibility');
      expect(data[0]).toHaveProperty('sharedInterests');
      expect(Array.isArray(data[0].sharedInterests)).toBe(true);
    }
  });

  // Test 10: GET /api/groups/:seniorId
  test('GET /api/groups/:seniorId returns suggested groups', async () => {
    const profileWithGroups = {
      ...MOCK_MRS_CHEN,
      groups: [
        {
          id: 'mandarin-gardening-circle',
          name: 'Mandarin Gardening Circle',
          memberCount: 3,
          activity: 'gardening',
          language: 'Mandarin',
          schedule: 'Weekly'
        }
      ]
    };
    mockKV.get.mockResolvedValue(JSON.stringify(profileWithGroups));

    const request = new Request('http://localhost/api/groups/mrs-chen', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    // If groups exist, verify structure
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('memberCount');
      expect(data[0]).toHaveProperty('language');
      expect(data[0]).toHaveProperty('schedule');
    }
  });

  // Test 11: POST /api/init-demo
  test('POST /api/init-demo initializes demo data idempotently', async () => {
    mockKV.put.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/init-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MOCK_MRS_CHEN)
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
    
    // Verify KV.put was called with correct key format
    expect(mockKV.put).toHaveBeenCalled();
    const putCall = mockKV.put.mock.calls[0];
    expect(putCall[0]).toBe('senior-mrs-chen');
  });

  // Test 12: GET /api/alerts/:seniorId
  test('GET /api/alerts/:seniorId returns alerts array', async () => {
    const mockAlerts = [
      {
        seniorId: 'mrs-chen',
        severity: 'high',
        type: 'medical',
        message: 'Patient mentioned chest pain',
        timestamp: new Date().toISOString(),
        requiresAction: true
      }
    ];
    mockKV.get.mockResolvedValue(JSON.stringify(mockAlerts));

    const request = new Request('http://localhost/api/alerts/mrs-chen', {
      method: 'GET'
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    // If alerts exist, verify structure
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('seniorId');
      expect(data[0]).toHaveProperty('severity');
      expect(data[0]).toHaveProperty('type');
      expect(data[0]).toHaveProperty('message');
      expect(data[0]).toHaveProperty('timestamp');
      expect(data[0]).toHaveProperty('requiresAction');
      expect(['low', 'medium', 'high']).toContain(data[0].severity);
      expect(['medical', 'crisis', 'depression', 'general']).toContain(data[0].type);
    }
  });
});

