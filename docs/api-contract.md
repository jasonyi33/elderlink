# ElderLink API Contract v1.0

**Version:** 1.0.0  
**Last Updated:** October 19, 2025  
**Status:** 🔒 LOCKED (Hour 4 Checkpoint)  
**Base URL:** `https://elderlink-dev.<account>.workers.dev`

---

## 📋 API Endpoints (12 Total)

All endpoints return JSON and include CORS headers.

### 1. Health Check

**Endpoint:** `GET /api/health`  
**Purpose:** Verify worker health and service connectivity  
**Authentication:** None

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-19T01:00:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "kv": "connected",
    "gemini": "not_tested",
    "vapi": "not_tested"
  },
  "latency": "15ms"
}
```

**Status Codes:**
- `200` - OK

---

### 2. Vapi Webhook (CRITICAL PATH)

**Endpoint:** `POST /vapi-webhook`  
**Purpose:** Process phone call messages from Vapi and return Sam's response  
**Authentication:** Vapi API Key (header)  
**Timeout:** 10 seconds (Vapi limit), 7s internal timeout

**Request Body:**
```json
{
  "message": {
    "transcript": {
      "content": "Hello Sam, how are you?"
    },
    "language": "english"
  },
  "conversationHistory": [
    {
      "role": "senior",
      "content": "previous message"
    }
  ]
}
```

**Response:**
```json
{
  "content": "Hi Mrs. Chen! It's wonderful to hear from you. How are those tomatoes doing?",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Status Codes:**
- `200` - OK (includes fallback responses on timeout)

**Performance:** <3 seconds response time (critical)

---

### 3. Get Senior Profile

**Endpoint:** `GET /api/senior/:seniorId`  
**Purpose:** Retrieve complete senior profile  
**Authentication:** None (demo)

**Example:** `GET /api/senior/mrs-chen`

**Response:**
```json
{
  "id": "mrs-chen",
  "name": "Mrs. Chen",
  "age": 72,
  "phone": "+1-206-555-0123",
  "languages": ["english", "mandarin"],
  "location": "Seattle, WA",
  "memories": {
    "family": [...],
    "hobbies": ["gardening", "piano"],
    "health": [...],
    "recentEvents": [...],
    "preferences": {...}
  },
  "socialProfile": {
    "interests": ["gardening", "piano", "cooking"],
    "culturalBackground": "Shanghai, Mandarin",
    "openToMatching": true
  },
  "healthData": {...},
  "matches": [...],
  "groups": [...],
  "conversations": [...],
  "wellnessMetrics": {...}
}
```

**Status Codes:**
- `200` - OK
- `404` - Profile not found

---

### 4. Get Live Sentiment

**Endpoint:** `GET /api/sentiment/live`  
**Purpose:** Get real-time sentiment during active call (5-min TTL)  
**Authentication:** None  
**Polling:** Dashboard polls every 2 seconds

**Response:**
```json
{
  "sentiment": 0.5,
  "emotions": ["happy", "content"],
  "timestamp": "2025-01-19T01:00:00.000Z",
  "language": "english"
}
```

**Status Codes:**
- `200` - OK (returns neutral sentiment if no active call)

---

### 5. Get Analytics

**Endpoint:** `GET /api/analytics`  
**Purpose:** Retrieve aggregate analytics across all seniors  
**Authentication:** None

**Response:**
```json
{
  "totalConversations": 147,
  "averageSentiment": 0.42,
  "totalMatches": 8,
  "totalHealthNotes": 23,
  "seniorCount": 4,
  "holisticWellnessAverage": 78
}
```

**Status Codes:**
- `200` - OK

---

### 6. Get Health Data (MyChart)

**Endpoint:** `GET /api/mychart/:seniorId`  
**Purpose:** Retrieve all health data for a senior  
**Authentication:** None (mock MyChart integration)

**Example:** `GET /api/mychart/mrs-chen`

**Response:**
```json
{
  "conditions": [
    {
      "name": "Hypertension",
      "since": "2018",
      "status": "controlled"
    }
  ],
  "medications": [
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "daily morning",
      "purpose": "blood pressure"
    }
  ],
  "vitals": {
    "lastUpdated": "2025-01-10",
    "bloodPressure": "128/82",
    "weight": "145 lbs",
    "bloodSugar": "110 mg/dL"
  },
  "appointments": [
    {
      "date": "2025-01-25",
      "time": "10:00am",
      "type": "Primary care checkup",
      "doctor": "Dr. Smith"
    }
  ],
  "notes": [
    {
      "timestamp": "2025-01-19T10:30:00Z",
      "source": "Sam AI Conversation",
      "note": "Patient reports: back pain when gardening",
      "mentions": [
        {
          "type": "symptom",
          "text": "back pain",
          "context": "gardening",
          "severity": "mild"
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200` - OK
- `404` - Profile not found

---

### 7. Get Appointments (MyChart)

**Endpoint:** `GET /api/mychart/:seniorId/appointments`  
**Purpose:** Retrieve upcoming appointments only  
**Authentication:** None

**Example:** `GET /api/mychart/mrs-chen/appointments`

**Response:**
```json
[
  {
    "date": "2025-01-25",
    "time": "10:00am",
    "type": "Primary care checkup",
    "doctor": "Dr. Smith"
  },
  {
    "date": "2025-02-15",
    "time": "2:00pm",
    "type": "Cardiology follow-up",
    "doctor": "Dr. Johnson"
  }
]
```

**Status Codes:**
- `200` - OK (returns empty array if no appointments)

---

### 8. Update Health Notes (MyChart)

**Endpoint:** `POST /api/mychart/:seniorId/update`  
**Purpose:** Batch update health notes after conversation  
**Authentication:** None

**Example:** `POST /api/mychart/mrs-chen/update`

**Request Body:**
```json
{
  "notes": [
    {
      "timestamp": "2025-01-19T10:30:00Z",
      "source": "Sam AI Conversation",
      "note": "Patient reports: back pain when gardening (mild severity)",
      "mentions": [
        {
          "type": "symptom",
          "text": "back pain",
          "context": "gardening",
          "severity": "mild"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

**Notes:**
- Appends to existing notes array
- Automatically truncates to last 10 notes
- Updates happen asynchronously after call completion

**Status Codes:**
- `200` - OK
- `500` - Update failed

---

### 9. Get Matches

**Endpoint:** `GET /api/matches/:seniorId`  
**Purpose:** Retrieve top 3 compatible senior matches  
**Authentication:** None

**Example:** `GET /api/matches/mrs-chen`

**Response:**
```json
[
  {
    "seniorId": "mrs-lee",
    "score": 90,
    "compatibility": "high",
    "sharedInterests": ["gardening", "piano", "cooking"],
    "calculatedAt": "2025-01-18T00:00:00Z"
  },
  {
    "seniorId": "mr-wang",
    "score": 85,
    "compatibility": "high",
    "sharedInterests": ["gardening", "cooking"],
    "calculatedAt": "2025-01-18T00:00:00Z"
  },
  {
    "seniorId": "mrs-kim",
    "score": 65,
    "compatibility": "good",
    "sharedInterests": ["gardening"],
    "calculatedAt": "2025-01-18T00:00:00Z"
  }
]
```

**Matching Algorithm:**
- Shared interests: 10 points each (max 50)
- Same language: 30 points
- Age within ±10 years: 10 points
- Same location: 10 points
- Only returns matches with score ≥ 50
- Maximum 3 matches, sorted by score descending

**Status Codes:**
- `200` - OK (returns empty array if no matches)

---

### 10. Get Groups

**Endpoint:** `GET /api/groups/:seniorId`  
**Purpose:** Retrieve suggested community groups  
**Authentication:** None

**Example:** `GET /api/groups/mrs-chen`

**Response:**
```json
[
  {
    "id": "mandarin-gardening-circle",
    "name": "Mandarin Gardening Circle",
    "memberCount": 3,
    "activity": "gardening",
    "language": "Mandarin",
    "schedule": "Weekly"
  }
]
```

**Group Naming:** `{Language} {Interest} Circle`  
**Auto-generation:** Based on most common shared interest among matches

**Status Codes:**
- `200` - OK (returns empty array if no groups)

---

### 11. Get Alerts

**Endpoint:** `GET /api/alerts/:seniorId`  
**Purpose:** Retrieve crisis/health alerts for a senior  
**Authentication:** None

**Example:** `GET /api/alerts/mrs-chen`

**Response:**
```json
[
  {
    "seniorId": "mrs-chen",
    "timestamp": "2025-01-19T10:45:00Z",
    "severity": "high",
    "type": "medical",
    "message": "Patient mentioned chest pain during conversation",
    "requiresAction": true
  }
]
```

**Alert Types:**
- `medical` - Physical health emergencies
- `crisis` - Suicide ideation, severe mental health
- `depression` - Persistent sadness, hopelessness
- `general` - Other concerns

**Severity Levels:**
- `high` - Immediate attention required
- `medium` - Monitor closely
- `low` - For awareness

**Status Codes:**
- `200` - OK (returns empty array if no alerts)

---

### 12. Initialize Demo Data

**Endpoint:** `POST /api/init-demo`  
**Purpose:** Initialize/update senior profile data (idempotent)  
**Authentication:** None  
**Usage:** Run at Hour 0 to seed demo data

**Request Body:**
```json
{
  "id": "mrs-chen",
  "name": "Mrs. Chen",
  "age": 72,
  // ... complete SeniorProfile structure
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-01-19T01:00:00.000Z"
}
```

**Notes:**
- Stores in KV as `senior-{id}`
- Idempotent - can be called multiple times safely
- Use for initial data seeding

**Status Codes:**
- `200` - OK

---

## 🔄 CORS Configuration

All endpoints include these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**OPTIONS** requests return 200 with CORS headers (preflight)

---

## ⏱️ Performance Targets

| Endpoint | Target Latency | Notes |
|----------|---------------|-------|
| POST /vapi-webhook | <3s | CRITICAL - phone call responsiveness |
| GET /api/health | <100ms | Used for monitoring |
| GET /api/sentiment/live | <500ms | Dashboard polling (2s interval) |
| GET /api/dashboard/:id | <1s | Aggregates multiple data sources |
| All others | <500ms | Standard API performance |

---

## 🔒 API Contract Lock (Hour 4)

**After Hour 4, NO CHANGES to:**
- Endpoint paths
- Request/response schemas
- Required fields
- Status codes

**Allowed after Hour 4:**
- Bug fixes to existing logic
- Performance optimizations
- Additional optional fields in responses

---

## 🧪 Testing Resources

**Postman Collection:** `postman/elderlink-api.json`
- Import into Postman for manual testing
- 17 requests covering all endpoints with variations
- Set `BASE_URL` variable to your worker URL

**Unit Tests:** `worker/tests/index.test.ts`
- 12 automated tests covering all endpoints
- Run: `npm test -- worker/tests/index.test.ts`

---

## 🚀 Integration Points

### For Developer 1 (AI/Prompts):
**Hour 5 Handoff:**
- Provide: `generateSamResponse(message, profile, language, history, env)`
- Replace stub in: `worker/src/handlers/vapi-webhook.ts` line 16

**Hour 7 Handoff:**
- Provide: `analyzeSentimentAndHealth(message, context, env)`
- Provide: `extractMemories(message, profile, env)`
- Replace stubs in: `worker/src/handlers/vapi-webhook.ts` lines 29, 46

### For Developer 3 (Vapi/Voice):
**Hour 3 Configuration:**
- Set Vapi webhook URL to: `https://elderlink-dev.<account>.workers.dev/vapi-webhook`
- Request timeout: 10 seconds
- Custom LLM provider configuration

### For Developer 4 (Dashboard):
**Hour 9 Integration:**
- All GET endpoints available for dashboard consumption
- Polling: `/api/sentiment/live` every 2 seconds
- Single call: `/api/dashboard/:seniorId` gets all data

---

## 📝 Implementation Notes

### Current State (Task 3.1):
- ✅ All 12 endpoints implemented with proper routing
- ✅ Response schemas match this contract
- ⚠️ Using stub service functions (return mock data)
- ⚠️ AI functions return placeholder responses

### Stub Functions (To Be Replaced):
- `getProfile()` - Returns MOCK_MRS_CHEN (Task 3.3: Real KV)
- `saveProfile()` - No-op (Task 3.3: Real KV)
- `getAnalytics()` - Returns mock stats (Task 3.7: Real calculation)
- `getAlerts()` - Returns [] (Task 3.6: Real alerts)
- `generateSamResponse()` - Returns "Hello! I'm Sam." (Hour 5: Real AI)
- `analyzeSentimentAndHealth()` - Returns neutral (Hour 7: Real analysis)
- `extractMemories()` - Returns empty (Hour 7: Real extraction)

---

## 🔐 Security Notes

**Demo Environment:**
- No authentication required
- CORS allows all origins (*)
- Suitable for hackathon demo only

**Production Considerations (Post-Hackathon):**
- Add authentication headers
- Restrict CORS to specific origins
- Rate limiting on webhook endpoint
- Input validation on all POST endpoints

---

## 📊 Response Format Standards

All responses:
- Content-Type: `application/json`
- Include CORS headers
- Use ISO 8601 timestamps
- Arrays return `[]` when empty (not null)
- Error responses include `{error: "message"}` field

---

**END OF API CONTRACT**

**Status:** 🔒 LOCKED at Hour 4  
**Compliance:** All implementations must match this contract  
**Changes:** Require Integration Lead approval after Hour 4

