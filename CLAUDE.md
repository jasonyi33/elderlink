# ElderLink AI Companion - Development Context & Rules

## 🎯 Project Mission
**Building:** ElderLink - A holistic elder care platform with Sam, an AI companion accessible by phone that addresses three dimensions of senior wellness: Mental Health (warm conversations with memory), Physical Health (natural health monitoring with MyChart integration), and Social Health (community matching for real connections).

**NOT Building:** A chatbot, mobile app, or generic AI assistant.

## ⚠️ Critical Success Metrics (ALL 5 Must Work for Demo)
1. ✅ **Sam remembers Mrs. Chen** and references previous conversations naturally
2. ✅ **Natural, warm conversation** lasting 2-3 minutes without sounding robotic
3. ✅ **Sam proactively checks physical health** and creates MyChart notes
4. ✅ **Dashboard shows real-time sentiment** changes during calls
5. ✅ **Community tab displays 3+ compatible matches** with auto-generated groups

## 📋 Development Rules & Philosophy

### 1. TDD is MANDATORY (7-Step Process)

```typescript
// EVERY feature follows this workflow:
// 1. ✍️ Write Tests - Create tests with specific input/output pairs (reference TDD_TEST_CASES.md)
// 2. 🔴 Confirm Failure - Run tests and VERIFY they fail (screenshot/log output)
// 3. 💾 Commit Tests - git commit -m "Add [feature] tests (failing)"
// 4. ✅ Implement Code - Write code WITHOUT modifying tests
// 5. 🔄 Iterate - Run tests repeatedly, adjust code until all pass
// 6. 🤖 Verify - Use independent subagent to verify no overfitting
// 7. 💾 Commit Code - git commit -m "Implement [feature]"

// If any step is skipped, the task is INCOMPLETE.

// Example: Sam Personality Module
test('Sam uses senior name in greeting', () => {
  const response = await generateSamResponse("Hello", MRS_CHEN);
  expect(response).toContain("Mrs. Chen"); // Not "user" or generic
  expect(response).not.toContain("How can I assist"); // Not robotic
});
```

### 2. KISS - Keep It Simple, Stupid

```typescript
// ❌ DON'T: Over-engineer or abstract prematurely
class AbstractProfileFactory implements IFactory<ISeniorProfile> {
  // 50 lines of unnecessary abstraction
}

// ✅ DO: Direct, obvious, and working
const MRS_CHEN = {
  name: "Mrs. Chen",
  age: 72,
  memories: { family: ["Sarah (daughter)"], hobbies: ["gardening", "piano"] }
};
```

### 3. YAGNI - You Ain't Gonna Need It

```typescript
// ❌ DON'T: Build for hypothetical futures
interface ExtensiblePluginSystem { /* Never used in demo */ }

// ✅ DO: Build ONLY what judges will test
const DEMO_REQUIREMENTS = [
  'memory_continuity',  // Core differentiator
  'health_tracking',    // Physical dimension
  'community_matching', // Social dimension
  'live_sentiment',     // Dashboard impact
  'language_switching'  // ElevenLabs showcase
];
```

### 4. File Structure (Maximum Simplicity)

```
elderlink/
├── src/
│   ├── index.ts              # Main Worker (<1000 lines)
│   ├── handlers/
│   │   └── vapi-webhook.ts   # Phone integration (CRITICAL PATH)
│   ├── services/
│   │   ├── kv-service.ts     # Profile storage
│   │   ├── health-service.ts # MyChart integration
│   │   ├── matching-service.ts # Community algorithm
│   │   ├── alert-service.ts  # Crisis detection & alerts
│   │   ├── wellness-service.ts # Metrics calculation
│   │   ├── gemini-service.ts # AI API calls with timeout
│   │   ├── conversation-summary.ts # Summary generation
│   │   └── word-cloud.ts     # Word frequency analysis
│   ├── middleware/
│   │   └── cors.ts           # CORS headers
│   └── types.ts              # Shared interfaces
├── prompts/
│   ├── sam-personality.ts    # Response generation
│   ├── memory-extraction.ts  # Memory parsing
│   └── sentiment-health.ts   # Combined analysis
├── dashboard/
│   ├── src/
│   │   ├── App.tsx           # 4-tab interface
│   │   ├── components/       # One file per tab
│   │   └── services/
│   │       ├── api-client.ts # API with retry logic
│   │       └── mock-api.ts   # Development mock data
│   └── public/
├── data/
│   ├── mrs-chen-profile.json # Pre-seeded demo data
│   ├── match-profiles.json   # 3 compatible seniors
│   └── escalation-keywords.json # Crisis detection
├── scripts/
│   ├── init-demo-data.ts     # RUN AT HOUR 0!
│   ├── test-latency.ts       # Webhook performance
│   └── integration-tests/    # Full flow tests
│       ├── memory-test.ts
│       ├── health-tracking-test.ts
│       ├── community-matching-test.ts
│       └── full-flow-test.ts
├── tests/
│   ├── integration/          # End-to-end tests
│   └── performance.test.ts  # Performance validation
└── utils/
    ├── conversation-helpers.ts # Language detection
    └── fallback-topics.ts    # Fallback responses
```

## 🔄 Development Workflow

### Before Starting ANY Task

1. **Review the overall task** in TASK_LIST_REVISED_TDD.md
2. **Reference TDD_TEST_CASES.md** for test specifications
3. **Ask questions** if not 100% sure about requirements
4. **Create task plan** with specific subtasks and test cases

### During Development

```bash
# Start every feature with tests
npm test -- --watch prompts/sam-personality.test.ts

# Commit frequently with clear messages
git add tests/
git commit -m "Add Sam personality tests (12 tests, failing)"
# ... implement ...
git commit -m "Implement Sam personality (12/12 passing)"

# Verify no overfitting
npm run verify:sam-personality  # Random test cases
```

### After Completing Each Task

1. **Comprehensively check PRD** - Does implementation match ALL requirements?
2. **Verify against TASK_LIST** - Are all subtasks complete?
3. **Be critical** - What edge cases might fail? What did I miss?
4. **Run integration tests** - Does it work with other components?
5. **Document any deviations** - If something differs from PRD, document WHY

## 🚨 Critical Path Components

### 1. Vapi Webhook (MUST respond in <3 seconds, 7s timeout for safety)

```typescript
// PRIORITY PATH - Immediate response generation (<2s target)
async function handleVapiWebhook(request: Request) {
  const timeout = Promise.race([
    generateSamResponse(message, profile),  // Target: 800ms
    new Promise(resolve =>
      setTimeout(() => resolve(FALLBACK_RESPONSE), 7000))  // 7s safety timeout
  ]);

  // ASYNC PATH - Background processing (via env.context.waitUntil)
  env.context.waitUntil(
    processAsync(message, profile)  // Sentiment, health, memory, alerts
  );

  return response; // Must be <3s total (Vapi has 10s limit)
}
```

### 2. Memory System (Core Differentiator)

```typescript
// Every response MUST reference previous conversations
const prompt = `
Known facts: ${profile.memories}
Recent events: ${profile.conversations.slice(-3)}
CRITICAL: Reference something specific from above
Response to: "${message}"
`;
```

### 3. Health Integration (Physical Dimension)

```typescript
// Proactive health check every 2-3 exchanges
if (exchangeNumber % 3 === 0) {
  // Reference specific medication or condition
  prompt += `Check on: ${profile.healthData.medications[0].name}`;
}
```

### 4. Community Matching (Social Dimension)

```typescript
// Simple weighted scoring (PRD lines 1641-1668)
score = Math.min(50, sharedInterests * 10) + (sameLanguage ? 30 : 0) +
        (ageWithin10Years ? 10 : 0) + (sameLocation ? 10 : 0);
// Only show matches with score >= 50
// Returns top 3 matches sorted by score descending
```

### 5. Alert Service (Crisis Detection)

```typescript
// Keyword-based crisis detection
const escalationKeywords = {
  medical: ["chest pain", "can't breathe", "stroke"],
  crisis: ["end it all", "not worth living", "suicide"],
  depression: ["hopeless", "no meaning", "worthless"]
};

// Create alerts for dashboard visibility
if (matchesKeywords(message, 'crisis')) {
  createAlert({ severity: 'high', type: 'crisis', requiresAction: true });
}
```

## 🔍 Edge Cases & Requirements

### Always Consider

- **Empty/null data** - What if profile.memories is empty?
- **Timeout scenarios** - What if Gemini takes 10 seconds?
- **Language detection** - What if mixed English/Mandarin?
- **Crisis keywords** - What if "chest pain" mentioned?
- **Dashboard polling** - What if 100 simultaneous users?

### Requirement Validation

```typescript
// Before marking complete, verify:
const requirements = {
  memory: "Sam mentions family member by name",
  health: "Health note created in profile.healthData.notes",
  sentiment: "Live sentiment updates within 2 seconds",
  matching: "Exactly 3 matches displayed (or fewer if <3 qualify)",
  language: "Voice changes when language switches"
};
```

## ⏰ Time-Based Priorities & Critical Checkpoints

### Hour 2: Foundation Checkpoint

- ✅ Worker deployed with health check endpoint
- ✅ URL shared with entire team
- ✅ All developers test connection

### Hour 4: API Lock

- ✅ **API contract locked** - no changes after this
- ✅ All endpoints documented
- ✅ Integration lead verifies alignment

### Hour 6: First Integration Test

- ✅ Phone → Webhook → Response chain works in <3s
- ⚠️ If fails: 30-minute all-hands debug session

### Hour 8: CRITICAL MEMORY TEST

- ✅ Memory continuity test MUST pass
- ⚠️ **If fails: ALL developers stop and fix**
- ✅ This is the core differentiator - cannot fail

### Hour 10: Health Tracking Test

- ✅ Health mention extraction works
- ✅ MyChart note creation works
- ✅ Dashboard Health Timeline displays notes

### Hour 12: Language Test

- ✅ Language switching demonstration
- ⚠️ If fails: Fallback to English-only demo

### Hour 14: Full Pipeline (ALL 5 Success Criteria)

- ✅ Complete flow with ALL features
- ✅ Last chance for major fixes

### Hour 16: Community Matching Verification

- ✅ All 3 matches calculated correctly
- ✅ Group suggestions auto-generated

### Hour 18: FEATURE FREEZE

- ⚠️ **Only bug fixes allowed after this**
- ⚠️ No new features regardless of how small

### Hour 20: Production Deployment

- ✅ Everything deployed to production
- ✅ Begin demo practice runs

### Hour 23: Final Rehearsal

- ✅ Complete 3-minute demo run-through
- ✅ ALL 5 success criteria verified

## 🚀 Git Workflow

```bash
# Feature branches
git checkout -b feat/sam-personality
git add tests/
git commit -m "test: Add Sam personality tests (failing)"
git add src/
git commit -m "feat: Implement Sam personality module"

# Regular integration
git checkout dev
git merge feat/sam-personality
git push origin dev

# Hour 16: Feature freeze
git checkout -b release/demo
# NO NEW FEATURES on this branch
```

## 🎯 Demo-Critical Checklist

Before ANY commit, ask yourself:

- [ ] Does this directly support one of the 5 success metrics?
- [ ] Are there tests that prove it works? (Target: 70% coverage on critical paths)
- [ ] Will it work reliably during a live demo?
- [ ] Is there a fallback if it fails?
- [ ] Is it the simplest possible solution?

### Performance Targets

- **Webhook Response**: <3s (7s absolute max)
- **Dashboard Update**: <2s polling interval
- **Memory Query**: <500ms from KV storage
- **Sentiment Analysis**: <1s processing time
- **Community Matching**: <300ms for 100 profiles
- **Test Coverage**: 70% minimum on critical paths

## 🔴 Red Flags (Stop Immediately If...)

1. **Memory test fails at Hour 8** - ALL STOP until fixed
2. **Webhook takes >3 seconds** - Optimize or add fallback
3. **Dashboard not updating** - Check polling and CORS
4. **Health notes not saving** - Verify async processing
5. **No matches showing** - Check scoring algorithm

## 💡 Quick Debugging

```typescript
// Add breadcrumbs everywhere
console.log('[VAPI] Request received:', Date.now());
console.log('[SAM] Generating response...');
console.log('[KV] Saving profile...');

// Time critical paths
const start = Date.now();
const response = await generateResponse();
console.log(`[PERF] Response time: ${Date.now() - start}ms`);

// Verify data flow
console.log('[PROFILE]', JSON.stringify(profile, null, 2));
```

## 📝 Remember

1. **TDD is not optional** - Tests FIRST, always
2. **Simplicity wins** - Working > Perfect
3. **Demo drives decisions** - What will judges see?
4. **Integration over isolation** - Test components together
5. **Critical thinking** - Question your implementation
6. **Edge cases matter** - Especially for health/crisis
7. **Fallbacks save demos** - Always have Plan B

## 🎪 The 3-Minute Demo Script

### 0:00-0:30 - Introduction

- **Problem Statement**: "Mrs. Chen hasn't talked to anyone in 5 days"
- **Solution**: ElderLink - holistic senior care across 3 dimensions
- **Setup**: Place phone call to Sam on speaker

### 0:30-1:30 - Memory & Natural Conversation

- **Sam**: "Hi Mrs. Chen! How are those tomatoes growing?"
- **Mrs. Chen**: "They're doing well, Sam"
- **Sam**: "That's wonderful! Did Sarah visit last weekend?"
- **Dashboard**: Sentiment meter moving in real-time (green)
- **Key Point**: Sam remembers without being told

### 1:30-2:00 - Health Tracking

- **Mrs. Chen**: "My arthritis has been acting up"
- **Sam**: "I'm sorry to hear that. Are you still taking your Methotrexate?"
- **Dashboard**: Health Timeline shows new note created
- **Alert**: Yellow indicator for pain mention

### 2:00-2:30 - Language & Community

- **Mrs. Chen**: "我今天有点累" (I'm a bit tired today)
- **Sam**: *switches to Mandarin response*
- **Dashboard**: Community tab shows 3 matches
- **Highlight**: Mrs. Lee (92% match), both speak Mandarin, love gardening

### 2:30-3:00 - Impact & Closing

- **Dashboard Overview**:
  - 147 conversations over 30 days
  - Wellness score improved from 52 to 78
  - Word cloud: "Sarah, tomatoes, garden, happy"
- **Closing**: "No senior should feel alone"
- **Call-to-action**: Questions from judges

**If something fails:**

- Recording backup ready (memory-demo.mp3, health-demo.mp3)
- Screenshots prepared (dashboard-live.png, community-matches.png)
- Verbal explanation: "Let me show you what happened earlier today..."
- Team hand signals: ✋ (stop), 👍 (continue), 🔄 (switch to backup)

---

## Final Reminders

- **Clear context after each major task** to optimize LLM performance
- **Commit after EVERY working feature** with descriptive messages
- **Ask questions when uncertain** - Better to clarify than assume
- **Be your own critic** - If you're not finding issues, you're not looking hard enough
- **Focus on what matters** - 5 success metrics, nothing else

**When in doubt:** Check PRD Section 4 (Requirements), TASK_LIST Section 2.0-5.0 (Implementation), and TDD_TEST_CASES.md (Test Specs)