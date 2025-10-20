# No Response Debug Guide

## Issue
"There are no responses at ALL, it is not in mock correctly"

This means Vapi is either:
1. Not calling our worker at all
2. Calling the wrong endpoint
3. Getting responses but not playing them

---

## ✅ Verified Working

**API Endpoint Test:**
```bash
curl -X POST "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"My tomatoes are growing great"}]}'

# Response: "I'm sorry to hear about your knee..." ✅ WORKING
```

**Demo Mode Status:**
```bash
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode

# Response: {"demoMode":true,"callStartTime":null,"profileExists":true} ✅
```

So the worker code IS working. The issue is Vapi configuration.

---

## 🔍 Diagnosis Steps

### Step 1: Check Vapi Dashboard Configuration

**CRITICAL**: Verify the Vapi assistant is pointing to the correct URL.

1. **Go to**: https://dashboard.vapi.ai/assistants
2. **Find**: "Sam - ElderLink AI Companion" (or your assistant name)
3. **Click** to edit
4. **Check "Model" section**:
   - Provider: Must be "Custom LLM"
   - **Server URL**: Must be EXACTLY:
     ```
     https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions
     ```
   - (NOT `/vapi-webhook`, use `/chat/completions` for OpenAI format)

5. **Click "Advanced" tab**:
   - **Server URL (for webhooks)**: Can be same or `/vapi-webhook`
   - **Server Messages**: Ensure these are checked:
     - ✓ conversation-update
     - ✓ end-of-call-report
     - ✓ status-update

### Step 2: Check Phone Number Assignment

1. **Go to**: https://dashboard.vapi.ai/phone-numbers
2. **Find**: +1 (224) 858-1016
3. **Verify**: Shows "Assigned to: Sam - ElderLink AI Companion"
4. **If not assigned**: Click the number → Assign Assistant → Select Sam

### Step 3: Monitor Logs During Call

**Terminal 1: Start log monitor**
```bash
cd /Users/jasonyi/elderlink/worker
npx wrangler tail --env dev --format pretty
```

**Terminal 2: Make test call**
```
Dial: +1 (224) 858-1016
Wait for greeting
Say: "My tomatoes are growing great"
```

**Expected logs:**
```
[VAPI] Webhook request received: 2025-10-19...
[VAPI] PAYLOAD KEYS: ['message', 'call', 'messages']
[VAPI] RAW PAYLOAD: {...}
[VAPI] Phone: +12248581016 → Senior ID: mrs-chen
[DEMO] New call detected, setting start time: ...
[DEMO] Call state saved with start time: ...
[DEMO-V2] Time-based demo activated for mrs-chen
[DEMO-V2] Elapsed time: 0.2s
[DEMO-V2] Response 1: Knee/Lisinopril (0-8s)
[VAPI] Response validated and ready in XXXms
```

**If NO logs appear:**
- Vapi is NOT calling our worker
- Check Server URL in Vapi dashboard (Step 1)

**If logs show "Extracted message: (empty)":**
- Vapi is calling us, but payload format is wrong
- Check Vapi's custom-LLM documentation

### Step 4: Check Vapi Call Logs

1. **Go to**: https://dashboard.vapi.ai/calls
2. **Find**: Your most recent test call
3. **Click** to view details
4. **Check**:
   - **Status**: Should be "completed" or "in-progress"
   - **Transcript**: Should show what you said
   - **Errors**: Look for any error messages
   - **Webhook Logs**: Should show requests to our URL

**If you see errors like:**
- `"timeout"` - Our worker is taking >10 seconds (should be <3s)
- `"connection refused"` - URL is wrong or worker is down
- `"invalid response"` - Our response format is wrong

---

## 🔧 Common Issues & Fixes

### Issue A: Vapi Shows "firstMessage" But Nothing After

**Diagnosis**: Vapi is NOT calling custom LLM

**Fix**:
1. Go to Assistant → Model section
2. Ensure "Provider" is set to "Custom LLM" (NOT OpenAI, NOT Anthropic)
3. Set Server URL to: `https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions`
4. Click Save

### Issue B: Vapi Calls Wrong URL

**Diagnosis**: Check wrangler logs - do you see requests coming in?

**Fix**:
```bash
# Test if worker is accessible
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/health

# Should return: {"status":"ok",...}
```

If 404 or error, worker is not deployed correctly.

### Issue C: Call Connects But Silent

**Diagnosis**: Vapi is not configured to use our LLM

**Fix**:
1. Check if firstMessage plays (Vapi's default greeting)
2. If yes, but nothing after → Custom LLM not configured
3. If no → Phone number not assigned to assistant

### Issue D: "Invalid response format"

**Diagnosis**: Our response doesn't match OpenAI format

**Check logs for**:
```
[VAPI] OUTGOING RESPONSE: {
  "id": "chatcmpl-...",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "..." 
    }
  }]
}
```

This is the correct format. If different, there's a code issue.

---

## 🎯 Most Likely Issue

Based on "no response at ALL", the most likely issue is:

**Vapi Assistant is NOT configured to use Custom LLM**

### Quick Fix:

1. Go to https://dashboard.vapi.ai/assistants
2. Edit "Sam - ElderLink AI Companion"
3. Model section → Provider → Change to "Custom LLM"
4. Server URL → Enter: `https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions`
5. Save
6. Try calling again

---

## 🧪 Quick Tests

### Test 1: Is worker accessible?
```bash
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/health
# Expected: {"status":"ok"}
```

### Test 2: Does endpoint return response?
```bash
curl -X POST "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
# Expected: JSON with "choices" array
```

### Test 3: Is demo mode enabled?
```bash
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode
# Expected: {"demoMode":true}
```

### Test 4: Monitor logs
```bash
npx wrangler tail --env dev --format pretty
# Make call, see if logs appear
```

---

## 📸 What to Share

If still not working, please share:

1. **Screenshot of Vapi Assistant Model settings**
   - Show Provider dropdown
   - Show Server URL field

2. **Wrangler logs output** during a test call
   - Run: `npx wrangler tail --env dev`
   - Make call
   - Copy/paste log output

3. **Vapi call log screenshot**
   - Dashboard → Calls → Latest call
   - Screenshot of errors/warnings

---

## ✅ Success Checklist

- [ ] Worker health check returns 200
- [ ] Demo mode API shows `"demoMode": true`
- [ ] Direct curl to /chat/completions returns response
- [ ] Vapi Assistant Provider = "Custom LLM"
- [ ] Vapi Assistant Server URL = our worker URL
- [ ] Phone number assigned to assistant
- [ ] Logs show webhook requests during call
- [ ] Call transcript shows user speech
- [ ] Sam responds with scripted lines

Once all checked, the demo should work!
