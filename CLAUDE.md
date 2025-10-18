# ElderLink Development Guide - Claude Code Context

## 🎯 Mission Critical
**Building Sam:** An AI companion that remembers, cares, and speaks naturally to elderly people via phone.
**NOT building:** A chatbot, app, or complex system.

## Core Success Metrics (What Judges Will Test)
1. ✅ **Memory Works** - Sam remembers Mrs. Chen and references previous conversations
2. ✅ **Natural Warmth** - 2-3 minute conversation without robotic responses
3. ✅ **Live Dashboard** - Real-time sentiment visible during calls
4. ✅ **Language Switching** - Seamless English/Mandarin transitions
5. ✅ **Wellness Impact** - 30-day improvement trend visible

## Development Philosophy

### KISS (Keep It Simple, Stupid)
```typescript
// ❌ DON'T: Over-engineer
class AbstractSeniorProfileFactory implements ISeniorFactory { ... }

// ✅ DO: Direct and obvious
const MRS_CHEN = {
  name: "Mrs. Chen",
  family: ["Sarah (daughter)", "Tommy (grandson)"],
  memories: ["planted tomatoes", "taught piano", "from Shanghai"]
};
```

### TDD for Demo-Critical Features Only
```typescript
// Hour 0-8: Write tests for what judges will check
describe('Demo Critical Path', () => {
  test('Sam remembers Mrs. Chen from previous call', async () => {
    const response = await samRespond("Hello", MRS_CHEN);
    expect(response).toContain("Sarah"); // Must reference known family
  });

  test('Response feels natural and warm', () => {
    const response = await samRespond("I'm lonely", MRS_CHEN);
    expect(response).not.toContain("As an AI"); // Never break character
    expect(response.length).toBeLessThan(150); // Keep it conversational
  });
});

// Hour 8-16: Test integration points
test('Vapi webhook responds in <8 seconds', async () => {
  const start = Date.now();
  await fetch('/vapi-webhook', { method: 'POST', body: testMessage });
  expect(Date.now() - start).toBeLessThan(8000); // Critical timeout
});
```

### File Structure (Max 3 Files Per Feature)
```
elderlink/
├── worker/
│   ├── index.ts         # Main worker (<500 lines)
│   ├── prompts.ts       # All prompts in ONE file
│   └── types.ts         # Shared TypeScript interfaces
├── dashboard/
│   ├── App.tsx          # Single-page React app
│   └── api.ts           # API client
├── scripts/
│   └── init-demo.ts     # Mrs. Chen data (RUN AT HOUR 0!)
└── recordings/          # Backup demos ready
```

## Hourly Development Flow

### Hours 0-4: Foundation
```bash
# FIRST THING - Initialize Mrs. Chen data
npm run init-demo-data

# Dev 2: Deploy health check by Hour 2
wrangler deploy --env dev
# Share URL immediately: https://elderlink-dev.workers.dev

# Dev 1: Core prompts ready
const SAM_RESPONSE = `You are Sam, warm and patient...`
```

### Hours 4-8: Critical Integration
```typescript
// Hour 4: API Contract LOCKED
POST /vapi-webhook       // Phone calls
GET  /api/senior/mrs-chen // Profile
GET  /api/sentiment/live  // Real-time sentiment

// Hour 6: First phone test
// Hour 8: CRITICAL MEMORY TEST - MUST PASS
```

### Hours 8-16: Feature Development
```typescript
// Parallel work with mock data
const MOCK_SENTIMENT = { sentiment: 0.5, emotions: ["happy"] };

// Hour 12: Language test
if (language === "mandarin") voiceId = MANDARIN_VOICE;

// Hour 16: FEATURE FREEZE - NO NEW CODE
```

### Hours 16-24: Demo Polish
```bash
# Only fixes, no features
# Practice demo script
# Test backup recordings
```

## Critical Code Patterns

### 1. Vapi Webhook Handler (MUST WORK)
```typescript
async function handleVapiWebhook(request: Request): Promise<Response> {
  // CRITICAL: 8-second timeout for Vapi's 10-second limit
  const timeout = new Promise(resolve =>
    setTimeout(() => resolve({
      content: "I'm listening. Please continue."
    }), 8000)
  );

  const response = generateResponse(request);
  const result = await Promise.race([response, timeout]);

  return new Response(JSON.stringify({
    content: result.content,
    voiceId: result.language === 'mandarin' ? MANDARIN_VOICE : ENGLISH_VOICE
  }));
}
```

### 2. Memory System (Core Differentiator)
```typescript
// Pre-seeded for demo reliability
const MRS_CHEN_PROFILE = {
  memories: {
    family: [
      { name: "Sarah", relationship: "daughter", details: ["lives in Portland"] },
      { name: "Tommy", relationship: "grandson", details: ["plays soccer"] }
    ],
    recentEvents: ["planted tomatoes last week", "Sarah visited yesterday"]
  },
  conversations: [ /* 5 pre-loaded conversations */ ]
};

// Reference memories naturally
function generateResponse(message: string, profile: SeniorProfile) {
  // Always reference something from previous conversations
  const prompt = `
    Remember: ${profile.memories.family[0].name} is their daughter.
    Recent: ${profile.memories.recentEvents[0]}
    Respond warmly to: "${message}"
  `;
}
```

### 3. Dashboard Real-time Updates
```typescript
// Poll every 2 seconds during demo
useEffect(() => {
  const interval = setInterval(async () => {
    const { sentiment, emotions } = await fetch('/api/sentiment/live');
    setSentiment(sentiment); // -1 to 1 scale
    setEmotions(emotions);   // ["happy", "nostalgic"]
  }, 2000);
}, []);
```

## Emergency Fallbacks (Always Ready)

### Conversation Fallbacks
```typescript
const FALLBACK_RESPONSES = [
  "Tell me more about that.",
  "I'm here with you. Please continue.",
  "How does that make you feel?",
  "That sounds important to you."
];

// Use when Gemini times out
if (!response || timeout) {
  return FALLBACK_RESPONSES[Math.random() * 4 | 0];
}
```

### Demo Fallbacks
```typescript
const BACKUP_PLAN = {
  recordings: [
    'memory-demo.mp3',    // Shows Sam remembering
    'mandarin-demo.mp3',  // Shows language switch
    'emotion-demo.mp3'    // Shows empathy
  ],
  screenshots: ['dashboard-sentiment.png'],
  script: "Let me show you from earlier today..."
};
```

## Integration Checkpoints

### Hour 2: Health Check
```bash
curl https://elderlink-dev.workers.dev/api/health
# Must return: {"status": "ok"}
```

### Hour 8: Memory Test (CRITICAL)
```bash
# Call 1: "My daughter Sarah visited"
# Call 2: Sam MUST mention Sarah
# If fails: ALL STOP until fixed
```

### Hour 16: Feature Freeze
```bash
git checkout -b release/demo
# NO NEW FEATURES after this
```

## What NOT to Do

### Before Hour 16
- ❌ Optimize performance
- ❌ Refactor working code
- ❌ Add "nice to have" features
- ❌ Create abstractions
- ❌ Write comprehensive tests

### After Hour 16
- ❌ Add ANY features
- ❌ Refactor ANYTHING
- ❌ Deploy untested code
- ❌ Change prompts significantly

## Quick Command Reference

```bash
# Development
npm run dev                      # Start local server
npm test -- --watch             # Run tests continuously
wrangler tail --env dev         # Watch Worker logs

# Demo Data
npm run init-demo-data          # Initialize Mrs. Chen
wrangler kv:key get "senior-mrs-chen" --namespace-id=XXX

# Deployment (Hour 20 only)
wrangler deploy --env production
npm run build && npm run deploy-dashboard

# Emergency
npm run play-recording-1        # If phone fails
npm run show-screenshots        # If dashboard fails
```

## The Demo Script (2 minutes)

**0:00-0:30** - Problem & Solution
- Show elderly person photo
- "Mrs. Chen hasn't talked to anyone in 5 days"
- Dial phone on speaker

**0:30-1:00** - Memory Demonstration
- "Hi Mrs. Chen! How are those tomatoes?"
- "How is Sarah? Did she visit?"
- Natural conversation flow

**1:00-1:30** - Dashboard Magic
- Show sentiment meter moving
- Word cloud: "tomatoes, Sarah, garden"
- Wellness trend improving

**1:30-2:00** - Language & Impact
- "我今天有点累" → Mandarin response
- "147 conversations, 42% wellness improvement"
- "No senior should be alone"

## Remember

1. **You're building a companion, not a chatbot**
2. **Every line should make Sam more human**
3. **Ship beats perfect**
4. **Working demo > clean code**
5. **After Hour 16: Only fixes, no features**

## Critical Success = These 3 Things Work

1. 🧠 **Sam remembers** → "How is Sarah?"
2. ❤️ **Sam feels warm** → Natural conversation
3. 📊 **Dashboard shows impact** → Sentiment changes live

---

**Integration Lead Checklist:**
- [ ] Hour 2: Worker deployed and shared
- [ ] Hour 4: API contract locked
- [ ] Hour 8: Memory test passed
- [ ] Hour 16: Feature freeze enforced
- [ ] Hour 20: Production deployed
- [ ] Hour 23: Demo rehearsed

**If stuck:** Focus on the demo. What will judges see in 2 minutes? Build only that.