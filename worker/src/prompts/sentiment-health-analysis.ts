// Sentiment & Health Analysis Module
// Combined analysis for emotional state and health mentions

import { SeniorProfile } from './sam-personality';

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

// Mock Gemini API call for testing
async function callGemini(_prompt: string): Promise<string> {
  // Return mock analysis for testing
  // Will be replaced with actual Gemini API call
  
  const mockAnalysis: SentimentHealthAnalysis = {
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
  
  return JSON.stringify(mockAnalysis);
}

/**
 * Analyze sentiment and extract health mentions from a message
 * @param message - The senior's message
 * @param context - Recent conversation context
 * @param profile - The senior's profile
 * @returns Combined sentiment and health analysis
 */
export async function analyzeSentimentAndHealth(
  message: string,
  context: string[],
  profile: SeniorProfile
): Promise<SentimentHealthAnalysis> {
  try {
    const prompt = buildSentimentHealthPrompt(message, context, profile);
    const response = await callGemini(prompt);
    const analysis = JSON.parse(response);
    
    // Add escalation level based on concerns
    const hasCrisis = analysis.healthMentions?.some((h: any) => h.severity === 'severe');
    analysis.escalationLevel = hasCrisis ? 'high' : 'low';
    
    // Add concern flags
    analysis.concernFlags = hasCrisis ? ['medical'] : [];
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing sentiment and health:', error);
    
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

