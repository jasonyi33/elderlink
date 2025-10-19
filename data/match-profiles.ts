// Match Profiles Data - Demo Data for ElderLink Community Matching
// Contains 3 senior profiles with high compatibility to Mrs. Chen

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  languages: string[];
  location: string;
  memories: {
    family: Array<{
      name: string;
      relationship: string;
      details: string[];
    }>;
    hobbies: string[];
    health: string[];
    recentEvents: string[];
    preferences: {
      topicsEnjoys: string[];
      topicsAvoid: string[];
      conversationStyle: string;
    };
  };
  socialProfile: {
    interests: string[];
    culturalBackground: string;
    openToMatching: boolean;
  };
  healthData: {
    conditions: any[];
    medications: any[];
    vitals: { lastUpdated: string };
    appointments: any[];
    notes: any[];
  };
  matches: any[];
  groups: any[];
  conversations: any[];
  wellnessMetrics: {
    mentalHealth: { lonelinessScore: number; averageSentiment: number; trend: string };
    physicalHealth: { symptomMentions: number; medicationAdherence: number; appointmentReminders: number };
    socialHealth: { matchesMade: number; groupsJoined: number; communityEngagement: number };
    holisticScore: number;
    lastCallDate: string;
    callFrequency: number;
  };
}

/**
 * Load match profiles for community matching demo
 * @returns Array of SeniorProfile objects with high compatibility to Mrs. Chen
 */
export function loadMatchProfiles(): SeniorProfile[] {
  return [
    // Match 1: Mrs. Lee (High compatibility - 90%)
    {
      id: 'mrs-lee',
      name: 'Mrs. Lee',
      age: 69,
      phone: '+12065551235',
      languages: ['mandarin', 'english'],
      location: 'Seattle, WA',
      memories: {
        family: [
          { name: 'David', relationship: 'son', details: ['lives in Seattle', 'engineer'] },
          { name: 'Emily', relationship: 'granddaughter', details: ['age 12', 'loves art'] }
        ],
        hobbies: ['gardening', 'piano', 'cooking', 'mahjong'],
        health: ['mild arthritis', 'good health'],
        recentEvents: ['planted herbs last week', 'piano lesson with Emily'],
        preferences: {
          topicsEnjoys: ['family', 'gardening', 'music', 'cooking', 'Taiwan memories'],
          topicsAvoid: ['politics', 'health problems'],
          conversationStyle: 'warm and friendly'
        }
      },
      socialProfile: {
        interests: ['gardening', 'piano', 'cooking', 'mahjong', 'Taiwan culture'],
        culturalBackground: 'Taiwan, Mandarin',
        openToMatching: true
      },
      healthData: {
        conditions: [
          { name: 'Mild Arthritis', since: '2021', status: 'managed' }
        ],
        medications: [
          { name: 'Ibuprofen', dosage: '200mg', frequency: 'as needed', purpose: 'pain relief' }
        ],
        vitals: { lastUpdated: '2025-01-15' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0.2, averageSentiment: 0.6, trend: 'stable' },
        physicalHealth: { symptomMentions: 1, medicationAdherence: 95, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
        holisticScore: 75,
        lastCallDate: '2025-01-15T10:30:00Z',
        callFrequency: 2
      }
    },

    // Match 2: Mr. Wang (High compatibility - 85%)
    {
      id: 'mr-wang',
      name: 'Mr. Wang',
      age: 75,
      phone: '+12065551236',
      languages: ['mandarin', 'english'],
      location: 'Seattle, WA',
      memories: {
        family: [
          { name: 'Lisa', relationship: 'daughter', details: ['lives in Bellevue', 'teacher'] },
          { name: 'James', relationship: 'son', details: ['lives in Portland', 'doctor'] }
        ],
        hobbies: ['calligraphy', 'tai chi', 'gardening', 'traditional music'],
        health: ['good health', 'active lifestyle'],
        recentEvents: ['tai chi class', 'calligraphy practice'],
        preferences: {
          topicsEnjoys: ['family', 'gardening', 'music', 'calligraphy', 'Beijing memories'],
          topicsAvoid: ['politics', 'health problems'],
          conversationStyle: 'respectful and thoughtful'
        }
      },
      socialProfile: {
        interests: ['calligraphy', 'tai chi', 'gardening', 'traditional music', 'Beijing culture'],
        culturalBackground: 'Beijing, Mandarin',
        openToMatching: true
      },
      healthData: {
        conditions: [],
        medications: [],
        vitals: { lastUpdated: '2025-01-12' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0.4, averageSentiment: 0.5, trend: 'stable' },
        physicalHealth: { symptomMentions: 0, medicationAdherence: 100, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
        holisticScore: 70,
        lastCallDate: '2025-01-12T14:20:00Z',
        callFrequency: 1
      }
    },

    // Match 3: Mrs. Kim (Good match - 65%)
    {
      id: 'mrs-kim',
      name: 'Mrs. Kim',
      age: 68,
      phone: '+12065551237',
      languages: ['korean', 'english'],
      location: 'Bellevue, WA',
      memories: {
        family: [
          { name: 'Michael', relationship: 'son', details: ['lives in Seattle', 'business owner'] },
          { name: 'Grace', relationship: 'granddaughter', details: ['age 10', 'loves dance'] }
        ],
        hobbies: ['gardening', 'painting', 'knitting', 'traditional Korean music'],
        health: ['good health', 'active'],
        recentEvents: ['painting class', 'knitting project'],
        preferences: {
          topicsEnjoys: ['family', 'gardening', 'arts', 'knitting', 'Seoul memories'],
          topicsAvoid: ['politics', 'health problems'],
          conversationStyle: 'gentle and caring'
        }
      },
      socialProfile: {
        interests: ['gardening', 'painting', 'knitting', 'traditional Korean music', 'Seoul culture'],
        culturalBackground: 'Seoul, Korean',
        openToMatching: true
      },
      healthData: {
        conditions: [],
        medications: [],
        vitals: { lastUpdated: '2025-01-14' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0.3, averageSentiment: 0.55, trend: 'improving' },
        physicalHealth: { symptomMentions: 0, medicationAdherence: 100, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 },
        holisticScore: 72,
        lastCallDate: '2025-01-14T16:45:00Z',
        callFrequency: 3
      }
    }
  ];
}
