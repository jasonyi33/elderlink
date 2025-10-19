/**
 * Task 3.1d: Vapi Webhook Handler
 * 
 * CRITICAL PATH - Must respond in <3 seconds
 * Full architecture implemented with stub AI functions
 * 
 * Reference: 
 * - PRD.md lines 1121-1289
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.2 (full implementation)
 */

import { SeniorProfile } from '../types';
import { Env, getProfile, saveProfile, saveLiveSentiment } from '../services/kv-service';

// TODO: Hour 5 - Replace with real function from Developer 1
async function generateSamResponse(
  _message: string,
  _profile: SeniorProfile,
  _language: string,
  _history: any[],
  _env: Env
): Promise<string> {
  console.log('[STUB] generateSamResponse called');
  // STUB: Simple response until Developer 1 provides real implementation
  return "Hello! I'm Sam. How can I help you today?";
}

// TODO: Hour 7 - Replace with real function from Developer 1
async function analyzeSentimentAndHealth(
  _message: string,
  _context: string[],
  _env: Env
): Promise<any> {
  console.log('[STUB] analyzeSentimentAndHealth called');
  // STUB: Return neutral sentiment
  return {
    sentiment: 0,
    emotions: [],
    healthMentions: [],
    concerns: [],
    wellnessIndicators: { socialConnection: 0, mood: 0, engagement: 0 }
  };
}

// TODO: Hour 7 - Replace with real function from Developer 1
async function extractMemories(
  _message: string,
  _profile: SeniorProfile,
  _env: Env
): Promise<any> {
  console.log('[STUB] extractMemories called');
  // STUB: Return empty new facts
  return { newFacts: { family: [], hobbies: [], interests: [], health: [], recentEvents: [] } };
}

/**
 * Create default profile structure for new seniors
 */
function createDefaultProfile(seniorId: string): SeniorProfile {
  return {
    id: seniorId,
    name: seniorId,
    age: 0,
    phone: '',
    languages: ['english'],
    location: '',
    memories: {
      family: [],
      hobbies: [],
      health: [],
      recentEvents: [],
      preferences: {
        topicsEnjoys: [],
        topicsAvoid: [],
        conversationStyle: ''
      }
    },
    socialProfile: {
      interests: [],
      culturalBackground: '',
      openToMatching: false
    },
    healthData: {
      conditions: [],
      medications: [],
      vitals: {
        lastUpdated: ''
      },
      appointments: [],
      notes: []
    },
    matches: [],
    groups: [],
    conversations: [],
    wellnessMetrics: {
      mentalHealth: {
        lonelinessScore: 0,
        averageSentiment: 0,
        trend: 'stable'
      },
      physicalHealth: {
        symptomMentions: 0,
        medicationAdherence: 0,
        appointmentReminders: 0
      },
      socialHealth: {
        matchesMade: 0,
        groupsJoined: 0,
        communityEngagement: 0
      },
      holisticScore: 0,
      lastCallDate: '',
      callFrequency: 0
    }
  };
}

/**
 * Main webhook handler - Optimized for <3s latency
 * Priority path: Response generation
 * Async path: Sentiment, memory, health processing
 */
export async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  console.log('[VAPI] Webhook request received:', new Date().toISOString());
  
  try {
    // Set up 7-second timeout for Vapi's 10-second limit
    const timeoutPromise = new Promise<{content: string; voiceId?: string}>(resolve =>
      setTimeout(() => {
        console.log('[VAPI] Timeout triggered at 7s');
        resolve({
          content: "I'm listening. Please continue."
        });
      }, 7000)
    );

    const responsePromise = processVapiCall(request, env);

    // Race: return whichever finishes first
    const result = await Promise.race([responsePromise, timeoutPromise]);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[VAPI] Webhook error:', error);
    // Generic fallback
    const fallbacks = [
      "Tell me more about that.",
      "I'm here with you. Please go on.",
      "That sounds important to you.",
      "How does that make you feel?"
    ];
    return new Response(JSON.stringify({
      content: fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Process Vapi call with priority and async paths
 */
async function processVapiCall(request: Request, env: Env): Promise<{content: string; voiceId: string}> {
  const start = Date.now();
  const data = await request.json() as { message?: any };
  const { message } = data;

  // Get senior profile
  let profile = await getProfile('mrs-chen', env);
  
  // Handle missing profile (create default for demo)
  if (!profile) {
    console.log('[VAPI] Profile not found, using default');
    profile = createDefaultProfile('mrs-chen');
  }

  // Extract senior's message
  const seniorMessage = message?.transcript?.content || '';

  if (!seniorMessage || seniorMessage.trim() === '') {
    return { 
      content: "I'm here. Take your time.",
      voiceId: env.ELEVENLABS_ENGLISH_VOICE
    };
  }

  // Language from Vapi (no Gemini call needed!)
  const language = message?.language || 'english';

  // PRIORITY PATH: Generate Sam's response immediately
  const samResponse = await generateSamResponse(
    seniorMessage,
    profile,
    language,
    message?.conversationHistory || [],
    env
  );

  // Select voice based on language
  const voiceId = language === 'mandarin'
    ? env.ELEVENLABS_MANDARIN_VOICE
    : env.ELEVENLABS_ENGLISH_VOICE;

  console.log(`[VAPI] Response generated in ${Date.now() - start}ms`);

  // ASYNC PATH: Queue background processing (runs after response sent)
  env.context.waitUntil(
    backgroundProcessing(seniorMessage, profile, language, env)
  );

  // Return response immediately (target: <2 seconds)
  return {
    content: samResponse,
    voiceId
  };
}

/**
 * Background processing - runs asynchronously after response sent
 * Does NOT block the webhook response
 */
async function backgroundProcessing(
  message: string,
  profile: SeniorProfile,
  language: string,
  env: Env
): Promise<void> {
  console.log('[ASYNC] Background processing started');
  
  try {
    // 1. Sentiment + Health Analysis
    const analysis = await analyzeSentimentAndHealth(
      message,
      profile.conversations.slice(-3).map(c => c.transcript?.find(t => t.role === 'senior')?.content || ''),
      env
    );

    // 2. Memory Extraction
    await extractMemories(message, profile, env);

    // 3. Store Live Sentiment (for dashboard)
    await saveLiveSentiment('mrs-chen', {
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      timestamp: new Date().toISOString()
    }, env);

    // 4. Update Conversation History
    profile.conversations.push({
      timestamp: new Date().toISOString(),
      duration: 0,
      keyTopics: [],
      sentiment: analysis.sentiment,
      language: language as 'english' | 'mandarin',
      summary: '',
      healthMentions: analysis.healthMentions?.map((h: any) => h.text)
    });

    // Keep only last 10 conversations
    if (profile.conversations.length > 10) {
      profile.conversations = profile.conversations.slice(-10);
    }

    // 5. Save Updated Profile
    await saveProfile(profile, env);

    console.log('[ASYNC] Background processing completed');

  } catch (error) {
    console.error('[ASYNC] Background processing error:', error);
    // Don't fail the call, just log
  }
}

