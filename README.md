# ElderLink AI Companion

**One AI companion, three transformations**

ElderLink provides customizable AI companions accessible by phone that address three dimensions of senior wellness:
- **Mental Health** - Warm conversations with memory and empathy
- **Physical Health** - Natural health monitoring integrated with medical records
- **Social Health** - Community matching to build human connections

> We're not replacing humans or doctors. We're bridging gaps: between doctor visits, between family calls, and between isolated seniors.

**Platform Flexibility:**
- **Fully Customizable AI Companions** - Create unique personalities with tailored communication styles, tones, and cultural contexts for each senior
- **Extensive Multilingual Support** - Native-quality conversation in English, Mandarin, Spanish, Korean, Vietnamese, Tagalog, and many more languages
- **Flexible Integration** - Compatible with any webhook-based voice platform and major EHR systems
- **Scalable Architecture** - Serverless infrastructure supporting thousands of concurrent seniors globally
- **Configurable Health Monitoring** - Customize health tracking, medication reminders, and wellness metrics per individual

---

## Problem Statement

Seattle has 120,000+ seniors, 40% living alone. Social isolation increases mortality risk by 26%, while health issues go unmonitored between doctor visits. Many immigrant seniors don't speak English well, can't use technology, and have no local connections. Loneliness, declining physical health, and social isolation are interconnected crises killing our elderly.

## Solution

ElderLink's AI companions:
- **Remember** - Recall names, hobbies, health issues, and previous conversations
- **Monitor** - Track physical health naturally through conversation, create health notes
- **Connect** - Match seniors with similar interests for community groups
- **Speak** - Seamlessly switch between multiple languages with native-quality voices
- **Care** - Warm, patient, empathetic personalities customizable for each senior
- **Adapt** - Flexible platform supporting diverse cultural backgrounds and preferences

---

## Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account (for Workers and KV)
- AI provider API key (Google Gemini, OpenAI, or similar)
- Voice platform account (compatible with any webhook-based phone system)
- Text-to-speech service API key (for multilingual voice synthesis)

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd elderlink
npm install
```

2. **Configure Cloudflare**
```bash
# Login to Cloudflare
wrangler login

# Create KV namespace
wrangler kv:namespace create "ELDERLINK_KV"
wrangler kv:namespace create "ELDERLINK_KV" --preview

# Copy the namespace IDs to wrangler.toml
```

3. **Set Environment Variables**
```bash
# Add to wrangler.toml [vars] section or use wrangler secrets
wrangler secret put AI_API_KEY
wrangler secret put TTS_API_KEY
wrangler secret put VOICE_PLATFORM_API_KEY
```

4. **Deploy Worker**
```bash
npm run deploy
```

5. **Start Dashboard (Development)**
```bash
cd dashboard
npm install
npm run dev
```

---

## Project Structure

```
elderlink/
├── src/
│   ├── index.ts              # Main Cloudflare Worker
│   ├── handlers/
│   │   └── webhook.ts        # Voice platform webhook handler (CRITICAL PATH)
│   ├── services/
│   │   ├── kv-service.ts     # Profile storage
│   │   ├── health-service.ts # MyChart mock integration
│   │   ├── matching-service.ts # Community matching algorithm
│   │   ├── alert-service.ts  # Crisis detection
│   │   ├── wellness-service.ts # Metrics calculation
│   │   ├── gemini-service.ts # AI API calls
│   │   ├── conversation-summary.ts # Summary generation
│   │   └── word-cloud.ts     # Word frequency analysis
│   ├── middleware/
│   │   └── cors.ts           # CORS headers
│   └── types.ts              # TypeScript interfaces
├── prompts/
│   ├── sam-personality.ts    # Response generation prompt
│   ├── memory-extraction.ts  # Memory parsing prompt
│   └── sentiment-health.ts   # Combined analysis prompt
├── dashboard/
│   ├── src/
│   │   ├── App.tsx           # 4-tab dashboard interface
│   │   ├── components/       # Live Call, Profile, Community, Analytics
│   │   └── services/
│   │       ├── api-client.ts # API client with retry logic
│   │       └── mock-api.ts   # Development mock data
│   └── public/
├── data/
│   ├── sample-profiles.json  # Example senior profiles
│   └── escalation-keywords.json # Crisis detection keywords
├── scripts/
│   ├── test-latency.ts       # Webhook performance test
│   └── integration-tests/    # Full flow tests
├── tests/
│   ├── integration/          # End-to-end tests
│   └── performance.test.ts   # Performance validation
├── docs/
│   └── integration/          # Voice platform integration guides
├── PRD.md                    # Product Requirements Document
├── TASK_LIST_FINAL_TDD.md    # Complete task breakdown
├── TDD_TEST_CASES.md         # Test specifications
└── CLAUDE.md                 # Development context & rules
```

---

## Platform Customization

ElderLink is built as a **flexible, white-label platform** that can be customized for diverse senior populations:

### AI Companion Profiles
- **Custom Personalities** - Configure companion name, gender, age, background, and personality traits
- **Communication Style** - Adjust formality, warmth, humor, and conversational patterns
- **Cultural Context** - Customize cultural references, holidays, traditions, and communication norms
- **Voice Selection** - Choose from multiple voice profiles per language (male/female, age ranges, regional accents)
- **Example:** "Sam" is one configured profile; create "Maria," "Wei," "Kim," or any other companion

### Language & Cultural Support
- **20+ Languages** - Full support for major world languages with native pronunciation
- **Dialect Support** - Regional variations (Mandarin/Cantonese, Latin American/European Spanish, etc.)
- **Cultural Calendars** - Automatic recognition of cultural holidays and significant dates
- **Name Handling** - Proper pronunciation and use of names across different naming conventions

### Health Integration Flexibility
- **EHR Agnostic** - Compatible with Epic, Cerner, Allscripts, and other major systems
- **Custom Health Metrics** - Define which health indicators to track per senior
- **Medication Databases** - Integrate with pharmacy systems or custom medication lists
- **Care Team Integration** - Configurable alerts to doctors, nurses, or family members

### Deployment Options
- **Multi-tenant SaaS** - Single deployment serving multiple organizations
- **White-label** - Fully customized branding for healthcare providers or senior living facilities
- **Hybrid** - Cloud-based with on-premise data storage for HIPAA compliance
- **API-first** - Integrate with existing care management platforms

---

## Key Features

### 1. AI Companion Core
- **Customizable Personalities** - Tailor AI companion traits, tone, and communication style per senior
- **Fast Response** - <3 second latency for natural conversation flow
- **Persistent Memory** - Comprehensive recall of previous conversations and personal details
- **Proactive Engagement** - Intelligent health check-ins and wellness monitoring
- **Graceful Interruption Handling** - Natural conversation flow with context preservation
- **Community Integration** - Automatic connection suggestions and social engagement

### 2. Conversation Memory System
- Stores complete conversation history
- Extracts key facts (family, hobbies, health, interests)
- References previous conversations naturally
- Builds comprehensive senior profile over time
- Asynchronous memory extraction (no latency impact)

### 3. Multilingual Support
- **Extensive Language Coverage** - Support for multiple languages including English, Mandarin, Spanish, Korean, Vietnamese, Tagalog, and more
- **Automatic Language Detection** - Real-time detection of language switches during conversation
- **Seamless Code-Switching** - Natural mid-conversation language transitions
- **Native Voice Quality** - Voice synthesis adapts to match detected language with native-quality pronunciation
- **Cultural Sensitivity** - Customizable cultural context and communication patterns

### 4. Natural Wellness Tracking (Mental Health)
- Real-time sentiment analysis during calls
- Emotional state change detection
- 30-day wellness trend tracking
- No formal assessments - all natural conversation
- Crisis keyword detection with alerting

### 5. Health Record Integration
- **Flexible EHR Integration** - Compatible with various electronic health record systems
- **Proactive Medication Monitoring** - Automatic medication adherence checks
- **Symptom Tracking** - Natural extraction and documentation of health mentions
- **Appointment Management** - Intelligent reminder system for upcoming appointments
- **Automated Health Notes** - AI-generated health notes created after each conversation
- **Timeline Visualization** - Dashboard health timeline with historical tracking

### 6. Community Matching & Groups
- Auto-extract interests from conversations
- Weighted compatibility scoring algorithm:
  - Shared interests: 10 points each (max 50)
  - Same language: 30 points
  - Age within ±10 years: 10 points
  - Same location: 10 points
- Display top 3 matches (score ≥50)
- Auto-generated group suggestions
- Dashboard community tab with match profiles

### 7. Admin Dashboard (React)
**4 Interactive Tabs:**
- **Live Call** - Real-time sentiment meter, emotions, language indicator
- **Senior Profile** - Personal info, health overview, interests, conversation history
- **Community** - Social profile, top 3 matches, suggested groups
- **Analytics** - Holistic wellness score, 30-day trends, aggregate metrics

### 8. Crisis Escalation
- Medical emergency keyword detection
- Severe depression flagging
- Suicide ideation immediate alerts
- Dashboard alert visibility with severity levels
- Alert history storage in KV

---

## Technical Architecture

### System Flow
```
Senior calls phone → Voice Platform (speech-to-text, text-to-speech, language detection)
                  → Webhook POST to Cloudflare Worker
                  → PRIORITY PATH: Generate AI companion response (<2s)
                  → ASYNC PATH: Sentiment, health, memory extraction
                  → Update KV storage (profiles, health notes, matches)
                  → Dashboard polls API (2-second intervals)
```

### Performance Optimization
- **Priority Path** (immediate response):
  - Parse conversation (~50ms)
  - Generate response with AI provider (~800ms)
  - Format and return (~50ms)
  - **Total: ~1.5 seconds**

- **Async Path** (background processing via `waitUntil()`):
  - Sentiment + health extraction
  - Memory update
  - Health note creation
  - Match recalculation
  - Analytics aggregation

- **Timeout Handling**: Configurable safety timeout with fallback responses

### Data Storage (Cloudflare KV)
- `senior-{id}` → Complete SeniorProfile object
- `live-sentiment` → Current call sentiment (configurable TTL)
- `analytics-aggregate` → Cached analytics (configurable TTL)
- `alerts-{seniorId}` → Alert history

### AI Integration
- **Flexible Provider Support** - Compatible with Google Gemini, OpenAI, Anthropic, and other AI providers
- **Response Generation** - Optimized for low-latency conversation (~800ms)
- **Background Analysis** - Asynchronous sentiment and health extraction (~850ms)
- **Memory Processing** - Efficient extraction and storage (~800ms)
- **Configurable Parameters** - Adjustable temperature, max tokens, and model selection

---

## API Endpoints

### Voice Platform Webhook (CRITICAL PATH)
```
POST /webhook
Body: {message: {transcript, language, conversationHistory}}
Response: {content: string, voiceId?: string}
Latency target: <3 seconds
```

### Dashboard API
```
GET  /api/dashboard/:seniorId           → All data (profile + analytics + sentiment)
GET  /api/senior/:seniorId              → Senior profile only
GET  /api/sentiment/live                → Current call sentiment
GET  /api/analytics                     → Aggregate analytics
```

### Health Integration API
```
GET  /api/health/:seniorId              → All health data
GET  /api/health/:seniorId/appointments → Upcoming appointments
POST /api/health/:seniorId/update       → Batch update health notes
```

### Utility Endpoints
```
GET  /api/health                        → Worker health check
POST /api/profile                       → Create new senior profile
PUT  /api/profile/:seniorId             → Update senior profile
```

---

## Key Capabilities

✅ **Core Functionality:**
1. **Memory Continuity** - AI companions remember and reference previous conversations naturally
2. **Natural Conversation** - Warm, engaging dialogue lasting 2-3+ minutes without robotic responses
3. **Proactive Health Monitoring** - Intelligent health check-ins with automated note generation
4. **Real-time Analytics** - Live sentiment and wellness tracking during calls
5. **Community Matching** - Automatic compatibility scoring and group suggestions

**Performance & Flexibility:**
- Response latency <3 seconds for natural conversation flow
- Seamless multilingual support with automatic language detection
- Holistic wellness scoring combining mental, physical, and social dimensions
- Customizable companion personalities and communication styles
- Scalable architecture supporting multiple concurrent users

---

## Development Workflow

### Test-Driven Development (Mandatory)
This project follows a strict 7-step TDD process:

1. **Write Tests** - Create tests with specific input/output pairs
2. **Confirm Failure** - Run tests and verify they fail
3. **Commit Tests** - `git commit -m "Add [feature] tests (failing)"`
4. **Implement Code** - Write code WITHOUT modifying tests
5. **Iterate** - Run tests repeatedly, adjust code until all pass
6. **Verify** - Use independent validation to prevent overfitting
7. **Commit Code** - `git commit -m "Implement [feature]"`

**If any step is skipped, the task is INCOMPLETE.**

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- prompts/sam-personality.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Target:** 70% code coverage on critical paths

### Git Workflow
```bash
# Feature branches
git checkout -b feat/community-matching
git add tests/
git commit -m "test: Add community matching tests (failing)"
git add src/
git commit -m "feat: Implement community matching algorithm"

# Merge to dev
git checkout main
git merge feat/community-matching
git push origin main
```

---

## Configuration

### Environment Variables (wrangler.toml)
```toml
name = "elderlink-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"

# Secrets (set via wrangler secret put)
# AI_API_KEY
# TTS_API_KEY
# VOICE_PLATFORM_API_KEY
```

### Voice Platform Configuration
- Webhook URL: `https://your-worker.workers.dev/webhook`
- Language detection: Automatic multi-language support
- Speech timeout: Configurable (default 3 seconds)
- Voice profiles: Customizable per language and senior preference

### Voice Synthesis
- **Multilingual Voices** - Native-quality voices for each supported language
- **Customizable Tone** - Warm, neutral, elderly-friendly voice options
- **Adaptive Selection** - Automatic voice matching based on detected language

---

## Performance Metrics

**Target Latencies:**
- Webhook response: <3 seconds (7s absolute max)
- Dashboard update: <2 seconds polling interval
- Memory query: <500ms from KV storage
- Sentiment analysis: <1s processing time
- Community matching: <300ms for 100 profiles

**Monitoring:**
```bash
# Test webhook latency
npm run test:latency

# Monitor dashboard polling
# Check browser Network tab during live call
```

---

## Deployment

### Production Deployment
```bash
# Deploy worker
npm run deploy

# Deploy dashboard (via Cloudflare Pages)
cd dashboard
npm run build
wrangler pages deploy dist
```

### Verification Checklist
- [ ] Worker health check returns `{status: 'ok'}`
- [ ] Webhook responds in <3 seconds
- [ ] Dashboard loads all 4 tabs
- [ ] Live sentiment updates every 2 seconds
- [ ] Senior profiles display correctly
- [ ] Community matches show compatible seniors
- [ ] Analytics shows holistic wellness score

---

## Troubleshooting

### Common Issues

**Webhook timeout (>10 seconds)**
- Check Gemini API latency
- Verify KV read performance
- Review async processing (should not block response)

**Dashboard not updating**
- Check CORS headers in worker responses
- Verify polling interval (should be 2 seconds)
- Check browser console for API errors

**Memory not persisting**
- Verify KV namespace binding in wrangler.toml
- Check async processing with `waitUntil()`
- Review profile update logic in background processing

**Language switching not working**
- Ensure voice platform language detection is enabled
- Check voice ID mapping for each supported language
- Verify AI prompt language instructions
- Test language detection with sample phrases

**Matches not appearing**
- Check matching algorithm scoring (threshold ≥50)
- Verify profile interests are populated
- Ensure multiple senior profiles exist in system
- Review compatibility calculation logic

---

## Documentation

- **[PRD.md](PRD.md)** - Complete product requirements (2000+ lines)
- **[TASK_LIST_FINAL_TDD.md](TASK_LIST_FINAL_TDD.md)** - All developer tasks with TDD workflow
- **[TDD_TEST_CASES.md](TDD_TEST_CASES.md)** - Test specifications for all features
- **[CLAUDE.md](CLAUDE.md)** - Development context, rules, and critical checkpoints
- **[DEVELOPER_INTEGRATION_TIMELINE.md](DEVELOPER_INTEGRATION_TIMELINE.md)** - Hour-by-hour integration schedule
- **[COMPREHENSIVE_DEV3_DEV4_ASSESSMENT.md](COMPREHENSIVE_DEV3_DEV4_ASSESSMENT.md)** - Latest assessment report

### Integration Documentation
- **Voice Platform Integration Guides** - Available in `docs/integration/`
- **Health Record System Integration** - EHR system compatibility documentation
- **Webhook Implementation** - Standard webhook protocol documentation

---

## Contributing

This is a 24-hour hackathon project with strict TDD requirements:

1. **All code must have tests first** (no exceptions)
2. **Follow KISS and YAGNI principles** (keep it simple, don't over-engineer)
3. **Focus on demo success criteria** (5 metrics must work)
4. **Commit frequently** with clear messages
5. **Ask questions** if requirements unclear

---

## License

MIT License - ElderLink Team 2025

---

## Contact

For questions about this project, see documentation in:
- `TASK_LIST_FINAL_TDD.md` - Implementation details
- `PRD.md` - Product specifications
- `CLAUDE.md` - Development rules and context

**Deployment URLs:**
- Dashboard: [Cloudflare Pages URL]
- Worker API: [Cloudflare Worker URL]

---

## Acknowledgments

Built for seniors worldwide who deserve connection, care, and community.

**Technology Stack:**
- **Backend:** Cloudflare Workers + KV (serverless, globally distributed)
- **AI:** Flexible provider support (Google Gemini, OpenAI, Anthropic)
- **Voice:** Compatible with webhook-based phone platforms
- **Speech:** Multilingual text-to-speech and speech-to-text services
- **Frontend:** React + Vite + TypeScript
- **Testing:** Jest + React Testing Library (70% coverage target)
- **Architecture:** Event-driven, async processing, real-time updates
