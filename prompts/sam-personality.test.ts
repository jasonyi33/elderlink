import { generateSamResponse } from './sam-personality';

// Mock Mrs. Chen profile for testing
const MRS_CHEN = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+12065551234',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',
  memories: {
    family: [
      { name: 'Sarah', relationship: 'daughter', details: ['lives in Bellevue', 'visits weekly'] },
      { name: 'Tommy', relationship: 'grandson', details: ['age 8', 'loves piano'] }
    ],
    hobbies: ['gardening', 'piano', 'cooking'],
    health: ['arthritis', 'trouble sleeping'],
    recentEvents: ['planted tomatoes last week', 'Sarah visited yesterday'],
    preferences: {
      topicsEnjoys: ['family', 'gardening', 'music'],
      topicsAvoid: ['politics', 'health problems'],
      conversationStyle: 'warm and patient'
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
      { name: 'Type 2 Diabetes', since: '2020', a1c: '6.5%' },
      { name: 'Osteoarthritis', locations: ['knees', 'back'], status: 'managed' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'daily morning', purpose: 'blood pressure' },
      { name: 'Metformin', dosage: '500mg', frequency: 'with meals', purpose: 'diabetes' },
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily', purpose: 'bone health' }
    ],
    vitals: {
      lastUpdated: '2025-01-10',
      bloodPressure: '128/82',
      weight: '145 lbs',
      bloodSugar: '110 mg/dL fasting'
    },
    appointments: [
      { date: '2025-01-25', time: '10:00am', type: 'Primary care checkup', doctor: 'Dr. Smith' },
      { date: '2025-02-15', time: '2:00pm', type: 'Cardiology follow-up', doctor: 'Dr. Johnson' }
    ],
    notes: []
  },
  matches: [],
  groups: [],
  conversations: [],
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 0.3,
      averageSentiment: 0.4,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 2,
      medicationAdherence: 85,
      appointmentReminders: 1
    },
    socialHealth: {
      matchesMade: 0,
      groupsJoined: 0,
      communityEngagement: 0
    },
    holisticScore: 65,
    lastCallDate: '2025-01-17',
    callFrequency: 3
  }
};

describe('Sam Personality Module', () => {
  describe('Warm Greetings', () => {
    test('uses senior name in greeting', async () => {
      const response = await generateSamResponse('Hello', MRS_CHEN);
      expect(response).toContain('Mrs. Chen');
      expect(response).not.toContain('user');
    });

    test('avoids robotic greetings', async () => {
      const response = await generateSamResponse('Hi', MRS_CHEN);
      expect(response).not.toContain('How can I assist');
      expect(response).not.toContain('How may I help');
      expect(response).toContain('how are you');
    });
  });

  describe('Memory References', () => {
    test('references known family members', async () => {
      const response = await generateSamResponse('Hello Sam', MRS_CHEN);
      expect(response).toMatch(/Sarah|Tommy/);
    });

    test('references recent events from history', async () => {
      const response = await generateSamResponse('Hi', MRS_CHEN);
      expect(response).toMatch(/tomato|garden|piano/);
    });

    test('asks about specific known interests', async () => {
      const response = await generateSamResponse('Good morning', MRS_CHEN);
      expect(response).toMatch(/garden|piano|cook/);
    });
  });

  describe('Health Check-ins', () => {
    test('health inquiry every 2-3 exchanges not every exchange', async () => {
      // Test 4 exchanges - should have 1-2 health mentions, not 0 or 4
      const responses = [];
      for (let i = 1; i <= 4; i++) {
        const response = await generateSamResponse('Hello', MRS_CHEN, i);
        responses.push(response);
      }
      
      const healthMentions = responses.filter(r => 
        r.includes('Lisinopril') || r.includes('arthritis') || r.includes('medication') || r.includes('health')
      ).length;
      
      expect(healthMentions).toBeGreaterThanOrEqual(1);
      expect(healthMentions).toBeLessThanOrEqual(2);
    });

    test('mentions specific medications from profile', async () => {
      const response = await generateSamResponse('Hello', MRS_CHEN, 3); // Exchange 3 should trigger health check
      expect(response).toContain('Lisinopril');
    });

    test('asks about known conditions by name', async () => {
      const response = await generateSamResponse('Hello', MRS_CHEN, 3);
      expect(response).toMatch(/arthritis|diabetes|hypertension/);
    });
  });

  describe('Community Mentions', () => {
    test('no community mention in middle of conversation', async () => {
      const response = await generateSamResponse('Hello', MRS_CHEN, 5);
      expect(response).not.toContain('found friends');
      expect(response).not.toContain('gardening circle');
    });

    test('community mention at end of call', async () => {
      const response = await generateSamResponse('Goodbye', MRS_CHEN, 1, { isEndingCall: true });
      expect(response).toMatch(/found friends|gardening circle|community/);
    });

    test('community mention includes specific shared interest', async () => {
      const response = await generateSamResponse('Talk to you later', MRS_CHEN, 1, { isEndingCall: true });
      expect(response).toMatch(/garden|piano|cook/);
    });
  });

  describe('Response Quality', () => {
    test('responses are 2-3 sentences max', async () => {
      const response = await generateSamResponse('Hello', MRS_CHEN);
      const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
      expect(sentences.length).toBeLessThanOrEqual(3);
    });

    test('short responses for short inputs (energy matching)', async () => {
      const response = await generateSamResponse('Yes', MRS_CHEN);
      const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
      expect(sentences.length).toBeLessThanOrEqual(2);
    });
  });

  describe('AI Identity', () => {
    test('never explicitly mentions being AI', async () => {
      const response = await generateSamResponse('Are you real?', MRS_CHEN);
      expect(response).not.toContain('AI');
      expect(response).not.toContain('artificial intelligence');
    });

    test('deflects AI questions warmly', async () => {
      const response = await generateSamResponse('Are you a robot?', MRS_CHEN);
      expect(response).not.toContain('robot');
      expect(response).toMatch(/friend|companion|here to talk/);
    });
  });

  describe('Language Switching', () => {
    test('responds in Mandarin when senior speaks Mandarin', async () => {
      const response = await generateSamResponse('我今天有点累', MRS_CHEN, 1, { language: 'mandarin' });
      // Check for Chinese characters
      expect(response).toMatch(/[\u4e00-\u9fff]/);
    });

    test('switches back to English smoothly', async () => {
      const response = await generateSamResponse('How are you?', MRS_CHEN, 1, { language: 'english' });
      expect(response).not.toMatch(/[\u4e00-\u9fff]/);
      expect(response).toMatch(/[a-zA-Z]/);
    });
  });

  describe('End-of-Call Detection', () => {
    test('detects ending keywords (goodbye, bye, talk later)', async () => {
      const endingKeywords = ['goodbye', 'bye', 'talk later', 'need to go', 'see you later'];
      
      for (const keyword of endingKeywords) {
        const response = await generateSamResponse(keyword, MRS_CHEN, 1);
        // Should trigger end-of-call behavior (community mention)
        expect(response).toMatch(/found friends|gardening circle|community|take care/i);
      }
    });
  });

  describe('Mixed Language Handling', () => {
    test('handles mixed language input and responds in primary language', async () => {
      const mixedInput = '我很好, how are you?'; // Mixed Mandarin and English
      const response = await generateSamResponse(mixedInput, MRS_CHEN, 1);
      
      // Should detect primary language and respond appropriately
      // Since Mrs. Chen's cultural background is Mandarin, should respond in Mandarin
      expect(response).toMatch(/[\u4e00-\u9fff]/);
    });
  });
});
