# Sam's Response Quality Issues - Analysis & Fix Plan
## Date: 2025-10-19 12:37 UTC

---

## 🎯 Critical Issues Identified (From Vapi Call Logs)

### Issue #1: Incomplete, Abrupt Responses
**Call ID**: `0199fc72-632e-755f-a423-ebfd4f2e1fc3` (12:29 PM)

**User**: "My garden is doing pretty well, but my knees hurt."

**Sam's Response**: "Hi, Mrs. Chen. It's so good to hear from you. How's your gardening? Tomatoes, roses, herbs,"

**Problems**:
1. ❌ **Ignores health mention**: User mentioned "my knees hurt" - CRITICAL health info ignored
2. ❌ **Incomplete sentence**: Ends abruptly with "herbs," (no period, trailing comma)
3. ❌ **Not contextual**: Generic response that doesn't acknowledge pain or show empathy
4. ❌ **Too long**: 25 words (target: under 30, but this feels robotic/hallucinated)

---

### Issue #2: Repetitive Responses Across All Calls

**Call 1 (12:26 PM)**:
```
AI: "Hello, Mrs. Chen. It's nice to hear from you again. How's your garden doing this week?
     Hi, Mrs. Chen. It's so good to hear from you. How's your gardening, tomatoes, roses?"
```

**Call 2 (12:27 PM)**:
```
AI: "Hello, Mrs. Chen. Hello, Mrs. Chen. It's nice to hear from you again. How's your garden doing this week?
     Hi, Mrs. Chen. It's so good to hear from you. How's your gardening? Tomatoes? Roses? Herbs?"
```

**Call 3 (12:29 PM)**:
```
AI: "Hello, Mrs. Chen. Hello, Mrs. Chen. It's nice to hear from you again. How's your garden doing this week?"
... then later ...
AI: "Hi, Mrs. Chen. It's so good to hear from you. How's your gardening? Tomatoes, roses, herbs,"
```

**Pattern Detected**:
- ❌ **Double greetings**: "Hello, Mrs. Chen. Hello, Mrs. Chen." (repetition)
- ❌ **Same template every time**: "It's nice to hear from you again. How's your garden..."
- ❌ **Listing plants**: Always mentions "tomatoes, roses, herbs" in some form
- ❌ **Not varied**: No personality, sounds like a broken record

---

## Root Cause: Prompt is being IGNORED by Vapi

Looking at Vapi performance metrics:
```json
"llmPromptTokens": 114,      // Very small prompt!
"llmCompletionTokens": 2,    // Only 2 tokens generated!
```

**Our webhook is NOT being called for conversation turns!**

Vapi is using their own LLM (Gemini 2.5 Flash) with a generic prompt, NOT our custom endpoint.

---

## Fix: Update Vapi Assistant Configuration

Need to check [vapi/assistant-config.json](vapi/assistant-config.json) to ensure:
1. Custom LLM endpoint is properly configured
2. Model is set to use our webhook for ALL conversation turns
3. System message is being sent to our endpoint

Current hypothesis: Vapi might be falling back to their default LLM instead of calling our custom endpoint.

---

**Next Step**: Review Vapi assistant configuration and verify webhook is being called.
