// Mrs. Chen Profile Data - Demo Data for ElderLink
// Contains exact data from PRD lines 639-663 with 5 conversations and health mentions

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
    conditions: Array<{
      name: string;
      since: string;
      status: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose: string;
    }>;
    vitals: {
      lastUpdated: string;
      bloodPressure?: string;
      weight?: string;
      bloodSugar?: string;
    };
    appointments: Array<{
      date: string;
      time: string;
      type: string;
      doctor: string;
    }>;
    notes: any[];
  };
  matches: any[];
  groups: any[];
  conversations: Array<{
    timestamp: string;
    duration: number;
    keyTopics: string[];
    sentiment: number;
    summary: string;
    language: "english" | "mandarin";
    healthMentions: string[];
    transcript?: any[];
  }>;
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: number;
      averageSentiment: number;
      trend: string;
    };
    physicalHealth: {
      symptomMentions: number;
      medicationAdherence: number;
      appointmentReminders: number;
    };
    socialHealth: {
      matchesMade: number;
      groupsJoined: number;
      communityEngagement: number;
    };
    holisticScore: number;
    lastCallDate: string;
    callFrequency: number;
  };
}

/**
 * Load Mrs. Chen's complete profile with exact PRD data
 * @returns Complete SeniorProfile for Mrs. Chen
 */
export function loadMrsChenProfile(): SeniorProfile {
  return {
    id: 'mrs-chen',
    name: 'Mrs. Chen',
    age: 72,
    phone: '+12065551234',
    languages: ['english', 'mandarin'],
    location: 'Seattle, WA',
    memories: {
      family: [
        { name: 'Sarah', relationship: 'daughter', details: ['lives in Bellevue', 'visits weekly', 'works in tech'] },
        { name: 'Tommy', relationship: 'grandson', details: ['age 8', 'loves piano', 'plays soccer'] }
      ],
      hobbies: ['gardening', 'piano', 'cooking', 'reading'],
      health: ['arthritis', 'trouble sleeping', 'mild hypertension'],
      recentEvents: ['planted tomatoes last week', 'Sarah visited yesterday', 'Tommy had piano recital'],
      preferences: {
        topicsEnjoys: ['family', 'gardening', 'music', 'cooking', 'Shanghai memories'],
        topicsAvoid: ['politics', 'health problems', 'financial worries'],
        conversationStyle: 'warm and patient'
      }
    },
    socialProfile: {
      interests: ['gardening', 'piano', 'cooking', 'Shanghai culture', 'traditional music'],
      culturalBackground: 'Shanghai, Mandarin',
      openToMatching: true
    },
    healthData: {
      conditions: [
        { name: 'Hypertension', since: '2018', status: 'controlled' },
        { name: 'Type 2 Diabetes', since: '2020', status: 'managed' },
        { name: 'Osteoarthritis', since: '2019', status: 'managed' }
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
    conversations: [
      {
        timestamp: '2025-09-20T14:30:00Z',
        duration: 8.5,
        keyTopics: ['tomato gardening', 'family visit'],
        sentiment: 0.3,
        summary: 'Discussed tomato planting and Sarah\'s recent visit. Mentioned knees being sore when kneeling.',
        language: 'english',
        healthMentions: ['knees are sore when kneeling']
      },
      {
        timestamp: '2025-09-27T15:45:00Z',
        duration: 6.2,
        keyTopics: ['medication', 'daily routine'],
        sentiment: 0.2,
        summary: 'Talked about daily routine and medication management. Expressed concern about forgetting morning pills.',
        language: 'english',
        healthMentions: ['forgot morning pills today']
      },
      {
        timestamp: '2025-10-05T16:20:00Z',
        duration: 9.1,
        keyTopics: ['gardening', 'back pain', 'piano memories'],
        sentiment: 0.4,
        summary: 'Shared memories of teaching piano and current gardening activities. Mentioned back pain when gardening.',
        language: 'english',
        healthMentions: ['back pain when gardening']
      },
      {
        timestamp: '2025-10-12T14:15:00Z',
        duration: 7.8,
        keyTopics: ['medication adherence', 'feeling better'],
        sentiment: 0.6,
        summary: 'Expressed feeling better and being more consistent with medication. Discussed upcoming family visit.',
        language: 'english',
        healthMentions: ['took all medications this morning', 'feeling better']
      },
      {
        timestamp: '2025-10-17T15:30:00Z',
        duration: 10.2,
        keyTopics: ['upcoming checkup', 'excitement', 'health improvement'],
        sentiment: 0.7,
        summary: 'Excited about upcoming Dr. Smith checkup. Discussed health improvements and positive outlook.',
        language: 'english',
        healthMentions: ['excited for Dr. Smith checkup next week']
      }
    ],
    wellnessMetrics: {
      mentalHealth: {
        lonelinessScore: 0.3,
        averageSentiment: 0.44, // Average of the 5 conversations
        trend: 'improving'
      },
      physicalHealth: {
        symptomMentions: 5, // Total health mentions across conversations
        medicationAdherence: 85,
        appointmentReminders: 1
      },
      socialHealth: {
        matchesMade: 0,
        groupsJoined: 0,
        communityEngagement: 0
      },
      holisticScore: 68,
      lastCallDate: '2025-10-17T15:30:00Z',
      callFrequency: 5
    }
  };
}
