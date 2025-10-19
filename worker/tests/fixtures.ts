/**
 * Shared test fixtures for all test files
 * Mock data matching PRD specifications
 */

import { SeniorProfile } from '../src/types';

export const MOCK_MRS_CHEN: SeniorProfile = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+12248581016',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',
  
  memories: {
    family: [
      {
        name: 'Sarah',
        relationship: 'daughter',
        details: ['Lives in Bellevue', 'Visits weekly', 'Has son Tommy']
      },
      {
        name: 'Tommy',
        relationship: 'grandson',
        details: ['Age 8', 'Loves baseball']
      }
    ],
    hobbies: ['gardening', 'piano', 'cooking'],
    health: ['arthritis in knees', 'forgets medications sometimes'],
    recentEvents: ['Planted tomatoes last week', 'Sarah visited on Sunday'],
    preferences: {
      topicsEnjoys: ['family', 'gardening', 'Shanghai memories', 'cooking'],
      topicsAvoid: ['politics', 'sad news'],
      conversationStyle: 'storytelling'
    }
  },
  
  socialProfile: {
    interests: ['gardening', 'piano', 'cooking', 'Shanghai culture'],
    culturalBackground: 'Shanghai, Mandarin speaker',
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
      bloodSugar: '110 mg/dL'
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
      lonelinessScore: 3,
      averageSentiment: 0.4,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 0,
      medicationAdherence: 0.8,
      appointmentReminders: 2
    },
    socialHealth: {
      matchesMade: 0,
      groupsJoined: 0,
      communityEngagement: 0
    },
    holisticScore: 78,
    lastCallDate: '2025-01-18T14:00:00Z',
    callFrequency: 3
  }
};

