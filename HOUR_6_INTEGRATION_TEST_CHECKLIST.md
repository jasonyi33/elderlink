# Hour 6 Integration Test Checklist

**Purpose**: Verify the complete phone → webhook → response pipeline works end-to-end
**Timeline**: Hour 6 (Critical Checkpoint - if this fails, all developers debug together)
**Duration**: 30-45 minutes
**Participants**: ALL developers (Dev 1, 2, 3, Dashboard, Integration Lead)

---

## Pre-Test Requirements (Complete BEFORE Hour 6)

### Developer 1 (Dashboard) - READY ✅
- [ ] Dashboard deployed and accessible
- [ ] Profile tab displays data from `/api/profiles/mrs-chen`
- [ ] Health Timeline tab ready to show notes
- [ ] Alerts tab ready to show alerts
- [ ] Sentiment meter visible and updating
- [ ] CORS configured to allow Worker API calls
- [ ] Polling interval set to 2 seconds during active calls

### Developer 2 (Backend/AI) - REQUIRED ⚠️
- [ ] `/vapi-webhook` endpoint implemented (currently 404)
- [ ] Returns valid JSON response with `content` and `voiceId`
- [ ] Response time <3 seconds (tested locally)
- [ ] Profile lookup by phone number working
- [ ] Gemini API integration complete
- [ ] Memory context included in prompts
- [ ] Async processing (sentiment, health, memory) implemented
- [ ] Language detection working
- [ ] Fallback responses configured

### Developer 3 (Voice/Phone) - READY ✅
- [ ] Vapi assistant deployed (ID: `5af660dd-dada-4863-af15-383c693873f7`)
- [ ] Phone number active (`+1-224-858-1016`)
- [ ] Webhook URL configured in Vapi
- [ ] ElevenLabs voices tested (English + Mandarin)
- [ ] Latency test scripts ready (`scripts/test-latency.ts`)
- [ ] Demo scripts prepared (4 scenarios)

### All Developers
- [ ] Worker deployed to dev environment: `https://elderlink-dev.elderlinkhelper.workers.dev`
- [ ] All API keys in `.env` and Cloudflare secrets
- [ ] KV namespace connected and accessible
- [ ] Health check endpoint returning 200: `/api/health`
- [ ] Slack channel open for real-time communication
- [ ] Screen recording ready (for documentation/debugging)

---

## Integration Test Flow (5 Phases)

### Phase 1: Connectivity Test (5 minutes)

**Objective**: Verify all systems are reachable

#### Step 1.1: Worker Health Check
```bash
# Developer 2 or 3 runs:
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/health | jq '.'

# Expected output:
# {
#   "status": "ok",
#   "services": {
#     "kv": "connected",
#     "gemini": "not_tested",
#     "vapi": "not_tested"
#   }
# }
```
**✅ PASS**: Status 200, all services show connected/not_tested
**❌ FAIL**: 500 error or "kv": "error" → Fix KV binding

#### Step 1.2: Webhook Endpoint Exists
```bash
# Developer 3 runs:
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"transcript": {"content": "test"}, "role": "user"}}'

# Expected: 200 status (not 404)
```
**✅ PASS**: Returns 200 with JSON response
**❌ FAIL**: Returns 404 → Developer 2 hasn't implemented webhook yet → **STOP AND DEBUG**

#### Step 1.3: Dashboard Loads
```bash
# Developer 1 or Integration Lead:
# Open browser to dashboard URL
# Verify: No console errors, all tabs visible
```
**✅ PASS**: Dashboard loads, 4 tabs visible (Profile, Health, Community, Alerts)
**❌ FAIL**: Console errors or blank page → Fix dashboard deployment

#### Step 1.4: Profile Endpoint Accessible
```bash
# Developer 1 runs:
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.name, .phone'

# Expected output:
# "Mrs. Margaret Chen"
# "+12248581016"
```
**✅ PASS**: Profile data returns correctly
**❌ FAIL**: 404 or empty data → Run `npm run init-demo` to seed data

---

### Phase 2: Webhook Response Test (10 minutes)

**Objective**: Verify webhook responds correctly to test requests

#### Step 2.1: Test English Response
```bash
# Developer 2 or 3 runs:
time curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
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
  }' | jq '.'
```

**Expected Output** (within 3 seconds):
```json
{
  "content": "Hi Mrs. Chen! I'm doing well, thank you. How are you doing today?",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Verification Checklist**:
- [ ] Status code: 200
- [ ] Response time: <3 seconds (ideally <2s)
- [ ] `content` field: Contains Sam's response (natural, not robotic)
- [ ] `voiceId` field: English voice ID (`EXAVITQu4vr4xnSDxMaL`)
- [ ] Response mentions "Mrs. Chen" (personalized, not generic)

**✅ PASS**: All criteria met
**❌ FAIL**: Any criterion fails → Debug:
- Timeout (>3s): Check Gemini API latency, add logging
- Generic response: Check prompt includes profile context
- Wrong voiceId: Check language detection logic
- Missing fields: Check response format matches spec

#### Step 2.2: Test Mandarin Response
```bash
# Developer 2 or 3 runs:
time curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
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
  }' | jq '.'
```

**Expected Output**:
```json
{
  "content": "你好，陈太太！你今天怎么样？",
  "voiceId": "FGY2WhTYpPnrIDTdsKH5"
}
```

**Verification Checklist**:
- [ ] Status code: 200
- [ ] Response time: <3 seconds
- [ ] `content` field: Mandarin response (Chinese characters)
- [ ] `voiceId` field: Mandarin voice ID (`FGY2WhTYpPnrIDTdsKH5`)
- [ ] Response is grammatically correct Mandarin (ask native speaker if available)

**✅ PASS**: All criteria met
**❌ FAIL**:
- English response to Mandarin input → Check language detection
- Gibberish Mandarin → Check Gemini prompt specifies language
- Wrong voiceId → Check `selectVoiceId()` function

#### Step 2.3: Test Memory Continuity
```bash
# Call 1: Provide new information
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "My grandson Tommy helped me in the garden today. He planted cherry tomatoes."},
      "role": "user"
    },
    "call": {"phoneNumber": "+12248581016"}
  }' | jq '.content'

# Wait 10 seconds (for async memory extraction to complete)
sleep 10

# Call 2: Sam should remember Tommy
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hi Sam"},
      "role": "user"
    },
    "call": {"phoneNumber": "+12248581016"}
  }' | jq '.content'
```

**Expected**: Call 2 response references Tommy or tomatoes WITHOUT being reminded

**Verification Checklist**:
- [ ] Call 2 response mentions Tommy, tomatoes, or garden
- [ ] Response feels natural (not "According to our records, you mentioned...")
- [ ] Profile updated with memory (check `/api/profiles/mrs-chen`)

**✅ PASS**: Sam remembers and references naturally
**❌ FAIL**: Generic response with no memory → **CRITICAL - ALL STOP**
- Check memory extraction prompt
- Check async processing is running (`waitUntil`)
- Check profile is being updated in KV
- Check profile context is included in subsequent prompts

---

### Phase 3: Live Phone Call Test (15 minutes)

**Objective**: Verify complete phone → Vapi → webhook → ElevenLabs flow

#### Step 3.1: Prepare Phone Call
**Who**: Developer 3 (primary) + Developer 2 (backup) + Integration Lead (observer)

**Setup**:
- [ ] Speakerphone enabled (everyone can hear)
- [ ] Screen recording active (for demo and debugging)
- [ ] Dashboard open on second screen (Profile tab visible)
- [ ] Worker logs open (`wrangler tail` or Cloudflare dashboard)
- [ ] Slack open for team communication

**Phone Number to Call**: `+1-224-858-1016`

#### Step 3.2: Make the Call
**Developer 3 dials**: `+1-224-858-1016`

**Expected Flow**:
1. Phone rings (1-2 rings)
2. Sam answers: "Hello! This is Sam. Who am I speaking with today?"
3. **Developer 3 responds**: "Hi Sam, this is Margaret Chen. How are you?"
4. Sam responds within 3 seconds with personalized greeting

**Verification During Call**:
- [ ] Sam answers within 5 seconds of call connecting
- [ ] Voice quality is clear (no static, distortion, or robotic sound)
- [ ] Sam responds to each message in <3 seconds
- [ ] Sam mentions "Mrs. Chen" (recognizes caller from phone number)
- [ ] Dashboard updates in real-time (watch Profile tab for new conversation)
- [ ] No awkward silences or timeouts

**Sample Conversation Script** (Developer 3):
```
Dev 3: "Hi Sam, this is Margaret Chen. How are you?"
[Wait for response - should be <3s]

Sam: [Expected: "Hi Mrs. Chen! I'm doing well. How are you today?"]

Dev 3: "I'm doing well. My daughter Sarah called me today."
[Wait for response]

Sam: [Expected: Shows interest, asks about Sarah]

Dev 3: "She's good. I'm planning to make dumplings for her next visit."
[Wait for response]

Sam: [Expected: Positive response, may reference cooking or family]

Dev 3: "Okay Sam, I need to go now. Goodbye!"
Sam: [Expected: "Goodbye, Mrs. Chen! Talk to you soon!"]
[Call should end]
```

**✅ PASS**:
- All responses within 3 seconds
- Voice quality excellent
- Conversation feels natural
- Dashboard shows conversation in real-time

**❌ FAIL Scenarios**:
1. **No answer / Call drops immediately**
   - Check Vapi assistant phone number linkage
   - Check webhook URL configured correctly in Vapi
   - Check Worker is deployed and accessible

2. **Sam answers but doesn't respond to messages**
   - Check webhook is receiving requests (Worker logs)
   - Check webhook is returning valid response
   - Check Vapi assistant configuration

3. **Responses take >5 seconds**
   - Check Gemini API latency (Worker logs)
   - Check network connectivity
   - Consider implementing timeout fallback

4. **Voice sounds robotic or garbled**
   - Check ElevenLabs voice settings (stability, similarity boost)
   - Check voice model is `eleven_multilingual_v2`
   - Check audio quality settings in Vapi

5. **Sam doesn't recognize Mrs. Chen**
   - Check phone number lookup in webhook
   - Check profile exists in KV (`+12248581016` → `mrs-chen`)
   - Check prompt includes profile name

**If ANY Phase 3 test fails**: 30-minute all-hands debugging session (all developers)

---

### Phase 4: Dashboard Integration Test (10 minutes)

**Objective**: Verify dashboard displays real-time updates during call

#### Step 4.1: Make Second Call (with Dashboard Focus)
**Setup**:
- [ ] Dashboard open, Profile tab visible
- [ ] Browser DevTools open (Console + Network tabs)
- [ ] Screen recording active

**Developer 3 calls**: `+1-224-858-1016`

**Conversation Script** (focusing on features):
```
Dev 3: "Hi Sam, this is Mrs. Chen. I've been feeling a bit lonely today."
[Watch sentiment meter - should move toward yellow/orange]

Sam: [Expected: Empathetic response]

Dev 3: "I forgot to take my blood pressure medication this morning."
[Watch Health Timeline - new note should appear within 10 seconds]

Sam: [Expected: Mentions Lisinopril, shows concern]

Dev 3: "Okay, thank you Sam. Goodbye!"
```

**Dashboard Verification Checklist**:
- [ ] **Profile Tab**:
  - [ ] Conversation appears in real-time (<5s delay)
  - [ ] Last Contact timestamp updates
  - [ ] Memory section updates after call ends (within 30s)

- [ ] **Health Timeline Tab**:
  - [ ] New health note appears: "Missed Lisinopril dose (this morning)"
  - [ ] Note timestamp is correct
  - [ ] Note categorized as "Medication"

- [ ] **Alerts Tab**:
  - [ ] Loneliness alert created (yellow indicator)
  - [ ] Alert shows conversation context
  - [ ] Alert timestamp correct

- [ ] **Sentiment Meter** (Profile tab):
  - [ ] Starts at neutral (green)
  - [ ] Moves toward yellow/orange when loneliness mentioned
  - [ ] Updates happen in real-time (not after call ends)

**Network Tab Verification**:
- [ ] API calls to `/api/profiles/mrs-chen` every 2 seconds (polling)
- [ ] No CORS errors
- [ ] All requests return 200 status
- [ ] Response times <500ms

**✅ PASS**: All dashboard elements update correctly in real-time
**❌ FAIL**:
- No updates → Check polling interval, check API endpoint
- CORS errors → Check Worker CORS headers
- Slow updates → Check API response time, optimize queries

---

### Phase 5: Performance & Edge Cases (5 minutes)

**Objective**: Verify system handles edge cases and meets performance targets

#### Step 5.1: Latency Test (Automated)
```bash
# Developer 3 runs latency test suite
cd /Users/jasonyi/elderlink
npm run test:latency

# This runs scripts/test-latency.test.ts
# Tests:
# 1. Single webhook response <3s
# 2. Average of 10 calls <2.5s
# 3. No timeouts in 20 consecutive calls
# 4. Latency breakdown (parsing, processing)
# 5. Concurrent requests handled correctly
```

**✅ PASS**: All 5 tests pass
**❌ FAIL**: Any test fails → Review webhook optimization, consider caching

#### Step 5.2: Unknown Caller Test
```bash
# Test with phone number not in system
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "Hello"},
      "role": "user"
    },
    "call": {
      "phoneNumber": "+15555551234"
    }
  }' | jq '.content'
```

**Expected**: Sam asks for introduction: "Hello! This is Sam. Who am I speaking with today?"

**✅ PASS**: Handles gracefully, asks for introduction
**❌ FAIL**: Error or generic response → Check profile creation logic

#### Step 5.3: Timeout Simulation
```bash
# Simulate slow Gemini response (if possible - may need to add delay in code)
# OR: Just verify fallback response is configured
grep -r "FALLBACK_RESPONSE" worker/src/
```

**Verification**: Fallback responses exist for timeout scenarios

**✅ PASS**: Fallback configured and tested
**❌ FAIL**: No fallback → Add timeout handling

#### Step 5.4: Language Switching Mid-Call
**Developer 3 calls**, speaks in English then switches to Mandarin:
```
Dev 3: "Hi Sam, how are you?"
Sam: [English response with English voice]

Dev 3: "我今天很高兴" (I'm happy today)
Sam: [Should switch to Mandarin response with Mandarin voice]
```

**✅ PASS**: Voice switches seamlessly
**❌ FAIL**: Voice doesn't switch → Check language detection, check voiceId in response

---

## Post-Test Actions

### If ALL Tests Pass ✅

**Celebration** (2 minutes):
- Quick team high-five in Slack 🎉
- Screenshot of successful test results
- Commit and push all code

**Documentation** (5 minutes):
- Update status in project board: "Phase 4 - Hour 6 Integration ✅ COMPLETE"
- Log test results in `TEST_RESULTS.md`
- Share success with full team

**Next Steps**:
- Continue with individual tasks (Dashboard features, AI refinement, etc.)
- Schedule Hour 8 Memory Test (critical differentiator)
- Begin working on Hour 10 Health Tracking Test

---

### If ANY Test Fails ❌

**IMMEDIATE ACTIONS**:

1. **Stop Individual Work** (0 minutes):
   - ALL developers drop current tasks
   - Join emergency debugging session (Zoom or in-person)

2. **Triage** (5 minutes):
   - Identify which phase failed (1, 2, 3, 4, or 5)
   - Identify owner of failing component
   - Prioritize based on severity:
     - Phase 3 failure (live call) = CRITICAL (blocks everything)
     - Phase 2 failure (webhook) = CRITICAL (blocks everything)
     - Phase 4 failure (dashboard) = HIGH (demo impact)
     - Phase 1 or 5 failure = MEDIUM (fixable)

3. **Debug** (20 minutes max):
   - Owner shares screen
   - Team reviews logs together
   - Identify root cause
   - Implement fix

4. **Re-Test** (10 minutes):
   - Re-run failed phase
   - If pass: Continue to next phase
   - If fail again: Escalate to mentor/lead

5. **Document** (5 minutes):
   - Log issue and resolution in `DEBUG_LOG.md`
   - Update troubleshooting docs for future reference
   - Post-mortem after demo (what went wrong, how to prevent)

**Maximum Debugging Time**: 30 minutes
**If still failing after 30 minutes**: Escalate to project lead, consider backup plan

---

## Backup Plan (If Integration Fails Completely)

### Scenario: Webhook not working by Hour 6

**Option 1: Mock Demo** (if webhook fails completely)
- Use pre-recorded demo audio files
- Show dashboard with pre-populated data
- Verbally explain what WOULD happen in live demo
- **Risk**: Judges may ask for live demo, appear less impressive

**Option 2: Extend Deadline** (if close to working)
- Negotiate 1-hour extension with mentor
- All developers focus on webhook only
- Skip non-critical features temporarily
- **Risk**: Delays other milestones (Hour 8, 10, 12)

**Option 3: Simplified Demo** (if partial functionality works)
- Demo ONLY working features (e.g., if memory works but health doesn't)
- Acknowledge limitations openly
- Focus on quality of what works over breadth
- **Risk**: Less impressive, but shows honesty and engineering prioritization

**Decision Maker**: Integration Lead + Project Lead
**Decision Deadline**: Hour 6 + 30 minutes (Hour 6.5)

---

## Success Criteria Summary

### MUST PASS (Demo Blockers):
1. ✅ Webhook endpoint exists and returns 200
2. ✅ Response time <3 seconds consistently
3. ✅ Live phone call works end-to-end
4. ✅ Sam recognizes caller (Mrs. Chen) from phone number
5. ✅ Dashboard shows conversation in real-time

### SHOULD PASS (Demo Quality):
6. ✅ Memory continuity works (references previous conversations)
7. ✅ Health notes created in dashboard
8. ✅ Sentiment meter updates during call
9. ✅ Language switching works (English ↔ Mandarin)
10. ✅ Voice quality is excellent (clear, warm, not robotic)

### NICE TO HAVE (Bonus):
11. ✅ Latency <2 seconds average
12. ✅ Alerts created for concerning mentions
13. ✅ No errors in browser console
14. ✅ Handles edge cases gracefully (unknown caller, timeouts)

---

## Roles & Responsibilities

### Integration Lead
- **Before**: Ensure all pre-test requirements met
- **During**: Run through checklist, coordinate team
- **After**: Document results, make go/no-go decision

### Developer 1 (Dashboard)
- **Before**: Deploy dashboard, verify all tabs load
- **During**: Monitor dashboard updates, check browser console
- **After**: Document any UI issues found

### Developer 2 (Backend/AI)
- **Before**: Implement webhook, test locally
- **During**: Monitor Worker logs, debug response issues
- **After**: Optimize based on performance results

### Developer 3 (Voice/Phone)
- **Before**: Verify Vapi config, prepare test scripts
- **During**: Make phone calls, assess voice quality
- **After**: Run latency tests, document voice issues

### All Developers
- **Before**: Review this checklist
- **During**: Collaborate on debugging if issues arise
- **After**: Commit working code, update documentation

---

## Communication Protocol

### Slack Channels
- **#integration-tests** - Real-time updates during test
- **#dev-general** - Emergency escalations
- **#phase-4-voice** - Voice-specific issues (Dev 3 + Dev 2)

### Status Updates
**Every 10 minutes during test**, Integration Lead posts:
```
[Hour 6 Test - Update]
Phase 1: ✅ Complete
Phase 2: 🔄 In Progress (English response working, testing Mandarin...)
Phase 3: ⏸️ Pending
Phase 4: ⏸️ Pending
Phase 5: ⏸️ Pending
```

### Emergency Escalation
**If critical failure** (live call doesn't work):
```
@channel URGENT: Hour 6 integration test FAILED
Phase: [X]
Issue: [Brief description]
All developers join Zoom NOW: [link]
```

---

## Checklist Summary (Quick Reference)

**Before Test**:
- [ ] All developers ready
- [ ] Worker deployed
- [ ] Dashboard accessible
- [ ] Webhook implemented (Dev 2) ⚠️
- [ ] Vapi configured (Dev 3) ✅
- [ ] Screen recording ready

**Phase 1: Connectivity** (5 min)
- [ ] Health endpoint 200
- [ ] Webhook endpoint 200
- [ ] Dashboard loads
- [ ] Profile endpoint returns data

**Phase 2: Webhook Response** (10 min)
- [ ] English response works (<3s)
- [ ] Mandarin response works (<3s)
- [ ] Memory continuity works

**Phase 3: Live Call** (15 min)
- [ ] Call connects
- [ ] Sam responds (<3s per message)
- [ ] Voice quality excellent
- [ ] Natural conversation

**Phase 4: Dashboard** (10 min)
- [ ] Real-time conversation updates
- [ ] Health notes appear
- [ ] Alerts created
- [ ] Sentiment meter updates

**Phase 5: Performance** (5 min)
- [ ] Latency tests pass
- [ ] Edge cases handled
- [ ] Language switching works

**Post-Test**:
- [ ] Document results
- [ ] Commit code
- [ ] Update project status
- [ ] Plan next milestone (Hour 8)

---

**Last Updated**: 2025-10-18
**Author**: Developer 3 (Voice & Phone System)
**Status**: READY FOR HOUR 6

**Remember**: This is the MOST CRITICAL TEST of the entire project. If this fails, the demo fails. Take it seriously, but stay calm and methodical. We've got this! 💪
