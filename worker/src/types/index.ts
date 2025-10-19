/**
 * Task 3.1d: Type Definitions
 * 
 * Core interfaces for ElderLink system
 * Reference: PRD.md lines 134-260
 */

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  languages: ('english' | 'mandarin')[];
  location: string;
  demoMode?: boolean;  // Optional: enables exact script-following for demos
  demoCallStartTime?: number;  // Timestamp (ms) when demo call started

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
    notes: Array<{
      timestamp: string;
      source: string;
      note: string;
      mentions: Array<{
        type: 'symptom' | 'medication' | 'concern';
        text: string;
        context?: string;
        severity?: string;
        status?: string;
      }>;
    }>;
  };

  matches: Array<{
    seniorId: string;
    score: number;
    compatibility: 'high' | 'good' | 'potential';
    sharedInterests: string[];
    calculatedAt: string;
  }>;

  groups: Array<{
    id: string;
    name: string;
    memberCount: number;
    activity: string;
    language: string;
    schedule: string;
  }>;

  conversations: Array<{
    timestamp: string;
    duration: number;
    keyTopics: string[];
    sentiment: number;
    summary: string;
    language: 'english' | 'mandarin';
    healthMentions?: string[];
    transcript?: Array<{
      role: 'sam' | 'senior';
      content: string;
    }>;
  }>;

  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: number;
      averageSentiment: number;
      trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
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

export interface Alert {
  seniorId: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  type: 'medical' | 'crisis' | 'depression' | 'general';
  message: string;
  requiresAction: boolean;
}

export interface Analytics {
  totalConversations: number;
  averageSentiment: number;
  totalMatches: number;
  totalHealthNotes: number;
  seniorCount: number;
  holisticWellnessAverage: number;
}

