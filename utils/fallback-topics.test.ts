import { selectFallbackTopic, selectFallbackResponse } from './fallback-topics';

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
    conditions: [],
    medications: [],
    vitals: { lastUpdated: '' },
    appointments: [],
    notes: []
  },
  matches: [],
  groups: [],
  conversations: [],
  wellnessMetrics: {
    mentalHealth: { lonelinessScore: 0, averageSentiment: 0, trend: 'stable' },
    physicalHealth: { symptomMentions: 0, medicationAdherence: 0, appointmentReminders: 0 },
    socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
    holisticScore: 0,
    lastCallDate: '',
    callFrequency: 0
  }
};

describe('Fallback Topics', () => {
  describe('Fallback Topic Selection', () => {
    test('selects topic based on profile interests', () => {
      const usedTopics = [];
      const result = selectFallbackTopic(usedTopics, MRS_CHEN);
      
      // Should select a topic related to Mrs. Chen's interests
      expect(result).toMatch(/garden|piano|cooking|family|childhood|Shanghai/i);
    });

    test('avoids repeating topics in consecutive calls', () => {
      const usedTopics = ['gardening', 'piano'];
      const result = selectFallbackTopic(usedTopics, MRS_CHEN);
      
      // Should not repeat recently used topics
      expect(result).not.toMatch(/garden|piano/i);
      expect(result).toMatch(/cooking|family|childhood|Shanghai/i);
    });

    test('rotates through all available topics', () => {
      const usedTopics = ['gardening', 'piano', 'cooking', 'family', 'childhood'];
      const result = selectFallbackTopic(usedTopics, MRS_CHEN);
      
      // Should still return a valid topic even after many used
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('handles empty used topics list', () => {
      const usedTopics = [];
      const result = selectFallbackTopic(usedTopics, MRS_CHEN);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Fallback Response Selection', () => {
    test('returns different responses on multiple calls', () => {
      const responses = [];
      
      // Get 10 different responses
      for (let i = 0; i < 10; i++) {
        responses.push(selectFallbackResponse());
      }
      
      // Should have variety (not all identical)
      const uniqueResponses = new Set(responses);
      expect(uniqueResponses.size).toBeGreaterThan(1);
    });

    test('returns valid response strings', () => {
      const response = selectFallbackResponse();
      
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('all responses are warm and encouraging', () => {
      const response = selectFallbackResponse();
      
      // Should contain warm, encouraging language
      expect(response).toMatch(/tell me|share|love to hear|please|continue/i);
    });
  });
});
