## Relevant Files

### Developer 1 - Conversation & Prompts
- `prompts/sam-personality.ts` - Core personality and response generation prompts
- `prompts/sam-personality.test.ts` - Tests for prompt generation
- `prompts/memory-extraction.ts` - Memory extraction from conversations  
- `prompts/memory-extraction.test.ts` - Tests for memory extraction
- `prompts/sentiment-analysis.ts` - Sentiment analysis prompts
- `prompts/sentiment-analysis.test.ts` - Tests for sentiment analysis
- `utils/conversation-helpers.ts` - Helper functions for conversation flow
- `utils/conversation-helpers.test.ts` - Tests for conversation helpers
- `data/mrs-chen-profile.json` - Mrs. Chen's complete profile and conversation history
- `data/fallback-responses.json` - Emergency fallback responses

### Developer 2 - Backend Integration
- `src/index.ts` - Main Cloudflare Worker entry point
- `src/index.test.ts` - Worker endpoint tests
- `src/handlers/vapi-webhook.ts` - Vapi webhook handler
- `src/handlers/vapi-webhook.test.ts` - Webhook handler tests
- `src/services/gemini-service.ts` - Gemini API integration
- `src/services/gemini-service.test.ts` - Gemini service tests
- `src/services/kv-service.ts` - KV storage operations
- `src/services/kv-service.test.ts` - KV service tests
- `src/middleware/cors.ts` - CORS middleware
- `src/middleware/cors.test.ts` - CORS middleware tests
- `src/types/index.ts` - TypeScript interfaces

### Developer 3 - Voice & Phone System
- `config/vapi-assistant.json` - Vapi assistant configuration
- `config/elevenlabs-voices.json` - Voice configuration
- `scripts/init-vapi.ts` - Vapi initialization script
- `scripts/init-vapi.test.ts` - Tests for Vapi setup
- `scripts/test-phone-call.ts` - Phone call testing utility
- `scripts/test-phone-call.test.ts` - Tests for phone testing
- `scripts/test-language-switch.ts` - Language switching test utility
- `docs/vapi-setup.md` - Detailed Vapi configuration guide

### Developer 4 - Dashboard
- `dashboard/src/components/LiveCallView.tsx` - Real-time call monitoring
- `dashboard/src/components/LiveCallView.test.tsx` - Live call view tests
- `dashboard/src/components/ConversationHistory.tsx` - Conversation history display
- `dashboard/src/components/ConversationHistory.test.tsx` - History component tests
- `dashboard/src/components/SentimentMeter.tsx` - Sentiment visualization
- `dashboard/src/components/SentimentMeter.test.tsx` - Sentiment meter tests
- `dashboard/src/components/WordCloud.tsx` - Topic word cloud
- `dashboard/src/components/WordCloud.test.tsx` - Word cloud tests
- `dashboard/src/services/api-client.ts` - API client for backend
- `dashboard/src/services/api-client.test.ts` - API client tests
- `dashboard/src/services/mock-api.ts` - Mock API for parallel development

### Shared/Integration
- `scripts/init-demo-data.ts` - Mrs. Chen profile initialization
- `scripts/init-demo-data.test.ts` - Demo data initialization tests
- `.env.example` - Environment variables template
- `wrangler.toml` - Cloudflare Worker configuration
- `integration-tests/memory-test.ts` - Hour 8 memory integration test
- `integration-tests/language-test.ts` - Hour 12 language integration test
- `integration-tests/end-to-end.test.ts` - Full system integration tests

### Notes

- All tests follow TDD principles - write tests first, confirm they fail, then implement
- Tests should be co-located with their implementation files
- Use `npx jest [path/to/test]` for running specific tests
- Integration tests run at designated merge points (Hours 6, 8, 10, 12, 14)
- Each developer commits tests before implementation

## Tasks

- [ ] 1.0 **Developer 1: Core Conversation System** (Hours 1-6)
  - [ ] 1.1 **Hour 1: Write Sam personality prompt tests** - Create tests for `sam-personality.test.ts` with expected inputs (senior messages, profile data) and outputs (warm, personalized responses). Test cases: first greeting, remembering family, adapting energy level, handling sadness
  - [ ] 1.2 **Hour 2: Implement Sam personality prompts** - Write `sam-personality.ts` implementing the prompt template from PRD Section 7. Include personality traits, memory references, elderly-friendly techniques. Commit when tests pass
  - [ ] 1.3 **Hour 3: Write memory extraction tests** - Create tests for extracting family names, hobbies, health issues from conversations. Test input: "My daughter Sarah visited yesterday" → Expected output: `{family: [{name: "Sarah", relationship: "daughter", details: ["visited yesterday"]}]}`
  - [ ] 1.4 **Hour 4: Implement memory extraction logic** - Build `memory-extraction.ts` with Gemini prompt for parsing conversations. Handle edge cases like multiple facts in one sentence. Run tests until all pass
  - [ ] 1.5 **Hour 5: Write sentiment analysis tests** - Test cases: happy statement → positive sentiment (0.7), sad statement → negative (-0.5), medical emergency → high severity flag. Include emotion detection tests
  - [ ] 1.6 **Hour 6: Implement sentiment analysis** - Create `sentiment-analysis.ts` with prompt for analyzing emotional states. Include concern detection logic. Merge to dev branch for Hour 6 integration test

- [ ] 2.0 **Developer 2: Backend Infrastructure** (Hours 1-8)
  - [ ] 2.1 **Hour 1: Set up Cloudflare Worker project** - Initialize with `wrangler init`, configure `wrangler.toml` with KV namespace binding, environment variables. Create basic health check endpoint `/api/health`
  - [ ] 2.2 **Hour 2: Write CORS middleware tests** - Test CORS headers for OPTIONS preflight, GET/POST requests. Expected headers: `Access-Control-Allow-Origin: *`, proper methods/headers. Deploy basic Worker to shared dev environment
  - [ ] 2.3 **Hour 3: Write Vapi webhook handler tests** - Test webhook receives Vapi format request, returns proper response format `{content: string, voiceId?: string}`, handles 8-second timeout race condition
  - [ ] 2.4 **Hour 4: Implement webhook handler** - Build `/vapi-webhook` endpoint with timeout handling, parse Vapi request, prepare for Gemini integration. Lock API contract and share with team
  - [ ] 2.5 **Hour 5: Write KV service tests** - Test senior profile CRUD operations, conversation history storage (last 10), sentiment updates with TTL. Mock KV for testing
  - [ ] 2.6 **Hour 6: Implement KV service** - Create `kv-service.ts` with methods: `getSeniorProfile()`, `updateConversation()`, `storeLiveSentiment()`. Integration test with Dev 1's prompts
  - [ ] 2.7 **Hour 7: Write Gemini service tests** - Test API calls with retry logic, fallback responses on failure, 8-second timeout handling
  - [ ] 2.8 **Hour 8: Complete Gemini integration** - Connect all three modular prompts (memory, response, sentiment), implement fallback logic. Run Hour 8 memory test - must pass

- [ ] 3.0 **Developer 3: Voice & Phone Setup** (Hours 1-8)
  - [ ] 3.1 **Hour 1: Create Vapi account and get phone number** - Purchase 206 area code number, note phone number in team chat, add to `.env` file
  - [ ] 3.2 **Hour 2: Write Vapi configuration tests** - Test assistant settings match PRD specifications, webhook URL correct, timeout set to 10 seconds
  - [ ] 3.3 **Hour 3: Configure Sam assistant in Vapi** - Set up Custom LLM with Dev 2's Worker URL, configure ElevenLabs voice (English), set first message, test basic call
  - [ ] 3.4 **Hour 4: Write voice configuration tests** - Test English voice ID correct, Mandarin voice ID configured, voice settings (stability: 0.7, similarity: 0.8)
  - [ ] 3.5 **Hour 5: Configure multilingual voices** - Add Mandarin voice to Vapi, test voice quality, document voice IDs in config file
  - [ ] 3.6 **Hour 6: Create phone testing utility** - Build `test-phone-call.ts` script for automated testing, verify webhook receives calls, response plays through phone
  - [ ] 3.7 **Hour 7: Write language switching tests** - Test detecting Mandarin triggers voice change, response uses correct voice ID
  - [ ] 3.8 **Hour 8: Complete phone system integration** - Full test: call → webhook → Gemini → response → correct voice. Participate in Hour 8 memory test

- [ ] 4.0 **Developer 4: Dashboard Foundation** (Hours 1-8)
  - [ ] 4.1 **Hour 1: Initialize React project** - Create with Vite, install Tailwind, Recharts, React Router. Set up basic project structure
  - [ ] 4.2 **Hour 2: Write mock API service** - Create `mock-api.ts` with Mrs. Chen data, sentiment responses, allows parallel development without backend
  - [ ] 4.3 **Hour 3: Write LiveCallView tests** - Test sentiment meter updates every 2 seconds, emotion tags display, language indicator shows current language
  - [ ] 4.4 **Hour 4: Implement LiveCallView component** - Build sentiment meter with color coding, emotion pills, language indicator. Use mock API initially
  - [ ] 4.5 **Hour 5: Write ConversationHistory tests** - Test displays last 5 conversations, generates word cloud from topics, shows wellness trend graph
  - [ ] 4.6 **Hour 6: Implement ConversationHistory** - Create conversation list, integrate Recharts for wellness graph, build word cloud from conversation topics
  - [ ] 4.7 **Hour 7: Write API client tests** - Test fetches senior profile, gets live sentiment with polling, handles API errors gracefully
  - [ ] 4.8 **Hour 8: Connect to real backend** - Replace mock with Dev 2's API endpoints, implement 5-second polling, verify real-time updates work

- [ ] 5.0 **Integration & Testing** (Hours 6-16)
  - [ ] 5.1 **Hour 6: First integration test** - Dev 3 calls → Dev 2 webhook receives → Dev 1 prompts execute → Dev 4 dashboard shows data. Document any issues
  - [ ] 5.2 **Hour 8: Memory continuity test** - CRITICAL: Call 1: "My daughter Sarah visited" → Hang up → Call 2: Sam must mention Sarah. If fails, all devs stop and fix
  - [ ] 5.3 **Hour 10: Dashboard integration test** - Complete conversation flow updates dashboard, word cloud generates from topics, sentiment graph shows trend
  - [ ] 5.4 **Hour 12: Language switching test** - Start in English → Say "我很想念我的女儿" → Sam responds in Mandarin → Dashboard shows language change
  - [ ] 5.5 **Hour 14: Full pipeline test** - 3-minute conversation: greeting → memory reference → emotional support → language switch → proper dashboard updates
  - [ ] 5.6 **Hour 16: Feature freeze** - Merge all features to release branch, no new features after this point, only bug fixes allowed

- [ ] 6.0 **Demo Preparation & Polish** (Hours 16-24)
  - [ ] 6.1 **Hour 16-17: Initialize Mrs. Chen demo data** - Run `init-demo-data.ts` to seed KV with full conversation history, verify profile loads correctly
  - [ ] 6.2 **Hour 17-18: Polish conversation quality** - Dev 1 fine-tunes prompts for warmth, tests various conversation paths, adjusts fallback responses
  - [ ] 6.3 **Hour 18-19: Dashboard visual polish** - Dev 4 improves animations, ensures responsive design, adds loading states, takes screenshots for backup
  - [ ] 6.4 **Hour 19-20: Record backup demos** - Record 3 conversations: memory demonstration, language switching, emotional support. Save as MP3 files
  - [ ] 6.5 **Hour 20-21: Production deployment** - Deploy Worker to production, update Vapi webhook URL, deploy dashboard to Cloudflare Pages, verify public URLs work
  - [ ] 6.6 **Hour 21-22: Demo rehearsal** - Practice 2-minute demo script 3 times, test all features, identify presenter, ensure all devices charged
  - [ ] 6.7 **Hour 22-23: Final integration test** - Complete demo run-through, verify phone → Sam → dashboard flow, test all backup plans
  - [ ] 6.8 **Hour 23-24: Demo preparation** - Set up demo station, open dashboard tabs, prepare backup recordings on phone, final test call, team briefing on roles

### Critical Integration Points

**HOUR 2**: Dev 2 must deploy basic Worker with health check - share URL immediately
**HOUR 4**: API contract locked - no endpoint changes after this
**HOUR 8**: Memory test must pass - highest priority
**HOUR 12**: Language test should work - fallback to English-only if needed  
**HOUR 16**: Feature freeze - absolutely no new features
**HOUR 20**: Production deploy - all hands on testing

### TDD Workflow for Each Task

1. **Write test first** - Define expected behavior with specific input/output
2. **Run test and confirm failure** - Ensure test fails before implementation
3. **Commit test** - Version control for test before code
4. **Implement minimum code to pass** - Don't over-engineer
5. **Run test until green** - Iterate on implementation
6. **Commit implementation** - Once all tests pass
7. **Refactor if time permits** - Only after tests pass

### Emergency Fallback Responsibilities

- **Dev 1**: Prepare 10 fallback responses for common situations
- **Dev 2**: Implement timeout handlers for all external API calls
- **Dev 3**: Record 3 backup conversation demos
- **Dev 4**: Take screenshots of working dashboard states

### Success Criteria by Hour

- **Hour 4**: All developers have working local environments
- **Hour 8**: Sam remembers Mrs. Chen (MUST WORK)
- **Hour 12**: Basic conversation flow complete
- **Hour 16**: All core features integrated
- **Hour 20**: Production deployment successful
- **Hour 24**: Demo ready with all backups