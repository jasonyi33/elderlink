// Memory Extraction Module
// Extracts key facts from conversations for building senior profiles

import { SeniorProfile } from './sam-personality';
import { callGeminiForAnalysis } from '../services/gemini-service';
import { Env } from '../services/kv-service';

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

/**
 * Extract JSON from Gemini response (handles markdown code blocks)
 */
function extractJSON(text: string): string {
  // Try markdown code block first
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1].trim();

  // Try to find first complete JSON object (non-greedy)
  let depth = 0;
  let start = -1;
  const cleanedText = text.replace(/^[^{]*/, ''); // Remove preamble

  for (let i = 0; i < cleanedText.length; i++) {
    if (cleanedText[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (cleanedText[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        return cleanedText.substring(start, i + 1);
      }
    }
  }

  throw new Error('No valid JSON object found in response');
}

/**
 * Extract memories from a senior's message
 * @param message - The senior's message
 * @param profile - The senior's existing profile
 * @param env - Cloudflare environment with GEMINI_API_KEY
 * @returns Extracted memories to merge into profile
 */
export async function extractMemories(
  message: string,
  profile: SeniorProfile,
  env?: Env
): Promise<ExtractedMemories> {
  try {
    const prompt = buildMemoryExtractionPrompt(profile, message);

    // Call REAL Gemini API if env is provided
    if (env && env.GEMINI_API_KEY) {
      console.log('[MEMORY] Calling real Gemini API for memory extraction...');
      const responseText = await callGeminiForAnalysis(prompt, env);
      const jsonText = extractJSON(responseText);
      const parsed = JSON.parse(jsonText);
      console.log('[MEMORY] Successfully extracted memories:', {
        familyCount: parsed.newFacts?.family?.length || 0,
        hobbiesCount: parsed.newFacts?.hobbies?.length || 0,
        interestsCount: parsed.newFacts?.interests?.length || 0
      });
      return parsed;
    } else {
      console.warn('[MEMORY] No Gemini API key provided, skipping memory extraction');
      throw new Error('No Gemini API key provided');
    }

  } catch (error) {
    console.error('[MEMORY] Error extracting memories:', error);

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

