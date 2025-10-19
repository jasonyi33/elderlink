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
 * Validate response content before sending to Vapi
 * Ensures no meta-text, JSON, or malformed content reaches TTS
 */
function validateResponse(response: string): { isValid: boolean; reason?: string } {
  if (!response || response.trim().length === 0) {
    return { isValid: false, reason: 'empty' };
  }
  if (response.length > 500) {
    return { isValid: false, reason: 'too_long' };
  }
  // Check for JSON remnants
  if (/\{[\s\S]*\}/.test(response)) {
    return { isValid: false, reason: 'contains_json' };
  }
  // Check for code blocks
  if (/```/.test(response)) {
    return { isValid: false, reason: 'contains_code_block' };
  }
  // Check for meta-instructions
  if (/^\[.*?\]:/.test(response)) {
    return { isValid: false, reason: 'contains_meta_instruction' };
  }
  return { isValid: true };
}

/**
 * Load Mrs. Chen seed data from static JSON
 * This is used for demo purposes to have a rich starting profile
 */
async function loadMrsChenSeedData(): Promise<SeniorProfile | null> {
  try {
    // Seed data embedded as constant (could also fetch from R2/DO in production)
    const seedData: SeniorProfile = {
      "id": "mrs-chen",
      "name": "Mrs. Chen",
      "age": 72,
      "phone": "+12248581016",
      "languages": ["english", "mandarin"],
      "location": "Seattle, WA",
      "demoMode": true,
      "memories": {
        "family": [
          {
            "name": "Sarah",
            "relationship": "daughter",
            "details": ["Lives in Portland", "Visits monthly", "Has two kids"]
          },
          {
            "name": "Tommy",
            "relationship": "grandson",
            "details": ["8 years old", "Loves dinosaurs", "Learning piano"]
          },
          {
            "name": "Emily",
            "relationship": "granddaughter",
            "details": ["10 years old", "Soccer player", "Straight-A student"]
          }
        ],
        "hobbies": ["gardening", "piano", "cooking Chinese food", "watching Beijing opera"],
        "health": ["arthritis in knees", "high blood pressure", "trouble sleeping"],
        "recentEvents": [
          "Sarah visited last weekend with the kids",
          "Tomatoes in garden are growing well",
          "Played piano at community center last Tuesday",
          "Made dumplings for church potluck"
        ],
        "preferences": {
          "topicsEnjoys": ["family", "gardening", "cooking", "music", "grandchildren"],
          "topicsAvoid": ["politics", "death", "finances"],
          "conversationStyle": "warm and patient"
        }
      },
      "socialProfile": {
        "interests": ["gardening", "piano", "Chinese cooking", "Beijing opera"],
        "culturalBackground": "Shanghai, Mandarin speaker",
        "openToMatching": true
      },
      "healthData": {
        "conditions": [
          {"name": "Hypertension", "since": "2018", "status": "controlled"},
          {"name": "Type 2 Diabetes", "since": "2020", "status": "managed"},
          {"name": "Osteoarthritis", "since": "2019", "status": "mild"}
        ],
        "medications": [
          {"name": "Lisinopril", "dosage": "10mg", "frequency": "daily morning", "purpose": "blood pressure"},
          {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily with meals", "purpose": "diabetes"},
          {"name": "Vitamin D", "dosage": "1000 IU", "frequency": "daily", "purpose": "bone health"}
        ],
        "vitals": {
          "lastUpdated": "2025-01-18T00:00:00Z",
          "bloodPressure": "128/82",
          "weight": "145 lbs",
          "bloodSugar": "110 mg/dL fasting"
        },
        "appointments": [
          {"date": "2025-01-25", "time": "10:00 AM", "type": "Primary care checkup", "doctor": "Dr. Smith"},
          {"date": "2025-02-15", "time": "2:00 PM", "type": "Cardiology follow-up", "doctor": "Dr. Johnson"}
        ],
        "notes": []
      },
      "matches": [
        {
          "seniorId": "mrs-lee",
          "score": 92,
          "compatibility": "high",
          "sharedInterests": ["gardening", "cooking", "Mandarin"],
          "calculatedAt": "2025-01-18T00:00:00Z"
        },
        {
          "seniorId": "mr-wong",
          "score": 85,
          "compatibility": "good",
          "sharedInterests": ["piano", "music", "opera"],
          "calculatedAt": "2025-01-18T00:00:00Z"
        },
        {
          "seniorId": "mrs-zhang",
          "score": 88,
          "compatibility": "good",
          "sharedInterests": ["cooking", "gardening", "grandchildren"],
          "calculatedAt": "2025-01-18T00:00:00Z"
        }
      ],
      "groups": [
        {
          "id": "gardening-club",
          "name": "Seattle Mandarin Gardening Circle",
          "memberCount": 8,
          "activity": "Weekend gardening and tea",
          "language": "Mandarin",
          "schedule": "Saturdays 10am"
        },
        {
          "id": "piano-ensemble",
          "name": "Senior Piano Ensemble",
          "memberCount": 5,
          "activity": "Classical and Chinese music",
          "language": "English/Mandarin",
          "schedule": "Wednesdays 2pm"
        }
      ],
      "conversations": [],
      "wellnessMetrics": {
        "mentalHealth": {
          "lonelinessScore": 3,
          "averageSentiment": 0.75,
          "trend": "improving"
        },
        "physicalHealth": {
          "symptomMentions": 2,
          "medicationAdherence": 95,
          "appointmentReminders": 1
        },
        "socialHealth": {
          "matchesMade": 3,
          "groupsJoined": 3,
          "communityEngagement": 85
        },
        "holisticScore": 82,
        "lastCallDate": "2025-01-17T10:00:00Z",
        "callFrequency": 4
      }
    };

    return seedData;
  } catch (error) {
    console.error('[VAPI] Error loading seed data:', error);
    return null;
  }
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

    // Check if streaming is requested
    const requestData = await request.clone().json() as any;
    const isStreamingRequest = requestData.stream === true;

    const responsePromise = processVapiCall(request, env);

    // Race: return whichever finishes first
    const result = await Promise.race([responsePromise, timeoutPromise]);

    // If streaming requested, return SSE format
    if (isStreamingRequest) {
      console.log('[VAPI] Returning SSE stream response');
      return createSSEResponse(result);
    }

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

  // Check if streaming is requested
  const isStreamingRequest = data.stream === true;
  console.log('[VAPI] Stream requested:', isStreamingRequest);

  // DEBUG: First, log top-level keys to understand structure
  console.log('[VAPI] PAYLOAD KEYS:', Object.keys(data));
  console.log('[VAPI] PAYLOAD TYPE:', typeof data);

  // DEBUG: Log ENTIRE raw payload to understand Vapi's custom-LLM format
  console.log('[VAPI] RAW PAYLOAD:', JSON.stringify(data, null, 2));

  const { message, call, messages } = data;

  // Detect event type from Vapi server messages
  // conversation-update: Active conversation in progress
  // end-of-call-report: Call has ended
  // status-update, hang, speech-update: Other events we can ignore for call state
  const messageType = message?.type || 'unknown';
  console.log('[VAPI] Message type:', messageType);

  // Map phone number to senior ID
  const phoneNumber = call?.phoneNumber || message?.phoneNumber?.number;
  const phoneToSeniorId: Record<string, string> = {
    '+12248581016': 'mrs-chen',
    '+12065551234': 'mrs-chen', // Backup number
  };

  const seniorId = (phoneNumber && phoneToSeniorId[phoneNumber]) || 'mrs-chen';
  console.log(`[VAPI] Phone: ${phoneNumber} → Senior ID: ${seniorId}`);

  // Handle end-of-call-report events - clear call state and reset demo exchange counter
  if (messageType === 'end-of-call-report') {
    console.log('[VAPI] End of call detected, clearing call state and resetting demo mode');
    await env.KV.delete(`call-state-${seniorId}`);

    // Reset demo exchange counter for next call
    let profile = await getProfile(seniorId, env);
    if (profile && profile.demoMode === true) {
      profile.demoExchangeNumber = 1;
      await saveProfile(profile, env);
      console.log('[DEMO] Reset exchange number to 1 for next call');
    }

    return {
      id: `chatcmpl-end-${Date.now()}`,
      choices: [{ index: 0, message: { role: 'assistant', content: '' } }]
    };
  }

  // Handle speech-update and status-update events - set call state but don't process message
  if (messageType === 'speech-update' || messageType === 'status-update') {
    console.log('[VAPI] Non-conversation event, setting call state active:', messageType);

    // Set call state to active (so dashboard shows live call)
    const callState = {
      isActive: true,
      startedAt: new Date().toISOString(),
      language: 'english', // Default, will be updated on actual messages
      seniorId: seniorId
    };
    await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));

    return {
      id: `chatcmpl-ignored-${Date.now()}`,
      choices: [{ index: 0, message: { role: 'assistant', content: '' } }]
    };
  }

  // Ignore hang events
  if (messageType === 'hang') {
    console.log('[VAPI] Hang event, clearing call state');
    await env.KV.delete(`call-state-${seniorId}`);
    return {
      id: `chatcmpl-hang-${Date.now()}`,
      choices: [{ index: 0, message: { role: 'assistant', content: '' } }]
    };
  }

  // Get senior profile
  let profile = await getProfile(seniorId, env);

  // Handle missing profile - auto-load seed data for demo account
  if (!profile) {
    if (seniorId === 'mrs-chen') {
      console.log('[VAPI] Mrs. Chen profile not found, loading seed data...');
      // Load seed data from JSON file
      const seedData = await loadMrsChenSeedData();
      if (seedData) {
        console.log('[VAPI] Seed data demoMode:', seedData.demoMode);
        await saveProfile(seedData, env);
        profile = seedData;
        console.log('[VAPI] Seed data loaded and saved to KV, demoMode:', profile.demoMode);
      } else {
        console.warn('[VAPI] Failed to load seed data, using empty default');
        profile = createDefaultProfile(seniorId);
      }
    } else {
      console.log('[VAPI] Profile not found for', seniorId, '- creating new empty profile');
      profile = createDefaultProfile(seniorId);
    }
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

  // Helper function to detect language from message content
  function detectLanguage(messageText: string): 'english' | 'mandarin' {
    // Check for Chinese characters (Unicode range for CJK Unified Ideographs)
    const chineseRegex = /[\u4e00-\u9fa5]/;
    if (chineseRegex.test(messageText)) {
      return 'mandarin';
    }
    return 'english';
  }

  // Detect language from the actual message content
  const language = detectLanguage(seniorMessage);
  console.log('[VAPI] Language detection:', {message: seniorMessage.substring(0, 50), detected: language});

  // Check if this is a new call starting (call state doesn't exist yet)
  const existingCallState = await env.KV.get(`call-state-${seniorId}`);
  const isNewCall = !existingCallState;

  // Reset demo exchange counter for new calls
  if (isNewCall && profile.demoMode === true) {
    if (profile.demoExchangeNumber !== 1) {
      console.log('[DEMO] New call detected, resetting exchange number from', profile.demoExchangeNumber, 'to 1');
      profile.demoExchangeNumber = 1;
      await saveProfile(profile, env);
    }
  }

  // Calculate exchange number for health check-in logic
  const exchangeNumber = profile.conversations.length + 1;

  // PRIORITY PATH: Generate Sam's response immediately (Developer 1's real function)
  let samResponse = await generateSamResponse(
    seniorMessage,
    profile,
    exchangeNumber,
    env, // Pass env to enable real Gemini API calls
    {
      language: language,
      isEndingCall: false // Could detect from message keywords
    }
  );

  // DEMO MODE: Increment exchange number for next response (cap at 4)
  // @ts-ignore - demoMode is optional field
  if (profile.demoMode === true) {
    const currentExchange = profile.demoExchangeNumber || 1;
    // Don't increment past 4 - keep repeating the closing message
    if (currentExchange < 4) {
      profile.demoExchangeNumber = currentExchange + 1;
      console.log('[DEMO] Incremented exchange number to:', profile.demoExchangeNumber);
      // Save immediately so next exchange uses updated number
      await saveProfile(profile, env);
    } else {
      console.log('[DEMO] At final exchange (4), not incrementing further');
    }
  }

  // CRITICAL: Validate response before sending to Vapi
  const validation = validateResponse(samResponse);
  if (!validation.isValid) {
    console.error('[VAPI] Invalid response detected:', validation.reason, 'Response:', samResponse.substring(0, 100));
    // Use safe fallback
    samResponse = `Hi ${profile.name}! How are you doing today?`;
  }

  // Log response metrics
  console.log('[VAPI] Response metrics:', {
    length: samResponse.length,
    wordCount: samResponse.split(/\s+/).length,
    language,
    exchangeNumber,
    seniorId: profile.id,
    timeMs: Date.now() - start
  });

  // Alert on suspicious responses
  if (samResponse.length > 400) {
    console.warn('[VAPI] ⚠️ Response longer than expected:', samResponse.length, 'chars');
  }
  if (samResponse.split(/\s+/).length > 60) {
    console.warn('[VAPI] ⚠️ Response wordier than expected:', samResponse.split(/\s+/).length, 'words');
  }

  // Select voice based on language
  const voiceId = language === 'mandarin'
    ? env.ELEVENLABS_MANDARIN_VOICE
    : env.ELEVENLABS_ENGLISH_VOICE;

  console.log(`[VAPI] Response validated and ready in ${Date.now() - start}ms`);

  // Set call state to active (for dashboard to show live sentiment)
  const callState = {
    isActive: true,
    startedAt: new Date().toISOString(),
    language: language,
    seniorId: seniorId
  };
  await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));
  console.log('[VAPI] Call state set to active');

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
    fullResponse: response,
    isStreaming: isStreamingRequest
  }, null, 2));

  // If streaming is requested, return SSE format with stream marker
  if (isStreamingRequest) {
    response.stream = true;
  }

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
      profile,
      env // Pass env to enable real Gemini API calls
    );

    // 2. Memory Extraction (Developer 1's real function with real Gemini API)
    const newMemories = await extractMemories(message, profile, env); // Pass env for real API calls

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

    // 3. Store Live Sentiment (for dashboard) - includes language field
    await saveLiveSentiment('mrs-chen', {
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      language: language as 'english' | 'mandarin',
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

/**
 * Create SSE (Server-Sent Events) response for streaming
 * Format: OpenAI-compatible streaming format
 */
function createSSEResponse(result: any): Response {
  const responseContent = result.choices?.[0]?.message?.content || '';

  // Create SSE stream - send entire response at once
  const sseData = [];

  // Send the response as a delta chunk
  sseData.push(`data: ${JSON.stringify({
    id: result.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: 'custom',
    choices: [
      {
        index: 0,
        delta: {
          role: 'assistant',
          content: responseContent
        },
        finish_reason: null
      }
    ]
  })}\n\n`);

  // Send final chunk with finish_reason
  sseData.push(`data: ${JSON.stringify({
    id: result.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: 'custom',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop'
      }
    ]
  })}\n\n`);

  // Send [DONE] marker
  sseData.push('data: [DONE]\n\n');

  const sseBody = sseData.join('');

  console.log('[VAPI] SSE Response:', sseBody.substring(0, 200));

  return new Response(sseBody, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

