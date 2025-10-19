// Independent verification script for Sam Personality Module
// Generates 20 random test cases to verify no overfitting

import { generateSamResponse } from '../prompts/sam-personality';

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

// 20 diverse test cases
const testCases = [
  { input: "Hello Sam", exchangeNumber: 1, language: 'english' },
  { input: "How are you today?", exchangeNumber: 2, language: 'english' },
  { input: "I'm feeling good", exchangeNumber: 3, language: 'english' },
  { input: "Yes, I'm fine", exchangeNumber: 4, language: 'english' },
  { input: "Goodbye", exchangeNumber: 1, language: 'english' },
  { input: "我今天有点累", exchangeNumber: 1, language: 'mandarin' },
  { input: "我很好, how are you?", exchangeNumber: 1, language: 'english' },
  { input: "Are you real?", exchangeNumber: 1, language: 'english' },
  { input: "Are you a robot?", exchangeNumber: 1, language: 'english' },
  { input: "Tell me about your day", exchangeNumber: 5, language: 'english' },
  { input: "My back hurts", exchangeNumber: 2, language: 'english' },
  { input: "I forgot my pills", exchangeNumber: 3, language: 'english' },
  { input: "Talk to you later", exchangeNumber: 1, language: 'english' },
  { input: "Need to go now", exchangeNumber: 1, language: 'english' },
  { input: "See you later", exchangeNumber: 1, language: 'english' },
  { input: "What's the weather like?", exchangeNumber: 2, language: 'english' },
  { input: "I love gardening", exchangeNumber: 1, language: 'english' },
  { input: "My daughter visited", exchangeNumber: 1, language: 'english' },
  { input: "I'm lonely", exchangeNumber: 1, language: 'english' },
  { input: "Thank you for talking", exchangeNumber: 1, language: 'english' }
];

async function runVerification() {
  console.log('🔍 Running Independent Verification for Sam Personality Module');
  console.log('=' .repeat(60));
  
  const results = [];
  const responseSet = new Set();
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const response = await generateSamResponse(
        testCase.input, 
        MRS_CHEN, 
        testCase.exchangeNumber, 
        { language: testCase.language }
      );
      
      results.push({
        testCase: i + 1,
        input: testCase.input,
        response: response,
        exchangeNumber: testCase.exchangeNumber,
        language: testCase.language
      });
      
      responseSet.add(response);
      
      console.log(`✅ Test ${i + 1}: "${testCase.input}"`);
      console.log(`   Response: "${response}"`);
      console.log(`   Exchange: ${testCase.exchangeNumber}, Language: ${testCase.language}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ Test ${i + 1} FAILED: ${error}`);
    }
  }
  
  // Analysis
  console.log('📊 VERIFICATION RESULTS');
  console.log('=' .repeat(60));
  console.log(`Total tests run: ${results.length}`);
  console.log(`Unique responses: ${responseSet.size}`);
  console.log(`Response variety: ${((responseSet.size / results.length) * 100).toFixed(1)}%`);
  
  // Check for overfitting (identical responses)
  const duplicateResponses = results.length - responseSet.size;
  if (duplicateResponses > 0) {
    console.log(`⚠️  WARNING: ${duplicateResponses} duplicate responses detected (possible overfitting)`);
  } else {
    console.log(`✅ No duplicate responses - good variety`);
  }
  
  // Check response quality
  const responsesWithName = results.filter(r => r.response.includes('Mrs. Chen')).length;
  const responsesWithMemory = results.filter(r => 
    r.response.includes('Sarah') || r.response.includes('Tommy') || 
    r.response.includes('tomato') || r.response.includes('garden')
  ).length;
  
  console.log(`Responses with name: ${responsesWithName}/${results.length} (${((responsesWithName/results.length)*100).toFixed(1)}%)`);
  console.log(`Responses with memory: ${responsesWithMemory}/${results.length} (${((responsesWithMemory/results.length)*100).toFixed(1)}%)`);
  
  // Check sentence length
  const responses = results.map(r => r.response);
  const avgSentences = responses.reduce((sum, response) => {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sum + sentences.length;
  }, 0) / responses.length;
  
  console.log(`Average sentences per response: ${avgSentences.toFixed(1)}`);
  
  if (avgSentences <= 3) {
    console.log(`✅ Sentence length within limits (≤3)`);
  } else {
    console.log(`⚠️  WARNING: Average sentence count exceeds 3`);
  }
  
  console.log('\n🎯 VERIFICATION COMPLETE');
  
  return {
    totalTests: results.length,
    uniqueResponses: responseSet.size,
    varietyPercentage: (responseSet.size / results.length) * 100,
    responsesWithName: responsesWithName,
    responsesWithMemory: responsesWithMemory,
    averageSentences: avgSentences
  };
}

// Run verification if this script is executed directly
if (require.main === module) {
  runVerification().catch(console.error);
}

export { runVerification };
