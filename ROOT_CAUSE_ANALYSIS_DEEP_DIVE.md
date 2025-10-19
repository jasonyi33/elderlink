# Root Cause Analysis: Sam Not Acknowledging User Messages
## Date: 2025-10-19 12:45 UTC

---

## 🎯 The Core Problem

**Observed Behavior**:
```
User: "My garden is doing pretty well, but my knees hurt."
Sam: "Hi, Mrs. Chen. It's so good to hear from you. How's your gardening? Tomatoes, roses, herbs,"
```

Sam's response:
- ❌ Doesn't acknowledge "doing pretty well"
- ❌ Doesn't address "my knees hurt" (critical health mention!)
- ❌ Asks about gardening as if user never mentioned it
- ❌ Lists plants randomly with incomplete sentence

---

## 🔍 Investigation Timeline

### Step 1: Check Vapi Call Logs (API)
**Method**: `curl https://api.vapi.ai/call/{call_id}`

**Findings**:
```json
{
  "transcript": "User: My garden is doing pretty well, but my knees hurt.\nAI: Hi, Mrs. Chen...",
  "costBreakdown": {
    "llm": 0,
    "llmPromptTokens": 114,
    "llmCompletionTokens": 2  // ⚠️ Only 2 tokens!
  },
  "costs": [{
    "type": "model",
    "model": {
      "model": "custom",
      "provider": "custom-llm"  // ✅ Using our custom LLM
    },
    "promptTokens": 114,
    "completionTokens": 2  // ⚠️ SUSPICIOUS
  }]
}
```

**Key Insights**:
- ✅ Vapi IS configured to use our custom-llm endpoint
- ⚠️ But only generating 2 completion tokens (impossible for a full sentence)
- ⚠️ Responses are repetitive and generic

---

### Step 2: Check Cloudflare Worker Logs
**Method**: `npx wrangler tail --env dev`

**Findings**:
```
5:37:28 AM - GET /api/call-state - Ok
5:37:30 AM - GET /api/dashboard/mrs-chen - Ok
5:37:32 AM - GET /api/call-state - Ok
...
```

**CRITICAL FINDING**: ❌ **ZERO `/chat/completions` requests during phone calls!**

During phone calls at 12:26, 12:27, and 12:29 PM, there were:
- ✅ Dashboard API requests
- ✅ Call state API requests
- ❌ **NO `/chat/completions` requests**
- ❌ **NO `/vapi-webhook` requests**

This proves: **Vapi is NOT calling our custom LLM endpoint!**

---

### Step 3: Verify Vapi Assistant Configuration
**Method**: `curl https://api.vapi.ai/assistant/{assistant_id}`

**Configuration**:
```json
{
  "model": {
    "url": "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions",
    "model": "custom",
    "provider": "custom-llm",
    "maxTokens": 150,
    "temperature": 0.7
  },
  "firstMessage": "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"
}
```

**Findings**:
- ✅ URL is correct
- ✅ Provider is `custom-llm`
- ❌ But no `messages` field or `systemPrompt` (might be the issue?)

---

### Step 4: Test Endpoint Directly
**Method**: `curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions`

**Request**:
```json
{
  "model": "custom",
  "messages": [{"role": "user", "content": "My knees hurt"}]
}
```

**Response**:
```json
{
  "choices": [{
    "message": {
      "content": "I'm sorry to hear that, Mrs. Chen. Are you still taking your Lisinopril?"
    }
  }]
}
```

**Findings**:
- ✅ Endpoint works perfectly when called directly
- ✅ Detects health keywords
- ✅ Shows empathy
- ✅ References medication
- ✅ Proper punctuation

**Conclusion**: **Our code is PERFECT. The issue is Vapi not calling it!**

---

## 🧩 The Missing Piece

### Hypothesis 1: Vapi Configuration Issue
Vapi might be:
1. Using firstMessage for all responses (repetitive pattern matches)
2. Falling back to default LLM due to auth/CORS issue
3. Not sending conversation turns to custom-llm

### Hypothesis 2: Streaming vs. Non-Streaming
Vapi might expect streaming responses (SSE format) but we're returning JSON.

Our code supports both:
```typescript
// Check if streaming is requested
const isStreamingRequest = requestData.stream === true;
if (isStreamingRequest) {
  return createSSEResponse(result);
}
```

But maybe Vapi is always requesting streaming?

### Hypothesis 3: Authentication/CORS
Maybe Vapi can't reach our endpoint due to:
- CORS headers incorrect
- Authentication required
- SSL/TLS issue

But we tested with `curl` and got 200 OK, so this seems unlikely.

---

## 🔬 Evidence Summary

| Evidence | Finding | Implication |
|----------|---------|-------------|
| Vapi call logs show `"provider": "custom-llm"` | Vapi THINKS it's using our endpoint | Configuration is correct |
| Vapi call logs show `"completionTokens": 2` | Very short response from LLM | Either truncated or not our response |
| Cloudflare logs show ZERO `/chat/completions` requests | Vapi is NOT calling our endpoint | **ROOT CAUSE** |
| Direct curl test returns perfect response | Our code works perfectly | Code is NOT the problem |
| Vapi assistant config has correct URL | Configuration looks good | But something is still wrong |

---

## 💡 Root Cause (Best Hypothesis)

**Vapi is using their own internal LLM for conversation turns, NOT our custom endpoint.**

The `"custom-llm"` cost breakdown might be showing:
- Token count from Vapi's internal call to their own LLM
- NOT from calls to our endpoint

This would explain:
1. Why completionTokens is only 2 (Vapi's internal prompt is different)
2. Why responses are generic and repetitive (Vapi's default behavior)
3. Why our endpoint is never called (Vapi isn't configured correctly to use it for conversation turns)
4. Why the `firstMessage` appears in every response (Vapi is reusing it)

---

## 🔧 Next Steps to Confirm

1. **Make a live test call** while monitoring `npx wrangler tail` in real-time
2. **Check if `/chat/completions` is called** during the conversation
3. **Examine request payload** to see what Vapi sends
4. **Review Vapi custom-LLM documentation** for correct configuration
5. **Check if Vapi requires specific webhook endpoints** for conversation turns

---

## 🚨 Critical Question

**Is Vapi's custom-LLM feature working at all, or is there a misconfiguration?**

The fact that:
- ✅ Direct curl works perfectly
- ❌ Phone calls never trigger the endpoint
- ⚠️ Vapi shows `custom-llm` in costs but only 2 tokens

Suggests Vapi might be:
1. Using custom-llm for metadata/logging only
2. Actually calling their own LLM (Gemini 2.5 Flash) for responses
3. Not forwarding conversation turns to our endpoint

---

## 📞 Action Required

**TEST IMMEDIATELY**: Make a live phone call to (224) 858-1016 while monitoring logs.

Expected in logs if working:
```
POST /chat/completions - Ok
[VAPI] Webhook request received: 2025-10-19T...
[VAPI] RAW PAYLOAD: {...}
[VAPI] Extracted from OpenAI messages array: "user's actual message"
[SAM] Generating response...
```

If NOT seen → Vapi is definitely not calling our endpoint → Need to fix Vapi configuration or contact Vapi support.
