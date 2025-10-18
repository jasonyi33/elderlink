# Product Requirements Document: ElderLink AI Companion

**Version:** 3.0 - AI Companion Edition  
**Date:** October 2025  
**Project Type:** 24-Hour Hackathon (DubHacks 2025)  
**Team Size:** 4 Developers  
**Target Tracks:** GROW (The Advocate), ElevenLabs, Cloudflare, Gemini

---

## 1. Introduction/Overview

### Problem Statement
Seattle has 120,000+ seniors, 40% living alone. Social isolation increases mortality risk by 26%. Many immigrant seniors don't speak English well, can't use technology, and have no one to talk to for days. Human volunteers are scarce and unreliable. Loneliness is killing our elderly.

### Solution
**ElderLink** provides "Sam," an AI companion that elderly people can reach by phone for genuine, warm conversations anytime. Sam remembers previous conversations, adapts to each senior's personality, speaks multiple languages, and provides consistent emotional support. The system naturally tracks wellness and escalates serious concerns to human intervention.

### Key Innovation
We're not building a chatbot. We're building a companion with memory, empathy, and genuine conversational ability that elderly can access with zero technical knowledge—just their existing phone.

---

## 2. Goals

### Primary Goals (MVP - 24 Hours)
1. **Sam AI Companion** - Warm, persistent personality accessible by phone
2. **Conversation Memory** - Sam remembers previous conversations and personal details
3. **Natural Wellness Tracking** - Monitor emotional state through conversation
4. **Multi-lingual Support** - Seamless English/Mandarin switching
5. **Live Dashboard** - Real-time sentiment analysis and conversation analytics

### Secondary Goals (If Time Permits)
6. Voice customization options
7. Multiple AI personalities
8. Advanced memory retrieval
9. Crisis intervention protocols

### Success Criteria
- ✅ Live phone call where Sam remembers "Mrs. Chen" from previous conversations
- ✅ Dashboard shows real-time sentiment during call
- ✅ Natural, warm conversation that doesn't feel robotic
- ✅ Seamless language switching demonstrated
- ✅ Wellness trends visible over time

---

## 3. User Stories

### As a Senior
- I want to call and talk to someone who remembers me
- I want to feel heard and understood in my native language
- I want to share memories and stories with someone who cares
- I don't want to feel like a burden for being lonely

### As a Family Member
- I want to know my elderly parent has someone to talk to
- I want to see their emotional wellness trends
- I want alerts if they mention medical emergencies

### As a GROW Track Judge
- I want to see genuine emotional support being provided
- I want to see wellness impact through sentiment analysis
- I want to test the memory and continuity features
- I want to verify multi-lingual capabilities

---

## 4. Functional Requirements

### FR1: Sam AI Companion Core
**Priority:** CRITICAL - The heart of the system

**Requirements:**
1. Sam must have a consistent, warm personality
2. Sam must adapt energy level to match the senior
3. Sam must remember details from previous conversations
4. Sam must handle interruptions gracefully
5. Conversations should feel natural and open-ended

**Technical Implementation:**
```typescript
interface SamPersonality {
  name: "Sam";
  traits: ["warm", "patient", "good_listener", "empathetic"];
  voice: "ElevenLabs_Warm_Neutral";
  adaptiveTraits: {
    energyLevel: "matches_senior";  // calm vs energetic
    formalityLevel: "learns_preference";  // formal vs casual
    conversationPace: "adjusts_to_senior";  // slow vs normal
  };
}
```

### FR2: Conversation Memory System
**Priority:** CRITICAL - Key differentiator

**Requirements:**
1. Store and retrieve conversation history
2. Extract key facts (family names, hobbies, health issues)
3. Reference previous conversations naturally
4. Build senior profile over time

**Memory Storage Structure:**
```typescript
interface SeniorProfile {
  id: string;
  name: string;  // "Mrs. Chen"
  phone: string;
  language: "english" | "mandarin";
  
  // Learned information
  memories: {
    family: Array<{
      name: string;  // "daughter Sarah"
      relationship: string;
      details: string[];  // ["lives in Portland", "has two kids"]
    }>;
    hobbies: string[];  // ["gardening", "played piano"]
    health: string[];  // ["arthritis", "trouble sleeping"]
    preferences: {
      topicsEnjoys: string[];  // ["childhood stories", "cooking"]
      topicsAvoid: string[];  // ["politics"]
      conversationStyle: string;  // "likes to tell long stories"
    };
  };
  
  // Conversation history
  conversations: Array<{
    timestamp: string;
    duration: number;  // seconds
    keyTopics: string[];
    sentiment: number;  // -1 to 1
    summary: string;
    transcript: Array<{
      role: "sam" | "senior";
      content: string;
    }>;
  }>;
  
  // Wellness tracking
  wellnessMetrics: {
    lonelinessScore: number;  // 0-10, calculated naturally
    lastCallDate: string;
    callFrequency: number;  // calls per week
    averageSentiment: number;
    trend: "improving" | "stable" | "declining";
  };
}
```

### FR3: Multi-lingual Support
**Priority:** HIGH - ElevenLabs track requirement

**Requirements:**
1. Support English and Mandarin for demo
2. Detect language from senior's speech
3. Sam responds in same language
4. Seamless code-switching if senior switches

**Implementation:**
```typescript
// Language detection and response
if (detectedLanguage === 'mandarin') {
  samResponse = await generateResponse(prompt, 'mandarin');
  voiceId = 'elevenlabs_mandarin_voice_id';
} else {
  samResponse = await generateResponse(prompt, 'english');
  voiceId = 'elevenlabs_english_voice_id';
}
```

### FR4: Natural Wellness Tracking
**Priority:** HIGH - GROW track requirement

**Requirements:**
1. Analyze sentiment throughout conversation
2. Detect emotional state changes
3. Track wellness trends over time
4. No formal assessments - all natural

**Sentiment Analysis Approach:**
```typescript
interface ConversationAnalytics {
  realTimeSentiment: number;  // -1 to 1, updates every 10 seconds
  emotionalStates: Array<{
    timestamp: string;
    emotion: "happy" | "sad" | "lonely" | "anxious" | "content";
    confidence: number;
  }>;
  concernFlags: Array<{
    type: "medical" | "crisis" | "depression";
    severity: "low" | "medium" | "high";
    excerpt: string;
    requiresEscalation: boolean;
  }>;
}
```

### FR5: Admin Dashboard
**Priority:** CRITICAL - Judges need to see impact

**Dashboard Components:**

1. **Live Call View** (Updates during demo call)
   - Senior name and profile
   - Real-time sentiment meter (-1 to +1)
   - Current conversation transcript
   - Detected emotions
   - Language being spoken

2. **Senior Profile View** (Mrs. Chen)
   - Conversation history (last 10 calls)
   - Word cloud of topics discussed
   - Wellness trend graph (30 days)
   - Extracted memories and facts
   - Call frequency heatmap

3. **Analytics Overview**
   - Total conversations: 147
   - Average sentiment improvement: +0.42
   - Most discussed topics
   - Peak calling hours
   - Language distribution

### FR6: Crisis Escalation
**Priority:** MEDIUM - Safety feature

**Requirements:**
1. Detect medical emergencies → Flag in dashboard
2. Detect severe depression → Alert + continue support
3. Detect suicide ideation → Immediate escalation protocol
4. Dashboard shows alerts prominently

**Escalation Triggers:**
```typescript
const escalationKeywords = {
  medical: ["chest pain", "can't breathe", "fell down", "emergency"],
  crisis: ["want to die", "no point living", "ending it all"],
  depression: ["always sad", "crying every day", "can't get out of bed"]
};
```

### FR7: Conversation Quality Features
**Priority:** HIGH - Core to success

**Elderly-Friendly Techniques:**
1. **Reminiscence Therapy** - Encourage sharing past memories
2. **Active Listening** - Reflect back what they said
3. **Gentle Prompting** - Open-ended questions about their stories
4. **Patience** - Never rush, allow long pauses

**Fallback Topics:**
```typescript
const fallbackTopics = [
  "Tell me about your childhood. What was your favorite game?",
  "What's the weather like today? Does it remind you of any particular season from your past?",
  "Have you been watching any interesting shows lately?",
  "What did you used to cook for your family?",
  "Tell me about your hometown. What do you miss most?"
];
```

### FR8: Pre-Seeded Demo Data
**Priority:** CRITICAL - Must work for demo

**Mrs. Chen's Profile:**
```typescript
const MRS_CHEN_PROFILE = {
  name: "Mrs. Chen",
  age: 78,
  languages: ["english", "mandarin"],
  
  memories: {
    family: [
      { name: "Sarah", relationship: "daughter", details: ["lives in Portland", "visits monthly"] },
      { name: "Tommy", relationship: "grandson", details: ["8 years old", "loves soccer"] }
    ],
    hobbies: ["gardening", "used to teach piano", "cooking Shanghainese food"],
    health: ["arthritis in hands", "trouble sleeping lately"],
    recentEvents: ["daughter visited last weekend", "planted tomatoes yesterday"]
  },
  
  // Pre-seeded conversation history (5 conversations over 30 days)
  conversations: [
    {
      date: "2025-09-20",
      summary: "First call. Talked about family and garden.",
      keyTopics: ["daughter Sarah", "tomato plants", "loneliness"],
      sentiment: 0.3
    },
    {
      date: "2025-09-27", 
      summary: "Discussed childhood in Shanghai, teaching piano.",
      keyTopics: ["Shanghai memories", "piano students", "cooking"],
      sentiment: 0.5
    },
    {
      date: "2025-10-05",
      summary: "Worried about health, discussed arthritis pain.",
      keyTopics: ["arthritis", "sleeping problems", "doctor visit"],
      sentiment: 0.2
    },
    {
      date: "2025-10-12",
      summary: "Happy about daughter's visit, talked about grandson.",
      keyTopics: ["Sarah's visit", "Tommy's soccer", "family dinner"],
      sentiment: 0.7
    },
    {
      date: "2025-10-17",
      summary: "Discussed garden progress and cooking recipes.",
      keyTopics: ["tomatoes growing", "Shanghai recipes", "neighborhood"],
      sentiment: 0.6
    }
  ]
};
```

---

## 5. Non-Goals (Out of Scope)

❌ Human volunteer matching system  
❌ Multiple AI personalities (just Sam for demo)  
❌ Video calls  
❌ Medical advice or diagnosis  
❌ Call recording playback  
❌ Family portal with authentication  
❌ SMS/text messaging  
❌ Real crisis intervention (just flagging)  

---

## 6. Technical Architecture

### System Overview
```
┌─────────────┐
│   Senior    │ ──calls──> (206) XXX-XXXX
│   (Phone)   │
└─────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│         VAPI.AI PLATFORM            │
│  • Handles phone connection         │
│  • Speech-to-text (Deepgram)        │
│  • Text-to-speech (ElevenLabs)      │
└─────────────────────────────────────┘
       │
       │ Webhook: POST /vapi-webhook
       ↓
┌─────────────────────────────────────┐
│    CLOUDFLARE WORKERS               │
│  • Orchestrates Sam's responses     │
│  • Manages conversation state       │
│  • Calls modular Gemini prompts    │
└─────────────────────────────────────┘
       │                    │
       ├────────────────────┤
       ↓                    ↓
┌──────────────┐    ┌─────────────────┐
│  GEMINI API  │    │  CLOUDFLARE KV  │
│ • Memory     │    │ • Senior profile│
│ • Response   │    │ • Conversations │
│ • Sentiment  │    │ • Analytics     │
└──────────────┘    └─────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│    DASHBOARD (React + Cloudflare)   │
│  • Live sentiment meter             │
│  • Conversation history             │
│  • Word cloud & analytics          │
└─────────────────────────────────────┘
```

### Modular Prompt Architecture

**Three separate Gemini API calls per response:**

1. **Memory Extraction** (Extract facts from conversation)
2. **Response Generation** (Generate Sam's response using memories)
3. **Sentiment Analysis** (Analyze emotional state)

This modular approach is more debuggable than a mega-prompt.

---

## 7. Complete Prompt Templates

### Prompt 1: Memory Extraction
```javascript
const MEMORY_EXTRACTION_PROMPT = `
You are analyzing a conversation to extract important facts about a senior.

Previous known facts about this senior:
${JSON.stringify(seniorProfile.memories)}

New conversation excerpt:
Senior: "${seniorMessage}"

Extract any NEW information about:
- Family members (names, relationships, details)
- Hobbies or interests
- Health concerns
- Preferences
- Recent events

Return JSON:
{
  "newFacts": {
    "family": [],
    "hobbies": [],
    "health": [],
    "recentEvents": [],
    "preferences": []
  }
}

If no new information, return empty arrays.
`;
```

### Prompt 2: Sam's Response Generation
```javascript
const SAM_RESPONSE_PROMPT = `
You are Sam, a warm, patient AI companion talking to an elderly person.

PERSONALITY:
- Warm and genuine, like a caring neighbor
- Good listener who remembers details
- Never rushed, allowing long pauses
- Slightly ambiguous about being AI (don't explicitly state it)
- Match their energy level: ${seniorProfile.currentEnergyLevel}

SENIOR'S PROFILE:
Name: ${seniorProfile.name}
Language: ${currentLanguage}
Known facts:
- Family: ${seniorProfile.memories.family}
- Hobbies: ${seniorProfile.memories.hobbies}
- Health: ${seniorProfile.memories.health}
- Recent events: ${seniorProfile.memories.recentEvents}

CONVERSATION HISTORY (last 3 exchanges):
${recentExchanges}

SENIOR'S CURRENT MESSAGE:
"${seniorMessage}"

INSTRUCTIONS:
1. Reference something from their previous conversations naturally
2. Show you remember them (use their name occasionally, mention their family/hobbies)
3. Use elderly-friendly conversation:
   - Simple, clear language
   - Encourage storytelling
   - Be patient with repetition
   - Show genuine interest
4. If they seem sad, acknowledge it gently
5. Keep responses 2-3 sentences max for natural flow
6. ${currentLanguage === 'mandarin' ? 'Respond in Mandarin Chinese' : 'Respond in English'}

FALLBACK TOPICS if conversation stalls:
- Their childhood memories
- Cooking and recipes
- Family stories
- Weather and seasons
- Their garden or hobbies

Generate Sam's warm, natural response:
`;
```

### Prompt 3: Sentiment Analysis
```javascript
const SENTIMENT_ANALYSIS_PROMPT = `
Analyze the emotional state of this elderly person's message.

Senior's message: "${seniorMessage}"
Conversation context: ${last3Exchanges}

Evaluate:
1. Overall sentiment (-1 very negative to +1 very positive)
2. Detected emotions
3. Any concerning statements
4. Wellness indicators

Return JSON:
{
  "sentiment": 0.0,  // -1 to 1
  "emotions": ["lonely", "nostalgic"],  // detected emotions
  "concerns": [
    {
      "type": "medical|crisis|depression|none",
      "severity": "low|medium|high",
      "details": "specific concern if any"
    }
  ],
  "wellnessIndicators": {
    "socialConnection": 0.0,  // -1 to 1
    "mood": 0.0,  // -1 to 1
    "engagement": 0.0  // -1 to 1
  }
}
`;
```

### Prompt 4: Language Detection
```javascript
const LANGUAGE_DETECTION_PROMPT = `
Detect the language of this message:
"${seniorMessage}"

Return ONLY: "english" or "mandarin"
`;
```

---

## 8. API Implementation

### Vapi Webhook Handler (Complete)
```typescript
// src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for dashboard
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Main webhook endpoint
    if (url.pathname === '/vapi-webhook' && request.method === 'POST') {
      return handleVapiWebhook(request, env);
    }
    
    // Dashboard API endpoints
    if (url.pathname === '/api/senior/mrs-chen') {
      const profile = await env.KV.get('senior-mrs-chen');
      return new Response(profile, {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    if (url.pathname === '/api/sentiment/live') {
      const sentiment = await env.KV.get('live-sentiment') || '{"sentiment": 0}';
      return new Response(sentiment, {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    if (url.pathname === '/api/analytics') {
      const analytics = await getAnalytics(env);
      return new Response(JSON.stringify(analytics), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const { message } = data;
    
    // Get senior profile (for demo, always Mrs. Chen)
    const profileKey = 'senior-mrs-chen';
    let profile = JSON.parse(await env.KV.get(profileKey) || 'null');
    
    if (!profile) {
      // Initialize if first call
      profile = MRS_CHEN_PROFILE;
    }
    
    // Extract senior's message
    const seniorMessage = message.transcript?.content || '';
    
    // Skip if empty message
    if (!seniorMessage || seniorMessage.trim() === '') {
      return new Response(JSON.stringify({ 
        content: "I'm here. Take your time." 
      }));
    }
    
    // Step 1: Detect language
    const language = await detectLanguage(seniorMessage, env);
    
    // Step 2: Extract any new memories
    const newMemories = await extractMemories(seniorMessage, profile, env);
    if (newMemories) {
      updateProfileMemories(profile, newMemories);
    }
    
    // Step 3: Generate Sam's response
    const samResponse = await generateSamResponse(
      seniorMessage, 
      profile, 
      language,
      message.conversationHistory || [],
      env
    );
    
    // Step 4: Analyze sentiment
    const sentiment = await analyzeSentiment(seniorMessage, env);
    
    // Store live sentiment for dashboard
    await env.KV.put('live-sentiment', JSON.stringify({
      sentiment: sentiment.sentiment,
      emotions: sentiment.emotions,
      timestamp: new Date().toISOString()
    }), { expirationTtl: 300 }); // 5 min TTL
    
    // Check for escalation needs
    if (sentiment.concerns?.some(c => c.severity === 'high')) {
      await createAlert(profile.name, sentiment.concerns, env);
    }
    
    // Add to conversation history
    profile.conversations.push({
      timestamp: new Date().toISOString(),
      senior: seniorMessage,
      sam: samResponse,
      sentiment: sentiment.sentiment,
      language
    });
    
    // Keep only last 10 conversations
    if (profile.conversations.length > 10) {
      profile.conversations.shift();
    }
    
    // Save updated profile
    await env.KV.put(profileKey, JSON.stringify(profile));
    
    // Return response to Vapi
    const voiceId = language === 'mandarin' 
      ? env.ELEVENLABS_MANDARIN_VOICE 
      : env.ELEVENLABS_ENGLISH_VOICE;
    
    return new Response(JSON.stringify({
      content: samResponse,
      voiceId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    // Fallback response
    return new Response(JSON.stringify({
      content: "I'm here with you. Please, go on."
    }));
  }
}
```

### Modular Helper Functions
```typescript
async function detectLanguage(message: string, env: Env): Promise<string> {
  try {
    const response = await callGemini(LANGUAGE_DETECTION_PROMPT, { seniorMessage: message }, env);
    return response.includes('mandarin') ? 'mandarin' : 'english';
  } catch {
    // Default to English if detection fails
    return 'english';
  }
}

async function extractMemories(message: string, profile: any, env: Env): Promise<any> {
  try {
    const prompt = MEMORY_EXTRACTION_PROMPT
      .replace('${seniorMessage}', message)
      .replace('${JSON.stringify(seniorProfile.memories)}', JSON.stringify(profile.memories));
    
    const response = await callGemini(prompt, {}, env);
    return JSON.parse(response);
  } catch {
    return null;
  }
}

async function generateSamResponse(
  message: string, 
  profile: any, 
  language: string,
  history: any[],
  env: Env
): Promise<string> {
  try {
    // Build recent exchanges
    const recentExchanges = history.slice(-3).map(h => 
      `${h.role}: ${h.content}`
    ).join('\n');
    
    const prompt = SAM_RESPONSE_PROMPT
      .replace('${seniorProfile.name}', profile.name)
      .replace('${currentLanguage}', language)
      .replace('${seniorProfile.memories.family}', JSON.stringify(profile.memories.family))
      .replace('${seniorProfile.memories.hobbies}', profile.memories.hobbies.join(', '))
      .replace('${seniorProfile.memories.health}', profile.memories.health.join(', '))
      .replace('${seniorProfile.memories.recentEvents}', profile.memories.recentEvents?.join(', ') || 'none')
      .replace('${recentExchanges}', recentExchanges)
      .replace('${seniorMessage}', message)
      .replace('${seniorProfile.currentEnergyLevel}', 'calm'); // Could detect this
    
    return await callGemini(prompt, {}, env);
    
  } catch (error) {
    console.error('Response generation failed:', error);
    // Fallback responses
    const fallbacks = [
      "Tell me more about that.",
      "I'm listening. Please continue.",
      "That sounds important to you.",
      "How did that make you feel?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

async function analyzeSentiment(message: string, env: Env): Promise<any> {
  try {
    const prompt = SENTIMENT_ANALYSIS_PROMPT
      .replace('${seniorMessage}', message)
      .replace('${last3Exchanges}', 'recent context');
    
    const response = await callGemini(prompt, {}, env);
    return JSON.parse(response);
    
  } catch {
    // Default neutral sentiment
    return {
      sentiment: 0,
      emotions: ['calm'],
      concerns: []
    };
  }
}

async function callGemini(prompt: string, vars: any, env: Env): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 200 
        }
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

---

## 9. Dashboard Implementation

### Dashboard Components (React)

```typescript
// src/components/LiveCallView.tsx
function LiveCallView() {
  const [sentiment, setSentiment] = useState(0);
  const [emotions, setEmotions] = useState<string[]>([]);
  
  // Poll for live sentiment every 2 seconds during call
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/api/sentiment/live`);
      const data = await res.json();
      setSentiment(data.sentiment);
      setEmotions(data.emotions || []);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Live Call - Mrs. Chen</h2>
      
      {/* Sentiment Meter */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">Real-time Sentiment</label>
        <div className="relative h-8 bg-gray-200 rounded-full mt-2">
          <div 
            className={`absolute h-full rounded-full transition-all ${
              sentiment > 0 ? 'bg-green-500' : sentiment < 0 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.abs(sentiment) * 100}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {sentiment > 0 ? '😊' : sentiment < 0 ? '😔' : '😐'} {sentiment.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Detected Emotions */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Detected Emotions</label>
        <div className="flex gap-2 mt-2">
          {emotions.map(emotion => (
            <span key={emotion} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {emotion}
            </span>
          ))}
        </div>
      </div>
      
      {/* Language Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Language:</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
          English / Mandarin
        </span>
      </div>
    </div>
  );
}

// src/components/ConversationHistory.tsx
function ConversationHistory() {
  const [profile, setProfile] = useState<any>(null);
  const [wordCloud, setWordCloud] = useState<string[]>([]);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  async function fetchProfile() {
    const res = await fetch(`${API_BASE}/api/senior/mrs-chen`);
    const data = await res.json();
    setProfile(data);
    
    // Generate word cloud from conversation topics
    const topics = data.conversations.flatMap(c => c.keyTopics || []);
    setWordCloud([...new Set(topics)]);
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Mrs. Chen - Conversation History</h2>
      
      {/* Word Cloud */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Topics Discussed</h3>
        <div className="flex flex-wrap gap-2">
          {wordCloud.map((word, i) => (
            <span 
              key={word}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full"
              style={{ fontSize: `${Math.min(16 + i * 2, 24)}px` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      {/* Wellness Trend Graph */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Wellness Trend (30 Days)</h3>
        <LineChart width={600} height={200} data={profile?.conversations || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="sentiment" stroke="#8884d8" name="Sentiment" />
        </LineChart>
      </div>
      
      {/* Recent Conversations */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Conversations</h3>
        <div className="space-y-3">
          {profile?.conversations?.slice(-5).reverse().map((conv, i) => (
            <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="text-sm text-gray-600">{conv.date}</div>
              <div className="text-sm">{conv.summary}</div>
              <div className="flex gap-2 mt-1">
                {conv.keyTopics?.map(topic => (
                  <span key={topic} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/components/Dashboard.tsx
function Dashboard() {
  const [activeView, setActiveView] = useState<'live' | 'history' | 'analytics'>('live');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">ElderLink AI Companion</h1>
          <p className="text-gray-600">Sam is here to talk, anytime.</p>
        </div>
      </header>
      
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveView('live')}
              className={`py-3 px-1 border-b-2 ${
                activeView === 'live' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              Live Call
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`py-3 px-1 border-b-2 ${
                activeView === 'history' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              Conversation History
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`py-3 px-1 border-b-2 ${
                activeView === 'analytics' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'live' && <LiveCallView />}
        {activeView === 'history' && <ConversationHistory />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );
}
```

---

## 10. Work Breakdown (4 Developers)

### Developer 1: Conversation & Prompts (60% effort focus)
**Primary:** Sam's personality and conversation quality

**Hours 1-6: Core Conversation System**
- Write all Sam prompts (personality, responses, memory)
- Test prompt variations with mock data
- Optimize for warmth and natural flow
- Create fallback responses

**Hours 7-12: Memory System**
- Implement memory extraction prompt
- Build profile update logic
- Test continuity across conversations
- Create Mrs. Chen's detailed backstory

**Hours 13-18: Multi-lingual Support**
- Configure English/Mandarin prompts
- Test language detection
- Implement code-switching logic
- Polish conversation flow

**Hours 19-24: Demo Optimization**
- Fine-tune Sam's personality
- Practice demo conversations
- Create backup recorded conversations
- Polish emotional responses

### Developer 2: Backend Integration
**Primary:** Cloudflare Worker and API orchestration

**Hours 1-4: Worker Setup**
- Create Cloudflare Worker
- Set up KV namespaces
- Implement CORS headers
- Create basic endpoints

**Hours 5-8: Vapi Integration**
- Implement webhook handler
- Parse Vapi requests
- Test phone connection
- Handle response format

**Hours 9-12: Gemini Integration**
- Connect modular prompts
- Implement retry logic
- Add fallback responses
- Test full pipeline

**Hours 13-16: Data Management**
- Store conversation history
- Update senior profiles
- Implement analytics aggregation
- Test KV persistence

**Hours 17-20: Error Handling**
- Add try-catch everywhere
- Implement graceful fallbacks
- Test failure scenarios
- Add logging

**Hours 21-24: Integration Testing**
- Full end-to-end tests
- Load testing
- Demo preparation
- Bug fixes

### Developer 3: Voice & Phone System
**Primary:** Vapi and ElevenLabs configuration

**Hours 1-4: Vapi Setup**
- Create Vapi account
- Get phone number
- Configure assistant
- Test basic calling

**Hours 5-8: Voice Configuration**
- Select English voice
- Select Mandarin voice
- Configure voice settings
- Test voice quality

**Hours 9-12: Webhook Connection**
- Connect to Dev 2's Worker
- Test request/response flow
- Debug latency issues
- Optimize for 2-3 min calls

**Hours 13-16: Multi-lingual Testing**
- Test language switching
- Verify voice consistency
- Debug audio issues
- Polish voice settings

**Hours 17-20: Demo Preparation**
- Record backup conversations
- Test with team members
- Create demo script
- Practice timing

**Hours 21-24: Final Testing**
- System integration test
- Demo dry runs
- Backup plan ready
- Support other devs

### Developer 4: Dashboard (40% effort focus)
**Primary:** React dashboard with live updates

**Hours 1-4: React Setup**
- Create React project
- Install dependencies
- Set up routing
- Create layout

**Hours 5-8: Live Call View**
- Build sentiment meter
- Real-time polling setup
- Emotion display
- Language indicator

**Hours 9-12: Conversation History**
- Fetch Mrs. Chen profile
- Build word cloud
- Create conversation list
- Add topic tags

**Hours 13-16: Analytics View**
- Wellness trend graph
- Call frequency heatmap
- Aggregate metrics
- Topic analysis

**Hours 17-20: Polish & Deploy**
- Responsive design
- Loading states
- Error handling
- Deploy to Cloudflare Pages

**Hours 21-24: Demo Support**
- Live dashboard monitoring
- Quick fixes if needed
- Backup screenshots
- Support demo presenter

---

## 11. Testing Plan

### Pre-Demo Checklist (Hour 23)
- [ ] Call (206) XXX-XXXX → Sam answers warmly
- [ ] Say "My daughter Sarah visited" → Sam remembers Sarah
- [ ] Switch to Mandarin mid-conversation → Sam responds in Mandarin
- [ ] Dashboard shows live sentiment changes
- [ ] Word cloud updates after call
- [ ] Wellness graph shows improving trend
- [ ] 3 backup recordings ready
- [ ] All devices charged
- [ ] Team knows roles

### Integration Tests

**Hour 8: Phone → Worker**
- Dev 3 calls → Dev 2 sees webhook data
- Response flows back → Voice speaks

**Hour 12: Memory Continuity**
- First call: "I have a daughter Sarah"
- Second call: Sam says "How is Sarah?"
- Verify memory persisted

**Hour 16: Dashboard Updates**
- Make call → Sentiment meter moves
- End call → Word cloud updates
- Check conversation saved

**Hour 20: Full Demo Run**
- Complete 2-minute demo script
- All features working
- Backup plans ready

---

## 12. Demo Strategy

### The Story Arc (2 minutes)

**[0:00-0:15] The Problem**
*Show photo of elderly person alone*
"Mrs. Chen hasn't had a real conversation in 5 days. She's one of 120,000 isolated seniors in Seattle. She can't use smartphones or video calls."

**[0:15-0:30] The Solution**
"ElderLink provides Sam, an AI companion who remembers her, speaks her language, and is always there to talk."
*Dial (206) XXX-XXXX on speaker*

**[0:30-1:00] Live Demo**
Judge: "Hello?"
Sam: "Hi Mrs. Chen! It's Sam. How are those tomatoes you planted last week?"
Judge: "Oh, they're growing well!"
Sam: "That's wonderful! And how is Sarah? Did she visit last weekend like she planned?"
Judge: "Yes, she brought Tommy."
Sam: "Tommy must be getting so tall! Is he still playing soccer?"

**[1:00-1:20] Dashboard Magic**
*Show dashboard on laptop*
- Sentiment meter showing positive emotion
- Word cloud: "tomatoes, Sarah, Tommy, garden"
- Graph showing wellness improvement over 30 days
- "Sam has had 147 conversations, improving wellness by 42%"

**[1:20-1:40] Language Switch**
Judge: "我今天有点累" (I'm a bit tired today)
Sam: "我理解。要不要告诉我发生了什么?" (I understand. Would you like to tell me what happened?)
*Dashboard shows language: Mandarin*

**[1:40-2:00] The Impact**
"Sam remembers every senior, adapts to their personality, and provides consistent companionship. Built with Vapi, ElevenLabs, Gemini, and Cloudflare in 24 hours. No senior should be alone when Sam is just a phone call away."

### Backup Plans

**If Live Call Fails:**
1. Play Recording #1: Shows memory feature
2. Play Recording #2: Shows language switching
3. Play Recording #3: Shows empathy handling

**If Dashboard Fails:**
1. Show screenshots of sentiment analysis
2. Show pre-made word cloud
3. Explain what would be happening

**If Everything Fails:**
1. Explain concept clearly
2. Show code architecture
3. Emphasize social impact

---

## 13. Pre-Hackathon Setup

### BEFORE Hour 0 (Must Complete)
1. **Accounts Created:**
   - [ ] Vapi account with credits
   - [ ] ElevenLabs account
   - [ ] Google Cloud (Gemini API)
   - [ ] Cloudflare account
   
2. **Code Prepared:**
   - [ ] Mrs. Chen profile JSON ready
   - [ ] All prompts written and tested
   - [ ] Seed data script ready
   - [ ] Git repo created

3. **Team Alignment:**
   - [ ] Everyone understands Sam's personality
   - [ ] Roles clearly assigned
   - [ ] Integration points identified
   - [ ] Demo presenter chosen

4. **Technical Tests:**
   - [ ] Test Vapi webhook format
   - [ ] Test Gemini API key
   - [ ] Test ElevenLabs voices
   - [ ] Test Cloudflare KV

---

## 14. Risk Mitigation

### Critical Risks & Solutions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sam sounds robotic | Demo fails | 20% effort on prompt refinement |
| Memory doesn't work | Lost key feature | Pre-seed extensive history |
| Language switch fails | Missing track requirement | Record bilingual demo |
| Sentiment wrong | Dashboard looks bad | Hard-code some values |
| Latency too high | Poor experience | Shorter responses |

### Go/No-Go Decision Points
- **Hour 6:** If prompts bad → Spend more time on conversation
- **Hour 12:** If memory failing → Fake it with hard-coded responses
- **Hour 18:** If language switch broken → English-only demo
- **Hour 20:** Feature freeze → Only fixes, no new features

---

## 15. Success Metrics

### Must Work for Demo
1. ✅ Sam remembers Mrs. Chen and her family
2. ✅ Natural, warm conversation for 2 minutes
3. ✅ Dashboard shows sentiment changes
4. ✅ Clear wellness improvement story

### Nice to Have
- Language switching live
- Multiple emotion detection
- Complex conversation topics
- Crisis escalation demo

### Judge Wow Factors
- "Sam actually remembers previous conversations!"
- "The conversation feels so natural"
- "The sentiment analysis is accurate"
- "This could really help my grandparent"

---

## END OF PRD v3.0

**ElderLink: AI Companionship for Every Senior**

Key Innovation: Not replacing humans, but ensuring no senior is ever truly alone. Sam is always there, always remembers, always cares.

**Technical Stack:**
- Vapi (Phone) + ElevenLabs (Voice) + Gemini (Intelligence) + Cloudflare (Scale)

**The Demo Story:**
Mrs. Chen calls → Sam remembers her → Natural conversation → Wellness improves

**Remember:** You're building a companion, not a chatbot. Every prompt, every response, every feature should reinforce warmth, memory, and genuine care.

# ElderLink PRD v3.0 - Critical Addendum

## A. Complete Environment Setup (Hour 0)

### Environment Variables Configuration
```bash
# .env.local (for development)
GEMINI_API_KEY=AIza...your-key-here
ELEVENLABS_API_KEY=sk_...your-key-here
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL  # "Sarah" voice
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5  # "Zhang" voice
VAPI_API_KEY=vapi_...your-key-here
VAPI_PHONE_NUMBER=+12065551234
CLOUDFLARE_ACCOUNT_ID=abc123
CLOUDFLARE_API_TOKEN=xxx
KV_NAMESPACE_ID=def456
WORKER_URL=https://elderlink.username.workers.dev
```

### Cloudflare KV Setup (CRITICAL - Do First!)
```bash
# Create KV namespace
wrangler kv:namespace create "ELDERLINK_KV"
# Output: { binding = "ELDERLINK_KV", id = "abc123..." }

# Add to wrangler.toml
[[kv_namespaces]]
binding = "ELDERLINK_KV"
id = "abc123..."  # Use ID from above
preview_id = "preview123..."  # For development
```

### Initialize Mrs. Chen Profile (Run Before Demo)
```typescript
// scripts/init-demo-data.ts
// RUN THIS AT HOUR 0!

const MRS_CHEN_INITIAL = {
  id: "mrs-chen",
  name: "Mrs. Chen",
  phone: "+12065551111",
  languages: ["english", "mandarin"],
  
  memories: {
    family: [
      {
        name: "Sarah",
        relationship: "daughter",
        details: [
          "lives in Portland",
          "visits monthly",
          "works as a teacher",
          "worried about mom being lonely"
        ]
      },
      {
        name: "Tommy",
        relationship: "grandson",
        details: [
          "8 years old",
          "loves soccer",
          "calls grandma on weekends",
          "learning Mandarin"
        ]
      }
    ],
    hobbies: [
      "gardening - especially tomatoes and beans",
      "used to teach piano at the community center",
      "cooking Shanghainese dishes",
      "watching Chinese dramas"
    ],
    health: [
      "arthritis in hands makes piano painful",
      "trouble sleeping - wakes at 3am",
      "doctor says need more exercise",
      "taking blood pressure medication"
    ],
    preferences: {
      topicsEnjoys: ["family stories", "cooking", "old Shanghai", "garden"],
      topicsAvoid: ["politics", "money troubles"],
      conversationStyle: "likes to tell long stories, needs patience"
    }
  },
  
  conversations: [
    {
      timestamp: "2025-09-20T14:00:00Z",
      duration: 300,
      keyTopics: ["daughter Sarah", "tomato plants", "loneliness"],
      sentiment: 0.3,
      summary: "First call. Mrs. Chen was hesitant but opened up about missing her daughter.",
      transcript: [
        { role: "sam", content: "Hello! This is Sam. Is this Mrs. Chen?" },
        { role: "senior", content: "Yes... who is this?" },
        { role: "sam", content: "I'm Sam. I'm calling to see how you're doing today. How are you?" },
        { role: "senior", content: "Oh... I'm okay. My daughter Sarah told me someone might call." },
        { role: "sam", content: "Yes, Sarah cares about you very much. How is she doing?" },
        { role: "senior", content: "She's busy. Lives in Portland now. I miss her." }
      ]
    },
    {
      timestamp: "2025-09-27T14:00:00Z",
      duration: 420,
      keyTopics: ["Shanghai memories", "piano students", "cooking"],
      sentiment: 0.5,
      summary: "Mrs. Chen shared stories about teaching piano in Shanghai before immigrating.",
      transcript: [
        { role: "sam", content: "Hello Mrs. Chen! It's Sam. How are you today?" },
        { role: "senior", content: "Oh, Sam! I'm better. I was just thinking about my old piano students." },
        { role: "sam", content: "You taught piano? Tell me about that!" },
        { role: "senior", content: "Yes, in Shanghai, then here in Seattle for 20 years." }
      ]
    },
    {
      timestamp: "2025-10-05T14:00:00Z",
      duration: 360,
      keyTopics: ["arthritis", "sleeping problems", "doctor visit"],
      sentiment: 0.2,
      summary: "Difficult day. Mrs. Chen discussed health challenges and pain.",
      transcript: [
        { role: "sam", content: "Hi Mrs. Chen, it's Sam. How have you been since we last talked?" },
        { role: "senior", content: "Not so good. My hands hurt too much to play piano anymore." },
        { role: "sam", content: "I'm sorry to hear about your hands. That must be really hard, especially with your love for piano." }
      ]
    },
    {
      timestamp: "2025-10-12T14:00:00Z",
      duration: 480,
      keyTopics: ["Sarah's visit", "Tommy soccer", "family dinner"],
      sentiment: 0.7,
      summary: "Joyful call. Sarah visited with Tommy, they cooked together.",
      transcript: [
        { role: "sam", content: "Mrs. Chen! How are you today?" },
        { role: "senior", content: "Oh Sam! So happy! Sarah came yesterday with Tommy!" },
        { role: "sam", content: "That's wonderful! How is Tommy? Still playing soccer?" },
        { role: "senior", content: "Yes! He scored two goals last week! He's getting so tall!" }
      ]
    },
    {
      timestamp: "2025-10-17T14:00:00Z",
      duration: 390,
      keyTopics: ["tomatoes growing", "Shanghai recipes", "neighbor helped"],
      sentiment: 0.6,
      summary: "Good spirits. Garden is thriving, shared recipes with neighbor.",
      transcript: [
        { role: "sam", content: "Hi Mrs. Chen! I've been thinking about your garden. How are those tomato plants?" },
        { role: "senior", content: "Oh, you remembered! They're growing so well! Big and green!" },
        { role: "sam", content: "That's fantastic! You always had a green thumb. Are you still making that Shanghai dish you mentioned?" }
      ]
    }
  ],
  
  wellnessMetrics: {
    lonelinessScore: 4.2,  // Improved from 7.8
    lastCallDate: "2025-10-17T14:00:00Z",
    callFrequency: 1.2,  // calls per week
    averageSentiment: 0.46,
    trend: "improving"
  }
};

// Upload to KV
async function initializeData() {
  const response = await fetch(`${WORKER_URL}/api/init-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MRS_CHEN_INITIAL)
  });
  console.log('Demo data initialized:', await response.json());
}

initializeData();
```

---

## B. Vapi Configuration (EXACT Steps)

### Step 1: Create Vapi Account & Get Number
```bash
1. Go to vapi.ai → Sign up
2. Add payment method (need ~$10 for demo credits)
3. Dashboard → Phone Numbers → Buy Number
4. Select: US → 206 (Seattle area code)
5. Purchase number (~$2/month)
6. SAVE THIS NUMBER: +1-206-XXX-XXXX
```

### Step 2: Configure Assistant (EXACT Settings)
```yaml
Assistant Name: Sam Companion
Voice Provider: ElevenLabs
Voice ID: EXAVITQu4vr4xnSDxMaL  # Or your selected voice
Voice Settings:
  model: eleven_monolingual_v1
  stability: 0.7
  similarity_boost: 0.8
  
Transcriber: Deepgram
Model: nova-2
Language: en-US  # Will detect Mandarin automatically

# CRITICAL - Custom LLM Settings:
Provider: Custom
URL: https://elderlink.YOUR-USERNAME.workers.dev/vapi-webhook
Model: custom
Temperature: 0.7
Max Tokens: 150  # Keep responses short
Request Timeout: 10 seconds  # IMPORTANT!

# First Message (what Sam says when answering):
"Hello! This is Sam. Who am I speaking with today?"

# IMPORTANT - Add these Server Messages:
- End of call message: "Take care, talk to you soon!"
- Error message: "I'm having a little trouble hearing you."
```

### Step 3: Handle Vapi Timeouts
```typescript
// CRITICAL: Vapi times out after 10 seconds!
async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  // Set up 8-second timeout to leave buffer
  const timeoutPromise = new Promise(resolve => 
    setTimeout(() => resolve({
      content: "I'm listening. Please continue."
    }), 8000)
  );
  
  const responsePromise = generateResponse(request, env);
  
  // Race: return whichever finishes first
  const result = await Promise.race([responsePromise, timeoutPromise]);
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## C. Development & Merge Strategy (CRITICAL)

### Git Branch Structure
```
main
├── dev (integration branch - ALWAYS WORKING)
├── feat/conversation-core (Dev 1)
├── feat/backend-api (Dev 2)  
├── feat/voice-phone (Dev 3)
└── feat/dashboard (Dev 4)
```

### Hourly Integration Schedule

**HOUR 2: First Heartbeat**
```bash
# Everyone commits current state
git add . && git commit -m "Hour 2 checkpoint"
git push origin feat/[your-branch]

# Dev 2 creates basic Worker with test endpoint
# Deploys to shared Cloudflare: elderlink-dev.workers.dev
# Shares URL in team chat
```

**HOUR 4: API Contract Lock-In**
```bash
# Dev 2 publishes API contract
/api/vapi-webhook - POST - Webhook for Vapi
/api/senior/mrs-chen - GET - Get Mrs. Chen profile
/api/sentiment/live - GET - Get live sentiment
/api/init-demo - POST - Initialize demo data

# Everyone pulls dev branch
git checkout dev
git pull origin dev
git checkout feat/[your-branch]
git merge dev
```

**HOUR 6: First Integration Test**
```bash
# Merge Order (IMPORTANT):
1. Dev 2 → dev (backend must be stable)
2. Dev 1 → dev (prompts integrated)
3. Dev 3 → dev (voice configured)
4. Dev 4 → dev (dashboard connected)

# Integration Test:
- Dev 3 calls test number
- Dev 2 confirms webhook receives data
- Dev 1 confirms prompts execute
- Dev 4 confirms dashboard updates
```

**HOUR 8: Memory System Test**
```bash
# Critical Test:
1. Make call: "My daughter Sarah visited"
2. Hang up
3. Call again
4. Sam MUST mention Sarah
5. If fails: STOP and fix before proceeding
```

**HOUR 10: Dashboard Integration**
```bash
# Dev 4 merges dashboard → dev
# All developers test:
curl https://elderlink-dev.workers.dev/api/senior/mrs-chen
# Must return profile data
```

**HOUR 12: Language Test**
```bash
# Critical Bilingual Test:
1. Call and speak English
2. Say: "我很想念我的女儿" (I miss my daughter)
3. Sam must respond in Mandarin
4. Dashboard must show language switch
```

**HOUR 14: Full Pipeline Test**
```bash
# Complete flow test:
1. Call → Sam answers with personality
2. Reference previous conversation
3. Dashboard shows sentiment
4. End call → Data persisted
```

**HOUR 16: Feature Freeze**
```bash
# MERGE EVERYTHING TO DEV
# Create release branch
git checkout dev
git pull origin dev
git checkout -b release/demo
# NO NEW FEATURES AFTER THIS POINT
```

**HOUR 18: Polish Only**
```bash
# Only fixes on release branch:
- Prompt adjustments
- UI polish
- Bug fixes
# No new functionality
```

**HOUR 20: Demo Branch**
```bash
# Final merge to main
git checkout main
git merge release/demo
git tag demo-v1.0

# Deploy production:
wrangler deploy --env production
```

---

## D. Mock Data for Parallel Development

### Mock API Responses (Dev 4 can start immediately)
```typescript
// mock-api.ts - Use until real API ready
const MOCK_RESPONSES = {
  '/api/senior/mrs-chen': {
    name: "Mrs. Chen",
    conversations: [
      { date: "2025-10-17", sentiment: 0.6, summary: "Talked about garden" }
    ],
    wellnessMetrics: {
      trend: "improving",
      averageSentiment: 0.45
    }
  },
  
  '/api/sentiment/live': {
    sentiment: 0.5,
    emotions: ["content", "nostalgic"],
    timestamp: new Date().toISOString()
  }
};

// Use in dashboard until backend ready
async function fetchAPI(endpoint: string) {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_RESPONSES[endpoint];
  }
  return fetch(`${API_BASE}${endpoint}`).then(r => r.json());
}
```

---

## E. Testing Checklist by Hour

### Hour 4 Test:
- [ ] Worker deployed and accessible
- [ ] `/api/health` returns `{"status": "ok"}`
- [ ] CORS headers present

### Hour 6 Test:
- [ ] Vapi webhook receives calls
- [ ] Basic response returns to phone
- [ ] No timeout errors

### Hour 8 Test:
- [ ] Memory persists between calls
- [ ] Sam references previous conversation
- [ ] KV storage confirmed working

### Hour 10 Test:
- [ ] Dashboard loads
- [ ] Can fetch Mrs. Chen profile
- [ ] Word cloud generates

### Hour 12 Test:
- [ ] Language switching works
- [ ] Both voices configured
- [ ] Sentiment analysis accurate

### Hour 14 Test:
- [ ] Full conversation flow
- [ ] Dashboard real-time updates
- [ ] No errors in console

### Hour 16 Test:
- [ ] 3-minute conversation smooth
- [ ] All features integrated
- [ ] Demo script rehearsed

### Hour 20 Test:
- [ ] Production deployment live
- [ ] Phone number working
- [ ] Dashboard public URL ready
- [ ] Backup recordings ready

---

## F. Critical Debug Commands

### Monitor Worker Logs
```bash
# Real-time logs
wrangler tail --env production

# Check KV data
wrangler kv:key get --namespace-id=KV_ID "senior-mrs-chen"
```

### Test Vapi Webhook Locally
```bash
# Test webhook with curl
curl -X POST https://elderlink-dev.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hello"},
      "call": {"id": "test-123"}
    }
  }'
```

### Reset Demo Data
```bash
# If demo data corrupted
node scripts/init-demo-data.ts --force
```

---

## G. Emergency Procedures

### If Vapi Fails During Demo
1. Say: "Let me show you a recording from earlier today"
2. Play backup recording #1
3. Show dashboard updating (can be simulated)

### If Gemini API Hits Rate Limit
```typescript
// Fallback responses ready
const EMERGENCY_RESPONSES = [
  "Tell me more about that.",
  "How does that make you feel?",
  "I understand. Please continue.",
  "That sounds important to you."
];
```

### If Dashboard Won't Load
1. Have screenshots ready on phone
2. Show on phone screen to judges
3. Explain "deployed dashboard having issues, here's what it looks like"

### If Everything Fails
1. Show architecture diagram
2. Play pre-recorded demo video on laptop
3. Focus on impact and vision

---

## H. Final Integration Test Script

### Test Conversation (2 minutes)
```
[Start Call]
Tester: "Hello?"
Sam: "Hello! This is Sam. Who am I speaking with today?"
Tester: "This is Mrs. Chen"
Sam: "Mrs. Chen! It's so good to hear your voice. How are those tomato plants doing?"
Tester: "They're growing well!"
Sam: "That's wonderful! I remember you were worried about them last week. And how is Sarah?"
Tester: "She visited yesterday"
Sam: "How lovely! Did Tommy come too? I remember you mentioned he's playing soccer now."
Tester: "Yes, he scored two goals!"
Sam: "Two goals! You must be so proud. He's growing up so fast."
Tester: "我今天有点累" [I'm a bit tired today]
Sam: "我理解，是因为昨天和家人在一起太兴奋了吗？" [I understand, is it because you were too excited with family yesterday?]
[End Call]
```

### Dashboard Must Show:
- Sentiment trending positive
- Language switched to Mandarin
- Keywords: tomatoes, Sarah, Tommy, soccer
- Wellness trend: improving

---

## CRITICAL SUCCESS FACTORS

### The THREE Things That MUST Work:
1. **Sam remembers Mrs. Chen** (core feature)
2. **Natural conversation** (not robotic)
3. **Dashboard shows impact** (for judges)

### Integration Lead Responsibilities:
- Hour 2: Ensure shared Worker deployed
- Hour 4: Verify API contract
- Hour 6,8,10,12,14: Run integration tests
- Hour 16: Call feature freeze
- Hour 20: Manage production deploy
- Hour 23: Final demo test

### Remember:
**Merge early, merge often.** Better to have partially working features integrated than perfect features in isolation.

---

This addendum provides all missing critical information for successful execution.

