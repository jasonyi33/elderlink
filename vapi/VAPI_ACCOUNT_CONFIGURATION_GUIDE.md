# Vapi Account Configuration Guide - Step-by-Step

This comprehensive guide walks through EVERY step needed to configure your Vapi account for the ElderLink project, based on official Vapi documentation (docs.vapi.ai).

---

## Table of Contents

1. [Account Setup & API Keys](#1-account-setup--api-keys)
2. [Provider Keys Configuration](#2-provider-keys-configuration)
3. [Phone Number Purchase & Setup](#3-phone-number-purchase--setup)
4. [Assistant Creation with Custom LLM](#4-assistant-creation-with-custom-llm)
5. [Testing & Verification](#5-testing--verification)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Account Setup & API Keys

### Step 1.1: Create Vapi Account

1. **Navigate to Vapi.ai**
   ```
   URL: https://vapi.ai
   ```

2. **Sign Up**
   - Click "Get Started" or "Sign Up"
   - Use email or Google sign-in
   - Verify your email if required

3. **Access Dashboard**
   ```
   URL: https://dashboard.vapi.ai
   ```
   - After login, you'll land on the main dashboard
   - Familiarize yourself with the sidebar navigation:
     - Assistants
     - Phone Numbers
     - Calls (call logs)
     - Settings
     - API Keys

### Step 1.2: Get Your Vapi API Key

1. **Navigate to API Keys**
   ```
   Dashboard → Settings → API Keys
   OR direct URL: https://dashboard.vapi.ai/org/api-keys
   ```

2. **Create New API Key**
   - Click "Create API Key" button
   - Give it a name: "ElderLink Production"
   - Copy the key immediately (shown only once!)
   - Format: `sk_live_xxxxxxxxxxxxxxxxx` or `sk_test_xxxxxxxxxxxxx`

3. **Add to Local .env File**
   ```bash
   echo "VAPI_API_KEY=sk_live_xxxxxxxxx" >> .env
   ```

   **⚠️ IMPORTANT:**
   - Use `sk_live_` for production (charges apply)
   - Use `sk_test_` for testing (free, but limited features)
   - NEVER commit this to git (`.env` should be in `.gitignore`)

---

## 2. Provider Keys Configuration

Provider keys allow you to bring your own API keys for transcription, voice synthesis, and LLM providers. **Benefit:** You get charged directly by the provider instead of Vapi, often resulting in lower costs.

### Step 2.1: Navigate to Provider Keys

```
Dashboard → Settings → Integrations
OR direct URL: https://dashboard.vapi.ai/settings/integrations
```

**Note:** This location was recently updated. Older documentation may reference `dashboard.vapi.ai/keys` which redirects to the new location.

### Step 2.2: Add Deepgram API Key (Transcription)

**Why Deepgram?**
- Higher accuracy for elderly speech patterns
- Better handling of background noise
- Support for custom vocabulary (medication names, etc.)

**Steps:**

1. **Get Deepgram API Key**
   ```
   URL: https://console.deepgram.com/
   ```
   - Sign up or log in to Deepgram
   - Go to "API Keys" section
   - Click "Create New Key"
   - Name: "ElderLink Vapi Integration"
   - Copy the API key

2. **Add to Vapi Dashboard**
   - In Vapi Settings → Integrations
   - Find "Deepgram" section
   - Click "Add API Key" or "Configure"
   - Paste your Deepgram API key
   - Click "Validate" or "Save"
   - Status should show "✓ Validated"

3. **Verify Configuration**
   ```bash
   # The key should now be active
   # You won't see the actual key (security), only validation status
   ```

4. **Optional: Add to .env for Reference**
   ```bash
   echo "DEEPGRAM_API_KEY=xxxxxxxxxxxxx" >> .env
   ```

### Step 2.3: Add ElevenLabs API Key (Voice Synthesis)

**Why ElevenLabs?**
- Multilingual voice support (English ↔ Mandarin)
- Natural, conversational voice quality
- Low latency for real-time conversations

**Steps:**

1. **Get ElevenLabs API Key**
   ```
   URL: https://elevenlabs.io/app/settings
   ```
   - Sign up or log in to ElevenLabs
   - Navigate to "API Keys" section
   - Click "Create New Key"
   - Copy the API key (format: `sk_xxxxxxxxxxxxx`)

2. **Add to Vapi Dashboard**
   - In Vapi Settings → Integrations
   - Find "ElevenLabs" section
   - Click "Add API Key" or "Configure"
   - Paste your ElevenLabs API key
   - Click "Validate" or "Save"
   - Status should show "✓ Validated"

3. **Add to .env File**
   ```bash
   echo "ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx" >> .env
   ```

### Step 2.4: Verify Provider Keys

1. **Check Validation Status**
   - All provider keys should show "✓ Validated" in green
   - If showing "Invalid" or "Error", check the key and try again

2. **Test Provider Integration**
   - You'll test this later when creating an assistant
   - For now, validation is sufficient

---

## 3. Phone Number Purchase & Setup

### Step 3.1: Purchase Phone Number

1. **Navigate to Phone Numbers**
   ```
   Dashboard → Phone Numbers
   OR direct URL: https://dashboard.vapi.ai/phone-numbers
   ```

2. **Click "Create Phone Number"**
   - You'll see two options:
     - **Create Number** (via Vapi - easiest)
     - **Import Number** (from Twilio/Vonage)

3. **Select "Create Number"** (Recommended)

4. **Choose Area Code**
   - Enter: `206` (Seattle area code - matches Mrs. Chen's location)
   - Alternative options if 206 unavailable: `425`, `253`, `360`
   - **Why local number?** More personal for seniors vs. 1-800 numbers

5. **Review Pricing**
   - Cost: ~$2-3/month
   - Calls: Charged per minute (varies)
   - **Note:** Free numbers available only for US national use (up to 10 per account)

6. **Complete Purchase**
   - Click "Purchase" or "Create"
   - Confirm payment method
   - Wait 30 seconds to 2 minutes for activation

7. **Verify Phone Number**
   - Number should appear in your Phone Numbers list
   - Status: "Active" (green indicator)
   - Format: `+1206XXXXXXX`

8. **Document the Number**
   ```bash
   # Copy the full number including +1
   # Example: +12065551234

   echo "VAPI_PHONE_NUMBER=+12065551234" >> .env
   ```

### Step 3.2: Test the Phone Number

1. **Dial from Your Personal Phone**
   - Call the number you just purchased
   - You should hear Vapi's default greeting
   - Example: "Hello, thank you for calling. How can I help you?"

2. **Troubleshooting if No Answer**
   - **Wait 5 minutes**: Carrier propagation can take time
   - **Check Status**: Ensure number shows "Active" in dashboard
   - **Try Different Phone**: Some carriers have delays
   - **Contact Support**: Use Vapi dashboard chat if issue persists

---

## 4. Assistant Creation with Custom LLM

### Step 4.1: Understand the Architecture

```
Call Flow with Custom LLM:
┌─────────────┐
│    Vapi     │  Receives call, transcribes speech
└──────┬──────┘
       │ Sends transcript to:
       ▼
┌─────────────────────────────┐
│  Custom LLM Webhook         │  elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
│  (Your Cloudflare Worker)   │  Generates Sam's response
└──────┬──────────────────────┘
       │ Returns response to:
       ▼
┌─────────────┐
│    Vapi     │  Synthesizes speech, plays to caller
└─────────────┘
```

**Why Custom LLM?**
- Full control over response generation
- Access to ElderLink's memory system (KV storage)
- Integration with health tracking and sentiment analysis
- Ability to reference previous conversations

**Alternative:** Use built-in providers (OpenAI, Anthropic) but lose memory integration

### Step 4.2: Create Assistant in Dashboard

1. **Navigate to Assistants**
   ```
   Dashboard → Assistants
   OR direct URL: https://dashboard.vapi.ai/assistants
   ```

2. **Click "Create Assistant"**

3. **Basic Configuration Tab**

   **Name:**
   ```
   Sam - ElderLink AI Companion
   ```

   **First Message:**
   ```
   Hi! This is Sam. How are you doing today?
   ```

   **System Prompt:** (This is for reference, actual logic is in your webhook)
   ```
   You are Sam, a warm and caring AI companion for elderly individuals.
   You are patient, kind, and conversational. You remember details from
   previous conversations and ask thoughtful follow-up questions. You
   speak naturally like a caring friend, not a robot or assistant.
   ```

4. **Model Configuration**

   **Scroll to "Model" Section:**
   - Click "Model Provider" dropdown
   - Select "Custom LLM" (NOT OpenAI, NOT Anthropic)

   **Server URL:**
   ```
   https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   ```

   **⚠️ CRITICAL:**
   - This is the actual Worker URL for ElderLink
   - URL must be HTTPS (not HTTP)
   - URL must be publicly accessible
   - Verify this URL is working before configuring assistant

   **Model Name:** (Optional, can be anything)
   ```
   gemini-1.5-flash
   ```

   **Temperature:** (Controls randomness)
   ```
   0.7
   ```
   - Range: 0.0 (deterministic) to 1.0 (creative)
   - 0.7 is good for conversational AI

5. **Voice Configuration**

   **Scroll to "Voice" Section:**
   - Click "Provider" dropdown
   - Select "ElevenLabs"

   **Voice ID (English):**
   ```
   EXAVITQu4vr4xnSDxMaL
   ```
   - This is Sarah - a warm, mature female voice
   - Good for eldercare applications

   **Alternative Voice IDs:**
   - `21m00Tcm4TlvDq8ikWAM` - Rachel (calm, clear)
   - `AZnzlk1XvdvUeBnXmlld` - Domi (gentle, soothing)

   **Model:**
   ```
   eleven_multilingual_v2
   ```
   - **Critical for ElderLink:** Supports English ↔ Mandarin switching

   **Stability:**
   ```
   0.5
   ```
   - Range: 0.0 (variable) to 1.0 (monotone)
   - 0.5 balances naturalness with consistency

   **Similarity Boost:**
   ```
   0.75
   ```
   - Range: 0.0 (low fidelity) to 1.0 (high fidelity)
   - 0.75 maintains voice characteristics

   **Optimize Streaming Latency:**
   ```
   3
   ```
   - Range: 0-4
   - 3 = Balanced latency (recommended for real-time calls)
   - 4 = Lowest latency but may reduce quality

6. **Transcriber Configuration**

   **Scroll to "Transcriber" Section:**
   - Click "Provider" dropdown
   - Select "Deepgram"

   **Model:**
   ```
   nova-2-general
   ```
   - Recommended for conversational AI
   - Alternative: `nova-2-phonecall` (optimized for phone audio)

   **Language:**
   ```
   en-US
   ```
   - For multi-language, set to `multi` if available
   - Or keep as `en-US` and handle Mandarin separately

   **Smart Format:**
   ```
   ✓ Enabled (check the box)
   ```
   - Automatically adds punctuation and formatting

   **Keywords:** (Boost accuracy for specific terms)
   ```
   Mrs. Chen, Sarah, gardening, piano, Methotrexate, arthritis, tomatoes
   ```
   - Separate with commas
   - Include names, hobbies, medications

   **Endpointing:** (Milliseconds of silence before considering speech finished)
   ```
   200
   ```
   - 200ms is good for natural conversation
   - Lower = faster but may cut off speech
   - Higher = more accurate but slower

### Step 4.3: Advanced Settings

1. **Click "Advanced" Tab**

2. **Server URL (Webhook)**

   **⚠️ IMPORTANT DISTINCTION:**
   - **Model → Server URL** (already set above): For LLM responses
   - **Advanced → Server URL**: For call events and updates

   **For ElderLink, set BOTH to:**
   ```
   https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   ```

3. **Server Messages** (What events to send to your webhook)

   **Enable these:**
   - ✓ `conversation-update` (transcript updates)
   - ✓ `end-of-call-report` (call summary)
   - ✓ `status-update` (call status changes)
   - ✓ `function-call` (if using function calling)
   - ✓ `hang` (call disconnection)

   **Optional:**
   - `speech-update` (real-time transcription)
   - `tool-calls` (if using tools)

4. **Timeouts**

   **Response Timeout:**
   ```
   10000
   ```
   - Milliseconds (10 seconds)
   - Vapi will wait this long for your webhook to respond
   - **ElderLink target: <3 seconds, but 10s is safety buffer**

   **Max Call Duration:**
   ```
   600
   ```
   - Seconds (10 minutes)
   - Maximum length of a single call
   - Prevents runaway costs

   **Silence Timeout:**
   ```
   30
   ```
   - Seconds
   - Call ends if no speech detected for this long
   - Prevents empty calls

5. **End Call Settings**

   **End Call Message:**
   ```
   Thank you for chatting with me. Take care!
   ```

   **End Call Phrases:**
   ```
   goodbye
   bye bye
   talk to you later
   see you later
   have to go
   ```
   - One phrase per line
   - Case-insensitive matching

6. **Recording & Compliance**

   **Recording Enabled:**
   ```
   ✓ Enabled (check the box)
   ```
   - Required for debugging and quality assurance

   **HIPAA Enabled:**
   ```
   ✗ Disabled (for demo)
   ```
   - Enable in production if handling PHI
   - May require Vapi enterprise plan

7. **Background Settings**

   **Background Sound:**
   ```
   off
   ```
   - No background music/noise

   **Background Denoising:**
   ```
   ✓ Enabled (check the box)
   ```
   - Reduces background noise from caller's environment

   **Backchanneling:**
   ```
   ✗ Disabled
   ```
   - Prevents "uh-huh", "mm-hmm" interjections
   - Can feel robotic; keep disabled for now

### Step 4.4: Save and Get Assistant ID

1. **Click "Save" or "Create Assistant"**

2. **Copy Assistant ID**
   - After saving, you'll see the assistant in your list
   - Click on the assistant to view details
   - Copy the ID (format: `asst_xxxxxxxxxxxxxxxxx`)
   - Example: `asst_7d8e9f0a1b2c3d4e5f6g7h8i9j0k`

3. **Add to .env File**
   ```bash
   echo "VAPI_ASSISTANT_ID=asst_xxxxxxxxxxxxxxxxx" >> .env
   ```

### Step 4.5: Link Phone Number to Assistant

1. **Navigate to Phone Numbers**
   ```
   Dashboard → Phone Numbers
   ```

2. **Click on Your Phone Number** (+1206XXXXXXX)

3. **Configure Assistant Assignment**
   - Look for "Assistant" dropdown or "Assign Assistant" button
   - Select "Sam - ElderLink AI Companion" from dropdown
   - Click "Save" or "Update"

4. **Verify Assignment**
   - Phone number should show:
     - **Status:** Active
     - **Assigned to:** Sam - ElderLink AI Companion
   - Green checkmark or indicator

---

## 5. Testing & Verification

### Test 5.1: Basic Webhook Test

**Before calling the phone number, test the webhook directly:**

```bash
# Test webhook is reachable
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "Hello Sam",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }'

# Expected response (200 OK):
# {
#   "message": {
#     "role": "assistant",
#     "content": "Hi! How are you doing today?"
#   }
# }

# If 404 or 500 error: Worker is not deployed correctly
# If timeout: Worker is taking too long (check logs)
```

### Test 5.2: Latency Test

```bash
# Measure response time (should be <3 seconds)
time curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"role":"user","content":"Hello"}}'

# Example output:
# real    0m1.234s  ← This should be <3 seconds
# user    0m0.005s
# sys     0m0.008s
```

### Test 5.3: Phone Call Test

**This is the CRITICAL test:**

1. **Call the Phone Number**
   ```
   Dial: +1206XXXXXXX (your purchased number)
   ```

2. **Expected Flow:**
   - **Ring:** 1-2 rings, then answered automatically
   - **Greeting:** "Hi! This is Sam. How are you doing today?"
   - **Your response:** Say something (e.g., "Hello Sam")
   - **Sam's response:** Should respond within 3 seconds with something conversational
   - **Language test:** Say "你好" (hello in Mandarin)
   - **Sam's response:** Should detect language and respond appropriately

3. **Verify Checklist:**
   - [ ] Call connects successfully
   - [ ] First message plays clearly
   - [ ] Sam's voice sounds natural (not robotic)
   - [ ] Response time is <3 seconds
   - [ ] Transcription is accurate (say your words clearly)
   - [ ] Call can be ended by saying "goodbye"

4. **Check Call Logs**
   ```
   Dashboard → Calls
   ```
   - Your test call should appear in the list
   - Click on it to see:
     - Full transcript
     - Response times
     - Any errors or warnings

### Test 5.4: Memory Test (if profiles exist)

**If Mrs. Chen's profile is seeded in KV storage:**

1. **Call the number**

2. **Say:** "Hello Sam"

3. **Expected:** Sam should mention Mrs. Chen by name or reference something from her profile:
   - "Hi Mrs. Chen! How are you doing today?"
   - OR "How are those tomatoes in your garden?"

4. **If Sam doesn't remember:**
   - Check Worker logs: `wrangler tail`
   - Verify KV storage has profile: `GET /api/profiles/mrs-chen`
   - Check memory extraction logic

### Test 5.5: Multi-Language Test

**Test English ↔ Mandarin switching:**

1. **Start call in English**
   - "Hello Sam"
   - Sam responds in English

2. **Switch to Mandarin**
   - Say: "我今天很累" (I'm very tired today)

3. **Expected:**
   - Sam responds in Mandarin
   - Voice should change (if multi-lingual voice configured)
   - Transcription should show Mandarin characters

4. **Switch back to English**
   - "Actually, let's speak in English"
   - Sam should respond in English

---

## 6. Troubleshooting

### Issue 6.1: "Cannot purchase phone number"

**Possible Causes:**
- Payment method not added
- Account not verified
- Region restrictions (not in US/Canada)

**Solutions:**
1. Add payment method: Dashboard → Settings → Billing
2. Verify email address and account
3. Try importing Twilio number instead

---

### Issue 6.2: "Assistant not responding"

**Symptoms:** Call connects, first message plays, but Sam doesn't respond to your speech

**Debug Steps:**

1. **Check Webhook URL**
   ```bash
   # In Vapi dashboard, verify:
   # Model → Server URL = https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   # Advanced → Server URL = https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   ```

2. **Test Webhook Directly**
   ```bash
   curl -v -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
     -H "Content-Type: application/json" \
     -d '{"message":{"role":"user","content":"test"}}'

   # Look for:
   # - HTTP 200 response (not 404, 500, etc.)
   # - Response time <3 seconds
   # - Valid JSON response
   ```

3. **Check Worker Logs**
   ```bash
   wrangler tail --env production

   # Look for:
   # [VAPI] Incoming request
   # [SAM] Generating response
   # Any errors or exceptions
   ```

4. **Verify Assistant Assignment**
   ```
   Dashboard → Phone Numbers → Click your number
   # Ensure "Assigned to: Sam - ElderLink AI Companion"
   ```

---

### Issue 6.3: "Response is too slow (>3 seconds)"

**Symptoms:** Long pauses before Sam responds

**Debug Steps:**

1. **Measure Webhook Latency**
   ```bash
   npm run test:latency
   # OR
   time curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook ...
   ```

2. **Check Gemini API Performance**
   - Gemini Flash should respond in <1.5s typically
   - If >2s consistently, consider:
     - Shorter prompts
     - Caching common responses
     - Using faster model

3. **Optimize Worker Code**
   - Ensure async operations use `env.context.waitUntil()`
   - Don't wait for memory/sentiment extraction before responding
   - Use fallback timeout (7 seconds safety)

4. **Check Network Latency**
   - Test from different locations
   - Check Cloudflare edge location
   - Verify no DNS issues

---

### Issue 6.4: "Transcription is inaccurate"

**Symptoms:** Sam mishears words, responds to wrong input

**Solutions:**

1. **Add Keywords**
   ```
   Dashboard → Assistants → Sam → Transcriber → Keywords
   # Add: medication names, family members, hobbies
   ```

2. **Use Better Microphone**
   - Test with headset vs. speakerphone
   - Reduce background noise

3. **Adjust Endpointing**
   ```
   Current: 200ms
   Try: 300ms (gives more time before finalizing transcript)
   ```

4. **Switch Deepgram Model**
   ```
   Current: nova-2-general
   Try: nova-2-phonecall (optimized for phone audio)
   ```

---

### Issue 6.5: "Language switching doesn't work"

**Symptoms:** Sam responds in English even when you speak Mandarin

**Debug Steps:**

1. **Check Voice Model**
   ```
   Dashboard → Assistants → Sam → Voice → Model
   # Must be: eleven_multilingual_v2
   # NOT: eleven_monolingual_v1
   ```

2. **Verify Language Detection**
   ```
   Dashboard → Assistants → Sam → Transcriber
   # Language: "multi" OR "en-US" (Deepgram auto-detects)
   ```

3. **Check Worker Logic**
   ```typescript
   // In vapi-webhook.ts
   const language = detectLanguage(message.content);
   // Should return 'zh' for Mandarin, 'en' for English
   ```

4. **Test with Clear Mandarin Phrase**
   - Try: "你好，我叫陈太太" (Hello, I'm Mrs. Chen)
   - Avoid mixing languages in same sentence initially

---

### Issue 6.6: "Call drops or has audio issues"

**Symptoms:** Choppy audio, call disconnects randomly

**Solutions:**

1. **Check Response Timeout**
   ```
   Dashboard → Assistants → Sam → Advanced → Response Timeout
   # Should be: 10000ms (10 seconds)
   # If lower, increase to 10000
   ```

2. **Verify Network Stability**
   - Test from stable WiFi (not cellular)
   - Check for firewall/VPN interference

3. **Disable Background Features**
   ```
   Dashboard → Assistants → Sam → Advanced
   # Backchanneling: OFF
   # Background Sound: OFF
   ```

4. **Check Vapi Status**
   ```
   URL: https://status.vapi.ai
   # Look for any ongoing incidents
   ```

---

### Issue 6.7: "Memory/Context not working"

**Symptoms:** Sam doesn't remember previous conversations or profile data

**Debug Steps:**

1. **Verify Profile Exists**
   ```bash
   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen

   # Should return:
   # {
   #   "name": "Mrs. Chen",
   #   "memories": {...},
   #   ...
   # }

   # If 404: Profile not seeded
   # Run: npm run init-demo
   ```

2. **Check Conversation History**
   - Vapi sends `conversationHistory` array in webhook
   - Verify your worker is using it in prompts

3. **Test Memory Extraction**
   ```bash
   # Check Worker logs for memory extraction
   wrangler tail | grep MEMORY

   # Should see:
   # [MEMORY] Extracted: {"family": ["Sarah"], ...}
   ```

4. **Verify KV Binding**
   ```toml
   # In wrangler.toml
   [[kv_namespaces]]
   binding = "PROFILES_KV"
   id = "your-namespace-id"
   ```

---

## Summary Checklist

Before proceeding to next tasks, verify ALL of these:

### Account Setup
- [ ] Vapi account created and verified
- [ ] `VAPI_API_KEY` obtained and added to `.env`
- [ ] Dashboard accessible at `https://dashboard.vapi.ai`

### Provider Keys
- [ ] Deepgram API key added and validated
- [ ] ElevenLabs API key added and validated
- [ ] Both show "✓ Validated" in Settings → Integrations

### Phone Number
- [ ] Phone number purchased (206 area code preferred)
- [ ] Number is Active in dashboard
- [ ] `VAPI_PHONE_NUMBER` added to `.env`
- [ ] Test call connects and plays default greeting

### Assistant Configuration
- [ ] Assistant "Sam - ElderLink AI Companion" created
- [ ] Custom LLM webhook URL set: `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook`
- [ ] ElevenLabs voice configured (multilingual model)
- [ ] Deepgram transcriber configured with keywords
- [ ] Advanced settings: timeouts, end-call phrases, recording enabled
- [ ] `VAPI_ASSISTANT_ID` added to `.env`

### Phone-Assistant Linkage
- [ ] Phone number assigned to Sam assistant
- [ ] Assignment shows in dashboard

### Testing
- [ ] Webhook responds to curl test (HTTP 200)
- [ ] Webhook response time <3 seconds
- [ ] Phone call connects successfully
- [ ] First message plays clearly
- [ ] Sam responds to speech within 3 seconds
- [ ] Transcription is accurate
- [ ] Call logs visible in dashboard

### Optional (Advanced)
- [ ] Memory test passed (Sam references profile data)
- [ ] Language switching works (English ↔ Mandarin)
- [ ] Health mentions extracted correctly
- [ ] Sentiment analysis working

---

## Next Steps

Once all the above are verified:

1. **Proceed to Task 4.3:** ElevenLabs Voice Cloning
   - Clone/customize Sam's voice for better warmth
   - Configure Mandarin voice for language switching

2. **Proceed to Task 4.4:** Latency Testing Scripts
   - Create automated tests to ensure <3s responses
   - Run performance benchmarks

3. **Proceed to Task 4.5:** Basic Call Flow Test
   - End-to-end test with all features
   - Verify memory, health, sentiment integration

4. **Proceed to Task 4.6:** Deepgram Fine-Tuning
   - Add more custom vocabulary
   - Optimize for elderly speech patterns

---

## Resources

- **Vapi Documentation:** https://docs.vapi.ai
- **Vapi Dashboard:** https://dashboard.vapi.ai
- **Vapi Status Page:** https://status.vapi.ai
- **Vapi Community:** https://vapi.ai/community
- **Vapi Support:** support@vapi.ai (or dashboard chat)

- **Deepgram Console:** https://console.deepgram.com
- **Deepgram Docs:** https://developers.deepgram.com

- **ElevenLabs Dashboard:** https://elevenlabs.io/app
- **ElevenLabs Docs:** https://docs.elevenlabs.io

- **ElderLink PRD:** `/Users/jasonyi/elderlink/PRD.md`
- **Developer 3 Plan:** `/Users/jasonyi/elderlink/DEVELOPER_3_IMPLEMENTATION_PLAN.md`
- **Manual Setup Tasks:** `/Users/jasonyi/elderlink/MANUAL_SETUP_TASKS.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Maintained By:** Developer 3
**Status:** Ready for Implementation
