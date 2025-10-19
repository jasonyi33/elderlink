// Independent verification script for Memory Extraction Module
// Tests with 15 diverse conversation inputs to verify extraction accuracy

import { extractMemories } from '../prompts/memory-extraction';

// Mock Mrs. Chen profile
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

// 15 diverse test cases for memory extraction
const testCases = [
  { input: "My daughter Sarah came to visit with my grandson Tommy", expected: { family: 2, hobbies: 0, interests: 0, recentEvents: 0 } },
  { input: "I love working in my garden and playing piano", expected: { family: 0, hobbies: 2, interests: 0, recentEvents: 0 } },
  { input: "I enjoy cooking Chinese food and going to the community center", expected: { family: 0, hobbies: 0, interests: 2, recentEvents: 0 } },
  { input: "Yesterday I planted tomatoes in my garden", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 1 } },
  { input: "Sarah called me today", expected: { family: 1, hobbies: 0, interests: 0, recentEvents: 0 } },
  { input: "My son David lives in California", expected: { family: 1, hobbies: 0, interests: 0, recentEvents: 0 } },
  { input: "I've been learning to paint watercolors", expected: { family: 0, hobbies: 1, interests: 1, recentEvents: 0 } },
  { input: "Last week I went to the senior center for bingo", expected: { family: 0, hobbies: 0, interests: 1, recentEvents: 1 } },
  { input: "My arthritis has been acting up lately", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 0, health: 1 } },
  { input: "I miss my hometown in Shanghai", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 0, cultural: 1 } },
  { input: "Yes", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 0 } },
  { input: "I don't like talking about politics", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 0, preferences: 1 } },
  { input: "My granddaughter Emma is learning violin", expected: { family: 1, hobbies: 0, interests: 0, recentEvents: 0 } },
  { input: "I've been reading mystery novels", expected: { family: 0, hobbies: 1, interests: 1, recentEvents: 0 } },
  { input: "Tomorrow I have a doctor's appointment", expected: { family: 0, hobbies: 0, interests: 0, recentEvents: 1 } }
];

async function runVerification() {
  console.log('🔍 Running Independent Verification for Memory Extraction Module');
  console.log('=' .repeat(70));
  
  const results = [];
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const extracted = await extractMemories(testCase.input, MRS_CHEN);
      
      // Verify extraction accuracy
      const familyCount = extracted.family.length;
      const hobbiesCount = extracted.hobbies.length;
      const interestsCount = extracted.interests.length;
      const recentEventsCount = extracted.recentEvents.length;
      const healthCount = extracted.health.length;
      const culturalCount = extracted.culturalBackground ? 1 : 0;
      const preferencesCount = extracted.preferences.length;
      
      const actual = {
        family: familyCount,
        hobbies: hobbiesCount,
        interests: interestsCount,
        recentEvents: recentEventsCount,
        health: healthCount,
        cultural: culturalCount,
        preferences: preferencesCount
      };
      
      const expected = testCase.expected;
      
      // Check if extraction matches expected counts
      const familyMatch = actual.family === expected.family;
      const hobbiesMatch = actual.hobbies === expected.hobbies;
      const interestsMatch = actual.interests === expected.interests;
      const recentEventsMatch = actual.recentEvents === expected.recentEvents;
      const healthMatch = actual.health === (expected.health || 0);
      const culturalMatch = actual.cultural === (expected.cultural || 0);
      const preferencesMatch = actual.preferences === (expected.preferences || 0);
      
      const testPassed = familyMatch && hobbiesMatch && interestsMatch && 
                        recentEventsMatch && healthMatch && culturalMatch && preferencesMatch;
      
      if (testPassed) {
        passedTests++;
        console.log(`✅ Test ${i + 1}: "${testCase.input}"`);
      } else {
        console.log(`❌ Test ${i + 1}: "${testCase.input}"`);
        console.log(`   Expected: ${JSON.stringify(expected)}`);
        console.log(`   Actual: ${JSON.stringify(actual)}`);
      }
      
      results.push({
        testCase: i + 1,
        input: testCase.input,
        expected,
        actual,
        passed: testPassed,
        extracted
      });
      
      console.log(`   Family: ${familyCount}, Hobbies: ${hobbiesCount}, Interests: ${interestsCount}, Events: ${recentEventsCount}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ Test ${i + 1} FAILED: ${error}`);
    }
  }
  
  // Analysis
  console.log('📊 VERIFICATION RESULTS');
  console.log('=' .repeat(70));
  console.log(`Total tests run: ${totalTests}`);
  console.log(`Tests passed: ${passedTests}`);
  console.log(`Tests failed: ${totalTests - passedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Check for hallucinations (extracting things that aren't there)
  const hallucinationTests = results.filter(r => {
    const hasExtraFamily = r.actual.family > r.expected.family;
    const hasExtraHobbies = r.actual.hobbies > r.expected.hobbies;
    const hasExtraInterests = r.actual.interests > r.expected.interests;
    const hasExtraEvents = r.actual.recentEvents > r.expected.recentEvents;
    return hasExtraFamily || hasExtraHobbies || hasExtraInterests || hasExtraEvents;
  });
  
  if (hallucinationTests.length > 0) {
    console.log(`⚠️  WARNING: ${hallucinationTests.length} tests showed potential hallucinations`);
    hallucinationTests.forEach(t => {
      console.log(`   Test ${t.testCase}: "${t.input}" - extracted more than expected`);
    });
  } else {
    console.log(`✅ No hallucinations detected - extraction is conservative`);
  }
  
  // Check for missed extractions
  const missedTests = results.filter(r => {
    const missedFamily = r.actual.family < r.expected.family;
    const missedHobbies = r.actual.hobbies < r.expected.hobbies;
    const missedInterests = r.actual.interests < r.expected.interests;
    const missedEvents = r.actual.recentEvents < r.expected.recentEvents;
    return missedFamily || missedHobbies || missedInterests || missedEvents;
  });
  
  if (missedTests.length > 0) {
    console.log(`⚠️  WARNING: ${missedTests.length} tests missed expected extractions`);
    missedTests.forEach(t => {
      console.log(`   Test ${t.testCase}: "${t.input}" - missed some expected extractions`);
    });
  } else {
    console.log(`✅ No missed extractions - all expected information captured`);
  }
  
  console.log('\n🎯 VERIFICATION COMPLETE');
  
  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: (passedTests / totalTests) * 100,
    hallucinationTests: hallucinationTests.length,
    missedTests: missedTests.length
  };
}

// Run verification if this script is executed directly
if (require.main === module) {
  runVerification().catch(console.error);
}

export { runVerification };
