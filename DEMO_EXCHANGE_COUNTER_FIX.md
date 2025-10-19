# Demo Exchange Counter Persistence Bug - FIXED

## Problem Summary

**Issue**: Demo mode exchange counter was persisting across multiple phone calls, causing calls to "jump to the end immediately" instead of starting from Exchange 1.

**User Report**: "check chat logs, its jumping to the end immediately, deepthink and debug"

## Root Cause Analysis

The `demoExchangeNumber` field in KV storage was only being reset when:
1. Explicitly toggling demo mode via `/api/demo-mode` endpoint
2. **NOT** when a new phone call started

This caused the following behavior:
- **Call 1**: User says first message → Exchange 1 response → Counter increments to 2 → User hangs up (counter stays at 2)
- **Call 2**: User calls back → New call starts → Counter is still 2 → Wrong response (Exchange 2 instead of Exchange 1)
- **Call 3**: Counter at 3, starts at Exchange 3, etc.

## Evidence from Logs

From Vapi call transcript (7:12 AM call):
```
Only 2 exchanges completed before customer hung up:
AI: "Hello, Mrs. Chen. It's nice to hear from you again..."
User: "My tomatoes are growing great, but my knee ache-"
AI: "I'm sorry to hear about your knee..." (Exchange 1)
User: "Just a bit. Yes, I took it..."
[Call ended by customer]
```

Yet profile showed `demoExchangeNumber: 4`, indicating multiple calls had occurred without resetting.

## Solution Implemented

### 1. Reset on Call End
Added logic to reset exchange counter when call ends:

**File**: `worker/src/handlers/vapi-webhook.ts` (Lines 369-386)

```typescript
// Handle end-of-call-report events
if (messageType === 'end-of-call-report') {
  console.log('[VAPI] End of call detected, clearing call state and resetting demo mode');
  await env.KV.delete(`call-state-${seniorId}`);

  // Reset demo exchange counter for next call
  let profile = await getProfile(seniorId, env);
  if (profile && profile.demoMode === true) {
    profile.demoExchangeNumber = 1;
    await saveProfile(profile, env);
    console.log('[DEMO] Reset exchange number to 1 for next call');
  }

  return { ... };
}
```

### 2. Reset on New Call Start
Added detection for new call starts (when call state doesn't exist yet):

**File**: `worker/src/handlers/vapi-webhook.ts` (Lines 486-497)

```typescript
// Check if this is a new call starting (call state doesn't exist yet)
const existingCallState = await env.KV.get(`call-state-${seniorId}`);
const isNewCall = !existingCallState;

// Reset demo exchange counter for new calls
if (isNewCall && profile.demoMode === true) {
  if (profile.demoExchangeNumber !== 1) {
    console.log('[DEMO] New call detected, resetting exchange number from',
                profile.demoExchangeNumber, 'to 1');
    profile.demoExchangeNumber = 1;
    await saveProfile(profile, env);
  }
}
```

## How It Works Now

### Call Flow with Fix:

1. **Call 1 Starts**:
   - `call-state-mrs-chen` doesn't exist → `isNewCall = true`
   - Exchange counter reset to 1
   - User says "My tomatoes are growing great"
   - Sam responds with Exchange 1: "I'm sorry to hear about your knee..."
   - Counter increments to 2
   - User hangs up

2. **Call 1 Ends**:
   - `end-of-call-report` event received
   - Exchange counter reset to 1
   - `call-state-mrs-chen` deleted

3. **Call 2 Starts** (NEW CALL):
   - `call-state-mrs-chen` doesn't exist → `isNewCall = true`
   - Exchange counter verified at 1 (already reset, no action needed)
   - Starts from Exchange 1 correctly ✅

## Testing

### Manual Reset
To manually reset the counter for testing:

```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H 'Content-Type: application/json' \
  -d '{"seniorId": "mrs-chen", "enabled": true}'
```

Response:
```json
{
  "success": true,
  "demoMode": true,
  "demoExchangeNumber": 1,
  "message": "Demo mode enabled for Mrs. Chen"
}
```

### Expected Behavior
Every new phone call should now:
1. Start at Exchange 1
2. Progress sequentially through Exchanges 1→2→3→4
3. Reset to 1 when call ends
4. Reset to 1 when new call starts (safety check)

## Debug Logging

Watch for these log messages:

```
[DEMO] New call detected, resetting exchange number from X to 1
[DEMO] Reset exchange number to 1 for next call
[DEMO] Incremented exchange number to: 2
[DEMO] Incremented exchange number to: 3
[DEMO] Incremented exchange number to: 4
[DEMO] At final exchange (4), not incrementing further
```

## Deployment

**Deployed**: 2025-01-19 (worker version 2296de64-5060-4c9a-a889-14f9f461b652)
**URL**: https://elderlink-dev.elderlinkhelper.workers.dev

## Files Modified

1. `/Users/jasonyi/elderlink/worker/src/handlers/vapi-webhook.ts`
   - Lines 369-386: Reset on call end
   - Lines 486-497: Reset on new call start

## Status

✅ **FIXED** - Exchange counter now resets on both call end and new call start
