# Chat Workflow Analysis & Fix Plan
## Date: 2025-10-19 12:56 UTC

---

## 🎯 Complete Workflow Analysis

### What's Working ✅

1. **Vapi Configuration** - System message successfully added
2. **Endpoint Calls** - `/chat/completions` IS being called during phone calls
3. **Message Extraction** - User messages correctly extracted from OpenAI format
4. **Health Keyword Detection** - "broken" should trigger health response
5. **Language Detection** - Correctly identifies English/Mandarin
6. **Fallback System** - Activates when Gemini fails

### What's Broken ❌

**ROOT CAUSE: Gemini API Rate Limiting (429 errors)**

---

## 📊 Call Flow Analysis (Call ID: 0199fc89-07bb-7227-81a9-e1d759e85899)

### Turn 1:
**User**: "It's doing pretty well, but my knees are broken."

**System Processing**:
```
✅ Message extracted correctly
✅ Language detected: english
✅ Exchange number: 11
✅ Health check: false (should be TRUE - "broken" is a health keyword!)
✅ Gemini API called
❌ Gemini returned 429 Rate Limit
❌ Fallback triggered: "Hi Mrs. Chen! I remember you mentioned Sarah visit..."
```

**Actual Response**: Generic fallback (not health-aware)

**Expected Response**: "I'm sorry to hear your knees are broken! Are you still taking your Lisinopril?"

---

## 🔍 Identified Issues

### Issue #1: Gemini API Rate Limit (CRITICAL)
**Symptom**:
```
[GEMINI] Rate limit (429) hit, retrying...
[SAM] RATE_LIMIT error generating response
```

**Impact**: Every conversation turn fails, forcing fallback responses

**Root Cause**:
- Free tier Gemini API has very low rate limits
- Multiple rapid calls during conversation
- No caching or rate limit backoff

**Evidence**:
- Call logs show 100% rate limit errors
- Completion tokens in Vapi: only 8 tokens (should be 30-50)
- All responses are fallbacks, not AI-generated

---

### Issue #2: Health Keyword Not Triggering
**Symptom**:
```
User: "my knees are broken"
shouldCheckHealth: false  // ❌ WRONG!
```

**Root Cause**: The word "broken" is not in our health keywords list

**Current Keywords**: `['hurt', 'pain', 'ache', 'sore', 'tired', 'dizzy', 'nausea', 'chest', 'breath', 'fell', 'fall']`

**Missing**: broken, bruised, injured, bleeding, swollen, numb

---

### Issue #3: Streaming Not Implemented Properly
**Symptom**:
```
[VAPI] Stream requested: true
```

**Current Code**: We detect streaming but may not be responding in correct SSE format

**Impact**: Vapi expects Server-Sent Events format for streaming but we might be sending JSON

---

## 🔧 Fix Plan

### Fix #1: Replace Gemini with OpenAI (IMMEDIATE)
**Rationale**:
- OpenAI has higher rate limits
- Better reliability for production
- Already compatible with our OpenAI format

**Implementation**:
```typescript
// In gemini-service.ts - ADD OpenAI fallback

async function callOpenAI(prompt: string, env: Env): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',  // Fast and cheap
      messages: [
        {
          role: 'system',
          content: 'You are Sam, a warm AI companion. Keep responses under 30 words.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Modify callGeminiForResponse to try OpenAI first
export async function callGeminiForResponse(prompt: string, env: Env): Promise<string> {
  // Try OpenAI first if available
  if (env.OPENAI_API_KEY) {
    try {
      return await callOpenAI(prompt, env);
    } catch (error) {
      console.warn('[OPENAI] Failed, falling back to Gemini:', error.message);
    }
  }

  // Fallback to Gemini
  return callGemini(prompt, env, {...});
}
```

**Required**:
1. Get OpenAI API key
2. Add to `.env` and Cloudflare secrets
3. Deploy update

**Priority**: HIGH - Blocks all conversation quality

---

### Fix #2: Expand Health Keywords List
**Implementation**:
```typescript
// In sam-personality.ts

const healthKeywords = [
  // Pain
  'hurt', 'pain', 'ache', 'sore', 'painful',
  // Injury
  'broken', 'bruised', 'injured', 'bleeding', 'swollen', 'numb',
  // Illness
  'sick', 'ill', 'nausea', 'dizzy', 'fever', 'chills',
  // Breathing/Heart
  'chest', 'breath', 'breathe', 'breathing', 'cough',
  // Mobility
  'fell', 'fall', 'fallen', 'trip', 'stumble',
  // Fatigue
  'tired', 'exhausted', 'weak', 'fatigue',
  // Cognitive
  'confused', 'forgetful', 'memory', 'fog'
];
```

**Priority**: MEDIUM - Improves health detection accuracy

---

### Fix #3: Implement Proper SSE Streaming
**Current Issue**: Vapi requests `stream: true` but we may not respond correctly

**Implementation**:
```typescript
// In vapi-webhook.ts - Check createSSEResponse function

function createSSEResponse(result: any): Response {
  const stream = new ReadableStream({
    start(controller) {
      // Send delta chunks in SSE format
      const content = result.choices[0].message.content;

      // Split into words for streaming effect
      const words = content.split(' ');
      words.forEach((word, i) => {
        const chunk = {
          id: result.id,
          choices: [{
            index: 0,
            delta: {
              content: i === 0 ? word : ` ${word}`
            }
          }]
        };
        controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
      });

      // Send final done message
      controller.enqueue(`data: [DONE]\n\n`);
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

**Priority**: LOW - May improve latency but not critical

---

### Fix #4: Add Response Caching
**Rationale**: Reduce API calls for common phrases

**Implementation**:
```typescript
// Simple LRU cache for common responses
const responseCache = new Map<string, {response: string, timestamp: number}>();

async function getCachedOrGenerate(message: string, generateFn: () => Promise<string>): Promise<string> {
  const cacheKey = message.toLowerCase().trim();
  const cached = responseCache.get(cacheKey);

  // Cache valid for 5 minutes
  if (cached && Date.now() - cached.timestamp < 300000) {
    console.log('[CACHE] Hit:', cacheKey.substring(0, 30));
    return cached.response;
  }

  const response = await generateFn();
  responseCache.set(cacheKey, { response, timestamp: Date.now() });

  // Keep cache size under 100 entries
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }

  return response;
}
```

**Priority**: LOW - Optimization, not critical

---

## 📈 Success Metrics After Fixes

### Before (Current State):
- ❌ 100% responses are fallbacks
- ❌ 0% health mentions acknowledged properly
- ❌ Gemini rate limit on every call
- ❌ Completion tokens: 8 (way too low)

### After (Expected):
- ✅ <5% fallback rate
- ✅ 100% health mentions acknowledged
- ✅ No rate limit errors
- ✅ Completion tokens: 30-50 (normal)

---

## 🚀 Implementation Priority

### Phase 1: URGENT (Do Now)
1. ✅ Get OpenAI API key
2. ✅ Add OpenAI integration to `gemini-service.ts`
3. ✅ Add to Cloudflare secrets: `npx wrangler secret put OPENAI_API_KEY`
4. ✅ Deploy and test

### Phase 2: Important (Today)
1. ✅ Expand health keywords list
2. ✅ Test with "broken", "bruised", "injured"
3. ✅ Deploy and verify

### Phase 3: Nice-to-Have (Later)
1. ⏳ Implement proper SSE streaming
2. ⏳ Add response caching
3. ⏳ Optimize prompt length

---

## 🧪 Test Script

After fixes, test with these phrases:

```
Test 1: Health Detection
You: "My knees are broken from gardening"
Expected: "I'm sorry to hear that! Are you taking your Lisinopril?"

Test 2: Pain Mention
You: "My back is sore today"
Expected: "I'm sorry your back is sore. How long has it been bothering you?"

Test 3: Injury
You: "I bruised my arm yesterday"
Expected: "Oh no! How did you bruise your arm? Are you okay?"

Test 4: Normal Conversation
You: "The weather is nice today"
Expected: "That's wonderful! Did you get to work in your garden?"
```

---

## 📝 Next Steps

1. **IMMEDIATE**: Add OpenAI API key and deploy
2. **VERIFY**: Make test call and check logs for:
   - No rate limit errors
   - Actual AI responses (not fallbacks)
   - Health keywords triggering
3. **ITERATE**: Refine prompts based on response quality

---

**Status**: Analysis Complete, Ready for Implementation
**Blocker**: Gemini Rate Limit (429 errors)
**Solution**: Switch to OpenAI API
**ETA**: 15 minutes to implement and deploy
