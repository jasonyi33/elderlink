# Vapi Configuration Fix - System Message Added
## Date: 2025-10-19 12:52 UTC

---

## 🔍 Root Cause Identified

**Problem**: Vapi custom LLM was not generating context-aware responses during phone calls.

**Root Cause**: The Vapi assistant configuration was missing a **system message** in the model configuration. Without this, Vapi may not properly initialize conversations with the custom LLM endpoint, potentially causing it to fall back to default behavior or use minimal context.

---

## 🔧 Fix Applied

### Before (Missing System Message):
```json
{
  "model": {
    "url": "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions",
    "model": "custom",
    "provider": "custom-llm",
    "maxTokens": 150,
    "temperature": 0.7
    // ❌ NO "messages" field
  }
}
```

### After (With System Message):
```json
{
  "model": {
    "url": "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions",
    "model": "custom",
    "provider": "custom-llm",
    "maxTokens": 150,
    "temperature": 0.7,
    "messages": [  // ✅ ADDED
      {
        "role": "system",
        "content": "You are Sam, a warm AI companion. Keep responses under 30 words. Always acknowledge what the person just said before asking a follow-up question."
      }
    ]
  }
}
```

---

## 📝 Update Command

```bash
curl -X PATCH https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7 \
  -H "Authorization: Bearer a0a0d259-804e-4079-8a99-524a6a792cec" \
  -H "Content-Type: application/json" \
  -d '{
    "model": {
      "provider": "custom-llm",
      "url": "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions",
      "model": "custom",
      "temperature": 0.7,
      "maxTokens": 150,
      "messages": [
        {
          "role": "system",
          "content": "You are Sam, a warm AI companion. Keep responses under 30 words. Always acknowledge what the person just said before asking a follow-up question."
        }
      ]
    }
  }'
```

**Status**: ✅ Successfully updated at 12:52 UTC

**Updated Timestamp**: `2025-10-19T12:52:03.977Z`

---

## 🎯 Expected Impact

### What Should Improve:
1. ✅ **Vapi will send system message** to our custom LLM endpoint
2. ✅ **Responses will be contextual** - acknowledging what user said
3. ✅ **Responses will be concise** - under 30 words as instructed
4. ✅ **Follow-up questions** will be asked naturally

### What This Doesn't Fix (Requires Testing):
- Whether Vapi is actually calling our endpoint (still need to verify via logs)
- Message extraction and conversation flow (handled by our code)
- Health keyword detection (already deployed in our code)

---

## 🧪 Next Step: Verification

### Test Protocol:

1. **Start Fresh Log Monitoring**:
   ```bash
   npx wrangler tail --env dev
   ```

2. **Make Test Phone Call**:
   ```
   Dial: (224) 858-1016
   ```

3. **Test Script**:
   ```
   Sam: "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"
   You: "My garden is doing pretty well, but my knees hurt."

   Expected (if working):
   Sam: "I'm glad your garden is well! I'm sorry about your knees. Are you taking your Lisinopril?"
   ```

4. **Monitor Logs**:
   Look for:
   ```
   POST /chat/completions - Ok
   [VAPI] Webhook request received: 2025-10-19T...
   [VAPI] RAW PAYLOAD: {...}
   [VAPI] Extracted from OpenAI messages array: "My garden is doing pretty well, but my knees hurt."
   [SAM] Health keyword detected in message: My garden is doing pretty well, but my knees hurt.
   [SAM] Generating response...
   [SAM] Gemini raw response: ...
   [SAM] Sanitized response: ...
   ```

5. **If STILL No /chat/completions Requests**:
   - Issue is deeper than system message
   - May need to contact Vapi support
   - Possible Vapi platform bug with custom-llm

---

## 📊 Troubleshooting Matrix

| Symptom | Possible Cause | Next Action |
|---------|---------------|-------------|
| No `/chat/completions` in logs | Vapi not calling endpoint | Check Vapi dashboard for errors, contact support |
| `/chat/completions` called but empty message | Message extraction issue | Check `messages` array in payload |
| Response still generic | System message not being used | Verify it's in the payload Vapi sends |
| Response still repetitive | Prompt engineering issue | Update `buildSamResponsePrompt()` |
| Health mention ignored | Our code issue | Already fixed with health keyword detection |

---

## 🔄 Rollback Instructions

If this breaks something:

```bash
# Remove system message
curl -X PATCH https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7 \
  -H "Authorization: Bearer a0a0d259-804e-4079-8a99-524a6a792cec" \
  -H "Content-Type: application/json" \
  -d '{
    "model": {
      "provider": "custom-llm",
      "url": "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions",
      "model": "custom",
      "temperature": 0.7,
      "maxTokens": 150
    }
  }'
```

---

## 📚 References

- **Vapi Documentation**: Guide at [/vapi/VAPI_ACCOUNT_CONFIGURATION_GUIDE.md](vapi/VAPI_ACCOUNT_CONFIGURATION_GUIDE.md)
- **System Prompt Example**: Line 277-282 of the guide mentions this
- **Our Code Changes**: Health keyword detection + sanitization improvements deployed earlier
- **Worker Version**: `e61f471f-1ce4-4744-868d-53ed28923469` (with health fixes)

---

## ✅ Success Criteria

The fix is successful if:
1. ☐ `/chat/completions` appears in wrangler logs during phone call
2. ☐ Logs show full message extraction (not empty)
3. ☐ Sam acknowledges user's message content
4. ☐ Health keywords trigger appropriate responses
5. ☐ No incomplete sentences or duplicate phrases

---

**Status**: ✅ Fix Applied, ⏳ Awaiting Verification via Test Call

**Next Action**: Make test phone call while monitoring logs in real-time.
