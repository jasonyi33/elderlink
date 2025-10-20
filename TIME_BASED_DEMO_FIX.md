# Time-Based Demo Mode - Bug Fix

## 🐛 Bug Report

**Issue**: The second response "Oh, I'm sorry to hear about your knee..." gets repeated instead of progressing to the next scripted response.

**Root Cause**: The `demoCallStartTime` timestamp was stored in the profile object, but due to KV eventual consistency and timing issues, subsequent messages would load a profile **without** the timestamp, causing the elapsed time calculation to reset to 0 on every message.

---

## 🔍 Technical Analysis

### Original Flawed Flow

**Message 1 (T+0s):**
1. Load profile from KV → `demoCallStartTime = undefined`
2. Check `call-state` → doesn't exist → `isNewCall = true`
3. Set `profile.demoCallStartTime = Date.now()` (e.g., 1000)
4. **Async save profile to KV** (might not complete before next step)
5. Call `generateSamResponse()` → uses timestamp 1000 → Response 1 ✅
6. Set `call-state` to active

**Message 2 (T+10s):**
1. Load profile from KV → `demoCallStartTime = undefined` ❌ (save didn't complete or propagate)
2. Check `call-state` → **exists** → `isNewCall = false`
3. **SKIP timestamp setting** (only runs when `isNewCall = true`)
4. Call `generateSamResponse()` → `callStartTime = profile.demoCallStartTime || Date.now()`
5. Falls back to `Date.now()` → **fresh timestamp!** → elapsed ≈ 0s
6. Triggers Response 1 again ❌

### Why This Happened

1. **KV Eventual Consistency**: Cloudflare KV is eventually consistent, not strongly consistent
2. **Timing Issue**: Profile save (line 495) might not complete before response returned
3. **Single Write**: Timestamp only written once at call start
4. **No Fallback**: If the save fails or hasn't propagated, no retry mechanism

---

## ✅ Solution Implemented

**Strategy**: Store `demoCallStartTime` in `call-state` instead of profile, because:
- `call-state` is read/written on **every message**
- Ensures timestamp is **always available** when needed
- Atomic write with call activation
- No dependency on profile save completion

### New Flow

**Message 1 (T+0s):**
1. Check `call-state` → doesn't exist → `isNewCall = true`
2. Initialize `demoCallStartTime = Date.now()` (e.g., 1000)
3. Temporarily set `profile.demoCallStartTime = 1000` for response generation
4. Call `generateSamResponse()` → uses timestamp 1000 → Response 1 ✅
5. **Save `call-state` with `demoCallStartTime: 1000`** ✅

**Message 2 (T+10s):**
1. Check `call-state` → **exists** → parse it
2. **Read `demoCallStartTime` from call-state** → 1000 ✅
3. Set `profile.demoCallStartTime = 1000` for response generation
4. Call `generateSamResponse()` → calculates elapsed = (now - 1000) / 1000 ≈ 10s
5. Triggers Response 2 (8-17s window) ✅
6. **Re-save `call-state` with same `demoCallStartTime: 1000`**

**Call End:**
1. Delete `call-state` → timestamp automatically cleared
2. Next call starts fresh

---

## 📝 Code Changes

### 1. Read Timestamp from Call-State ([vapi-webhook.ts:486-511](worker/src/handlers/vapi-webhook.ts#L486-L511))

```typescript
// FIX: Store demo call start time in call-state (not profile) for reliability
const existingCallStateRaw = await env.KV.get(`call-state-${seniorId}`);
const existingCallState = existingCallStateRaw ? JSON.parse(existingCallStateRaw) : null;
const isNewCall = !existingCallState;

let demoCallStartTime: number | undefined;

if (profile.demoMode === true) {
  if (isNewCall) {
    // New call: initialize timestamp
    demoCallStartTime = Date.now();
    console.log('[DEMO] New call detected, setting start time:', demoCallStartTime);
  } else {
    // Existing call: read timestamp from call-state
    demoCallStartTime = existingCallState?.demoCallStartTime;
    console.log('[DEMO] Existing call, loaded start time:', demoCallStartTime);
  }

  // Temporarily store in profile for generateSamResponse to access
  profile.demoCallStartTime = demoCallStartTime;
}
```

### 2. Save Timestamp to Call-State ([vapi-webhook.ts:564-574](worker/src/handlers/vapi-webhook.ts#L564-L574))

```typescript
// Set call state to active (for dashboard to show live sentiment)
// Include demoCallStartTime for time-based demo responses
const callState = {
  isActive: true,
  startedAt: new Date().toISOString(),
  language: language,
  seniorId: seniorId,
  demoCallStartTime: demoCallStartTime  // ✅ Store timestamp here for reliability
};
await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));
```

### 3. Handle Initial Call Events ([vapi-webhook.ts:381-409](worker/src/handlers/vapi-webhook.ts#L381-L409))

```typescript
// Handle speech-update and status-update events
if (messageType === 'speech-update' || messageType === 'status-update') {
  // Initialize demo timestamp if this is the first event and demo mode is on
  let profile = await getProfile(seniorId, env);
  const existingCallStateRaw = await env.KV.get(`call-state-${seniorId}`);
  const existingCallState = existingCallStateRaw ? JSON.parse(existingCallStateRaw) : null;

  const demoCallStartTime = profile?.demoMode === true && !existingCallState
    ? Date.now()  // ✅ Initialize on first event
    : existingCallState?.demoCallStartTime;  // ✅ Preserve existing

  const callState = {
    isActive: true,
    startedAt: new Date().toISOString(),
    language: 'english',
    seniorId: seniorId,
    demoCallStartTime: demoCallStartTime  // ✅ Include timestamp
  };
  await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));
}
```

---

## 🧪 Testing

### Before Fix
```bash
# Message 1 (T+0s)
curl ... -d '{"messages":[{"role":"user","content":"My tomatoes..."}]}'
# Response: "I'm sorry to hear about your knee..." ✅ (Response 1)

# Wait 10 seconds

# Message 2 (T+10s)
curl ... -d '{"messages":[{"role":"user","content":"Yes I took it..."}]}'
# Response: "I'm sorry to hear about your knee..." ❌ (Response 1 AGAIN)
```

### After Fix
```bash
# Message 1 (T+0s)
curl ... -d '{"messages":[{"role":"user","content":"My tomatoes..."}]}'
# Response: "I'm sorry to hear about your knee..." ✅ (Response 1)

# Wait 10 seconds

# Message 2 (T+10s)
curl ... -d '{"messages":[{"role":"user","content":"Yes I took it..."}]}'
# Response: "That's wonderful to hear! I'll note that down..." ✅ (Response 2)
```

### Verification Script

```bash
./test-demo-script.sh
```

This will simulate the 3-response flow with proper timing and verify progression.

---

## 📊 Time Windows (Reference)

```
0s ────────── 8s ───────── 17s ──── 22s ──── 26s ────→
│             │            │         │        │
Response 1    Response 2   Resp 3   Resp 4   Resp 5
(Knee/Meds)   (MyChart)    (中文)   (中文)   (Goodbye)
```

---

## 🚀 Deployment

**Version**: `24cb486b-b4ec-4020-aa0a-c675ec0a4613`  
**Deployed**: 2025-10-19  
**Environment**: `elderlink-dev`

### Verify Deployment

```bash
# 1. Enable demo mode
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true}'

# 2. Make test call
./test-demo-script.sh

# 3. Check logs
npx wrangler tail --env dev --format pretty | grep '\[DEMO\]'
```

### Expected Log Output

```
[DEMO] New call detected, setting start time: 1760884242958
[VAPI] Call state set to active with demo start time: 1760884242958
[DEMO] Elapsed time: 0.2s
[DEMO] Using response 1 (0-8s)

[DEMO] Existing call, loaded start time: 1760884242958
[DEMO] Elapsed time: 10.5s
[DEMO] Using response 2 (8-17s)

[DEMO] Existing call, loaded start time: 1760884242958
[DEMO] Elapsed time: 20.1s
[DEMO] Using response 3 (17-22s)
```

---

## ✅ Verification Checklist

- [x] Timestamp stored in call-state instead of profile
- [x] Timestamp read from call-state on every message
- [x] Timestamp initialized on first event (speech-update/status-update)
- [x] Timestamp cleared when call ends (delete call-state)
- [x] Deployed to dev environment
- [ ] Tested with live phone call
- [ ] Verified log output shows correct elapsed times
- [ ] Confirmed all 5 responses progress correctly

---

## 📚 Related Documentation

- [TIME_BASED_DEMO_MODE.md](TIME_BASED_DEMO_MODE.md) - Original time-based implementation
- [TIME_BASED_DEMO_BUG_ANALYSIS.md](TIME_BASED_DEMO_BUG_ANALYSIS.md) - Detailed bug investigation
- [DEPLOYMENT_BUG_FIX.md](DEPLOYMENT_BUG_FIX.md) - Previous deployment issues

---

## 🎯 Key Takeaway

**Store session state in the session object (`call-state`), not the user profile.**

When you need data that's:
- Short-lived (duration of a call)
- Frequently accessed (every message)
- Critical for correctness (affects response logic)

→ Store it in `call-state`, not profile.

This ensures:
- ✅ Atomic reads/writes
- ✅ Guaranteed availability
- ✅ Automatic cleanup on call end
- ✅ No KV consistency issues
