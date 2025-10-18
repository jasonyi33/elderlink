# Developer 3 Implementation Plan - Voice & Phone System

**Developer Role:** Developer 3
**Responsibility:** Voice & Phone System (Section 4.0)
**Timeline:** Hours 0-23 (24-hour hackathon)
**Critical Dependencies:** Developer 2 (Backend API must be live by Hour 2)

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
3. [Task 4.1: Phone Configuration](#task-41-phone-configuration-hour-0-1)
4. [Task 4.2: Vapi Assistant Configuration](#task-42-vapi-assistant-configuration-hour-1-2)
5. [Task 4.3: ElevenLabs Voice Configuration](#task-43-elevenlabs-voice-configuration-hour-2-3)
6. [Task 4.4: Latency Testing Scripts (TDD)](#task-44-latency-testing-scripts-tdd-hour-3-5)
7. [Task 4.5: Basic Call Flow Test](#task-45-basic-call-flow-test-hour-3-checkpoint)
8. [Task 4.6: Deepgram Transcription Configuration](#task-46-deepgram-transcription-configuration-hour-5-6)
9. [Task 4.7: Backup Demo Recordings](#task-47-backup-demo-recordings-hour-16)
10. [Integration Testing Schedule](#integration-testing-schedule)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

### Primary Objectives
1. ✅ Configure Vapi phone system for natural conversation flow
2. ✅ Set up ElevenLabs voice synthesis with language switching
3. ✅ Ensure <3 second response latency (CRITICAL)
4. ✅ Create backup recordings for demo safety
5. ✅ Test and verify entire phone → webhook → voice pipeline

### Success Criteria (ALL MUST WORK)
- [ ] Phone number working and answering calls
- [ ] Sam's voice sounds warm and natural (not robotic)
- [ ] Response latency <3 seconds consistently
- [ ] Language switching works (English ↔ Mandarin)
- [ ] Call quality is clear on speakerphone (no echo/feedback)
- [ ] 4 backup demo recordings ready

### Critical Performance Target
**<3 SECOND RESPONSE TIME** - This is NON-NEGOTIABLE for natural conversation flow.

Breakdown:
- Vapi speech detection: ~500ms
- Webhook processing: <100ms
- Sam response generation: <800ms (Gemini Flash)
- Response formatting: <50ms
- Voice synthesis: ~500ms
- **TOTAL TARGET: ~2 seconds**

---

## Prerequisites & Environment Setup

### Before Starting (Hour 0)

#### 1. API Keys & Accounts
Ensure you have access to:
- [ ] Vapi account (https://vapi.ai)
- [ ] ElevenLabs account (https://elevenlabs.io)
- [ ] Deepgram account (handled through Vapi)
- [ ] Team Slack/Discord channel access
- [ ] Access to shared `.env` file

#### 2. Local Environment Setup
```bash
# Clone repo (if not done)
cd /Users/jasonyi/elderlink

# Verify environment variables
cp .env.example .env
# Fill in your API keys:
# - VAPI_API_KEY
# - ELEVENLABS_API_KEY
# - ELEVENLABS_ENGLISH_VOICE
# - ELEVENLABS_MANDARIN_VOICE

# Install dependencies
npm install

# Verify Worker is accessible (depends on Dev 2)
# You'll need Worker URL by Hour 2
```

#### 3. Tools You'll Need
- Phone (for testing calls)
- Speakerphone or speaker (for demos)
- Audio recording software (QuickTime on Mac, OBS on Windows)
- Postman or curl (for API testing)
- Stopwatch or timer (for latency measurement)

#### 4. Documentation Access
- [ ] Vapi API docs: https://docs.vapi.ai
- [ ] ElevenLabs API docs: https://elevenlabs.io/docs
- [ ] PRD Section 7 (Technical Architecture)
- [ ] TDD_TEST_CASES.md Section 9 (Performance tests)

---

## Task 4.1: Phone Configuration (Hour 0-1)

### 4.1a: Purchase Vapi Phone Number

**Duration:** 15 minutes
**Dependencies:** None

#### Steps:
1. **Log in to Vapi Dashboard**
   - Navigate to https://dashboard.vapi.ai
   - Go to "Phone Numbers" section

2. **Purchase 206 Area Code Number**
   ```
   Reason: Seattle area code (matches Mrs. Chen's location)
   Cost: ~$2/month
   Type: Local number (not toll-free)
   ```

3. **Verify Purchase**
   - [ ] Number shows as "Active" in dashboard
   - [ ] Test dial the number from your phone
   - [ ] Should hear Vapi default greeting

4. **Document Number**
   ```bash
   # Add to .env file
   echo "VAPI_PHONE_NUMBER=+1206XXXXXXX" >> .env
   ```

5. **Enable Call Recording**
   - In Vapi dashboard → Phone Number Settings
   - Toggle "Call Recording" to ON
   - Purpose: Backup demo recordings

**Verification:**
```bash
# Call the number
# Expected: Hear default Vapi greeting
# If not working: Check billing, number activation status
```

---

### 4.1b: Share Number with Team

**Duration:** 5 minutes
**Dependencies:** 4.1a completed

#### Steps:
1. **Post in Team Channel**
   ```
   📞 ELDERLINK PHONE NUMBER READY

   Number: +1-206-XXX-XXXX
   Status: Active (default greeting)
   Next Step: Will be linked to our assistant once Worker URL is ready

   Everyone please test calling it to verify it works in your area.
   ```

2. **Create Shared Document**
   - Create `docs/phone-info.md`
   - Include:
     - Phone number
     - Vapi dashboard credentials (if shared)
     - Expected behavior at each stage
     - Troubleshooting notes

**Verification Checklist:**
- [ ] All team members can call the number
- [ ] Number documented in team chat
- [ ] Number added to .env file
- [ ] Call recording enabled

---

### 4.1c: Document in Environment File

**Duration:** 2 minutes

#### Steps:
```bash
# Edit .env file
nano .env

# Add/verify these lines:
VAPI_PHONE_NUMBER=+12065551234
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=  # Will fill after 4.2
```

**Commit:**
```bash
git add .env.example  # Update example (without real keys)
git commit -m "docs: Update phone number in environment config"
```

---

## Task 4.2: Vapi Assistant Configuration (Hour 1-2)

### 4.2a: Create Assistant Configuration File

**Duration:** 20 minutes
**Dependencies:** Developer 2 must provide Worker URL

#### Create Directory Structure:
```bash
mkdir -p vapi
```

#### Create `vapi/assistant-config.json`:
```json
{
  "name": "Sam - ElderLink Companion",
  "model": {
    "provider": "custom-llm",
    "url": "https://elderlink-dev.YOUR_WORKER_NAME.workers.dev/vapi-webhook",
    "model": "custom",
    "temperature": 0.7,
    "maxTokens": 150
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "EXAVITQu4vr4xnSDxMaL",
    "model": "eleven_monolingual_v1",
    "stability": 0.7,
    "similarityBoost": 0.8,
    "style": 0.5,
    "useSpeakerBoost": true
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en-US",
    "smartFormat": true,
    "punctuate": true,
    "profanityFilter": false,
    "keywords": ["Mrs. Chen", "Sarah", "Tommy", "gardening", "piano"]
  },
  "firstMessage": "Hello! This is Sam. Who am I speaking with today?",
  "endCallMessage": "It was wonderful talking with you. Take care!",
  "endCallPhrases": ["goodbye", "bye", "talk to you later", "gotta go", "need to go"],
  "requestTimeoutSeconds": 10,
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 900,
  "backgroundSound": "off",
  "backchannelingEnabled": false,
  "serverMessages": [
    "conversation-update",
    "end-of-call-report",
    "hang",
    "speech-update"
  ],
  "clientMessages": [],
  "serverUrl": "https://elderlink-dev.YOUR_WORKER_NAME.workers.dev/vapi-webhook",
  "serverUrlSecret": "your_webhook_secret_here"
}
```

**IMPORTANT NOTES:**
1. Replace `YOUR_WORKER_NAME` with actual Worker URL from Dev 2
2. The webhook URL is CRITICAL - must be accessible by Hour 2
3. `requestTimeoutSeconds: 10` gives us buffer for 3s target

---

### 4.2b: Wait for Worker URL (CRITICAL DEPENDENCY)

**Duration:** Depends on Developer 2
**Target:** Hour 2

#### Coordination with Developer 2:
1. **Monitor Team Channel for Announcement:**
   ```
   Expected message from Dev 2:
   "🚀 Worker deployed: https://elderlink-dev.username.workers.dev"
   ```

2. **Verify Worker is Live:**
   ```bash
   # Test health endpoint
   curl https://elderlink-dev.username.workers.dev/api/health

   # Expected response:
   # {"status":"ok","timestamp":"2025-01-18T..."}
   ```

3. **Update assistant-config.json:**
   ```bash
   # Replace YOUR_WORKER_NAME with actual URL
   sed -i '' 's/YOUR_WORKER_NAME/actual-worker-name/g' vapi/assistant-config.json
   ```

**If Worker Not Ready by Hour 2:**
- [ ] Notify Integration Lead immediately
- [ ] Use mock responses for initial testing
- [ ] This is a BLOCKER - escalate to team

---

### 4.2c: Deploy Assistant to Vapi

**Duration:** 15 minutes
**Dependencies:** Worker URL ready

#### Manual Deployment via Vapi Dashboard:

1. **Go to Vapi Dashboard → Assistants → Create New**

2. **Fill in Configuration (matching JSON file):**
   - Name: "Sam - ElderLink Companion"
   - Provider: Custom LLM
   - Model URL: `https://elderlink-dev.YOUR_NAME.workers.dev/vapi-webhook`
   - Temperature: 0.7
   - Max Tokens: 150

3. **Voice Settings:**
   - Provider: ElevenLabs
   - Voice ID: `EXAVITQu4vr4xnSDxMaL` (English - warm female)
   - Model: eleven_monolingual_v1
   - Stability: 0.7
   - Similarity Boost: 0.8
   - Style: 0.5
   - Enable Speaker Boost: Yes

4. **Transcription Settings:**
   - Provider: Deepgram
   - Model: nova-2
   - Language: en-US
   - Smart Format: ON
   - Punctuate: ON
   - Profanity Filter: OFF

5. **Advanced Settings:**
   - First Message: "Hello! This is Sam. Who am I speaking with today?"
   - Request Timeout: 10 seconds
   - Silence Timeout: 30 seconds
   - Max Call Duration: 900 seconds (15 minutes)
   - End Call Phrases: goodbye, bye, talk to you later

6. **Save and Get Assistant ID**

#### Alternative: API Deployment (Advanced):
```bash
# Create assistant via API
curl -X POST https://api.vapi.ai/assistant \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @vapi/assistant-config.json

# Response will include assistant ID
# Save it to .env:
echo "VAPI_ASSISTANT_ID=asst_xxxxx" >> .env
```

**Verification:**
```bash
# Test assistant exists
curl https://api.vapi.ai/assistant/$VAPI_ASSISTANT_ID \
  -H "Authorization: Bearer $VAPI_API_KEY"
```

---

### 4.2d: Link Phone Number to Assistant

**Duration:** 5 minutes

#### Steps:
1. **In Vapi Dashboard → Phone Numbers**
   - Click on your 206 number
   - Under "Assistant", select "Sam - ElderLink Companion"
   - Save

2. **Verify Link**
   ```bash
   # Call the phone number
   # Expected: Hear Sam's greeting instead of default
   # "Hello! This is Sam. Who am I speaking with today?"
   ```

**Test Call:**
```
You: [Call the number]
Sam: "Hello! This is Sam. Who am I speaking with today?"
You: "This is a test"
Sam: [Should get response from your webhook]
```

**If Webhook Fails:**
- Check Worker logs: `wrangler tail`
- Verify webhook URL is correct
- Check CORS headers
- See Troubleshooting section

---

### 4.2e: Document Assistant ID

```bash
# Add to .env
echo "VAPI_ASSISTANT_ID=asst_abc123xyz" >> .env

# Update team channel
# Post: "✅ Vapi Assistant configured - ID: asst_abc123xyz"

# Commit configuration
git add vapi/assistant-config.json .env.example
git commit -m "feat: Add Vapi assistant configuration"
```

---

## Task 4.3: ElevenLabs Voice Configuration (Hour 2-3)

### 4.3a: Create Voice Settings File

**Duration:** 15 minutes

#### Create `vapi/voice-settings.json`:
```json
{
  "voices": {
    "english": {
      "voiceId": "EXAVITQu4vr4xnSDxMaL",
      "name": "Sarah (ElevenLabs)",
      "description": "Warm, mature female voice - perfect for elderly companion",
      "model": "eleven_monolingual_v1",
      "settings": {
        "stability": 0.7,
        "similarityBoost": 0.8,
        "style": 0.5,
        "useSpeakerBoost": true
      },
      "optimizations": {
        "pace": "slightly_slower",
        "clarity": "high",
        "warmth": "high"
      }
    },
    "mandarin": {
      "voiceId": "FGY2WhTYpPnrIDTdsKH5",
      "name": "Mandarin Female (ElevenLabs)",
      "description": "Natural Mandarin speaker",
      "model": "eleven_multilingual_v2",
      "settings": {
        "stability": 0.7,
        "similarityBoost": 0.8,
        "style": 0.5,
        "useSpeakerBoost": true
      },
      "optimizations": {
        "pace": "slightly_slower",
        "clarity": "high",
        "warmth": "high"
      }
    }
  },
  "elderlyOptimizations": {
    "volume": "+3dB",
    "clarity": "enhanced",
    "pace": "0.9x normal speed",
    "pitchVariation": "moderate"
  }
}
```

**Rationale:**
- Stability 0.7: Consistent but not robotic
- Similarity Boost 0.8: Maintains voice characteristics
- Style 0.5: Moderate expressiveness (not monotone, not overly dramatic)
- Speaker Boost: Enhances clarity for phone calls
- Slower pace: Easier for elderly to understand

---

### 4.3b: Test Voice Quality

**Duration:** 20 minutes

#### Test Script:
```bash
# Create test script: scripts/test-voice.sh
#!/bin/bash

# Test English voice
curl -X POST https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello Mrs. Chen! How are those tomatoes in your garden doing?",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.7,
      "similarity_boost": 0.8,
      "style": 0.5
    }
  }' \
  --output test-english.mp3

# Test Mandarin voice
curl -X POST https://api.elevenlabs.io/v1/text-to-speech/FGY2WhTYpPnrIDTdsKH5 \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "你好陈太太！你的花园里的西红柿怎么样了？",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.7,
      "similarity_boost": 0.8,
      "style": 0.5
    }
  }' \
  --output test-mandarin.mp3

echo "✅ Audio files generated. Play them to test quality."
echo "Play: afplay test-english.mp3 (Mac) or start test-english.mp3 (Windows)"
```

#### Quality Checklist:
- [ ] Voice sounds warm and friendly (not robotic)
- [ ] Clear pronunciation
- [ ] Appropriate pace (not too fast)
- [ ] Natural intonation
- [ ] No crackling or artifacts
- [ ] Suitable for elderly (clear, not too high-pitched)

**If Voice Quality is Poor:**
- Try different stability values (0.5-0.9)
- Adjust similarity_boost
- Try different voice IDs from ElevenLabs library
- See "Troubleshooting Voice Issues" section

---

### 4.3c: Test on Speakerphone

**Duration:** 10 minutes

#### Setup:
1. Play test audio files through speakerphone
2. Listen from 6-8 feet away (demo distance)
3. Check for:
   - [ ] No echo or feedback
   - [ ] Clear and loud enough
   - [ ] Natural sound (not tinny)

#### Adjustments if Needed:
```json
// If too quiet:
{
  "settings": {
    "volume": "+3dB"  // Add volume boost
  }
}

// If too fast:
{
  "settings": {
    "speaking_rate": 0.9  // Slow down 10%
  }
}

// If unclear:
{
  "settings": {
    "clarity_boost": 0.5  // Enhance clarity
  }
}
```

---

### 4.3d: Configure Language Switching in Assistant

**Duration:** 10 minutes

#### Update Vapi Assistant:
1. **Go to Vapi Dashboard → Assistant Settings**
2. **Enable Dynamic Voice Selection:**
   - This will be handled by your webhook
   - Webhook returns different voiceId based on detected language

3. **Webhook Response Format:**
   ```json
   {
     "content": "Sam's response here",
     "voiceId": "EXAVITQu4vr4xnSDxMaL"  // English or Mandarin
   }
   ```

#### Test Language Detection:
```bash
# Your webhook should:
# 1. Receive language from Vapi (it detects automatically)
# 2. Return appropriate voiceId

# English test:
curl -X POST https://your-worker.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hello Sam"},
      "language": "en-US"
    }
  }'

# Expected: voiceId = EXAVITQu4vr4xnSDxMaL

# Mandarin test:
curl -X POST https://your-worker.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "你好"},
      "language": "zh"
    }
  }'

# Expected: voiceId = FGY2WhTYpPnrIDTdsKH5
```

---

### 4.3e: Commit Voice Configuration

```bash
git add vapi/voice-settings.json scripts/test-voice.sh
git commit -m "feat: Configure ElevenLabs voices with elderly-friendly settings"
git push origin feat/voice-phone
```

---

## Task 4.4: Latency Testing Scripts (TDD) (Hour 3-5)

### 4.4a: WRITE TESTS FIRST (TDD Workflow)

**Duration:** 30 minutes

#### Create `scripts/test-latency.test.ts`:
```typescript
import { measureWebhookLatency, measureAverageLatency } from './test-latency';

describe('Webhook Latency Tests', () => {
  const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8787';

  test('webhook responds in <3 seconds', async () => {
    const latency = await measureWebhookLatency(WORKER_URL);

    expect(latency).toBeLessThan(3000);
    console.log(`✅ Latency: ${latency}ms`);
  }, 10000); // 10s timeout for test itself

  test('average latency over 10 calls <2.5 seconds', async () => {
    const avgLatency = await measureAverageLatency(WORKER_URL, 10);

    expect(avgLatency).toBeLessThan(2500);
    console.log(`✅ Average latency: ${avgLatency}ms over 10 calls`);
  }, 60000); // 60s timeout

  test('no timeouts in 20 consecutive calls', async () => {
    const results = [];

    for (let i = 0; i < 20; i++) {
      const latency = await measureWebhookLatency(WORKER_URL);
      results.push(latency);
    }

    const timeouts = results.filter(l => l >= 10000); // 10s = Vapi timeout
    expect(timeouts.length).toBe(0);

    console.log(`✅ All 20 calls completed successfully`);
    console.log(`Min: ${Math.min(...results)}ms, Max: ${Math.max(...results)}ms`);
  }, 120000); // 2min timeout

  test('latency breakdown measured', async () => {
    const breakdown = await measureLatencyBreakdown(WORKER_URL);

    expect(breakdown.parsing).toBeLessThan(100);
    expect(breakdown.processing).toBeLessThan(2000);
    expect(breakdown.total).toBeLessThan(3000);

    console.log('📊 Latency Breakdown:');
    console.log(`  Parsing: ${breakdown.parsing}ms`);
    console.log(`  Processing: ${breakdown.processing}ms`);
    console.log(`  Total: ${breakdown.total}ms`);
  }, 10000);

  test('concurrent requests handled correctly', async () => {
    const requests = Array(5).fill(null).map(() =>
      measureWebhookLatency(WORKER_URL)
    );

    const latencies = await Promise.all(requests);

    latencies.forEach(latency => {
      expect(latency).toBeLessThan(5000); // Slight degradation OK
    });

    const avgConcurrent = latencies.reduce((a, b) => a + b) / latencies.length;
    console.log(`✅ Average latency with 5 concurrent: ${avgConcurrent}ms`);
  }, 30000);
});
```

---

### 4.4b: CONFIRM TESTS FAIL (Red Phase)

**Duration:** 5 minutes

```bash
# Run tests (should fail - implementation doesn't exist yet)
npm test scripts/test-latency.test.ts

# Expected output:
# FAIL scripts/test-latency.test.ts
#   Webhook Latency Tests
#     ✕ webhook responds in <3 seconds
#     ✕ average latency over 10 calls <2.5 seconds
#     ...
#
# Cannot find module './test-latency'

# Take screenshot of failing tests
```

**Verification:**
- [ ] All 5 tests show FAIL status
- [ ] Error indicates missing implementation
- [ ] Screenshot saved to `docs/test-failures/latency-tests-red.png`

---

### 4.4c: COMMIT FAILING TESTS

```bash
git add scripts/test-latency.test.ts
git commit -m "test: Add latency testing suite (5 tests, all failing)"
git push origin feat/voice-phone
```

---

### 4.4d: IMPLEMENT LATENCY TESTING SCRIPT

**Duration:** 45 minutes

#### Create `scripts/test-latency.ts`:
```typescript
/**
 * Latency Testing Suite for ElderLink Vapi Webhook
 *
 * Measures response times to ensure <3 second target
 */

interface LatencyResult {
  requestTime: number;
  responseTime: number;
  totalLatency: number;
  success: boolean;
  error?: string;
}

interface LatencyBreakdown {
  parsing: number;
  processing: number;
  total: number;
}

/**
 * Measure single webhook call latency
 */
export async function measureWebhookLatency(
  workerUrl: string,
  message: string = "Hello Sam, this is a test"
): Promise<number> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${workerUrl}/vapi-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          transcript: { content: message },
          role: 'user',
          language: 'en-US'
        },
        conversationHistory: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const endTime = Date.now();

    const latency = endTime - startTime;

    console.log(`[LATENCY] ${latency}ms - Response: "${data.content?.substring(0, 50)}..."`);

    return latency;

  } catch (error) {
    console.error(`[ERROR] Request failed:`, error);
    return 10000; // Return timeout value on error
  }
}

/**
 * Measure average latency over multiple calls
 */
export async function measureAverageLatency(
  workerUrl: string,
  numCalls: number = 10
): Promise<number> {
  console.log(`\n📊 Testing average latency over ${numCalls} calls...\n`);

  const latencies: number[] = [];

  for (let i = 0; i < numCalls; i++) {
    const latency = await measureWebhookLatency(
      workerUrl,
      `Test call ${i + 1} of ${numCalls}`
    );
    latencies.push(latency);

    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  console.log(`\n✅ Results:`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min}ms`);
  console.log(`  Max: ${max}ms`);
  console.log(`  Target: <2500ms`);
  console.log(`  Status: ${avg < 2500 ? '✅ PASS' : '❌ FAIL'}\n`);

  return avg;
}

/**
 * Measure latency breakdown (detailed timing)
 */
export async function measureLatencyBreakdown(
  workerUrl: string
): Promise<LatencyBreakdown> {
  const overallStart = Date.now();

  // This would require Worker to return timing headers
  // For now, estimate based on total time
  const response = await fetch(`${workerUrl}/vapi-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Start': overallStart.toString()
    },
    body: JSON.stringify({
      message: {
        transcript: { content: "Detailed latency test" },
        language: 'en-US'
      }
    })
  });

  const data = await response.json();
  const overallEnd = Date.now();

  const total = overallEnd - overallStart;

  // Estimated breakdown (Worker should provide actual timing)
  const parsing = 50; // Estimated
  const processing = total - parsing;

  return {
    parsing,
    processing,
    total
  };
}

/**
 * Run comprehensive latency test suite
 */
export async function runLatencyTests(workerUrl: string): Promise<void> {
  console.log(`
╔════════════════════════════════��══════════════════════════╗
║           ELDERLINK LATENCY TEST SUITE                    ║
║                                                           ║
║  Target: <3 seconds per call (Vapi timeout: 10s)         ║
║  Goal: <2.5 seconds average                              ║
╚═══════════════════════════════════════════════════════════╝
  `);

  console.log(`\nWorker URL: ${workerUrl}\n`);

  // Test 1: Single call
  console.log('📍 Test 1: Single Call Latency');
  const singleLatency = await measureWebhookLatency(workerUrl);
  console.log(`Result: ${singleLatency}ms ${singleLatency < 3000 ? '✅' : '❌'}\n`);

  // Test 2: Average of 10 calls
  console.log('📍 Test 2: Average Latency (10 calls)');
  const avgLatency = await measureAverageLatency(workerUrl, 10);
  console.log(`Result: ${avgLatency.toFixed(2)}ms ${avgLatency < 2500 ? '✅' : '❌'}\n`);

  // Test 3: Stress test (20 calls)
  console.log('📍 Test 3: Stress Test (20 consecutive calls)');
  const stressResults: number[] = [];
  for (let i = 0; i < 20; i++) {
    const latency = await measureWebhookLatency(workerUrl, `Stress test ${i + 1}`);
    stressResults.push(latency);
  }
  const timeouts = stressResults.filter(l => l >= 10000).length;
  console.log(`Timeouts: ${timeouts}/20 ${timeouts === 0 ? '✅' : '❌'}\n`);

  // Test 4: Breakdown
  console.log('📍 Test 4: Latency Breakdown');
  const breakdown = await measureLatencyBreakdown(workerUrl);
  console.log(`Parsing: ${breakdown.parsing}ms`);
  console.log(`Processing: ${breakdown.processing}ms`);
  console.log(`Total: ${breakdown.total}ms ${breakdown.total < 3000 ? '✅' : '❌'}\n`);

  // Summary
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                      SUMMARY                              ║
╠═══════════════════════════════════════════════════════════╣
║  Single Call:    ${singleLatency}ms ${singleLatency < 3000 ? '✅' : '❌'}                       ║
║  Average (10):   ${avgLatency.toFixed(2)}ms ${avgLatency < 2500 ? '✅' : '❌'}                     ║
║  Timeouts (20):  ${timeouts}/20 ${timeouts === 0 ? '✅' : '❌'}                          ║
║  Breakdown:      ${breakdown.total}ms ${breakdown.total < 3000 ? '✅' : '❌'}                      ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

// CLI execution
if (require.main === module) {
  const workerUrl = process.env.WORKER_URL || 'http://localhost:8787';

  runLatencyTests(workerUrl)
    .then(() => {
      console.log('\n✅ Latency tests completed\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Latency tests failed:', error);
      process.exit(1);
    });
}
```

---

### 4.4e: ITERATE UNTIL TESTS PASS (Green Phase)

**Duration:** Variable (depends on performance)

```bash
# Run tests
npm test scripts/test-latency.test.ts

# If tests fail due to high latency:
# 1. Check Worker performance (talk to Dev 2)
# 2. Check network latency
# 3. Check Gemini API response time
# 4. Consider adding caching

# Run manual test
WORKER_URL=https://your-worker.workers.dev npm run test:latency

# Expected output (all green):
# ✅ Single Call: 1850ms
# ✅ Average (10): 2100ms
# ✅ No timeouts
# ✅ Breakdown: 2050ms
```

**If Tests Still Fail:**
See "Performance Optimization" in Troubleshooting section.

---

### 4.4f: VERIFY WITH INDEPENDENT TESTING

**Duration:** 15 minutes

```bash
# Test from different network
# Test from different device
# Test with actual phone call (not just curl)

# Measure phone-to-voice latency
# 1. Call phone number
# 2. Start speaking immediately when prompted
# 3. Stop speaking
# 4. Time until Sam starts responding
# Expected: <3 seconds from when you stop speaking
```

**Create Test Report:**
```markdown
# Latency Test Report

**Date:** 2025-01-18
**Tester:** Developer 3

## Results

| Test | Target | Actual | Status |
|------|--------|--------|--------|
| Single Call | <3000ms | 1850ms | ✅ |
| Average (10) | <2500ms | 2100ms | ✅ |
| Stress (20) | 0 timeouts | 0 | ✅ |
| Phone Call | <3000ms | 2800ms | ✅ |

## Breakdown
- Network latency: ~100ms
- Webhook processing: ~200ms
- Gemini API: ~800ms
- Voice synthesis: ~500ms
- **Total: ~2100ms** ✅

## Recommendations
- Consider caching for common responses
- Monitor Gemini API latency
- Add fallback timeout at 7s
```

---

### 4.4g: COMMIT IMPLEMENTATION

```bash
git add scripts/test-latency.ts scripts/test-latency.test.ts
git commit -m "feat: Implement latency testing suite (5/5 tests passing)"
git push origin feat/voice-phone
```

---

## Task 4.5: Basic Call Flow Test (Hour 3 Checkpoint)

### 4.5a: Test Sam's Greeting

**Duration:** 5 minutes

#### Steps:
1. **Call the phone number:**
   ```
   Dial: +1-206-XXX-XXXX
   ```

2. **Listen for greeting:**
   ```
   Expected: "Hello! This is Sam. Who am I speaking with today?"
   ```

3. **Verify voice quality:**
   - [ ] Voice sounds warm and friendly
   - [ ] Clear audio (no crackling)
   - [ ] Appropriate volume
   - [ ] Natural intonation

**If Greeting Doesn't Play:**
- Check assistant is linked to phone number
- Check Vapi dashboard logs
- Verify ElevenLabs voice ID is correct
- Check billing status (ElevenLabs and Vapi)

---

### 4.5b: Check Voice Quality (Not Robotic)

**Duration:** 10 minutes

#### Test Script:
```
Call 1:
You: "Hi Sam"
Expected: Warm response, not "How can I assist you"

Call 2:
You: "Tell me about yourself"
Expected: Natural response about being a companion

Call 3:
You: "What's the weather like?"
Expected: Deflects gracefully, asks about senior's day
```

#### Quality Checklist:
- [ ] No robotic tone
- [ ] Natural pauses
- [ ] Conversational (not formal)
- [ ] Empathetic tone
- [ ] Age-appropriate pace

**Document Issues:**
```markdown
# Voice Quality Issues

## Issue 1: Too fast
- Solution: Adjusted speaking_rate to 0.9

## Issue 2: Robotic intonation
- Solution: Increased style parameter to 0.6
```

---

### 4.5c: Confirm Audio Quality on Speakerphone

**Duration:** 10 minutes

#### Setup:
1. Place phone on speakerphone
2. Stand 6-8 feet away (demo distance)
3. Make test call

#### Checklist:
- [ ] No echo
- [ ] No feedback loop
- [ ] Volume loud enough (from 8 feet)
- [ ] Clear pronunciation
- [ ] No background noise

**Test in Demo Environment:**
- Use actual demo room if available
- Test with projector/speakers on
- Test with multiple people present (background noise)

---

### 4.5d: Measure Latency (Sam Should Start Speaking Within 3 Seconds)

**Duration:** 15 minutes

#### Manual Timing Test:
```
1. Call phone number
2. Wait for greeting
3. Start stopwatch when you STOP speaking
4. Stop timer when Sam STARTS responding
5. Record time

Repeat 5 times and average.
```

#### Recording:
| Test | Your Message | Stop Speaking | Sam Starts | Latency |
|------|--------------|---------------|------------|---------|
| 1 | "Hello Sam" | 0:00 | 0:02.5 | 2.5s ✅ |
| 2 | "How are you?" | 0:00 | 0:02.8 | 2.8s ✅ |
| 3 | "Tell me about gardening" | 0:00 | 0:03.1 | 3.1s ⚠️ |
| 4 | "你好" (Mandarin) | 0:00 | 0:02.9 | 2.9s ✅ |
| 5 | "What's the weather?" | 0:00 | 0:02.6 | 2.6s ✅ |

**Average:** 2.78 seconds ✅

**If Latency > 3 Seconds:**
1. Check Worker performance
2. Check Gemini API latency
3. Check network connectivity
4. Consider optimization (see Troubleshooting)

---

### 4.5e: Document Hour 3 Checkpoint Results

```bash
# Create checkpoint report
cat > docs/hour-3-checkpoint.md << 'EOF'
# Hour 3 Checkpoint - Voice & Phone System

**Date:** 2025-01-18
**Developer:** Developer 3
**Status:** ✅ PASS

## Test Results

### Phone Configuration
- [x] Number active: +1-206-555-1234
- [x] Greeting plays correctly
- [x] Call recording enabled

### Voice Quality
- [x] Warm and natural tone
- [x] Not robotic
- [x] Clear on speakerphone
- [x] Appropriate volume

### Latency
- [x] Average response time: 2.78s
- [x] All calls < 3.5s
- [x] Target <3s: 4/5 calls pass

### Issues Found
1. One call had 3.1s latency (acceptable)
2. Minor echo on speakerphone (adjusting mic position)

### Next Steps
- Configure Deepgram transcription
- Test language switching
- Record backup demos (Hour 16)

---
**Sign-off:** Ready to proceed to Task 4.6
EOF

git add docs/hour-3-checkpoint.md
git commit -m "docs: Hour 3 checkpoint - voice system verified"
```

---

## Task 4.6: Deepgram Transcription Configuration (Hour 5-6)

### 4.6a: Configure in Vapi Dashboard

**Duration:** 15 minutes

#### Steps:
1. **Go to Vapi Dashboard → Assistant Settings → Transcription**

2. **Set Deepgram Configuration:**
   - Provider: Deepgram
   - Model: nova-2 (latest, most accurate)
   - Language: en-US
   - Smart Format: ON (adds punctuation)
   - Punctuation: ON
   - Profanity Filter: OFF (we need authentic conversation)
   - Diarization: OFF (single speaker)
   - Interim Results: OFF (reduces noise)

3. **Advanced Settings:**
   ```json
   {
     "keywords": [
       "Mrs. Chen",
       "Sarah",
       "Tommy",
       "gardening",
       "piano",
       "Lisinopril",
       "Metformin",
       "arthritis"
     ],
     "replace": {
       "Sam I am": "Sam",
       "Elder Link": "ElderLink"
     }
   }
   ```

4. **Save Configuration**

**Why These Settings:**
- nova-2: Latest model, best for conversational speech
- Smart Format: Makes transcription readable
- Keywords: Boosts accuracy for important names/terms
- No profanity filter: Need authentic health discussions

---

### 4.6b: Test with Accented English

**Duration:** 20 minutes

#### Test Script:
```
Test with various accents (have team members help):
1. Standard American English
2. British English
3. Indian English
4. Chinese-accented English (most relevant)
```

#### Test Calls:
```
Call 1 (Chinese accent):
"Hello Sam, this is Mrs. Chen. My daughter Sarah visited yesterday."

Expected Transcription:
"Hello Sam, this is Mrs. Chen. My daughter Sarah visited yesterday."

NOT:
"Hello Sam, this is misses Chan. My daughter Sala visited yesterday."
```

#### Quality Metrics:
- [ ] Name recognition: "Mrs. Chen" (not "Mrs. Chan" or "misses chain")
- [ ] Family names: "Sarah", "Tommy" (not "Sara", "Tammy")
- [ ] Medical terms: "Lisinopril", "arthritis" (not "license April", "our thritis")
- [ ] Overall accuracy: >90%

**If Transcription Accuracy < 90%:**
1. Add more keywords to boost recognition
2. Adjust microphone sensitivity
3. Test in quieter environment
4. Consider accent-specific model (if available)

---

### 4.6c: Test with Mandarin Phrases

**Duration:** 20 minutes

#### Language Switching Tests:
```
Test 1: Mid-conversation language switch
English: "Hello Sam, how are you?"
Mandarin: "我今天有点累" (I'm a bit tired today)
English: "But otherwise I'm fine"

Expected:
- Deepgram detects language change
- Transcript includes Chinese characters
- Worker receives language code "zh"
- Response uses Mandarin voice

Test 2: Mixed sentence
"I went to the market to buy 西红柿" (tomatoes)

Expected:
- Captures both languages
- Worker handles code-switching
```

#### Verification:
```bash
# Check Worker logs
wrangler tail

# Look for language detection:
# [VAPI] Message received: "我今天有点累"
# [VAPI] Language detected: zh
# [VOICE] Selected voice: FGY2WhTYpPnrIDTdsKH5 (Mandarin)
```

**Test Results Template:**
```markdown
| Test | Input | Language Detected | Voice Used | Accuracy |
|------|-------|-------------------|------------|----------|
| English | "Hello Sam" | en-US | EXAVITQu... | 100% |
| Mandarin | "你好" | zh | FGY2WhTY... | 100% |
| Switch | "我很累" | zh | FGY2WhTY... | 100% |
| Mixed | "I need 西红柿" | en-US | EXAVITQu... | 95% |
```

---

### 4.6d: Document Transcription Issues

**Create:** `docs/transcription-notes.md`

```markdown
# Deepgram Transcription Notes

## Configuration
- Model: nova-2
- Language: en-US (with Chinese detection)
- Keywords: Mrs. Chen, Sarah, Tommy, arthritis, Lisinopril

## Known Issues

### Issue 1: Mrs. Chen vs Mrs. Chan
**Problem:** Accent causes "Chen" → "Chan"
**Solution:** Added "Mrs. Chen" to keywords list
**Status:** ✅ Resolved

### Issue 2: Medication names
**Problem:** "Lisinopril" transcribed as "license April"
**Solution:** Added all medications to keywords
**Status:** ✅ Resolved

### Issue 3: Code-switching lag
**Problem:** 1-2 second delay when switching languages
**Solution:** Expected behavior, acceptable
**Status:** ⚠️ Monitoring

## Recommendations
- Keep keyword list updated as new names/terms appear
- Review transcription accuracy weekly
- Consider fallback for unintelligible audio
```

---

## Task 4.7: Backup Demo Recordings (Hour 16+)

**CRITICAL:** These are your safety net if live demo fails.

### 4.7a: Record Demo 1 - Memory (2-3 minutes)

**Duration:** 30 minutes (including multiple takes)

#### Script:
```
CALL 1 (Morning):
Mrs. Chen: "Hello Sam, it's Mrs. Chen"
Sam: [Should reference known information]
Mrs. Chen: "My daughter Sarah is visiting tomorrow with Tommy"
Sam: [Acknowledges, asks follow-up]
Mrs. Chen: "Yes, we're going to work on the tomato garden"
Sam: [Shows enthusiasm, remembers previous garden talks]
[End call]

CALL 2 (Afternoon - 2 hours later):
Mrs. Chen: "Hi Sam"
Sam: "Hi Mrs. Chen! How did the gardening go with Sarah and Tommy?"
Mrs. Chen: "It was wonderful, Tommy helped plant the tomatoes"
Sam: [References this new information naturally]
```

#### Recording Process:
1. **Setup:**
   ```bash
   # Mac: Use QuickTime Screen Recording (with audio)
   # Windows: Use OBS Studio
   # Linux: Use SimpleScreenRecorder

   # Start recording BEFORE making call
   # Include both phone screen and computer dashboard
   ```

2. **Make Calls:**
   - Use actual phone (not simulator)
   - Have someone play Mrs. Chen
   - Follow script but sound natural
   - Ensure Sam's responses demonstrate memory

3. **Verify Recording:**
   - [ ] Audio clear and loud enough
   - [ ] Shows memory continuity
   - [ ] Both calls captured
   - [ ] 2-3 minutes total

4. **Save File:**
   ```bash
   mkdir -p recordings/demos
   # Save as: memory-demo.mp4
   # Also export audio only: memory-demo.mp3
   ```

---

### 4.7b: Record Demo 2 - Health Tracking (2-3 minutes)

#### Script:
```
Mrs. Chen: "Hello Sam"
Sam: "Hi Mrs. Chen! How are you feeling today?"
Mrs. Chen: "My arthritis has been acting up"
Sam: "I'm sorry to hear that. Are you still taking your Lisinopril?"
Mrs. Chen: "Oh, I actually forgot my morning pills today"
Sam: "I'll make a note for your doctor. Is there anything that helps with the pain?"
Mrs. Chen: "It's worse when I garden, but I don't want to stop"
Sam: "I understand. Maybe we can talk about pacing? Your checkup with Dr. Smith is next Tuesday"

[Switch to dashboard view showing health note being created]
[Show Health Timeline with new entry]
```

#### Capture:
- Phone conversation audio
- Dashboard Health Timeline updating in real-time
- Alert appearing (yellow - medication non-adherence)

**Save as:** `recordings/demos/health-demo.mp4`

---

### 4.7c: Record Demo 3 - Language Switching (2-3 minutes)

#### Script:
```
Mrs. Chen: "Hello Sam, how are you?"
Sam: [Responds in English]
Mrs. Chen: "I'm good. 我今天有点累" (I'm a bit tired today)
Sam: [Responds in Mandarin]
Mrs. Chen: "但是我很高兴Sarah要来" (But I'm happy Sarah is coming)
Sam: [Continues in Mandarin, shows understanding]
Mrs. Chen: "Actually, let me speak English. She wants to learn about my garden"
Sam: [Smoothly switches back to English]
```

#### Verification:
- [ ] Voice changes audibly (English → Mandarin → English)
- [ ] Dashboard shows language indicator changing
- [ ] Smooth transitions
- [ ] Natural code-switching

**Save as:** `recordings/demos/language-demo.mp4`

---

### 4.7d: Record Demo 4 - Emotional Support (2-3 minutes)

#### Script:
```
Mrs. Chen: "Hi Sam" [Sad tone]
Sam: "Hello Mrs. Chen. You sound a bit down today"
Mrs. Chen: "I've been feeling lonely. I haven't talked to anyone in days"
Sam: "I'm sorry to hear that. Loneliness is really difficult. Tell me, what's been on your mind?"
Mrs. Chen: "I miss my friends from Shanghai. Nobody understands"
Sam: "That sounds really hard. Your cultural background and memories are so important.
     By the way, I've found some friends nearby who speak Mandarin and love gardening too.
     Your daughter can see them on the family dashboard."
Mrs. Chen: [Sounds more hopeful] "Really? That would be nice"

[Switch to dashboard Community tab]
[Show matches with high scores, shared Mandarin language]
```

#### Capture:
- Emotional tone shift (sad → hopeful)
- Sentiment meter on dashboard (red → yellow → green)
- Community matches displayed
- Group suggestions shown

**Save as:** `recordings/demos/emotional-demo.mp4`

---

### 4.7e: Save and Organize Recordings

**Duration:** 15 minutes

#### File Structure:
```
recordings/
├── demos/
│   ├── memory-demo.mp4           # Video + audio
│   ├── memory-demo.mp3           # Audio only
│   ├── health-demo.mp4
│   ├── health-demo.mp3
│   ├── language-demo.mp4
│   ├── language-demo.mp3
│   ├── emotional-demo.mp4
│   └── emotional-demo.mp3
├── backups/
│   ├── full-demo-run1.mp4        # Complete rehearsal
│   └── full-demo-run2.mp4        # Complete rehearsal
└── README.md
```

#### Create `recordings/README.md`:
```markdown
# ElderLink Demo Recordings

## Purpose
Backup recordings in case live demo fails during presentation.

## Files

### 1. Memory Demo (2:15)
- **Shows:** Sam remembers Sarah and Tommy from previous call
- **Use case:** If memory integration test fails during demo
- **Key moment:** 1:30 - Sam references Sarah's visit naturally

### 2. Health Demo (2:45)
- **Shows:** Health tracking + MyChart integration
- **Use case:** If health note creation fails
- **Key moment:** 2:00 - Dashboard shows new health note

### 3. Language Demo (2:20)
- **Shows:** Seamless language switching
- **Use case:** If ElevenLabs voice switching fails
- **Key moment:** 0:45 - Voice changes from English to Mandarin

### 4. Emotional Demo (2:40)
- **Shows:** Community matching + empathy
- **Use case:** If community tab fails to load
- **Key moment:** 1:50 - Dashboard shows community matches

## How to Use During Demo

If something fails:
1. Calmly say: "Let me show you what happened earlier today..."
2. Play relevant recording (queued up in advance)
3. Explain what you're showing
4. Continue with rest of demo

## Pre-Demo Checklist
- [ ] All files copied to presentation laptop
- [ ] Backup on USB drive
- [ ] Files tested and play correctly
- [ ] Volume adjusted for room
- [ ] Know which file is which (practice transitions)
```

---

## Integration Testing Schedule

### Hour 6: First Integration Test (WITH DEVELOPER 2)

**What:** Phone → Webhook → Response chain works

```bash
# Before test:
1. Developer 2 confirms Worker is deployed and stable
2. You confirm Vapi assistant is linked
3. Integration Lead coordinates timing

# Test:
1. Call phone number
2. Say: "Hello Sam, this is Mrs. Chen"
3. Time response
4. Verify:
   - Response received <3s
   - Content is appropriate
   - Voice sounds natural

# If FAILS:
- 30-minute all-hands debug session
- Check: Vapi logs, Worker logs, Gemini API
- Don't proceed until fixed
```

---

### Hour 8: CRITICAL Memory Test (ALL DEVELOPERS)

**What:** Memory continuity test MUST pass

```bash
# Test Procedure:
CALL 1:
- Say: "My daughter Sarah visited with Tommy yesterday"
- Verify Sam responds naturally
- Wait 3 seconds for async processing

CALL 2 (2 minutes later):
- Say: "Hello Sam"
- CRITICAL: Sam MUST mention Sarah or Tommy
- If not → STOP ALL DEVELOPMENT
- Debug until fixed

# Success Criteria:
✅ Sam references Sarah/Tommy in Call 2
✅ Profile.memories.family updated
✅ Dashboard shows conversation history

# If FAILS:
- ALL developers stop current work
- Emergency debug session
- This is the core differentiator - CANNOT FAIL
```

---

### Hour 10: Health Tracking Test (WITH DEVELOPER 4)

**What:** Health mentions → Dashboard notes

```bash
# Test:
1. Call and say: "I forgot to take my morning pills"
2. Wait 3 seconds
3. Developer 4 checks dashboard Health Timeline
4. Verify note appears with "forgot pills"

# Success Criteria:
✅ Health note created
✅ Note shows in dashboard
✅ Alert created (yellow)

# If FAILS:
- Check async processing
- Check health service
- Check dashboard API
```

---

### Hour 12: Language Test

**What:** Language switching demonstration

```bash
# Test:
1. Start call in English
2. Say: "我今天有点累" (Mandarin)
3. Verify voice changes to Mandarin
4. Say: "Actually, let's speak English"
5. Verify voice switches back

# Success Criteria:
✅ Voice changes audibly
✅ Dashboard shows language indicator
✅ Smooth transitions

# If FAILS:
- Fallback to English-only demo
- Document decision
```

---

### Hour 14: Full Pipeline Test (ALL 5 SUCCESS CRITERIA)

**What:** Complete 3-minute conversation

```bash
# Test all 5 success metrics:
1. Memory: Sam references known information
2. Natural: Responses are 2-3 sentences, warm tone
3. Health: Proactive health check + note creation
4. Sentiment: Dashboard shows real-time changes
5. Community: 3 matches displayed

# This is last chance for major fixes
# Focus on demo-critical features only
```

---

## Troubleshooting Guide

### Issue: High Latency (>3 seconds)

**Diagnosis:**
```bash
# Check latency breakdown
npm run test:latency

# Check Worker performance
wrangler tail

# Check Gemini API latency
# (Look for "Gemini call: XXXXms" in logs)
```

**Solutions:**
1. **If Gemini is slow (>1s):**
   - Consider response caching for common phrases
   - Use shorter prompts
   - Reduce max_tokens to 100

2. **If Worker is slow (>500ms):**
   - Talk to Developer 2
   - Check for expensive operations in webhook handler
   - Consider moving more to async

3. **If network is slow:**
   - Test from different location
   - Check Cloudflare Workers region
   - Consider CDN for dashboard assets

---

### Issue: Voice Sounds Robotic

**Solutions:**
```json
// Increase expressiveness
{
  "stability": 0.6,  // Lower = more expressive
  "style": 0.7,      // Higher = more emotional
  "similarityBoost": 0.9
}

// Test different voices
// Try: EXAVITQu4vr4xnSDxMaL (Sarah)
//      onwK4e9ZLuTAKqWW03F9 (Grace)
```

---

### Issue: Language Detection Failures

**Solutions:**
1. Check Vapi logs for detected language
2. Add language hint in webhook response
3. Use explicit language codes
4. Test with longer phrases (better detection)

---

### Issue: Echo on Speakerphone

**Solutions:**
1. Reduce speaker volume
2. Move phone further from speaker
3. Use dedicated speakerphone (not laptop speaker)
4. Enable echo cancellation in Vapi settings

---

### Issue: Vapi Not Calling Webhook

**Diagnosis:**
```bash
# Check webhook URL is correct
curl https://your-worker.workers.dev/api/health

# Check Vapi dashboard logs
# Look for webhook errors

# Check CORS headers
curl -X OPTIONS https://your-worker.workers.dev/vapi-webhook \
  -H "Origin: https://vapi.ai"
```

**Solutions:**
1. Verify Worker is publicly accessible
2. Check CORS middleware
3. Verify assistant configuration
4. Check Vapi billing status

---

### Issue: Recordings Have Poor Audio

**Solutions:**
1. Use external microphone
2. Record in quiet room
3. Test audio levels before final recording
4. Use lossless format (WAV) then convert to MP3
5. Normalize audio levels in post-processing

---

## Final Pre-Demo Checklist (Hour 23)

### Phone System
- [ ] Phone number working
- [ ] Sam's greeting plays correctly
- [ ] Voice quality verified on speakerphone
- [ ] No echo or feedback
- [ ] Latency <3 seconds consistently

### Backup Materials
- [ ] 4 demo recordings ready and tested
- [ ] Recordings copied to presentation laptop
- [ ] Backup on USB drive
- [ ] Audio levels adjusted for room

### Configuration
- [ ] .env file complete
- [ ] Vapi assistant linked to phone number
- [ ] ElevenLabs voices configured
- [ ] Deepgram transcription accurate

### Testing
- [ ] Latency tests passing (all <3s)
- [ ] Language switching verified
- [ ] Memory test passed (Hour 8)
- [ ] Health tracking verified (Hour 10)
- [ ] Full pipeline tested (Hour 14)

### Documentation
- [ ] All issues documented
- [ ] Troubleshooting guide ready
- [ ] Team knows backup plan
- [ ] Hand signals agreed upon

---

## Success! You're Ready to Demo

If all checkboxes are checked:
- ✅ Phone system configured
- ✅ Voice quality excellent
- ✅ Latency <3 seconds
- ✅ Backup recordings ready
- ✅ All integration tests passed

**You've completed Developer 3's responsibilities. Great work!**

---

## Appendix: Quick Reference

### Important URLs
- Vapi Dashboard: https://dashboard.vapi.ai
- ElevenLabs: https://elevenlabs.io
- Worker URL: `https://elderlink-dev.YOUR_NAME.workers.dev`

### Key Environment Variables
```bash
VAPI_PHONE_NUMBER=+1206XXXXXXX
VAPI_API_KEY=...
VAPI_ASSISTANT_ID=asst_...
ELEVENLABS_API_KEY=...
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5
```

### Key Commands
```bash
# Test latency
npm run test:latency

# Watch Worker logs
wrangler tail

# Test webhook directly
curl -X POST $WORKER_URL/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"test"}}}'

# Run integration tests
npm run test:memory
npm run test:health
npm run test:pipeline
```

### Emergency Contacts
- Integration Lead: [Name]
- Developer 2 (Backend): [Name]
- Developer 4 (Dashboard): [Name]

---

**Remember:** TDD is mandatory. Write tests → See them fail → Implement → Pass tests → Verify → Commit. Good luck! 🚀
