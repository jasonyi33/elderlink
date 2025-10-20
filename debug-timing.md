# Time-Based Demo Timing Debug

## Expected Flow

### Call Start (T=0s)
- Vapi auto-answers
- **Vapi plays firstMessage**: "Hello, Mrs. Chen! How's your garden doing this week?"
- `demoCallStartTime` = Date.now() (e.g., 1000000)
- **Call-state created** with timestamp

### User Message 1 (T=~5s) - "My tomatoes are growing..."
- User finishes speaking at ~5 seconds
- Vapi sends webhook request
- Worker receives: `elapsedSeconds = (Date.now() - 1000000) / 1000 = 5s`
- **Check**: 5s < 8s → Response 1 ✅
- **Sam says**: "I'm sorry to hear about your knee..."
- Sam speaks for ~7 seconds
- Total elapsed: ~12s

### User Message 2 (T=~15s) - "Yes I took it..."
- User finishes speaking at ~15 seconds
- Vapi sends webhook request
- **CRITICAL**: Is `demoCallStartTime` still 1000000?
- Worker should load: `existingCallState.demoCallStartTime = 1000000`
- Worker calculates: `elapsedSeconds = (Date.now() - 1000000) / 1000 = 15s`
- **Check**: 15s >= 8s AND 15s < 17s → Response 2 ✅
- **Sam should say**: "That's wonderful to hear! I'll note that down..."

### User Message 3 (T=~20s) - "谢谢你，Sam..."
- User finishes speaking at ~20 seconds
- Worker calculates: `elapsedSeconds = 20s`
- **Check**: 20s >= 17s AND 20s < 22s → Response 3 ✅
- **Sam should say**: "没关系，陈太太。记得多休息，多喝水。"

## Bug Hypothesis

If Response 1 is **repeating** at Message 2, it means:

```javascript
// At Message 2 (T=15s):
elapsedSeconds = (Date.now() - demoCallStartTime) / 1000
// Expected: 15s
// Actual: < 8s (triggering Response 1)
```

This can only happen if:

### Option A: `demoCallStartTime` is being RESET
```javascript
// Message 1: demoCallStartTime = 1000000
// Message 2: demoCallStartTime = 1000015 (NEW timestamp!)
// Result: elapsedSeconds = 0s → Response 1 ❌
```

**Check**: Look for log `[DEMO] New call detected` on Message 2
- If YES: `call-state` is being cleared between messages
- If NO: Not this issue

### Option B: `demoCallStartTime` is NOT being loaded
```javascript
// Message 1: Set demoCallStartTime = 1000000, save to call-state
// Message 2: Load call-state → demoCallStartTime = undefined
// Fallback: demoCallStartTime = Date.now() = 1000015
// Result: elapsedSeconds = 0s → Response 1 ❌
```

**Check**: Look for log `[DEMO] Existing call, loaded start time: undefined`
- If YES: Call-state read is failing
- If NO: Not this issue

### Option C: Call-state is being DELETED between messages
```javascript
// Message 1: Create call-state with timestamp
// [Something clears call-state]
// Message 2: No call-state exists → isNewCall = true
// Result: New timestamp created → elapsedSeconds = 0s → Response 1 ❌
```

**Check**: Look for log `[VAPI] End of call detected` or `[VAPI] Hang event`
- If YES: Call is being prematurely ended
- If NO: Not this issue

### Option D: Multiple `call-state` keys
```javascript
// Message 1: Saves to call-state-mrs-chen
// Message 2: Reads from call-state-jason (wrong senior ID)
// Result: No call-state found → New timestamp → Response 1 ❌
```

**Check**: Look for log showing senior ID
- `[VAPI] Phone: +12248581016 → Senior ID: mrs-chen`
- If changing between messages: This is the issue

## Debug Commands

### 1. Check current call-state in KV
```bash
# During an active call:
curl "https://elderlink-dev.elderlinkhelper.workers.dev/api/kv/call-state-mrs-chen"

# Expected:
# {
#   "isActive": true,
#   "startedAt": "2025-10-19...",
#   "language": "english",
#   "seniorId": "mrs-chen",
#   "demoCallStartTime": 1760887...
# }
```

### 2. Monitor logs during call
```bash
npx wrangler tail --env dev | grep -A 2 -B 2 '\[DEMO\]'

# Expected for Message 1:
# [DEMO] New call detected, setting start time: 1760887...
# [DEMO] Current state - isNewCall: true, demoCallStartTime: 1760887...
# [DEMO] Elapsed time: 5.2s (callStartTime: 1760887..., now: 1760892...)
# [DEMO] Using response 1 (0-8s)

# Expected for Message 2:
# [DEMO] Existing call, loaded start time: 1760887...
# [DEMO] Current state - isNewCall: false, demoCallStartTime: 1760887...
# [DEMO] Elapsed time: 15.3s (callStartTime: 1760887..., now: 1760902...)
# [DEMO] Using response 2 (8-17s)
```

### 3. Test with curl simulation
```bash
# Simulate Message 1
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"My tomatoes are growing great"}]}'

# Wait 10 seconds
sleep 10

# Simulate Message 2
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Yes I took it"}]}'

# Check responses
```

## Most Likely Root Cause

Based on the code review, the most likely issue is:

**Call-state is being created AFTER the response is generated**

Looking at vapi-webhook.ts:
```typescript
// Line 509: Generate response (uses demoCallStartTime from profile)
let samResponse = await generateSamResponse(...);

// Line 566-573: Create call-state with timestamp
const callState = {
  demoCallStartTime: demoCallStartTime  // Stored here
};
await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));
```

**The problem**: On Message 1, we:
1. Set `demoCallStartTime = Date.now()`
2. Store in `profile.demoCallStartTime` temporarily
3. Generate response (uses profile value)
4. **Save to call-state** (happens AFTER response)

On Message 2:
1. Load call-state
2. Read `demoCallStartTime` from call-state
3. **But if Message 2 arrives BEFORE call-state save completes**, we get undefined!

**Fix**: Move call-state save to happen BEFORE generateSamResponse
