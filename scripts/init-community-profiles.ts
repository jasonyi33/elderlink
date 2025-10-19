/**
 * Initialize complete senior profiles for community matches
 * This creates full SeniorProfile objects for Mrs. Lee, Mr. Wong, and Mrs. Zhang
 */

const WORKER_URL = 'https://elderlink-dev.elderlinkhelper.workers.dev';

// Full profile for Mrs. Lee (92% match with Mrs. Chen)
const MRS_LEE_PROFILE = {
  id: 'mrs-lee',
  name: 'Mrs. Lee',
  age: 68,
  phone: '+1-206-555-0102',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',

  memories: {
    family: [
      { name: 'David', relationship: 'son', details: ['Software engineer', 'Lives in San Francisco'] },
      { name: 'Lisa', relationship: 'daughter', details: ['Teacher', 'Lives nearby'] }
    ],
    hobbies: ['gardening', 'cooking', 'tai chi', 'mahjong'],
    health: ['Hypertension (controlled)', 'Mild arthritis'],
    recentEvents: ['Started new tai chi class', 'Daughter visited last week'],
    preferences: {
      topicsEnjoys: ['gardening tips', 'Chinese cooking', 'family stories'],
      topicsAvoid: ['politics'],
      conversationStyle: 'Warm and chatty'
    }
  },

  socialProfile: {
    interests: ['gardening', 'cooking', 'tai chi', 'mahjong'],
    culturalBackground: 'Beijing, Mandarin speaker',
    openToMatching: true
  },

  healthData: {
    conditions: [
      { name: 'Hypertension', since: '2019', status: 'controlled' }
    ],
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'daily morning', purpose: 'blood pressure' }
    ],
    vitals: {
      lastUpdated: new Date().toISOString(),
      bloodPressure: '130/85',
      weight: '138 lbs'
    },
    appointments: [],
    notes: []
  },

  matches: [],
  groups: [],
  conversations: [],

  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 4,
      averageSentiment: 0.65,
      trend: 'stable'
    },
    physicalHealth: {
      symptomMentions: 1,
      medicationAdherence: 98,
      appointmentReminders: 0
    },
    socialHealth: {
      matchesMade: 1,
      groupsJoined: 2,
      communityEngagement: 75
    },
    holisticScore: 78,
    lastCallDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    callFrequency: 3
  }
};

// Full profile for Mr. Wong (85% match with Mrs. Chen)
const MR_WONG_PROFILE = {
  id: 'mr-wong',
  name: 'Mr. Wong',
  age: 74,
  phone: '+1-206-555-0103',
  languages: ['english', 'cantonese'],
  location: 'Seattle, WA',

  memories: {
    family: [
      { name: 'Michael', relationship: 'son', details: ['Doctor', 'Lives in New York'] }
    ],
    hobbies: ['music', 'piano', 'Chinese opera', 'calligraphy'],
    health: ['Type 2 Diabetes (managed)', 'Hearing loss (mild)'],
    recentEvents: ['Performed at senior center', 'Son visited for holidays'],
    preferences: {
      topicsEnjoys: ['music history', 'Chinese culture', 'travel memories'],
      topicsAvoid: [],
      conversationStyle: 'Thoughtful and reflective'
    }
  },

  socialProfile: {
    interests: ['music', 'piano', 'Chinese opera', 'calligraphy'],
    culturalBackground: 'Hong Kong, Cantonese speaker',
    openToMatching: true
  },

  healthData: {
    conditions: [
      { name: 'Type 2 Diabetes', since: '2017', status: 'managed' },
      { name: 'Hearing loss', since: '2021', status: 'mild' }
    ],
    medications: [
      { name: 'Metformin', dosage: '1000mg', frequency: 'twice daily', purpose: 'diabetes' }
    ],
    vitals: {
      lastUpdated: new Date().toISOString(),
      bloodSugar: '120 mg/dL',
      weight: '165 lbs'
    },
    appointments: [],
    notes: []
  },

  matches: [],
  groups: [],
  conversations: [],

  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 5,
      averageSentiment: 0.55,
      trend: 'stable'
    },
    physicalHealth: {
      symptomMentions: 0,
      medicationAdherence: 92,
      appointmentReminders: 0
    },
    socialHealth: {
      matchesMade: 1,
      groupsJoined: 1,
      communityEngagement: 60
    },
    holisticScore: 69,
    lastCallDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    callFrequency: 2
  }
};

// Full profile for Mrs. Zhang (88% match with Mrs. Chen)
const MRS_ZHANG_PROFILE = {
  id: 'mrs-zhang',
  name: 'Mrs. Zhang',
  age: 70,
  phone: '+1-206-555-0104',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',

  memories: {
    family: [
      { name: 'Jennifer', relationship: 'daughter', details: ['Nurse', 'Two kids'] },
      { name: 'Lily', relationship: 'granddaughter', details: ['Age 8', 'Loves soccer'] },
      { name: 'Max', relationship: 'grandson', details: ['Age 5', 'Starting kindergarten'] }
    ],
    hobbies: ['cooking', 'gardening', 'grandchildren', 'knitting'],
    health: ['Osteoporosis (treated)'],
    recentEvents: ['Grandkids visited over weekend', 'Planted spring vegetables'],
    preferences: {
      topicsEnjoys: ['grandchildren stories', 'cooking recipes', 'gardening'],
      topicsAvoid: [],
      conversationStyle: 'Warm and nurturing'
    }
  },

  socialProfile: {
    interests: ['cooking', 'gardening', 'grandchildren', 'knitting'],
    culturalBackground: 'Taiwan, Mandarin speaker',
    openToMatching: true
  },

  healthData: {
    conditions: [
      { name: 'Osteoporosis', since: '2020', status: 'treated' }
    ],
    medications: [
      { name: 'Calcium + Vitamin D', dosage: '1200mg/800IU', frequency: 'daily', purpose: 'bone health' },
      { name: 'Alendronate', dosage: '70mg', frequency: 'weekly', purpose: 'osteoporosis' }
    ],
    vitals: {
      lastUpdated: new Date().toISOString(),
      bloodPressure: '125/78',
      weight: '142 lbs'
    },
    appointments: [],
    notes: []
  },

  matches: [],
  groups: [],
  conversations: [],

  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 3,
      averageSentiment: 0.72,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 0,
      medicationAdherence: 95,
      appointmentReminders: 0
    },
    socialHealth: {
      matchesMade: 1,
      groupsJoined: 1,
      communityEngagement: 70
    },
    holisticScore: 75,
    lastCallDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    callFrequency: 5
  }
};

async function initializeCommunityProfiles() {
  console.log('==> Initializing community match profiles...\n');

  try {
    // Create Mrs. Lee profile
    console.log('==> Creating Mrs. Lee profile...');
    const leeResponse = await fetch(`${WORKER_URL}/api/senior/mrs-lee`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MRS_LEE_PROFILE)
    });

    if (!leeResponse.ok) {
      throw new Error(`Failed to save Mrs. Lee: ${await leeResponse.text()}`);
    }
    console.log('✓ Mrs. Lee profile created');

    // Create Mr. Wong profile
    console.log('==> Creating Mr. Wong profile...');
    const wongResponse = await fetch(`${WORKER_URL}/api/senior/mr-wong`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MR_WONG_PROFILE)
    });

    if (!wongResponse.ok) {
      throw new Error(`Failed to save Mr. Wong: ${await wongResponse.text()}`);
    }
    console.log('✓ Mr. Wong profile created');

    // Create Mrs. Zhang profile
    console.log('==> Creating Mrs. Zhang profile...');
    const zhangResponse = await fetch(`${WORKER_URL}/api/senior/mrs-zhang`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MRS_ZHANG_PROFILE)
    });

    if (!zhangResponse.ok) {
      throw new Error(`Failed to save Mrs. Zhang: ${await zhangResponse.text()}`);
    }
    console.log('✓ Mrs. Zhang profile created');

    // Update Mrs. Chen's matches to include all 3
    console.log('\n==> Updating Mrs. Chen matches...');
    const chenResponse = await fetch(`${WORKER_URL}/api/dashboard/mrs-chen`);
    const chenData = await chenResponse.json();
    const mrsChenProfile = chenData.profile;

    mrsChenProfile.matches = [
      {
        seniorId: 'mrs-lee',
        score: 92,
        compatibility: 'high' as const,
        sharedInterests: ['gardening', 'cooking', 'Mandarin'],
        calculatedAt: new Date().toISOString()
      },
      {
        seniorId: 'mr-wong',
        score: 85,
        compatibility: 'good' as const,
        sharedInterests: ['piano', 'music', 'opera'],
        calculatedAt: new Date().toISOString()
      },
      {
        seniorId: 'mrs-zhang',
        score: 88,
        compatibility: 'good' as const,
        sharedInterests: ['cooking', 'gardening', 'grandchildren'],
        calculatedAt: new Date().toISOString()
      }
    ];

    // Update social health metrics to reflect 3 matches
    mrsChenProfile.wellnessMetrics.socialHealth.matchesMade = 3;
    mrsChenProfile.wellnessMetrics.socialHealth.communityEngagement = 65; // Improved from 40

    await fetch(`${WORKER_URL}/api/senior/mrs-chen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mrsChenProfile)
    });

    console.log('✓ Mrs. Chen matches updated (3 matches)');

    // Verify all profiles exist
    console.log('\n==> Verifying community profiles...');
    const verifyLee = await fetch(`${WORKER_URL}/api/senior/mrs-lee`);
    const verifyWong = await fetch(`${WORKER_URL}/api/senior/mr-wong`);
    const verifyZhang = await fetch(`${WORKER_URL}/api/senior/mrs-zhang`);
    const verifyChen = await fetch(`${WORKER_URL}/api/matches/mrs-chen`);

    if (!verifyLee.ok || !verifyWong.ok || !verifyZhang.ok || !verifyChen.ok) {
      throw new Error('Verification failed - some profiles missing');
    }

    const chenMatches = await verifyChen.json();
    console.log('✓ All 3 match profiles exist');
    console.log('✓ Mrs. Chen has', chenMatches.length, 'matches');

    console.log('\n✅ Community profiles initialization complete!');
    console.log('\n🎯 Community tab should now display:');
    console.log('   - Mrs. Lee (92% match)');
    console.log('   - Mr. Wong (85% match)');
    console.log('   - Mrs. Zhang (88% match)');

  } catch (error) {
    console.error('❌ Error initializing community profiles:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeCommunityProfiles().catch(console.error);
