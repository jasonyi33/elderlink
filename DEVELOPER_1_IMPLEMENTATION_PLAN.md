# Developer 1: Core AI Conversation System - Implementation Plan

**Developer:** Claude (AI Assistant)  
**Role:** Core AI Conversation System (60% effort)  
**Timeline:** Hours 0-12 (Primary focus), Hours 12-18 (Integration support)  
**Critical Success Metrics:** Memory continuity, Natural conversation, Health check-ins

---

## 🎯 Overview

As Developer 1, I'm responsible for building the core AI conversation system that makes Sam feel like a warm, remembering companion rather than a robotic chatbot. This includes:

1. **Sam Personality Module** - Natural, warm responses with memory references
2. **Memory Extraction** - Learning and storing information from conversations  
3. **Combined Sentiment & Health Analysis** - Understanding emotions and health mentions
4. **Conversation Helpers** - Language detection, fallback topics, energy matching
5. **Demo Data** - Mrs. Chen profile and match profiles for testing

**Critical:** Every feature follows the 7-step TDD process. Tests are written FIRST, then implementation.

---

## 📋 Task Breakdown

### 2.1 Sam Personality Module (TDD) - **CRITICAL**

**Priority:** HIGHEST - This is the core differentiator

#### 2.1a: WRITE TESTS (14 tests)
- [ ] Create `prompts/sam-personality.test.ts`
- [ ] **Warm Greetings (2 tests):**
  - Uses senior name in greeting (contains "Mrs. Chen", not "user")
  - Avoids robotic greetings (not "how can I assist", yes "how are you")
- [ ] **Memory References (3 tests):**
  - References known family members (contains "Sarah" or "Tommy")
  - References recent events from history (contains "tomato" or "garden" or "piano")
  - Asks about specific known interests
- [ ] **Health Check-ins (3 tests):**
  - Health inquiry every 2-3 exchanges not every exchange (4 exchanges → 1-2 health mentions)
  - Mentions specific medications from profile (contains "Lisinopril")
  - Asks about known conditions by name
- [ ] **Community Mentions (3 tests):**
  - No community mention in middle of conversation
  - Community mention at end of call (contains "found friends" or "gardening circle")
  - Community mention includes specific shared interest
- [ ] **Response Quality (2 tests):**
  - Responses are 2-3 sentences max
  - Short responses for short inputs (energy matching)
- [ ] **AI Identity (2 tests):**
  - Never explicitly mentions being AI
  - Deflects AI questions warmly
- [ ] **Language Switching (2 tests):**
  - Responds in Mandarin when senior speaks Mandarin
  - Switches back to English smoothly

#### 2.1b: CONFIRM TESTS FAIL
- [ ] Run `npx jest prompts/sam-personality.test.ts`
- [ ] Verify ALL 14 tests show "FAIL" status
- [ ] Take screenshot of failing test output
- [ ] Document failure count (should be 14 failing tests)

#### 2.1c: COMMIT FAILING TESTS
- [ ] `git add prompts/sam-personality.test.ts`
- [ ] `git commit -m "Add Sam personality tests (14 tests, all failing)"`
- [ ] Push to feature branch

#### 2.1d: IMPLEMENT SAM_RESPONSE_PROMPT - USE EXACT PRD TEMPLATE
- [ ] Create `prompts/sam-personality.ts`
- [ ] **CRITICAL**: Copy EXACT SAM_RESPONSE_PROMPT from PRD lines 839-896
- [ ] **DO NOT MODIFY** the prompt template - use exactly as specified
- [ ] Implement `generateSamResponse(message, profile, exchangeNumber?, options?)` function
- [ ] Implement SAM_RESPONSE_PROMPT template with:
  - Personality traits: warm, patient, good_listener, empathetic, health_aware
  - Adaptive traits: energy level, formality, conversation pace, healthInquiryFrequency: "every_2_3_exchanges"
  - 2-3 sentence response limit
  - Memory references from `profile.memories`
  - Health check-in logic based on `exchangeNumber % 3 === 0`
  - End-of-call community script when `options.isEndingCall === true`
  - Language detection and response in matching language
  - Never explicitly state being AI
  - End-of-call detection for keywords: goodbye, bye, talk later, need to go
- [ ] **DO NOT modify tests during implementation**

#### 2.1e: ITERATE UNTIL TESTS PASS
- [ ] Run `npx jest prompts/sam-personality.test.ts --watch`
- [ ] Fix implementation issues one by one
- [ ] Verify green status for all 14 tests
- [ ] Run full test suite: `npm test`

#### 2.1f: VERIFY WITH INDEPENDENT SUBAGENT
- [ ] Create `scripts/verify-sam-personality.ts`
- [ ] Generate 20 random test cases (different inputs)
- [ ] Verify responses are NOT identical/templated (no overfitting)
- [ ] Check response variety and naturalness
- [ ] Document verification results

#### 2.1g: COMMIT IMPLEMENTATION
- [ ] `git add prompts/sam-personality.ts`
- [ ] `git commit -m "Implement Sam personality module (14/14 tests passing)"`
- [ ] Create pull request to dev branch

---

### 2.2 Memory Extraction Module (TDD)

#### 2.2a: WRITE TESTS (6 tests)
- [ ] Create `prompts/memory-extraction.test.ts`
- [ ] Extracts family members with relationships
- [ ] Extracts hobbies and interests
- [ ] Extracts interests for social profile
- [ ] Extracts recent events with temporal context
- [ ] Does not re-extract known memories
- [ ] Returns empty arrays when no new information

#### 2.2b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 6 tests fail
- [ ] Commit failing tests
- [ ] Create `prompts/memory-extraction.ts`
- [ ] **CRITICAL**: Copy EXACT MEMORY_EXTRACTION_PROMPT from PRD lines 949-987
- [ ] Implement `extractMemories(message, existingProfile?)` function
- [ ] JSON output structure: `{family: [], hobbies: [], interests: [], recentEvents: [], preferences: []}`
- [ ] Duplicate detection logic
- [ ] Iterate until all 6 tests pass
- [ ] Verify with subagent
- [ ] Commit implementation

---

### 2.3 Combined Sentiment & Health Analysis (TDD)

#### 2.3a: WRITE TESTS (14 tests)
- [ ] Create `prompts/sentiment-health-analysis.test.ts`
- [ ] **Sentiment Scoring Tests (3):**
  - Positive statement → sentiment 0.5-1.0
  - Negative statement → sentiment -1.0 to -0.3
  - Neutral statement → sentiment -0.3 to 0.3
- [ ] **Emotion Detection Tests (2):**
  - "I'm happy but worried" → emotions ["happy", "anxious"]
  - "I haven't talked to anyone in days" → emotions ["lonely"]
- [ ] **Health Mention Extraction Tests (6):**
  - Mild symptom (back pain when gardening)
  - Moderate symptom (knees quite sore)
  - Severe symptom + crisis flag (terrible chest pain)
  - Medication adherence (took all medications)
  - Medication non-adherence (forgot morning pills)
  - No health mentions (weather is beautiful)
  - Multiple health mentions in one sentence
- [ ] **Crisis Detection Tests (2):**
  - Suicide ideation (don't want to live anymore)
  - Severe depression (life has no meaning)

#### 2.3b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 14 tests fail
- [ ] Commit failing tests
- [ ] Create `prompts/sentiment-health-analysis.ts`
- [ ] **CRITICAL**: Copy EXACT SENTIMENT_HEALTH_ANALYSIS_PROMPT from PRD lines 899-946
- [ ] Implement `analyzeSentimentAndHealth(message, context, env)` function
- [ ] Single Gemini API call returns structured JSON
- [ ] Severity classification logic
- [ ] Crisis keyword matching
- [ ] Iterate until all 14 tests pass
- [ ] Verify with subagent
- [ ] Commit implementation

---

### 2.4 Conversation Helpers & Fallbacks (TDD)

#### 2.4a: WRITE TESTS (6 tests)
- [ ] Create `utils/conversation-helpers.test.ts`
- [ ] Language detection (Mandarin vs English)
- [ ] Energy level extraction (high/normal/low)
- [ ] Create `utils/fallback-topics.test.ts`
- [ ] Fallback topic rotation (no repeated topic in 3 consecutive calls)
- [ ] Fallback response variety (10 different fallback responses available)

#### 2.4b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm tests fail
- [ ] Commit failing tests
- [ ] Implement `utils/conversation-helpers.ts`:
  - `detectLanguage(message): "english" | "mandarin"`
  - `extractEnergyLevel(message): "high" | "normal" | "low"`
  - `selectVoice(language): voiceId`
- [ ] Implement `utils/fallback-topics.ts`:
  - `selectFallbackTopic(usedTopics, profile)`
  - `selectFallbackResponse()`
- [ ] Create `data/fallback-responses.json` with 10+ variations
- [ ] Iterate until all pass
- [ ] Verify with subagent
- [ ] Commit implementation

---

### 2.5 Demo Data: Mrs. Chen Profile (TDD)

#### 2.5a: WRITE TESTS (12 tests)
- [ ] Create `data/mrs-chen-profile.test.ts`
- [ ] Profile has exactly 5 conversations
- [ ] Each conversation has health mentions
- [ ] **Specific conversation tests (5):**
  - Conversation 1: Sept 20, sentiment 0.3, 'knees sore' mention
  - Conversation 2: Sept 27, sentiment 0.2, 'forgot pills' mention
  - Conversation 3: Oct 5, sentiment 0.4, 'back pain gardening' mention
  - Conversation 4: Oct 12, sentiment 0.6, 'took all medications' mention
  - Conversation 5: Oct 17, sentiment 0.7, 'excited for checkup' mention
- [ ] Health data has 3 medications
- [ ] Health data has 3 conditions
- [ ] At least 1 upcoming appointment
- [ ] Interests include: gardening, piano, cooking, Shanghai culture

#### 2.5b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm tests fail
- [ ] Commit failing tests
- [ ] Create `data/mrs-chen-profile.json` with EXACT data from PRD lines 639-663
- [ ] Implement loader function `loadMrsChenProfile()`
- [ ] Iterate until all 12 tests pass
- [ ] Verify data accuracy
- [ ] Commit implementation

---

### 2.6 Demo Data: Match Profiles (TDD)

#### 2.6a: WRITE TESTS (4 tests)
- [ ] Create `data/match-profiles.test.ts`
- [ ] 3 match profiles created (Mrs. Lee, Mr. Wang, Mrs. Kim)
- [ ] Each profile has complete structure
- [ ] Shared interests with Mrs. Chen documented
- [ ] All profiles have Mandarin language (except Mrs. Kim: Korean)

#### 2.6b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm tests fail
- [ ] Commit failing tests
- [ ] Create `data/match-profiles.json`:
  - **Mrs. Lee**: age 69, Seattle, interests [gardening, piano, cooking, mahjong], Taiwan/Mandarin
  - **Mr. Wang**: age 75, Seattle, interests [gardening, tai chi, cooking], Beijing/Mandarin
  - **Mrs. Kim**: age 68, Bellevue, interests [gardening, knitting], Seoul/Korean
- [ ] Implement `loadMatchProfiles()`
- [ ] Iterate until all 4 tests pass
- [ ] Verify compatibility for demo
- [ ] Commit implementation

---

### 2.7 Crisis Detection Keywords (TDD)

#### 2.7a: WRITE TESTS (5 tests)
- [ ] Create `data/escalation-keywords.test.ts`
- [ ] Keywords file has 3 categories: medical, crisis, depression
- [ ] Medical keywords include: chest pain, can't breathe, stroke
- [ ] Crisis keywords include: end it all, not worth living, wish I was dead
- [ ] Depression keywords include: hopeless, no meaning, worthless
- [ ] Keyword matching is case-insensitive

#### 2.7b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm tests fail
- [ ] Commit failing tests
- [ ] Create `data/escalation-keywords.json` with exact keyword lists
- [ ] Implement `loadEscalationKeywords()` and `matchesKeywords(text, category)`
- [ ] Iterate until all 5 tests pass
- [ ] Verify keyword coverage
- [ ] Commit implementation

---

## 🔄 Integration Points

### Handoffs to Other Developers:

#### Hour 5: Handoff to Developer 2 (Backend API)
- [ ] `generateSamResponse()` function ready
- [ ] `extractMemories()` function ready
- [ ] `analyzeSentimentAndHealth()` function ready
- [ ] All functions have proper TypeScript interfaces
- [ ] Functions handle errors gracefully
- [ ] Documentation for each function's parameters and return values

#### Hour 7: Handoff to Developer 2 (Analysis Functions)
- [ ] `detectLanguage()` function ready
- [ ] `extractEnergyLevel()` function ready
- [ ] `selectVoice()` function ready
- [ ] Fallback topic selection ready
- [ ] All helper functions tested and documented

### Integration Tests (ALL DEVS TOGETHER):

#### Hour 8: CRITICAL MEMORY TEST
- [ ] **PASS CRITERIA**: Sam MUST mention Sarah or Tommy from previous call
- [ ] **IF FAILS**: ALL developers stop and debug
- [ ] This is the core differentiator - cannot fail

#### Hour 10: Health Tracking Test
- [ ] Health mention extraction works
- [ ] MyChart note creation works
- [ ] Dashboard Health Timeline displays notes

#### Hour 12: Language Test
- [ ] Language switching demonstration
- [ ] Voice changes when language switches

---

## 🚨 Critical Success Metrics

### 1. Memory Continuity (MUST WORK)
- Sam remembers Mrs. Chen and references previous conversations
- References family members by name (Sarah, Tommy)
- References recent events (tomatoes, garden, piano)
- Memory persists across multiple calls

### 2. Natural Conversation (MUST WORK)
- Responses are 2-3 sentences maximum
- Avoids robotic greetings
- Matches energy level of senior
- Never explicitly mentions being AI

### 3. Health Check-ins (MUST WORK)
- Proactive health questions every 2-3 exchanges
- References specific medications by name
- References known conditions
- Creates health notes when health mentioned

---

## 📝 Development Notes

### TDD Workflow Reminder:
1. ✍️ **Write Tests** - Create tests with specific input/output pairs
2. 🔴 **Confirm Failure** - Run tests and VERIFY they fail
3. 💾 **Commit Tests** - `git commit -m "Add [feature] tests (failing)"`
4. ✅ **Implement Code** - Write code WITHOUT modifying tests
5. 🔄 **Iterate** - Run tests repeatedly, adjust code until all pass
6. 🤖 **Verify** - Use independent subagent to verify no overfitting
7. 💾 **Commit Code** - `git commit -m "Implement [feature]"`

### Key Files to Create:
- `prompts/sam-personality.ts` - Main response generation
- `prompts/memory-extraction.ts` - Memory learning
- `prompts/sentiment-health-analysis.ts` - Combined analysis
- `utils/conversation-helpers.ts` - Language detection, energy matching
- `utils/fallback-topics.ts` - Fallback responses
- `data/mrs-chen-profile.json` - Demo profile data
- `data/match-profiles.json` - Demo match data
- `data/escalation-keywords.json` - Crisis detection keywords

### Performance Targets:
- **Response Generation**: <2s (target: 800ms)
- **Memory Extraction**: <1s
- **Sentiment Analysis**: <1s
- **Language Detection**: <100ms

### Critical Reminders:
- Use EXACT prompts from PRD (lines 839-987) - DO NOT MODIFY
- Verify EXACT demo data from PRD (conversations with specific dates/sentiments)
- Test performance requirements (latency, CPU, memory)
- Include all edge cases in tests
- Memory continuity is the core differentiator - cannot fail

---

## 🎯 Success Criteria Checklist

Before marking any task complete:

- [ ] All tests written and failing
- [ ] Tests committed separately from implementation
- [ ] Implementation passes all tests
- [ ] Independent subagent verification completed
- [ ] Performance requirements met
- [ ] Edge cases handled
- [ ] Documentation complete
- [ ] Integration points ready for handoff

**Remember:** Sam is not a chatbot. Sam is a companion who remembers, cares about health, and connects seniors with community. The memory system is the heart of this project.
