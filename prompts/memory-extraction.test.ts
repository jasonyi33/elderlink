import { extractMemories } from './memory-extraction';

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

describe('Memory Extraction', () => {
  test('extracts family members with relationships', () => {
    const input = "My daughter Sarah came to visit with my grandson Tommy";
    const result = extractMemories(input);

    expect(result.family).toContainEqual({
      name: "Sarah",
      relationship: "daughter",
      details: expect.arrayContaining([expect.stringMatching(/visit/i)])
    });

    expect(result.family).toContainEqual({
      name: "Tommy",
      relationship: "grandson",
      details: []
    });
  });

  test('extracts hobbies and interests', () => {
    const input = "I love working in my garden and playing piano";
    const result = extractMemories(input);

    expect(result.hobbies).toContain("gardening");
    expect(result.hobbies).toContain("piano");
  });

  test('extracts interests for social profile', () => {
    const input = "I enjoy cooking Chinese food and going to the community center";
    const result = extractMemories(input);

    expect(result.interests).toContain("cooking");
    expect(result.interests).toContain("Chinese culture");
  });

  test('extracts recent events with temporal context', () => {
    const input = "Yesterday I planted tomatoes in my garden";
    const result = extractMemories(input);

    expect(result.recentEvents).toContainEqual(
      expect.objectContaining({
        event: expect.stringMatching(/planted tomatoes/i),
        timeframe: expect.stringMatching(/yesterday/i)
      })
    );
  });

  test('does not re-extract known memories', () => {
    const profile = {
      ...MRS_CHEN,
      memories: {
        family: [{name: "Sarah", relationship: "daughter", details: []}]
      }
    };

    const input = "Sarah called me today";
    const result = extractMemories(input, profile);

    // Should update details but not create duplicate
    const sarahEntries = result.family.filter(f => f.name === "Sarah");
    expect(sarahEntries.length).toBe(1);
    expect(sarahEntries[0].details).toContain(expect.stringMatching(/called/i));
  });

  test('returns empty arrays when no new information', () => {
    const input = "Yes";
    const result = extractMemories(input);

    expect(result.family).toEqual([]);
    expect(result.hobbies).toEqual([]);
    expect(result.recentEvents).toEqual([]);
  });
});
