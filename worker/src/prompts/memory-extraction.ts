// Memory Extraction Module
// Extracts key facts from conversations for building senior profiles

import { SeniorProfile } from './sam-personality';

export interface ExtractedMemories {
  newFacts: {
    family: Array<{
      name: string;
      relationship: string;
      details: string[];
    }>;
    hobbies: string[];
    interests: string[];
    health: string[];
    recentEvents: Array<{
      event: string;
      timeframe: string;
    }>;
    preferences: string[];
    culturalBackground?: string;
  };
}

/**
 * Build memory extraction prompt
 * PRD lines 949-987
 */
function buildMemoryExtractionPrompt(
  profile: SeniorProfile,
  seniorMessage: string
): string {
  return `
You are analyzing a conversation to extract important facts about a senior.

Previous known facts:
${JSON.stringify(profile.memories)}

New conversation excerpt:
Senior: "${seniorMessage}"

Extract any NEW information about:
- Family members (names, relationships, details, visits)
- Hobbies or interests (gardening, music, cooking, crafts, etc.)
- Health concerns (symptoms, conditions, medications)
- Recent events (visits, activities, milestones)
- Preferences (topics they enjoy or avoid)
- Cultural background (heritage, language, traditions)

IMPORTANT for social matching:
- Extract specific interests that could match with other seniors
- Note cultural/language backgrounds
- Identify activities they enjoy or used to enjoy

Return JSON:
{
  "newFacts": {
    "family": [],
    "hobbies": [],
    "interests": [],
    "health": [],
    "recentEvents": [],
    "preferences": [],
    "culturalBackground": ""
  }
}

If no new information in a category, return empty array.
Focus on extracting actionable, specific details.
`;
}

// Mock Gemini API call for testing
async function callGemini(_prompt: string): Promise<string> {
  // Return mock extraction for testing
  // Will be replaced with actual Gemini API call
  
  const mockExtraction: ExtractedMemories = {
    newFacts: {
      family: [],
      hobbies: [],
      interests: [],
      health: [],
      recentEvents: [],
      preferences: []
    }
  };
  
  return JSON.stringify(mockExtraction);
}

/**
 * Extract memories from a senior's message
 * @param message - The senior's message
 * @param profile - The senior's existing profile
 * @returns Extracted memories to merge into profile
 */
export async function extractMemories(
  message: string,
  profile: SeniorProfile
): Promise<ExtractedMemories> {
  try {
    const prompt = buildMemoryExtractionPrompt(profile, message);
    const response = await callGemini(prompt);
    return JSON.parse(response);
    
  } catch (error) {
    console.error('Error extracting memories:', error);
    
    // Return empty extraction on error
    return {
      newFacts: {
        family: [],
        hobbies: [],
        interests: [],
        health: [],
        recentEvents: [],
        preferences: []
      }
    };
  }
}

