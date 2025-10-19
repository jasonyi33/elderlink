const WORKER_URL = 'https://elderlink-dev.elderlinkhelper.workers.dev';

const MRS_CHEN_PROFILE = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+12248581016',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',
  memories: {
    family: [
      { name: 'Sarah', relationship: 'daughter', details: ['Lives in Portland', 'Visits monthly'] },
      { name: 'Tommy', relationship: 'grandson', details: ['8 years old', 'Loves dinosaurs'] }
    ],
    hobbies: ['gardening', 'piano', 'cooking Chinese food'],
    health: ['arthritis in knees', 'high blood pressure'],
    recentEvents: ['Sarah visited last weekend', 'Tomatoes in garden are growing well'],
    preferences: {
      topicsEnjoys: ['family', 'gardening', 'cooking'],
      topicsAvoid: ['politics', 'death'],
      conversationStyle: 'warm and patient'
    }
  },
  socialProfile: {
    interests: ['gardening', 'piano', 'Chinese cooking'],
    culturalBackground: 'Shanghai, Mandarin speaker',
    openToMatching: true
  },
  healthData: {
    conditions: [
      { name: 'Hypertension', since: '2018', status: 'controlled' },
      { name: 'Type 2 Diabetes', since: '2020', status: 'managed' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'daily morning', purpose: 'blood pressure' },
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'diabetes' }
    ],
    vitals: { lastUpdated: new Date().toISOString(), bloodPressure: '128/82', weight: '145 lbs' },
    appointments: [
      { date: '2025-01-25', time: '10:00 AM', type: 'Primary care checkup', doctor: 'Dr. Smith' }
    ],
    notes: []
  },
  matches: [
    { seniorId: 'mrs-lee', score: 92, compatibility: 'high', sharedInterests: ['gardening', 'cooking'], calculatedAt: new Date().toISOString() },
    { seniorId: 'mr-wong', score: 85, compatibility: 'good', sharedInterests: ['piano', 'music'], calculatedAt: new Date().toISOString() },
    { seniorId: 'mrs-zhang', score: 88, compatibility: 'good', sharedInterests: ['cooking', 'gardening'], calculatedAt: new Date().toISOString() }
  ],
  groups: [
    { id: 'gardening-club', name: 'Seattle Mandarin Gardening Circle', memberCount: 8, activity: 'Weekend gardening', language: 'Mandarin', schedule: 'Saturdays 10am' },
    { id: 'piano-ensemble', name: 'Senior Piano Ensemble', memberCount: 5, activity: 'Classical music', language: 'English/Mandarin', schedule: 'Wednesdays 2pm' }
  ],
  conversations: [
    { timestamp: new Date(Date.now() - 86400000).toISOString(), duration: 180, keyTopics: ['tomatoes', 'Sarah visit'], sentiment: 0.7, summary: 'Happy about garden and family visit', language: 'english' }
  ],
  wellnessMetrics: {
    mentalHealth: { lonelinessScore: 3, averageSentiment: 0.6, trend: 'improving' },
    physicalHealth: { symptomMentions: 2, medicationAdherence: 95, appointmentReminders: 1 },
    socialHealth: { matchesMade: 3, groupsJoined: 2, communityEngagement: 75 },
    holisticScore: 78,
    lastCallDate: new Date(Date.now() - 86400000).toISOString(),
    callFrequency: 4
  }
};

async function init() {
  console.log('Initializing demo data...');
  
  const response = await fetch(`${WORKER_URL}/api/senior/mrs-chen`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MRS_CHEN_PROFILE)
  });
  
  if (response.ok) {
    console.log('Success! Mrs. Chen profile created.');
    const profile = await response.json();
    console.log('- Family members:', profile.memories?.family?.length || 0);
    console.log('- Matches:', profile.matches?.length || 0);
    console.log('- Groups:', profile.groups?.length || 0);
  } else {
    console.error('Failed:', await response.text());
  }
}

init().catch(console.error);
