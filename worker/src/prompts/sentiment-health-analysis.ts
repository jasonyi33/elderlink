// Sentiment & Health Analysis Module
// Combined analysis for emotional state and health mentions

import { SeniorProfile } from './sam-personality';
import { callGeminiForAnalysis } from '../services/gemini-service';
import { Env } from '../services/kv-service';

export interface SentimentHealthAnalysis {
  sentiment: number;  // -1 to 1
  emotions: string[];
  healthMentions: Array<{
    type: 'symptom' | 'medication' | 'concern';
    text: string;
    context?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    status?: 'adherent' | 'non-adherent';
  }>;
  escalationLevel: 'low' | 'medium' | 'high';
  concernFlags: string[];
  wellnessIndicators: {
    socialConnection: number;
    mood: number;
    engagement: number;
  };
}

/**
 * Build sentiment and health analysis prompt
 * PRD lines 899-946
 */
function buildSentimentHealthPrompt(
  seniorMessage: string,
  last3Exchanges: string[],
  profile: SeniorProfile
): string {
  return `
Analyze the emotional state AND health mentions in this elderly person's message.

Senior's message: "${seniorMessage}"
Recent conversation context: ${last3Exchanges.join('\n')}
Known health conditions: ${profile.healthData.conditions.map(c => c.name).join(', ')}

Evaluate:
1. Overall sentiment (-1 very negative to +1 very positive)
2. Detected emotions (lonely, happy, anxious, nostalgic, content, sad, worried, etc.)
3. Any concerning statements (medical emergency, severe depression, crisis)
4. Health-related mentions:
   - Symptoms (pain, fatigue, sleep issues, etc.)
   - Medication adherence or non-adherence
   - Physical concerns or changes
   - Activity limitations

Return JSON:
{
  "sentiment": 0.0,
  "emotions": ["emotion1", "emotion2"],
  "concerns": [
    {
      "type": "medical|crisis|depression|none",
      "severity": "low|medium|high",
      "details": "specific concern if any"
    }
  ],
  "wellnessIndicators": {
    "socialConnection": 0.0,
    "mood": 0.0,
    "engagement": 0.0
  },
  "healthMentions": [
    {
      "type": "symptom|medication|concern",
      "text": "specific health mention",
      "context": "when/where it occurs",
      "severity": "mild|moderate|severe"
    }
  ]
}

If no health mentions, return empty healthMentions array.
`;
}

// Helper to extract JSON from Gemini response (handles markdown code blocks)
function extractJSON(text: string): string {
  // Try to find JSON in markdown code block
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }

  // Try to find raw JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }

  // Return as is
  return text;
}

/**
 * Analyze sentiment and extract health mentions from a message
 * @param message - The senior's message
 * @param context - Recent conversation context
 * @param profile - The senior's profile
 * @param env - Cloudflare environment with GEMINI_API_KEY (optional for fallback)
 * @returns Combined sentiment and health analysis
 */
export async function analyzeSentimentAndHealth(
  message: string,
  context: string[],
  profile: SeniorProfile,
  env?: Env
): Promise<SentimentHealthAnalysis> {
  try {
    const prompt = buildSentimentHealthPrompt(message, context, profile);

    // Call real Gemini API if env is provided
    let responseText: string;
    if (env && env.GEMINI_API_KEY) {
      console.log('[SENTIMENT] Calling real Gemini API for sentiment analysis...');
      responseText = await callGeminiForAnalysis(prompt, env);
    } else {
      console.log('[SENTIMENT] No API key, using fallback neutral analysis');
      throw new Error('No Gemini API key provided');
    }

    // Extract JSON from response (handles markdown code blocks)
    const jsonText = extractJSON(responseText);
    const analysis = JSON.parse(jsonText);

    // Add escalation level based on concerns
    const hasCrisis = analysis.healthMentions?.some((h: any) => h.severity === 'severe') ||
                      analysis.concerns?.some((c: any) => c.severity === 'high');
    analysis.escalationLevel = hasCrisis ? 'high' : 'low';

    // Add concern flags
    analysis.concernFlags = hasCrisis ? ['medical'] : [];

    // Ensure emotions is an array
    if (!Array.isArray(analysis.emotions)) {
      analysis.emotions = [];
    }

    // Ensure healthMentions is an array
    if (!Array.isArray(analysis.healthMentions)) {
      analysis.healthMentions = [];
    }

    console.log('[SENTIMENT] Analysis complete:', {
      sentiment: analysis.sentiment,
      emotionsCount: analysis.emotions?.length || 0,
      healthMentionsCount: analysis.healthMentions?.length || 0
    });

    return analysis;

  } catch (error) {
    console.error('[SENTIMENT] Error analyzing sentiment and health:', error);

    // Return neutral analysis on error
    return {
      sentiment: 0,
      emotions: [],
      healthMentions: [],
      escalationLevel: 'low',
      concernFlags: [],
      wellnessIndicators: {
        socialConnection: 0,
        mood: 0,
        engagement: 0
      }
    };
  }
}

