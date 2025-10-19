# Time-Based Demo Mode

## Overview

Demo mode now uses **elapsed call time** instead of exchange counting to determine which scripted response to use. This makes the demo more reliable and predictable since it doesn't depend on transcription accuracy or message counting.

## How It Works

### Time Windows

Each response is available during a specific time window based on:
- **Estimated speaking time** for the previous response
- **1 second buffer** for natural conversation flow

```
┌─────────────────────────────────────────────────────────┐
│ Call Timeline (in seconds)                              │
├─────────────────────────────────────────────────────────┤
│ 0s ────────── 8s ────────── 17s ──── 22s ───────────→  │
│ │             │              │        │                 │
│ Response 1    Response 2     Resp 3   Response 4       │
│ (Knee/Med)    (MyChart)      (中文)   (Closing)        │
└─────────────────────────────────────────────────────────┘
```

### Response Timing

| Response | Time Window | Duration | Content |
|----------|-------------|----------|---------|
| **1** | 0-8s | ~7s speaking + 1s | "I'm sorry to hear about your knee..." |
| **2** | 8-17s | ~8s speaking + 1s | "That's wonderful to hear! I'll note..." |
| **3** | 17-22s | ~4s speaking + 1s | "没关系，陈太太。记得多休息..." |
| **4** | 22s+ | ~4s speaking | "Take care, Mrs. Chen..." |

## Implementation Details

### Data Structure

**Changed**: `demoExchangeNumber` → `demoCallStartTime`

```typescript
export interface SeniorProfile {
  // ...
  demoMode?: boolean;
  demoCallStartTime?: number;  // Timestamp (ms) when demo call started
}
```

### Response Selection Logic

File: `worker/src/prompts/sam-personality.ts` (Lines 142-178)

```typescript
function getDemoScriptResponse(
  profile: SeniorProfile,
  seniorMessage: string,
  currentLanguage: string
): string {
  // Calculate elapsed time since call started
  const callStartTime = profile.demoCallStartTime || Date.now();
  const elapsedSeconds = (Date.now() - callStartTime) / 1000;

  console.log(`[DEMO] Elapsed time: ${elapsedSeconds.toFixed(1)}s`);

  // Select response based on time window
  if (elapsedSeconds < 8) {
    return "I'm sorry to hear about your knee...";
  } else if (elapsedSeconds < 17) {
    return "That's wonderful to hear! I'll note...";
  } else if (elapsedSeconds < 22) {
    return "没关系，陈太太。记得多休息...";
  } else {
    return "Take care, Mrs. Chen...";
  }
}
```

### Call Lifecycle

#### 1. Call Starts
File: `worker/src/handlers/vapi-webhook.ts` (Lines 490-497)

```typescript
// Detect new call (no existing call state)
const existingCallState = await env.KV.get(`call-state-${seniorId}`);
const isNewCall = !existingCallState;

// Set timestamp for time-based responses
if (isNewCall && profile.demoMode === true) {
  if (!profile.demoCallStartTime) {
    profile.demoCallStartTime = Date.now();
    await saveProfile(profile, env);
    console.log('[DEMO] New call detected, set start time');
  }
}
```

#### 2. During Call
- No state updates needed
- Each message calculates elapsed time from `demoCallStartTime`
- Response selected based on current time window

#### 3. Call Ends
File: `worker/src/handlers/vapi-webhook.ts` (Lines 369-386)

```typescript
if (messageType === 'end-of-call-report') {
  // Clear timestamp for next call
  let profile = await getProfile(seniorId, env);
  if (profile && profile.demoMode === true) {
    delete profile.demoCallStartTime;
    await saveProfile(profile, env);
    console.log('[DEMO] Cleared call start time for next call');
  }
}
```

## Advantages Over Exchange-Based Approach

### ✅ More Reliable
- **No transcription dependency**: Doesn't matter if speech-to-text makes errors
- **No message counting**: Doesn't break if user interrupts or speaks multiple times
- **Predictable timing**: Always progresses at the same pace

### ✅ More Natural
- **Realistic conversation flow**: Mimics actual conversation pacing
- **No forced sequencing**: User can say anything, anytime
- **Smoother transitions**: Time-based windows allow overlap

### ✅ Easier to Test
- **Deterministic**: Same timing every call
- **Observable**: Can see elapsed time in logs
- **Adjustable**: Easy to tune time windows

## Testing

### Make a Test Call

1. **Call**: +1 (224) 858-1016

2. **Expected Flow**:
   ```
   0:00 - Vapi: "Hello, Mrs. Chen! How's your garden doing this week?"
   0:05 - You:  "My tomatoes are growing, but my knee aches"
   0:07 - Sam:  "I'm sorry to hear about your knee..." [Response 1]

   0:15 - You:  "Yes, I took it this morning"
   0:17 - Sam:  "That's wonderful to hear! I'll note..." [Response 2]

   0:25 - You:  "我今天有点累" (I'm a bit tired)
   0:27 - Sam:  "没关系，陈太太。记得多休息..." [Response 3]

   0:35 - You:  "Thank you, Sam"
   0:37 - Sam:  "Take care, Mrs. Chen..." [Response 4]
   ```

3. **Monitor Logs**:
   ```bash
   cd /Users/jasonyi/elderlink/worker
   npx wrangler tail --env dev --format pretty | grep DEMO
   ```

   Expected output:
   ```
   [DEMO] New call detected, set start time: 2025-10-19T...
   [DEMO] Elapsed time: 3.2s, Message: My tomatoes...
   [DEMO] Using response 1 (0-8s)
   [DEMO] Elapsed time: 12.5s, Message: Yes, I took...
   [DEMO] Using response 2 (8-17s)
   [DEMO] Elapsed time: 19.8s, Message: 我今天有点累
   [DEMO] Using response 3 (17-22s)
   [DEMO] Elapsed time: 28.1s, Message: Thank you
   [DEMO] Using response 4 (22s+)
   ```

### Adjusting Time Windows

If responses feel too fast or slow, edit the time thresholds in [worker/src/prompts/sam-personality.ts](worker/src/prompts/sam-personality.ts):

```typescript
if (elapsedSeconds < 8) {        // Adjust first threshold
  // Response 1
} else if (elapsedSeconds < 17) {  // Adjust second threshold
  // Response 2
} else if (elapsedSeconds < 22) {  // Adjust third threshold
  // Response 3
} else {
  // Response 4
}
```

**Calculation formula**: `threshold = previous_response_speaking_time + buffer`

Example:
- Response 1 takes ~7 seconds to say
- Add 1 second buffer
- First threshold = 8 seconds

## API Endpoints

### Enable Demo Mode
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
  "callStartTime": null,
  "message": "Demo mode enabled for Mrs. Chen"
}
```

### Check Demo Mode Status
```bash
curl "https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode?seniorId=mrs-chen"
```

Response (before call):
```json
{
  "demoMode": true,
  "callStartTime": null,
  "profileExists": true
}
```

Response (during call):
```json
{
  "demoMode": true,
  "callStartTime": 1760878463123,
  "profileExists": true
}
```

## Files Modified

1. **Type Definition**: [worker/src/types/index.ts](worker/src/types/index.ts)
   - Changed `demoExchangeNumber` → `demoCallStartTime`

2. **Response Logic**: [worker/src/prompts/sam-personality.ts](worker/src/prompts/sam-personality.ts)
   - Replaced exchange-based switch with time-based if/else
   - Added elapsed time calculation and logging

3. **Webhook Handler**: [worker/src/handlers/vapi-webhook.ts](worker/src/handlers/vapi-webhook.ts)
   - Set timestamp on new call start
   - Clear timestamp on call end
   - Removed exchange increment logic

4. **API Endpoints**: [worker/src/index.ts](worker/src/index.ts)
   - Updated POST endpoint to clear timestamp
   - Updated GET endpoint to return timestamp
   - Removed exchange number references

## Deployment

**Deployed**: 2025-10-19
**Version**: 30fdf286-6a9a-48aa-83da-03e18a76c3ff
**URL**: https://elderlink-dev.elderlinkhelper.workers.dev

## Debug Checklist

If demo mode isn't working correctly:

- [ ] Is demo mode enabled? `curl .../api/demo-mode?seniorId=mrs-chen`
- [ ] Is call start time set? Check logs for `[DEMO] New call detected, set start time`
- [ ] Are responses appearing in correct order? Check logs for `[DEMO] Using response X`
- [ ] Is elapsed time reasonable? Should progress ~1s per second of real time
- [ ] Is call start time cleared after call? Check logs for `[DEMO] Cleared call start time`

## Future Improvements

- **Dynamic time windows**: Adjust based on actual TTS duration
- **Overlap handling**: Allow responses to work across multiple time windows
- **Fallback timing**: Handle pauses or silence gracefully
- **Time window visualization**: Dashboard showing current window
