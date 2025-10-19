# Vapi Assistant Deployment Guide

**Objective:** Deploy/update the Sam AI Companion assistant to Vapi with optimized configuration

---

## ✅ Prerequisites Checklist

Before starting, verify you have:

- [x] ✅ Phone number purchased: `+1-224-858-1016` (in `.env`)
- [x] ✅ Assistant ID: `5af660dd-dada-4863-af15-383c693873f7` (in `.env`)
- [x] ✅ VAPI_API_KEY configured in `.env`
- [x] ✅ ElevenLabs voice IDs in `.env`
- [x] ✅ Worker deployed: `https://elderlink-dev.elderlinkhelper.workers.dev`

**Status:** All prerequisites met! ✅

---

## 🚀 Deployment Method (Choose One)

You have **two options** to deploy the assistant:

### **Option 1: Automated Script (Recommended)** ⭐

**Fastest and easiest method** - Updates your existing assistant automatically.

```bash
# Run from project root
./scripts/deploy-vapi-assistant.sh
```

**What it does:**
1. ✅ Validates all environment variables
2. ✅ Updates assistant `5af660dd-dada-4863-af15-383c693873f7` via Vapi API
3. ✅ Applies all configuration from `vapi/assistant-config.json`
4. ✅ Shows detailed success confirmation
5. ✅ Provides next steps

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║        ELDERLINK VAPI ASSISTANT DEPLOYMENT                 ║
╚════════════════════════════════════════════════════════════╝

📋 Configuration:
   Assistant ID: 5af660dd-dada-4863-af15-383c693873f7
   English Voice: EXAVITQu4vr4xnSDxMaL
   Mandarin Voice: FGY2WhTYpPnrIDTdsKH5
   Worker URL: https://elderlink-dev.elderlinkhelper.workers.dev

🚀 Updating Vapi assistant...

✅ SUCCESS! Assistant updated successfully

📊 Assistant Details:
   Name: Sam - ElderLink Companion
   ID: 5af660dd-dada-4863-af15-383c693873f7
   Model Provider: custom-llm
   Webhook URL: https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   Voice Provider: 11labs
   Voice ID: EXAVITQu4vr4xnSDxMaL
   Transcriber: deepgram nova-2

✅ Configuration Applied:
   • Custom LLM webhook configured
   • ElevenLabs multilingual voice enabled
   • Deepgram nova-2 transcription configured
   • Elderly-friendly voice settings applied
   • Keywords for Mrs. Chen context added
   • Response timeout: 10 seconds
   • Silence timeout: 30 seconds
```

---

### **Option 2: Manual Dashboard Configuration** (If script fails)

If the script doesn't work, you can update the assistant manually:

#### Step 1: Access Vapi Dashboard
```
1. Go to: https://dashboard.vapi.ai
2. Log in with your credentials
3. Navigate to: Assistants → Click on "Sam - ElderLink Companion"
   (ID: 5af660dd-dada-4863-af15-383c693873f7)
```

#### Step 2: Configure Model Settings
```
Section: Model
├── Provider: Custom LLM
├── Model Name: custom
├── Webhook URL: https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
├── Temperature: 0.7
└── Max Tokens: 150
```

#### Step 3: Configure Voice Settings
```
Section: Voice
├── Provider: ElevenLabs
├── Voice ID: EXAVITQu4vr4xnSDxMaL
├── Model: eleven_multilingual_v2
├── Stability: 0.7
├── Similarity Boost: 0.8
├── Style: 0.5
├── Speaker Boost: ✅ Enabled
└── Optimize Streaming Latency: 3
```

**Why these settings?**
- **Stability 0.7** - Balanced between consistent and expressive
- **Similarity Boost 0.8** - High voice clarity (important for seniors)
- **Speaker Boost ON** - Enhanced audio quality for speakerphone use
- **Latency Optimization 3** - Prioritizes speed for <3s response time

#### Step 4: Configure Transcription
```
Section: Transcriber
├── Provider: Deepgram
├── Model: nova-2 (latest model)
├── Language: en-US
├── Smart Format: ✅ Enabled
├── Punctuate: ✅ Enabled
├── Profanity Filter: ❌ Disabled
└── Keywords: Mrs. Chen, Sarah, Tommy, gardening, piano,
              Lisinopril, Metformin, arthritis
```

**Why these keywords?**
- Proper names (Mrs. Chen, Sarah, Tommy) - Better recognition of conversation context
- Interests (gardening, piano) - Improves transcription of hobby-related talk
- Medications (Lisinopril, Metformin) - Critical for health tracking accuracy
- Conditions (arthritis) - Health monitoring context

#### Step 5: Configure Conversation Settings
```
Section: Messages
├── First Message: "Hello! This is Sam. Who am I speaking with today?"
├── End Call Message: "It was wonderful talking with you. Take care!"
└── End Call Phrases: goodbye, bye, talk to you later, gotta go, need to go
```

#### Step 6: Configure Advanced Settings
```
Section: Advanced
├── Request Timeout: 10 seconds
├── Silence Timeout: 30 seconds
├── Max Call Duration: 900 seconds (15 minutes)
├── Background Sound: off
├── Backchanneling: ❌ Disabled (important - prevents "uh-huh" interruptions)
└── Server URL: https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
```

**Critical Setting:**
- **Request Timeout: 10 seconds** - Vapi will wait max 10s for webhook response
- **Our target: <3 seconds** - Gives 7-second safety margin
- **Backchanneling OFF** - Prevents AI from interrupting seniors mid-sentence

#### Step 7: Configure Server Messages
```
Section: Server Messages (Events sent to webhook)
✅ conversation-update
✅ end-of-call-report
✅ hang
✅ speech-update

Client Messages: (Leave empty)
```

#### Step 8: Link Phone Number
```
1. Click "Save" to save assistant configuration
2. Navigate to: Phone Numbers
3. Find: +1-224-858-1016
4. Click "Edit" or settings icon
5. Under "Assistant": Select "Sam - ElderLink Companion"
6. Click "Save"
```

---

## 🧪 Testing the Deployment

### Test 1: Verify Assistant Configuration
```bash
# Check assistant settings via API
curl -X GET "https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7" \
  -H "Authorization: Bearer $VAPI_API_KEY" | jq '.'
```

**What to verify:**
- ✅ `model.url` points to `/vapi-webhook`
- ✅ `voice.voiceId` is `EXAVITQu4vr4xnSDxMaL`
- ✅ `transcriber.model` is `nova-2`
- ✅ `requestTimeoutSeconds` is `10`

### Test 2: Check Phone Number Linkage
```bash
# List phone numbers
curl -X GET "https://api.vapi.ai/phone-number" \
  -H "Authorization: Bearer $VAPI_API_KEY" | jq '.[] | select(.number == "+12248581016")'
```

**What to verify:**
- ✅ `assistantId` matches `5af660dd-dada-4863-af15-383c693873f7`

### Test 3: Verify Webhook Endpoint (CRITICAL)
```bash
# Test if webhook exists
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"Hello"},"role":"user","language":"en-US"},"conversationHistory":[]}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected:**
- ❌ **Currently returns 404** - Developer 2 hasn't implemented endpoint yet
- ✅ **After Dev 2 deploys:** Should return JSON with `{content: "...", role: "assistant"}`

### Test 4: Make a Test Call
```bash
# Call the number from your phone
# +1-224-858-1016
```

**What to expect (when webhook is deployed):**
1. ✅ Sam answers: "Hello! This is Sam. Who am I speaking with today?"
2. ✅ You can hear the voice clearly (warm, natural female voice)
3. ✅ Sam responds within 3 seconds of you speaking
4. ✅ Conversation feels natural, not robotic
5. ✅ Call ends gracefully with: "It was wonderful talking with you. Take care!"

**What will happen NOW (webhook not deployed):**
- ⚠️ Call connects but Sam won't respond (webhook returns 404)
- ⚠️ Call will timeout after 10 seconds
- ⚠️ This is EXPECTED - waiting on Developer 2

---

## 🔧 Troubleshooting

### Issue 1: Script fails with "Invalid API key"
```bash
# Check your API key
echo $VAPI_API_KEY

# Verify it starts with the correct format
# Should look like: a0a0d259-804e-4079-8a99-524a6a792cecclau

# If invalid, update .env and reload:
source .env
./scripts/deploy-vapi-assistant.sh
```

### Issue 2: Script fails with "Assistant not found"
```bash
# Verify assistant exists
curl -X GET "https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7" \
  -H "Authorization: Bearer $VAPI_API_KEY"

# If 404, the assistant ID is wrong - check Vapi dashboard
```

### Issue 3: Script fails with "Invalid voice ID"
```bash
# Verify ElevenLabs voice IDs
curl -X GET "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" | jq '.voices[] | select(.voice_id == "EXAVITQu4vr4xnSDxMaL")'

# If empty, the voice ID is invalid - check ElevenLabs dashboard
```

### Issue 4: Call connects but Sam doesn't respond
```bash
# This is EXPECTED currently
# Check webhook status:
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"test"}}}' \
  -w "\nHTTP: %{http_code}\n"

# If 404: Developer 2 needs to implement /vapi-webhook
# If 200: Webhook works! Test the call again
```

### Issue 5: Voice sounds robotic or unclear
```bash
# Update voice settings via script
# The script already uses optimal settings:
# - Stability: 0.7 (warm and expressive)
# - Similarity Boost: 0.8 (high clarity)
# - Speaker Boost: ON (better for speakerphone)

# If still robotic, try adjusting in Vapi dashboard:
# - Increase Style to 0.6-0.7 for more expressiveness
# - Decrease Stability to 0.6 for more variation
```

---

## 📊 Configuration Summary

| Setting | Value | Why |
|---------|-------|-----|
| **Model Provider** | Custom LLM | Use our Worker backend with Gemini |
| **Webhook URL** | `/vapi-webhook` | Custom response generation with memory |
| **Voice Provider** | ElevenLabs | Best multilingual quality |
| **Voice Model** | eleven_multilingual_v2 | Seamless English ↔ Mandarin switching |
| **Stability** | 0.7 | Balanced consistency + expressiveness |
| **Similarity Boost** | 0.8 | High clarity for seniors |
| **Speaker Boost** | ON | Optimized for speakerphone (6-8 feet) |
| **Transcriber** | Deepgram nova-2 | Latest, most accurate model |
| **Keywords** | Mrs. Chen, medications, etc. | Context-aware transcription |
| **Request Timeout** | 10s | Gives 7s safety margin for our <3s target |
| **Silence Timeout** | 30s | Seniors may need time to think |
| **Max Duration** | 15 minutes | Reasonable conversation length |
| **Backchanneling** | OFF | Prevents interrupting seniors |

---

## ✅ Success Criteria

After deployment, verify:

- [ ] Assistant configuration saved successfully
- [ ] Phone number linked to assistant
- [ ] Webhook URL configured (even if returns 404 currently)
- [ ] Voice settings applied (test by making a call when webhook works)
- [ ] Transcription keywords configured
- [ ] Timeout settings match requirements

---

## 🚀 Next Steps

### Immediate (After Deployment)
1. ✅ Run latency tests when Developer 2 deploys webhook
2. ✅ Make test call to verify voice quality
3. ✅ Test language switching (say something in Mandarin)
4. ✅ Verify <3 second response time

### Hour 6 Integration Test
1. ✅ Full team integration test with Mrs. Chen scenario
2. ✅ Dashboard monitoring during call
3. ✅ Memory continuity verification
4. ✅ Health tracking verification

### Hour 16+ Backup Recordings
1. ✅ Record Demo 1: Memory continuity
2. ✅ Record Demo 2: Health tracking
3. ✅ Record Demo 3: Language switching
4. ✅ Record Demo 4: Emotional support

---

## 🔗 Related Files

- [vapi/assistant-config.json](vapi/assistant-config.json) - Full configuration reference
- [vapi/voice-settings.json](vapi/voice-settings.json) - ElevenLabs voice settings
- [scripts/deploy-vapi-assistant.sh](scripts/deploy-vapi-assistant.sh) - Automated deployment script
- [scripts/test-latency.ts](scripts/test-latency.ts) - Latency testing suite
- [.env](.env) - Environment variables (API keys, IDs)

---

## 📞 Quick Reference

**Phone Number:** `+1-224-858-1016`
**Assistant ID:** `5af660dd-dada-4863-af15-383c693873f7`
**Webhook URL:** `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook`
**Voice ID (English):** `EXAVITQu4vr4xnSDxMaL`
**Voice ID (Mandarin):** `FGY2WhTYpPnrIDTdsKH5`

---

**Last Updated:** 2025-10-18
**Status:** Ready to deploy - Run `./scripts/deploy-vapi-assistant.sh`
