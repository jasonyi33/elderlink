#!/usr/bin/env ts-node

/**
 * Independent verification script for Memory Extraction Module
 * Tests with 15 diverse conversation inputs to verify extraction accuracy
 * and prevent hallucinations (TDD step 2.2f)
 */

import { extractMemories } from '../prompts/memory-extraction';

// Test cases covering various scenarios
const testCases = [
  // Family relationships
  {
    input: "My son David called me yesterday",
    expected: {
      family: [{ name: "David", relationship: "son", details: ["called me yesterday"] }],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: []
    },
    description: "Family member with relationship and details"
  },
  
  // Hobbies and interests
  {
    input: "I love knitting and reading mystery novels",
    expected: {
      family: [],
      hobbies: ["knitting", "reading"],
      interests: ["mystery novels"],
      recentEvents: [],
      preferences: []
    },
    description: "Multiple hobbies and interests"
  },
  
  // Recent events with time context
  {
    input: "Last week I went to the doctor for my checkup",
    expected: {
      family: [],
      hobbies: [],
      interests: [],
      recentEvents: [{ event: "went to the doctor for checkup", timeframe: "last week" }],
      preferences: []
    },
    description: "Recent event with temporal context"
  },
  
  // Cultural background
  {
    input: "I miss cooking traditional Italian dishes from my hometown",
    expected: {
      family: [],
      hobbies: ["cooking"],
      interests: ["Italian culture", "traditional cooking"],
      recentEvents: [],
      preferences: []
    },
    description: "Cultural background and cooking interests"
  },
  
  // Health mentions (should be ignored per TDD_TEST_CASES.md)
  {
    input: "My arthritis has been acting up lately",
    expected: {
      family: [],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: []
    },
    description: "Health mention should be ignored (not in 5 categories)"
  },
  
  // Empty/minimal input
  {
    input: "Okay",
    expected: {
      family: [],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: []
    },
    description: "Minimal input with no extractable information"
  },
  
  // Complex family situation
  {
    input: "My daughter-in-law Maria visited with her children Sofia and Carlos",
    expected: {
      family: [
        { name: "Maria", relationship: "daughter-in-law", details: ["visited"] },
        { name: "Sofia", relationship: "grandchild", details: [] },
        { name: "Carlos", relationship: "grandchild", details: [] }
      ],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: []
    },
    description: "Complex family relationships"
  },
  
  // Multiple recent events
  {
    input: "Yesterday I planted roses and today I baked bread",
    expected: {
      family: [],
      hobbies: ["gardening", "baking"],
      interests: [],
      recentEvents: [
        { event: "planted roses", timeframe: "yesterday" },
        { event: "baked bread", timeframe: "today" }
      ],
      preferences: []
    },
    description: "Multiple recent events with different timeframes"
  },
  
  // Preferences and topics
  {
    input: "I enjoy talking about my grandchildren but don't like discussing politics",
    expected: {
      family: [],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: ["enjoys talking about grandchildren", "doesn't like discussing politics"]
    },
    description: "Topic preferences and dislikes"
  },
  
  // Mixed content
  {
    input: "My sister Anna called to tell me about her new painting hobby",
    expected: {
      family: [{ name: "Anna", relationship: "sister", details: ["called", "told about new painting hobby"] }],
      hobbies: [],
      interests: ["painting"],
      recentEvents: [],
      preferences: []
    },
    description: "Mixed family and interest information"
  },
  
  // Cultural activities
  {
    input: "I used to play violin in the community orchestra",
    expected: {
      family: [],
      hobbies: ["violin", "music"],
      interests: ["orchestra", "community music"],
      recentEvents: [],
      preferences: []
    },
    description: "Past cultural activities and interests"
  },
  
  // Travel and experiences
  {
    input: "Last month I visited my hometown in Japan",
    expected: {
      family: [],
      hobbies: [],
      interests: ["travel", "Japan"],
      recentEvents: [{ event: "visited hometown in Japan", timeframe: "last month" }],
      preferences: []
    },
    description: "Travel experiences and cultural connections"
  },
  
  // Technology and modern interests
  {
    input: "I've been learning to use my new tablet for video calls",
    expected: {
      family: [],
      hobbies: [],
      interests: ["technology", "video calls"],
      recentEvents: [],
      preferences: []
    },
    description: "Modern technology interests"
  },
  
  // Emotional content (should not extract emotions as separate categories)
  {
    input: "I feel lonely sometimes but I'm grateful for my family",
    expected: {
      family: [],
      hobbies: [],
      interests: [],
      recentEvents: [],
      preferences: []
    },
    description: "Emotional content should not create new categories"
  },
  
  // Complex sentence with multiple elements
  {
    input: "My grandson Michael, who plays piano, visited me last Tuesday and we cooked his favorite pasta dish",
    expected: {
      family: [{ name: "Michael", relationship: "grandson", details: ["visited me last Tuesday", "plays piano"] }],
      hobbies: ["piano", "cooking"],
      interests: ["pasta"],
      recentEvents: [{ event: "cooked pasta dish with grandson", timeframe: "last Tuesday" }],
      preferences: []
    },
    description: "Complex sentence with family, hobbies, and events"
  }
];

function runVerification() {
  console.log('🧪 Running Memory Extraction Verification Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test ${i + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    
    try {
      const result = extractMemories(testCase.input);
      
      // Check if result matches expected structure
      const matches = JSON.stringify(result) === JSON.stringify(testCase.expected);
      
      if (matches) {
        console.log('✅ PASSED');
        passed++;
      } else {
        console.log('❌ FAILED');
        console.log('Expected:', JSON.stringify(testCase.expected, null, 2));
        console.log('Got:', JSON.stringify(result, null, 2));
        failed++;
      }
    } catch (error) {
      console.log('❌ ERROR:', error);
      failed++;
    }
    
    console.log('---\n');
  }
  
  console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  if (failed === 0) {
    console.log('🎉 All verification tests passed! Memory extraction is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Review the implementation.');
  }
  
  return failed === 0;
}

// Run verification if this script is executed directly
if (require.main === module) {
  runVerification();
}

export { runVerification, testCases };