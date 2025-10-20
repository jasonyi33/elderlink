# Vapi Configuration Verification

## Issue
Time-based demo responses are not progressing correctly. The second response repeats instead of advancing to the next scripted line.

## Root Cause Possibilities

### 1. ✅ Worker Code - FIXED
The worker code has been updated to store `demoCallStartTime` in `call-state` instead of profile. This ensures the timestamp persists between messages.

**Deployment Status**: Version `24cb486b-b4ec-4020-aa0a-c675ec0a4613` deployed

### 2. ❓ Vapi Configuration - NEEDS VERIFICATION

**Question**: Is the Vapi assistant actually calling our worker URL?

## Verification Steps

### Step 1: Check Vapi Dashboard Configuration

1. **Log in to Vapi Dashboard**
   ```
   URL: https://dashboard.vapi.ai/assistants
   ```

2. **Find the Assistant**
   - Look for: "Sam - ElderLink AI Companion"
   - Click on it to edit

3. **Verify Model Configuration**
   - Scroll to "Model" section
   - Check "Provider": Should be "Custom LLM"
   - Check "Server URL": Should be one of:
     - `https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions` ✅
     - `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook` ✅

4. **Screenshot the Configuration**
   - Take a screenshot showing the Model section
   - Verify the URL matches exactly

### Step 2: Check Advanced Webhook Settings

1. **Click "Advanced" Tab**

2. **Check Server URL (Webhook Events)**
   - Should also be: `https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions`
   - OR: `https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook`

3. **Check Enabled Events**
   - ✓ conversation-update
   - ✓ end-of-call-report
   - ✓ status-update
   - ✓ speech-update

### Step 3: Test with Live Call

1. **Start Log Monitoring**
   ```bash
   npx wrangler tail --env dev --format pretty | grep -E '\[DEMO\]|\[VAPI\]'
   ```

2. **Make Phone Call**
   ```
   Dial: +1 (224) 858-1016
   ```

3. **Say First Message**
   ```
   "My tomatoes are growing great, but my knee aches a bit"
   ```

4. **Watch Logs - Expected Output**
   ```
   [VAPI] Webhook request received: 2025-10-19...
   [DEMO] New call detected, setting start time: 1760887...
   [VAPI] Call state set to active with demo start time: 1760887...
   [DEMO] Elapsed time: 0.2s
   [DEMO] Using response 1 (0-8s)
   ```

5. **Wait 10 Seconds, Say Second Message**
   ```
   "Yes I took it, and the stretches are helping too"
   ```

6. **Watch Logs - Expected Output**
   ```
   [DEMO] Existing call, loaded start time: 1760887...
   [DEMO] Elapsed time: 10.5s
   [DEMO] Using response 2 (8-17s)
   ```

### Step 4: Diagnose Issues

#### Issue A: No logs appearing at all

**Diagnosis**: Vapi is NOT calling our worker

**Fix**:
1. Verify Server URL in Vapi dashboard (Step 1)
2. Ensure URL is exactly: `https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions`
3. Test URL manually: `curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"test"}]}'`
4. If curl works but Vapi doesn't call, check Vapi assistant assignment to phone number

#### Issue B: Logs show "Using response 1 (0-8s)" for both messages

**Diagnosis**: `demoCallStartTime` is not persisting

**Check**:
1. Is demo mode enabled? `curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode`
   - Should show: `{"demoMode":true}`
2. Are we reading from call-state? Look for log: `[DEMO] Existing call, loaded start time: ...`
   - If showing `undefined`, call-state is not being read correctly

**Fix**:
- Re-deploy worker: `cd worker && npx wrangler deploy --env dev`
- Clear any stuck call-state: Call the number, hang up immediately, wait 10 seconds, call again

#### Issue C: Logs show correct elapsed time, but wrong response

**Diagnosis**: Time windows might be configured incorrectly

**Check**:
- Look at [sam-personality.ts:172-192](worker/src/prompts/sam-personality.ts#L172-L192)
- Verify time windows match script timing

#### Issue D: Response is generic, not from script

**Diagnosis**: Demo mode might not be detected

**Check**:
1. `curl https://elderlink-dev.elderlinkhelper.workers.dev/api/senior/mrs-chen`
2. Verify response has: `"demoMode": true`
3. If false, enable: `curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode -H "Content-Type: application/json" -d '{"enabled":true}'`

## Quick Test Commands

```bash
# 1. Test endpoint is working
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'

# Expected: HTTP 200 with JSON response

# 2. Check demo mode
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode

# Expected: {"demoMode":true,"callStartTime":null,"profileExists":true}

# 3. Check profile
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/senior/mrs-chen

# Expected: JSON with "demoMode": true

# 4. Monitor logs during call
npx wrangler tail --env dev --format pretty | grep -E '\[DEMO\]|\[VAPI\]'

# Expected: See DEMO logs showing elapsed time and response selection
```

## Most Likely Issue

**If the fix didn't work**, the most likely reason is:

1. **Vapi is not calling the worker** - Check Server URL in Vapi dashboard
2. **Demo mode is disabled** - Run: `curl -X POST ... /api/demo-mode -d '{"enabled":true}'`
3. **Worker not deployed** - Re-deploy: `npx wrangler deploy --env dev`

## Resolution Checklist

- [ ] Vapi assistant Model → Server URL verified
- [ ] Vapi assistant Advanced → Server URL verified  
- [ ] Demo mode is enabled (`/api/demo-mode` shows `true`)
- [ ] Worker is deployed (version `24cb486b...`)
- [ ] Test call shows `[DEMO]` logs
- [ ] Elapsed time increases between messages
- [ ] Responses progress through script (1→2→3→4→5)

## Contact Info

If still not working after all checks:
1. Share screenshot of Vapi Model configuration
2. Share wrangler logs from a test call
3. Share curl test results

