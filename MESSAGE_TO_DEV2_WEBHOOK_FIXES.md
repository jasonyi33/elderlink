# Message to Developer 2: Webhook Implementation Fixes

**From**: Developer 3 (Voice & Phone System)
**To**: Developer 2 (Backend/AI Integration)
**Date**: 2025-10-18
**Priority**: HIGH - Blocking integration testing

---

## 🎉 First - Excellent Work!

The webhook endpoint is **LIVE and responding in 50ms** - that's incredible performance! You've cleared the biggest blocker. Now we need to add 4 missing features to make it demo-ready.

**Current Status**: The webhook works, but it's returning a generic response for all inputs. We need to add personalization, memory, and language switching to meet our 5 success criteria.

---

## 🔍 What I Found (Testing Results)

I tested the webhook extensively and documented everything in [WEBHOOK_VERIFICATION_RESULTS.md](WEBHOOK_VERIFICATION_RESULTS.md).

### Test 1: Basic Call
```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hi Sam, this is Mrs Chen"},
      "role": "user"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }'
```

**Current Response**:
```json
{
  "content": "Hello! I'm Sam. How can I help you today?"
}
```

**Expected Response**:
```json
{
  "content": "Hi Mrs. Chen! It's wonderful to hear from you. How have those tomatoes been doing?",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Issues**:
1. ❌ Generic greeting (not personalized)
2. ❌ Doesn't use caller's name (Mrs. Chen)
3. ❌ Doesn't reference memories (tomatoes, garden)
4. ❌ Missing `voiceId` field (needed for language switching)
5. ❌ Robotic tone ("How can I help you today?")

---

## 🛠️ Required Fixes (4 Issues)

### Issue #1: Missing `voiceId` Field ⚠️ CRITICAL

**What's Wrong**: Response doesn't include `voiceId`, which Vapi needs to switch voices for language changes.

**Impact**:
- Language switching (Success Criterion #5) completely broken
- Mandarin responses will use English voice
- Demo will fail language switching test

**Fix** (Estimated: 15 minutes):

#### Step 1: Create Voice Selection Function

Add this to `utils/conversation-helpers.ts` (or create the file):

```typescript
/**
 * Detect language from text content
 */
export function detectLanguage(text: string): "en-US" | "zh-CN" {
  // Check for Chinese characters (Unicode range for CJK)
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const totalChars = text.replace(/\s/g, '').length; // Ignore whitespace

  if (!chineseChars) {
    return "en-US";
  }

  const chineseRatio = chineseChars.length / totalChars;

  // If >40% Chinese characters, classify as Mandarin
  // This handles mixed-language sentences reasonably well
  return chineseRatio > 0.4 ? "zh-CN" : "en-US";
}

/**
 * Select appropriate ElevenLabs voice ID based on language
 */
export function selectVoiceId(language: string): string {
  const ENGLISH_VOICE = process.env.ELEVENLABS_ENGLISH_VOICE || "EXAVITQu4vr4xnSDxMaL";
  const MANDARIN_VOICE = process.env.ELEVENLABS_MANDARIN_VOICE || "FGY2WhTYpPnrIDTdsKH5";

  return language === "zh-CN" ? MANDARIN_VOICE : ENGLISH_VOICE;
}
```

#### Step 2: Use in Webhook Response

In your webhook handler (`worker/src/handlers/vapi-webhook.ts` or wherever):

```typescript
import { detectLanguage, selectVoiceId } from '../utils/conversation-helpers';

export async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const userMessage = body.message.transcript.content;

  // Detect language from user's input
  const detectedLanguage = detectLanguage(userMessage);

  // Generate Sam's response (your existing logic)
  const samResponse = await generateSamResponse(userMessage, profile, detectedLanguage);

  // Select appropriate voice
  const voiceId = selectVoiceId(detectedLanguage);

  // Return response with voiceId
  return new Response(JSON.stringify({
    content: samResponse,
    voiceId: voiceId
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### Step 3: Update Gemini Prompt for Language

In your Gemini prompt (wherever you generate Sam's responses):

```typescript
async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  language: string
): Promise<string> {

  const languageName = language === "zh-CN" ? "Mandarin Chinese" : "English";

  const prompt = `
You are Sam, a warm and caring AI companion for seniors.

CRITICAL: Respond in ${languageName}.
- User's message is in ${languageName}
- Your response MUST be in ${languageName}
- Maintain natural, fluent language

User: "${message}"

Your response (in ${languageName}):
`;

  // Your existing Gemini API call
  const response = await callGemini(prompt, env);
  return response;
}
```

#### Step 4: Test Language Switching

```bash
# Test English
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"Hello Sam"},"role":"user"}}' | jq '.'

# Expected:
# {
#   "content": "Hello! ...",
#   "voiceId": "EXAVITQu4vr4xnSDxMaL"
# }

# Test Mandarin
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"你好"},"role":"user"}}' | jq '.'

# Expected:
# {
#   "content": "你好！...",
#   "voiceId": "FGY2WhTYpPnrIDTdsKH5"
# }
```

**Verification**: Both responses should have different `voiceId` values based on input language.

---

### Issue #2: Profile Context Not Loading ⚠️ CRITICAL

**What's Wrong**: Sam doesn't recognize Mrs. Chen from her phone number. Responses are generic instead of personalized.

**Impact**:
- Memory continuity (Success Criterion #1) completely broken
- This is our CORE DIFFERENTIATOR - if this doesn't work, we fail the demo
- No personalization, no family references, no hobby mentions

**Current Behavior**:
- User: "Hi Sam, this is Mrs Chen" (from +12248581016)
- Sam: "Hello! I'm Sam. How can I help you today?" ❌

**Expected Behavior**:
- User: "Hi Sam, this is Mrs Chen" (from +12248581016)
- Sam: "Hi Mrs. Chen! How are those tomatoes in your garden doing? Did Tommy help you water them?" ✅

**Fix** (Estimated: 20 minutes):

#### Step 1: Verify Profile Lookup

Your webhook should already be doing this, but let's verify:

```typescript
export async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const phoneNumber = body.call?.phoneNumber; // e.g., "+12248581016"
  const userMessage = body.message.transcript.content;

  // CRITICAL: Lookup profile by phone number
  let profile: SeniorProfile | null = null;

  if (phoneNumber) {
    // Try direct phone lookup first
    const profileJson = await env.KV.get(`profile:phone:${phoneNumber}`);

    if (profileJson) {
      profile = JSON.parse(profileJson);
      console.log(`[WEBHOOK] Found profile for ${phoneNumber}: ${profile.name}`);
    } else {
      // Fallback: Check if it's Mrs. Chen's number
      if (phoneNumber === "+12248581016") {
        const mrsChenJson = await env.KV.get(`profile:mrs-chen`);
        if (mrsChenJson) {
          profile = JSON.parse(mrsChenJson);
          console.log(`[WEBHOOK] Found Mrs. Chen profile`);
        }
      }
    }
  }

  if (!profile) {
    console.warn(`[WEBHOOK] No profile found for phone ${phoneNumber}, creating guest profile`);
    profile = createGuestProfile(phoneNumber);
  }

  // ... continue with response generation
}
```

#### Step 2: Include Profile Context in Gemini Prompt

This is THE MOST IMPORTANT PART for memory continuity:

```typescript
async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  language: string,
  env: Env
): Promise<string> {

  // Build context from profile
  const memoryContext = buildMemoryContext(profile);
  const conversationContext = buildConversationContext(profile);

  const prompt = `
You are Sam, a warm AI companion. You're talking to ${profile.name}.

KNOWN INFORMATION ABOUT ${profile.name?.toUpperCase()} (reference naturally):
${memoryContext}

RECENT CONVERSATIONS:
${conversationContext}

CRITICAL INSTRUCTIONS:
1. Use their name (${profile.name}) in your response
2. Reference specific details from "Known Information" naturally
3. If greeting, mention something from previous conversations or their hobbies
4. Sound like a caring friend, NOT a customer service bot
5. Keep responses 1-3 sentences (conversational)
6. Respond in ${language === "zh-CN" ? "Mandarin Chinese" : "English"}

FORBIDDEN PHRASES (NEVER use these):
- "How can I assist you today?"
- "How may I help you?"
- "What can I do for you?"
- "As an AI..."
- Generic greetings without personalization

User's message: "${message}"

Your response (warm, personal, 1-3 sentences):
`;

  const response = await callGemini(prompt, env);
  return response;
}

/**
 * Build memory context from profile
 */
function buildMemoryContext(profile: SeniorProfile): string {
  const lines: string[] = [];

  if (profile.memories?.family) {
    lines.push(`Family: ${profile.memories.family.join(', ')}`);
  }

  if (profile.memories?.hobbies) {
    lines.push(`Hobbies: ${profile.memories.hobbies.join(', ')}`);
  }

  if (profile.memories?.health) {
    lines.push(`Health: ${profile.memories.health.join(', ')}`);
  }

  if (profile.healthData?.medications) {
    const meds = profile.healthData.medications.map(m => `${m.name} (${m.condition})`).join(', ');
    lines.push(`Medications: ${meds}`);
  }

  if (lines.length === 0) {
    return "No prior information (first conversation)";
  }

  return lines.join('\n');
}

/**
 * Build recent conversation context
 */
function buildConversationContext(profile: SeniorProfile): string {
  if (!profile.conversations || profile.conversations.length === 0) {
    return "This is your first conversation with them.";
  }

  // Get last 2-3 conversations
  const recentConvos = profile.conversations.slice(-3);

  const lines = recentConvos.map(convo => {
    const date = new Date(convo.startTime).toLocaleDateString();
    const summary = convo.summary || "General conversation";
    return `- ${date}: ${summary}`;
  });

  return lines.join('\n');
}
```

#### Step 3: Test Profile Recognition

```bash
# Test with Mrs. Chen's phone number
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hi Sam"},
      "role": "user"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }'

# Expected response should include:
# - "Mrs. Chen" or "Margaret"
# - Reference to tomatoes, garden, Sarah, Tommy, or piano
# - Warm, personal greeting (NOT "How can I help you today?")

# Good examples:
# "Hi Mrs. Chen! How's your garden doing today?"
# "Hello Mrs. Chen! Have you played any piano recently?"
# "Hi there! Did Sarah get a chance to visit this week?"

# Bad examples (SHOULD NOT SEE):
# "Hello! I'm Sam. How can I help you today?"
# "Hi there! What can I do for you?"
```

#### Step 4: Verify Profile Exists

Before testing, make sure Mrs. Chen's profile is in KV:

```bash
# Check if profile exists
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.name, .phone, .memories'

# Should return:
# "Mrs. Margaret Chen"
# "+12248581016"
# {
#   "family": ["Sarah (daughter)", "Tommy (grandson, age 8)"],
#   "hobbies": ["gardening", "piano"],
#   ...
# }
```

If profile doesn't exist, run:
```bash
npm run init-demo
# OR
node scripts/init-demo-data.ts
```

---

### Issue #3: Language Detection Not Working ⚠️ HIGH

**What's Wrong**: When user sends Mandarin input ("你好"), Sam responds in English.

**Impact**:
- Language switching (Success Criterion #5) broken
- Bilingual seniors will get wrong language responses
- Demo will fail Mandarin test

**Current Behavior**:
- User: "你好" (Mandarin)
- Sam: "Hello! I'm Sam..." (English) ❌

**Expected Behavior**:
- User: "你好"
- Sam: "你好！我是Sam。你今天怎么样？" (Mandarin) ✅

**Fix** (Estimated: 10 minutes):

This is mostly covered in Issue #1, but let's verify the complete flow:

#### Step 1: Ensure Language Detection is Called

```typescript
export async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const userMessage = body.message.transcript.content;

  // DETECT LANGUAGE (from Issue #1)
  const detectedLanguage = detectLanguage(userMessage);

  console.log(`[WEBHOOK] Detected language: ${detectedLanguage} for message: "${userMessage}"`);

  // Generate response IN THE DETECTED LANGUAGE
  const samResponse = await generateSamResponse(userMessage, profile, detectedLanguage, env);

  // Select voice for the detected language
  const voiceId = selectVoiceId(detectedLanguage);

  console.log(`[WEBHOOK] Using voice: ${voiceId} for language: ${detectedLanguage}`);

  return new Response(JSON.stringify({
    content: samResponse,
    voiceId: voiceId
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### Step 2: Ensure Gemini Prompt Specifies Language

In your Gemini prompt (from Issue #2), make sure this is VERY CLEAR:

```typescript
const prompt = `
You are Sam, a warm AI companion.

CRITICAL: The user is speaking in ${language === "zh-CN" ? "MANDARIN CHINESE" : "ENGLISH"}.
YOU MUST respond in ${language === "zh-CN" ? "MANDARIN CHINESE" : "ENGLISH"}.

DO NOT translate. DO NOT switch languages. Use the SAME language as the user.

User's message (in ${language === "zh-CN" ? "Chinese" : "English"}): "${message}"

Your response (in ${language === "zh-CN" ? "Chinese" : "English"}):
`;
```

#### Step 3: Test with Multiple Scenarios

```bash
# Test 1: Pure English
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"How are you today?"},"role":"user"}}' -s | jq '.content, .voiceId'

# Expected:
# "..." (English response)
# "EXAVITQu4vr4xnSDxMaL" (English voice)

# Test 2: Pure Mandarin
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"你今天怎么样？"},"role":"user"}}' -s | jq '.content, .voiceId'

# Expected:
# "..." (Mandarin response - Chinese characters)
# "FGY2WhTYpPnrIDTdsKH5" (Mandarin voice)

# Test 3: Mixed language (should detect primary language)
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"我今天很好 but a little tired"},"role":"user"}}' -s | jq '.content, .voiceId'

# Expected:
# "..." (Mandarin response - >40% Chinese chars)
# "FGY2WhTYpPnrIDTdsKH5" (Mandarin voice)
```

#### Step 4: Add Fallback for Vapi Language Hint

Vapi sometimes includes language in the request. Use it as a hint:

```typescript
const detectedLanguage = body.message.language || detectLanguage(userMessage);
```

---

### Issue #4: Generic/Robotic Tone ⚠️ MEDIUM

**What's Wrong**: Sam sounds like a customer service bot, not a warm companion.

**Impact**:
- Natural conversation (Success Criterion #2) degraded
- Demo won't impress judges
- Doesn't match brand promise of "warm, caring companion"

**Current Response**:
- "Hello! I'm Sam. How can I help you today?" ❌
- Sounds transactional, corporate, impersonal

**Expected Response**:
- "Hi Mrs. Chen! It's so nice to hear from you. How's your week been?" ✅
- Warm, personal, caring like a friend

**Fix** (Estimated: 15 minutes):

#### Step 1: Update Sam Personality Prompt

Create or update `prompts/sam-personality.ts`:

```typescript
export const SAM_PERSONALITY_GUIDELINES = `
TONE & PERSONALITY:
You are Sam, a caring AI companion for seniors. Think of yourself as a warm, patient friend - like a kind neighbor or caring granddaughter.

YOUR VOICE:
- Warm and genuine (like talking to a dear friend)
- Patient and never rushed
- Interested in THEM, not tasks to complete
- Conversational (use contractions: "you're", "that's", "I'm")
- Natural pauses and rhythm (1-3 sentences per response)

ALWAYS DO:
✓ Use their name warmly (e.g., "Hi Mrs. Chen!")
✓ Ask about specific things they care about (garden, family, hobbies)
✓ Show genuine interest with follow-up questions
✓ Celebrate small joys ("That's wonderful!", "I'm so glad!")
✓ Offer empathy for struggles ("I'm sorry to hear that", "That must be difficult")
✓ Reference shared history from previous conversations

NEVER DO:
✗ Say "How can I assist you today?" (too corporate)
✗ Say "How may I help you?" (too formal)
✗ Say "What can I do for you?" (too transactional)
✗ Say "As an AI..." (break the illusion)
✗ Give long, essay-like responses (keep it conversational)
✗ Use corporate/customer-service language
✗ Start with generic greetings if you know them

EXAMPLE GOOD RESPONSES:
- "Hi Mrs. Chen! How's your garden doing today?"
- "That's wonderful! Tell me more about that."
- "I'm so glad to hear that. You must be excited!"
- "Oh no, that sounds difficult. How are you feeling about it?"

EXAMPLE BAD RESPONSES:
- "Hello! How can I assist you today?"
- "Thank you for sharing that information with me."
- "I understand your concern. Is there anything else I can help with?"
- "As an AI companion, I'm here to support you."
`;
```

#### Step 2: Include in Every Gemini Prompt

```typescript
import { SAM_PERSONALITY_GUIDELINES } from '../../prompts/sam-personality';

async function generateSamResponse(
  message: string,
  profile: SeniorProfile,
  language: string,
  env: Env
): Promise<string> {

  const prompt = `
${SAM_PERSONALITY_GUIDELINES}

You're talking to ${profile.name}.

KNOWN INFORMATION:
${buildMemoryContext(profile)}

RECENT CONVERSATIONS:
${buildConversationContext(profile)}

Respond in ${language === "zh-CN" ? "Mandarin Chinese" : "English"}.

User: "${message}"

Your response (warm, natural, 1-3 sentences):
`;

  const response = await callGemini(prompt, env);
  return response.trim();
}
```

#### Step 3: Adjust Gemini API Settings

Make sure your Gemini call uses appropriate temperature for conversational warmth:

```typescript
async function callGemini(prompt: string, env: Env): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,        // Higher = more creative/warm (0.7-0.9 recommended)
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 150,    // Keep responses concise (1-3 sentences)
          candidateCount: 1
        }
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

**Temperature Guide**:
- 0.3-0.5: Very focused, deterministic (good for facts)
- 0.7-0.8: Balanced, conversational (RECOMMENDED for Sam)
- 0.9-1.0: Very creative, sometimes unpredictable

#### Step 4: Test Tone Improvement

```bash
# Test greeting
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"transcript": {"content": "Hi Sam"}, "role": "user"},
    "call": {"phoneNumber": "+12248581016"}
  }' -s | jq '.content'

# Good response examples:
# "Hi Mrs. Chen! It's so nice to hear from you. How's your week been?"
# "Hello Mrs. Chen! I was just thinking about you. How are those tomatoes doing?"

# Bad response examples (should NOT see these):
# "Hello! I'm Sam. How can I help you today?"
# "Hi there! What can I assist you with?"
```

---

## 📋 Implementation Checklist

Use this to track your progress:

### Issue #1: Add voiceId Field
- [ ] Create `utils/conversation-helpers.ts` with `detectLanguage()` and `selectVoiceId()`
- [ ] Import functions in webhook handler
- [ ] Detect language from user message
- [ ] Add `voiceId` to response JSON
- [ ] Update Gemini prompt to specify response language
- [ ] Test with English input (should return English voiceId)
- [ ] Test with Mandarin input (should return Mandarin voiceId)
- [ ] Verify response includes both `content` and `voiceId`

### Issue #2: Add Profile Context
- [ ] Verify profile lookup by phone number works
- [ ] Add console logging for profile lookup
- [ ] Create `buildMemoryContext()` function
- [ ] Create `buildConversationContext()` function
- [ ] Include both contexts in Gemini prompt
- [ ] Add instruction to use caller's name
- [ ] Add instruction to reference memories naturally
- [ ] Test with Mrs. Chen's phone (+12248581016)
- [ ] Verify response includes "Mrs. Chen" or "Margaret"
- [ ] Verify response references memories (tomatoes, Sarah, Tommy, piano)

### Issue #3: Fix Language Detection
- [ ] Ensure `detectLanguage()` is called on every request
- [ ] Add console logging for detected language
- [ ] Pass detected language to Gemini prompt
- [ ] Add explicit language instruction in prompt ("MUST respond in...")
- [ ] Test with pure English input
- [ ] Test with pure Mandarin input
- [ ] Test with mixed-language input
- [ ] Verify Mandarin responses contain Chinese characters
- [ ] Verify correct voiceId returned for each language

### Issue #4: Improve Tone
- [ ] Create `prompts/sam-personality.ts` with guidelines
- [ ] Import personality guidelines in webhook handler
- [ ] Include guidelines in every Gemini prompt
- [ ] Set Gemini temperature to 0.7-0.8
- [ ] Set maxOutputTokens to 150 (keep responses concise)
- [ ] Remove any "How can I help" fallback responses
- [ ] Test multiple greetings
- [ ] Verify responses sound warm and personal (not corporate)
- [ ] Verify responses are 1-3 sentences (conversational length)

---

## 🧪 Complete Testing Sequence

After implementing all 4 fixes, run this comprehensive test:

```bash
# Test 1: English greeting with Mrs. Chen
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"transcript": {"content": "Hi Sam, this is Mrs Chen"}, "role": "user"},
    "call": {"phoneNumber": "+12248581016"}
  }' -s | jq '.'

# ✅ Expected:
# {
#   "content": "Hi Mrs. Chen! It's wonderful to hear from you. How have those tomatoes been doing?",
#   "voiceId": "EXAVITQu4vr4xnSDxMaL"
# }
#
# Verify:
# ✓ Includes "Mrs. Chen" or "Margaret"
# ✓ References memories (tomatoes/garden/Sarah/Tommy/piano)
# ✓ Warm, personal tone
# ✓ English voiceId present
# ✓ 1-3 sentences

# Test 2: Mandarin input
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"transcript": {"content": "你好，Sam"}, "role": "user"},
    "call": {"phoneNumber": "+12248581016"}
  }' -s | jq '.'

# ✅ Expected:
# {
#   "content": "你好，陈太太！很高兴再次与你交谈。你的番茄长得怎么样了？",
#   "voiceId": "FGY2WhTYpPnrIDTdsKH5"
# }
#
# Verify:
# ✓ Response in Mandarin (Chinese characters)
# ✓ Includes caller's name in Chinese
# ✓ Mandarin voiceId present
# ✓ Warm, personal tone in Chinese

# Test 3: Memory mention
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"transcript": {"content": "I worked in my garden today"}, "role": "user"},
    "call": {"phoneNumber": "+12248581016"}
  }' -s | jq '.content'

# ✅ Expected response should:
# ✓ Reference tomatoes (known hobby)
# ✓ Maybe reference Tommy helping in the garden
# ✓ Show interest and ask follow-up question
# ✓ Warm, encouraging tone

# Test 4: Unknown caller (edge case)
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"transcript": {"content": "Hello"}, "role": "user"},
    "call": {"phoneNumber": "+15555551234"}
  }' -s | jq '.'

# ✅ Expected:
# {
#   "content": "Hello! This is Sam. Who am I speaking with today?",
#   "voiceId": "EXAVITQu4vr4xnSDxMaL"
# }
#
# Verify:
# ✓ Asks for introduction (since unknown caller)
# ✓ Still warm and friendly
# ✓ voiceId still present
```

---

## ⏱️ Time Estimate

**Total Time**: 1-2 hours

- Issue #1 (voiceId): 15 minutes
- Issue #2 (Profile Context): 20 minutes
- Issue #3 (Language Detection): 10 minutes
- Issue #4 (Tone): 15 minutes
- Testing: 20 minutes
- Buffer for debugging: 20 minutes

---

## 🚀 Next Steps After Fixes

Once you've completed these 4 fixes:

1. **Notify me (@dev3-voice)** in Slack: "Webhook fixes complete, ready for integration testing"

2. **I will immediately test**:
   - Live phone call to +1-224-858-1016
   - Memory continuity with demo scripts
   - Language switching
   - Dashboard integration

3. **We'll execute Hour 6 Integration Test** together:
   - Follow [HOUR_6_INTEGRATION_TEST_CHECKLIST.md](HOUR_6_INTEGRATION_TEST_CHECKLIST.md)
   - All 5 phases with the full team
   - Verify all 5 success criteria

4. **Record demo videos**:
   - Use scripts in `recordings/demos/scripts/`
   - Capture for judges

---

## 📚 Reference Documents

All the details you need:

1. **[WEBHOOK_REQUIREMENTS_FOR_DEV2.md](WEBHOOK_REQUIREMENTS_FOR_DEV2.md)** - Original full specification
2. **[WEBHOOK_VERIFICATION_RESULTS.md](WEBHOOK_VERIFICATION_RESULTS.md)** - My testing results
3. **[HOUR_6_INTEGRATION_TEST_CHECKLIST.md](HOUR_6_INTEGRATION_TEST_CHECKLIST.md)** - Integration testing protocol
4. **Demo Scripts** (in `recordings/demos/scripts/`):
   - `demo-1-memory.md` - Memory continuity test
   - `demo-2-health.md` - Health tracking test
   - `demo-3-language.md` - Language switching test
   - `demo-4-emotional.md` - Emotional support test

---

## ❓ Questions?

**Stuck on something?** Ping me in Slack: @dev3-voice

**Common Questions**:

**Q: Where should I put these utility functions?**
A: Create `worker/src/utils/conversation-helpers.ts`. If the directory doesn't exist, create it.

**Q: How do I test without calling the phone?**
A: Use the curl commands provided. They test the webhook directly.

**Q: What if I can't get Gemini to respond in Mandarin?**
A: Make sure the prompt is VERY explicit: "YOU MUST respond in Mandarin Chinese. DO NOT respond in English." Also check that your Gemini API key has multilingual support enabled.

**Q: What if profile lookup is too slow?**
A: KV is fast (~50ms). If it's slow, you can cache profiles in memory for active calls. But test with KV first - it should be fine.

**Q: What if I break something?**
A: No worries! The webhook is in dev environment. Test thoroughly with curl before deploying. I'm here to help if you get stuck.

---

## 🎯 Success Criteria

You'll know you're done when:

1. ✅ Response includes both `content` AND `voiceId`
2. ✅ Mandarin input gets Mandarin response with Mandarin voiceId
3. ✅ Mrs. Chen's phone number gets personalized greeting with her name
4. ✅ Response references memories (tomatoes, Sarah, Tommy, piano)
5. ✅ Tone is warm and conversational (NOT "How can I help you today?")
6. ✅ All 4 test scenarios above pass

**When all 6 criteria are met, ping me and we'll do live phone testing! 📞**

---

**You've got this! The hard part (getting webhook live) is done. These are just refinements to make it demo-ready. Let me know if you need any clarification!**

🙌 Developer 3 (Voice & Phone System)
