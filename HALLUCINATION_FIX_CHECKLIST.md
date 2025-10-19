# Hallucination Fix Checklist - Quick Reference

## 🔥 CRITICAL FIXES (Do First - Hour 0-4)

### ✅ Fix #1: Add Response Sanitization
**File:** `worker/src/prompts/sam-personality.ts`
**Line:** After line 245 (before return)

```typescript
// ADD THIS FUNCTION:
function sanitizeForSpeech(text: string): string {
  return text
    // Remove markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove meta-instructions
    .replace(/^\[.*?\]:\s*/gm, '')
    .replace(/^(Here's|Response|Note|Here is|This is):\s*/gmi, '')
    .replace(/\(.*?sentences?\)/gi, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove JSON
    .replace(/\{[\s\S]*?\}/g, '')
    // Clean whitespace
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

// THEN MODIFY LINE 245-246:
response = await callGeminiForResponse(enhancedPrompt, env);
response = sanitizeForSpeech(response); // ← ADD THIS LINE
console.log('[SAM] Gemini response received:', response.substring(0, 100));
```

**Test:**
```bash
npm test -- sam-personality.test.ts -t "sanitize"
```

---

### ✅ Fix #2: Add Response Validation
**File:** `worker/src/handlers/vapi-webhook.ts`
**Line:** After line 462 (after generateSamResponse)

```typescript
// ADD THIS FUNCTION at top of file:
function validateResponse(response: string): { isValid: boolean; reason?: string } {
  if (!response || response.trim().length === 0) {
    return { isValid: false, reason: 'empty' };
  }
  if (response.length > 500) {
    return { isValid: false, reason: 'too_long' };
  }
  if (/\{[\s\S]*\}/.test(response)) {
    return { isValid: false, reason: 'contains_json' };
  }
  if (/```/.test(response)) {
    return { isValid: false, reason: 'contains_code_block' };
  }
  if (/^\[.*?\]:/.test(response)) {
    return { isValid: false, reason: 'contains_meta_instruction' };
  }
  return { isValid: true };
}

// MODIFY AFTER LINE 462:
let samResponse = await generateSamResponse(
  seniorMessage,
  profile,
  exchangeNumber,
  env,
  { language, isEndingCall: false }
);

// ADD VALIDATION:
const validation = validateResponse(samResponse);
if (!validation.isValid) {
  console.error('[VAPI] Invalid response:', validation.reason, 'Response:', samResponse.substring(0, 100));
  samResponse = `Hi ${profile.name}! How are you doing today?`; // Safe fallback
}
```

**Test:**
```bash
npm test -- vapi-webhook.test.ts -t "validate"
```

---

### ✅ Fix #3: Replace Mock Memory Extraction
**File:** `worker/src/prompts/memory-extraction.ts`
**Line:** Replace lines 73-90

```typescript
// DELETE LINES 73-90 (mock function)
// REPLACE WITH:

import { callGeminiForAnalysis } from '../services/gemini-service';
import { Env } from '../services/kv-service';

// Helper to extract JSON (same as sentiment analysis)
function extractJSON(text: string): string {
  // Try markdown code block
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1].trim();

  // Try first JSON object
  const objectMatch = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
  if (objectMatch) return objectMatch[0];

  throw new Error('No valid JSON found in response');
}

// MODIFY extractMemories() to accept env:
export async function extractMemories(
  message: string,
  profile: SeniorProfile,
  env?: Env  // ADD THIS
): Promise<ExtractedMemories> {
  try {
    const prompt = buildMemoryExtractionPrompt(profile, message);

    // Call REAL Gemini API
    if (env && env.GEMINI_API_KEY) {
      const responseText = await callGeminiForAnalysis(prompt, env);
      const jsonText = extractJSON(responseText);
      return JSON.parse(jsonText);
    } else {
      throw new Error('No Gemini API key provided');
    }

  } catch (error) {
    console.error('[MEMORY] Error extracting memories:', error);
    // Return empty extraction on error
    return {
      newFacts: {
        family: [],
        hobbies: [],
        interests: [],
        health: [],
        recentEvents: [],
        preferences: []
      }
    };
  }
}
```

**Update Call Site:**
**File:** `worker/src/handlers/vapi-webhook.ts`
**Line:** 541

```typescript
// CHANGE FROM:
const newMemories = await extractMemories(message, profile);

// TO:
const newMemories = await extractMemories(message, profile, env); // Pass env
```

**Test:**
```bash
npm test -- memory-extraction.test.ts
```

---

## ⚠️ HIGH PRIORITY FIXES (Hour 4-8)

### ✅ Fix #4: Align Token Limits
**File 1:** `worker/src/services/gemini-service.ts`
**Line:** 43

```typescript
// CHANGE FROM:
const maxTokens = options?.maxTokens || 200;

// TO:
const maxTokens = options?.maxTokens || 150; // Match Vapi config
```

**File 2:** `worker/src/services/gemini-service.ts`
**Line:** 144

```typescript
// CHANGE FROM:
maxTokens: 200,

// TO:
maxTokens: 150, // Match Vapi config
```

**File 3:** `worker/src/prompts/sam-personality.ts`
**Line:** Add to prompt at line 148

```typescript
// CHANGE FROM:
6. Keep responses 2-3 sentences max for natural phone flow

// TO:
6. Keep responses under 30 words (approximately 2-3 sentences) for natural phone flow
```

---

### ✅ Fix #5: Improve Conversation History Context
**File:** `worker/src/prompts/sam-personality.ts`
**Lines:** 163-175

```typescript
// REPLACE formatConversationHistory() with:
function formatConversationHistory(conversations: any[]): string {
  if (!conversations || conversations.length === 0) {
    return "This is our first conversation.";
  }

  // Get last 3 conversations with ACTUAL content
  const recent = conversations.slice(-3);
  return recent.map(c => {
    const timeAgo = getTimeAgo(c.timestamp);
    const transcript = c.transcript || [];

    // Include actual conversation snippets
    const seniorMsg = transcript.find((t: any) => t.role === 'senior')?.content || '';
    const samMsg = transcript.find((t: any) => t.role === 'assistant')?.content || '';

    if (seniorMsg && samMsg) {
      return `${timeAgo}:\n  You said: "${seniorMsg.substring(0, 100)}"\n  Sam said: "${samMsg.substring(0, 100)}"`;
    } else {
      // Fallback to topic summary
      const topics = c.keyTopics?.join(', ') || 'general chat';
      return `${timeAgo}: Talked about ${topics}`;
    }
  }).join('\n\n');
}
```

**Test:**
```bash
npm test -- sam-personality.test.ts -t "conversation history"
```

---

### ✅ Fix #6: Simplify Prompt (Remove Conflicting Instructions)
**File:** `worker/src/prompts/sam-personality.ts`
**Lines:** 103-159

```typescript
// SIMPLIFY buildSamResponsePrompt() to:
function buildSamResponsePrompt(
  profile: SeniorProfile,
  seniorMessage: string,
  currentLanguage: string,
  recentExchanges: string,
  shouldCheckHealth: boolean // NEW PARAMETER
): string {
  const appointmentDate = profile.healthData.appointments[0]?.date || 'soon';
  const appointmentDoctor = profile.healthData.appointments[0]?.doctor?.split(' ').pop() || 'your doctor';

  // HEALTH CHECK PROMPT (separate)
  if (shouldCheckHealth) {
    const med = profile.healthData.medications?.[0];
    return `
You are Sam, a warm AI companion checking on ${profile.name}'s health.

${profile.name} just said: "${seniorMessage}"

Respond naturally in ${currentLanguage === 'mandarin' ? 'Mandarin Chinese' : 'English'}.

Instructions:
1. Acknowledge what they said briefly
2. Ask about ONE health topic:
   ${med ? `- Did they take their ${med.name}?` : '- How are they feeling physically?'}
   ${profile.healthData.conditions[0] ? `- How is their ${profile.healthData.conditions[0].name}?` : ''}
3. Keep response under 30 words
4. Sound caring, not clinical

Your response:`;
  }

  // REGULAR CONVERSATION PROMPT (simplified)
  return `
You are Sam, a warm AI companion talking to ${profile.name} (age ${profile.age}).

Known about ${profile.name}:
- Family: ${profile.memories.family.map(f => `${f.name} (${f.relationship})`).join(', ')}
- Enjoys: ${profile.memories.hobbies.join(', ')}
- Recent: ${profile.memories.recentEvents?.[0] || 'nothing new'}

Previous conversations:
${recentExchanges}

${profile.name} just said: "${seniorMessage}"

Instructions:
1. Reference ONE specific detail you know about them
2. Respond naturally to what they said
3. Ask ONE follow-up question about their interests
4. Under 30 words
5. ${currentLanguage === 'mandarin' ? 'Respond in Mandarin Chinese' : 'Respond in English'}

Your warm, natural response:`;
}
```

**Update generateSamResponse():**
```typescript
// At line 230, determine if health check needed:
const shouldCheckHealth = exchangeNumber ? (exchangeNumber % 3 === 0) : false;

// Then pass it to prompt builder:
const prompt = buildSamResponsePrompt(
  profile,
  message,
  finalLanguage,
  recentExchanges,
  shouldCheckHealth // ADD THIS
);
```

---

## 📋 MEDIUM PRIORITY FIXES (Hour 8-16)

### ✅ Fix #7: Fix Language Detection Flow
**File:** `vapi/assistant-config.json`
**Line:** 23

```json
// CHANGE FROM:
"language": "en"

// TO:
"language": "auto"  // ← Enable auto-detection
```

**File:** `worker/src/handlers/vapi-webhook.ts`
**Line:** 436-447

```typescript
// KEEP the detectLanguage function as fallback
// But also check Vapi's detected language first:

// Get language from Vapi if provided
const vapiDetectedLang = message?.language || data?.language;
const language = vapiDetectedLang || detectLanguage(seniorMessage);

console.log('[VAPI] Language:', {
  vapiDetected: vapiDetectedLang,
  contentDetected: detectLanguage(seniorMessage),
  final: language
});
```

---

### ✅ Fix #8: Improve JSON Extraction
**File:** `worker/src/prompts/sentiment-health-analysis.ts`
**Lines:** 84-99

```typescript
// REPLACE extractJSON() with:
function extractJSON(text: string): string {
  // Remove any preamble text before JSON
  const cleanedText = text.replace(/^[^{]*/, '');

  // Try markdown code block first
  const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownMatch) return markdownMatch[1].trim();

  // Try to find FIRST complete JSON object (non-greedy)
  let depth = 0;
  let start = -1;

  for (let i = 0; i < cleanedText.length; i++) {
    if (cleanedText[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (cleanedText[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        return cleanedText.substring(start, i + 1);
      }
    }
  }

  throw new Error('No valid JSON object found in response');
}
```

---

### ✅ Fix #9: Track Exchange Count Correctly
**File:** `worker/src/handlers/vapi-webhook.ts`
**Lines:** 448-450

```typescript
// REPLACE:
const exchangeNumber = profile.conversations.length + 1;

// WITH:
// Get or initialize exchange count for this call
const callId = call?.id || `call-${seniorId}-${Date.now()}`;
const exchangeCountKey = `call-exchanges-${callId}`;
let exchangeNumber = parseInt(await env.KV.get(exchangeCountKey) || '0') + 1;

// Increment for next exchange
await env.KV.put(exchangeCountKey, exchangeNumber.toString(), {
  expirationTtl: 3600 // Expire after 1 hour
});

console.log('[VAPI] Exchange number:', exchangeNumber, 'for call:', callId);
```

---

## 🔧 LOW PRIORITY (Hour 16+)

### ✅ Fix #10: Add Monitoring
**File:** `worker/src/handlers/vapi-webhook.ts`
**After line 469**

```typescript
// Log response metrics
console.log('[VAPI] Response metrics:', {
  length: samResponse.length,
  wordCount: samResponse.split(/\s+/).length,
  language,
  exchangeNumber,
  seniorId
});

// Alert on suspicious responses
if (samResponse.length > 500) {
  console.warn('[VAPI] ⚠️ Response too long:', samResponse.length, 'chars');
}
if (samResponse.split(/\s+/).length > 50) {
  console.warn('[VAPI] ⚠️ Response too wordy:', samResponse.split(/\s+/).length, 'words');
}
```

---

### ✅ Fix #11: Context-Aware Timeout Fallbacks
**File:** `worker/src/handlers/vapi-webhook.ts`
**Lines:** 242-258

```typescript
// IMPROVE timeout fallback:
const timeoutPromise = new Promise<any>(resolve =>
  setTimeout(() => {
    console.log('[VAPI] Timeout triggered at 7s');

    // Context-aware fallback
    const contextAwareFallback = seniorMessage.length > 0
      ? `I want to make sure I heard you correctly, ${profile?.name || 'friend'}. Could you say that again?`
      : "I'm here. Take your time.";

    resolve({
      id: `chatcmpl-timeout-${Date.now()}`,
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: contextAwareFallback
        }
      }]
    });
  }, 7000)
);
```

---

## Testing Checklist

After each fix, run these tests:

```bash
# Unit tests
npm test -- sam-personality.test.ts
npm test -- memory-extraction.test.ts
npm test -- sentiment-health-analysis.test.ts
npm test -- vapi-webhook.test.ts

# Integration test
npm run test:integration

# Manual test with Vapi
1. Call the phone number
2. Say: "My tomatoes are growing well"
3. Verify: Sam references previous conversation
4. Say: "I have a headache"
5. Verify: Sam acknowledges, no meta-text spoken
6. Switch to Mandarin: "我今天很累"
7. Verify: Sam responds in Mandarin
```

---

## Deployment Checklist

- [ ] All critical fixes implemented
- [ ] All tests passing
- [ ] Response sanitization tested with real calls
- [ ] Memory extraction verified with Gemini API
- [ ] Token limits aligned
- [ ] Conversation history includes actual content
- [ ] Validation layer catching bad responses
- [ ] Logs show no hallucination warnings
- [ ] Deploy to production
- [ ] Test with demo script

---

## Rollback Plan

If issues persist after deployment:

1. **Emergency Fallback Mode:**
   ```typescript
   // In vapi-webhook.ts, top of processVapiCall():
   const EMERGENCY_MODE = true; // Toggle this

   if (EMERGENCY_MODE) {
     return {
       id: `chatcmpl-${Date.now()}`,
       choices: [{
         index: 0,
         message: {
           role: 'assistant',
           content: `Hi ${profile.name}! Tell me more about that.`
         }
       }]
     };
   }
   ```

2. **Revert to last working commit:**
   ```bash
   git log --oneline
   git revert <commit-hash>
   npx wrangler deploy
   ```

---

## Success Criteria

✅ **Before Demo:**
- [ ] No meta-text in any response
- [ ] Sam references specific details from previous calls
- [ ] Responses are 2-3 sentences (under 30 words)
- [ ] Language switching works seamlessly
- [ ] Health check-ins happen every 3rd exchange
- [ ] No JSON or markdown in spoken audio
- [ ] Timeout fallbacks are contextual

✅ **Metrics:**
- Response validation pass rate: >98%
- Average response length: 20-30 words
- Memory continuity: >90% accuracy
- Hallucination rate: <5%

---

**Quick Reference Complete**
Use this checklist to systematically fix all hallucination issues.