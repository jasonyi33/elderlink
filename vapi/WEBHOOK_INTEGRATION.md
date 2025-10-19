# Vapi Webhook Integration Guide

## Overview

This document explains how to integrate the ElderLink Cloudflare Worker with Vapi's phone system using webhooks for real-time conversation handling.

## Architecture

```
Phone Call Flow:
┌─────────────┐
│   Senior    │
│ (Mrs. Chen) │
└──────┬──────┘
       │ 1. Dials +1206XXXXXXX
       ▼
┌─────────────────┐
│  Vapi Platform  │
│   - Deepgram    │ 2. Transcribes speech
│   - ElevenLabs  │ 3. Synthesizes voice
└────────┬────────┘
         │
         │ 4. POST /vapi-webhook
         │    (transcribed message)
         ▼
┌──────────────────────────┐
│  Cloudflare Worker       │
│  elderlink-dev.elderlinkhelper.workers.dev   │
│                          │
│  - Sam Response Gen      │ 5. Generate response (<3s)
│  - Memory Extraction     │ 6. Extract memories (async)
│  - Sentiment Analysis    │ 7. Analyze sentiment (async)
│  - Health Tracking       │ 8. Check health mentions (async)
└────────┬─────────────────┘
         │
         │ 9. Returns JSON response
         ▼
┌─────────────────┐
│  Vapi Platform  │ 10. Text-to-Speech
└────────┬────────┘
         │
         │ 11. Audio response
         ▼
┌─────────────┐
│   Senior    │ Hears Sam's voice
└─────────────┘
```

## Webhook Endpoint

### URL
```
POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
```

### Request Format (from Vapi)

```json
{
  "message": {
    "role": "user",
    "content": "Hello Sam, how are you?",
    "timestamp": "2024-01-15T10:30:00Z",
    "language": "en-US"
  },
  "call": {
    "id": "call_abc123",
    "phoneNumber": "+12065551234",
    "status": "in-progress",
    "startedAt": "2024-01-15T10:29:45Z"
  },
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Hi! This is Sam. How are you doing today?",
      "timestamp": "2024-01-15T10:29:50Z"
    },
    {
      "role": "user",
      "content": "Hello Sam, how are you?",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Response Format (to Vapi)

```json
{
  "message": {
    "role": "assistant",
    "content": "Hi Mrs. Chen! I'm doing well, thank you for asking. How are your tomatoes doing in the garden?",
    "language": "en-US"
  }
}
```

## Performance Requirements

### CRITICAL: <3 Second Response Time

```typescript
// The webhook MUST respond within 3 seconds
// Vapi has a 10-second timeout, but longer delays feel unnatural

const RESPONSE_TARGET = 3000; // 3 seconds (our target)
const VAPI_TIMEOUT = 10000;   // 10 seconds (Vapi's limit)
const SAFETY_TIMEOUT = 7000;  // 7 seconds (safety buffer)

// Implementation strategy:
// 1. Generate response IMMEDIATELY (target: <2s)
// 2. Return response to Vapi
// 3. Process async tasks (memory, sentiment, health) in background
```

## Configuration Steps

### Step 1: Deploy Cloudflare Worker

Ensure your worker is deployed and accessible:

```bash
# Deploy to production
npm run deploy:prod

# Verify deployment
curl https://elderlink-dev.elderlinkhelper.workers.dev/health
# Should return: {"status":"healthy"}
```

### Step 2: Configure Vapi Assistant

1. **Log in to Vapi Dashboard**
   - URL: https://dashboard.vapi.ai
   - Navigate to "Assistants"

2. **Create New Assistant**
   - Click "Create Assistant"
   - Name: "Sam - ElderLink AI Companion"

3. **Configure Custom LLM**
   - Model Provider: "Custom LLM"
   - Webhook URL: `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook`
   - Method: POST
   - Authentication: None (Worker uses VAPI_API_KEY for verification)

4. **Upload Configuration**
   - Use the `vapi/assistant-config.json` file
   - Or manually enter settings from that file

5. **Save and Get Assistant ID**
   - Click "Save"
   - Copy the Assistant ID (e.g., `asst_abc123xyz`)
   - Add to `.env`: `VAPI_ASSISTANT_ID=asst_abc123xyz`

### Step 3: Link Phone Number to Assistant

1. **Navigate to Phone Numbers**
   - Dashboard → Phone Numbers
   - Select your purchased number (+1206XXXXXXX)

2. **Assign Assistant**
   - Click "Configure"
   - Select "Sam - ElderLink AI Companion" from dropdown
   - Click "Save"

3. **Verify Configuration**
   - Phone number should show "Assigned to: Sam - ElderLink AI Companion"
   - Status should be "Active"

### Step 4: Test the Integration

```bash
# Call the phone number from your personal phone
# You should:
# 1. Hear "Hi! This is Sam. How are you doing today?"
# 2. Say something (e.g., "Hello Sam")
# 3. Hear a response from Sam within 3 seconds
# 4. Response should be natural and conversational

# If using Mrs. Chen's profile:
# - Sam should reference her name
# - Sam might ask about garden, family, or piano
```

## Webhook Request Headers

### From Vapi to Worker

```http
POST /vapi-webhook HTTP/1.1
Host: elderlink-dev.elderlinkhelper.workers.dev
Content-Type: application/json
X-Vapi-Call-ID: call_abc123
X-Vapi-Assistant-ID: asst_abc123xyz
User-Agent: Vapi/1.0
```

### Worker Response Headers

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Response-Time: 1234
Access-Control-Allow-Origin: *
```

## Error Handling

### Timeout Fallback

```typescript
// If response generation takes too long
const FALLBACK_RESPONSES = [
  "I'm sorry, could you repeat that?",
  "I didn't quite catch that. Could you say it again?",
  "Let me think about that for a moment..."
];

// Return immediately if approaching timeout
if (elapsedTime > SAFETY_TIMEOUT) {
  return randomFallback();
}
```

### Worker Error Responses

```json
// 500 Internal Server Error
{
  "error": "Failed to generate response",
  "message": "I'm having trouble right now. Can you try again?",
  "fallback": true
}

// 503 Service Unavailable (Gemini API down)
{
  "error": "LLM service unavailable",
  "message": "I'm sorry, I'm having technical difficulties. Please try calling back in a few minutes.",
  "fallback": true
}
```

## Testing Checklist

- [ ] Worker deployed and accessible at `https://elderlink-dev.elderlinkhelper.workers.dev`
- [ ] `/health` endpoint returns `{"status":"healthy"}`
- [ ] `/vapi-webhook` endpoint exists (returns 400 on GET)
- [ ] Vapi assistant created with correct config
- [ ] Assistant ID added to `.env` as `VAPI_ASSISTANT_ID`
- [ ] Phone number linked to assistant
- [ ] Test call successfully connects
- [ ] First message plays: "Hi! This is Sam. How are you doing today?"
- [ ] User speech is transcribed correctly
- [ ] Sam responds within 3 seconds
- [ ] Response references senior's name (if profile exists)
- [ ] Call can be ended with "goodbye" phrase

## Monitoring & Debugging

### Enable Verbose Logging

```typescript
// In worker/src/handlers/vapi-webhook.ts
const DEBUG = true; // Enable detailed logs

console.log('[VAPI] Incoming request:', {
  timestamp: Date.now(),
  message: request.message?.content,
  language: request.message?.language,
  callId: request.call?.id
});
```

### View Logs

```bash
# Stream live logs
wrangler tail --env production

# Filter for webhook events
wrangler tail --env production | grep VAPI
```

### Performance Metrics

```bash
# Check response times
curl -w "\nTime: %{time_total}s\n" \
  -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"content":"Hello","role":"user"}}'

# Should be < 3 seconds
```

## Latency Optimization

### Target Breakdown
```
Total: <3000ms
├── Network (Vapi → Worker): ~100ms
├── Worker Processing: ~200ms
├── Gemini API Call: ~1500ms (target)
├── Response Generation: ~200ms
├── Network (Worker → Vapi): ~100ms
└── Buffer: ~900ms
```

### Optimization Techniques

1. **Streaming Response** (if Vapi supports)
   ```typescript
   // Stream tokens as they're generated
   return new Response(stream, {
     headers: { 'Content-Type': 'text/event-stream' }
   });
   ```

2. **Cached Responses** (for common greetings)
   ```typescript
   const QUICK_RESPONSES = {
     'hello': 'Hi! How are you doing today?',
     'goodbye': 'Take care! Talk to you soon.'
   };
   ```

3. **Parallel Processing** (memory, sentiment, health)
   ```typescript
   // Don't wait for these - run in background
   env.context.waitUntil(
     Promise.all([
       extractMemories(message, profile),
       analyzeSentiment(message),
       checkHealthMentions(message, profile)
     ])
   );
   ```

## Security Considerations

### Webhook Verification

```typescript
// Verify requests are from Vapi
const vapiCallId = request.headers.get('X-Vapi-Call-ID');
const vapiAssistantId = request.headers.get('X-Vapi-Assistant-ID');

if (vapiAssistantId !== env.VAPI_ASSISTANT_ID) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Rate Limiting

```typescript
// Prevent abuse (not implemented yet, YAGNI for demo)
// Could add in future:
// - Max 100 requests per phone number per day
// - Max 10 concurrent calls
```

## Troubleshooting

### Issue: No response from Sam

**Check:**
1. Worker is deployed: `curl https://elderlink-dev.elderlinkhelper.workers.dev/health`
2. Webhook URL is correct in Vapi dashboard
3. Assistant is assigned to phone number
4. Worker logs for errors: `wrangler tail`

**Fix:**
- Redeploy worker: `npm run deploy:prod`
- Verify webhook URL has no typos
- Check Vapi dashboard for error messages

### Issue: Response too slow (>3 seconds)

**Check:**
1. Gemini API latency: `npm run test:latency`
2. Worker processing time in logs
3. Network latency from Vapi to Worker

**Fix:**
- Add fallback timeout (already implemented)
- Use cached responses for common phrases
- Optimize Gemini prompt length

### Issue: Sam doesn't remember previous conversations

**Check:**
1. Profile exists in KV storage: `GET /api/profiles/mrs-chen`
2. Memory extraction is working (check logs)
3. Conversation history being passed to prompt

**Fix:**
- Run `npm run init-demo` to seed Mrs. Chen profile
- Check memory extraction prompt
- Verify KV namespace binding in wrangler.toml

### Issue: Language switching not working

**Check:**
1. ElevenLabs multilingual voice configured
2. Language detection enabled in Vapi transcriber
3. Voice ID changes based on language

**Fix:**
- Verify `ELEVENLABS_MANDARIN_VOICE` in `.env`
- Check assistant-config.json has `languageDetection: true`
- Test with explicit Mandarin phrase: "你好"

## Environment Variables

Required for webhook integration:

```bash
# Vapi Configuration
VAPI_API_KEY=sk_live_xxxxx           # From Vapi dashboard
VAPI_PHONE_NUMBER=+1206XXXXXXX       # Purchased phone number
VAPI_ASSISTANT_ID=asst_xxxxx         # From Vapi assistant creation

# ElevenLabs Voice
ELEVENLABS_API_KEY=xxxxx             # From ElevenLabs
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL   # Sam's English voice
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5  # Sam's Mandarin voice

# Gemini AI
GEMINI_API_KEY=xxxxx                 # From Google AI Studio

# Cloudflare KV
KV_NAMESPACE_ID=xxxxx                # From Cloudflare dashboard
```

## Next Steps

After webhook integration is complete:

1. **Task 4.3:** ElevenLabs Voice Configuration
   - Clone English voice to create "Sam"
   - Configure Mandarin voice for language switching

2. **Task 4.4:** Latency Testing
   - Create automated latency tests
   - Ensure <3 second responses consistently

3. **Task 4.5:** Basic Call Flow Test
   - End-to-end test with real phone call
   - Verify memory continuity
   - Test language switching

4. **Task 4.6:** Deepgram Configuration
   - Fine-tune transcription for elderly speech
   - Add custom vocabulary (Mrs. Chen, medications, etc.)

## Resources

- **Vapi Documentation:** https://docs.vapi.ai
- **Vapi Dashboard:** https://dashboard.vapi.ai
- **ElevenLabs Docs:** https://docs.elevenlabs.io
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/

---

**Last Updated:** 2024-01-15
**Owner:** Developer 3
**Status:** Ready for implementation
