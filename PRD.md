# Product Requirements Document: ElderLink AI Companion

**Version:** 4.0 - Holistic Elder Care Edition
**Date:** January 2025
**Project Type:** 24-Hour Hackathon
**Team Size:** 4 Developers + 1 Integration Lead
**Target Demo Time:** 3 minutes

---

## 1. Executive Summary

### Problem Statement
Seattle has 120,000+ seniors, 40% living alone. Social isolation increases mortality risk by 26%, while health issues go unmonitored between doctor visits. Many immigrant seniors don't speak English well, can't use technology, and have no local connections in similar life stages. Loneliness, declining physical health, and social isolation are interconnected crises killing our elderly.

### Solution: Holistic Elder Care Platform
**ElderLink** provides "Sam," an AI companion accessible by phone that addresses three dimensions of senior wellness:

1. **Mental Health** - Warm conversations with memory and empathy
2. **Physical Health** - Natural health monitoring integrated with medical records
3. **Social Health** - Community matching to build human connections

### Key Innovation
We're not replacing humans or doctors. We're bridging gaps: between doctor visits, between family calls, and between isolated seniors. Sam monitors, connects, and cares—transforming AI companionship into a gateway for both better health tracking and real human friendships.

### Value Proposition
**"One AI companion, three transformations"**
- Conversations that improve mental wellbeing
- Health insights that inform medical care
- Matches that create lasting community bonds

---

## 2. Goals & Success Criteria

### Primary Goals (ALL Must Work for Demo)
1. ✅ **Sam AI Companion** - Warm, persistent personality accessible by phone
2. ✅ **Conversation Memory** - Sam remembers previous conversations and personal details
3. ✅ **Natural Wellness Tracking** - Monitor emotional state through conversation
4. ✅ **Health Integration** - Track physical wellbeing and update patient portal
5. ✅ **Community Matching** - Connect seniors with similar interests for groups

### Success Criteria (Demo Requirements)
- ✅ Live phone call where Sam remembers "Mrs. Chen" from previous conversations
- ✅ Sam proactively checks on Mrs. Chen's physical health (medication, symptoms)
- ✅ Dashboard shows real-time sentiment during call
- ✅ Health notes automatically created in mock MyChart system
- ✅ Community tab displays 3 compatible senior matches with suggested groups
- ✅ Natural, warm conversation that doesn't feel robotic (<3 seconds response time)
- ✅ Seamless English/Mandarin language switching
- ✅ Holistic wellness score combining mental, physical, and social metrics

### Out of Scope
❌ Real MyChart API integration (using mock data)
❌ Actual crisis intervention (flagging only)
❌ In-person meetup coordination
❌ Video calls
❌ Medical diagnosis or advice
❌ Family portal authentication

---

## 3. User Stories

### As a Senior
- I want to call and talk to someone who remembers me and my health
- I want someone to check if I took my medications
- I want to feel heard and understood in my native language
- I want to meet other seniors with similar interests
- I don't want to feel like a burden for being lonely

### As a Family Member
- I want to know my elderly parent has someone checking on them daily
- I want to see their emotional wellness trends
- I want alerts if they mention medical symptoms
- I want to know they're connected with a community

### As a Healthcare Provider
- I want patient-reported symptoms documented between visits
- I want to see medication adherence patterns
- I want wellness context for clinical decisions

### As a Judge
- I want to see genuine emotional support being provided
- I want to see health monitoring that augments medical care
- I want to test the memory and continuity features
- I want to verify multi-lingual capabilities
- I want to see measurable social impact (matches made, groups formed)

---

## 4. Functional Requirements

### FR1: Sam AI Companion Core
**Priority:** CRITICAL - The heart of the system

**Requirements:**
1. Sam must have a consistent, warm personality
2. Sam must adapt energy level to match the senior
3. Sam must remember details from previous conversations
4. Sam must handle interruptions gracefully
5. Sam must proactively ask about health every 2-3 exchanges
6. Sam must mention community connections at end of call
7. Conversations should feel natural and open-ended
8. Response latency must be <3 seconds for natural flow

**Technical Implementation:**
```typescript
interface SamPersonality {
  name: "Sam";
  traits: ["warm", "patient", "good_listener", "empathetic", "health_aware"];
  voice: "ElevenLabs_Warm_Neutral";
  adaptiveTraits: {
    energyLevel: "matches_senior";
    formalityLevel: "learns_preference";
    conversationPace: "adjusts_to_senior";
    healthInquiryFrequency: "every_2_3_exchanges";
  };
  endOfCallScript: "It was wonderful talking with you today, {name}. By the way, I've found some friends who share your love of {interests}. Your daughter {family_member} can see them on the family dashboard. Take care, talk to you soon!";
}
```

### FR2: Conversation Memory System
**Priority:** CRITICAL - Key differentiator

**Requirements:**
1. Store and retrieve conversation history
2. Extract key facts (family names, hobbies, health issues, interests)
3. Reference previous conversations naturally
4. Build comprehensive senior profile over time
5. Extract memories asynchronously (after response sent for speed)

**Memory Storage Structure:**
```typescript
interface SeniorProfile {
  id: string;
  name: string;  // "Mrs. Chen"
  age: number;
  phone: string;
  languages: ("english" | "mandarin")[];
  location: string;  // "Seattle, WA" for matching

  // Learned information
  memories: {
    family: Array<{
      name: string;
      relationship: string;
      details: string[];
    }>;
    hobbies: string[];  // ["gardening", "piano", "cooking"]
    health: string[];  // ["arthritis", "trouble sleeping"]
    recentEvents: string[];
    preferences: {
      topicsEnjoys: string[];
      topicsAvoid: string[];
      conversationStyle: string;
    };
  };

  // NEW: Social profile for matching
  socialProfile: {
    interests: string[];  // Auto-extracted from hobbies
    culturalBackground: string;  // "Shanghai, Mandarin"
    openToMatching: boolean;
  };

  // NEW: Health data (Mock MyChart integration)
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
    notes: Array<{
      timestamp: string;
      source: "Sam AI Conversation";
      note: string;  // Natural language
      mentions: Array<{
        type: "symptom" | "medication" | "concern";
        text: string;
        context?: string;
        severity?: string;
      }>;
    }>;
  };

  // NEW: Matching data
  matches: Array<{
    seniorId: string;
    score: number;  // 0-100
    compatibility: "high" | "good" | "potential";
    sharedInterests: string[];
    calculatedAt: string;
  }>;

  groups: Array<{
    id: string;
    name: string;
    memberCount: number;
    activity: string;
    language: string;
    schedule: string;
  }>;

  // Conversation history
  conversations: Array<{
    timestamp: string;
    duration: number;
    keyTopics: string[];
    sentiment: number;
    summary: string;
    language: "english" | "mandarin";
    healthMentions?: string[];
    transcript?: Array<{
      role: "sam" | "senior";
      content: string;
    }>;
  }>;

  // Wellness tracking
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: number;
      averageSentiment: number;
      trend: "improving" | "stable" | "declining";
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
    holisticScore: number;  // 0-100 combined score
    lastCallDate: string;
    callFrequency: number;
  };
}
```

### FR3: Multi-lingual Support
**Priority:** HIGH - ElevenLabs track requirement

**Requirements:**
1. Support English and Mandarin for demo
2. Vapi handles language detection (no Gemini call needed)
3. Sam responds in same language senior speaks
4. Seamless code-switching if senior switches mid-conversation
5. Voice ID changes based on detected language

**Implementation:**
```typescript
// Vapi detects language natively
// Worker receives language in webhook data
const voiceId = language === 'mandarin'
  ? env.ELEVENLABS_MANDARIN_VOICE
  : env.ELEVENLABS_ENGLISH_VOICE;

// All prompts check ${currentLanguage} variable
```

### FR4: Natural Wellness Tracking (Mental Health)
**Priority:** HIGH - GROW track requirement

**Requirements:**
1. Analyze sentiment throughout conversation
2. Detect emotional state changes
3. Track wellness trends over time
4. No formal assessments - all natural
5. Sentiment analysis runs asynchronously after response sent

**Sentiment Analysis Structure:**
```typescript
interface ConversationAnalytics {
  sentiment: number;  // -1 to 1
  emotions: string[];  // ["happy", "nostalgic", "content"]
  concerns: Array<{
    type: "medical" | "crisis" | "depression" | "none";
    severity: "low" | "medium" | "high";
    details: string;
  }>;
  wellnessIndicators: {
    socialConnection: number;
    mood: number;
    engagement: number;
  };

  // NEW: Health mentions extracted
  healthMentions: Array<{
    type: "symptom" | "medication" | "concern";
    text: string;
    context?: string;
    severity?: string;
  }>;
}
```

### FR5: MyChart Health Integration (Mock)
**Priority:** CRITICAL - Physical wellbeing dimension

**Requirements:**
1. **Mock UW Medicine MyChart integration** (no real API calls)
2. Store health data in senior profile
3. Sam proactively checks on physical health every 2-3 exchanges
4. Extract health mentions from conversation (symptoms, medications, appointments)
5. Batch update health notes after each call
6. Display health data in dashboard

**Mock MyChart API Endpoints:**
```
GET  /api/mychart/:seniorId              → All health data
GET  /api/mychart/:seniorId/appointments → Upcoming appointments only
POST /api/mychart/:seniorId/update       → Batch update notes after call
```

**Sam's Health Behaviors:**
- Mention specific medications: "Did you take your Lisinopril 10mg this morning?"
- Reference known conditions: "How's your arthritis been this week?"
- Remind about next appointment only: "Your checkup with Dr. Smith is next Tuesday at 10am"
- Acknowledge symptoms: "I'm sorry to hear about your back pain. I'll make a note for Dr. Smith."
- **Never give medical advice** - only listen and document

**Health Note Format:**
```typescript
// Natural language notes stored in profile.healthData.notes
{
  timestamp: "2025-01-18T14:32:00Z",
  source: "Sam AI Conversation",
  note: "Patient reports: back pain when gardening (mild severity). Medication adherence: took morning Lisinopril.",
  mentions: [
    {type: "symptom", text: "back pain", context: "gardening", severity: "mild"},
    {type: "medication", text: "took morning pills", status: "adherent"}
  ]
}
```

**Mrs. Chen's Pre-seeded Health Data:**
```typescript
healthData: {
  conditions: [
    {name: "Hypertension", since: "2018", status: "controlled"},
    {name: "Type 2 Diabetes", since: "2020", a1c: "6.5%"},
    {name: "Osteoarthritis", locations: ["knees", "back"], status: "managed"}
  ],
  medications: [
    {name: "Lisinopril", dosage: "10mg", frequency: "daily morning", purpose: "blood pressure"},
    {name: "Metformin", dosage: "500mg", frequency: "with meals", purpose: "diabetes"},
    {name: "Vitamin D", dosage: "1000 IU", frequency: "daily", purpose: "bone health"}
  ],
  vitals: {
    lastUpdated: "2025-01-10",
    bloodPressure: "128/82",
    weight: "145 lbs",
    bloodSugar: "110 mg/dL fasting"
  },
  appointments: [
    {date: "2025-01-25", time: "10:00am", type: "Primary care checkup", doctor: "Dr. Smith"},
    {date: "2025-02-15", time: "2:00pm", type: "Cardiology follow-up", doctor: "Dr. Johnson"}
  ],
  notes: []  // Populated by Sam after each call
}
```

### FR6: Community Matching & Groups
**Priority:** CRITICAL - Social health dimension

**Requirements:**
1. Auto-extract interests from conversations (hobbies + cultural background)
2. Calculate compatibility scores between seniors
3. Pre-calculate matches during demo data initialization
4. Display top 3 matches on Community tab
5. Auto-generate group suggestions after conversations
6. Geographic matching (same city = Seattle)
7. Show matches on dashboard only (admin facilitates connections)

**Matching Algorithm (Simple Weighted Scoring):**
```typescript
function calculateMatchScore(senior1: SeniorProfile, senior2: SeniorProfile): number {
  let score = 0;

  // Shared interests (10 points each, max 50)
  const sharedInterests = senior1.socialProfile.interests.filter(
    interest => senior2.socialProfile.interests.includes(interest)
  );
  score += Math.min(sharedInterests.length * 10, 50);

  // Same primary language (30 points)
  const s1Languages = senior1.socialProfile.culturalBackground.toLowerCase();
  const s2Languages = senior2.socialProfile.culturalBackground.toLowerCase();
  if (s1Languages.includes("mandarin") && s2Languages.includes("mandarin")) {
    score += 30;
  }

  // Age proximity (10 points if within ±10 years)
  const ageDiff = Math.abs(senior1.age - senior2.age);
  if (ageDiff <= 10) score += 10;

  // Same location (10 points)
  if (senior1.location === senior2.location) {
    score += 10;
  }

  return score;  // 0-100
}

function getCompatibilityLevel(score: number): {level: string, stars: number} {
  if (score >= 70) return {level: "High Compatibility", stars: 5};
  if (score >= 50) return {level: "Good Match", stars: 4};
  if (score >= 30) return {level: "Potential Match", stars: 3};
  return {level: "Low Match", stars: 2};
}

// Only display matches with score >= 50
```

**Auto-Generated Group Names:**
```typescript
// Format: "{Language} {Primary Interest} Circle"
// Examples:
"Mandarin Gardening Circle"  // Mrs. Chen + Mr. Wang + Mrs. Lee (all love gardening, speak Mandarin)
"Piano & Music Appreciation"  // Mrs. Chen + Mrs. Lee (both played piano)
```

**Demo Match Profiles:**
```typescript
// Match 1: Mrs. Lee (High compatibility - 90%)
{
  name: "Mrs. Lee",
  age: 69,
  background: "From Taiwan, Mandarin speaker",
  location: "Seattle, WA",
  interests: ["gardening", "cooking", "piano", "mahjong"],
  sharedWithMrsChen: ["Mandarin", "gardening", "cooking", "piano"]
}

// Match 2: Mr. Wang (High compatibility - 85%)
{
  name: "Mr. Wang",
  age: 73,
  background: "From Beijing, Mandarin speaker",
  location: "Seattle, WA",
  interests: ["calligraphy", "tai chi", "gardening", "traditional music"],
  sharedWithMrsChen: ["Mandarin", "gardening", "music appreciation"]
}

// Match 3: Mrs. Kim (Good match - 65%)
{
  name: "Mrs. Kim",
  age: 71,
  background: "From Seoul, Korean/English speaker",
  location: "Seattle, WA",
  interests: ["gardening", "painting", "traditional Korean music"],
  sharedWithMrsChen: ["gardening", "music/arts", "Asian cultural values"]
}
```

### FR7: Admin Dashboard
**Priority:** CRITICAL - Judges need to see impact

**Dashboard Structure (4 Tabs):**

#### Tab 1: Live Call
- Real-time sentiment meter (-1 to +1 scale)
- Current emotions (fade in/out as they change)
- Language indicator (English/Mandarin)
- 🔴 LIVE indicator (red dot + pulsing animation)
- Polling every 2 seconds: `GET /api/sentiment/live`

#### Tab 2: Senior Profile
**Personal Info Card:**
- Name, age, background, family members

**Health Overview Card (Collapsible sections):**
- ▼ Medications (3 items with dosage)
- ▼ Conditions (3 items with status)
- ▼ Next Appointment (highlighted with date/time)
- ▼ Recent Health Notes (last 3, structured cards with timestamps)

**Interests & Hobbies Card:**
- Auto-extracted from conversations
- Display as tags

**Conversation History (Collapsible):**
- Past 5 conversations with summaries
- Key topics, sentiment, date

#### Tab 3: Community
**Social Profile Summary:**
- Interests, cultural background, location
- "Open to connecting" status

**Recommended Matches (3 cards, sorted by score):**
```
┌─────────────────────────────┐
│ Mrs. Lee, 69               │
│ Taiwan | Mandarin speaker   │
│                             │
│ ★★★★★ High Compatibility   │
│ Match Score: 90%            │
│                             │
│ Shared Interests:           │
│ • Gardening                 │
│ • Cooking                   │
│ • Piano                     │
│ • Cultural heritage         │
│                             │
│ Suggested Groups:           │
│ Mandarin Gardening Circle   │
│ [View Profile] [Details]    │
└─────────────────────────────┘
```

**Suggested Groups (Auto-generated):**
- "Mandarin Gardening Circle" (3 members, Weekly Thursdays 2pm)
- "Piano & Music Appreciation" (2+ members, Bi-weekly Saturdays 3pm)

#### Tab 4: Analytics
**Holistic Wellness Score (Integrated Metrics):**
```
┌─────────────────────────────────┐
│   Holistic Wellness Score       │
│                                 │
│         78/100                  │
│   [Radial progress indicator]   │
│                                 │
│   Breakdown:                    │
│   ├─ Mental Health: ↑ 42%      │
│   │   (147 conversations)       │
│   ├─ Physical: 23 health notes  │
│   │   (5 added this week)       │
│   └─ Social: 8 matches, 2 groups│
│       (Community growing)       │
│                                 │
│   [30-day combined trend graph] │
│   (Shows all three dimensions)  │
└─────────────────────────────────┘
```

**Additional Metrics:**
- Total conversations across all seniors
- Average sentiment improvement
- Most discussed topics (word frequency)
- MyChart updates made
- Number of matches suggested
- Seniors who joined groups

### FR8: Crisis Escalation
**Priority:** MEDIUM - Safety feature

**Requirements:**
1. Detect medical emergencies → Flag in dashboard
2. Detect severe depression → Alert + continue support
3. Detect suicide ideation → Immediate escalation protocol
4. Dashboard shows alerts prominently
5. Alerts stored in KV with severity level

**Implementation:**
```typescript
// If sentiment analysis returns high-severity concern:
if (sentiment.concerns?.some(c => c.severity === 'high')) {
  await createAlert(profile.name, sentiment.concerns, env);
  // Store in KV: 'alerts-{seniorId}'
}

// Alert structure (Updated: Combined structure per Task 3.6 implementation)
interface Alert {
  seniorId: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
  type: "medical" | "crisis" | "depression" | "general"; // Added: Alert category
  message: string; // Added: Human-readable alert message
  concerns: Array<{
    type: string;
    excerpt: string;
  }>;
  requiresAction: boolean;
}
```

### FR9: Conversation Quality Features
**Priority:** HIGH - Core to success

**Elderly-Friendly Techniques:**
1. **Reminiscence Therapy** - Encourage sharing past memories
2. **Active Listening** - Reflect back what they said to show understanding
3. **Gentle Prompting** - Open-ended questions about their stories
4. **Patience** - Never rush, allow long pauses
5. **Health Inquiry** - Check physical wellbeing every 2-3 exchanges
6. **Community Mention** - Reference potential friends at call end

**Fallback Responses:**
```typescript
const FALLBACK_RESPONSES = [
  "Tell me more about that.",
  "I'm listening. Please continue.",
  "That sounds important to you.",
  "How did that make you feel?"
];

const FALLBACK_TOPICS = [
  "Tell me about your childhood. What was your favorite game?",
  "What did you used to cook for your family?",
  "Have you been able to work on your garden lately?",
  "How is your family doing?",
  "Tell me about your hometown. What do you miss most?"
];
```

### FR10: Pre-Seeded Demo Data
**Priority:** CRITICAL - Must work for demo

**4 Senior Profiles:**
1. **Mrs. Chen** (main) - Full profile with 5 conversations, health data, interests
2. **Mrs. Lee** - Basic profile, high match to Mrs. Chen
3. **Mr. Wang** - Basic profile, high match to Mrs. Chen
4. **Mrs. Kim** - Basic profile, good match to Mrs. Chen

**Mrs. Chen's 5 Pre-seeded Conversations (with health mentions throughout):**

**Conversation 1 (Week 1):**
- Topic: Tomato gardening
- Health mention: "My knees ache a bit when I kneel"
- Extracted interest: Gardening

**Conversation 2 (Week 1):**
- Topic: Daughter Sarah's visit
- Health mention: "I remembered my medication today"
- Extracted interest: Family time, cooking together

**Conversation 3 (Week 2):**
- Topic: Piano teaching memories
- Health mention: "My hands are still nimble, arthritis not too bad"
- Extracted interest: Piano, teaching

**Conversation 4 (Week 2):**
- Topic: Shanghai memories, food
- Health mention: "Blood sugar was good at my last checkup"
- Extracted interest: Cooking, cultural heritage

**Conversation 5 (Week 3):**
- Topic: Feeling lonely
- Health mention: "I've been tired lately, maybe need more social activity"
- Extracted interest: Wanting to meet people

**Initialization Script (`init-demo-data.ts`):**
```typescript
// Run at Hour 0
// Creates all 4 senior profiles
// Pre-calculates all matches (Mrs. Chen → Lee/Wang/Kim)
// Generates suggested groups
// Populates mock MyChart data
// Posts to: POST /api/init-demo
```

---

## 5. Technical Architecture

### System Overview
```
┌─────────────┐
│   Senior    │ ──calls──> (206) XXX-XXXX
│   (Phone)   │
└─────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│         VAPI.AI PLATFORM             │
│  • Phone connection                  │
│  • Speech-to-text (ElevenLabs)       │
│  • Text-to-speech (ElevenLabs)       │
│  • NATIVE language detection         │
└──────────────────────────────────────┘
       │
       │ Webhook: POST /vapi-webhook
       ↓
┌──────────────────────────────────────┐
│    CLOUDFLARE WORKERS                │
│  • Orchestrates Sam's responses      │
│  • Response generation (priority)    │
│  • Background async processing:      │
│    - Sentiment + health extraction   │
│    - Memory updates                  │
│    - MyChart note creation           │
│    - Match calculations              │
└──────────────────────────────────────┘
       │                    │
       ├────────────────────┤
       ↓                    ↓
┌──────────────┐    ┌──────────────────┐
│  GEMINI API  │    │  CLOUDFLARE KV   │
│ (Flash model)│    │ • Senior profiles│
│ • Response   │    │ • Health data    │
│ • Sentiment  │    │ • Match scores   │
│ • Health     │    │ • Analytics      │
│   extraction │    │ • Alerts         │
└──────────────┘    └──────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│    DASHBOARD (React + Cloudflare)    │
│  • Live Call (sentiment polling)     │
│  • Senior Profile (health + history) │
│  • Community (matches + groups)      │
│  • Analytics (holistic wellness)     │
└──────────────────────────────────────┘
```

### Call Latency Optimization (<3 seconds target)
```
User stops talking
    ↓ (~500ms) Vapi detects speech end
    ↓ (~100ms) Webhook called
    ↓
┌──────────────────────────────────────┐
│ PRIORITY PATH (runs immediately):    │
│ 1. Parse conversation (~50ms)        │
│ 2. Generate Sam response (~800ms)    │
│    - Uses Gemini 1.5 Flash           │
│    - Language from Vapi (no call)    │
│    - Memory context from profile     │
│ 3. Format + return (~50ms)           │
│ TOTAL: ~1.5 seconds                  │
└──────────────────────────────────────┘
    ↓ (~100ms) Response sent to Vapi
    ↓ (~500ms) Speech synthesis
Sam starts speaking (~2.1s total)

┌──────────────────────────────────────┐
│ ASYNC PATH (runs after response):    │
│ - Sentiment + health extraction      │
│ - Memory update (append to profile)  │
│ - MyChart notes creation             │
│ - Match recalculation (if new data)  │
│ - Analytics aggregation              │
└──────────────────────────────────────┘
```

**Timeout Handling:**
```typescript
// If processing takes >7 seconds, return generic fallback
const timeoutPromise = new Promise(resolve =>
  setTimeout(() => resolve({
    content: "I'm listening. Please continue."
  }), 7000)
);

const result = await Promise.race([responsePromise, timeoutPromise]);

// Queue async processing to run after response sent
```

### Data Storage Strategy

**Single Unified Profile in KV:**
```typescript
// Key: 'senior-{id}'
// Value: Complete SeniorProfile object (see FR2)
// Benefits:
// - Single KV read gets all data
// - Single KV write updates everything
// - No complex joins or multiple calls
// - Fast for demo (< 100ms read/write)

// Additional KV keys:
'live-sentiment' → Current call sentiment (5 min TTL)
'analytics-aggregate' → Cached analytics (5 min TTL)
'alerts-{seniorId}' → Alert history
```

### Modular Gemini Architecture

**Functions (5 total):**
```typescript
// 1. Language Detection
// DEPRECATED - Vapi handles natively, no Gemini call needed

// 2. Response Generation (PRIORITY - runs immediately)
async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  language: string,
  history: any[],
  env: Env
): Promise<string>
// Returns: Sam's response text
// Latency: ~800ms (Gemini Flash)

// 3. Sentiment + Health Extraction (ASYNC - after response sent)
async function analyzeSentimentAndHealth(
  message: string,
  context: string[],
  env: Env
): Promise<{sentiment, emotions, concerns, healthMentions}>
// Returns: Combined sentiment and health data
// Latency: ~850ms (single Gemini call)

// 4. Memory Extraction (ASYNC - after response sent)
async function extractMemories(
  message: string,
  profile: SeniorProfile,
  env: Env
): Promise<{newFacts}>
// Returns: New facts to merge into profile
// Latency: ~800ms

// 5. Gemini API Wrapper
async function callGemini(
  prompt: string,
  env: Env
): Promise<string>
// Handles retries, errors, rate limits
```

---

## 6. Complete Prompt Templates

### Prompt 1: Sam's Response Generation (PRIORITY)
```javascript
const SAM_RESPONSE_PROMPT = `
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
```

### Prompt 2: Sentiment + Health Extraction (ASYNC)
```javascript
const SENTIMENT_HEALTH_ANALYSIS_PROMPT = `
Analyze the emotional state AND health mentions in this elderly person's message.

Senior's message: "${seniorMessage}"
Recent conversation context: ${last3Exchanges}
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
```

### Prompt 3: Memory Extraction (ASYNC)
```javascript
const MEMORY_EXTRACTION_PROMPT = `
You are analyzing a conversation to extract important facts about a senior.

Previous known facts:
${JSON.stringify(profile.memories)}

New conversation excerpt:
Senior: "${seniorMessage}"

Extract any NEW information about:
- Family members (names, relationships, details, visits)
- Hobbies or interests (gardening, music, cooking, crafts, etc.)
- Health concerns (symptoms, conditions, medications)
- Recent events (visits, activities, milestones)
- Preferences (topics they enjoy or avoid)
- Cultural background (heritage, language, traditions)

IMPORTANT for social matching:
- Extract specific interests that could match with other seniors
- Note cultural/language backgrounds
- Identify activities they enjoy or used to enjoy

Return JSON:
{
  "newFacts": {
    "family": [],
    "hobbies": [],
    "interests": [],
    "health": [],
    "recentEvents": [],
    "preferences": [],
    "culturalBackground": ""
  }
}

If no new information in a category, return empty array.
Focus on extracting actionable, specific details.
`;
```

---

## 7. API Implementation

### Complete Worker Structure

**Note:** The code below shows a consolidated example for clarity. In actual implementation (Task 3.1d), use modular handler files (`worker/src/handlers/*.ts`) for better code organization.

```typescript
// worker/src/index.ts (Main router - delegates to handlers)
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Main webhook endpoint (CRITICAL PATH)
    if (url.pathname === '/vapi-webhook' && request.method === 'POST') {
      return handleVapiWebhook(request, env); // Imported from handlers/vapi-webhook.ts
    }

    // Dashboard API - Single call gets everything
    if (url.pathname.startsWith('/api/dashboard/')) {
      const seniorId = url.pathname.split('/').pop();
      return handleDashboardAPI(seniorId!, env, corsHeaders);
    }

    // MyChart mock endpoints
    if (url.pathname.startsWith('/api/mychart/')) {
      const parts = url.pathname.split('/');
      const seniorId = parts[3];
      const action = parts[4];

      if (request.method === 'GET' && !action) {
        // GET /api/mychart/:seniorId - All health data
        const profile = await getProfile(seniorId, env);
        return new Response(JSON.stringify(profile.healthData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (request.method === 'GET' && action === 'appointments') {
        // GET /api/mychart/:seniorId/appointments
        const profile = await getProfile(seniorId, env);
        return new Response(JSON.stringify(profile.healthData.appointments), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (request.method === 'POST' && action === 'update') {
        // POST /api/mychart/:seniorId/update
        const body = await request.json();
        await updateHealthNotes(seniorId, body, env);
        return new Response(JSON.stringify({success: true}), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Legacy individual endpoints (for compatibility)
    if (url.pathname === '/api/senior/mrs-chen') {
      const profile = await getProfile('mrs-chen', env);
      return new Response(JSON.stringify(profile), {
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

    // Initialize demo data
    if (url.pathname === '/api/init-demo' && request.method === 'POST') {
      const profile = await request.json();
      await env.KV.put(`senior-${profile.id}`, JSON.stringify(profile));
      return new Response(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({status: 'ok'}), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};

// Dashboard API - Returns everything in one call
async function handleDashboardAPI(
  seniorId: string,
  env: Env,
  corsHeaders: any
): Promise<Response> {
  const profile = await getProfile(seniorId, env);
  const analytics = await getAnalytics(env);
  const liveSentiment = JSON.parse(
    await env.KV.get('live-sentiment') || '{"sentiment": 0, "emotions": []}'
  );

  return new Response(JSON.stringify({
    profile,
    analytics,
    liveSentiment
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
```

### Vapi Webhook Handler (OPTIMIZED FOR <3s LATENCY)

**Implementation Note (Task 3.1d):** Create full webhook architecture in `worker/src/handlers/vapi-webhook.ts`. Use stub `generateSamResponse()` until Developer 1 provides real function at Hour 5.

```typescript
// worker/src/handlers/vapi-webhook.ts
async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  try {
    // Set up 7-second timeout for Vapi's 10-second limit
    const timeoutPromise = new Promise<{content: string}>(resolve =>
      setTimeout(() => resolve({
        content: "I'm listening. Please continue."
      }), 7000)
    );

    const responsePromise = processVapiCall(request, env);

    // Race: return whichever finishes first
    const result = await Promise.race([responsePromise, timeoutPromise]);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
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

async function processVapiCall(request: Request, env: Env): Promise<{content: string, voiceId?: string}> {
  const data = await request.json();
  const { message } = data;

  // Get senior profile (demo: always mrs-chen)
  const profileKey = 'senior-mrs-chen';
  let profile = await getProfile('mrs-chen', env);

  // Extract senior's message
  const seniorMessage = message.transcript?.content || '';

  if (!seniorMessage || seniorMessage.trim() === '') {
    return { content: "I'm here. Take your time." };
  }

  // Language from Vapi (no Gemini call needed!)
  const language = message.language || 'english';

  // PRIORITY: Generate Sam's response immediately
  const samResponse = await generateSamResponse(
    seniorMessage,
    profile,
    language,
    message.conversationHistory || [],
    env
  );

  // Select voice based on language
  const voiceId = language === 'mandarin'
    ? env.ELEVENLABS_MANDARIN_VOICE
    : env.ELEVENLABS_ENGLISH_VOICE;

  // ASYNC: Queue background processing (runs after response sent)
  // Note: This is a simplified representation. In production, use:
  // - Cloudflare Queues
  // - Durable Objects
  // - Or waitUntil() for background tasks
  env.context.waitUntil(
    backgroundProcessing(seniorMessage, profile, language, env)
  );

  // Return response immediately (target: <2 seconds)
  return {
    content: samResponse,
    voiceId
  };
}

// Background processing (runs async after response sent)
async function backgroundProcessing(
  message: string,
  profile: SeniorProfile,
  language: string,
  env: Env
): Promise<void> {
  try {
    // 1. Sentiment + Health Analysis
    const analysis = await analyzeSentimentAndHealth(
      message,
      profile.conversations.slice(-3).map(c => c.senior || ''),
      env
    );

    // 2. Memory Extraction
    const newMemories = await extractMemories(message, profile, env);

    // 3. Update Profile
    if (newMemories) {
      updateProfileMemories(profile, newMemories);
    }

    // 4. Create Health Notes (if health mentions)
    if (analysis.healthMentions && analysis.healthMentions.length > 0) {
      profile.healthData.notes.push({
        timestamp: new Date().toISOString(),
        source: "Sam AI Conversation",
        note: `Patient reports: ${analysis.healthMentions.map(h => h.text).join(', ')}`,
        mentions: analysis.healthMentions
      });

      // Keep only last 10 notes
      if (profile.healthData.notes.length > 10) {
        profile.healthData.notes = profile.healthData.notes.slice(-10);
      }
    }

    // 5. Store Live Sentiment
    await env.KV.put('live-sentiment', JSON.stringify({
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      timestamp: new Date().toISOString()
    }), { expirationTtl: 300 });

    // 6. Check for Alerts
    if (analysis.concerns?.some(c => c.severity === 'high')) {
      await createAlert(profile.name, analysis.concerns, env);
    }

    // 7. Update Conversation History
    profile.conversations.push({
      timestamp: new Date().toISOString(),
      duration: 0,  // Could calculate from call data
      keyTopics: [],  // Could extract from memory
      sentiment: analysis.sentiment,
      language,
      healthMentions: analysis.healthMentions?.map(h => h.text),
      summary: "",  // Could generate summary
      senior: message,
      sam: ""  // Don't have response here, but could pass it
    });

    // Keep only last 10 conversations
    if (profile.conversations.length > 10) {
      profile.conversations = profile.conversations.slice(-10);
    }

    // 8. Recalculate Wellness Metrics
    updateWellnessMetrics(profile);

    // 9. Recalculate Matches (if interests changed)
    if (newMemories?.newFacts?.interests?.length > 0) {
      await recalculateMatches(profile, env);
    }

    // 10. Save Updated Profile
    await env.KV.put(`senior-${profile.id}`, JSON.stringify(profile));

  } catch (error) {
    console.error('Background processing error:', error);
    // Don't fail the call, just log
  }
}
```

### Helper Functions
```typescript
async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  language: string,
  history: any[],
  env: Env
): Promise<string> {
  try {
    const recentExchanges = history.slice(-3).map(h =>
      `${h.role}: ${h.content}`
    ).join('\n');

    const appointmentDate = profile.healthData.appointments[0]?.date;
    const appointmentDoctor = profile.healthData.appointments[0]?.doctor?.split(' ').pop();

    const prompt = SAM_RESPONSE_PROMPT
      .replace('${profile.name}', profile.name)
      .replace('${profile.age}', profile.age.toString())
      .replace('${currentLanguage}', language)
      .replace('${JSON.stringify(profile.memories.family)}', JSON.stringify(profile.memories.family))
      .replace('${profile.memories.hobbies.join(\', \')}', profile.memories.hobbies.join(', '))
      .replace('${profile.healthData.conditions.map(c => c.name).join(\', \')}', profile.healthData.conditions.map(c => c.name).join(', '))
      .replace('${profile.healthData.medications.map(m => m.name + \' \' + m.dosage).join(\', \')}', profile.healthData.medications.map(m => m.name + ' ' + m.dosage).join(', '))
      .replace('${profile.healthData.appointments[0]?.date} at ${profile.healthData.appointments[0]?.time}', `${appointmentDate} at ${profile.healthData.appointments[0]?.time}`)
      .replace('${profile.memories.recentEvents?.join(\', \') || \'none\'}', profile.memories.recentEvents?.join(', ') || 'none')
      .replace('${recentExchanges}', recentExchanges)
      .replace('${seniorMessage}', message)
      .replace('${profile.healthData.medications[0]?.name}', profile.healthData.medications[0]?.name || 'medication')
      .replace('${appointmentDoctor}', appointmentDoctor || 'your doctor')
      .replace('${appointmentDate}', appointmentDate || 'soon')
      .replace('${currentLanguage === \'mandarin\' ? \'Respond ENTIRELY in Mandarin Chinese\' : \'Respond in English\'}', language === 'mandarin' ? 'Respond ENTIRELY in Mandarin Chinese' : 'Respond in English');

    return await callGemini(prompt, env);

  } catch (error) {
    console.error('Response generation failed:', error);
    const fallbacks = [
      "Tell me more about that.",
      "I'm listening. Please continue.",
      "That sounds important to you."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

async function analyzeSentimentAndHealth(
  message: string,
  context: string[],
  env: Env
): Promise<any> {
  try {
    // This is the combined prompt (see Prompt 2 above)
    const prompt = SENTIMENT_HEALTH_ANALYSIS_PROMPT
      .replace('${seniorMessage}', message)
      .replace('${last3Exchanges}', context.join('\n'));

    const response = await callGemini(prompt, env);
    return JSON.parse(response);

  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return {
      sentiment: 0,
      emotions: ['calm'],
      concerns: [],
      wellnessIndicators: {
        socialConnection: 0,
        mood: 0,
        engagement: 0
      },
      healthMentions: []
    };
  }
}

async function extractMemories(
  message: string,
  profile: SeniorProfile,
  env: Env
): Promise<any> {
  try {
    const prompt = MEMORY_EXTRACTION_PROMPT
      .replace('${JSON.stringify(profile.memories)}', JSON.stringify(profile.memories))
      .replace('${seniorMessage}', message);

    const response = await callGemini(prompt, env);
    return JSON.parse(response);

  } catch (error) {
    console.error('Memory extraction failed:', error);
    return null;
  }
}

async function callGemini(prompt: string, env: Env): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
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
          maxOutputTokens: 200  // Keep responses concise
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function updateProfileMemories(profile: SeniorProfile, newMemories: any): void {
  const { newFacts } = newMemories;

  if (newFacts.family) {
    profile.memories.family.push(...newFacts.family);
  }

  if (newFacts.hobbies) {
    profile.memories.hobbies.push(...newFacts.hobbies);
    // Also add to social profile interests
    profile.socialProfile.interests.push(...newFacts.hobbies);
    // Deduplicate
    profile.socialProfile.interests = [...new Set(profile.socialProfile.interests)];
  }

  if (newFacts.health) {
    profile.memories.health.push(...newFacts.health);
  }

  if (newFacts.recentEvents) {
    profile.memories.recentEvents = profile.memories.recentEvents || [];
    profile.memories.recentEvents.push(...newFacts.recentEvents);
    // Keep only last 5 recent events
    profile.memories.recentEvents = profile.memories.recentEvents.slice(-5);
  }

  if (newFacts.culturalBackground) {
    profile.socialProfile.culturalBackground = newFacts.culturalBackground;
  }
}

function updateWellnessMetrics(profile: SeniorProfile): void {
  const recentConversations = profile.conversations.slice(-10);

  // Mental health
  const avgSentiment = recentConversations.reduce((sum, c) => sum + c.sentiment, 0) / recentConversations.length;
  profile.wellnessMetrics.mentalHealth.averageSentiment = avgSentiment;

  // Trend calculation
  const firstHalfAvg = recentConversations.slice(0, 5).reduce((sum, c) => sum + c.sentiment, 0) / 5;
  const secondHalfAvg = recentConversations.slice(5).reduce((sum, c) => sum + c.sentiment, 0) / 5;

  if (secondHalfAvg > firstHalfAvg + 0.1) {
    profile.wellnessMetrics.mentalHealth.trend = "improving";
  } else if (secondHalfAvg < firstHalfAvg - 0.1) {
    profile.wellnessMetrics.mentalHealth.trend = "declining";
  } else {
    profile.wellnessMetrics.mentalHealth.trend = "stable";
  }

  // Physical health metrics
  profile.wellnessMetrics.physicalHealth.symptomMentions = profile.healthData.notes.filter(
    n => n.mentions.some(m => m.type === 'symptom')
  ).length;

  // Social health metrics
  profile.wellnessMetrics.socialHealth.matchesMade = profile.matches.length;
  profile.wellnessMetrics.socialHealth.groupsJoined = profile.groups.length;

  // Holistic score (0-100)
  const mentalScore = Math.max(0, Math.min(100, (avgSentiment + 1) * 50));  // Convert -1 to 1 → 0 to 100
  const physicalScore = 70;  // Simplified for demo (could calculate from adherence, symptoms)
  const socialScore = Math.min(100, profile.matches.length * 10 + profile.groups.length * 20);

  profile.wellnessMetrics.holisticScore = Math.round(
    (mentalScore * 0.4) + (physicalScore * 0.3) + (socialScore * 0.3)
  );

  profile.wellnessMetrics.lastCallDate = new Date().toISOString();
}

async function recalculateMatches(profile: SeniorProfile, env: Env): Promise<void> {
  // Get all other seniors
  const allSeniors = await getAllSeniors(env);

  const newMatches = [];
  for (const otherSenior of allSeniors) {
    if (otherSenior.id === profile.id) continue;

    const score = calculateMatchScore(profile, otherSenior);

    // Only include matches with score >= 50
    if (score >= 50) {
      const sharedInterests = profile.socialProfile.interests.filter(
        i => otherSenior.socialProfile.interests.includes(i)
      );

      const compatibility = getCompatibilityLevel(score);

      newMatches.push({
        seniorId: otherSenior.id,
        score,
        compatibility: compatibility.level.split(' ')[0].toLowerCase(),
        sharedInterests,
        calculatedAt: new Date().toISOString()
      });
    }
  }

  // Sort by score descending
  newMatches.sort((a, b) => b.score - a.score);

  // Keep top 3
  profile.matches = newMatches.slice(0, 3);

  // Auto-generate groups
  await autoGenerateGroups(profile, allSeniors, env);
}

async function autoGenerateGroups(
  profile: SeniorProfile,
  allSeniors: SeniorProfile[],
  env: Env
): Promise<void> {
  const potentialGroups = [];

  // Find seniors with shared interests
  for (const interest of profile.socialProfile.interests) {
    const membersWithInterest = allSeniors.filter(s =>
      s.socialProfile.interests.includes(interest) &&
      s.location === profile.location
    );

    if (membersWithInterest.length >= 2) {
      // Determine language for group
      const mandarinSpeakers = membersWithInterest.filter(s =>
        s.socialProfile.culturalBackground.toLowerCase().includes('mandarin')
      );

      const language = mandarinSpeakers.length >= 2 ? 'Mandarin' : 'English';
      const groupName = `${language} ${interest.charAt(0).toUpperCase() + interest.slice(1)} Circle`;

      potentialGroups.push({
        id: groupName.toLowerCase().replace(/\s+/g, '-'),
        name: groupName,
        memberCount: membersWithInterest.length,
        activity: interest,
        language,
        schedule: 'Weekly'  // Simplified for demo
      });
    }
  }

  // Deduplicate and take top 2
  profile.groups = potentialGroups.slice(0, 2);
}

async function createAlert(
  seniorName: string,
  concerns: any[],
  env: Env
): Promise<void> {
  const alert = {
    seniorId: seniorName.toLowerCase().replace(/\s+/g, '-'),
    timestamp: new Date().toISOString(),
    severity: concerns.some(c => c.severity === 'high') ? 'high' : 'medium',
    concerns: concerns.map(c => ({
      type: c.type,
      excerpt: c.details
    })),
    requiresAction: true
  };

  const alertKey = `alerts-${alert.seniorId}`;
  const existingAlerts = JSON.parse(await env.KV.get(alertKey) || '[]');
  existingAlerts.push(alert);

  await env.KV.put(alertKey, JSON.stringify(existingAlerts));
}

async function getProfile(seniorId: string, env: Env): Promise<SeniorProfile> {
  const profile = await env.KV.get(`senior-${seniorId}`);
  if (!profile) {
    throw new Error(`Profile not found: ${seniorId}`);
  }
  return JSON.parse(profile);
}

async function getAllSeniors(env: Env): Promise<SeniorProfile[]> {
  // Simplified for demo - in production, would use KV list
  const ids = ['mrs-chen', 'mrs-lee', 'mr-wang', 'mrs-kim'];
  const profiles = [];

  for (const id of ids) {
    try {
      const profile = await getProfile(id, env);
      profiles.push(profile);
    } catch (error) {
      // Skip if not found
    }
  }

  return profiles;
}

async function getAnalytics(env: Env): Promise<any> {
  const allSeniors = await getAllSeniors(env);

  const totalConversations = allSeniors.reduce(
    (sum, s) => sum + s.conversations.length, 0
  );

  const avgSentiment = allSeniors.reduce(
    (sum, s) => sum + s.wellnessMetrics.mentalHealth.averageSentiment, 0
  ) / allSeniors.length;

  const totalMatches = allSeniors.reduce(
    (sum, s) => sum + s.matches.length, 0
  );

  const totalHealthNotes = allSeniors.reduce(
    (sum, s) => sum + s.healthData.notes.length, 0
  );

  return {
    totalConversations,
    averageSentiment: Math.round(avgSentiment * 100) / 100,
    totalMatches,
    totalHealthNotes,
    seniorCount: allSeniors.length,
    holisticWellnessAverage: Math.round(
      allSeniors.reduce((sum, s) => sum + s.wellnessMetrics.holisticScore, 0) / allSeniors.length
    )
  };
}

function calculateMatchScore(senior1: SeniorProfile, senior2: SeniorProfile): number {
  let score = 0;

  // Shared interests (10 points each, max 50)
  const sharedInterests = senior1.socialProfile.interests.filter(
    interest => senior2.socialProfile.interests.includes(interest)
  );
  score += Math.min(sharedInterests.length * 10, 50);

  // Same primary language (30 points)
  const s1Lang = senior1.socialProfile.culturalBackground.toLowerCase();
  const s2Lang = senior2.socialProfile.culturalBackground.toLowerCase();
  if (s1Lang.includes("mandarin") && s2Lang.includes("mandarin")) {
    score += 30;
  } else if (s1Lang.includes("english") && s2Lang.includes("english")) {
    score += 30;
  }

  // Age proximity (10 points if within ±10 years)
  const ageDiff = Math.abs(senior1.age - senior2.age);
  if (ageDiff <= 10) score += 10;

  // Same location (10 points)
  if (senior1.location === senior2.location) {
    score += 10;
  }

  return Math.min(score, 100);
}

function getCompatibilityLevel(score: number): {level: string, stars: number} {
  if (score >= 70) return {level: "High Compatibility", stars: 5};
  if (score >= 50) return {level: "Good Match", stars: 4};
  if (score >= 30) return {level: "Potential Match", stars: 3};
  return {level: "Low Match", stars: 2};
}
```

---

## 8. Dashboard Implementation (React)

### Design System
```typescript
// Design tokens
const COLORS = {
  primary: '#457B9D',      // Medical blue
  secondary: '#1D3557',    // Trust teal
  accent: '#A8DADC',       // Highlight cyan
  background: '#FFFFFF',   // Clean white
  text: '#1D3557',         // Navy
  success: '#2A9D8F',
  warning: '#F4A261',
  error: '#E63946',
  neutral: '#F8F9FA'
};

const SPACING = {
  card: '16px',
  section: '20px',
  component: '8px'
};

const TYPOGRAPHY = {
  heading: {
    fontSize: '24-32px',
    fontWeight: 600,
    fontFamily: 'Inter, system-ui'
  },
  body: {
    fontSize: '16-18px',
    fontWeight: 400,
    fontFamily: 'Inter, system-ui'
  },
  data: {
    fontSize: '20-24px',
    fontWeight: 700
  }
};
```

### Main App Component
```typescript
// src/App.tsx
function App() {
  const [activeTab, setActiveTab] = useState<'live' | 'profile' | 'community' | 'analytics'>('live');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs only, no header */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {['live', 'profile', 'community', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'live' && '📞 Live Call'}
                {tab === 'profile' && '👤 Senior Profile'}
                {tab === 'community' && '👥 Community'}
                {tab === 'analytics' && '📊 Analytics'}
                {tab === 'live' && activeTab === 'live' && ' 🔴'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'live' && <LiveCallView />}
        {activeTab === 'profile' && <SeniorProfileView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );
}
```

### Live Call View
```typescript
// src/components/LiveCallView.tsx
function LiveCallView() {
  const [sentiment, setSentiment] = useState(0);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/api/sentiment/live`);
      const data = await res.json();
      setSentiment(data.sentiment || 0);
      setEmotions(data.emotions || []);
      setLanguage(data.language || 'english');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Live Call - Mrs. Chen</h2>
        <span className="flex items-center text-red-600 font-medium">
          <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Sentiment Meter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Real-time Sentiment
        </label>
        <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-500 ${
              sentiment > 0 ? 'bg-green-500' : sentiment < 0 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{
              width: `${Math.abs(sentiment) * 100}%`,
              left: sentiment < 0 ? '0' : '50%',
              right: sentiment > 0 ? '0' : '50%'
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
            {sentiment > 0 ? '😊' : sentiment < 0 ? '😔' : '😐'} {sentiment.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Detected Emotions */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Detected Emotions
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in"
            >
              {emotion}
            </span>
          ))}
          {emotions.length === 0 && (
            <span className="text-gray-400 text-sm">No emotions detected yet</span>
          )}
        </div>
      </div>

      {/* Language Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Language:</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {language === 'mandarin' ? '中文 Mandarin' : 'English'}
        </span>
      </div>
    </div>
  );
}
```

### Senior Profile View
```typescript
// src/components/SeniorProfileView.tsx
function SeniorProfileView() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`);
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <p className="text-lg font-medium">{profile.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Age</label>
            <p className="text-lg font-medium">{profile.age}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <p className="text-lg font-medium">{profile.location}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Languages</label>
            <p className="text-lg font-medium">{profile.languages.join(', ')}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600 block mb-2">Family</label>
          <div className="space-y-2">
            {profile.memories.family.map((fm: any, i: number) => (
              <div key={i} className="flex items-start">
                <span className="text-2xl mr-2">👤</span>
                <div>
                  <p className="font-medium">{fm.name} ({fm.relationship})</p>
                  <p className="text-sm text-gray-600">{fm.details.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Overview Card */}
      <HealthOverviewCard healthData={profile.healthData} />

      {/* Interests Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Interests & Hobbies</h3>
        <div className="flex flex-wrap gap-2">
          {profile.memories.hobbies.map((hobby: string, i: number) => (
            <span
              key={i}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

      {/* Conversation History */}
      <ConversationHistoryCard conversations={profile.conversations} />
    </div>
  );
}

function HealthOverviewCard({ healthData }: { healthData: any }) {
  const [expanded, setExpanded] = useState({
    medications: true,
    conditions: true,
    appointments: true,
    notes: true
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Health Overview</h3>

      {/* Medications */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, medications: !e.medications}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.medications ? '▼' : '▶'} Medications ({healthData.medications.length})
          </span>
        </button>
        {expanded.medications && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.medications.map((med: any, i: number) => (
              <div key={i} className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium">{med.name} {med.dosage}</p>
                <p className="text-sm text-gray-600">{med.frequency} - {med.purpose}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, conditions: !e.conditions}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.conditions ? '▼' : '▶'} Conditions ({healthData.conditions.length})
          </span>
        </button>
        {expanded.conditions && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.conditions.map((cond: any, i: number) => (
              <div key={i} className="border-l-2 border-green-500 pl-3">
                <p className="font-medium">{cond.name}</p>
                <p className="text-sm text-gray-600">Since {cond.since} - {cond.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Appointment */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, appointments: !e.appointments}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.appointments ? '▼' : '▶'} Next Appointment
          </span>
        </button>
        {expanded.appointments && healthData.appointments[0] && (
          <div className="mt-2 ml-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="font-medium text-yellow-900">{healthData.appointments[0].type}</p>
            <p className="text-sm text-yellow-800">
              {healthData.appointments[0].date} at {healthData.appointments[0].time}
            </p>
            <p className="text-sm text-yellow-800">with {healthData.appointments[0].doctor}</p>
          </div>
        )}
      </div>

      {/* Recent Health Notes */}
      <div>
        <button
          onClick={() => setExpanded(e => ({...e, notes: !e.notes}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.notes ? '▼' : '▶'} Recent Health Notes ({healthData.notes.length})
          </span>
        </button>
        {expanded.notes && (
          <div className="mt-2 space-y-3 ml-4">
            {healthData.notes.slice(-3).reverse().map((note: any, i: number) => (
              <div key={i} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-xs text-blue-600 mb-1">
                  {new Date(note.timestamp).toLocaleString()} - {note.source}
                </p>
                <p className="text-sm text-blue-900">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationHistoryCard({ conversations }: { conversations: any[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h3 className="text-xl font-semibold text-gray-900">
          {expanded ? '▼' : '▶'} Conversation History
        </h3>
        <span className="text-sm text-gray-600">{conversations.length} conversations</span>
      </button>

      {expanded && (
        <div className="space-y-3">
          {conversations.slice(-5).reverse().map((conv: any, i: number) => (
            <div key={i} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  conv.sentiment > 0.3 ? 'bg-green-100 text-green-800' :
                  conv.sentiment < 0 ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Sentiment: {conv.sentiment.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{conv.summary}</p>
              <div className="flex flex-wrap gap-1">
                {conv.keyTopics?.map((topic: string, j: number) => (
                  <span key={j} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
              {conv.healthMentions && conv.healthMentions.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  🩺 Health: {conv.healthMentions.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Community View
```typescript
// src/components/CommunityView.tsx
function CommunityView() {
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`);
      const data = await res.json();
      setProfile(data.profile);

      // Fetch match details
      const matchDetails = await Promise.all(
        data.profile.matches.map(async (m: any) => {
          const matchRes = await fetch(`${API_BASE}/api/senior/${m.seniorId}`);
          const matchData = await matchRes.json();
          return { ...matchData, matchInfo: m };
        })
      );
      setMatches(matchDetails);
    } catch (error) {
      console.error('Failed to fetch community data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="space-y-6">
      {/* Social Profile Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          {profile.name}'s Social Profile
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Interests</label>
            <div className="flex flex-wrap gap-1">
              {profile.socialProfile.interests.map((int: string, i: number) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {int}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Cultural Background</label>
            <p className="text-sm font-medium">{profile.socialProfile.culturalBackground}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Location</label>
            <p className="text-sm font-medium">{profile.location}</p>
          </div>
        </div>
      </div>

      {/* Recommended Matches */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          Recommended Matches ({matches.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      {profile.groups && profile.groups.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Suggested Groups</h3>
          <div className="space-y-3">
            {profile.groups.map((group: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-900">{group.name}</p>
                  <p className="text-sm text-green-700">
                    {group.memberCount} members • {group.language} • {group.schedule}
                  </p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: any }) {
  const { matchInfo } = match;
  const stars = matchInfo.score >= 70 ? 5 : matchInfo.score >= 50 ? 4 : 3;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
          👤
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{match.name}, {match.age}</h4>
        <p className="text-sm text-gray-600">{match.socialProfile.culturalBackground}</p>
      </div>

      {/* Compatibility Score */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-blue-600">{matchInfo.score}%</div>
        <div className="text-yellow-500">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <p className="text-sm font-medium text-gray-700 capitalize">
          {matchInfo.compatibility} Compatibility
        </p>
      </div>

      {/* Shared Interests */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-1">Shared Interests:</label>
        <div className="flex flex-wrap gap-1">
          {matchInfo.sharedInterests.map((int: string, i: number) => (
            <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {int}
            </span>
          ))}
        </div>
      </div>

      {/* Groups */}
      {match.groups && match.groups.length > 0 && (
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 block mb-1">Groups:</label>
          <p className="text-xs text-gray-700">{match.groups[0].name}</p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
          View Profile
        </button>
        <button className="px-3 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition">
          Details
        </button>
      </div>
    </div>
  );
}
```

### Analytics View
```typescript
// src/components/AnalyticsView.tsx
function AnalyticsView() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`);
      const data = await res.json();
      setAnalytics(data.analytics);
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!analytics || !profile) return <div>Analytics not available</div>;

  const mentalScore = Math.round((profile.wellnessMetrics.mentalHealth.averageSentiment + 1) * 50);
  const physicalScore = 78;  // Simplified for demo
  const socialScore = Math.min(100, profile.matches.length * 10 + profile.groups.length * 20);

  return (
    <div className="space-y-6">
      {/* Holistic Wellness Score */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Holistic Wellness Score
        </h3>

        {/* Big Score Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {profile.wellnessMetrics.holisticScore}/100
          </div>
          <div className="w-64 h-64 mx-auto">
            {/* Radial progress indicator - simplified as percentage bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${profile.wellnessMetrics.holisticScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Breakdown:</h4>

          {/* Mental Health */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Mental Health</span>
              <span className="text-blue-600 font-bold">↑ 42%</span>
            </div>
            <p className="text-sm text-gray-600">
              {analytics.totalConversations} conversations • Avg sentiment: {analytics.averageSentiment}
            </p>
          </div>

          {/* Physical Health */}
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Physical Health</span>
              <span className="text-green-600 font-bold">{analytics.totalHealthNotes} health notes</span>
            </div>
            <p className="text-sm text-gray-600">
              {profile.healthData.notes.filter((n: any) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(n.timestamp) > weekAgo;
              }).length} added this week
            </p>
          </div>

          {/* Social Health */}
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Social Health</span>
              <span className="text-purple-600 font-bold">
                {analytics.totalMatches} matches, {profile.groups.length} groups
              </span>
            </div>
            <p className="text-sm text-gray-600">Community growing</p>
          </div>
        </div>

        {/* 30-Day Trend Graph */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">30-Day Wellness Trend</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            {/* Simplified - would use real chart library */}
            <p className="text-gray-500">[Combined trend graph showing all three dimensions over time]</p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          value={analytics.totalConversations}
          label="Total Calls"
          icon="📞"
          color="blue"
        />
        <MetricCard
          value={`+${Math.round(mentalScore)}%`}
          label="Mood"
          icon="😊"
          color="green"
        />
        <MetricCard
          value={analytics.totalHealthNotes}
          label="Health Notes"
          icon="🩺"
          color="red"
        />
        <MetricCard
          value={analytics.totalMatches}
          label="Matches"
          icon="👥"
          color="purple"
        />
      </div>
    </div>
  );
}

function MetricCard({ value, label, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    red: 'bg-red-50 text-red-900 border-red-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg border p-4 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
```

---

## 9. Demo Strategy (3 Minutes)

### Complete Demo Script

**[0:00-0:30] Problem & Solution (30 seconds)**
```
[Slide: Elderly isolation statistics]
"Meet Mrs. Chen. She's 72, lives alone in Seattle, and hasn't had a real conversation in days.

Her health isn't monitored between doctor visits. She's never met other Mandarin-speaking seniors nearby who share her interests.

Mrs. Chen represents 120,000 isolated seniors in Seattle. Social isolation increases mortality by 26%, yet most seniors can't use smartphones or video apps.

ElderLink provides Sam - an AI companion accessible by simple phone call. Sam remembers Mrs. Chen, monitors her wellbeing, and connects her with community."
```

**[0:30-1:15] Live Phone Call Demo (45 seconds)**
```
[Show phone on speaker + dashboard on screen]

"Let me show you Sam in action. I'll call as Mrs. Chen."

[Dial (206) XXX-XXXX]

Sam: "Hi Mrs. Chen! It's Sam. How are those tomatoes you planted doing?"

You: "Oh, they're growing well! But my back hurts when I bend over."

Sam: "I'm sorry to hear about your back pain. Have you been taking your Lisinopril 10mg this morning? You know, your checkup with Dr. Smith is next Tuesday at 10am - you should mention the back pain."

You: "好的，谢谢" [OK, thank you - switch to Mandarin]

Sam: "当然！你的花园一定很漂亮。你最近有和Sarah通话吗？"
[Of course! Your garden must be beautiful. Have you talked to Sarah recently?]

[Show dashboard updating in real-time: sentiment rising, language switching to Mandarin]
```

**[1:15-1:45] Dashboard - Health Focus (30 seconds)**
```
[Switch to screen share of dashboard]

"While we were talking, look what happened automatically:

[Click Senior Profile tab]
- Health note created: 'Patient reports: back pain when bending, gardening activity'
- Next appointment highlighted
- Medication adherence tracked

[Click Analytics tab]
- MyChart updates: 23 health notes created over 3 weeks
- Wellness trend: improving 42%

Sam doesn't diagnose - but she ensures Mrs. Chen's symptoms reach her doctor. Between visits, nothing gets missed."
```

**[1:45-2:30] Dashboard - Community Focus (45 seconds)**
```
[Click Community tab]

"But health is only one dimension. Sam also extracts interests from natural conversation.

Look - from 5 calls, we learned Mrs. Chen loves:
[Show tags: Gardening, Piano, Cooking, Shanghai culture]

Based on these, we found 3 compatible matches nearby:
[Show match cards]
- Mrs. Lee: 90% match - shared Mandarin, gardening, piano, cooking
- Mr. Wang: 85% match - shared Mandarin, gardening, traditional music
- Mrs. Kim: 65% match - shared gardening, arts

And we auto-generated groups:
'Mandarin Gardening Circle' - 3 members ready to connect
'Piano & Music Appreciation' - 2 members

Mrs. Chen's daughter can now facilitate these connections. AI companionship becomes a gateway to human friendships."
```

**[2:30-3:00] Impact & Close (30 seconds)**
```
[Return to Analytics Overview]

"In 3 weeks of demo data:
- 147 conversations across 4 seniors
- 23 health insights sent to MyChart
- 8 successful matches made
- 78/100 holistic wellness score combining mental, physical, and social health

ElderLink demonstrates holistic elder care: One AI companion, three transformations.

Sam remembers every senior. Sam monitors their health. Sam connects them with community.

Built in 24 hours with Vapi, ElevenLabs, Gemini, and Cloudflare.

No senior should face loneliness, declining health, or isolation alone when Sam is just a phone call away."
```

### Backup Plan Materials
```bash
# Create these during Hour 22-23
recordings/
  memory-demo.mp3           # Shows Sam remembering Mrs. Chen
  health-demo.mp3           # Shows health inquiry and tracking
  language-demo.mp3         # Shows Mandarin switching
  community-demo.mp3        # Shows end-of-call community mention

docs/
  demo-script.md           # Full 3-minute script
  backup-transcripts/
    conversation-1.txt     # Full text if call fails
    conversation-2.txt
    conversation-3.txt

screenshots/
  dashboard-live-call.png
  dashboard-health.png
  dashboard-community.png
  dashboard-analytics.png

If everything fails:
  demo-video.mp4           # 3-minute recorded demo
```

---

## 10. Work Breakdown (4 Developers + Integration Lead)

### Developer 1: Prompts & AI Logic
**Hours 0-6: Core Prompts**
- Write Sam response generation prompt (with health checks)
- Write sentiment + health extraction prompt
- Write memory extraction prompt
- Test prompts with mock data
- Create fallback responses

**Hours 6-12: Memory & Health**
- Implement memory extraction logic
- Build profile update functions (merge memories)
- Test health mention extraction
- Create Mrs. Chen's detailed 5 conversations

**Hours 12-18: Multi-lingual & Polish**
- Test language integration (Vapi-native detection)
- Optimize prompt for Mandarin responses
- Fine-tune conversation flow
- Polish emotional responses

### Developer 2: Backend & API
**Hours 0-4: Worker Setup**
- Create Cloudflare Worker project
- Set up KV namespaces
- Implement CORS headers
- Create health check endpoint

**Hours 4-8: Vapi Integration & Optimization**
- Implement optimized webhook handler (<3s latency)
- Parse Vapi requests
- Test phone connection
- Implement timeout handling (7-second fallback)

**Hours 8-12: Gemini Integration & Health**
- Connect Gemini Flash model
- Implement priority response generation
- Implement async background processing
- Create health note batch update logic
- Test full pipeline

**Hours 12-16: MyChart Mock & Matching**
- Build MyChart mock endpoints (3 total)
- Implement health data structure in profiles
- Implement matching algorithm (weighted scoring)
- Build match calculation function
- Create auto-group generation logic

**Hours 16-18: Polish & Error Handling**
- Add try-catch everywhere
- Implement graceful fallbacks
- Test failure scenarios
- Add comprehensive logging

### Developer 3: Vapi Configuration
**Hours 0-4: Vapi Setup**
- Create Vapi account
- Purchase phone number (Seattle area code)
- Configure assistant with custom LLM
- Test basic calling

**Hours 4-8: Voice Configuration**
- Select English voice (ElevenLabs)
- Select Mandarin voice (ElevenLabs)
- Configure voice settings (stability, similarity)
- Test voice quality
- Configure Vapi language detection

**Hours 8-12: Webhook Connection**
- Connect to Dev 2's Worker
- Test request/response flow
- Debug latency issues
- Configure server messages

**Hours 12-16: Testing & Optimization**
- Test language switching
- Verify voice consistency
- Test timeout handling
- Optimize for <3s responses

**Hours 16-18: Demo Preparation**
- Record 4 backup conversations
- Test with team members
- Create demo phone script
- Practice timing

### Developer 4: Dashboard UI
**Hours 0-4: React Setup & Design System**
- Create React project (Vite)
- Install Tailwind CSS + Headless UI
- Set up design tokens (colors, spacing)
- Create layout structure

**Hours 4-8: Live Call Tab**
- Build sentiment meter with animations
- Real-time polling setup (2-second interval)
- Emotion display (fade in/out)
- Language indicator
- 🔴 LIVE indicator with pulse

**Hours 8-12: Senior Profile Tab**
- Personal info card
- Health Overview Card (collapsible sections)
- Interests card
- Conversation History (collapsible)

**Hours 12-16: Community Tab**
- Social profile summary
- Match card components (3 cards, info-dense)
- Compatibility score visualization
- Suggested groups display

**Hours 16-18: Analytics Tab & Polish**
- Holistic Wellness Score component
- Radial progress indicator
- 30-day trend graph
- Metric cards
- Responsive polish
- Loading states
- Deploy to Cloudflare Pages

### Integration Lead: Coordination (No Code)
**Hours 0-24: Coordination**
- **Hour 0**: Kick-off, assign tasks, run init-demo-data script
- **Hour 2**: Ensure Dev 2's Worker deployed and shared
- **Hour 4**: Verify API contract locked, all devs aligned
- **Hour 6**: First integration merge (Dev 2 → 1 → 3 → 4)
- **Hour 8**: Run memory system test (CRITICAL - must pass!)
- **Hour 10**: Dashboard integration test
- **Hour 12**: Health + matching integration test
- **Hour 14**: Full pipeline test
- **Hour 16**: Merge everything to release branch
- **Hour 18**: FEATURE FREEZE enforcement
- **Hour 20**: Production deployment
- **Hour 22**: Create backup materials (recordings, screenshots)
- **Hour 23**: Full demo rehearsal

**Integration Tests:**
```bash
# Hour 6
curl https://elderlink-dev.workers.dev/api/health
# Expected: {"status": "ok"}

# Hour 8 (CRITICAL)
# Call 1: "My daughter Sarah visited"
# Call 2: Sam MUST mention Sarah
# If fails: ALL STOP until fixed

# Hour 12
# Call with health mention: "My back hurts"
# Check: Dashboard shows new health note
# Check: Community tab shows updated matches

# Hour 16
# Full 3-minute demo run
# All features working
```

---

## 11. Environment Setup

### Required Environment Variables
```bash
# .env
GEMINI_API_KEY=AIza...                           # Google AI Studio
ELEVENLABS_API_KEY=sk_...                        # ElevenLabs
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL    # "Sarah" voice
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5   # Mandarin voice
VAPI_API_KEY=vapi_...                            # Vapi.ai
VAPI_PHONE_NUMBER=+12065551234                   # Purchased number
CLOUDFLARE_ACCOUNT_ID=abc123
CLOUDFLARE_API_TOKEN=xxx
KV_NAMESPACE_ID=def456                           # From wrangler kv:namespace create
WORKER_URL=https://elderlink.username.workers.dev
```

### Cloudflare KV Setup
```bash
# Create namespace
wrangler kv:namespace create "ELDERLINK_KV"
# Add ID to wrangler.toml

# Create preview namespace
wrangler kv:namespace create "ELDERLINK_KV" --preview
```

### Vapi Configuration Steps
```yaml
1. Go to vapi.ai → Sign up
2. Add payment (~$10 for demo)
3. Buy phone number: US → 206 area code
4. Create Assistant:
   Name: Sam Companion
   Voice Provider: ElevenLabs
   Voice ID: [your selected voice]
   Transcriber: ElevenLabs (scribe_v1)

   CRITICAL - Custom LLM:
   Provider: Custom
   URL: https://elderlink.YOUR-USERNAME.workers.dev/vapi-webhook
   Request Timeout: 10 seconds

   First Message: "Hello! This is Sam. Who am I speaking with today?"
   End Message: "Take care, talk to you soon!"
```

---

## 12. File Structure

```
elderlink/
├── worker/
│   ├── src/
│   │   ├── index.ts                      # Main worker router (routes to handlers)
│   │   ├── handlers/
│   │   │   ├── vapi-webhook.ts           # Optimized webhook (<3s)
│   │   │   ├── dashboard-api.ts          # Single dashboard endpoint
│   │   │   ├── mychart-api.ts            # 3 health endpoints
│   │   │   ├── alert-api.ts              # Alert retrieval endpoint
│   │   │   └── matching-api.ts           # Community logic (matches/groups)
│   │   ├── services/
│   │   │   ├── kv-service.ts             # KV operations (getProfile, saveProfile, etc)
│   │   │   ├── gemini-service.ts         # Gemini API calls with timeout
│   │   │   ├── health-service.ts         # Health data management
│   │   │   ├── matching-service.ts       # Algorithm + groups
│   │   │   ├── alert-service.ts          # Crisis detection & alerts
│   │   │   ├── wellness-service.ts       # Metrics calculation
│   │   │   ├── conversation-summary.ts   # Summary generation
│   │   │   └── word-cloud.ts             # Word frequency analysis
│   │   ├── types/
│   │   │   └── index.ts                  # SeniorProfile interface & types
│   │   └── utils/
│   │       └── helpers.ts
│   ├── tests/
│   │   ├── index.test.ts                 # API endpoint tests (Task 3.1)
│   │   ├── health.test.ts                # Health check tests (pre-existing)
│   │   └── [service].test.ts             # Service-specific unit tests
│   ├── wrangler.toml
│   └── package.json
├── dashboard/
│   ├── src/
│   │   ├── App.tsx                       # 4-tab navigation
│   │   ├── components/
│   │   │   ├── LiveCallView.tsx
│   │   │   ├── SeniorProfileView.tsx
│   │   │   ├── HealthOverviewCard.tsx
│   │   │   ├── ConversationHistoryCard.tsx
│   │   │   ├── CommunityView.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── AnalyticsView.tsx
│   │   │   └── WellnessScore.tsx
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── styles/
│   │   │   └── globals.css               # Tailwind + design tokens
│   │   └── types/
│   │       └── index.ts
│   ├── test/
│   │   ├── LiveCallView.test.tsx
│   │   └── CommunityView.test.tsx
│   ├── package.json
│   └── vite.config.ts
├── scripts/
│   ├── init-demo-data.ts                 # Run at Hour 0!
│   └── create-backup-materials.ts        # Hour 22
├── docs/
│   ├── demo-script.md                    # 3-minute script
│   └── backup-transcripts/
├── recordings/                            # 4 backup audio files
├── screenshots/                           # 4 dashboard states
├── PRD.md                                 # This document
├── TASK_LIST.md                           # To be updated
├── CLAUDE.md                              # Development guide
└── README.md
```

---

## 13. Testing Checklist

### Hour 2:
- [ ] Worker deployed: `https://elderlink-dev.workers.dev/api/health`
- [ ] Returns: `{"status": "ok"}`

### Hour 6:
- [ ] Vapi webhook receives calls
- [ ] Basic response returns (<3 seconds)
- [ ] No timeout errors

### Hour 8 (CRITICAL):
- [ ] Make call: "My daughter Sarah visited"
- [ ] Make second call
- [ ] Sam MUST mention Sarah
- [ ] If fails: STOP AND FIX

### Hour 12:
- [ ] Health mention: "My back hurts"
- [ ] Dashboard shows new health note
- [ ] Community tab shows matches (3)
- [ ] Language switching works

### Hour 16:
- [ ] All 5 success criteria working:
  - [ ] Sam remembers Mrs. Chen
  - [ ] Natural conversation (<3s latency)
  - [ ] Live sentiment updates
  - [ ] Health tracking visible
  - [ ] Matches displayed
- [ ] 3-minute demo rehearsed

### Hour 20:
- [ ] Production deployed
- [ ] Phone number working
- [ ] Dashboard public URL ready
- [ ] 4 backup recordings ready
- [ ] 4 dashboard screenshots ready

---

## 14. Risk Mitigation

### Critical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Call latency >3s | Poor demo experience | Async processing, Gemini Flash, timeout fallback |
| Sam sounds robotic | Demo fails | 20% effort on prompt refinement, practice calls |
| Memory doesn't work | Lost key feature | Pre-seed 5 detailed conversations, test at Hour 8 |
| Health tracking broken | Missing dimension | Mock data, simple extraction, fallback to display only |
| Matching algorithm wrong | Community feature fails | Pre-calculate at Hour 0, simple scoring, manual verify |
| Dashboard crashes | Can't show impact | Screenshots ready, mock data, backup video |

### Go/No-Go Decisions
- **Hour 8:** Memory test fails → Fix before proceeding (ALL STOP)
- **Hour 12:** Health extraction broken → Simplify to display-only
- **Hour 16:** Matching not working → Show static pre-calculated matches
- **Hour 18:** Feature freeze → Only fixes, no new features

---

## 15. Success Metrics (ALL 5 Must Work)

### Demo Requirements:
1. ✅ **Sam remembers Mrs. Chen** - References Sarah, tomatoes, previous topics
2. ✅ **Natural conversation** - <3 seconds response, no robotic feel
3. ✅ **Live sentiment tracking** - Dashboard updates every 2 seconds
4. ✅ **Health monitoring** - Proactive checks, notes created, MyChart visible
5. ✅ **Community matching** - 3 matches displayed, groups suggested

### Judge Wow Factors:
- "Sam actually remembers our conversation from last week!"
- "The latency is so fast, it feels like talking to a real person"
- "Health symptoms get documented automatically - my doctor would love this"
- "Look, she found 3 other Mandarin-speaking gardeners nearby!"
- "This holistic approach - mental, physical, social - is exactly what seniors need"

### Quantitative Impact (Demo Data):
- 147 total conversations (across 4 seniors)
- 23 health notes sent to MyChart
- 8 successful matches made
- 2 groups auto-generated
- 42% mental wellness improvement
- 78/100 holistic wellness score

---

## 16. Pre-Hackathon Checklist

### BEFORE Hour 0:
- [ ] All API keys obtained (Gemini, ElevenLabs, Vapi, Cloudflare)
- [ ] Vapi phone number purchased
- [ ] KV namespaces created
- [ ] Git repo created with branch structure
- [ ] init-demo-data.ts script ready
- [ ] All 3 prompts written and reviewed
- [ ] Team roles clearly assigned
- [ ] Demo script printed
- [ ] Backup plan materials list created

---

## END OF PRD v4.0

**ElderLink: Holistic Elder Care Through AI Companionship**

**Mission:** No senior should face loneliness, declining health, or isolation alone.

**Innovation:** One AI companion (Sam) → Three transformations:
- Mental wellbeing through conversation
- Physical health through monitoring
- Social connection through community

**Technical Stack:**
- Vapi (Phone + Language Detection)
- ElevenLabs (Voice Synthesis)
- Gemini 1.5 Flash (Intelligence, <3s latency)
- Cloudflare Workers + KV (Scale + Speed)

**Demo Story:**
Mrs. Chen calls Sam → Sam remembers her, checks her health, speaks Mandarin → Dashboard shows impact → Community connections suggested → Holistic wellness score improving

**Remember:** You're building a companion that bridges gaps - between doctor visits, between family calls, between isolated seniors. Every feature should reinforce warmth, health awareness, and human connection.
