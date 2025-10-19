// Sam Personality Module - Core AI Conversation System
// Implements warm, memory-aware responses with health check-ins

import { callGeminiForResponse } from '../services/gemini-service';
import { Env } from '../services/kv-service';

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  languages: string[];
  location: string;
  memories: {
    family: Array<{
      name: string;
      relationship: string;
      details: string[];
    }>;
    hobbies: string[];
    health: string[];
    recentEvents: string[];
    preferences: {
      topicsEnjoys: string[];
      topicsAvoid: string[];
      conversationStyle: string;
    };
  };
  socialProfile: {
    interests: string[];
    culturalBackground: string;
    openToMatching: boolean;
  };
  healthData: {
    conditions: Array<{
      name: string;
      since: string;
      status: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose: string;
    }>;
    vitals: {
      lastUpdated: string;
      bloodPressure?: string;
      weight?: string;
      bloodSugar?: string;
    };
    appointments: Array<{
      date: string;
      time: string;
      type: string;
      doctor: string;
    }>;
    notes: any[];
  };
  matches: any[];
  groups: any[];
  conversations: any[];
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: number;
      averageSentiment: number;
      trend: string;
    };
    physicalHealth: {
      symptomMentions: number;
      medicationAdherence: number;
      appointmentReminders: number;
    };
    socialHealth: {
      matchesMade: number;
      groupsJoined: number;
      communityEngagement: number;
    };
    holisticScore: number;
    lastCallDate: string;
    callFrequency: number;
  };
}

export interface SamResponseOptions {
  isEndingCall?: boolean;
  language?: string;
}

/**
 * Build Sam's response prompt with profile context
 * PRD lines 839-896
 */
function buildSamResponsePrompt(
  profile: SeniorProfile,
  seniorMessage: string,
  currentLanguage: string,
  recentExchanges: string
): string {
  const appointmentDate = profile.healthData.appointments[0]?.date || 'soon';
  const appointmentDoctor = profile.healthData.appointments[0]?.doctor?.split(' ').pop() || 'your doctor';
  
  return `
You are Sam, a warm, patient AI companion talking to an elderly person by phone.

PERSONALITY:
- Warm and genuine, like a caring neighbor who remembers details
- Good listener who shows empathy
- Slightly ambiguous about being AI (don't explicitly state it)
- Match their energy level and pace
- Proactive about health check-ins

SENIOR'S PROFILE:
Name: ${profile.name}
Age: ${profile.age}
Language: ${currentLanguage}

Known Information:
- Family: ${JSON.stringify(profile.memories.family)}
- Hobbies: ${profile.memories.hobbies.join(', ')}
- Health conditions: ${profile.healthData.conditions.map(c => c.name).join(', ')}
- Current medications: ${profile.healthData.medications.map(m => m.name + ' ' + m.dosage).join(', ')}
- Next appointment: ${profile.healthData.appointments[0]?.date} at ${profile.healthData.appointments[0]?.time}
- Recent events: ${profile.memories.recentEvents?.join(', ') || 'none'}

CONVERSATION HISTORY (last 3 exchanges):
${recentExchanges}

SENIOR'S CURRENT MESSAGE:
"${seniorMessage}"

INSTRUCTIONS:
1. Reference something from previous conversations naturally (family, hobbies, recent events)
2. Show you remember them - use their name occasionally, mention specific details
3. Every 2-3 exchanges, naturally check on their physical wellbeing:
   - Reference their known conditions: "How's your arthritis been?"
   - Check medication adherence: "Did you take your ${profile.healthData.medications[0]?.name} this morning?"
   - Remind about upcoming appointments (next one only): "Your checkup with Dr. ${appointmentDoctor} is ${appointmentDate}"
4. If they mention health concerns, acknowledge gently:
   - "I'm sorry to hear that. I'll make a note for Dr. [name]."
   - Never give medical advice, just listen and document
5. Use elderly-friendly conversation:
   - Simple, clear language
   - Encourage storytelling about their past
   - Be patient with repetition
   - Show genuine interest
   - Reflect back what they said (active listening)
6. Keep responses 2-3 sentences max for natural phone flow
7. ${currentLanguage === 'mandarin' ? 'Respond ENTIRELY in Mandarin Chinese' : 'Respond in English'}

FALLBACK TOPICS if conversation stalls:
- Their childhood memories
- Cooking and family recipes
- Their hobbies (garden, piano, etc.)
- Family stories
- Weather and seasons

Generate Sam's warm, natural response (2-3 sentences only):
`;
}

// Helper function to format conversation history for prompt
function formatConversationHistory(conversations: any[]): string {
  if (!conversations || conversations.length === 0) {
    return "This is our first conversation.";
  }

  // Get last 3 conversations for context
  const recent = conversations.slice(-3);
  return recent.map(c => {
    const topics = c.keyTopics?.join(', ') || 'general chat';
    const timeAgo = getTimeAgo(c.timestamp);
    return `${timeAgo}: Talked about ${topics}`;
  }).join('\n');
}

// Helper to calculate relative time
function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

/**
 * Generate Sam's response to a senior's message
 * @param message - The senior's message
 * @param profile - The senior's profile with memories and health data
 * @param exchangeNumber - Current exchange number (for health check-in timing)
 * @param env - Cloudflare environment with GEMINI_API_KEY
 * @param options - Additional options like language and call ending
 * @returns Sam's warm, natural response
 */
export async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  exchangeNumber?: number,
  env?: Env,
  options?: SamResponseOptions
): Promise<string> {
  try {
    // Detect end-of-call keywords
    const endingKeywords = ['goodbye', 'bye', 'talk later', 'need to go', 'see you later', 'gotta go', 'have to go'];
    const isEndingCall = options?.isEndingCall || endingKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    // Determine language (default to English)
    const currentLanguage = options?.language || 'english';

    // Detect mixed language input and determine primary language
    const hasChineseChars = /[\u4e00-\u9fff]/.test(message);
    const hasEnglishWords = /[a-zA-Z]/.test(message);
    const detectedLanguage = hasChineseChars && hasEnglishWords
      ? (profile.socialProfile.culturalBackground.toLowerCase().includes('mandarin') ? 'mandarin' : 'english')
      : (hasChineseChars ? 'mandarin' : 'english');

    const finalLanguage = currentLanguage === 'mandarin' || detectedLanguage === 'mandarin' ? 'mandarin' : 'english';

    // Format conversation history for context
    const recentExchanges = formatConversationHistory(profile.conversations);

    // Build the prompt with all variables
    const prompt = buildSamResponsePrompt(profile, message, finalLanguage, recentExchanges);

    // Add exchange number and ending call context to prompt
    const enhancedPrompt = prompt + `\n\nExchange Number: ${exchangeNumber || 1}\nIs Ending Call: ${isEndingCall}\nOriginal Message: ${message}`;

    // Call real Gemini API if env is provided, otherwise use fallback
    let response: string;

    if (env && env.GEMINI_API_KEY) {
      console.log('[SAM] Calling real Gemini API...', {
        hasEnv: true,
        apiKeyLength: env.GEMINI_API_KEY.length,
        promptLength: enhancedPrompt.length
      });
      response = await callGeminiForResponse(enhancedPrompt, env);
      console.log('[SAM] Gemini response received:', response.substring(0, 100));
    } else {
      console.warn('[SAM] No env/API key provided, using fallback response', {
        hasEnv: !!env,
        hasApiKey: !!(env && env.GEMINI_API_KEY)
      });
      // Intelligent fallback based on context
      if (isEndingCall) {
        response = `It was wonderful talking with you today, ${profile.name}. Take care, and I'll talk to you soon!`;
      } else if (exchangeNumber && exchangeNumber % 3 === 0) {
        // Health check-in
        const med = profile.healthData.medications?.[0];
        if (med) {
          response = `Hi ${profile.name}! How are you feeling today? Did you take your ${med.name} this morning?`;
        } else {
          response = `Hi ${profile.name}! How are you feeling today? How's your health been lately?`;
        }
      } else if (finalLanguage === 'mandarin') {
        response = `你好，${profile.name}！很高兴听到你的声音。你今天过得怎么样？`;
      } else {
        // Use memories for context
        const hobby = profile.memories?.hobbies?.[0];
        if (hobby) {
          response = `Hi ${profile.name}! It's so good to hear from you. How's your ${hobby} going?`;
        } else {
          response = `Hi ${profile.name}! It's wonderful to hear from you. How are you doing today?`;
        }
      }
    }

    return response;

  } catch (error: any) {
    console.error('[SAM] Error generating response:', {
      error: error.message || error,
      stack: error.stack,
      hasEnv: !!env,
      hasApiKey: !!(env && env.GEMINI_API_KEY),
      profileName: profile.name
    });

    // Context-aware fallback responses
    const fallbacks = [
      `Tell me more about that, ${profile.name}.`,
      "I'm listening. Please continue.",
      "That sounds important to you.",
      "How does that make you feel?"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

