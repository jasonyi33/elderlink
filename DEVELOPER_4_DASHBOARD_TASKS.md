# Developer 4: Dashboard Interface Tasks (TDD Edition)

**Role:** Dashboard Interface Development (40% EFFORT)  
**Reference:** TASK_LIST_FINAL_TDD.md Section 5.0  
**TDD Workflow:** Write Tests → Confirm Failure → Commit → Implement → Iterate → Verify → Commit

---

## 🎯 Critical Success Metrics for Dashboard
1. ✅ **Dashboard shows real-time sentiment** changes during calls
2. ✅ **Community tab displays 3+ compatible matches** with auto-generated groups  
3. ✅ **Health Timeline displays notes** from health mentions
4. ✅ **All 4 tabs load correctly** with real data
5. ✅ **Visual impact** - judges can see the magic happening

---

## 📋 TDD Workflow (MANDATORY for ALL Tasks)

Every task follows this **7-step TDD process**:

1. ✍️ **Write Tests** - Create tests with specific input/output pairs (reference TDD_TEST_CASES.md)
2. 🔴 **Confirm Failure** - Run tests and VERIFY they fail (screenshot/log output)
3. 💾 **Commit Tests** - `git commit -m "Add [feature] tests (failing)"`
4. ✅ **Implement Code** - Write code WITHOUT modifying tests
5. 🔄 **Iterate** - Run tests repeatedly, adjust code until all pass
6. 🤖 **Verify** - Use independent subagent to verify no overfitting
7. 💾 **Commit Code** - `git commit -m "Implement [feature]"`

**If any step is skipped, the task is INCOMPLETE.**

---

## 5.1 React Project Setup

### 5.1a: Initialize React Project
- [ ] Run: `npm create vite@latest dashboard -- --template react-ts`
- [ ] Install dependencies: `tailwindcss`, `@headlessui/react`, `recharts`, `@tanstack/react-query`
- [ ] Configure Tailwind CSS
- [ ] Set up TypeScript strict mode
- [ ] Configure React Testing Library and Jest

---

## 5.2 Mock API (Development Phase) - TDD

### 5.2a: WRITE TESTS
- [ ] Create `dashboard/src/services/mock-api.test.ts`
- [ ] Write test: "mock Mrs. Chen profile matches structure"
- [ ] Write test: "mock includes 5 conversations with health mentions"
- [ ] Write test: "mock includes 3 match profiles"
- [ ] Write test: "mock wellness metrics present"

### 5.2b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 4 tests fail
- [ ] Commit failing tests
- [ ] Create `dashboard/src/services/mock-api.ts` with complete Mrs. Chen data
- [ ] Iterate until all 4 tests pass
- [ ] Verify mock data matches demo requirements
- [ ] Commit implementation

---

## 5.3 4-Tab Navigation - TDD

### 5.3a: WRITE TESTS
- [ ] Create `dashboard/src/App.test.tsx`
- [ ] Write test: "renders 4 tabs: Live Call, Senior Profile, Community, Analytics"
- [ ] Write test: "active tab highlighted with blue underline"
- [ ] Write test: "clicking tab switches view"
- [ ] Write test: "smooth transitions between views"

### 5.3b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 4 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/App.tsx`:
  - Headless UI Tabs component
  - 4 tab panels
  - State management for active tab
  - Smooth transitions (transition-all duration-300)
- [ ] Iterate until all 4 tests pass
- [ ] Verify responsive layout
- [ ] Commit implementation

---

## 5.4 Live Call View - TDD

### 5.4a: WRITE TESTS
- [ ] Create `dashboard/src/components/LiveCallView.test.tsx`
- [ ] Write test: "sentiment meter updates every 2 seconds"
- [ ] Write test: "color changes: green (positive), red (negative), yellow (neutral)"
- [ ] Write test: "emotion tags appear/disappear dynamically"
- [ ] Write test: "language indicator switches correctly"
- [ ] Write test: "handles connection loss gracefully"
- [ ] Write test: "current transcript snippet displays last 2 exchanges"

### 5.4b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 6 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/LiveCallView.tsx`:
  - Large sentiment meter with emoji (😊 😔 😐)
  - Animated transitions for sentiment changes
  - Real-time emotion pills (blue for happy, red for sad, etc.)
  - Pulsing "LIVE" indicator during calls
  - Language flag icons (🇺🇸 🇨🇳)
  - 2-second polling: `setInterval(() => fetchLiveSentiment(), 2000)`
  - Current transcript display
- [ ] Iterate until all 6 tests pass
- [ ] Verify visual impact and animations
- [ ] Commit implementation

---

## 5.5 Senior Profile View - TDD

### 5.5a: WRITE TESTS
- [ ] Create `dashboard/src/components/SeniorProfileView.test.tsx`
- [ ] Write test: "personal info card renders correctly"
- [ ] Write test: "memories grouped by category (family, hobbies, health)"
- [ ] Write test: "health data displays conditions, medications, vitals"
- [ ] Write test: "upcoming appointments shown prominently"
- [ ] Write test: "last call date and frequency calculated"

### 5.5b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 5 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/SeniorProfileView.tsx`:
  - **Personal Info Card**: Name, age, location, languages, phone
  - **Memories Section**: Family (with relationships), hobbies, recent events
  - **Health Overview**: Conditions, medications (with dosage), latest vitals
  - **Upcoming Appointments**: Next 2 appointments with countdown
  - **Conversation Stats**: Total calls, average duration, last call
- [ ] Iterate until all 5 tests pass
- [ ] Verify layout and readability
- [ ] Commit implementation

---

## 5.6 Community View - TDD

### 5.6a: WRITE TESTS
- [ ] Create `dashboard/src/components/CommunityView.test.tsx`
- [ ] Write test: "match cards display for top 3 matches"
- [ ] Write test: "compatibility scores render correctly (stars + percentage)"
- [ ] Write test: "shared interests highlighted"
- [ ] Write test: "group suggestions auto-generated"
- [ ] Write test: "Facilitate Connection button present (non-functional for demo)"

### 5.6b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 5 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/CommunityView.tsx`:
  - **MatchCard Component**:
    - Senior photo placeholder + name + age
    - Compatibility bar (0-100 with color gradient: green 70+, yellow 50-69)
    - Star rating (5 stars for 70+, 4 for 50-69)
    - Shared interests as blue pills
    - Cultural background and location
    - "Facilitate Connection" button (disabled for demo)
  - **Group Suggestions Section**:
    - Auto-generated group cards: "{Language} {Interest} Circle"
    - Member count (3-5 for demo)
    - Suggested meeting: "Weekly, Thursdays 2pm"
    - Language badge (🀄 Mandarin / 🇺🇸 English)
  - **Social Health Metrics**:
    - Matches made: 3
    - Community engagement score: 85/100
    - Groups joined: 2
- [ ] Iterate until all 5 tests pass
- [ ] Verify visual appeal and clarity
- [ ] Commit implementation

---

## 5.7 Analytics View - TDD

### 5.7a: WRITE TESTS
- [ ] Create `dashboard/src/components/AnalyticsView.test.tsx`
- [ ] Write test: "holistic wellness score calculation (mental 40% + physical 30% + social 30%)"
- [ ] Write test: "individual dimension scores display"
- [ ] Write test: "30-day trend graph renders"
- [ ] Write test: "call frequency heatmap shows peak hours"
- [ ] Write test: "word cloud generates from all conversations"

### 5.7b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 5 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/AnalyticsView.tsx`:
  - **Holistic Wellness Card**:
    - Large circular progress: 78/100 (combined score)
    - Breakdown: Mental 82/100, Physical 75/100, Social 85/100
    - Trend arrow (↑ improving, → stable, ↓ declining)
  - **30-Day Wellness Graph**:
    - Recharts line chart with 3 lines (mental, physical, social)
    - Combined trend line in bold
    - Annotations for significant events ("Family visit", "Started medication")
  - **Call Analytics**:
    - Total conversations: 147
    - Average duration: 8.5 minutes
    - Peak hours heatmap (2-4pm most active)
    - Language distribution pie chart
  - **Topic Word Cloud**: Top 50 words sized by frequency^0.7
- [ ] Iterate until all 5 tests pass
- [ ] Verify graph accuracy and word cloud rendering
- [ ] Commit implementation

---

## 5.8 Health Timeline Component - TDD

### 5.8a: WRITE TESTS
- [ ] Create `dashboard/src/components/HealthTimeline.test.tsx`
- [ ] Write test: "chronological list of health notes"
- [ ] Write test: "each note shows timestamp, source, natural language note"
- [ ] Write test: "structured mentions displayed as tags (symptoms red, medications green)"
- [ ] Write test: "severity indicators for symptoms (mild/moderate/severe)"
- [ ] Write test: "displays notes in chronological order"
- [ ] Write test: "shows source badge for each note"
- [ ] Write test: "highlights severity levels with icons"
- [ ] Write test: "links to MyChart portal"

### 5.8b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 8 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/HealthTimeline.tsx`:
  - Timeline with vertical line
  - Each note: timestamp, source badge, natural language text
  - Structured mentions as colored tags
  - Severity icons (⚠️ mild, ⚠️⚠️ moderate, 🚨 severe)
  - Link to MyChart portal (mock URL)
  - Chronological sorting
  - Source badges (Sam AI, Manual, Provider)
- [ ] Iterate until all 8 tests pass
- [ ] Verify timeline is readable and informative
- [ ] Commit implementation

---

## 5.9 Conversation History Component - TDD

### 5.9a: WRITE TESTS
- [ ] Create `dashboard/src/components/ConversationHistory.test.tsx`
- [ ] Write test: "list shows last 10 conversations"
- [ ] Write test: "word cloud updates with new topics"
- [ ] Write test: "wellness graph renders 30 days"
- [ ] Write test: "dates format correctly"
- [ ] Write test: "sentiment colors match values"
- [ ] Write test: "health mentions displayed in timeline"

### 5.9b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 6 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/ConversationHistory.tsx`:
  - Timeline view with dates and summaries
  - Word cloud (size = frequency^0.7)
  - Color gradient for word importance
  - Clickable conversations for details
  - Key topics as colored tags
  - Health mention badges (🔴 symptoms, 🔵 medications)
- [ ] Iterate until all 6 tests pass
- [ ] Verify interactions and animations
- [ ] Commit implementation

---

## 5.10 API Client - TDD

### 5.10a: WRITE TESTS
- [ ] Create `dashboard/src/services/api-client.test.ts`
- [ ] Write test: "fetchProfile returns SeniorProfile"
- [ ] Write test: "fetchLiveSentiment returns current sentiment"
- [ ] Write test: "handles 404 errors gracefully"
- [ ] Write test: "handles network timeout"
- [ ] Write test: "implements retry logic (max 3 attempts)"
- [ ] Write test: "caches responses for 30 seconds"

### 5.10b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 6 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/services/api-client.ts`:
  - All API endpoint functions
  - Retry logic with exponential backoff
  - React Query for caching and state management
  - Error handling with user-friendly messages
- [ ] Iterate until all 6 tests pass
- [ ] Verify error handling in UI
- [ ] Commit implementation

---

## 5.11 Switch to Real API (Hour 10 Checkpoint)
- [ ] Update API base URL to Worker production URL
- [ ] Test all 4 tabs with real data
- [ ] Add error boundaries for each tab
- [ ] Verify polling works (2-second interval)
- [ ] Check console for errors (should be 0)

---

## 5.12 Design System & Polish
- [ ] Apply design system:
  - Primary color: #457B9D (blue)
  - Secondary color: #E63946 (red accent)
  - Success color: #06D6A0 (green)
  - Compact spacing: 16px padding, 20px margins
  - Material Design shadows: shadow-md
  - Transitions: transition-all duration-300
- [ ] Responsive breakpoints: mobile-first with md: and lg:
- [ ] Test on multiple devices (desktop, tablet, mobile)
- [ ] Optimize for 1920x1080 projector display

---

## 5.13 Deployment Preparation
- [ ] Build production: `npm run build`
- [ ] Deploy to Cloudflare Pages
- [ ] Take screenshots of all 4 tabs for backup
- [ ] Create fallback static HTML version
- [ ] Test on venue projector (if possible)

---

## 5.14 Word Cloud Component - TDD

### 5.14a: WRITE TESTS
- [ ] Create `dashboard/src/components/WordCloud.test.tsx`
- [ ] Write test: "renders top 50 words"
- [ ] Write test: "sizes based on frequency"
- [ ] Write test: "updates when conversations change"
- [ ] Write test: "handles empty data gracefully"

### 5.14b-g: FOLLOW TDD WORKFLOW
- [ ] Confirm 4 tests fail
- [ ] Commit failing tests
- [ ] Implement `dashboard/src/components/WordCloud.tsx`:
  - Word rendering with dynamic sizing
  - Use frequency^0.7 for size calculation
  - Handle empty state
- [ ] Iterate until all 4 tests pass
- [ ] Verify visually
- [ ] Commit implementation

---

## Integration Test Responsibilities

### Hour 10 Health Tracking Test
- [ ] **Developer 4**: Check dashboard Health Timeline after 3 seconds
- [ ] **CRITICAL**: Health note must appear with "forgot pills" mention

### Hour 14 Full Pipeline Test
- [ ] **Developer 4**: Monitor dashboard (all 4 tabs)
- [ ] Verify all 5 success criteria work

### Hour 16 Community Matching Test
- [ ] **Developer 4**: Open dashboard Community tab
- [ ] **CRITICAL**: 3 match cards must display
- [ ] Check compatibility scores are accurate
- [ ] Check "Mandarin Gardening Circle" group suggestion appears

---

## Performance Requirements for Dashboard
- **Dashboard Update**: <2s polling interval
- **Real-time sentiment updates**: Within 2 seconds
- **Responsive design**: Mobile-first with md: and lg: breakpoints
- **Projector optimization**: 1920x1080 display
- **Error handling**: Graceful degradation for all components

---

## Test Case References

### From TDD_TEST_CASES.md:
- **Section 2.1**: Vapi Webhook Handler Tests (for API integration)
- **Section 3.1**: Health Service Tests (for health timeline)
- **Section 4.1**: Matching Service Tests (for community view)
- **Section 5.1**: Wellness Metrics Tests (for analytics view)
- **Section 10.1-10.4**: Integration Tests (for end-to-end verification)

### From PRD.md:
- **Section 4**: Functional Requirements (for UI specifications)
- **Section 5**: User Stories (for user experience requirements)
- **Section 6**: Technical Architecture (for API integration)

---

## Critical Reminders

1. **TDD is MANDATORY** - No implementation without tests first
2. **Visual Impact Matters** - Judges need to see the magic happening
3. **Real-time Updates** - Dashboard must respond within 2 seconds
4. **Error Handling** - Graceful degradation for all components
5. **Mobile Responsive** - Must work on all device sizes
6. **Projector Ready** - Optimized for 1920x1080 display

---

## Success Criteria Checklist

Before marking any task complete, verify:
- [ ] All tests written and failing initially
- [ ] Tests committed separately from implementation
- [ ] Implementation passes all tests
- [ ] Independent verification completed
- [ ] Code committed with descriptive message
- [ ] Visual impact verified
- [ ] Error handling tested
- [ ] Performance requirements met

**Remember: The dashboard is the visual proof that ElderLink works. Make it compelling!**
