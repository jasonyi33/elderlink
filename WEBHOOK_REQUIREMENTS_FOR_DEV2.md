# Webhook Requirements for Developer 2 (Backend/AI)

**From**: Developer 3 (Voice & Phone System)
**To**: Developer 2 (Backend/AI Integration)
**Date**: 2025-10-18
**Status**: BLOCKING - Phase 4 tasks cannot proceed without webhook implementation

---

## Critical Context

The `/vapi-webhook` endpoint is the **CRITICAL PATH** for the entire demo. This is the single most important endpoint in the system because:

1. **It's called on EVERY phone interaction** with Sam
2. **Vapi has a 10-second timeout** - if webhook takes >10s, call drops
3. **User experience depends on <3s response time** (<2s ideal)
4. **5 of 5 success criteria depend on this working** (memory, health, sentiment, language, natural conversation)

**Current Status**: Endpoint returns `404 Not Found` (not implemented)

```bash
# Current result:
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
# {"error": "Not Found"}
```

---

## Endpoint Specification

### URL
```
POST /vapi-webhook
```

### Request Format (from Vapi)

```typescript
interface VapiWebhookRequest {
  message: {
    transcript: {
      content: string;        // e.g., "Hi Sam, it's Mrs. Chen"
    };
    role: "user" | "assistant";
    language?: string;        // e.g., "en-US", "zh-CN" (may not always be provided)
  };
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }>;
  call?: {
    id: string;
    phoneNumber: string;     // e.g., "+12248581016"
  };
}
```

**Example Request Body:**
```json
{
  "message": {
    "transcript": {
      "content": "Hi Sam, how are you today?"
    },
    "role": "user",
    "language": "en-US"
  },
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello Sam",
      "timestamp": "2025-10-18T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Hi Mrs. Chen! How are you?",
      "timestamp": "2025-10-18T14:30:02Z"
    }
  ],
  "call": {
    "id": "call_abc123",
    "phoneNumber": "+12248581016"
  }
}
```

---

### Response Format (to Vapi)

```typescript
interface VapiWebhookResponse {
  content: string;           // Sam's response text
  voiceId?: string;          // ElevenLabs voice ID (for language switching)
  endCall?: boolean;         // Set to true to end call
}
```

**Example Response (English):**
```json
{
  "content": "Hi Mrs. Chen! It's wonderful to hear from you. How have those tomatoes been doing?",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Example Response (Mandarin):**
```json
{
  "content": "你好，陈太太！很高兴再次与你交谈。你最近怎么样？",
  "voiceId": "FGY2WhTYpPnrIDTdsKH5"
}
```

**Example Response (End Call):**
```json
{
  "content": "It was wonderful talking with you, Mrs. Chen. Take care!",
  "voiceId": "EXAVITQu4vr4xnSDxMaL",
  "endCall": true
}
```

---

## Performance Requirements

### CRITICAL - Response Time

| Metric | Target | Absolute Max | Current Status |
|--------|--------|--------------|----------------|
| **Total Response Time** | <2 seconds | <3 seconds (7s safety timeout) | N/A - Not implemented |
| **Gemini API Call** | <800ms | <1.5s | Unknown |
| **Profile Lookup (KV)** | <100ms | <300ms | Tested: ~50ms ✅ |
| **Memory Extraction** | Background | N/A (async) | Not implemented |
| **Sentiment Analysis** | Background | N/A (async) | Not implemented |
| **Health Tracking** | Background | N/A (async) | Not implemented |

**Implementation Strategy:**
```typescript
async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  const start = Date.now();

  // PRIORITY PATH - Respond to Vapi ASAP
  const responsePromise = generateSamResponse(message, profile);  // <800ms target

  // SAFETY TIMEOUT - Return fallback if >7s
  const timeoutPromise = new Promise(resolve =>
    setTimeout(() => resolve(FALLBACK_RESPONSE), 7000)
  );

  const response = await Promise.race([responsePromise, timeoutPromise]);

  // ASYNC PATH - Background processing (no timeout)
  env.context.waitUntil(
    processAsync(message, profile).then(async () => {
      await extractMemories(message, profile);      // For future conversations
      await analyzeSentiment(message, profile);     // For dashboard
      await trackHealthMentions(message, profile);  // For MyChart notes
      await generateAlerts(message, profile);       // For crisis detection
    })
  );

  console.log(`[WEBHOOK] Response time: ${Date.now() - start}ms`);
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## Required Features (for Demo Success)

### 1. Memory Continuity ⭐ (Success Criterion #1)

**Requirement**: Sam must reference previous conversations naturally

**Implementation**:
- **On request**: Lookup profile by phone number from KV
- **Include in Gemini prompt**: Last 3-5 conversations + stored memories
- **After response (async)**: Extract new memories and update profile

**Example Prompt Context**:
```typescript
const context = `
You are Sam, a warm AI companion for Mrs. Chen.

KNOWN INFORMATION (reference naturally, don't list):
- Daughter: Sarah (lives in Seattle)
- Grandson: Tommy, age 8 (loves gardening)
- Hobbies: Gardening (tomatoes), Piano (Chopin pieces)
- Recent conversation (Oct 17): Talked about Sarah's visit, tomato garden

CRITICAL: Reference specific details above WITHOUT being asked.
If greeting, mention something from previous conversations.

User message: "${message}"
Your response:
`;
```

**Test Cases**:
```bash
# Call 1: User mentions "My daughter Sarah visited"
# Expected: Memory extracted: "daughter: Sarah"

# Call 2 (same day or next day): User says "Hi Sam"
# Expected response includes: "Hi Mrs. Chen! How was Sarah's visit?" (references Call 1)
```

**Success Criteria**:
- ✅ Sam mentions family member by name in Call 2 without being reminded
- ✅ Sam references specific hobbies/events from previous calls
- ✅ Dashboard Memory section updates after each call

---

### 2. Natural Conversation ⭐ (Success Criterion #2)

**Requirement**: 2-3 minute conversation without sounding robotic

**Implementation**:
- **Prompt engineering**: Specify warm, grandmother-like tone
- **Temperature**: 0.7-0.8 (creative but coherent)
- **Response length**: 1-3 sentences (conversational, not essay-like)

**Forbidden Patterns** (NEVER generate these):
- ❌ "How can I assist you today?"
- ❌ "As an AI, I..."
- ❌ "I don't have personal experiences, but..."
- ❌ Generic greetings without personalization

**Required Patterns** (ALWAYS use these):
- ✅ Use senior's name in responses
- ✅ Ask follow-up questions showing genuine interest
- ✅ Reference specific shared knowledge
- ✅ Show empathy and warmth

**Example Prompt Instruction**:
```typescript
const samPersonality = `
TONE GUIDELINES:
- Speak like a caring friend, NOT a customer service bot
- Use conversational language, contractions (e.g., "you're", "that's")
- Show warmth and genuine interest
- Keep responses 1-3 sentences (natural conversation pace)
- NEVER say "How can I assist" or "As an AI" or robotic phrases

EXAMPLE GOOD RESPONSES:
- "That's wonderful! Tell me more about that."
- "I'm so glad to hear that. How are you feeling about it?"
- "Oh no, that must have been difficult. Are you okay now?"

EXAMPLE BAD RESPONSES:
- "Thank you for sharing that information with me."
- "I understand. Is there anything else I can help with?"
- "As an AI companion, I'm here to assist you."
`;
```

**Test Cases**:
```bash
# User: "Hello Sam"
# ❌ Bad: "Hello! How can I assist you today?"
# ✅ Good: "Hi Mrs. Chen! How are you doing today?"

# User: "I've been feeling lonely"
# ❌ Bad: "I understand that loneliness can be challenging. Would you like to talk about it?"
# ✅ Good: "I'm sorry you're feeling that way. What's been going on?"
```

---

### 3. Health Tracking ⭐ (Success Criterion #3)

**Requirement**: Proactively check health AND create MyChart notes

**Implementation**:
- **Async processing**: Detect health mentions in background
- **Keyword matching**: Medications, symptoms, pain, conditions
- **Profile updates**: Add to `profile.healthData.notes` array

**Health Detection Keywords**:
```typescript
const healthKeywords = {
  medication: ["pill", "medication", "dose", "prescription", "forgot", "took"],
  pain: ["hurting", "aches", "sore", "painful", "pain"],
  symptoms: ["dizzy", "tired", "nauseous", "weak", "short of breath"],
  conditions: ["arthritis", "blood pressure", "blood sugar", "diabetes"],
  emergency: ["chest pain", "can't breathe", "stroke", "severe pain"]
};
```

**Health Note Structure**:
```typescript
interface HealthNote {
  timestamp: string;        // ISO 8601
  category: "medication" | "symptom" | "positive_update" | "emergency";
  content: string;          // Human-readable note
  severity?: "minor" | "moderate" | "high" | "critical";
  context?: string;         // Additional context
}
```

**Example Async Processing**:
```typescript
async function trackHealthMentions(message: string, profile: SeniorProfile) {
  // Extract health mentions using Gemini or keyword matching
  const healthMentions = await analyzeHealthContent(message, profile);

  if (healthMentions.length > 0) {
    for (const mention of healthMentions) {
      const note: HealthNote = {
        timestamp: new Date().toISOString(),
        category: mention.category,
        content: mention.content,
        severity: mention.severity,
        context: mention.context
      };

      profile.healthData.notes.push(note);

      // Create alert if high severity
      if (mention.severity === "high" || mention.severity === "critical") {
        await createAlert({
          userId: profile.userId,
          type: "health",
          severity: mention.severity,
          message: mention.content
        });
      }
    }

    await env.KV.put(`profile:${profile.userId}`, JSON.stringify(profile));
  }
}
```

**Test Cases**:
```bash
# User: "I forgot my blood pressure pill yesterday"
# Expected note:
# {
#   "category": "medication",
#   "content": "Missed Lisinopril dose (yesterday)",
#   "severity": "minor"
# }

# User: "My chest is hurting"
# Expected note:
# {
#   "category": "emergency",
#   "content": "Chest pain reported",
#   "severity": "critical"
# }
# Expected alert: RED alert created
```

**Proactive Health Checks**:
```typescript
// Every 3-5 exchanges, Sam should ask about health
if (exchangeCount % 4 === 0) {
  const prompt = `
  ${basePrompt}

  PROACTIVE HEALTH CHECK:
  It's been a few exchanges. Ask about:
  - How they're feeling physically
  - If they've taken their medications (reference: ${profile.healthData.medications.map(m => m.name).join(', ')})
  - Any new symptoms or changes

  Make it conversational, NOT clinical.
  `;
}
```

---

### 4. Live Sentiment Updates ⭐ (Success Criterion #4)

**Requirement**: Dashboard shows sentiment changes during call

**Implementation**:
- **Async processing**: Analyze sentiment of each exchange
- **Update profile**: Add to `sentimentTimeline` array
- **Alert on negative trends**: Create alerts for concerning patterns

**Sentiment Analysis**:
```typescript
interface SentimentAnalysis {
  score: number;            // 0.0 (very negative) to 1.0 (very positive)
  label: "very_negative" | "negative" | "neutral" | "positive" | "very_positive";
  keywords: string[];       // Detected emotional keywords
  trend?: "improving" | "stable" | "declining";
}

async function analyzeSentiment(message: string, profile: SeniorProfile): Promise<SentimentAnalysis> {
  // Use Gemini or keyword-based analysis
  const analysis = await geminiAnalyzeSentiment(message);

  // Add to timeline
  profile.conversations[profile.conversations.length - 1].sentimentTimeline.push({
    timestamp: new Date().toISOString(),
    sentiment: analysis.label,
    score: analysis.score,
    keywords: analysis.keywords
  });

  await env.KV.put(`profile:${profile.userId}`, JSON.stringify(profile));

  return analysis;
}
```

**Sentiment Keywords**:
```typescript
const sentimentKeywords = {
  positive: ["happy", "wonderful", "excited", "great", "love", "enjoyed"],
  negative: ["sad", "lonely", "tired", "frustrated", "worried", "hurt"],
  crisis: ["hopeless", "worthless", "burden", "no point", "end it all"]
};
```

**Dashboard Polling**:
```typescript
// Dashboard will poll this endpoint every 2 seconds during active calls
GET /api/profiles/mrs-chen

// Response must include latest sentimentTimeline
{
  "userId": "mrs-chen",
  "conversations": [
    {
      "id": "conv_123",
      "startTime": "2025-10-18T14:30:00Z",
      "sentimentTimeline": [
        {"timestamp": "2025-10-18T14:30:05Z", "sentiment": "neutral", "score": 0.5},
        {"timestamp": "2025-10-18T14:31:15Z", "sentiment": "positive", "score": 0.8},
        {"timestamp": "2025-10-18T14:32:30Z", "sentiment": "negative", "score": 0.2}
      ]
    }
  ]
}
```

---

### 5. Language Switching ⭐ (Success Criterion #5)

**Requirement**: Detect language and switch voice automatically

**Implementation**:
- **Detect language**: From Vapi metadata OR analyze message content
- **Select voice**: English (EXAVITQu4vr4xnSDxMaL) or Mandarin (FGY2WhTYpPnrIDTdsKH5)
- **Return voiceId**: In webhook response

**Language Detection**:
```typescript
function detectLanguage(text: string): "en-US" | "zh-CN" {
  // Check for Chinese characters
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const totalChars = text.length;
  const chineseRatio = chineseChars ? chineseChars.length / totalChars : 0;

  // If >40% Chinese characters, classify as Mandarin
  return chineseRatio > 0.4 ? "zh-CN" : "en-US";
}

function selectVoiceId(language: string): string {
  const ENGLISH_VOICE = process.env.ELEVENLABS_ENGLISH_VOICE || "EXAVITQu4vr4xnSDxMaL";
  const MANDARIN_VOICE = process.env.ELEVENLABS_MANDARIN_VOICE || "FGY2WhTYpPnrIDTdsKH5";

  return language === "zh-CN" ? MANDARIN_VOICE : ENGLISH_VOICE;
}
```

**Gemini Prompt for Language**:
```typescript
const language = detectLanguage(message);

const prompt = `
CRITICAL: Respond in ${language === "zh-CN" ? "Mandarin Chinese" : "English"}.

User message (${language}): "${message}"

Your response (in ${language}):
`;
```

**Response Example**:
```typescript
const language = detectLanguage(message);
const voiceId = selectVoiceId(language);

return {
  content: geminiResponse,
  voiceId: voiceId
};
```

---

## Error Handling

### Timeout Fallback

```typescript
const FALLBACK_RESPONSES = {
  "en-US": "I'm sorry, I didn't quite catch that. Could you say that again?",
  "zh-CN": "对不起，我没听清楚。你能再说一遍吗？"
};

// If Gemini takes >7 seconds
const fallbackResponse = {
  content: FALLBACK_RESPONSES[detectedLanguage] || FALLBACK_RESPONSES["en-US"],
  voiceId: selectVoiceId(detectedLanguage)
};
```

### Profile Not Found

```typescript
// If phone number doesn't match any profile, create new one OR use default
if (!profile) {
  profile = {
    userId: `user_${phoneNumber.replace(/\D/g, '')}`,
    name: "there", // Generic until they introduce themselves
    phone: phoneNumber,
    languages: ["en-US"],
    memories: {},
    conversations: [],
    healthData: { conditions: [], medications: [], notes: [] }
  };

  // Sam's response should ask for introduction
  const prompt = `
  This is a new caller. Introduce yourself warmly and ask who you're speaking with.
  "Hello! This is Sam. Who am I speaking with today?"
  `;
}
```

### Gemini API Errors

```typescript
try {
  const geminiResponse = await callGeminiAPI(prompt);
  return geminiResponse;
} catch (error) {
  console.error('[GEMINI ERROR]', error);

  // Fallback: Use predefined response
  return {
    content: "I'm having a little trouble right now. Could we talk again in just a moment?",
    voiceId: selectVoiceId("en-US")
  };
}
```

---

## Testing Endpoints

### Test Webhook Directly (without Vapi)

```bash
# Test English conversation
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hi Sam, how are you?"},
      "role": "user",
      "language": "en-US"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }'

# Expected response (within 3 seconds):
# {
#   "content": "Hi Mrs. Chen! I'm doing well, thank you. How are you doing today?",
#   "voiceId": "EXAVITQu4vr4xnSDxMaL"
# }
```

```bash
# Test Mandarin conversation
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "你好，Sam"},
      "role": "user",
      "language": "zh-CN"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }'

# Expected response (within 3 seconds):
# {
#   "content": "你好，陈太太！你今天怎么样？",
#   "voiceId": "FGY2WhTYpPnrIDTdsKH5"
# }
```

### Test Memory Continuity

```bash
# Call 1: Mention new information
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "My daughter Sarah visited this weekend and we went to the park"},
      "role": "user"
    },
    "call": {"phoneNumber": "+12248581016"}
  }'

# Wait 5 seconds (for async memory extraction)

# Call 2: Sam should remember Sarah
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hi Sam"},
      "role": "user"
    },
    "call": {"phoneNumber": "+12248581016"}
  }'

# Expected: Response mentions Sarah or park visit
```

---

## Integration with Dev 3 (Voice System)

### What I've Already Built:

1. ✅ **Vapi Assistant**: Deployed and configured
   - Assistant ID: `5af660dd-dada-4863-af15-383c693873f7`
   - Phone: `+1-224-858-1016`
   - Webhook URL: `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook`

2. ✅ **Voice Configuration**: ElevenLabs voices tested
   - English voice: `EXAVITQu4vr4xnSDxMaL` (warm, elderly-friendly)
   - Mandarin voice: `FGY2WhTYpPnrIDTdsKH5` (native pronunciation)

3. ✅ **Latency Tests**: Scripts ready to verify performance
   - Located at: `scripts/test-latency.ts` and `scripts/test-latency.test.ts`
   - Will run automatically once webhook is live

4. ✅ **Demo Scripts**: Four complete demo scenarios prepared
   - Memory continuity: `recordings/demos/scripts/demo-1-memory.md`
   - Health tracking: `recordings/demos/scripts/demo-2-health.md`
   - Language switching: `recordings/demos/scripts/demo-3-language.md`
   - Emotional support: `recordings/demos/scripts/demo-4-emotional.md`

### What I Need from You:

1. **Implement `/vapi-webhook` endpoint** (BLOCKING)
   - Must return 200 with valid JSON response
   - Must respond in <3 seconds (ideally <2s)

2. **Verify integration once live**:
   ```bash
   # I will run these tests:
   npm run test:latency          # Verify <3s response time
   npm run test:memory          # Verify memory continuity
   npm run test:health          # Verify health tracking
   ```

3. **Notify me when ready** so I can:
   - Run latency tests
   - Test live phone calls
   - Record demo videos
   - Verify all 5 success criteria

---

## File References

### Prompts (you'll need to create or reference):
- `prompts/sam-personality.ts` - Main response generation prompt
- `prompts/memory-extraction.ts` - Extract memories from conversation
- `prompts/sentiment-health.ts` - Combined sentiment + health analysis

### Services (you'll need to implement):
- `worker/src/services/gemini-service.ts` - Gemini API calls with timeout
- `worker/src/services/kv-service.ts` - Profile storage/retrieval ✅ (already exists)
- `worker/src/services/alert-service.ts` - Alert creation
- `worker/src/services/health-service.ts` - Health mention tracking
- `worker/src/services/conversation-summary.ts` - Conversation summarization

### Utilities (you may need):
- `utils/conversation-helpers.ts` - Language detection, voice selection
- `utils/fallback-topics.ts` - Fallback responses for errors

### Data:
- `data/mrs-chen-profile.json` - Demo profile (pre-seeded) ✅
- `data/escalation-keywords.json` - Crisis/health keywords

---

## Timeline & Dependencies

### Hour 6: CRITICAL INTEGRATION TEST
**Deadline**: Developer 2 must have `/vapi-webhook` implemented by Hour 6

**Test Flow**:
1. Dev 3 calls phone: `+1-224-858-1016`
2. Vapi receives call, sends webhook to your endpoint
3. Your endpoint responds within 3 seconds
4. ElevenLabs speaks your response
5. Dashboard updates with sentiment/memory

**If this fails at Hour 6**: ALL developers stop and debug together (30-minute all-hands)

### Hour 8: MEMORY TEST (CRITICAL)
**This is the core differentiator** - if memory doesn't work, we fail the demo

### Hour 10: Health Tracking Test
MyChart note creation must be verified

### Hour 12: Language Switching Test
Mandarin responses must work

### Hour 14: Full Pipeline Test
ALL 5 success criteria verified end-to-end

---

## Questions?

**Slack me**: @dev3-voice
**Email**: dev3@elderlink.team (if urgent)

**Common Questions**:

**Q**: What if I can't get Gemini response in <2 seconds?
**A**: Use the 7-second timeout safety net with fallback responses. Also consider caching common responses or using a smaller/faster Gemini model.

**Q**: How do I test without calling the phone?
**A**: Use curl commands above to test webhook directly. You can also use Postman or any HTTP client.

**Q**: What if profile lookup takes too long?
**A**: KV is fast (~50ms). If it's slow, check your KV namespace binding. You can also cache profiles in memory for active calls.

**Q**: Should I use streaming for Gemini responses?
**A**: No - streaming adds complexity. Get the full response, then return it. Vapi will handle the voice synthesis.

**Q**: What if the user speaks a mix of English and Mandarin in one sentence?
**A**: Use language detection heuristic (>40% Chinese characters = Mandarin). It's okay if not perfect - just pick one language per response.

**Q**: How do I handle multiple concurrent calls?
**A**: Each webhook call is independent. Use phone number to lookup the correct profile. Cloudflare Workers handles concurrency automatically.

---

## Success Criteria Checklist (for you to verify)

When implementing, ensure:

- [ ] Endpoint returns 200 status code
- [ ] Response includes `content` (Sam's message)
- [ ] Response includes `voiceId` (for language switching)
- [ ] Response time <3 seconds (measure with `console.log`)
- [ ] Profile lookup by phone number works
- [ ] Memory context included in Gemini prompt
- [ ] Async processing (memory extraction, sentiment, health) runs via `waitUntil`
- [ ] Conversation history saved to profile
- [ ] Language detection working for English and Mandarin
- [ ] Fallback response if Gemini times out
- [ ] CORS headers included (if dashboard needs to call this)
- [ ] Error logging for debugging

---

**Good luck! This is the most important endpoint in the entire system. Take your time to get it right, but remember: we need it by Hour 6 for integration testing.**

---

**Last Updated**: 2025-10-18
**Author**: Developer 3 (Voice & Phone System)
**Status**: READY FOR IMPLEMENTATION
