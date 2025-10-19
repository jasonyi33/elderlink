/**
 * Task 3.1d: KV Service STUB
 * 
 * TEMPORARY IMPLEMENTATION - Returns mock data to make tests pass
 * TODO: Task 3.3 - Replace with real Cloudflare KV operations
 * 
 * Reference: PRD.md lines 772-788
 */

import { SeniorProfile } from '../types';

// Mock data for testing (from PRD lines 358-383)
const MOCK_MRS_CHEN: SeniorProfile = {
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
      { name: 'Type 2 Diabetes', since: '2020', status: 'managed' },
      { name: 'Osteoarthritis', since: '2020', status: 'managed' }
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
      bloodSugar: '110 mg/dL'
    },
    appointments: [
      { date: '2025-01-25', time: '10:00am', type: 'Primary care checkup', doctor: 'Dr. Smith' },
      { date: '2025-02-15', time: '2:00pm', type: 'Cardiology follow-up', doctor: 'Dr. Johnson' }
    ],
    notes: []
  },
  matches: [
    { seniorId: 'mrs-lee', score: 90, compatibility: 'high', sharedInterests: ['gardening', 'piano', 'cooking'], calculatedAt: '2025-01-18' },
    { seniorId: 'mr-wang', score: 85, compatibility: 'high', sharedInterests: ['gardening', 'cooking'], calculatedAt: '2025-01-18' },
    { seniorId: 'mrs-kim', score: 65, compatibility: 'good', sharedInterests: ['gardening'], calculatedAt: '2025-01-18' }
  ],
  groups: [
    {
      id: 'mandarin-gardening-circle',
      name: 'Mandarin Gardening Circle',
      memberCount: 3,
      activity: 'gardening',
      language: 'Mandarin',
      schedule: 'Weekly'
    }
  ],
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
      matchesMade: 3,
      groupsJoined: 1,
      communityEngagement: 75
    },
    holisticScore: 65,
    lastCallDate: '2025-01-18',
    callFrequency: 3
  }
};

export interface Env {
  KV: KVNamespace;
  ENVIRONMENT: string;
  GEMINI_API_KEY: string;
  VAPI_API_KEY: string;
  ELEVENLABS_ENGLISH_VOICE: string;
  ELEVENLABS_MANDARIN_VOICE: string;
  context: ExecutionContext;
}

// TODO: Task 3.3 - Replace stub with real KV implementation
export async function getProfile(_seniorId: string, _env: Env): Promise<SeniorProfile> {
  console.log('[KV-STUB] getProfile called for:', _seniorId);
  // STUB: Return mock data
  return MOCK_MRS_CHEN;
}

// TODO: Task 3.3 - Replace stub with real KV implementation
export async function saveProfile(profile: SeniorProfile, _env: Env): Promise<void> {
  console.log('[KV-STUB] saveProfile called for:', profile.id);
  // STUB: No-op for now
  return;
}

// TODO: Task 3.3 - Replace stub with real KV implementation
export async function saveLiveSentiment(
  _seniorId: string,
  _data: { sentiment: number; emotions: string[]; timestamp: string },
  _env: Env
): Promise<void> {
  console.log('[KV-STUB] saveLiveSentiment called for:', _seniorId);
  // STUB: No-op for now
  return;
}

// TODO: Task 3.3 - Replace stub with real KV implementation
export async function getLiveSentiment(_seniorId: string, _env: Env): Promise<any> {
  console.log('[KV-STUB] getLiveSentiment called for:', _seniorId);
  // STUB: Return mock sentiment
  return {
    sentiment: 0,
    emotions: [],
    timestamp: new Date().toISOString()
  };
}

