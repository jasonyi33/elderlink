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
 * Simplified to reduce conflicting instructions
 */
function buildSamResponsePrompt(
  profile: SeniorProfile,
  seniorMessage: string,
  currentLanguage: string,
  recentExchanges: string,
  shouldCheckHealth: boolean = false
): string {
  const med = profile.healthData.medications?.[0];
  const condition = profile.healthData.conditions?.[0];

  // HEALTH CHECK PROMPT (separate, focused)
  if (shouldCheckHealth && (med || condition)) {
    return `
You are Sam, a warm AI companion checking on ${profile.name}'s health.

${profile.name} just said: "${seniorMessage}"

Instructions:
1. Acknowledge what they said briefly
2. Ask about ONE health topic: ${med ? `Did they take their ${med.name}?` : condition ? `How is their ${condition.name}?` : 'How are they feeling?'}
3. Under 30 words total
4. Sound caring, not clinical
5. ${currentLanguage === 'mandarin' ? 'Respond in Mandarin Chinese' : 'Respond in English'}

Your response:`;
  }

  // REGULAR CONVERSATION PROMPT (simplified, focused)
  return `
You are Sam, a warm AI companion talking to ${profile.name} (age ${profile.age}).

What you know about ${profile.name}:
- Family: ${profile.memories.family.map((f: any) => `${f.name} (${f.relationship})`).join(', ') || 'none yet'}
- Enjoys: ${profile.memories.hobbies.join(', ') || 'learning about them'}
- Recent: ${profile.memories.recentEvents?.[0] || 'just getting to know them'}

Previous conversations:
${recentExchanges}

${profile.name} just said: "${seniorMessage}"

Instructions:
1. Reference ONE specific detail you know about them naturally
2. Respond warmly to what they said
3. Ask ONE follow-up question
4. Under 30 words total
5. ${currentLanguage === 'mandarin' ? 'Respond in Mandarin Chinese' : 'Respond in English'}

Your warm response:`;
}

// Helper function to format conversation history for prompt
function formatConversationHistory(conversations: any[]): string {
  if (!conversations || conversations.length === 0) {
    return "This is our first conversation.";
  }

  // Get last 3 conversations with ACTUAL content
  const recent = conversations.slice(-3);
  return recent.map(c => {
    const timeAgo = getTimeAgo(c.timestamp);
    const transcript = c.transcript || [];

    // Include actual conversation snippets when available
    const seniorMsg = transcript.find((t: any) => t.role === 'senior')?.content || '';
    const samMsg = transcript.find((t: any) => t.role === 'assistant')?.content || '';

    if (seniorMsg && samMsg) {
      // Truncate long messages for context window
      const seniorPreview = seniorMsg.substring(0, 100);
      const samPreview = samMsg.substring(0, 100);
      return `${timeAgo}:\n  Senior: "${seniorPreview}"\n  Sam: "${samPreview}"`;
    } else {
      // Fallback to topic summary if transcript not available
      const topics = c.keyTopics?.join(', ') || 'general chat';
      return `${timeAgo}: Talked about ${topics}`;
    }
  }).join('\n\n');
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
 * Sanitize Gemini response for speech output
 * Removes markdown, meta-instructions, JSON, and other artifacts
 */
function sanitizeForSpeech(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')      // *italic*
    .replace(/`([^`]+)`/g, '$1')        // `code`
    .replace(/~~([^~]+)~~/g, '$1')      // ~~strikethrough~~
    // Remove meta-instructions (common patterns from LLMs)
    .replace(/^\[.*?\]:\s*/gm, '')      // [In Mandarin]:
    .replace(/^(Here's|Here is|Response|Note|This is):\s*/gmi, '')
    .replace(/\(.*?sentences?\)/gi, '') // (2 sentences)
    .replace(/^(Sam says?|Sam responds?|Sam replies?):\s*/gmi, '') // Sam says:
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove JSON objects
    .replace(/\{[\s\S]*?\}/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate intelligent fallback response based on context
 * Used when Gemini API is unavailable or fails
 */
function generateIntelligentFallback(
  profile: SeniorProfile,
  isEndingCall: boolean,
  shouldCheckHealth: boolean,
  finalLanguage: string
): string {
  // Call ending - warm goodbye
  if (isEndingCall) {
    return `It was wonderful talking with you today, ${profile.name}. Take care, and I'll talk to you soon!`;
  }

  // Health check-in time - ask about medication or condition
  if (shouldCheckHealth) {
    const med = profile.healthData.medications?.[0];
    if (med) {
      return `Hi ${profile.name}! How are you feeling today? Did you take your ${med.name} this morning?`;
    } else {
      return `Hi ${profile.name}! How are you feeling today? How's your health been lately?`;
    }
  }

  // Mandarin language preference
  if (finalLanguage === 'mandarin') {
    return `你好，${profile.name}！很高兴听到你的声音。你今天过得怎么样？`;
  }

  // Use personal context from memories
  const hobby = profile.memories?.hobbies?.[0];
  if (hobby) {
    return `Hi ${profile.name}! It's so good to hear from you. How's your ${hobby} going?`;
  }

  // Generic but personalized fallback
  return `Hi ${profile.name}! It's wonderful to hear from you. How are you doing today?`;
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

  // Determine if this should be a health check-in (every 3rd exchange)
  const shouldCheckHealth = exchangeNumber ? (exchangeNumber % 3 === 0) : false;

  try {
    // Format conversation history for context
    const recentExchanges = formatConversationHistory(profile.conversations);

    // Build the prompt with all variables (simplified, focused prompt)
    const prompt = buildSamResponsePrompt(profile, message, finalLanguage, recentExchanges, shouldCheckHealth);

    console.log('[SAM] Prompt type:', shouldCheckHealth ? 'HEALTH CHECK' : 'REGULAR', 'Exchange:', exchangeNumber);

    // Call real Gemini API if env is provided, otherwise use fallback
    let response: string;

    if (env && env.GEMINI_API_KEY) {
      console.log('[SAM] Calling real Gemini API...', {
        hasEnv: true,
        apiKeyLength: env.GEMINI_API_KEY.length,
        promptLength: prompt.length
      });

      const startTime = Date.now();
      response = await callGeminiForResponse(prompt, env);
      const latency = Date.now() - startTime;

      console.log('[SAM] Gemini raw response:', response.substring(0, 100), 'Latency:', latency, 'ms');

      // CRITICAL: Sanitize response before returning to remove meta-text
      response = sanitizeForSpeech(response);
      console.log('[SAM] Sanitized response:', response.substring(0, 100));
    } else {
      console.warn('[SAM] No env/API key provided, using intelligent fallback');
      response = generateIntelligentFallback(profile, isEndingCall, shouldCheckHealth, finalLanguage);
    }

    return response;

  } catch (error: any) {
    // Detailed error logging to differentiate error types
    const errorType = error.message?.includes('timeout') ? 'TIMEOUT' :
                      error.message?.includes('429') ? 'RATE_LIMIT' :
                      error.message?.includes('API') ? 'API_ERROR' : 'UNKNOWN';

    console.error(`[SAM] ${errorType} error generating response:`, {
      error: error.message || error,
      stack: error.stack?.substring(0, 200),
      hasEnv: !!env,
      hasApiKey: !!(env && env.GEMINI_API_KEY),
      profileName: profile.name,
      exchangeNumber,
      shouldCheckHealth
    });

    // Use intelligent fallback instead of generic therapy-speak
    const fallbackResponse = generateIntelligentFallback(profile, isEndingCall, shouldCheckHealth, finalLanguage);
    console.log('[SAM] Using intelligent fallback due to error:', fallbackResponse.substring(0, 50));

    return fallbackResponse;
  }
}

