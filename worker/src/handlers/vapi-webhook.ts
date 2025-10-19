/**
 * Task 3.1d: Vapi Webhook Handler
 * 
 * CRITICAL PATH - Must respond in <3 seconds
 * Integrated with Developer 1's real AI functions
 * 
 * Reference: 
 * - PRD.md lines 1121-1289
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.2 (full implementation)
 */

import { SeniorProfile } from '../types';
import { Env, getProfile, saveProfile, saveLiveSentiment } from '../services/kv-service';
import { createHealthNote, appendHealthNote, extractVitals } from '../services/health-service';
import { recalculateMatches } from '../services/matching-service';
import { detectAndCreateAlert, storeAlert } from '../services/alert-service';
import { updateWellnessMetrics } from '../services/wellness-service';
import { generateSummary, extractKeyTopics } from '../services/conversation-summary';

// ✅ Hour 5 Integration: Real AI functions from Developer 1
import { generateSamResponse } from '../prompts/sam-personality';
import { extractMemories } from '../prompts/memory-extraction';
import { analyzeSentimentAndHealth } from '../prompts/sentiment-health-analysis';

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
    const timeoutPromise = new Promise<any>(resolve =>
      setTimeout(() => {
        console.log('[VAPI] Timeout triggered at 7s');
        resolve({
          id: `chatcmpl-timeout-${Date.now()}`,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: "I'm listening. Please continue."
              }
            }
          ]
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
    // Generic fallback in Vapi custom-LLM format
    const fallbacks = [
      "Tell me more about that.",
      "I'm here with you. Please go on.",
      "That sounds important to you.",
      "How does that make you feel?"
    ];
    return new Response(JSON.stringify({
      id: `chatcmpl-error-${Date.now()}`,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: fallbacks[Math.floor(Math.random() * fallbacks.length)]
          }
        }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Process Vapi call with priority and async paths
 */
async function processVapiCall(request: Request, env: Env): Promise<any> {
  const start = Date.now();
  const data = await request.json() as any;

  // DEBUG: First, log top-level keys to understand structure
  console.log('[VAPI] PAYLOAD KEYS:', Object.keys(data));
  console.log('[VAPI] PAYLOAD TYPE:', typeof data);

  // DEBUG: Log ENTIRE raw payload to understand Vapi's custom-LLM format
  console.log('[VAPI] RAW PAYLOAD:', JSON.stringify(data, null, 2));

  const { message, call, messages } = data;

  // DEBUG: Log parsed sections
  console.log('[VAPI] PARSED SECTIONS:', JSON.stringify({
    hasMessage: !!message,
    hasMessages: !!messages,
    hasCall: !!call,
    messageType: message?.type,
    messageRole: message?.role,
    messagesLength: messages?.length,
    lastMessage: messages?.[messages.length - 1]
  }, null, 2));

  // Map phone number to senior ID
  const phoneNumber = call?.phoneNumber;
  const phoneToSeniorId: Record<string, string> = {
    '+12248581016': 'mrs-chen',
    '+12065551234': 'mrs-chen', // Backup number
  };

  const seniorId = (phoneNumber && phoneToSeniorId[phoneNumber]) || 'mrs-chen';
  console.log(`[VAPI] Phone: ${phoneNumber} → Senior ID: ${seniorId}`);

  // Get senior profile
  let profile = await getProfile(seniorId, env);

  // Handle missing profile (create default for demo)
  if (!profile) {
    console.log('[VAPI] Profile not found, using default');
    profile = createDefaultProfile('mrs-chen');
  }

  // Extract senior's message (support multiple formats)
  // 1. OpenAI format: messages array (custom-LLM via /chat/completions)
  // 2. Vapi webhook format: message.content (conversation-update webhooks)
  let seniorMessage = '';
  if (messages && Array.isArray(messages) && messages.length > 0) {
    // OpenAI format - get last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    seniorMessage = lastUserMessage?.content || '';
    console.log('[VAPI] Extracted from OpenAI messages array:', seniorMessage);
  } else if (message) {
    // Vapi webhook format
    seniorMessage = message?.content || message?.transcript?.content || '';
    console.log('[VAPI] Extracted from webhook message:', seniorMessage);
  }
  console.log('[VAPI] Final extracted message:', seniorMessage);

  if (!seniorMessage || seniorMessage.trim() === '') {
    return {
      id: `chatcmpl-empty-${Date.now()}`,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: "I'm here. Take your time."
          }
        }
      ]
    };
  }

  // Language from Vapi - check multiple possible locations
  const language = message?.language || call?.language || 'english';

  // Calculate exchange number for health check-in logic
  const exchangeNumber = profile.conversations.length + 1;

  // PRIORITY PATH: Generate Sam's response immediately (Developer 1's real function)
  const samResponse = await generateSamResponse(
    seniorMessage,
    profile,
    exchangeNumber,
    env, // Pass env to enable real Gemini API calls
    {
      language: language,
      isEndingCall: false // Could detect from message keywords
    }
  );

  // Select voice based on language
  const voiceId = language === 'mandarin'
    ? env.ELEVENLABS_MANDARIN_VOICE
    : env.ELEVENLABS_ENGLISH_VOICE;

  console.log(`[VAPI] Response generated in ${Date.now() - start}ms`);

  // ASYNC PATH: Queue background processing (runs after response sent)
  env.context.waitUntil(
    backgroundProcessing(seniorMessage, samResponse, profile, language, env)
  );

  // Return response in Vapi's expected custom-LLM format
  // Reference: https://support.vapi.ai/t/23460916/response-body-structure-for-custom-llm
  const response = {
    id: `chatcmpl-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: samResponse
        }
      }
    ]
  };

  console.log('[VAPI] OUTGOING RESPONSE:', JSON.stringify({
    contentLength: samResponse.length,
    contentPreview: samResponse.substring(0, 100),
    language: language === 'mandarin' ? 'zh-CN' : 'en-US',
    voiceId: voiceId,
    fullResponse: response
  }, null, 2));

  return response;
}

/**
 * Background processing - runs asynchronously after response sent
 * Does NOT block the webhook response
 */
async function backgroundProcessing(
  message: string,
  samResponse: string,
  profile: SeniorProfile,
  language: string,
  env: Env
): Promise<void> {
  console.log('[ASYNC] Background processing started');
  
  try {
    // 1. Sentiment + Health Analysis (Developer 1's real function)
    const analysis = await analyzeSentimentAndHealth(
      message,
      profile.conversations.slice(-3).map(c => c.transcript?.find(t => t.role === 'senior')?.content || ''),
      profile
    );

    // 2. Memory Extraction (Developer 1's real function)
    const newMemories = await extractMemories(message, profile);

    // 2.5 Update profile with new memories
    if (newMemories && newMemories.newFacts) {
      // Merge new family members
      if (newMemories.newFacts.family && newMemories.newFacts.family.length > 0) {
        profile.memories.family.push(...newMemories.newFacts.family);
      }
      // Merge new hobbies
      if (newMemories.newFacts.hobbies && newMemories.newFacts.hobbies.length > 0) {
        profile.memories.hobbies.push(...newMemories.newFacts.hobbies);
        profile.socialProfile.interests.push(...newMemories.newFacts.hobbies);
        // Deduplicate
        profile.socialProfile.interests = [...new Set(profile.socialProfile.interests)];
      }
      // Merge new interests
      if (newMemories.newFacts.interests && newMemories.newFacts.interests.length > 0) {
        profile.socialProfile.interests.push(...newMemories.newFacts.interests);
        profile.socialProfile.interests = [...new Set(profile.socialProfile.interests)];
      }
      // Merge recent events (keep last 5)
      if (newMemories.newFacts.recentEvents && newMemories.newFacts.recentEvents.length > 0) {
        profile.memories.recentEvents = profile.memories.recentEvents || [];
        // ExtractedMemories.recentEvents are objects with {event, timeframe}
        const eventStrings = newMemories.newFacts.recentEvents.map(e => 
          typeof e === 'string' ? e : `${e.event} (${e.timeframe})`
        );
        profile.memories.recentEvents.push(...eventStrings);
        profile.memories.recentEvents = profile.memories.recentEvents.slice(-5);
      }
      // Merge preferences
      if (newMemories.newFacts.preferences && newMemories.newFacts.preferences.length > 0) {
        profile.memories.preferences.topicsEnjoys.push(...newMemories.newFacts.preferences);
      }
    }

    // 3. Store Live Sentiment (for dashboard)
    await saveLiveSentiment('mrs-chen', {
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      timestamp: new Date().toISOString()
    }, env);

    // 4. Create Health Notes (if health mentions found)
    if (analysis.healthMentions && analysis.healthMentions.length > 0) {
      const healthNote = createHealthNote(analysis.healthMentions, profile);
      profile = appendHealthNote(profile, healthNote);
      console.log('[HEALTH] Created health note with', analysis.healthMentions.length, 'mentions');
    }

    // 5. Extract and Store Vitals (if mentioned in message)
    const vitals = extractVitals(message);
    if (vitals) {
      profile.healthData.vitals = {
        ...profile.healthData.vitals,
        ...vitals,
        lastUpdated: new Date().toISOString()
      };
      console.log('[HEALTH] Updated vitals:', vitals);
    }

    // 5b. Detect Crisis and Create Alerts - PRD lines 580-584
    // Check for medical emergencies, suicide ideation, severe depression
    const alert = await detectAndCreateAlert(message, profile, env);
    if (alert) {
      console.log('[ALERT] Crisis detected:', alert.type, 'severity:', alert.severity);
      await storeAlert(profile.id, alert, env);
    }

    // 6. Update Conversation History
    // Generate summary and extract topics for this conversation
    const conversationTranscript = [
      { role: 'senior' as const, content: message },
      { role: 'assistant' as const, content: samResponse }
    ];

    const conversationSummary = generateSummary(conversationTranscript);
    const conversationTopics = extractKeyTopics(conversationTranscript);

    profile.conversations.push({
      timestamp: new Date().toISOString(),
      duration: 0,
      keyTopics: conversationTopics,
      sentiment: analysis.sentiment,
      language: language as 'english' | 'mandarin',
      summary: conversationSummary,
      transcript: conversationTranscript, // Store full transcript for context
      healthMentions: analysis.healthMentions?.map((h: any) => h.text)
    });

    // Keep only last 10 conversations
    if (profile.conversations.length > 10) {
      profile.conversations = profile.conversations.slice(-10);
    }

    // 7. Recalculate Wellness Metrics - PRD line 1283-1284
    try {
      updateWellnessMetrics(profile);
    } catch (error) {
      console.error('[WELLNESS] Error updating wellness metrics (non-blocking):', error);
      // Don't fail the entire async processing
    }
    
    // 8. Recalculate Matches (if interests changed) - PRD lines 1284-1287
    if (newMemories && newMemories.newFacts) {
      const hasNewInterests = (newMemories.newFacts.hobbies && newMemories.newFacts.hobbies.length > 0) ||
                              (newMemories.newFacts.interests && newMemories.newFacts.interests.length > 0);
      
      if (hasNewInterests) {
        try {
          console.log('[MATCHING] New interests detected, recalculating matches');
          await recalculateMatches(profile, env);
        } catch (error) {
          console.error('[MATCHING] Error recalculating matches (non-blocking):', error);
          // Don't fail the entire async processing
        }
      }
    }

    // 9. Save Updated Profile
    await saveProfile(profile, env);

    console.log('[ASYNC] Background processing completed');

  } catch (error) {
    console.error('[ASYNC] Background processing error:', error);
    // Don't fail the call, just log
  }
}

