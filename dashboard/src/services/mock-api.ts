import type { SeniorProfile, LiveSentiment, Analytics } from '../types'

// Mrs. Chen's complete profile based on PRD specifications
export function getMrsChenProfile(): SeniorProfile {
  return {
    id: 'mrs-chen',
    name: 'Mrs. Chen',
    age: 72,
    phone: '+1 (206) 555-0123',
    languages: ['english', 'mandarin'],
    location: 'Seattle, WA',
    
    memories: {
      family: [
        {
          name: 'Sarah',
          relationship: 'daughter',
          details: ['lives in Portland', 'visits monthly', 'cooks together']
        }
      ],
      hobbies: ['gardening', 'piano', 'cooking'],
      health: ['arthritis', 'trouble sleeping'],
      recentEvents: [
        'Sarah visited last weekend',
        'Planted new tomato seeds',
        'Played piano for first time in months'
      ],
      preferences: {
        topicsEnjoys: ['family stories', 'cooking recipes', 'garden tips', 'music'],
        topicsAvoid: ['politics', 'sad news'],
        conversationStyle: 'gentle and patient'
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
      notes: [
        {
          timestamp: '2025-01-15T14:30:00Z',
          source: 'Sam AI Conversation',
          note: 'Patient reports: knees ache when kneeling in garden. Taking morning medication regularly.',
          mentions: [
            { type: 'symptom', text: 'knees ache', context: 'gardening', severity: 'mild' },
            { type: 'medication', text: 'morning medication', context: 'adherence', severity: 'mild' }
          ]
        },
        {
          timestamp: '2025-01-12T10:15:00Z',
          source: 'Sam AI Conversation',
          note: 'Patient reports: forgot morning pills yesterday but remembered today. Feeling good overall.',
          mentions: [
            { type: 'medication', text: 'forgot morning pills', context: 'adherence', severity: 'mild' }
          ]
        }
      ]
    },
    
    matches: [
      {
        seniorId: 'mrs-lee',
        score: 90,
        compatibility: 'high',
        sharedInterests: ['gardening', 'piano', 'cooking', 'Mandarin'],
        calculatedAt: '2025-01-18T10:00:00Z'
      },
      {
        seniorId: 'mr-wang',
        score: 85,
        compatibility: 'high',
        sharedInterests: ['gardening', 'cooking', 'Mandarin', 'traditional music'],
        calculatedAt: '2025-01-18T10:00:00Z'
      },
      {
        seniorId: 'mrs-kim',
        score: 65,
        compatibility: 'good',
        sharedInterests: ['gardening', 'arts', 'Asian culture'],
        calculatedAt: '2025-01-18T10:00:00Z'
      }
    ],
    
    groups: [
      {
        id: 'mandarin-gardening-circle',
        name: 'Mandarin Gardening Circle',
        memberCount: 3,
        activity: 'gardening',
        language: 'Mandarin',
        schedule: 'Weekly, Thursdays 2pm'
      },
      {
        id: 'piano-music-appreciation',
        name: 'Piano & Music Appreciation',
        memberCount: 2,
        activity: 'piano',
        language: 'English',
        schedule: 'Bi-weekly, Saturdays 3pm'
      }
    ],
    
    conversations: [
      {
        timestamp: '2025-01-15T14:30:00Z',
        duration: 8.5,
        keyTopics: ['tomato gardening', 'knee pain'],
        sentiment: 0.3,
        summary: 'Discussed tomato planting progress, mentioned knees ache when kneeling',
        language: 'english',
        healthMentions: ['knees ache when kneeling'],
        transcript: [
          { role: 'senior', content: 'Hi Sam, I planted more tomatoes today' },
          { role: 'sam', content: 'That sounds wonderful! How are they growing?' },
          { role: 'senior', content: 'They look good, but my knees ache a bit when I kneel down' },
          { role: 'sam', content: 'I\'m sorry to hear about your knee pain. Have you been taking your morning medication?' }
        ]
      },
      {
        timestamp: '2025-01-12T10:15:00Z',
        duration: 6.2,
        keyTopics: ['Sarah visit', 'medication'],
        sentiment: 0.2,
        summary: 'Talked about daughter Sarah\'s visit, mentioned remembering medication today',
        language: 'english',
        healthMentions: ['remembered my medication today'],
        transcript: [
          { role: 'senior', content: 'Sarah came to visit yesterday' },
          { role: 'sam', content: 'How wonderful! Did you cook together?' },
          { role: 'senior', content: 'Yes, we made dumplings. I remembered my medication today' },
          { role: 'sam', content: 'That happens sometimes. Did you remember them today?' }
        ]
      },
      {
        timestamp: '2025-01-08T16:45:00Z',
        duration: 7.8,
        keyTopics: ['piano teaching', 'arthritis'],
        sentiment: 0.4,
        summary: 'Shared memories of teaching piano, mentioned hands still nimble despite arthritis',
        language: 'english',
        healthMentions: ['arthritis not too bad'],
        transcript: [
          { role: 'senior', content: 'I used to teach piano to children' },
          { role: 'sam', content: 'That must have been rewarding. Do you still play?' },
          { role: 'senior', content: 'My hands are still nimble, arthritis not too bad' },
          { role: 'sam', content: 'That\'s great to hear! Music brings such joy.' }
        ]
      },
      {
        timestamp: '2025-01-05T11:20:00Z',
        duration: 9.1,
        keyTopics: ['Shanghai memories', 'blood sugar'],
        sentiment: 0.6,
        summary: 'Shared Shanghai food memories, mentioned good blood sugar at checkup',
        language: 'mandarin',
        healthMentions: ['blood sugar was good'],
        transcript: [
          { role: 'senior', content: '我想起了上海的小笼包' },
          { role: 'sam', content: '听起来很美味！你最近有检查血糖吗？' },
          { role: 'senior', content: '是的，上次检查血糖很好' },
          { role: 'sam', content: '太好了！保持健康很重要。' }
        ]
      },
      {
        timestamp: '2025-01-02T15:30:00Z',
        duration: 5.5,
        keyTopics: ['loneliness', 'social activity'],
        sentiment: 0.7,
        summary: 'Expressed feeling lonely, interested in meeting new people',
        language: 'english',
        healthMentions: ['tired lately, need more social activity'],
        transcript: [
          { role: 'senior', content: 'I\'ve been feeling a bit lonely lately' },
          { role: 'sam', content: 'I understand. Would you like to meet other people with similar interests?' },
          { role: 'senior', content: 'I\'ve been tired lately, maybe need more social activity' },
          { role: 'sam', content: 'I\'ll look for some wonderful people you might enjoy talking with.' }
        ]
      }
    ],
    
    wellnessMetrics: {
      mentalHealth: {
        lonelinessScore: 3.2,
        averageSentiment: 0.44,
        trend: 'improving'
      },
      physicalHealth: {
        symptomMentions: 5,
        medicationAdherence: 85,
        appointmentReminders: 2
      },
      socialHealth: {
        matchesMade: 3,
        groupsJoined: 2,
        communityEngagement: 78
      },
      holisticScore: 78,
      lastCallDate: '2025-01-15T14:30:00Z',
      callFrequency: 2.3
    }
  }
}

// Match profiles for Mrs. Chen
export function getMatchProfiles(): SeniorProfile[] {
  return [
    {
      id: 'mrs-lee',
      name: 'Mrs. Lee',
      age: 69,
      phone: '+1 (206) 555-0124',
      languages: ['mandarin', 'english'],
      location: 'Seattle, WA',
      memories: {
        family: [
          { name: 'David', relationship: 'son', details: ['lives in Bellevue', 'visits weekly'] }
        ],
        hobbies: ['gardening', 'cooking', 'piano', 'mahjong'],
        health: ['mild diabetes'],
        recentEvents: ['Started new herb garden', 'Played mahjong with friends'],
        preferences: {
          topicsEnjoys: ['cooking', 'gardening', 'family'],
          topicsAvoid: ['politics'],
          conversationStyle: 'warm and friendly'
        }
      },
      socialProfile: {
        interests: ['gardening', 'cooking', 'piano', 'mahjong'],
        culturalBackground: 'Taiwan, Mandarin',
        openToMatching: true
      },
      healthData: {
        conditions: [{ name: 'Mild Diabetes', since: '2021', status: 'controlled' }],
        medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'daily', purpose: 'diabetes' }],
        vitals: { lastUpdated: '2025-01-10' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 2.8, averageSentiment: 0.6, trend: 'stable' },
        physicalHealth: { symptomMentions: 1, medicationAdherence: 95, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 65 },
        holisticScore: 82,
        lastCallDate: '2025-01-10T10:00:00Z',
        callFrequency: 1.5
      }
    },
    {
      id: 'mr-wang',
      name: 'Mr. Wang',
      age: 73,
      phone: '+1 (206) 555-0125',
      languages: ['mandarin', 'english'],
      location: 'Seattle, WA',
      memories: {
        family: [
          { name: 'Li Wei', relationship: 'son', details: ['lives in California', 'calls weekly'] }
        ],
        hobbies: ['calligraphy', 'tai chi', 'gardening', 'traditional music'],
        health: ['hypertension'],
        recentEvents: ['Practiced calligraphy', 'Attended tai chi class'],
        preferences: {
          topicsEnjoys: ['calligraphy', 'traditional culture', 'gardening'],
          topicsAvoid: ['modern technology'],
          conversationStyle: 'respectful and traditional'
        }
      },
      socialProfile: {
        interests: ['calligraphy', 'tai chi', 'gardening', 'traditional music'],
        culturalBackground: 'Beijing, Mandarin',
        openToMatching: true
      },
      healthData: {
        conditions: [{ name: 'Hypertension', since: '2019', status: 'controlled' }],
        medications: [{ name: 'Lisinopril', dosage: '5mg', frequency: 'daily', purpose: 'blood pressure' }],
        vitals: { lastUpdated: '2025-01-08' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 3.5, averageSentiment: 0.3, trend: 'stable' },
        physicalHealth: { symptomMentions: 2, medicationAdherence: 90, appointmentReminders: 1 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 60 },
        holisticScore: 75,
        lastCallDate: '2025-01-08T14:00:00Z',
        callFrequency: 1.2
      }
    },
    {
      id: 'mrs-kim',
      name: 'Mrs. Kim',
      age: 71,
      phone: '+1 (206) 555-0126',
      languages: ['korean', 'english'],
      location: 'Seattle, WA',
      memories: {
        family: [
          { name: 'Min-jun', relationship: 'son', details: ['lives in Seattle', 'visits monthly'] }
        ],
        hobbies: ['gardening', 'painting', 'traditional Korean music'],
        health: ['arthritis'],
        recentEvents: ['Painted garden scene', 'Listened to traditional music'],
        preferences: {
          topicsEnjoys: ['art', 'gardening', 'Korean culture'],
          topicsAvoid: ['sad topics'],
          conversationStyle: 'gentle and artistic'
        }
      },
      socialProfile: {
        interests: ['gardening', 'painting', 'traditional Korean music'],
        culturalBackground: 'Seoul, Korean',
        openToMatching: true
      },
      healthData: {
        conditions: [{ name: 'Arthritis', since: '2020', status: 'managed' }],
        medications: [{ name: 'Ibuprofen', dosage: '200mg', frequency: 'as needed', purpose: 'pain relief' }],
        vitals: { lastUpdated: '2025-01-12' },
        appointments: [],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 3.0, averageSentiment: 0.5, trend: 'improving' },
        physicalHealth: { symptomMentions: 3, medicationAdherence: 80, appointmentReminders: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 70 },
        holisticScore: 72,
        lastCallDate: '2025-01-12T16:00:00Z',
        callFrequency: 1.8
      }
    }
  ]
}

// Wellness metrics for analytics
export function getWellnessMetrics() {
  return {
    mentalHealth: {
      lonelinessScore: 3.2,
      averageSentiment: 0.44,
      trend: 'improving' as const
    },
    physicalHealth: {
      symptomMentions: 5,
      medicationAdherence: 85,
      appointmentReminders: 2
    },
    socialHealth: {
      matchesMade: 3,
      groupsJoined: 2,
      communityEngagement: 78
    },
    holisticScore: 78,
    lastCallDate: '2025-01-15T14:30:00Z',
    callFrequency: 2.3
  }
}

// Live sentiment data
export function getLiveSentiment(): LiveSentiment {
  return {
    sentiment: 0.3,
    emotions: ['content', 'nostalgic'],
    timestamp: new Date().toISOString()
  }
}

// Analytics data
export function getAnalytics(): Analytics {
  return {
    totalConversations: 147,
    averageSentiment: 0.44,
    totalMatches: 8,
    totalHealthNotes: 23,
    seniorCount: 4,
    holisticWellnessAverage: 78
  }
}
