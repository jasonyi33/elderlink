# Developer 2: Backend API & Services Implementation Guide

**Version:** 1.0  
**Developer Role:** Backend API & Services (Section 3.0)  
**Responsibilities:** Full-time backend development  
**Timeline:** 24 hours  

---

## 🎯 YOUR MISSION AS DEVELOPER 2

You are the **Backend API & Services** developer responsible for:
- ✅ All API endpoints and routing
- ✅ Vapi webhook handler (CRITICAL PATH - must respond <3s)
- ✅ All backend services (KV, Health, Matching, Alerts, Wellness, Gemini)
- ✅ CORS middleware
- ✅ Performance validation

**NOT Your Responsibility:**
- ❌ Section 2.0: Core AI Conversation (Developer 1)
- ❌ Section 4.0: Voice & Phone System (Developer 3)
- ❌ Section 5.0: Dashboard Interface (Developer 4)

---

## ⚠️ CRITICAL TDD WORKFLOW (MANDATORY)

**Every single task follows this 7-step process:**

1. ✍️ **Write Tests** - Create tests with specific input/output pairs (reference TDD_TEST_CASES.md)
2. 🔴 **Confirm Failure** - Run tests and VERIFY they fail
3. 💾 **Commit Tests** - `git commit -m "Add [feature] tests (failing)"`
4. ✅ **Implement Code** - Write code WITHOUT modifying tests
5. 🔄 **Iterate** - Run tests repeatedly, adjust code until all pass
6. 🤖 **Verify** - Use independent verification to avoid overfitting
7. 💾 **Commit Code** - `git commit -m "Implement [feature]"`

**If any step is skipped, the task is INCOMPLETE.**

---

## 📋 TASK OVERVIEW

### Summary of Your 12 Tasks:
1. **3.1** - API Endpoints (12 tests)
2. **3.2** - Vapi Webhook Handler (13 tests) - **CRITICAL PATH**
3. **3.3** - KV Service (5 tests)
4. **3.4** - Health Service (12 tests) - **CRITICAL**
5. **3.5** - Matching Service (16 tests) - **CRITICAL**
6. **3.6** - Alert Service (11 tests) - **CRITICAL**
7. **3.7** - Wellness Metrics Service (14 tests)
8. **3.8** - Gemini Service (8 tests)
9. **3.9** - CORS Middleware (3 tests)
10. **3.10** - Conversation Summary Service (4 tests)
11. **3.11** - Word Cloud Service (4 tests)
12. **3.12** - Performance Validation (7 tests) - **CRITICAL**

**Total Tests:** 109 tests  
**Total Lines of Code:** ~1,500 lines across all services

---

## 🔄 CRITICAL HANDOFF SCHEDULE

### Hour 2: Share Worker URL
- [ ] Deploy Worker with health check endpoint
- [ ] Share URL with ALL developers immediately
- [ ] URL format: `https://elderlink-dev.[username].workers.dev`
- [ ] All developers must test connection

### Hour 4: API Contract Lock
- [ ] Document all 12 API endpoints
- [ ] Lock API contract (NO changes after this)
- [ ] Coordinate with all developers for alignment
- [ ] Integration lead verifies

### Hour 5: Receive from Developer 1
- [ ] Receive conversation generation functions
- [ ] Integrate with webhook handler

### Hour 7: Receive from Developer 1
- [ ] Receive analysis functions (sentiment + health)
- [ ] Integrate with async processing

### Hour 9: Connect with Developer 4
- [ ] Dashboard API connection
- [ ] Verify polling works
- [ ] Test CORS

---

## 🧪 INTEGRATION TEST SCHEDULE (Join ALL Developers)

### Hour 6: First Integration
- [ ] Phone → webhook → response chain works
- [ ] Response time <3 seconds
- [ ] If fails: 30-minute all-hands debug

### Hour 8: Memory Test (CRITICAL)
- [ ] Memory continuity test MUST pass
- [ ] **If fails: ALL developers stop and fix**
- [ ] This is the core differentiator

### Hour 10: Health Tracking Test
- [ ] Health mention extraction works
- [ ] MyChart note creation works
- [ ] Dashboard Health Timeline displays notes

### Hour 12: Language Test
- [ ] Language switching demonstration
- [ ] If fails: Fallback to English-only

### Hour 14: Full Pipeline (ALL 5 criteria)
- [ ] Complete flow with ALL features
- [ ] Last chance for major fixes

### Hour 16: Community Matching Test
- [ ] All 3 matches calculated correctly
- [ ] Group suggestions auto-generated

---

## 🎯 PERFORMANCE TARGETS

- **Webhook Response:** <3s (7s absolute max)
- **Dashboard Update:** <2s polling interval
- **Memory Query:** <500ms from KV storage
- **Sentiment Analysis:** <1s processing time
- **Community Matching:** <300ms for 100 profiles
- **Test Coverage:** 70% minimum on critical paths

---

## 📝 DETAILED TASK BREAKDOWN

### 3.1 API Endpoints Tests (TDD)

**3.1a: WRITE TESTS**
- [ ] Create `src/index.test.ts`
- [ ] Write test: `GET /api/health` returns `{status: "ok", timestamp: ISO}`
- [ ] Write test: `POST /vapi-webhook` with valid message returns `{content: string, voiceId: string}`
- [ ] Write test: `GET /api/senior/mrs-chen` returns complete SeniorProfile
- [ ] Write test: `GET /api/sentiment/live` returns `{sentiment: number, emotions: [], timestamp: ISO}`
- [ ] Write test: `GET /api/analytics` returns aggregate analytics
- [ ] Write test: `GET /api/mychart/:seniorId` returns health data
- [ ] Write test: `GET /api/mychart/:seniorId/appointments` returns upcoming appointments only
- [ ] Write test: `POST /api/mychart/:seniorId/update` accepts batch health notes
- [ ] Write test: `GET /api/matches/:seniorId` returns top 3 matches (or fewer)
- [ ] Write test: `GET /api/groups/:seniorId` returns suggested groups
- [ ] Write test: `POST /api/init-demo` initializes demo data idempotently
- [ ] Write test: `GET /api/alerts/:seniorId` returns alerts array
- [ ] **Reference**: TDD_TEST_CASES.md Section 2.1

**3.1b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/index.test.ts`
- [ ] Verify 12 failing tests
- [ ] Screenshot or log output

**3.1c: COMMIT FAILING TESTS**
- [ ] `git add src/index.test.ts`
- [ ] `git commit -m "test: Add API endpoint tests (12 tests, all failing)"`

**3.1d: IMPLEMENT API ROUTES**
- [ ] Create `src/index.ts` with Cloudflare Worker entry point
- [ ] Implement route handling for all 12 endpoints
- [ ] Use modular handlers (create separate files for each route group)
- [ ] **DO NOT modify tests during implementation**

**3.1e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/index.test.ts --watch`
- [ ] Fix routing and response formats
- [ ] Ensure all 12 tests pass

**3.1f: VERIFY WITH INDEPENDENT SUBAGENT**
- [ ] Create Postman collection with all endpoints
- [ ] Test each endpoint with 5 different inputs
- [ ] Verify response schemas match PRD Section 7

**3.1g: COMMIT IMPLEMENTATION**
- [ ] `git add src/index.ts`
- [ ] `git commit -m "feat: Implement API routes (12/12 tests passing)"`
- [ ] Deploy to dev: `wrangler deploy --env dev`
- [ ] **Share URL with team immediately**

---

### 3.2 Vapi Webhook Handler (TDD) **[CRITICAL PATH]**

**3.2a: WRITE TESTS**
- [ ] Create `src/handlers/vapi-webhook.test.ts`
- [ ] Write test: "processes valid message successfully" (status 200, has content and voiceId)
- [ ] Write test: "handles empty message gracefully" (returns fallback response)
- [ ] Write test: "responds in <3 seconds total" (measure elapsed time)
- [ ] Write test: "triggers timeout fallback at 7 seconds" (mock Gemini delay 8s)
- [ ] Write test: "selects correct voice based on language" (Mandarin input → Mandarin voiceId)
- [ ] Write test: "English input → English voiceId"
- [ ] Write test: "Unknown language → English voiceId (default)"
- [ ] Write test: "async processing does not block response" (response time <3s even if async takes 5s)
- [ ] Write test: "uses env.context.waitUntil() for async processing"
- [ ] Write test: "async processing continues after response sent"
- [ ] Write test: "async failure doesn't affect response"
- [ ] Write test: "profile updated after async processing completes" (wait 2s, check conversations array)
- [ ] Write test: "handles 2 simultaneous calls to same senior without corruption"
- [ ] **Reference**: TDD_TEST_CASES.md Section 2.1, PRD Section 5 (lines 728-770)

**3.2b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/handlers/vapi-webhook.test.ts`
- [ ] Verify 13 failing tests

**3.2c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add vapi webhook tests (13 tests, all failing)"`

**3.2d: IMPLEMENT WEBHOOK HANDLER**
- [ ] Create `src/handlers/vapi-webhook.ts`
- [ ] Implement **PRIORITY PATH** (<2s target):
  - Parse message and history
  - Call `generateSamResponse()` with 7s timeout
  - Return `{content, voiceId}` immediately
- [ ] Implement **ASYNC PATH** (background via `env.context.waitUntil`):
  - Combined sentiment+health analysis
  - Extract memories and interests
  - Create health notes if health mentions found
  - Recalculate matches if interests changed
  - Update profile in KV
- [ ] Voice selection logic based on language detection
- [ ] Implement timeout logic with Promise.race
- [ ] **DO NOT modify tests**

**3.2e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/handlers/vapi-webhook.test.ts --watch`
- [ ] Fix latency issues, timeout handling
- [ ] Verify all 13 tests pass
- [ ] Verify latency <3s consistently

**3.2f: VERIFY WITH LOAD TESTING**
- [ ] Test with 20 consecutive webhook calls
- [ ] Verify no timeouts
- [ ] Verify async processing completes
- [ ] Check for race conditions

**3.2g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement vapi webhook handler (13/13 tests passing)"`

---

### 3.3 KV Service (TDD)

**3.3a: WRITE TESTS**
- [ ] Create `src/services/kv-service.test.ts`
- [ ] Write test: "stores and retrieves profile"
- [ ] Write test: "conversation limit enforced (max 10)" (add 11th, verify oldest removed)
- [ ] Write test: "live sentiment has 5-minute TTL" (mock time, verify null after 6min)
- [ ] Write test: "handles race conditions with atomic updates" (concurrent writes don't corrupt)
- [ ] Write test: "handles missing profile gracefully" (returns null)
- [ ] **Reference**: TDD_TEST_CASES.md Section 2.2

**3.3b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/kv-service.test.ts`
- [ ] Verify 5 failing tests

**3.3c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add KV service tests (5 tests, all failing)"`

**3.3d: IMPLEMENT KV SERVICE**
- [ ] Create `src/services/kv-service.ts`
- [ ] Implement functions:
  - `saveProfile(profile, env)` with conversation truncation
  - `getProfile(seniorId, env)`
  - `saveLiveSentiment(seniorId, data, env)` with expirationTtl: 300
  - `getLiveSentiment(seniorId, env)`
  - Atomic update logic
- [ ] **DO NOT modify tests**

**3.3e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/kv-service.test.ts --watch`
- [ ] Fix data corruption issues
- [ ] Verify all 5 tests pass

**3.3f: VERIFY NO DATA CORRUPTION**
- [ ] Test with 100 concurrent writes
- [ ] Verify data integrity
- [ ] Check TTL expiration works

**3.3g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement KV service (5/5 tests passing)"`

---

### 3.4 Health Service (TDD) **[CRITICAL - EXPANDED]**

**3.4a: WRITE TESTS**
- [ ] Create `src/services/health-service.test.ts`
- [ ] Write test: "creates note from symptom mention" (healthMentions → formatted note)
- [ ] Write test: "creates note from medication non-adherence"
- [ ] Write test: "multiple health mentions in single note"
- [ ] Write test: "appends note to existing notes array"
- [ ] Write test: "truncates to last 10 notes" (11th note added, oldest removed)
- [ ] Write test: "Sam references specific medication name"
- [ ] Write test: "Sam references known condition by name"
- [ ] Write test: "Sam reminds about NEXT appointment only" (not all)
- [ ] Write test: "Sam mentions appointment if <7 days away"
- [ ] Write test: "Sam doesn't mention appointments >7 days away"
- [ ] Write test: "mentions doctor name and appointment type"
- [ ] Write test: "Sam never gives medical advice" (deflects to doctor)
- [ ] **Reference**: TDD_TEST_CASES.md Section 3.1, PRD lines 320-357

**3.4b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/health-service.test.ts`
- [ ] Verify 12 failing tests

**3.4c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add health service tests (12 tests, all failing)"`

**3.4d: IMPLEMENT HEALTH SERVICE**
- [ ] Create `src/services/health-service.ts`
- [ ] Implement functions:
  - `createHealthNote(healthMentions, profile)`: Returns formatted note with natural language + structured metadata
  - `appendHealthNote(profile, note)`: Adds note, truncates to 10
  - `generateHealthCheckIn(profile, type: "medication" | "condition" | "appointment")`: Returns Sam's proactive health question
  - `getNextAppointment(profile)`: Returns appointment if <7 days away
  - `extractVitals(message)`: Extracts blood pressure, weight, blood sugar
- [ ] Natural language note format: "Patient reports: [text] [context]"
- [ ] Appointment reminder logic: Only mention if date is within 7 days
- [ ] Store vitals in profile.healthData.vitals
- [ ] **DO NOT modify tests**

**3.4e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/health-service.test.ts --watch`
- [ ] Fix note formatting, truncation logic, Sam's health questions
- [ ] Verify all 12 tests pass

**3.4f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test with 20 different health mentions
- [ ] Verify note quality and accuracy
- [ ] Check Sam's questions sound natural, not clinical

**3.4g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement health service with appointment logic (12/12 tests passing)"`

---

### 3.5 Matching Service (TDD) **[CRITICAL]**

**3.5a: WRITE TESTS**
- [ ] Create `src/services/matching-service.test.ts`
- [ ] Write test: "perfect match scores correctly" (3 shared interests + language + age + location)
- [ ] Write test: "shared interests: 10 points each, max 50"
- [ ] Write test: "same language: 30 points" (compare Mandarin vs different language)
- [ ] Write test: "age proximity (±10 years): 10 points"
- [ ] Write test: "same location: 10 points"
- [ ] Write test: "empty interests still scores on language/age/location"
- [ ] Write test: "score never exceeds 100"
- [ ] Write test: "below threshold (score < 50) example"
- [ ] Write test: "returns exactly 3 matches (or fewer if <3 qualify)"
- [ ] Write test: "only returns matches with score >= 50"
- [ ] Write test: "matches sorted by score descending"
- [ ] Write test: "returns empty array when no seniors qualify"
- [ ] Write test: "includes compatibility level based on score" (70+ = high, 50+ = medium)
- [ ] Write test: "group name format: {Language} {Interest} Circle"
- [ ] Write test: "auto-generates group from most common shared interest"
- [ ] Write test: "includes member list in group"
- [ ] **Reference**: TDD_TEST_CASES.md Section 4.1, PRD lines 1641-1668

**3.5b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/matching-service.test.ts`
- [ ] Verify 16 failing tests

**3.5c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add matching service tests (16 tests, all failing)"`

**3.5d: IMPLEMENT MATCHING SERVICE**
- [ ] Create `src/services/matching-service.ts`
- [ ] Implement algorithm per PRD lines 1641-1668:
  - `calculateMatchScore(senior1, senior2)`: Returns 0-100
    - Shared interests: Math.min(50, sharedCount * 10)
    - Same language: 30 points
    - Age within ±10: 10 points
    - Same location: 10 points
    - Cap at 100
  - `getTopMatches(seniorId, allSeniors)`: Returns top 3 with score >= 50, sorted descending
  - `generateGroupSuggestions(senior, matches)`: Returns auto-named groups
- [ ] **DO NOT modify tests**

**3.5e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/matching-service.test.ts --watch`
- [ ] Fix scoring logic, threshold filtering, sorting
- [ ] Verify all 16 tests pass

**3.5f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test algorithm with 10 random senior pairs
- [ ] Verify scores are logical and consistent
- [ ] Check group names are grammatically correct

**3.5g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement matching service (16/16 tests passing)"`

---

### 3.6 Alert Service (TDD) **[CRITICAL - WAS MISSING]**

**3.6a: WRITE TESTS**
- [ ] Create `src/services/alert-service.test.ts`
- [ ] Write test: "medical emergency creates high severity alert"
- [ ] Write test: "suicide ideation creates crisis alert"
- [ ] Write test: "severe depression creates medium severity alert"
- [ ] Write test: "mild sadness does not create alert"
- [ ] Write test: "loads keywords from escalation-keywords.json"
- [ ] Write test: "matches medical emergency keywords"
- [ ] Write test: "matches suicide ideation keywords"
- [ ] Write test: "avoids false positives"
- [ ] Write test: "stores alert in KV with key alerts-{seniorId}"
- [ ] Write test: "appends to existing alerts (does not replace)"
- [ ] Write test: "requiresAction flag set correctly"
- [ ] **Reference**: TDD_TEST_CASES.md Section 6.1, PRD lines 587-596

**3.6b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/alert-service.test.ts`
- [ ] Verify 11 failing tests

**3.6c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add alert service tests (11 tests, all failing)"`

**3.6d: IMPLEMENT ALERT SERVICE**
- [ ] Create `src/services/alert-service.ts`
- [ ] Implement functions:
  - `loadEscalationKeywords()`: Loads from data/escalation-keywords.json
  - `matchesKeywords(text, category)`: Case-insensitive keyword matching
  - `detectAndCreateAlert(message, profile)`: Returns alert object or null
  - `storeAlert(seniorId, alert, env)`: Appends to KV
  - `getAlerts(seniorId, env)`: Retrieves alerts array
- [ ] Alert structure (PRD lines 587-596):
  ```typescript
  {
    seniorId: string,
    severity: "low" | "medium" | "high",
    type: "medical" | "crisis" | "depression" | "general",
    message: string,
    timestamp: string,
    requiresAction: boolean
  }
  ```
- [ ] **DO NOT modify tests**

**3.6e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/alert-service.test.ts --watch`
- [ ] Fix keyword matching logic, false positive prevention
- [ ] Verify all 11 tests pass

**3.6f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test with 30 crisis-related inputs
- [ ] Verify no false positives on benign statements
- [ ] Check alert severity classification accuracy

**3.6g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement alert service (11/11 tests passing)"`

---

### 3.7 Wellness Metrics Service (TDD)

**3.7a: WRITE TESTS**
- [ ] Create `src/services/wellness-service.test.ts`
- [ ] Write test: "converts sentiment -1 to +1 into 0 to 100" (5 test cases for -1, -0.5, 0, 0.5, 1)
- [ ] Write test: "calculates average from recent conversations"
- [ ] Write test: "matches contribute 10 points each to social score"
- [ ] Write test: "groups contribute 20 points each to social score"
- [ ] Write test: "combined: matches*10 + groups*20"
- [ ] Write test: "social score capped at 100"
- [ ] Write test: "holistic weighted average: mental*40% + physical*30% + social*30%"
- [ ] Write test: "all metrics at 100 gives 100"
- [ ] Write test: "all metrics at 0 gives 0"
- [ ] Write test: "improving trend (first half < second half)"
- [ ] Write test: "declining trend (first half > second half)"
- [ ] Write test: "stable trend (difference < threshold)"
- [ ] Write test: "handles empty conversation history"
- [ ] Write test: "handles single conversation"
- [ ] **Reference**: TDD_TEST_CASES.md Section 5.1, PRD lines 1445-1484

**3.7b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/wellness-service.test.ts`
- [ ] Verify 14 failing tests

**3.7c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add wellness metrics tests (14 tests, all failing)"`

**3.7d: IMPLEMENT WELLNESS SERVICE**
- [ ] Create `src/services/wellness-service.ts`
- [ ] Implement functions:
  - `calculateMentalScore(sentiment)`: (sentiment + 1) * 50
  - `calculateSocialScore({matchesMade, groupsJoined})`: min(100, matches*10 + groups*20)
  - `calculateHolisticScore(wellnessMetrics)`: weighted average
  - `calculateTrend(conversations)`: "improving" | "declining" | "stable" | "insufficient_data"
  - `updateWellnessMetrics(profile)`: Updates all metrics in profile object
- [ ] **DO NOT modify tests**

**3.7e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/wellness-service.test.ts --watch`
- [ ] Fix calculation logic
- [ ] Verify all 14 tests pass

**3.7f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test with 10 different wellness scenarios
- [ ] Verify calculations are accurate
- [ ] Check edge cases (empty data, single conversation)

**3.7g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement wellness metrics (14/14 tests passing)"`

---

### 3.8 Gemini Service (TDD)

**3.8a: WRITE TESTS**
- [ ] Create `src/services/gemini-service.test.ts`
- [ ] Write test: "memory extraction call completes in <7s"
- [ ] Write test: "response generation call completes in <7s"
- [ ] Write test: "sentiment+health analysis call completes in <7s"
- [ ] Write test: "interest extraction call completes in <7s"
- [ ] Write test: "handles Gemini timeout gracefully" (mock 8s delay → fallback)
- [ ] Write test: "handles malformed JSON response" (returns safe fallback)
- [ ] Write test: "implements exponential backoff on retry"
- [ ] Write test: "handles 429 rate limit error"
- [ ] **Reference**: PRD lines 1387-1413

**3.8b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/gemini-service.test.ts`
- [ ] Verify 8 failing tests

**3.8c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add gemini service tests (8 tests, all failing)"`

**3.8d: IMPLEMENT GEMINI SERVICE**
- [ ] Create `src/services/gemini-service.ts`
- [ ] Implement 4 separate functions for 4 Gemini calls
- [ ] Each with 7-second timeout
- [ ] Exponential backoff retry (max 3 attempts)
- [ ] JSON validation and fallback
- [ ] Temperature 0.7, max tokens 200 for responses
- [ ] **DO NOT modify tests**

**3.8e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/gemini-service.test.ts --watch`
- [ ] Fix timeout handling, retry logic
- [ ] Verify all 8 tests pass

**3.8f: VERIFY RELIABILITY**
- [ ] Test with 50 consecutive calls
- [ ] Verify no failures
- [ ] Check error handling works

**3.8g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement gemini service (8/8 tests passing)"`

---

### 3.9 CORS Middleware (TDD)

**3.9a: WRITE TESTS**
- [ ] Create `src/middleware/cors.test.ts`
- [ ] Write test: "adds CORS headers to all responses"
- [ ] Write test: "handles OPTIONS preflight requests"
- [ ] Write test: "allows dashboard origin"

**3.9b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/middleware/cors.test.ts`
- [ ] Verify 3 failing tests

**3.9c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add CORS middleware tests (3 tests, all failing)"`

**3.9d: IMPLEMENT CORS MIDDLEWARE**
- [ ] Create `src/middleware/cors.ts`
- [ ] Add headers to all responses
- [ ] Handle OPTIONS requests
- [ ] **DO NOT modify tests**

**3.9e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/middleware/cors.test.ts --watch`
- [ ] Verify all 3 tests pass

**3.9f: VERIFY FROM DASHBOARD**
- [ ] Test CORS works from dashboard
- [ ] No CORS errors in console

**3.9g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement CORS middleware (3/3 tests passing)"`

---

### 3.10 Conversation Summary Service (TDD) **[NEW - WAS MISSING]**

**3.10a: WRITE TESTS**
- [ ] Create `src/services/conversation-summary.test.ts`
- [ ] Write test: "generates 1-2 sentence summary from transcript"
- [ ] Write test: "extracts key topics from conversation"
- [ ] Write test: "identifies primary emotion"
- [ ] Write test: "handles empty transcript"

**3.10b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/conversation-summary.test.ts`
- [ ] Verify 4 failing tests

**3.10c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add conversation summary tests (4 tests, all failing)"`

**3.10d: IMPLEMENT SUMMARY SERVICE**
- [ ] Create `src/services/conversation-summary.ts`
- [ ] Implement functions:
  - `generateSummary(transcript)`: Returns 1-2 sentence summary
  - `extractKeyTopics(transcript)`: Returns top 3 topics
  - `identifyPrimaryEmotion(transcript)`: Returns dominant emotion
- [ ] **DO NOT modify tests**

**3.10e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/conversation-summary.test.ts --watch`
- [ ] Verify all 4 tests pass

**3.10f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test with 10 different conversations
- [ ] Verify summary quality

**3.10g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement conversation summary service (4/4 tests passing)"`

---

### 3.11 Word Cloud Service (TDD) **[NEW - WAS MISSING]**

**3.11a: WRITE TESTS**
- [ ] Create `src/services/word-cloud.test.ts`
- [ ] Write test: "extracts top 50 words from all conversations"
- [ ] Write test: "removes stop words (the, a, is, etc.)"
- [ ] Write test: "calculates word frequency"
- [ ] Write test: "sizes words by frequency^0.7"

**3.11b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest src/services/word-cloud.test.ts`
- [ ] Verify 4 failing tests

**3.11c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add word cloud service tests (4 tests, all failing)"`

**3.11d: IMPLEMENT WORD CLOUD SERVICE**
- [ ] Create `src/services/word-cloud.ts`
- [ ] Implement functions:
  - `generateWordCloud(conversations)`: Returns array of {word, size, frequency}
  - `removeStopWords(text)`: Filters common words
  - `calculateWordFrequency(words)`: Returns frequency map
  - `calculateWordSize(frequency)`: Returns frequency^0.7
- [ ] Include stop words list
- [ ] **DO NOT modify tests**

**3.11e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest src/services/word-cloud.test.ts --watch`
- [ ] Verify all 4 tests pass

**3.11f: VERIFY WITH INDEPENDENT TESTING**
- [ ] Test with different conversation sets
- [ ] Verify word sizing is visually appropriate

**3.11g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement word cloud service (4/4 tests passing)"`

---

### 3.12 Performance Validation (TDD) **[NEW - CRITICAL]**

**3.12a: WRITE TESTS**
- [ ] Create `tests/performance.test.ts`
- [ ] Write test: "Worker CPU time <50ms"
- [ ] Write test: "Worker memory usage <128MB"
- [ ] Write test: "KV read latency <200ms"
- [ ] Write test: "Full phone-to-voice latency <3s"
- [ ] Write test: "webhook responds in <3 seconds"
- [ ] Write test: "average latency over 10 calls <2.5 seconds"
- [ ] Write test: "no timeouts in 20 consecutive calls"
- [ ] **Reference**: TDD_TEST_CASES.md Section 9

**3.12b: CONFIRM TESTS FAIL**
- [ ] Run `npx jest tests/performance.test.ts`
- [ ] Verify 7 failing tests

**3.12c: COMMIT FAILING TESTS**
- [ ] `git commit -m "test: Add performance validation tests (7 tests, all failing)"`

**3.12d: IMPLEMENT PERFORMANCE MONITORING**
- [ ] Create performance monitoring utilities
- [ ] Add CPU time measurement
- [ ] Add memory usage tracking
- [ ] Add latency breakdown logging
- [ ] **DO NOT modify tests**

**3.12e: ITERATE UNTIL TESTS PASS**
- [ ] Run `npx jest tests/performance.test.ts --watch`
- [ ] Optimize code paths that fail performance requirements
- [ ] May require caching, parallel processing, or algorithm optimization

**3.12f: VERIFY WITH LOAD TESTING**
- [ ] Run 100 consecutive calls
- [ ] Verify no degradation over time
- [ ] Check for memory leaks

**3.12g: COMMIT IMPLEMENTATION**
- [ ] `git commit -m "feat: Implement performance optimizations (7/7 tests passing)"`

---

## 🚨 RED FLAGS (Stop Immediately If...)

1. **Webhook takes >3 seconds** - Optimize or add fallback
2. **Memory test fails at Hour 8** - ALL STOP until fixed
3. **Health notes not saving** - Verify async processing
4. **No matches showing** - Check scoring algorithm
5. **Dashboard not updating** - Check polling and CORS

---

## 📚 REFERENCE DOCUMENTS

### Always Reference:
- **TDD_TEST_CASES.md** - Specific test cases with input/output pairs
- **PRD.md Section 7** - Complete API implementation (lines 992-1677)
- **PRD.md Section 5** - Technical Architecture (lines 677-833)
- **.cursorrules** - Development rules and philosophy

### Key PRD Sections:
- Lines 134-260: SeniorProfile interface
- Lines 320-383: Health data structure
- Lines 399-433: Matching algorithm
- Lines 587-596: Alert structure
- Lines 728-770: Latency optimization
- Lines 992-1677: Complete Worker implementation
- Lines 1641-1668: Matching algorithm details

---

## ✅ COMPLETION CHECKLIST

### Before Marking Task 3.0 Complete:
- [ ] All 109 tests pass
- [ ] Worker deployed and URL shared
- [ ] All 12 API endpoints working
- [ ] Webhook responds <3 seconds
- [ ] Performance targets met
- [ ] CORS configured correctly
- [ ] All services integrated
- [ ] No linter errors
- [ ] Code committed with proper messages
- [ ] Integration tests passed (Hours 6, 8, 10, 12, 14, 16)

---

## 💡 TIPS & BEST PRACTICES

### Code Style:
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

### Always Consider Edge Cases:
- Empty/null data - What if profile.memories is empty?
- Timeout scenarios - What if Gemini takes 10 seconds?
- Language detection - What if mixed English/Mandarin?
- Crisis keywords - What if "chest pain" mentioned?
- Dashboard polling - What if 100 simultaneous users?

### Git Commit Messages:
```bash
# Tests
git commit -m "test: Add [feature] tests (N tests, all failing)"

# Implementation
git commit -m "feat: Implement [feature] (N/N tests passing)"

# Fixes
git commit -m "fix: Correct [issue] in [feature]"

# Performance
git commit -m "perf: Optimize [feature] for <3s latency"
```

---

## 🎯 REMEMBER

1. **YOU ARE DEVELOPER 2** - Focus ONLY on Section 3.0
2. **TDD is not optional** - Tests FIRST, always
3. **Simplicity wins** - Working > Perfect
4. **<3s latency is CRITICAL** - Optimize everything
5. **Integration matters** - Test with other components
6. **Edge cases save demos** - Handle all errors gracefully
7. **Fallbacks prevent failures** - Always have Plan B

**When in doubt:** Check TDD_TEST_CASES.md for test specs, PRD.md for requirements, and .cursorrules for workflow.

---

**END OF DEVELOPER 2 IMPLEMENTATION GUIDE**

*Remember: Every line of code you write must be tested first. No exceptions.*

