# Developer Integration Timeline & Handoff Points

## Developer Roles & Responsibilities

### Developer 1: Conversation Core (60% effort)
- **Primary:** Sam personality, memory extraction, sentiment analysis, conversation helpers
- **Deliverables:** All prompts and conversation logic
- **Branch:** `feat/conversation-core`

### Developer 2: Backend API (Full-time)
- **Primary:** Worker endpoints, services (KV, health, matching, alerts, wellness)
- **Deliverables:** Complete API with all endpoints working
- **Branch:** `feat/backend-api`

### Developer 3: Voice/Phone System
- **Primary:** Vapi configuration, phone setup, voice testing, recordings
- **Deliverables:** Working phone system with proper latency
- **Branch:** `feat/voice-phone`

### Developer 4: Dashboard (40% effort)
- **Primary:** React dashboard with 4 tabs, real-time updates, visualizations
- **Deliverables:** Complete dashboard connected to API
- **Branch:** `feat/dashboard`

### Integration Lead
- **Primary:** Merge coordination, testing, checkpoint enforcement
- **Deliverables:** Successful integration at each checkpoint

---

## Critical Integration Timeline

### ⏰ Hour 0-2: Foundation Setup
**All Developers Together:**
- Set up shared repository
- Configure environment variables
- Create KV namespace
- Initialize testing framework

**Dev 2 CRITICAL DELIVERY by Hour 2:**
- [ ] Deploy Worker with `/api/health` endpoint
- [ ] Share URL with team IMMEDIATELY
- [ ] All devs verify connection

---

### ⏰ Hour 2-4: API Contract Lock

**Dev 2 + All Devs:**
- [ ] **Hour 3:** Dev 2 documents all 12 API endpoints in `docs/api-contract.md`
- [ ] **Hour 3.5:** All devs review and agree on API contract
- [ ] **Hour 4:** API CONTRACT LOCKED - no changes after this

**Dev 1 → Dev 2 Handoff:**
- [ ] Dev 1 provides prompt function signatures
- [ ] Dev 2 creates mock implementations for testing

**Dev 3 Setup:**
- [ ] Configure Vapi assistant with Dev 2's webhook URL
- [ ] Test basic call flow

**Dev 4 Setup:**
- [ ] Create mock API client matching contract
- [ ] Start dashboard with mock data

---

### ⏰ Hour 4-6: First Integration Prep

**Dev 1 → Dev 2 Integration:**
- [ ] **Hour 5:** Dev 1 delivers `generateSamResponse()` function
- [ ] **Hour 5:** Dev 2 integrates into `/vapi-webhook` handler
- [ ] **Hour 5.5:** Dev 1 + Dev 2 test together locally

**Dev 3 Testing:**
- [ ] Test phone → webhook connection
- [ ] Verify <3s latency

**Dev 4 Building:**
- [ ] Complete Live Call tab with mock data
- [ ] Prepare for real API connection

---

### ⏰ Hour 6: FIRST INTEGRATION TEST

**ALL DEVELOPERS TOGETHER:**
- [ ] Dev 3 makes phone call
- [ ] Dev 2 verifies webhook processes
- [ ] Dev 1 confirms Sam response generation
- [ ] Dev 4 checks dashboard updates
- [ ] **MUST WORK:** Phone → Webhook → Response in <3s
- [ ] If fails: 30-minute all-hands debug

---

### ⏰ Hour 6-8: Memory & Async Processing

**Dev 1 → Dev 2 Critical Integration:**
- [ ] **Hour 7:** Dev 1 delivers `extractMemories()` function
- [ ] **Hour 7:** Dev 1 delivers `analyzeSentimentAndHealth()` function
- [ ] **Hour 7.5:** Dev 2 implements async processing with `env.context.waitUntil()`
- [ ] **Hour 7.5:** Dev 2 implements KV storage for profiles

**Dev 3 Prep:**
- [ ] Prepare memory test calls
- [ ] Record backup demo #1

**Dev 4 → Dev 2 Integration:**
- [ ] **Hour 7:** Switch Live Call tab to real API
- [ ] Test sentiment polling every 2 seconds

---

### ⏰ Hour 8: CRITICAL MEMORY TEST

**Dev 1 + Dev 2 + Dev 3 TOGETHER:**
- [ ] Call 1: "My daughter Sarah visited"
- [ ] Wait 3 seconds for async
- [ ] Call 2: Sam MUST mention Sarah
- [ ] **IF FAILS:** ALL DEVS STOP AND FIX

---

### ⏰ Hour 8-10: Health Tracking

**Dev 2 Solo Work:**
- [ ] Implement health service
- [ ] Implement alert service
- [ ] Create health notes from mentions

**Dev 1 Support:**
- [ ] Verify health extraction from `analyzeSentimentAndHealth()`
- [ ] Help debug if needed

**Dev 4 → Dev 2 Integration:**
- [ ] **Hour 9:** Add Health Timeline component
- [ ] Connect to `/api/mychart` endpoint
- [ ] Test note display

---

### ⏰ Hour 10: HEALTH TRACKING TEST

**Dev 2 + Dev 3 + Dev 4 TOGETHER:**
- [ ] Call: "I forgot my pills"
- [ ] Dev 4 verifies Health Timeline updates
- [ ] Dev 2 confirms note creation
- [ ] **MUST WORK:** Health notes appear in dashboard

**Dev 4 Critical:**
- [ ] **Hour 10:** Switch ALL tabs to real API
- [ ] Remove mock data completely

---

### ⏰ Hour 10-12: Community & Language

**Dev 2 Work:**
- [ ] Implement matching service (algorithm from PRD)
- [ ] Generate group suggestions
- [ ] Initialize demo match profiles

**Dev 1 → Dev 3 Integration:**
- [ ] Test language detection
- [ ] Verify voice switching

**Dev 4 Work:**
- [ ] Complete Community tab
- [ ] Add match cards and group suggestions

---

### ⏰ Hour 12: LANGUAGE TEST

**Dev 1 + Dev 3 TOGETHER:**
- [ ] Test Mandarin input → Mandarin response
- [ ] Verify voice changes
- [ ] If fails: Document English-only fallback

---

### ⏰ Hour 12-14: Analytics & Polish

**Dev 2 Work:**
- [ ] Implement wellness metrics service
- [ ] Calculate holistic scores
- [ ] Generate word cloud data

**Dev 4 → Dev 2 Integration:**
- [ ] **Hour 13:** Connect Analytics tab
- [ ] Display wellness scores
- [ ] Render trend graphs

**Dev 1 Final:**
- [ ] Verify all conversation flows
- [ ] Test edge cases

---

### ⏰ Hour 14: FULL PIPELINE TEST

**ALL DEVELOPERS TOGETHER:**
- [ ] 3-minute conversation with ALL features
- [ ] Dev 3: Makes call with all 6 exchanges
- [ ] Dev 4: Monitors all 4 dashboard tabs
- [ ] Dev 2: Checks all API endpoints
- [ ] Dev 1: Verifies conversation quality
- [ ] **ALL 5 SUCCESS CRITERIA MUST WORK**

---

### ⏰ Hour 14-16: Community Verification

**Dev 2 Final:**
- [ ] Run match initialization script
- [ ] Verify scores calculated correctly
- [ ] Check group generation

**Dev 4 Final:**
- [ ] Polish Community tab display
- [ ] Verify compatibility scores
- [ ] Test group suggestions

---

### ⏰ Hour 16: COMMUNITY TEST

**Dev 2 + Dev 4 TOGETHER:**
- [ ] Verify 3 matches display
- [ ] Check scores: Mrs. Lee >=90, Mr. Wang >=85, Mrs. Kim >=50
- [ ] Confirm group suggestions

**Dev 3 Work:**
- [ ] Record all backup demos
- [ ] Test recordings quality

---

### ⏰ Hour 16-18: Final Integration

**Integration Lead Coordination:**
- [ ] **Hour 17:** All devs merge to `dev` branch
- [ ] **Hour 17.5:** Integration testing
- [ ] **Hour 18:** Create `release` branch

---

### ⏰ Hour 18: FEATURE FREEZE

**ALL DEVELOPERS:**
- [ ] NO NEW FEATURES after this point
- [ ] Only bug fixes allowed
- [ ] Begin demo preparation

---

### ⏰ Hour 18-20: Production Deployment

**Dev 2 Lead:**
- [ ] **Hour 19:** Deploy Worker to production
- [ ] Test all endpoints

**Dev 3 Work:**
- [ ] Update Vapi with production URL
- [ ] Test production phone calls

**Dev 4 Lead:**
- [ ] **Hour 19.5:** Build dashboard with production API
- [ ] Deploy to Cloudflare Pages

---

### ⏰ Hour 20: PRODUCTION VERIFICATION

**ALL DEVELOPERS:**
- [ ] Each dev runs full test
- [ ] Verify all 5 success criteria
- [ ] Document any issues

---

### ⏰ Hour 20-23: Demo Practice

**All Devs Together:**
- [ ] **Hour 21:** First full rehearsal
- [ ] **Hour 22:** Second rehearsal with backup plans
- [ ] **Hour 23:** Final rehearsal

---

## Developer Dependencies Map

```
Hour 0-2:  All → Setup
Hour 2:    Dev2 → All (Worker URL)
Hour 4:    All → API Contract Lock
Hour 5:    Dev1 → Dev2 (prompts)
Hour 6:    All → Integration Test
Hour 7:    Dev1 → Dev2 (analysis functions)
Hour 8:    Dev1+Dev2+Dev3 → Memory Test
Hour 9:    Dev4 → Dev2 (dashboard API)
Hour 10:   Dev2+Dev4 → Health Test
Hour 12:   Dev1+Dev3 → Language Test
Hour 13:   Dev4 → Dev2 (analytics)
Hour 14:   All → Full Pipeline Test
Hour 16:   Dev2+Dev4 → Community Test
Hour 17:   All → Dev branch merge
Hour 18:   Integration Lead → Release branch
Hour 19:   Dev2 → Production deploy
Hour 19.5: Dev4 → Dashboard deploy
Hour 20:   All → Production test
Hour 23:   All → Final rehearsal
```

## Critical Handoff Checklist

### Dev 1 → Dev 2 Handoffs:
- [ ] Hour 5: `generateSamResponse()` function
- [ ] Hour 7: `extractMemories()` function
- [ ] Hour 7: `analyzeSentimentAndHealth()` function

### Dev 2 → Dev 3 Handoffs:
- [ ] Hour 2: Worker webhook URL
- [ ] Hour 19: Production webhook URL

### Dev 2 → Dev 4 Handoffs:
- [ ] Hour 4: API contract documentation
- [ ] Hour 9: Health endpoints ready
- [ ] Hour 13: Analytics endpoints ready

### Dev 3 → All Handoffs:
- [ ] Hour 2: Phone number shared
- [ ] Hour 6: Call testing availability
- [ ] Hour 16: Backup recordings ready

### Dev 4 → Dev 2 Dependencies:
- [ ] Hour 7: Need live sentiment endpoint
- [ ] Hour 9: Need health data endpoint
- [ ] Hour 13: Need analytics endpoint
- [ ] Hour 15: Need matches endpoint

## If Behind Schedule

### Can Parallelize:
- Dev 1 prompts + Dev 2 API structure
- Dev 3 phone setup + Dev 4 dashboard mockup
- Health service + Matching service

### Cannot Skip:
- Hour 2: Worker deployment
- Hour 4: API contract lock
- Hour 8: Memory test
- Hour 10: Health test
- Hour 18: Feature freeze

### Emergency Shortcuts:
- Skip language switching (Hour 12)
- Simplify analytics (Hour 13)
- Use pre-calculated matches (Hour 14)
- Use static wellness scores (Hour 15)

---

## Success Criteria Owner Map

1. **Memory** (Dev 1 + Dev 2): Sam remembers previous conversations
2. **Natural Conversation** (Dev 1): 2-3 minute warm conversation
3. **Health Tracking** (Dev 1 + Dev 2 + Dev 4): MyChart notes created
4. **Real-time Sentiment** (Dev 2 + Dev 4): Dashboard updates live
5. **Community Matching** (Dev 2 + Dev 4): 3 matches displayed

Each developer OWNS their success criteria and must ensure it works at demo time.