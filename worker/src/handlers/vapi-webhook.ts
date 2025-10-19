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
import { Env, getProfile, saveProfile, saveLiveSentiment, restoreProfile, hasBackup } from '../services/kv-service';
import { createHealthNote, appendHealthNote, extractVitals } from '../services/health-service';
import { recalculateMatches } from '../services/matching-service';
import { detectAndCreateAlert, storeAlert } from '../services/alert-service';
import { updateWellnessMetrics } from '../services/wellness-service';
import { generateSummary, extractKeyTopics } from '../services/conversation-summary';

// ✅ Hour 5 Integration: Real AI functions from Developer 1
import { generateSamResponse } from '../prompts/sam-personality';
import { extractMemories } from '../prompts/memory-extraction';
import { analyzeSentimentAndHealth } from '../prompts/sentiment-health-analysis';

// Demo mode script for live demonstrations
import { DEMO_SCRIPT, getDemoExchange, isWithinDemoScript, extractHealthMentionsFromDemoExchange } from '../data/demo-script';

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

  // Handle end-of-call-report events - clear call state and return early
  if (messageType === 'end-of-call-report') {
    console.log('[VAPI] End of call detected, clearing call state');

    // 🎬 AUTO-DISABLE DEMO MODE: After first call completes, switch to live mode
    const demoModeKey = 'demo-mode-active';
    const demoModeValue = await env.KV.get(demoModeKey);

    if (demoModeValue === 'true') {
      await env.KV.delete(demoModeKey);
      console.log('[DEMO] ✅ First demo call complete - DEMO MODE DISABLED');
      console.log('[DEMO] ✅ All subsequent calls will use LIVE mode with real Gemini/ElevenLabs');

      // 🎬 RESTORE ORIGINAL PROFILE: Restore backed-up profile data
      console.log('[DEMO] Checking for profile backup to restore...');
      const backupExists = await hasBackup(seniorId, env);

      if (backupExists) {
        const restored = await restoreProfile(seniorId, env);
        if (restored) {
          console.log('[DEMO] ✅ Original profile RESTORED - Dashboard will show full history');
          console.log('[DEMO] ✅ Community matches, analytics, and 147 conversations available');
        } else {
          console.log('[DEMO] ⚠️ Profile restore failed - check logs');
        }
      } else {
        console.log('[DEMO] ℹ️ No backup found - demo profile will remain (this is normal if no pre-demo data existed)');
      }
    }

    await env.KV.delete(`call-state-${seniorId}`);
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
        await saveProfile(seedData, env);
        profile = seedData;
        console.log('[VAPI] Seed data loaded and saved to KV');
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

  // 🎬 DEMO MODE: Check if this is a demo call (first call only)
  const demoModeKey = 'demo-mode-active';
  const demoModeValue = await env.KV.get(demoModeKey);
  const isDemoMode = demoModeValue === 'true';

  // Calculate exchange number for health check-in logic
  // 🎬 CRITICAL FIX: In demo mode, FORCE exchange number to count only demo exchanges
  // This prevents skipping if profile wasn't properly cleared before demo
  let exchangeNumber: number;

  if (isDemoMode) {
    // Count only exchanges during THIS demo call (in case profile has leftover conversations)
    const callStateKey = `call-state-${seniorId}`;
    const callState = await env.KV.get(callStateKey);
    const currentCallExchangeCount = callState ? JSON.parse(callState).exchangeCount || 0 : 0;
    exchangeNumber = currentCallExchangeCount + 1;

    // Update call state with new exchange count
    await env.KV.put(callStateKey, JSON.stringify({ exchangeCount: exchangeNumber }), { expirationTtl: 300 });

    console.log('[DEMO] 🎯 FORCED exchange number for demo mode:', {
      profileConversations: profile.conversations.length,
      callExchangeCount: currentCallExchangeCount,
      forcedExchangeNumber: exchangeNumber,
      reason: 'Demo mode always starts from exchange #1 regardless of profile state'
    });
  } else {
    // Normal mode: use profile conversation count
    exchangeNumber = profile.conversations.length + 1;
  }

  console.log('[DEMO] Mode check:', { isDemoMode, exchangeNumber, scriptLength: DEMO_SCRIPT.length });

  // PRIORITY PATH: Generate Sam's response
  let samResponse: string;
  let language: 'english' | 'mandarin';
  let demoAnalysis: any = null;

  if (isDemoMode) {
    // 🎬 DEMO MODE: Always use demo responses when demo mode is enabled
    // This prevents accidental Gemini API calls during demos

    if (isWithinDemoScript(exchangeNumber)) {
      // Use pre-scripted response for ultra-fast demo
      const demoExchange = getDemoExchange(exchangeNumber);

      if (demoExchange) {
        samResponse = demoExchange.samResponse;
        language = demoExchange.language;

        console.log('[DEMO] Using scripted response:', {
          exchange: exchangeNumber,
          language,
          responsePreview: samResponse.substring(0, 60) + '...',
          sentiment: demoExchange.expectedSentiment,
          emotions: demoExchange.expectedEmotions
        });

        // Create demo analysis with pre-defined values
        const healthMentions = extractHealthMentionsFromDemoExchange(
          exchangeNumber,
          seniorMessage,
          samResponse
        );

        demoAnalysis = {
          sentiment: demoExchange.expectedSentiment,
          emotions: demoExchange.expectedEmotions,
          healthMentions: healthMentions
        };

        // Save live sentiment immediately for instant dashboard update
        await saveLiveSentiment('mrs-chen', {
          sentiment: demoAnalysis.sentiment,
          emotions: demoAnalysis.emotions,
          language: language,
          timestamp: new Date().toISOString()
        }, env);

        console.log('[DEMO] Live sentiment saved for instant dashboard update');
      } else {
        // Demo exchange not found - use fallback (still in demo mode)
        console.log('[DEMO] ⚠️ Exchange not found in script, using demo fallback response');
        language = 'english';
        samResponse = "I appreciate you sharing that with me, Mrs. Chen. Tell me more about how you're feeling today.";

        demoAnalysis = {
          sentiment: 0.5,
          emotions: ['neutral', 'engaged'],
          healthMentions: []
        };
      }
    } else {
      // Exchange number exceeds script length - use fallback response
      console.log('[DEMO] ⚠️ Exchange exceeds script length, using demo fallback response');
      language = 'english';
      samResponse = "I appreciate you sharing that with me, Mrs. Chen. How else can I help you today?";

      demoAnalysis = {
        sentiment: 0.5,
        emotions: ['neutral', 'engaged'],
        healthMentions: []
      };
    }
  } else {
    // ✅ LIVE MODE: Real Gemini API call
    language = detectLanguage(seniorMessage);
    console.log('[LIVE] Language detection:', { message: seniorMessage.substring(0, 50), detected: language });

    samResponse = await generateSamResponse(
      seniorMessage,
      profile,
      exchangeNumber,
      env,
      { language, isEndingCall: false }
    );
  }

  // Select voice based on language
  const voiceId = language === 'mandarin'
    ? env.ELEVENLABS_MANDARIN_VOICE
    : env.ELEVENLABS_ENGLISH_VOICE;

  console.log(`[VAPI] Response generated in ${Date.now() - start}ms`);

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
    backgroundProcessing(seniorMessage, samResponse, profile, language, env, demoAnalysis)
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
  env: Env,
  demoAnalysis?: any // Optional pre-computed analysis from demo mode
): Promise<void> {
  console.log('[ASYNC] Background processing started');

  try {
    // 1. Sentiment + Health Analysis
    let analysis: any;

    if (demoAnalysis) {
      // Use pre-computed demo analysis for instant results
      analysis = demoAnalysis;
      console.log('[DEMO] Using pre-computed analysis:', {
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        healthMentionsCount: analysis.healthMentions?.length || 0
      });
    } else {
      // Live mode: Real Gemini API call
      analysis = await analyzeSentimentAndHealth(
        message,
        profile.conversations.slice(-3).map(c => c.transcript?.find(t => t.role === 'senior')?.content || ''),
        profile,
        env
      );
    }

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

    // 3. Store Live Sentiment (for dashboard) - skip if demo mode (already saved)
    if (!demoAnalysis) {
      await saveLiveSentiment('mrs-chen', {
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        language: language as 'english' | 'mandarin',
        timestamp: new Date().toISOString()
      }, env);
    } else {
      console.log('[DEMO] Skipping sentiment save (already saved in demo mode)');
    }

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

