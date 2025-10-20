# Time-Based Demo Mode - Bug Analysis

## Critical Issue Found

**Problem**: Time-based demo mode is NOT working. Bot repeats Response 1 multiple times instead of progressing through responses 1→2→3→4.

## Evidence from Most Recent Call (14:30)

### Vapi Call Transcript
```
Timeline:
- 7.436s: User: "My tomatoes are growing great-"
- 20.773s: Bot: "I'm sorry to hear about your knee..." (Response 1) ✅ CORRECT
- 25.216s: User: "I did- I told you..."
- 35.475s: Bot: "I'm sorry to hear about your knee..." (Response 1) ❌ WRONG!
```

**Expected at 35.475s**: Response 4 (closing) since 35s > 22s threshold
**Actual**: Response 1 (knee/medication) - meant for 0-8s window

## Root Cause Hypothesis

The `demoCallStartTime` timestamp is NOT being persisted properly between messages. Each message falls back to `Date.now()`, making elapsed time always ~0 seconds, thus always triggering Response 1 (0-8s window).

###Code Flow Analysis

#### vapi-webhook.ts (Lines 490-503)
```typescript
// Set demo call start time for new calls
if (isNewCall && profile.demoMode === true) {
  if (!profile.demoCallStartTime) {
    profile.demoCallStartTime = Date.now();
    await saveProfile(profile, env);  // ← Saves to KV
  }
}
```

**Message 1 Flow**:
1. Load profile from KV (demoCallStartTime = undefined)
2. `isNewCall = true` (no call-state exists yet)
3. Set `demoCallStartTime = Date.now()` (e.g., 1760884242958)
4. Save profile to KV
5. Call `generateSamResponse(profile, ...)` with timestamp set
6. Response 1 generated correctly ✅

**Message 2 Flow** (expected):
1. Load profile from KV (should have demoCallStartTime = 1760884242958)
2. `isNewCall = false` (call-state exists now)
3. Skip timestamp setting (already set)
4. Call `generateSamResponse(profile, ...)` with existing timestamp
5. Elapsed = (Date.now() - 1760884242958) / 1000 ≈ 17-18s
6. Should trigger Response 3 (17-22s window) ✅

**Message 2 Flow** (actual - BUG):
1. Load profile from KV (demoCallStartTime = undefined ???)
2. `isNewCall = false`
3. Skip timestamp setting
4. Call `generateSamResponse(profile, ...)`
5. Inside `getDemoScriptResponse`: `callStartTime = profile.demoCallStartTime || Date.now()`
6. Falls back to `Date.now()` (fresh timestamp!)
7. Elapsed = ~0 seconds
8. Triggers Response 1 (0-8s window) ❌

## Possible Causes

### 1. KV Save Not Completing
The `await saveProfile(profile, env)` might not be completing before the response is returned, and Cloudflare Workers might terminate the execution context.

**Mitigation**: The save IS awaited, so this is unlikely unless there's an exception.

### 2. KV Read Not Getting Updated Value
Cloudflare KV has eventual consistency. The second message might arrive so quickly that KV hasn't replicated the updated profile yet.

**Evidence**: Messages are ~18 seconds apart, which should be plenty of time for KV to propagate.

### 3. Field Being Stripped During Serialization
The `demoCallStartTime` field might not be part of the TypeScript interface, causing it to be stripped during save/load.

**Counter-evidence**: TypeScript interfaces don't affect runtime behavior, and JSON.stringify/parse handle all fields.

### 4. Profile Being Reloaded from Seed Data
The `loadMrsChenSeedData()` function might be called on every message, overwriting the saved profile.

**Need to verify**: Check if seed data is loaded on message 2.

### 5. Multiple Profile Objects in Flight
There might be race conditions where multiple profile versions exist simultaneously.

## Debugging Steps Added

### Enhanced Logging (Lines 494-503)
```typescript
if (isNewCall && profile.demoMode === true) {
  if (!profile.demoCallStartTime) {
    profile.demoCallStartTime = Date.now();
    console.log('[DEMO] New call detected, setting start time:', profile.demoCallStartTime, '→', new Date(profile.demoCallStartTime).toISOString());
    await saveProfile(profile, env);
    console.log('[DEMO] Start time saved to KV');
  }
}

// Debug: Always log current demo state
if (profile.demoMode === true) {
  console.log('[DEMO] Current state - isNewCall:', isNewCall, 'demoCallStartTime:', profile.demoCallStartTime);
}
```

### What to Look For in Logs

**Message 1 (first user message)**:
```
[DEMO] New call detected, setting start time: 1760884242958 → 2025-10-19T14:30:42.958Z
[DEMO] Start time saved to KV
[DEMO] Current state - isNewCall: true, demoCallStartTime: 1760884242958
[DEMO] Elapsed time: 0.1s, Message: My tomatoes...
[DEMO] Using response 1 (0-8s)
```

**Message 2 (second user message)** - EXPECTED:
```
[DEMO] Current state - isNewCall: false, demoCallStartTime: 1760884242958
[DEMO] Elapsed time: 17.8s, Message: I did...
[DEMO] Using response 3 (17-22s)
```

**Message 2 (second user message)** - IF BUG EXISTS:
```
[DEMO] Current state - isNewCall: false, demoCallStartTime: undefined
[DEMO] Elapsed time: 0.0s, Message: I did...
[DEMO] Using response 1 (0-8s)
```

## Testing Instructions

1. **Enable demo mode**:
   ```bash
   curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
     -H 'Content-Type: application/json' \
     -d '{"seniorId": "mrs-chen", "enabled": true}'
   ```

2. **Start wrangler tail**:
   ```bash
   npx wrangler tail --env dev --format pretty | grep -E '\[DEMO\]|\[SAM\]'
   ```

3. **Make test call**: +1 (224) 858-1016

4. **Speak at least 2 messages** and observe logs

5. **Check for**:
   - Is `demoCallStartTime` set on message 1?
   - Is `demoCallStartTime` preserved on message 2?
   - What is the calculated elapsed time?
   - Which response is used?

## Deployment

**Version**: 928b0af7-47d4-4b53-b6c1-dfcda2bf7196
**Deployed**: 2025-10-19 (with enhanced logging)

## Next Steps

1. Make a test call and review logs
2. If `demoCallStartTime` is undefined on message 2, investigate KV save/load
3. Consider alternative approaches:
   - Store timestamp in call-state instead of profile
   - Use Durable Objects for stronger consistency
   - Pass timestamp through Vapi's conversation context
4. If KV consistency is the issue, add retry logic or use synchronous storage

## Alternative Solution (If KV Fails)

Store the call start time in the `call-state` KV key instead of the profile:

```typescript
// On new call
const callState = {
  isActive: true,
  startedAt: new Date().toISOString(),
  demoCallStartTime: Date.now(),  // ← Add here
  language: 'english',
  seniorId: seniorId
};
await env.KV.put(`call-state-${seniorId}`, JSON.stringify(callState));

// On subsequent messages
const callStateData = await env.KV.get(`call-state-${seniorId}`);
const callState = JSON.parse(callStateData);
const demoCallStartTime = callState.demoCallStartTime;
```

This would be more reliable since call-state is written/read every message, ensuring consistency.
