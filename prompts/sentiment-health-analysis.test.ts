import { analyzeSentimentAndHealth } from './sentiment-health-analysis';

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

describe('Sentiment & Health Analysis', () => {
  describe('Sentiment Scoring', () => {
    test('positive statement returns sentiment 0.5-1.0', async () => {
      const result = await analyzeSentimentAndHealth("I'm feeling great today!", [], MRS_CHEN);
      expect(result.sentiment).toBeGreaterThanOrEqual(0.5);
      expect(result.sentiment).toBeLessThanOrEqual(1.0);
    });

    test('negative statement returns sentiment -1.0 to -0.3', async () => {
      const result = await analyzeSentimentAndHealth("I'm feeling really sad and lonely", [], MRS_CHEN);
      expect(result.sentiment).toBeGreaterThanOrEqual(-1.0);
      expect(result.sentiment).toBeLessThanOrEqual(-0.3);
    });

    test('neutral statement returns sentiment -0.3 to 0.3', async () => {
      const result = await analyzeSentimentAndHealth("The weather is okay today", [], MRS_CHEN);
      expect(result.sentiment).toBeGreaterThanOrEqual(-0.3);
      expect(result.sentiment).toBeLessThanOrEqual(0.3);
    });
  });

  describe('Emotion Detection', () => {
    test('detects multiple emotions in complex statement', async () => {
      const result = await analyzeSentimentAndHealth("I'm happy but worried about my health", [], MRS_CHEN);
      expect(result.emotions).toContain('happy');
      expect(result.emotions).toContain('anxious');
    });

    test('detects loneliness in isolated statement', async () => {
      const result = await analyzeSentimentAndHealth("I haven't talked to anyone in days", [], MRS_CHEN);
      expect(result.emotions).toContain('lonely');
    });
  });

  describe('Health Mention Extraction', () => {
    test('extracts mild symptom with context', async () => {
      const result = await analyzeSentimentAndHealth("My back hurts a bit when I garden", [], MRS_CHEN);
      expect(result.healthMentions).toContainEqual(
        expect.objectContaining({
          type: 'symptom',
          text: expect.stringMatching(/back pain/i),
          context: expect.stringMatching(/garden/i),
          severity: 'mild'
        })
      );
    });

    test('extracts moderate symptom', async () => {
      const result = await analyzeSentimentAndHealth("My knees have been quite sore lately", [], MRS_CHEN);
      expect(result.healthMentions).toContainEqual(
        expect.objectContaining({
          type: 'symptom',
          text: expect.stringMatching(/knee/i),
          severity: 'moderate'
        })
      );
    });

    test('extracts severe symptom with crisis flag', async () => {
      const result = await analyzeSentimentAndHealth("I'm having terrible chest pain", [], MRS_CHEN);
      expect(result.healthMentions).toContainEqual(
        expect.objectContaining({
          type: 'symptom',
          text: expect.stringMatching(/chest pain/i),
          severity: 'severe'
        })
      );
      expect(result.escalationLevel).toBe('high');
    });

    test('extracts medication adherence', async () => {
      const result = await analyzeSentimentAndHealth("I took all my medications this morning", [], MRS_CHEN);
      expect(result.healthMentions).toContainEqual(
        expect.objectContaining({
          type: 'medication',
          status: 'adherent'
        })
      );
    });

    test('extracts medication non-adherence', async () => {
      const result = await analyzeSentimentAndHealth("I forgot my morning pills today", [], MRS_CHEN);
      expect(result.healthMentions).toContainEqual(
        expect.objectContaining({
          type: 'medication',
          status: 'non-adherent'
        })
      );
    });

    test('returns empty health mentions for non-health content', async () => {
      const result = await analyzeSentimentAndHealth("The weather is beautiful today", [], MRS_CHEN);
      expect(result.healthMentions).toEqual([]);
    });

    test('extracts multiple health mentions in one sentence', async () => {
      const result = await analyzeSentimentAndHealth("I forgot my pills and my back hurts", [], MRS_CHEN);
      expect(result.healthMentions.length).toBe(2);
      expect(result.healthMentions.some(h => h.type === 'medication' && h.status === 'non-adherent')).toBe(true);
      expect(result.healthMentions.some(h => h.type === 'symptom')).toBe(true);
    });
  });

  describe('Crisis Detection', () => {
    test('detects suicide ideation with high escalation', async () => {
      const result = await analyzeSentimentAndHealth("I don't want to live anymore", [], MRS_CHEN);
      expect(result.escalationLevel).toBe('high');
      expect(result.concernFlags).toContain('crisis');
    });

    test('detects severe depression', async () => {
      const result = await analyzeSentimentAndHealth("Life has no meaning for me", [], MRS_CHEN);
      expect(result.concernFlags).toContain('depression');
      expect(result.escalationLevel).toBe('medium');
    });
  });
});
