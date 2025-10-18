# ElderLink AI Companion - Implementation Task List

## Critical Success Metrics
1. ✅ Sam remembers Mrs. Chen and references previous conversations
2. ✅ Natural, warm conversation lasting 2-3 minutes without sounding robotic
3. ✅ Dashboard shows real-time sentiment changes during calls
4. ✅ Seamless English/Mandarin language switching
5. ✅ Wellness improvement trend visible over 30 days

## Effort Distribution
- **Developer 1**: 60% effort on conversation quality (critical differentiator)
- **Developer 2**: Backend orchestration and modular prompt integration
- **Developer 3**: Voice optimization and phone system reliability
- **Developer 4**: 40% effort on dashboard (visual impact for judges)

## Relevant Files

### Developer 1 - Conversation & Prompts (60% EFFORT FOCUS)
- `prompts/sam-personality.ts` - Core personality and response generation prompts
- `prompts/sam-personality.test.ts` - Tests for Sam's personality responses
- `prompts/memory-extraction.ts` - Extract and store memories from conversations
- `prompts/memory-extraction.test.ts` - Tests for memory extraction logic
- `prompts/sentiment-analysis.ts` - Analyze emotional state and wellness
- `prompts/sentiment-analysis.test.ts` - Tests for sentiment analysis
- `prompts/language-detection.ts` - Detect language from senior's speech
- `prompts/reminiscence-therapy.ts` - Elderly-friendly conversation techniques
- `utils/conversation-helpers.ts` - Language detection and conversation utilities
- `utils/conversation-helpers.test.ts` - Tests for conversation helpers
- `utils/fallback-topics.ts` - Topic rotation system for conversation stalls
- `data/mrs-chen-profile.json` - Pre-seeded demo profile data with full transcripts
- `data/fallback-responses.json` - Emergency fallback responses (10+ variations)
- `data/escalation-keywords.json` - Crisis detection keywords by category

### Developer 2 - Backend Infrastructure
- `src/index.ts` - Main Cloudflare Worker entry point with modular architecture
- `src/index.test.ts` - Worker endpoint integration tests
- `src/handlers/vapi-webhook.ts` - Handle Vapi webhooks with 8-second timeout
- `src/handlers/vapi-webhook.test.ts` - Webhook handler tests including timeout scenarios
- `src/handlers/api-handlers.ts` - Dashboard API endpoints (senior profile, sentiment, analytics)
- `src/services/gemini-service.ts` - Three modular Gemini API calls (memory, response, sentiment)
- `src/services/gemini-service.test.ts` - Gemini service tests with fallback logic
- `src/services/kv-service.ts` - Cloudflare KV storage with 10-conversation limit
- `src/services/kv-service.test.ts` - KV storage tests including TTL verification
- `src/services/alert-service.ts` - Crisis escalation and alert creation
- `src/middleware/cors.ts` - CORS headers middleware
- `src/middleware/cors.test.ts` - CORS middleware tests
- `wrangler.toml` - Cloudflare Worker configuration with KV namespace binding

### Developer 3 - Voice & Phone System
- `vapi/assistant-config.json` - Vapi assistant configuration with custom LLM
- `vapi/voice-settings.json` - ElevenLabs voice configurations (stability: 0.7, similarity_boost: 0.8)
- `scripts/init-vapi.ts` - Initialize Vapi phone assistant with proper timeouts
- `scripts/test-webhook.ts` - Test webhook integration (<8 second response)
- `scripts/test-language.ts` - Test language switching with voice changes
- `scripts/test-latency.ts` - Measure and optimize response times
- `recordings/backup-demo-1.mp3` - Memory demonstration recording
- `recordings/backup-demo-2.mp3` - Language switching recording
- `recordings/backup-demo-3.mp3` - Emotional support recording
- `recordings/demo-script.md` - Exact 2-minute demo script

### Developer 4 - Dashboard (40% EFFORT FOCUS)
- `dashboard/src/components/LiveCallView.tsx` - Real-time call monitoring with 2-second polling
- `dashboard/src/components/LiveCallView.test.tsx` - Live call view tests
- `dashboard/src/components/ConversationHistory.tsx` - Historical conversations with word cloud
- `dashboard/src/components/ConversationHistory.test.tsx` - History component tests
- `dashboard/src/components/AnalyticsOverview.tsx` - Total conversations, sentiment improvement, peak hours
- `dashboard/src/components/SentimentMeter.tsx` - Animated sentiment visualization (-1 to +1)
- `dashboard/src/components/WordCloud.tsx` - Topic word cloud with frequency-based sizing
- `dashboard/src/components/WellnessGraph.tsx` - 30-day wellness trend line chart
- `dashboard/src/services/api-client.ts` - Backend API communication with retry logic
- `dashboard/src/services/mock-api.ts` - Mock API with complete Mrs. Chen data

### Integration & Shared
- `scripts/init-demo-data.ts` - Initialize Mrs. Chen with 5 pre-seeded conversations
- `scripts/integration-tests/memory-test.ts` - Hour 8 critical memory test
- `scripts/integration-tests/language-test.ts` - Hour 12 language switching test
- `scripts/integration-tests/full-flow-test.ts` - Hour 14 complete pipeline test
- `.env.example` - Environment variables template with all required keys
- `docs/api-contract.md` - API endpoints documentation (locked at Hour 4)
- `docs/demo-backup-plans.md` - Failure scenarios and recovery procedures

### Notes
- Unit tests should be placed alongside implementation files using `.test.ts` extension
- Use TDD approach: write tests first, confirm they fail, then implement
- Integration tests occur at Hours 6, 8, 12, and 16
- Feature freeze at Hour 16 - only bug fixes after this point
- Use `npx jest [path/to/test]` to run specific tests
- Modular prompts allow easier debugging than mega-prompts

## Tasks

- [ ] 1.0 Initialize Project Infrastructure and Environment
  - [ ] 1.1 Create project repository with branch structure (main, dev, feat/conversation-core, feat/backend-api, feat/voice-phone, feat/dashboard)
  - [ ] 1.2 Set up shared environment variables file with all API keys and configuration values from PRD Section 10 and Addendum
  - [ ] 1.3 Create Cloudflare KV namespace using `wrangler kv:namespace create "ELDERLINK_KV"` and share ID with team immediately
  - [ ] 1.4 Initialize package.json with required dependencies (typescript, jest, @cloudflare/workers-types, vite, react, recharts, tailwindcss)
  - [ ] 1.5 Configure TypeScript with strict mode and Jest with ts-jest for TDD approach
  - [ ] 1.6 Designate Integration Lead (responsible for merge timing) and set 2-hour checkpoint schedule
  - [ ] 1.7 Create team communication channel (Discord/Slack) and share critical URLs/credentials in pinned message
  - [ ] 1.8 Set up Git hooks for pre-commit testing to catch issues early
  - [ ] 1.9 Create shared Postman/Insomnia collection for API testing
  - [ ] 1.10 Initialize error tracking with console.error wrapper for production debugging

- [ ] 2.0 Build Core AI Conversation System (Developer 1 - 60% EFFORT)
  - [ ] 2.1 Write comprehensive tests for Sam personality module including:
    - Warm greeting variations ("Hi Mrs. Chen!" not "Hello user")
    - Memory reference patterns ("How is Sarah?" not generic questions)
    - Energy level matching (calm vs energetic based on senior's mood)
    - Language switching mid-conversation
    - Patience with long pauses (never rushing)
  - [ ] 2.2 Implement SAM_RESPONSE_PROMPT from PRD lines 426-473 with:
    - Personality traits: warm, patient, good_listener, empathetic
    - Adaptive traits: energy level, formality, conversation pace
    - 2-3 sentence response limit for natural flow
    - Reference to previous conversations in first response
    - Slightly ambiguous about being AI (never explicitly state it)
  - [ ] 2.3 Write tests for memory extraction including:
    - Family member detection with relationships and details
    - Hobbies and interests categorization
    - Health concerns without medical advice
    - Recent events temporal tracking
    - Duplicate prevention (don't re-extract known facts)
  - [ ] 2.4 Implement MEMORY_EXTRACTION_PROMPT (PRD lines 394-423) with:
    - JSON output structure matching SeniorProfile interface
    - Extraction of family names, relationships, and details arrays
    - Categorization into family, hobbies, health, recentEvents, preferences
    - Empty array returns when no new information
  - [ ] 2.5 Write tests for sentiment analysis including:
    - Sentiment score calculation (-1 to +1)
    - Emotion array detection (happy, sad, lonely, anxious, content)
    - Concern flag generation (medical, crisis, depression)
    - Wellness indicator tracking (socialConnection, mood, engagement)
    - Escalation severity levels (low, medium, high)
  - [ ] 2.6 Implement SENTIMENT_ANALYSIS_PROMPT (PRD lines 476-507) with:
    - Real-time sentiment scoring
    - Multiple emotion detection
    - Escalation keywords from PRD line 237-241
    - Wellness indicators as separate metrics
    - JSON response format for dashboard consumption
  - [ ] 2.7 Create comprehensive fallback system:
    - 10+ fallback responses for timeouts (PRD line 723-729)
    - Fallback topics for conversation stalls (PRD line 254-262)
    - Reminiscence therapy prompts (childhood, cooking, hometown)
    - Active listening reflections
    - Weather and seasonal conversation starters
  - [ ] 2.8 Build conversation helpers with:
    - Language detection returning only "english" or "mandarin"
    - Energy level extraction from conversation tone
    - Topic rotation to avoid repetition
    - Conversation pace detection (slow vs normal)
  - [ ] 2.9 Complete Mrs. Chen profile with all 5 conversations from PRD lines 1382-1446:
    - Sept 20: First call about family and garden (sentiment: 0.3)
    - Sept 27: Shanghai memories and piano (sentiment: 0.5)
    - Oct 5: Health worries and arthritis (sentiment: 0.2)
    - Oct 12: Happy family visit (sentiment: 0.7)
    - Oct 17: Garden progress (sentiment: 0.6)
    - Include full transcript snippets for each conversation
  - [ ] 2.10 Polish and optimize prompts through Hour 6:
    - Test with team members role-playing as seniors
    - Adjust warmth and empathy levels
    - Ensure no robotic responses
    - Verify memory references feel natural
    - Merge to dev branch at Hour 6 checkpoint

- [ ] 3.0 Implement Backend API and Services (Developer 2)
  - [ ] 3.1 Initialize Cloudflare Worker with wrangler:
    - Configure KV namespace binding from team-shared ID
    - Set up environment variables for all API keys
    - Configure production and development environments
    - Set up wrangler.toml with proper account ID
  - [ ] 3.2 Write and implement CORS middleware:
    - Add Access-Control-Allow-Origin: * for dashboard
    - Include OPTIONS preflight handling
    - Apply to all endpoints consistently
    - Test with dashboard origin
  - [ ] 3.3 Create API endpoints by Hour 2:
    - `/api/health` - Returns {"status": "ok", "timestamp": ISO}
    - `/vapi-webhook` - Main webhook handler (POST only)
    - `/api/senior/mrs-chen` - Get senior profile (GET)
    - `/api/sentiment/live` - Get real-time sentiment (GET)
    - `/api/analytics` - Get aggregate analytics (GET)
    - `/api/init-demo` - Initialize demo data (POST)
    - Deploy to dev environment and share URL immediately
  - [ ] 3.4 Write comprehensive Vapi webhook tests:
    - Empty message handling returns "I'm here. Take your time."
    - 8-second timeout handling (PRD line 1519-1534)
    - Voice ID selection based on language
    - Conversation history parsing
    - Error fallback to safe response
  - [ ] 3.5 Implement webhook handler with critical timeout logic:
    - Set up Promise.race with 8-second timeout (Vapi times out at 10)
    - Parse Vapi message format: message.transcript?.content
    - Extract conversation history from message.conversationHistory
    - Return format: {"content": response, "voiceId": elevenlabs_id}
    - Handle empty/null messages gracefully
  - [ ] 3.6 Lock API contract at Hour 4:
    - Document all endpoints in api-contract.md
    - No changes to endpoint paths or response formats after this
    - Share contract with all developers
    - Create Postman collection for testing
  - [ ] 3.7 Implement KV service with constraints:
    - 10 conversation limit (shift oldest when exceeded)
    - 5-minute TTL for live sentiment (expirationTtl: 300)
    - Profile structure matching PRD SeniorProfile interface
    - Atomic updates to prevent race conditions
    - Get/Put/Delete operations with error handling
  - [ ] 3.8 Build modular Gemini service (3 separate calls):
    - Memory extraction with 7-second timeout
    - Response generation with temperature 0.7, max tokens 200
    - Sentiment analysis with structured JSON output
    - Fallback to emergency responses on timeout
    - Retry logic with exponential backoff
  - [ ] 3.9 Integrate Developer 1's prompts:
    - Import all prompt templates
    - Pass correct variables to each prompt
    - Handle prompt responses appropriately
    - Update profile after each interaction
  - [ ] 3.10 Execute Hour 8 memory test:
    - Coordinate with Developer 3 for phone calls
    - Verify memory persists between calls
    - Debug any memory reference failures
    - If fails: STOP all development until fixed

- [ ] 4.0 Configure Voice and Phone System (Developer 3)
  - [ ] 4.1 Purchase and configure Vapi phone:
    - Buy 206 (Seattle) area code number (~$2/month)
    - Share number with team in channel immediately
    - Note exact format: +1-206-XXX-XXXX
    - Enable call recording for backup demos
  - [ ] 4.2 Create Vapi assistant configuration:
    - Name: "Sam Companion"
    - Provider: Custom LLM
    - URL: https://elderlink-dev.[username].workers.dev/vapi-webhook
    - Model: custom
    - Temperature: 0.7
    - Max Tokens: 150 (keep responses short)
    - Request Timeout: 10 seconds (CRITICAL)
    - First Message: "Hello! This is Sam. Who am I speaking with today?"
  - [ ] 4.3 Configure ElevenLabs voices precisely:
    - English Voice ID: EXAVITQu4vr4xnSDxMaL ("Sarah" voice)
    - Mandarin Voice ID: FGY2WhTYpPnrIDTdsKH5 ("Zhang" voice)
    - Model: eleven_monolingual_v1
    - Stability: 0.7 (natural variation)
    - Similarity Boost: 0.8 (voice consistency)
    - Style: 0.5 (balanced expression)
  - [ ] 4.4 Configure voice settings for elderly-friendly audio:
    - Clear pronunciation emphasis
    - Slightly slower speech rate
    - Warm, patient tone
    - Test with team members using phone speaker
  - [ ] 4.5 Test basic call flow by Hour 3:
    - Call number and hear Sam's greeting
    - Verify voice sounds warm, not robotic
    - Check audio quality on speakerphone
    - Confirm no echo or feedback issues
  - [ ] 4.6 Create webhook testing utilities:
    - Script to measure response times
    - Verify all responses under 8 seconds
    - Test with various message lengths
    - Log any timeout occurrences
  - [ ] 4.7 Configure Deepgram transcription:
    - Model: nova-2
    - Language: en-US (auto-detects Mandarin)
    - Punctuation: true
    - Profanity filter: false
    - Test with accented English
  - [ ] 4.8 Participate in integration tests:
    - Hour 6: Basic flow test
    - Hour 8: Memory continuity (CRITICAL)
    - Hour 12: Language switching
    - Hour 14: Full pipeline
  - [ ] 4.9 Record backup demos (each 2-3 minutes):
    - Demo 1: Memory - Sam remembers Sarah and tomatoes
    - Demo 2: Language - Seamless Mandarin switching
    - Demo 3: Emotional - Handling loneliness with empathy
    - Save as MP3 with clear audio quality
  - [ ] 4.10 Optimize for demo conditions:
    - Test in noisy environment
    - Optimize for 2-3 minute conversations
    - Ensure consistent connection
    - Practice handoff to dashboard team

- [ ] 5.0 Develop Dashboard Interface (Developer 4 - 40% EFFORT)
  - [ ] 5.1 Initialize React project with full stack:
    - Vite for fast development builds
    - TypeScript with strict mode
    - Tailwind CSS for rapid styling
    - Recharts for wellness graphs
    - React Query for API state management
  - [ ] 5.2 Create comprehensive mock API:
    - Full Mrs. Chen profile from PRD
    - Simulated sentiment changes over time
    - Word frequency data for cloud
    - 5 conversation histories with transcripts
    - Wellness metrics with improving trend
  - [ ] 5.3 Write LiveCallView tests:
    - Sentiment meter updates every 2 seconds
    - Color changes: green (positive), red (negative), yellow (neutral)
    - Emotion tags appear/disappear dynamically
    - Language indicator switches correctly
    - Handles connection loss gracefully
  - [ ] 5.4 Implement LiveCallView with visual impact:
    - Large sentiment meter with emoji indicators (😊 😔 😐)
    - Animated transitions for sentiment changes
    - Real-time emotion pills with colors
    - Pulsing "LIVE" indicator during calls
    - Language flag icons (US/CN)
    - 2-second polling interval for responsiveness
  - [ ] 5.5 Write ConversationHistory tests:
    - List shows last 10 conversations
    - Word cloud updates with new topics
    - Wellness graph renders 30 days
    - Dates format correctly
    - Sentiment colors match values
  - [ ] 5.6 Build ConversationHistory components:
    - Timeline view with dates and summaries
    - Word cloud with size = frequency^0.7 (visual balance)
    - Color gradient for word importance
    - Clickable conversations for details
    - Key topics as colored tags
  - [ ] 5.7 Create wellness visualization:
    - Line chart showing 30-day sentiment trend
    - Y-axis: -1 to +1 with 0 centerline
    - Trend line with smoothing
    - Annotations for significant events
    - "42% improvement" callout box
  - [ ] 5.8 Build AnalyticsOverview component:
    - Total conversations counter (animate to 147)
    - Average sentiment improvement (+0.42)
    - Peak calling hours heatmap
    - Language distribution pie chart
    - Top 5 topics discussed
  - [ ] 5.9 Switch to real API at Hour 10:
    - Update endpoints to worker URL
    - Add error boundaries
    - Implement retry logic
    - Cache responses appropriately
    - Verify all data flows work
  - [ ] 5.10 Prepare for demo:
    - Deploy to Cloudflare Pages
    - Take screenshots of all views
    - Create fallback static HTML version
    - Test on multiple devices
    - Optimize for projector display

- [ ] 6.0 Integration Testing and Demo Preparation
  - [ ] 6.1 Hour 6 Integration Test:
    - Phone call triggers webhook
    - Webhook processes in <8 seconds
    - Response speaks through phone
    - Dashboard shows call is live
    - Basic conversation flow works
  - [ ] 6.2 Hour 8 CRITICAL Memory Test:
    - Call 1: Say "My daughter Sarah visited with Tommy"
    - Hang up after response
    - Call 2: Sam must say something about Sarah or Tommy
    - Verify dashboard shows both calls
    - If fails: ALL STOP until fixed
  - [ ] 6.3 Hour 12 Language Test:
    - Start call in English
    - Say: "我今天有点累" (I'm tired today)
    - Sam responds in Mandarin
    - Voice changes to Mandarin voice
    - Dashboard shows language switch
  - [ ] 6.4 Hour 14 Full Pipeline Test:
    - 3-minute conversation with all features
    - Memory references work
    - Sentiment tracking accurate
    - Language switching smooth
    - Dashboard updates throughout
  - [ ] 6.5 Initialize production data:
    - Run init-demo-data.ts script
    - Verify Mrs. Chen profile loaded
    - Check 5 conversations present
    - Confirm wellness metrics calculated
    - Test data retrieval
  - [ ] 6.6 Practice demo script (2 minutes):
    - 0:00-0:15 Problem statement with photo
    - 0:15-0:30 Solution introduction
    - 0:30-1:00 Live call demonstration
    - 1:00-1:20 Dashboard showcase
    - 1:20-1:40 Language switching
    - 1:40-2:00 Impact statement
  - [ ] 6.7 Prepare backup materials:
    - 3 recorded conversations ready
    - Dashboard screenshots printed
    - Architecture diagram visible
    - Phone on airplane mode after demo
  - [ ] 6.8 Test failure scenarios:
    - Practice switching to recordings
    - Have backup phone ready
    - Static dashboard prepared
    - Team knows hand signals
  - [ ] 6.9 Logistics preparation:
    - Charge all devices to 100%
    - Backup battery packs ready
    - Test venue acoustics
    - Position team strategically
  - [ ] 6.10 Final briefing:
    - Assign roles (speaker, phone, dashboard, backup)
    - Review timing and transitions
    - Practice failure recovery
    - Confirm everyone knows escalation

- [ ] 7.0 Production Deployment and Final Testing
  - [ ] 7.1 Deploy Worker to production:
    - Run `wrangler deploy --env production`
    - Verify KV namespace connected
    - Check environment variables loaded
    - Test health endpoint publicly
    - Note exact production URL
  - [ ] 7.2 Update Vapi configuration:
    - Change webhook URL to production
    - Test with single call
    - Verify response times acceptable
    - Confirm voices working
  - [ ] 7.3 Deploy dashboard:
    - Build with production API URL
    - Deploy to Cloudflare Pages
    - Test from multiple browsers
    - Verify mobile responsive
    - Share public URL with judges
  - [ ] 7.4 Phone system verification:
    - Test from 3 different phones
    - Verify number is callable
    - Check voice quality
    - Confirm no dropouts
  - [ ] 7.5 End-to-end testing (3 times):
    - Complete demo flow
    - Each team member tests once
    - Document any issues
    - Time each run
  - [ ] 7.6 Sentiment accuracy check:
    - Say happy things → positive sentiment
    - Express sadness → negative sentiment
    - Neutral talk → near zero
    - Verify meter responds quickly
  - [ ] 7.7 Language testing:
    - English greeting → English response
    - Mandarin phrase → Mandarin response
    - Mixed conversation → appropriate switching
    - Voice changes confirmed
  - [ ] 7.8 Dashboard verification:
    - Wellness graph shows trend
    - Word cloud generates properly
    - Analytics numbers display
    - No console errors
  - [ ] 7.9 Issue documentation:
    - Log any bugs found
    - Note workarounds
    - Share with team
    - Prioritize fixes
  - [ ] 7.10 Hour 23 final rehearsal:
    - Full demo run-through
    - Everyone in position
    - Devices ready
    - Confidence high

## Critical Dependencies & Checkpoints

### Hour 2 - Foundation
- Dev 2 must deploy Worker with health check endpoint
- Share URL with entire team immediately
- All developers test connection

### Hour 4 - API Lock
- API contract locked - no changes to endpoints after this
- All developers must update their code to match contract
- Integration lead verifies alignment

### Hour 6 - First Integration
- Phone → Webhook → Prompts → Response chain works
- If fails: 30-minute all-hands debug session
- Must work before proceeding

### Hour 8 - CRITICAL MEMORY TEST
- Memory continuity test MUST pass
- If fails: ALL developers stop and fix
- This is the core differentiator - cannot fail

### Hour 12 - Language Test
- Language switching demonstration
- If fails: Fallback to English-only demo
- Document decision in team channel

### Hour 14 - Full Pipeline
- Complete flow with all features
- Last chance for major fixes
- Focus on demo-critical features only

### Hour 16 - FEATURE FREEZE
- Merge everything to release branch
- Only bug fixes allowed after this
- No new features regardless of how small

### Hour 20 - Production
- Everything deployed to production
- All public URLs verified working
- Begin demo practice runs

### Hour 23 - Final Rehearsal
- Complete demo run-through
- All backup plans ready
- Team confident and prepared

## Success Criteria

1. **Must Work**: Sam remembers Mrs. Chen and references previous conversations
2. **Must Work**: Natural, warm conversation that doesn't sound robotic
3. **Must Work**: Dashboard shows real-time sentiment changes
4. **Should Work**: Language switching between English and Mandarin
5. **Nice to Have**: Multiple emotion detection and complex topics

## Environment Variables Required

```bash
# API Keys (GET THESE BEFORE HACKATHON)
GEMINI_API_KEY=              # From Google Cloud Console
ELEVENLABS_API_KEY=          # From ElevenLabs dashboard
VAPI_API_KEY=                # From Vapi dashboard

# Voice Configuration
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL    # "Sarah" voice
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5   # "Zhang" voice

# Infrastructure
VAPI_PHONE_NUMBER=+12065551234     # Purchased 206 number
CLOUDFLARE_ACCOUNT_ID=             # From Cloudflare dashboard
CLOUDFLARE_API_TOKEN=              # For deployments
KV_NAMESPACE_ID=                   # From wrangler command
KV_NAMESPACE_PREVIEW_ID=           # For development

# URLs
WORKER_URL_DEV=https://elderlink-dev.[username].workers.dev
WORKER_URL_PROD=https://elderlink.[username].workers.dev
VITE_API_BASE=                     # Same as WORKER_URL for environment

# Timeouts (CRITICAL)
VAPI_TIMEOUT_MS=10000              # Vapi times out at 10 seconds
WORKER_TIMEOUT_MS=8000             # Must respond before Vapi timeout
GEMINI_TIMEOUT_MS=7000             # Leave buffer for processing
```

## Integration Lead Responsibilities

The Integration Lead (designated at Hour 0) is responsible for:

1. **Merge Timing**: Coordinating when each developer merges to dev
2. **Checkpoint Enforcement**: Running tests at Hours 2, 4, 6, 8, 12, 14, 16
3. **Conflict Resolution**: Mediating integration conflicts
4. **Go/No-Go Decisions**: Making calls on feature cuts if behind schedule
5. **Demo Coordination**: Ensuring all pieces work together for demo
6. **Emergency Response**: Leading debug sessions when integration fails

## Backup Plans

### If Live Call Fails
1. Play Recording #1 showing memory feature
2. Explain "Earlier today, Mrs. Chen called Sam..."
3. Show dashboard updating with pre-recorded data

### If Dashboard Fails
1. Show screenshots on phone
2. Explain what would be visible
3. Focus on conversation quality

### If Everything Fails
1. Show architecture diagram
2. Walk through the concept
3. Emphasize social impact
4. Show code quality

## Remember

**The heart of this project is Sam's personality and memory.** Everything else supports showcasing this core innovation. If you must choose where to spend time, prioritize:

1. Conversation quality and warmth
2. Memory continuity between calls
3. Visual demonstration of impact

Sam is not a chatbot. Sam is a companion.