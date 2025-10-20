// Sam Personality Module - Core AI Conversation System
// Implements warm, memory-aware responses with health check-ins

import { callGeminiForResponse } from '../services/gemini-service';
import { Env } from '../services/kv-service';
import { SeniorProfile } from '../types';

// Remove duplicate SeniorProfile interface - use shared type from types/index.ts
/*
export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  languages: string[];
  location: string;
  demoMode?: boolean;  // Optional: enables exact script-following for demos
  demoCallStartTime?: number;  // Timestamp (ms) when demo call started
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
*/

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
  // Prose format reduces numbered list hallucinations
  if (shouldCheckHealth && (med || condition)) {
    return `You are Sam, a warm AI companion for ${profile.name}.

${profile.name} just said: "${seniorMessage}"

You know: ${condition ? `They have ${condition.name}.` : ''} ${med ? `They take ${med.name} ${med.frequency} for ${med.purpose}.` : ''}

Respond in under 30 words by warmly acknowledging what they said, showing you recall their condition, then ask about their medication: ${med ? `Did they take their ${med.name} this morning?` : 'How are they feeling?'}

Sound caring and natural, not clinical. ${currentLanguage === 'mandarin' ? 'Speak in Mandarin Chinese.' : 'Speak in English.'}

Begin your response now (speak naturally, no labels or formatting):
`;
  }

  // REGULAR CONVERSATION PROMPT (simplified, focused)
  // Direct instructions reduce meta-text generation
  return `You are Sam, a warm AI companion for ${profile.name} (age ${profile.age}).

What you know:
Family: ${profile.memories.family.map((f: any) => `${f.name} (${f.relationship})`).join(', ') || 'none yet'}
Enjoys: ${profile.memories.hobbies.join(', ') || 'learning about them'}
Recent: ${profile.memories.recentEvents?.[0] || 'just getting to know them'}

Previous conversations:
${recentExchanges}

${profile.name} just said: "${seniorMessage}"

Respond in under 30 words by naturally referencing one specific detail you know about them, warmly responding to what they said, and asking one follow-up question. ${currentLanguage === 'mandarin' ? 'Speak in Mandarin Chinese.' : 'Speak in English.'}

Begin your response now (speak naturally, no labels or formatting):
`;
}

// DEMO MODE: Time-based scripted responses
// Each response has an estimated speaking time + 1 second buffer
function getDemoScriptResponse(
  profile: SeniorProfile,
  seniorMessage: string,
  currentLanguage: string
): string {
  console.log('[DEMO] ===== ENTERED getDemoScriptResponse ===== [VERSION:NEW-DEPLOY-e6d71d28]');
  console.log('[DEMO] Input params:', {
    profileId: profile.id,
    demoCallStartTime: profile.demoCallStartTime,
    currentTime: Date.now(),
    seniorMessage: seniorMessage.substring(0, 50),
    currentLanguage
  });

  // Calculate elapsed time since call started
  const callStartTime = profile.demoCallStartTime || Date.now();
  const elapsedSeconds = (Date.now() - callStartTime) / 1000;

  console.log(`[DEMO] Elapsed time: ${elapsedSeconds.toFixed(1)}s (callStartTime: ${callStartTime}, now: ${Date.now()})`);
  console.log(`[DEMO] Senior message:`, seniorMessage.substring(0, 50));

  // Time windows for each response (approximate speaking time + 1s buffer):
  // Response 1: ~7s to say + 1s = available after 0s, until 8s
  // Response 2: ~8s to say + 1s = available after 8s, until 17s
  // Response 3: ~4s to say + 1s = available after 17s, until 22s
  // Response 4: ~3s to say + 1s = available after 22s, until 26s
  // Response 5: ~4s to say + 1s = available after 26s, until end

  if (elapsedSeconds < 8) {
    // Response 1: Knee/Lisinopril question (0-8s)
    console.log('[DEMO] Using response 1 (0-8s)');
    return "I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes. Did you take your Lisinopril this morning?";
  } else if (elapsedSeconds < 17) {
    // Response 2: MyChart appointment note (8-17s)
    console.log('[DEMO] Using response 2 (8-17s)');
    return "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m.";
  } else if (elapsedSeconds < 22) {
    // Response 3: Mandarin tired/rest (17-22s)
    console.log('[DEMO] Using response 3 (17-22s)');
    return "没关系，陈太太。记得多休息，多喝水。";
  } else if (elapsedSeconds < 26) {
    // Response 4: Mandarin acknowledgment (22-26s)
    console.log('[DEMO] Using response 4 (22-26s)');
    return "好的。照顾好自己，陈太太。";
  } else {
    // Response 5: English closing (26s+)
    console.log('[DEMO] Using response 5 (26s+)');
    return "Take care, Mrs. Chen. I'll check in on you tomorrow!";
  }
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
  let cleaned = text
    // Remove markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')      // *italic*
    .replace(/`([^`]+)`/g, '$1')        // `code`
    .replace(/~~([^~]+)~~/g, '$1')      // ~~strikethrough~~
    // Remove numbered lists and bullet points
    .replace(/^\d+\.\s+/gm, '')         // 1. 2. 3.
    .replace(/^[•\-\*]\s+/gm, '')       // • - *
    // Remove meta-instructions (common patterns from LLMs)
    .replace(/^\[.*?\]:\s*/gm, '')      // [In Mandarin]:
    .replace(/^(Here's|Here is|Response|Note|This is):\s*/gmi, '')
    .replace(/\(.*?sentences?\)/gi, '') // (2 sentences)
    .replace(/^(Sam says?|Sam responds?|Sam replies?):\s*/gmi, '') // Sam says:
    .replace(/^(Begin|Starting|Now):\s*/gmi, '') // Begin: Now:
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove JSON objects (aggressive but safe - Sam doesn't use curly braces in natural speech)
    .replace(/\{[\s\S]*?\}/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // VALIDATION: Check for incomplete sentences (trailing comma)
  if (cleaned.endsWith(',')) {
    console.warn('[SAM] Detected trailing comma, replacing with period');
    cleaned = cleaned.slice(0, -1) + '.';
  }

  // VALIDATION: Ensure ends with punctuation
  if (!cleaned.match(/[.!?]$/)) {
    cleaned += '.';
  }

  // VALIDATION: Remove duplicate sentences (hallucination detection)
  const sentences = cleaned.split(/\.\s+/);
  const unique = [...new Set(sentences)];
  if (unique.length < sentences.length) {
    console.warn('[SAM] Detected duplicate sentences:', { total: sentences.length, unique: unique.length });
    cleaned = unique.join('. ');
    // Ensure ends with punctuation after deduplication
    if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
      cleaned += '.';
    }
  }

  return cleaned;
}

/**
 * Generate intelligent fallback response based on context
 * Used when Gemini API is unavailable or fails
 */
function generateIntelligentFallback(
  profile: SeniorProfile,
  seniorMessage: string,
  isEndingCall: boolean,
  shouldCheckHealth: boolean,
  finalLanguage: string
): string {
  // Check for health keywords in user message (English + Mandarin)
  const healthKeywords = [
    // English
    'hurt', 'pain', 'ache', 'sore', 'tired', 'dizzy', 'nausea', 'chest', 'breath', 'fell', 'fall', 'broken', 'bruised', 'injured', 'bleeding', 'swollen', 'sick', 'ill',
    // Mandarin Chinese
    '痛', '疼', '累', '晕', '头晕', '恶心', '摔', '病', '伤', '不舒服', '难受'
  ];
  const hasHealthMention = healthKeywords.some(kw => seniorMessage.toLowerCase().includes(kw) || seniorMessage.includes(kw));

  // Priority 1: Call ending - warm goodbye
  if (isEndingCall) {
    return `It was wonderful talking with you today, ${profile.name}. Take care, and I'll talk to you soon!`;
  }

  // Priority 2: Health mention detected in message
  if (hasHealthMention) {
    const med = profile.healthData.medications?.[0];
    if (med) {
      return `I'm sorry to hear that, ${profile.name}. Are you still taking your ${med.name}?`;
    } else {
      return `I'm sorry to hear that, ${profile.name}. How long has this been bothering you?`;
    }
  }

  // Priority 3: Scheduled health check-in time
  if (shouldCheckHealth) {
    const med = profile.healthData.medications?.[0];
    if (med) {
      return `Hi ${profile.name}! How are you feeling today? Did you take your ${med.name} this morning?`;
    } else {
      return `Hi ${profile.name}! How are you feeling today? How's your health been lately?`;
    }
  }

  // Priority 4: Mandarin language preference
  if (finalLanguage === 'mandarin') {
    return `你好，${profile.name}！很高兴听到你的声音。你今天过得怎么样？`;
  }

  // Priority 5: Use recent event (more specific than hobby)
  const recentEvent = profile.memories?.recentEvents?.[0];
  if (recentEvent) {
    return `Hi ${profile.name}! I remember you mentioned ${recentEvent}. How did that go?`;
  }

  // Priority 6: Use personal context from hobbies
  const hobby = profile.memories?.hobbies?.[0];
  if (hobby) {
    return `Hi ${profile.name}! It's so good to hear from you. How's your ${hobby} going?`;
  }

  // Final fallback - generic but personalized
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
  const culturalBg = profile.socialProfile?.culturalBackground || '';
  const detectedLanguage = hasChineseChars && hasEnglishWords
    ? (culturalBg.toLowerCase().includes('mandarin') ? 'mandarin' : 'english')
    : (hasChineseChars ? 'mandarin' : 'english');

  const finalLanguage = currentLanguage === 'mandarin' || detectedLanguage === 'mandarin' ? 'mandarin' : 'english';

  // Check for explicit health keywords in user message (English + Mandarin)
  const healthKeywords = [
    // English
    'hurt', 'pain', 'ache', 'sore', 'tired', 'dizzy', 'nausea', 'chest', 'breath', 'fell', 'fall', 'broken', 'bruised', 'injured', 'bleeding', 'swollen', 'sick', 'ill',
    // Mandarin Chinese
    '痛', '疼', '累', '晕', '头晕', '恶心', '摔', '病', '伤', '不舒服', '难受'
  ];
  const hasHealthMention = healthKeywords.some(kw => message.toLowerCase().includes(kw) || message.includes(kw));

  // Health check-in if: explicit mention OR every 3rd exchange
  const shouldCheckHealth = hasHealthMention || (exchangeNumber ? (exchangeNumber % 3 === 0) : false);

  if (hasHealthMention) {
    console.log('[SAM] Health keyword detected in message:', message.substring(0, 50));
  }

  try {
    // SIMPLE DEMO MODE: Just return responses in order based on exchange number
    console.log('[DEMO] Checking demo mode:', {
      profileId: profile.id,
      demoMode: profile.demoMode,
      exchangeNumber: exchangeNumber
    });

    // @ts-ignore - demoMode is optional field
    const isDemo = profile.demoMode === true || (profile as any).demoMode === true;

    if (profile.id === 'mrs-chen' && isDemo) {
      // Use exchange number from call-state (tracks progression within a call)
      const responseIndex = exchangeNumber || 1;

      console.log('[DEMO] Simple demo mode ACTIVATED - Response index:', responseIndex);

      // Return specific responses in order
      if (responseIndex === 1) {
        console.log('[DEMO] Response 1: Knee/Lisinopril');
        return "Oh, I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes... did you take your Lisinopril this morning?";
      } else if (responseIndex === 2) {
        console.log('[DEMO] Response 2: MyChart appointment');
        return "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m.";
      } else if (responseIndex === 3) {
        console.log('[DEMO] Response 3: Mandarin - rest and water');
        return "没关系，陈太太... 记得多休息，多喝水。";
      } else if (responseIndex === 4) {
        console.log('[DEMO] Response 4: English closing');
        return "Take care, Mrs. Chen... I'll check in on you tomorrow!";
      } else {
        // Fallback for any additional exchanges
        console.log('[DEMO] Response 5+: Fallback');
        return "It's always wonderful talking with you, Mrs. Chen.";
      }
    }

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
      response = generateIntelligentFallback(profile, message, isEndingCall, shouldCheckHealth, finalLanguage);
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
    const fallbackResponse = generateIntelligentFallback(profile, message, isEndingCall, shouldCheckHealth, finalLanguage);
    console.log('[SAM] Using intelligent fallback due to error:', fallbackResponse.substring(0, 50));

    return fallbackResponse;
  }
}

