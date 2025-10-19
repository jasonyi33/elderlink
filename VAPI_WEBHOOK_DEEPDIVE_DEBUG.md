# Vapi Webhook Deep Dive Debugging Session
## Date: 2025-10-19 12:33 AM (07:33 UTC)

---

## 🎯 Problem Statement

**User reports:** "I just made a call at 12:33. Call didn't hang up immediately, but Sam didn't respond to me."

**Expected behavior:** Sam should respond naturally to user's speech
**Actual behavior:** Sam says first message, then goes silent for entire call

---

## 📊 Call Details (Vapi API)

```json
{
  "id": "0199fb62-f842-755c-ba3c-a9ec46b6485d",
  "createdAt": "2025-10-19T07:33:11.362Z",
  "endedReason": "customer-ended-call",
  "transcript": "User: This is Jason.\nAI: Hello, this is Sam. Who am I speaking with today?\nUser: What's your like\n"
}
```

### Key Observations:
- ✅ Call completed successfully (customer-ended-call, NOT an error)
- ✅ Transcription working (captured "This is Jason" and "What's your like")
- ❌ Sam only spoke the `firstMessage`, then went silent
- ❌ Sam NEVER responded to user messages

---

## 🔍 Log Analysis

### 1. Webhook Requests Received
```
POST /chat/completions - Ok @ 07:33:11 UTC
POST /chat/completions - Ok @ 07:33:15 UTC
POST /chat/completions - Ok @ 07:33:17 UTC
POST /chat/completions - Ok @ 07:33:18 UTC
POST /chat/completions - Ok @ 07:33:20 UTC
POST /chat/completions - Ok @ 07:33:23 UTC
```
**Status:** ✅ Multiple webhook requests ARE reaching our `/chat/completions` endpoint

### 2. Message Extraction Logs
```
(log) [VAPI] PARSED SECTIONS: {
(log) [VAPI] Extracted from webhook message:
(log) [VAPI] Final extracted message:    <-- EMPTY STRING!
```

**CRITICAL FINDING:** Message extraction is returning EMPTY strings for EVERY request!

### 3. Response Pattern
When message is empty:
```javascript
if (!seniorMessage || seniorMessage.trim() === '') {
  return {
    id: `chatcmpl-empty-${Date.now()}`,
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: "I'm here. Take your time."
      }
    }]
  };
}
```

We're returning generic fallback response, which Vapi likely:
- Ignores as too generic
- OR plays but user doesn't hear it clearly
- OR doesn't speak because it's a repeated message

---

## 🧪 Controlled Test (Direct curl)

### Test Command:
```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Test message from Jason"}
    ]
  }'
```

### Test Result:
```json
{
  "choices": [{
    "message": {
      "content": "Hello Mrs. Chen, it's Sam. I saw a test message from Jason..."
    }
  }]
}
```

**Status:** ✅ Message extraction WORKS PERFECTLY with standard OpenAI format!

---

## 💡 Root Cause Hypothesis

### The Problem:
Vapi's custom-LLM requests are **NOT in standard OpenAI format**

### Evidence:
1. ✅ Direct curl with OpenAI `messages` array → Works perfectly
2. ❌ Actual phone calls from Vapi → Extract empty strings
3. ✅ Webhook requests ARE reaching endpoint
4. ❌ Message extraction logic fails to find user message in Vapi's payload

### Likely Explanation:
Vapi wraps the OpenAI format in a different structure:
- Might have a `message` object wrapping the `messages` array
- Might use webhook-style format (e.g., `message.content`) instead of OpenAI format
- Might send additional metadata that we're not parsing correctly

---

## 🔧 Debugging Steps Taken

### Step 1: Verify webhook is receiving requests
**Method:** Check wrangler tail logs
**Result:** ✅ Multiple requests at `/chat/completions`

### Step 2: Check message extraction
**Method:** Search logs for "Extracted" and "Final extracted message"
**Result:** ❌ ALL extractions return empty strings

### Step 3: Test with known-good format
**Method:** curl with standard OpenAI format
**Result:** ✅ Works perfectly - proves our code is correct

### Step 4: Compare formats
**Method:** Analyze RAW PAYLOAD logs from actual calls
**Result:** ⚠️ Logs are truncated - can't see full structure

---

## 📝 Current Code (Message Extraction)

```typescript
// Extract senior's message (support multiple formats)
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
```

**Issue:** This code works for standard OpenAI format, but Vapi sends something different!

---

## 🎯 Next Actions Required

### Immediate (CRITICAL):
1. **Capture FULL raw payload from Vapi**
   - Current logs truncate after ~50 lines
   - Need to see complete payload structure
   - Compare Vapi's actual format vs. OpenAI standard

2. **Update message extraction logic**
   - Parse whatever format Vapi actually sends
   - Handle nested structures
   - Support both OpenAI and Vapi formats

3. **Test fix with actual phone call**
   - Verify message extraction works
   - Confirm Sam responds naturally
   - Check response latency (<3s)

### To Capture Full Payload:
Add temporary logging that writes to file:
```typescript
// Write full payload to understand Vapi's format
const payloadStr = JSON.stringify(data, null, 2);
console.log('[VAPI] PAYLOAD LENGTH:', payloadStr.length);
console.log('[VAPI] PAYLOAD CHUNK 1:', payloadStr.substring(0, 1000));
console.log('[VAPI] PAYLOAD CHUNK 2:', payloadStr.substring(1000, 2000));
// etc...
```

Or use Vapi's call logs URL to get exact request format.

---

## 📈 Progress Summary

### ✅ Fixed:
1. Endpoint setup (`/chat/completions` route)
2. Response format (OpenAI-compatible `{id, choices}`)
3. Call stability (no immediate hang-ups)
4. Transcription (ElevenLabs working)

### ❌ Broken:
1. **Message extraction from Vapi's requests** ← ROOT CAUSE
2. Sam's responses during actual calls
3. Conversation flow (only first message spoken)

### 🔍 Needs Investigation:
1. Vapi's actual request payload format
2. Difference between Vapi format vs. OpenAI format
3. Why logs truncate RAW PAYLOAD

---

## 💭 Technical Deep Dive

### Why Direct Test Works But Phone Calls Don't:

**Direct curl test:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```
→ Code path: `if (messages && Array.isArray(messages))` → ✅ Extracts "Hello"

**Vapi phone call:**
```json
{
  "message": {  // <-- Singular, not plural!
    // Unknown structure
  }
}
```
→ Code path: `else if (message)` → ❌ Doesn't find content → Returns ""

### The Fix:
Need to understand Vapi's ACTUAL structure to parse correctly.

---

## 🚀 Recommended Solution

### Option 1: Use Vapi's Call Logs
```bash
# Download the actual request Vapi sent
curl "https://calllogs.vapi.ai/913a7ede-cb93-4dd6-a17d-c892accbab3f/0199fb62-f842-755c-ba3c-a9ec46b6485d-*.jsonl.gz"
```

### Option 2: Enhanced Logging
Deploy with chunk-based logging to capture full payload without truncation.

### Option 3: Vapi Support
Check Vapi documentation or support for custom-LLM request format specification.

---

## 📚 References

- Vapi custom-LLM docs: https://docs.vapi.ai/customization/custom-llm/using-your-server
- OpenAI chat completion spec: https://platform.openai.com/docs/api-reference/chat/create
- Vapi support thread: https://support.vapi.ai/t/23460916/response-body-structure-for-custom-llm

---

**Last Updated:** 2025-10-19 12:35 AM
**Debugging Session:** Deep dive into message extraction failure
**Status:** Root cause identified, awaiting payload structure investigation

---

## 🔄 Update: Enhanced Logging Deployed

### Changes Made:
Added top-level key inspection to understand Vapi's actual payload structure:

```typescript
console.log('[VAPI] PAYLOAD KEYS:', Object.keys(data));
console.log('[VAPI] PAYLOAD TYPE:', typeof data);
```

This will show us EXACTLY what fields Vapi sends in their request.

### Next Test:
**Please make ONE more test call saying "Hello Sam"**

The new logs will show:
1. What top-level keys exist in the payload
2. Whether it's `message` or `messages` or something else
3. The exact structure we need to parse

Once we see the keys, we can fix the message extraction logic immediately.

---

## 📝 Complete Debugging Summary

### Session Timeline:
1. **12:29 AM** - First call failed with "custom-llm-llm-failed"
2. **12:33 AM** - Call didn't hang up but Sam didn't respond
3. **12:35 AM** - Identified root cause: message extraction returns empty
4. **12:37 AM** - Added key inspection logging, deployed fix

### Debugging Methodology Applied:
1. ✅ Check if requests reach endpoint → YES
2. ✅ Verify error logs → Found empty message extraction
3. ✅ Test with known-good input → OpenAI format works
4. ✅ Compare working vs broken → Format difference
5. ✅ Add detailed logging → Inspect payload keys
6. ⏳ Waiting for test call → Will show exact format

### Files Modified:
- `/Users/jasonyi/elderlink/worker/src/handlers/vapi-webhook.ts` - Added key logging
- `/Users/jasonyi/elderlink/VAPI_WEBHOOK_DEBUG.md` - Initial debug log
- `/Users/jasonyi/elderlink/VAPI_WEBHOOK_DEEPDIVE_DEBUG.md` - This comprehensive analysis

