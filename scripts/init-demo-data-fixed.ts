#!/usr/bin/env ts-node

/**
 * Initialize demo data for Mrs. Chen and compatible matches
 * This script populates the KV store with all necessary data for the demo
 */

import { SeniorProfile } from '../worker/src/types/index';

const WORKER_URL = 'https://elderlink-dev.elderlinkhelper.workers.dev';

// Mrs. Chen's complete profile with memories and health data
const MRS_CHEN_PROFILE: SeniorProfile = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+12248581016',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',

  memories: {
    family: [
      { name: 'Sarah', relationship: 'daughter', details: ['Lives in Portland', 'Visits monthly', 'Has two kids'] },
      { name: 'Tommy', relationship: 'grandson', details: ['8 years old', 'Loves dinosaurs', 'Learning piano'] },
      { name: 'Emily', relationship: 'granddaughter', details: ['10 years old', 'Soccer player', 'Straight-A student'] }
    ],
    hobbies: ['gardening', 'piano', 'cooking Chinese food', 'watching Beijing opera'],
    health: ['arthritis in knees', 'high blood pressure', 'trouble sleeping'],
    recentEvents: [
      'Sarah visited last weekend with the kids',
      'Tomatoes in garden are growing well',
      'Played piano at community center last Tuesday',
      'Made dumplings for church potluck'
    ],
    preferences: {
      topicsEnjoys: ['family', 'gardening', 'cooking', 'music', 'grandchildren'],
      topicsAvoid: ['politics', 'death', 'finances'],
      conversationStyle: 'warm and patient'
    }
  },

  socialProfile: {
    interests: ['gardening', 'piano', 'Chinese cooking', 'Beijing opera'],
    culturalBackground: 'Shanghai, Mandarin speaker',
    openToMatching: true
  },

  healthData: {
    conditions: [
      { name: 'Hypertension', since: '2018', status: 'controlled' },
      { name: 'Type 2 Diabetes', since: '2020', status: 'managed' },
      { name: 'Osteoarthritis', since: '2019', status: 'mild' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'daily morning', purpose: 'blood pressure' },
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'diabetes' },
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily', purpose: 'bone health' }
    ],
    vitals: {
      lastUpdated: new Date().toISOString(),
      bloodPressure: '128/82',
      weight: '145 lbs',
      bloodSugar: '110 mg/dL fasting'
    },
    appointments: [
      {
        date: '2025-01-25',
        time: '10:00 AM',
        type: 'Primary care checkup',
        doctor: 'Dr. Smith'
      },
      {
        date: '2025-02-15',
        time: '2:00 PM',
        type: 'Cardiology follow-up',
        doctor: 'Dr. Johnson'
      }
    ],
    notes: [
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        source: 'Sam AI Conversation',
        note: 'Patient mentioned mild knee pain when gardening. Took morning medications as scheduled.',
        mentions: [
          { type: 'symptom', text: 'knee pain', context: 'gardening', severity: 'mild' },
          { type: 'medication', text: 'morning medications taken', context: 'adherent' }
        ]
      }
    ]
  },

  matches: [],
  groups: [],

  conversations: [
    {
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      duration: 180,
      keyTopics: ['tomatoes', 'Sarah visit', 'knee pain'],
      sentiment: 0.7,
      summary: 'Mrs. Chen was happy about her daughter\'s recent visit and excited about her garden. Mentioned mild knee discomfort.',
      language: 'english',
      healthMentions: ['knee pain when gardening']
    }
  ],

  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 3,
      averageSentiment: 0.6,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 2,
      medicationAdherence: 95,
      appointmentReminders: 1
    },
    socialHealth: {
      matchesMade: 0,
      groupsJoined: 0,
      communityEngagement: 40
    },
    holisticScore: 72,
    lastCallDate: new Date(Date.now() - 86400000).toISOString(),
    callFrequency: 4
  }
};

// Compatible match profiles
const COMPATIBLE_MATCHES = [
  {
    id: 'mrs-lee',
    name: 'Mrs. Lee',
    age: 68,
    languages: ['english', 'mandarin'],
    location: 'Seattle, WA',
    interests: ['gardening', 'cooking', 'tai chi'],
    culturalBackground: 'Beijing, Mandarin speaker',
    matchScore: 92,
    sharedInterests: ['gardening', 'cooking', 'Mandarin']
  },
  {
    id: 'mr-wong',
    name: 'Mr. Wong',
    age: 74,
    languages: ['english', 'cantonese'],
    location: 'Seattle, WA',
    interests: ['music', 'piano', 'Chinese opera'],
    culturalBackground: 'Hong Kong, Cantonese speaker',
    matchScore: 85,
    sharedInterests: ['piano', 'music', 'opera']
  },
  {
    id: 'mrs-zhang',
    name: 'Mrs. Zhang',
    age: 70,
    languages: ['english', 'mandarin'],
    location: 'Seattle, WA',
    interests: ['cooking', 'gardening', 'grandchildren'],
    culturalBackground: 'Taiwan, Mandarin speaker',
    matchScore: 88,
    sharedInterests: ['cooking', 'gardening', 'grandchildren']
  }
];

async function initializeDemo() {
  console.log('==> Initializing ElderLink demo data...\n');

  try {
    // 1. Save Mrs. Chen's profile
    console.log('==> Creating Mrs. Chen profile...');
    const profileResponse = await fetch(`${WORKER_URL}/api/senior/mrs-chen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MRS_CHEN_PROFILE)
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to save profile: ${await profileResponse.text()}`);
    }
    console.log('✓ Mrs. Chen profile created');

    // 2. Initialize matches
    console.log('\n==> Creating compatible matches...');
    for (const match of COMPATIBLE_MATCHES) {
      // Update Mrs. Chen's matches
      const updatedProfile = {
        ...MRS_CHEN_PROFILE,
        matches: [
          ...MRS_CHEN_PROFILE.matches,
          {
            seniorId: match.id,
            score: match.matchScore,
            compatibility: match.matchScore > 90 ? 'high' as const : 'good' as const,
            sharedInterests: match.sharedInterests,
            calculatedAt: new Date().toISOString()
          }
        ]
      };

      await fetch(`${WORKER_URL}/api/senior/mrs-chen`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      console.log(`✓ Added match: ${match.name} (${match.matchScore}% compatibility)`);
    }

    // 3. Add group suggestions
    console.log('\n==> Creating group suggestions...');
    const groups = [
      {
        id: 'gardening-club',
        name: 'Seattle Mandarin Gardening Circle',
        memberCount: 8,
        activity: 'Weekend gardening and tea',
        language: 'Mandarin',
        schedule: 'Saturdays 10am'
      },
      {
        id: 'piano-ensemble',
        name: 'Senior Piano Ensemble',
        memberCount: 5,
        activity: 'Classical and Chinese music',
        language: 'English/Mandarin',
        schedule: 'Wednesdays 2pm'
      }
    ];

    const finalProfile: any = await fetch(`${WORKER_URL}/api/senior/mrs-chen`).then(r => r.json());
    finalProfile.groups = groups;

    await fetch(`${WORKER_URL}/api/senior/mrs-chen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProfile)
    });

    console.log('✓ Group suggestions added');

    // 4. Create initial sentiment data for live display
    console.log('\n==> Creating live sentiment data...');
    const sentimentData = {
      seniorId: 'mrs-chen',
      sentiment: 0.7,
      emotions: ['content', 'happy', 'engaged'],
      timestamp: new Date().toISOString(),
      currentLanguage: 'english',
      healthMentions: [],
      alerts: []
    };

    await fetch(`${WORKER_URL}/api/sentiment/mrs-chen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sentimentData)
    });
    console.log('✓ Live sentiment data initialized');

    // 5. Verify everything is working
    console.log('\n==> Verifying demo data...');

    const verifyProfile: any = await fetch(`${WORKER_URL}/api/senior/mrs-chen`).then(r => r.json());
    const verifySentiment: any = await fetch(`${WORKER_URL}/api/sentiment/mrs-chen`).then(r => r.json());

    console.log('✓ Profile has', verifyProfile.memories?.family?.length || 0, 'family members');
    console.log('✓ Profile has', verifyProfile.matches?.length || 0, 'compatible matches');
    console.log('✓ Profile has', verifyProfile.groups?.length || 0, 'group suggestions');
    console.log('✓ Current sentiment:', verifySentiment.sentiment || 'N/A');

    console.log('\n✅ Demo data initialization complete!');
    console.log('\n🎯 Ready for demo:');
    console.log('   - Phone: +1 (224) 858-1016');
    console.log('   - Profile: Mrs. Chen');
    console.log('   - Dashboard: http://localhost:5175');
    console.log('   - API: https://elderlink-dev.elderlinkhelper.workers.dev');

  } catch (error) {
    console.error('❌ Error initializing demo data:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDemo().catch(console.error);
