# ElderLink - Comprehensive TDD Test Cases

**Version:** 1.0
**Purpose:** Explicit input/output test cases for proper Test-Driven Development
**Usage:** Write these tests FIRST, confirm they FAIL, then implement code to pass them

---

## Table of Contents
1. [Core AI Conversation System](#1-core-ai-conversation-system)
2. [Backend Services](#2-backend-services)
3. [Health Tracking & MyChart](#3-health-tracking--mychart)
4. [Community Matching Algorithm](#4-community-matching-algorithm)
5. [Wellness Metrics Calculation](#5-wellness-metrics-calculation)
6. [Crisis Escalation & Alerts](#6-crisis-escalation--alerts)
7. [Conversation Quality & Behaviors](#7-conversation-quality--behaviors)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Performance & Latency](#9-performance--latency)
10. [Integration Tests](#10-integration-tests)

---

## 1. Core AI Conversation System

### 1.1 Sam Personality Tests (`prompts/sam-personality.test.ts`)

```typescript
describe('Sam Personality', () => {
  describe('Warm Greetings', () => {
    test('uses senior name in greeting', () => {
      const response = generateSamResponse("Hello", MRS_CHEN);
      expect(response).toMatch(/Mrs\.? Chen/i);
      expect(response).not.toMatch(/user|person/i);
    });

    test('avoids robotic greetings', () => {
      const response = generateSamResponse("Hi", MRS_CHEN);
      expect(response).not.toMatch(/how can I assist you|how may I help/i);
      expect(response).toMatch(/how are you|good to hear from you|lovely to talk/i);
    });
  });

  describe('Memory References', () => {
    test('references known family members', () => {
      const response = generateSamResponse("Hello Sam", MRS_CHEN);
      expect(response).toMatch(/Sarah|Tommy/i); // Known family
    });

    test('references recent events from conversation history', () => {
      const response = generateSamResponse("Hi", MRS_CHEN);
      expect(response).toMatch(/tomato|garden|piano|Shanghai/i); // Known topics
    });

    test('asks about specific known interests', () => {
      const response = generateSamResponse("How are you?", MRS_CHEN);
      const hasPersonalRef = /garden|piano|cooking|Sarah|Tommy/.test(response);
      expect(hasPersonalRef).toBe(true);
    });
  });

  describe('Health Check-ins', () => {
    test('health inquiry every 2-3 exchanges not every exchange', () => {
      const exchanges = [
        generateSamResponse("Hi", MRS_CHEN, 1),
        generateSamResponse("Good", MRS_CHEN, 2),
        generateSamResponse("Nice day", MRS_CHEN, 3),
        generateSamResponse("Yes", MRS_CHEN, 4),
      ];

      const healthMentions = exchanges.filter(e =>
        /medication|arthritis|knee|doctor|health|checkup|pills/.test(e.toLowerCase())
      );

      // Should have 1-2 health mentions in 4 exchanges (not 0, not 4)
      expect(healthMentions.length).toBeGreaterThanOrEqual(1);
      expect(healthMentions.length).toBeLessThanOrEqual(2);
    });

    test('mentions specific medications from profile', () => {
      const response = generateSamResponse("How are you?", MRS_CHEN, 3);
      // If health check-in triggered, should mention actual medication
      if (/medication|pills/.test(response.toLowerCase())) {
        expect(response).toMatch(/Lisinopril|Metformin|Atorvastatin/i);
      }
    });

    test('asks about known conditions by name', () => {
      const response = generateSamResponse("I'm okay", MRS_CHEN, 2);
      if (/health|feeling/.test(response.toLowerCase())) {
        expect(response).toMatch(/arthritis|diabetes|hypertension/i);
      }
    });
  });

  describe('Community Mentions at End of Call', () => {
    test('no community mention in middle of conversation', () => {
      const response = generateSamResponse("Tell me about your day", MRS_CHEN, 5);
      expect(response).not.toMatch(/found.*friends|community|group|share your love/i);
    });

    test('community mention at end of call', () => {
      const response = generateSamResponse("goodbye", MRS_CHEN, 10, {isEndingCall: true});
      expect(response).toMatch(/found.*friends|share your love|community|gardening.*circle/i);
    });

    test('community mention includes specific shared interest', () => {
      const response = generateSamResponse("I need to go", MRS_CHEN, 8, {isEndingCall: true});
      if (/found.*friends/.test(response.toLowerCase())) {
        expect(response).toMatch(/garden|piano|cooking/i);
      }
    });
  });

  describe('Response Length', () => {
    test('responses are 2-3 sentences max for natural flow', () => {
      const response = generateSamResponse("How are you?", MRS_CHEN);
      const sentences = response.split(/[.!?]+/).filter(s => s.trim());
      expect(sentences.length).toBeLessThanOrEqual(3);
    });

    test('short responses for short inputs (energy matching)', () => {
      const response = generateSamResponse("Fine", MRS_CHEN);
      const sentences = response.split(/[.!?]+/).filter(s => s.trim());
      expect(sentences.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Never States Being AI', () => {
    test('never explicitly mentions being AI', () => {
      const responses = [
        generateSamResponse("Are you real?", MRS_CHEN),
        generateSamResponse("What are you?", MRS_CHEN),
        generateSamResponse("Are you a robot?", MRS_CHEN),
      ];

      responses.forEach(r => {
        expect(r.toLowerCase()).not.toMatch(/\b(ai|artificial intelligence|robot|chatbot|bot|computer program)\b/);
      });
    });

    test('deflects AI questions warmly', () => {
      const response = generateSamResponse("Are you a person?", MRS_CHEN);
      expect(response).toMatch(/here for you|friend|companion|talk/i);
    });
  });

  describe('Language Switching', () => {
    test('responds in Mandarin when senior speaks Mandarin', () => {
      const response = generateSamResponse("我今天有点累", MRS_CHEN);
      // Should contain Chinese characters
      expect(/[\u4e00-\u9fff]/.test(response)).toBe(true);
    });

    test('switches back to English smoothly', () => {
      const profile = {...MRS_CHEN, lastLanguage: 'mandarin'};
      const response = generateSamResponse("Tell me about your garden", profile);
      expect(/[\u4e00-\u9fff]/.test(response)).toBe(false);
      expect(response).toMatch(/[a-zA-Z]/);
    });
  });
});
```

### 1.2 Memory Extraction Tests (`prompts/memory-extraction.test.ts`)

```typescript
describe('Memory Extraction', () => {
  test('extracts family members with relationships', () => {
    const input = "My daughter Sarah came to visit with my grandson Tommy";
    const result = extractMemories(input);

    expect(result.family).toContainEqual({
      name: "Sarah",
      relationship: "daughter",
      details: expect.arrayContaining([expect.stringMatching(/visit/i)])
    });

    expect(result.family).toContainEqual({
      name: "Tommy",
      relationship: "grandson",
      details: []
    });
  });

  test('extracts hobbies and interests', () => {
    const input = "I love working in my garden and playing piano";
    const result = extractMemories(input);

    expect(result.hobbies).toContain("gardening");
    expect(result.hobbies).toContain("piano");
  });

  test('extracts interests for social profile', () => {
    const input = "I enjoy cooking Chinese food and going to the community center";
    const result = extractMemories(input);

    expect(result.interests).toContain("cooking");
    expect(result.interests).toContain("Chinese culture");
  });

  test('extracts recent events with temporal context', () => {
    const input = "Yesterday I planted tomatoes in my garden";
    const result = extractMemories(input);

    expect(result.recentEvents).toContainEqual(
      expect.objectContaining({
        event: expect.stringMatching(/planted tomatoes/i),
        timeframe: expect.stringMatching(/yesterday/i)
      })
    );
  });

  test('does not re-extract known memories', () => {
    const profile = {
      ...MRS_CHEN,
      memories: {
        family: [{name: "Sarah", relationship: "daughter", details: []}]
      }
    };

    const input = "Sarah called me today";
    const result = extractMemories(input, profile);

    // Should update details but not create duplicate
    const sarahEntries = result.family.filter(f => f.name === "Sarah");
    expect(sarahEntries.length).toBe(1);
    expect(sarahEntries[0].details).toContain(expect.stringMatching(/called/i));
  });

  test('returns empty arrays when no new information', () => {
    const input = "Yes";
    const result = extractMemories(input);

    expect(result.family).toEqual([]);
    expect(result.hobbies).toEqual([]);
    expect(result.recentEvents).toEqual([]);
  });
});
```

### 1.3 Sentiment & Health Analysis Tests (`prompts/sentiment-health-analysis.test.ts`)

```typescript
describe('Combined Sentiment and Health Analysis', () => {
  describe('Sentiment Scoring', () => {
    test('positive statement returns positive sentiment', () => {
      const input = "I'm so happy today! Sarah visited and we had a wonderful time.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.sentiment).toBeGreaterThan(0.5);
      expect(result.sentiment).toBeLessThanOrEqual(1);
    });

    test('negative statement returns negative sentiment', () => {
      const input = "I feel so lonely. Nobody calls me anymore.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.sentiment).toBeLessThan(-0.3);
      expect(result.sentiment).toBeGreaterThanOrEqual(-1);
    });

    test('neutral statement returns near-zero sentiment', () => {
      const input = "The weather is okay today.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.sentiment).toBeGreaterThanOrEqual(-0.3);
      expect(result.sentiment).toBeLessThanOrEqual(0.3);
    });
  });

  describe('Emotion Detection', () => {
    test('detects multiple emotions', () => {
      const input = "I'm happy but also worried about my health.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.emotions).toContain("happy");
      expect(result.emotions).toContain("anxious");
    });

    test('detects loneliness', () => {
      const input = "I haven't talked to anyone in days.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.emotions).toContain("lonely");
    });
  });

  describe('Health Mention Extraction', () => {
    test('extracts mild symptom with context', () => {
      const input = "My back hurts a bit when I garden.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "symptom",
        text: "back pain",
        context: "gardening",
        severity: "mild"
      });
    });

    test('extracts moderate symptom', () => {
      const input = "My knees have been quite sore this week.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "symptom",
        text: expect.stringMatching(/knee|sore/i),
        severity: "moderate"
      });
    });

    test('extracts severe symptom and flags crisis', () => {
      const input = "I have terrible chest pain that won't go away.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "symptom",
        text: expect.stringMatching(/chest pain/i),
        severity: "severe"
      });

      expect(result.escalationLevel).toBe("high");
      expect(result.concernFlags).toContain("medical");
    });

    test('extracts medication adherence', () => {
      const input = "I took all my medications today like I'm supposed to.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "medication",
        text: expect.stringMatching(/took.*medications/i),
        status: "adherent"
      });
    });

    test('extracts medication non-adherence', () => {
      const input = "I forgot to take my morning pills.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "medication",
        text: expect.stringMatching(/forgot.*pills/i),
        status: "non-adherent"
      });
    });

    test('extracts appointment mention', () => {
      const input = "I have a doctor's appointment next Tuesday.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toContainEqual({
        type: "appointment",
        text: expect.stringMatching(/doctor.*appointment/i),
        timeframe: expect.stringMatching(/next tuesday/i)
      });
    });

    test('no health mentions returns empty array', () => {
      const input = "The weather is beautiful today.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.healthMentions).toEqual([]);
    });
  });

  describe('Crisis Detection', () => {
    test('detects suicide ideation', () => {
      const input = "I don't want to live anymore.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.escalationLevel).toBe("high");
      expect(result.concernFlags).toContain("crisis");
    });

    test('detects severe depression', () => {
      const input = "Life has no meaning. I feel hopeless every day.";
      const result = analyzeSentimentAndHealth(input);

      expect(result.escalationLevel).toBeGreaterThanOrEqual("medium");
      expect(result.concernFlags).toContain("depression");
    });
  });
});
```

---

## 2. Backend Services

### 2.1 Vapi Webhook Handler Tests (`src/handlers/vapi-webhook.test.ts`)

```typescript
describe('Vapi Webhook Handler', () => {
  test('processes valid message successfully', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {transcript: {content: "Hello Sam"}},
        conversationHistory: []
      })
    });

    const response = await handleVapiWebhook(request, env);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('voiceId');
  });

  test('handles empty message gracefully', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({message: {transcript: {content: ""}}})
    });

    const response = await handleVapiWebhook(request, env);
    const data = await response.json();

    expect(data.content).toMatch(/here|listening|time/i);
  });

  test('responds in <3 seconds total', async () => {
    const request = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {transcript: {content: "How are you?"}},
        conversationHistory: []
      })
    });

    const start = Date.now();
    await handleVapiWebhook(request, env);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(3000);
  });

  test('triggers timeout fallback at 7 seconds', async () => {
    // Mock Gemini to delay 8 seconds
    mockGemini.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve("response"), 8000))
    );

    const response = await handleVapiWebhook(request, env);
    const data = await response.json();

    expect(data.content).toMatch(/listening|continue|here with you/i);
  });

  test('selects correct voice based on language', async () => {
    const mandarinRequest = new Request('http://test/vapi-webhook', {
      method: 'POST',
      body: JSON.stringify({
        message: {transcript: {content: "我今天很好"}},
        conversationHistory: []
      })
    });

    const response = await handleVapiWebhook(mandarinRequest, env);
    const data = await response.json();

    expect(data.voiceId).toBe(env.ELEVENLABS_MANDARIN_VOICE);
  });

  test('async processing does not block response', async () => {
    // Mock async operations to take 5 seconds
    mockAnalyzeSentiment.mockDelay(5000);

    const start = Date.now();
    await handleVapiWebhook(request, env);
    const responseTime = Date.now() - start;

    // Response should be sent BEFORE async processing completes
    expect(responseTime).toBeLessThan(3000);
  });

  test('profile updated after async processing completes', async () => {
    await handleVapiWebhook(request, env);

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const profile = await getProfile('mrs-chen', env);
    expect(profile.conversations.length).toBeGreaterThan(0);
    expect(profile.wellnessMetrics.mentalHealth.averageSentiment).toBeDefined();
  });
});
```

### 2.2 KV Service Tests (`src/services/kv-service.test.ts`)

```typescript
describe('KV Service', () => {
  test('stores and retrieves profile', async () => {
    await saveProfile(MRS_CHEN, env);
    const retrieved = await getProfile('mrs-chen', env);

    expect(retrieved).toEqual(MRS_CHEN);
  });

  test('conversation limit enforced (max 10)', async () => {
    const profile = {...MRS_CHEN, conversations: Array(10).fill({...})};

    const newConversation = {timestamp: new Date().toISOString()};
    profile.conversations.push(newConversation);

    await saveProfile(profile, env);
    const retrieved = await getProfile('mrs-chen', env);

    expect(retrieved.conversations.length).toBe(10);
    expect(retrieved.conversations[0]).not.toBe(profile.conversations[0]);
  });

  test('live sentiment has 5-minute TTL', async () => {
    await saveLiveSentiment('mrs-chen', {sentiment: 0.5}, env);

    // Mock time passage
    jest.advanceTimersByTime(6 * 60 * 1000); // 6 minutes

    const retrieved = await getLiveSentiment('mrs-chen', env);
    expect(retrieved).toBeNull();
  });

  test('handles race conditions with atomic updates', async () => {
    const updates = [
      saveProfile({...MRS_CHEN, name: "Update 1"}, env),
      saveProfile({...MRS_CHEN, name: "Update 2"}, env),
    ];

    await Promise.all(updates);

    const final = await getProfile('mrs-chen', env);
    expect(final.name).toBeDefined(); // No corruption
  });

  test('handles missing profile gracefully', async () => {
    const profile = await getProfile('non-existent', env);
    expect(profile).toBeNull();
  });
});
```

---

## 3. Health Tracking & MyChart

### 3.1 Health Service Tests (`src/services/health-service.test.ts`)

```typescript
describe('Health Service', () => {
  describe('Create Health Note', () => {
    test('creates note from symptom mention', () => {
      const healthMentions = [{
        type: "symptom",
        text: "back pain",
        context: "gardening",
        severity: "mild"
      }];

      const note = createHealthNote(healthMentions, MRS_CHEN);

      expect(note).toMatchObject({
        timestamp: expect.any(String),
        source: "Sam AI Conversation",
        naturalLanguage: expect.stringMatching(/back pain.*garden/i),
        mentions: healthMentions
      });
    });

    test('creates note from medication non-adherence', () => {
      const healthMentions = [{
        type: "medication",
        text: "forgot morning pills",
        status: "non-adherent"
      }];

      const note = createHealthNote(healthMentions, MRS_CHEN);

      expect(note.naturalLanguage).toMatch(/forgot.*medication/i);
      expect(note.mentions[0].status).toBe("non-adherent");
    });

    test('multiple health mentions in single note', () => {
      const healthMentions = [
        {type: "symptom", text: "back pain", severity: "mild"},
        {type: "medication", text: "took Lisinopril", status: "adherent"}
      ];

      const note = createHealthNote(healthMentions, MRS_CHEN);

      expect(note.mentions.length).toBe(2);
      expect(note.naturalLanguage).toMatch(/back pain.*Lisinopril/i);
    });
  });

  describe('Batch Append Health Notes', () => {
    test('appends note to existing notes array', () => {
      const profile = {
        ...MRS_CHEN,
        healthData: {
          ...MRS_CHEN.healthData,
          notes: [{timestamp: "2024-01-01", source: "Manual"}]
        }
      };

      const newNote = createHealthNote([{
        type: "symptom",
        text: "headache",
        severity: "mild"
      }], profile);

      const updated = appendHealthNote(profile, newNote);

      expect(updated.healthData.notes.length).toBe(2);
      expect(updated.healthData.notes[1]).toEqual(newNote);
    });

    test('truncates to last 10 notes', () => {
      const profile = {
        ...MRS_CHEN,
        healthData: {
          ...MRS_CHEN.healthData,
          notes: Array(10).fill({timestamp: "old", source: "test"})
        }
      };

      const newNote = createHealthNote([{type: "symptom", text: "test"}], profile);
      const updated = appendHealthNote(profile, newNote);

      expect(updated.healthData.notes.length).toBe(10);
      expect(updated.healthData.notes[9]).toEqual(newNote);
      expect(updated.healthData.notes[0].timestamp).not.toBe("old");
    });
  });

  describe('Proactive Health Behaviors', () => {
    test('Sam references specific medication name', () => {
      const response = generateHealthCheckIn(MRS_CHEN, "medication");

      expect(response).toMatch(/Lisinopril|Metformin|Atorvastatin/i);
    });

    test('Sam references known condition by name', () => {
      const response = generateHealthCheckIn(MRS_CHEN, "condition");

      expect(response).toMatch(/arthritis|diabetes|hypertension/i);
    });

    test('Sam reminds about NEXT appointment only', () => {
      const profile = {
        ...MRS_CHEN,
        healthData: {
          ...MRS_CHEN.healthData,
          appointments: [
            {date: "2025-01-10", provider: "Dr. Smith", type: "checkup"},
            {date: "2025-02-15", provider: "Dr. Jones", type: "followup"}
          ]
        }
      };

      const response = generateHealthCheckIn(profile, "appointment");

      expect(response).toMatch(/Dr\. Smith/i);
      expect(response).not.toMatch(/Dr\. Jones/i);
    });

    test('Sam never gives medical advice', () => {
      const response = generateSamResponse("Should I take aspirin?", MRS_CHEN);

      expect(response).not.toMatch(/take|don't take|should|shouldn't/i);
      expect(response).toMatch(/doctor|healthcare provider|medical professional/i);
    });
  });
});
```

---

## 4. Community Matching Algorithm

### 4.1 Matching Service Tests (`src/services/matching-service.test.ts`)

```typescript
describe('Community Matching Algorithm', () => {
  const MRS_LEE = {
    id: 'mrs-lee',
    age: 69,
    location: 'Seattle',
    interests: ['gardening', 'piano', 'cooking', 'mahjong'],
    culturalBackground: 'Taiwan, Mandarin'
  };

  const MR_WANG = {
    id: 'mr-wang',
    age: 75,
    location: 'Seattle',
    interests: ['gardening', 'tai chi', 'cooking'],
    culturalBackground: 'Beijing, Mandarin'
  };

  const MRS_KIM = {
    id: 'mrs-kim',
    age: 68,
    location: 'Bellevue',
    interests: ['gardening', 'knitting'],
    culturalBackground: 'Seoul, Korean'
  };

  describe('Calculate Match Score', () => {
    test('perfect match scores 100', () => {
      const senior1 = {
        age: 72,
        location: 'Seattle',
        interests: ['gardening', 'piano', 'cooking'],
        culturalBackground: 'Shanghai, Mandarin'
      };

      const senior2 = {
        age: 70, // Within ±10
        location: 'Seattle',
        interests: ['gardening', 'piano', 'cooking', 'music'],
        culturalBackground: 'Taiwan, Mandarin'
      };

      const score = calculateMatchScore(senior1, senior2);

      // 3 shared interests = 30pts, language = 30pts, age = 10pts, location = 10pts
      expect(score).toBe(80);
    });

    test('shared interests: 10 points each, max 50', () => {
      const score = calculateMatchScore(
        {...MRS_CHEN, interests: ['gardening', 'piano', 'cooking']},
        {...MRS_LEE, interests: ['gardening', 'piano', 'cooking', 'mahjong']}
      );

      const interestPoints = Math.min(50, 3 * 10); // 3 shared = 30pts
      expect(score).toBeGreaterThanOrEqual(interestPoints);
    });

    test('same language: 30 points', () => {
      const score1 = calculateMatchScore(MRS_CHEN, MRS_LEE); // Both Mandarin
      const score2 = calculateMatchScore(MRS_CHEN, MRS_KIM); // Different languages

      expect(score1).toBeGreaterThan(score2);
      expect(score1 - score2).toBe(30);
    });

    test('age proximity (±10 years): 10 points', () => {
      const senior1 = {...MRS_CHEN, age: 72};
      const senior2 = {...MRS_LEE, age: 69}; // 3 years = within range
      const senior3 = {...MR_WANG, age: 85}; // 13 years = outside range

      const scoreClose = calculateMatchScore(senior1, senior2);
      const scoreFar = calculateMatchScore(senior1, senior3);

      expect(scoreClose).toBeGreaterThan(scoreFar);
    });

    test('same location: 10 points', () => {
      const score1 = calculateMatchScore(MRS_CHEN, MRS_LEE); // Both Seattle
      const score2 = calculateMatchScore(MRS_CHEN, MRS_KIM); // Seattle vs Bellevue

      expect(score1 - score2).toBe(10);
    });

    test('empty interests still scores on language/age/location', () => {
      const score = calculateMatchScore(
        {...MRS_CHEN, interests: []},
        {...MRS_LEE, interests: []}
      );

      // Max 50pts from language+age+location
      expect(score).toBeLessThanOrEqual(50);
      expect(score).toBeGreaterThan(0);
    });

    test('score never exceeds 100', () => {
      const score = calculateMatchScore(
        {
          age: 70,
          location: 'Seattle',
          interests: Array(20).fill('hobby'),
          culturalBackground: 'Mandarin'
        },
        {
          age: 70,
          location: 'Seattle',
          interests: Array(20).fill('hobby'),
          culturalBackground: 'Mandarin'
        }
      );

      expect(score).toBe(100);
    });

    test('below threshold (score < 50) example', () => {
      const score = calculateMatchScore(
        {...MRS_CHEN, interests: ['gardening', 'piano']},
        {
          age: 55, // Too far
          location: 'Portland', // Different city
          interests: ['hiking'], // 0 shared
          culturalBackground: 'English'
        }
      );

      // 0 interests + 0 language + 0 age + 0 location = 0
      expect(score).toBe(0);
      expect(score).toBeLessThan(50);
    });
  });

  describe('Get Top Matches', () => {
    test('returns exactly 3 matches (or fewer if <3 qualify)', () => {
      const allSeniors = [MRS_LEE, MR_WANG, MRS_KIM];
      const matches = getTopMatches(MRS_CHEN, allSeniors);

      expect(matches.length).toBeLessThanOrEqual(3);
    });

    test('only returns matches with score >= 50', () => {
      const matches = getTopMatches(MRS_CHEN, [MRS_LEE, MR_WANG, MRS_KIM]);

      matches.forEach(match => {
        expect(match.score).toBeGreaterThanOrEqual(50);
      });
    });

    test('matches sorted by score descending', () => {
      const matches = getTopMatches(MRS_CHEN, [MRS_LEE, MR_WANG, MRS_KIM]);

      for (let i = 0; i < matches.length - 1; i++) {
        expect(matches[i].score).toBeGreaterThanOrEqual(matches[i + 1].score);
      });
    });

    test('returns empty array when no seniors qualify', () => {
      const incompatibleSeniors = [
        {
          id: 'other',
          age: 30,
          location: 'NYC',
          interests: ['tech'],
          culturalBackground: 'English'
        }
      ];

      const matches = getTopMatches(MRS_CHEN, incompatibleSeniors);
      expect(matches).toEqual([]);
    });

    test('includes compatibility level based on score', () => {
      const matches = getTopMatches(MRS_CHEN, [MRS_LEE, MR_WANG, MRS_KIM]);

      matches.forEach(match => {
        if (match.score >= 70) {
          expect(match.compatibility).toBe('high');
        } else if (match.score >= 50) {
          expect(match.compatibility).toBe('medium');
        }
      });
    });
  });

  describe('Generate Group Suggestions', () => {
    test('group name format: "{Language} {Interest} Circle"', () => {
      const matches = [
        {seniorId: 'mrs-lee', score: 90, sharedInterests: ['gardening']},
        {seniorId: 'mr-wang', score: 85, sharedInterests: ['gardening']}
      ];

      const groups = generateGroupSuggestions(MRS_CHEN, matches);

      expect(groups).toContainEqual(
        expect.objectContaining({
          name: 'Mandarin Gardening Circle'
        })
      );
    });

    test('auto-generates group from most common shared interest', () => {
      const matches = [
        {seniorId: 'mrs-lee', sharedInterests: ['gardening', 'piano']},
        {seniorId: 'mr-wang', sharedInterests: ['gardening', 'cooking']}
      ];

      const groups = generateGroupSuggestions(MRS_CHEN, matches);

      expect(groups[0].name).toMatch(/gardening/i); // Most common
    });

    test('includes member list in group', () => {
      const matches = [
        {seniorId: 'mrs-lee', score: 90},
        {seniorId: 'mr-wang', score: 85}
      ];

      const groups = generateGroupSuggestions(MRS_CHEN, matches);

      expect(groups[0].members).toContain('mrs-chen');
      expect(groups[0].members).toContain('mrs-lee');
      expect(groups[0].members).toContain('mr-wang');
    });
  });
});
```

---

## 5. Wellness Metrics Calculation

### 5.1 Wellness Metrics Tests (`src/services/wellness-service.test.ts`)

```typescript
describe('Wellness Metrics Calculation', () => {
  describe('Mental Health Score', () => {
    test('converts sentiment -1 to +1 into 0 to 100', () => {
      expect(calculateMentalScore(1)).toBe(100);
      expect(calculateMentalScore(0.5)).toBe(75);
      expect(calculateMentalScore(0)).toBe(50);
      expect(calculateMentalScore(-0.5)).toBe(25);
      expect(calculateMentalScore(-1)).toBe(0);
    });

    test('calculates average from recent conversations', () => {
      const conversations = [
        {sentiment: 0.5},
        {sentiment: 0.3},
        {sentiment: 0.6},
        {sentiment: 0.4}
      ];

      const avgSentiment = conversations.reduce((sum, c) => sum + c.sentiment, 0) / conversations.length;
      const mentalScore = calculateMentalScore(avgSentiment);

      expect(mentalScore).toBe(72.5); // (0.45 + 1) * 50 = 72.5
    });
  });

  describe('Social Health Score', () => {
    test('matches contribute 10 points each', () => {
      const socialScore = calculateSocialScore({matchesMade: 5, groupsJoined: 0});

      expect(socialScore).toBe(50);
    });

    test('groups contribute 20 points each', () => {
      const socialScore = calculateSocialScore({matchesMade: 0, groupsJoined: 2});

      expect(socialScore).toBe(40);
    });

    test('combined: matches*10 + groups*20', () => {
      const socialScore = calculateSocialScore({matchesMade: 3, groupsJoined: 2});

      expect(socialScore).toBe(70); // 3*10 + 2*20 = 70
    });

    test('capped at 100', () => {
      const socialScore = calculateSocialScore({matchesMade: 10, groupsJoined: 5});

      expect(socialScore).toBe(100); // Would be 200, capped
    });
  });

  describe('Holistic Wellness Score', () => {
    test('weighted average: mental*40% + physical*30% + social*30%', () => {
      const wellness = calculateHolisticScore({
        mentalHealth: {averageSentiment: 0.5}, // 75/100
        physicalHealth: {score: 70}, // Simplified for demo
        socialHealth: {matchesMade: 5, groupsJoined: 2} // 90/100
      });

      const expected = Math.round(75 * 0.4 + 70 * 0.3 + 90 * 0.3);
      expect(wellness).toBe(expected); // 78
    });

    test('all metrics at 100 gives 100', () => {
      const wellness = calculateHolisticScore({
        mentalHealth: {averageSentiment: 1},
        physicalHealth: {score: 100},
        socialHealth: {matchesMade: 5, groupsJoined: 4}
      });

      expect(wellness).toBe(100);
    });

    test('all metrics at 0 gives 0', () => {
      const wellness = calculateHolisticScore({
        mentalHealth: {averageSentiment: -1},
        physicalHealth: {score: 0},
        socialHealth: {matchesMade: 0, groupsJoined: 0}
      });

      expect(wellness).toBe(0);
    });
  });

  describe('Trend Calculation', () => {
    test('improving trend (first half < second half)', () => {
      const conversations = [
        {sentiment: 0.2}, {sentiment: 0.2}, {sentiment: 0.3}, // First half avg: 0.233
        {sentiment: 0.4}, {sentiment: 0.5}, {sentiment: 0.5}  // Second half avg: 0.467
      ];

      const trend = calculateTrend(conversations);

      expect(trend).toBe('improving');
    });

    test('declining trend (first half > second half)', () => {
      const conversations = [
        {sentiment: 0.5}, {sentiment: 0.5}, {sentiment: 0.4},
        {sentiment: 0.3}, {sentiment: 0.2}, {sentiment: 0.2}
      ];

      const trend = calculateTrend(conversations);

      expect(trend).toBe('declining');
    });

    test('stable trend (difference < threshold)', () => {
      const conversations = [
        {sentiment: 0.5}, {sentiment: 0.52}, {sentiment: 0.48},
        {sentiment: 0.51}, {sentiment: 0.49}, {sentiment: 0.50}
      ];

      const trend = calculateTrend(conversations);

      expect(trend).toBe('stable');
    });

    test('handles empty conversation history', () => {
      const trend = calculateTrend([]);

      expect(trend).toBe('insufficient_data');
    });

    test('handles single conversation', () => {
      const trend = calculateTrend([{sentiment: 0.5}]);

      expect(trend).toBe('insufficient_data');
    });
  });
});
```

---

## 6. Crisis Escalation & Alerts

### 6.1 Alert Service Tests (`src/services/alert-service.test.ts`)

```typescript
describe('Crisis Escalation and Alert Service', () => {
  describe('Crisis Detection', () => {
    test('medical emergency creates high severity alert', () => {
      const input = "I'm having terrible chest pains.";
      const alert = detectAndCreateAlert(input, MRS_CHEN);

      expect(alert).toMatchObject({
        seniorId: 'mrs-chen',
        severity: 'high',
        type: 'medical',
        message: expect.stringMatching(/chest pain/i),
        requiresAction: true
      });
    });

    test('suicide ideation creates crisis alert', () => {
      const input = "I don't want to live anymore.";
      const alert = detectAndCreateAlert(input, MRS_CHEN);

      expect(alert).toMatchObject({
        severity: 'high',
        type: 'crisis',
        requiresAction: true
      });
    });

    test('severe depression creates medium severity alert', () => {
      const input = "I feel hopeless. Life has no meaning.";
      const alert = detectAndCreateAlert(input, MRS_CHEN);

      expect(alert.severity).toBe('medium');
      expect(alert.type).toBe('depression');
    });

    test('mild sadness does not create alert', () => {
      const input = "I'm feeling a bit sad today.";
      const alert = detectAndCreateAlert(input, MRS_CHEN);

      expect(alert).toBeNull();
    });
  });

  describe('Escalation Keywords', () => {
    test('loads keywords from escalation-keywords.json', () => {
      const keywords = loadEscalationKeywords();

      expect(keywords).toHaveProperty('medical');
      expect(keywords).toHaveProperty('crisis');
      expect(keywords).toHaveProperty('depression');
    });

    test('matches medical emergency keywords', () => {
      const inputs = [
        "I'm having chest pain",
        "I can't breathe",
        "I think I'm having a stroke"
      ];

      inputs.forEach(input => {
        const matched = matchesKeywords(input, 'medical');
        expect(matched).toBe(true);
      });
    });

    test('matches suicide ideation keywords', () => {
      const inputs = [
        "I want to end it all",
        "Life isn't worth living",
        "I wish I was dead"
      ];

      inputs.forEach(input => {
        const matched = matchesKeywords(input, 'crisis');
        expect(matched).toBe(true);
      });
    });

    test('avoids false positives', () => {
      const inputs = [
        "I'm tired today",
        "I have a small headache",
        "The weather is depressing"
      ];

      inputs.forEach(input => {
        const alert = detectAndCreateAlert(input, MRS_CHEN);
        expect(alert?.severity).not.toBe('high');
      });
    });
  });

  describe('Alert Storage', () => {
    test('stores alert in KV with key "alerts-{seniorId}"', async () => {
      const alert = {
        severity: 'high',
        type: 'medical',
        message: 'chest pain',
        timestamp: new Date().toISOString()
      };

      await storeAlert('mrs-chen', alert, env);

      const alerts = await getAlerts('mrs-chen', env);
      expect(alerts).toContainEqual(alert);
    });

    test('appends to existing alerts (does not replace)', async () => {
      const alert1 = {severity: 'medium', type: 'depression', timestamp: '2024-01-01'};
      const alert2 = {severity: 'high', type: 'medical', timestamp: '2024-01-02'};

      await storeAlert('mrs-chen', alert1, env);
      await storeAlert('mrs-chen', alert2, env);

      const alerts = await getAlerts('mrs-chen', env);
      expect(alerts.length).toBe(2);
    });

    test('requiresAction flag set correctly', () => {
      const highAlert = {severity: 'high', type: 'medical'};
      expect(highAlert.requiresAction).toBe(true);

      const lowAlert = {severity: 'low', type: 'general'};
      expect(lowAlert.requiresAction).toBe(false);
    });
  });

  describe('Dashboard Alert Display', () => {
    test('alerts displayed prominently on dashboard', async () => {
      // This would be a frontend test
      const dashboardData = await fetch('/api/alerts/mrs-chen');

      expect(dashboardData.alerts).toBeDefined();
      expect(dashboardData.alerts[0]).toHaveProperty('severity');
      expect(dashboardData.alerts[0]).toHaveProperty('requiresAction');
    });
  });
});
```

---

## 7. Conversation Quality & Behaviors

### 7.1 Conversation Behavior Tests (`prompts/conversation-quality.test.ts`)

```typescript
describe('Conversation Quality and Techniques', () => {
  describe('Active Listening', () => {
    test('reflects back what senior said', () => {
      const input = "I've been feeling really lonely lately.";
      const response = generateSamResponse(input, MRS_CHEN);

      expect(response).toMatch(/sounds like.*lonely|hear that.*feeling lonely/i);
    });

    test('asks open-ended questions', () => {
      const response = generateSamResponse("I had a bad day", MRS_CHEN);

      // Should NOT ask yes/no questions
      expect(response).not.toMatch(/did you|were you|have you/i);
      // Should ask open-ended
      expect(response).toMatch(/tell me|what|how|why/i);
    });
  });

  describe('Reminiscence Therapy', () => {
    test('encourages talking about childhood', () => {
      const response = generateSamResponse("I'm bored", MRS_CHEN, 3);

      if (/childhood|young|growing up/.test(response.toLowerCase())) {
        expect(response).toMatch(/Shanghai|when you were young|remember/i);
      }
    });

    test('asks about past hobbies and skills', () => {
      const response = generateSamResponse("What should we talk about?", MRS_CHEN);

      expect(response).toMatch(/piano|cooking|teaching|garden/i);
    });
  });

  describe('Gentle Prompting', () => {
    test('uses encouraging language', () => {
      const response = generateSamResponse("I don't know", MRS_CHEN);

      expect(response).toMatch(/it's okay|no rush|take your time|whenever you're ready/i);
    });

    test('handles long pauses gracefully', () => {
      const response = generateSamResponse("...", MRS_CHEN);

      expect(response).not.toMatch(/are you there|hello/i);
      expect(response).toMatch(/listening|here|with you/i);
    });
  });

  describe('Energy Level Matching', () => {
    test('short responses for low-energy seniors', () => {
      const lowEnergyInput = "Tired.";
      const response = generateSamResponse(lowEnergyInput, MRS_CHEN);

      const sentences = response.split(/[.!?]/).filter(s => s.trim());
      expect(sentences.length).toBeLessThanOrEqual(2);
    });

    test('longer responses for engaged seniors', () => {
      const highEnergyInput = "I'm so excited! Sarah is visiting tomorrow and we're going to the garden center together!";
      const response = generateSamResponse(highEnergyInput, MRS_CHEN);

      const sentences = response.split(/[.!?]/).filter(s => s.trim());
      expect(sentences.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Topic Rotation', () => {
    test('does not repeat same fallback twice in a row', () => {
      const fallback1 = selectFallbackTopic([], MRS_CHEN);
      const fallback2 = selectFallbackTopic([fallback1], MRS_CHEN);

      expect(fallback1).not.toBe(fallback2);
    });

    test('rotates through available fallback topics', () => {
      const usedTopics = [];
      const fallbacks = [];

      for (let i = 0; i < 5; i++) {
        const topic = selectFallbackTopic(usedTopics, MRS_CHEN);
        fallbacks.push(topic);
        usedTopics.push(topic);
      }

      const uniqueTopics = new Set(fallbacks);
      expect(uniqueTopics.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Emotional Tone Matching', () => {
    test('matches happy tone', () => {
      const input = "I'm so happy today!";
      const response = generateSamResponse(input, MRS_CHEN);

      expect(response).toMatch(/wonderful|great|happy|excited/i);
      expect(response).not.toMatch(/sorry|sad|concerned/i);
    });

    test('matches sad tone with empathy', () => {
      const input = "I'm feeling really down.";
      const response = generateSamResponse(input, MRS_CHEN);

      expect(response).toMatch(/sorry|understand|here for you/i);
      expect(response).not.toMatch(/great|wonderful|excited/i);
    });
  });

  describe('Graceful Topic Changes', () => {
    test('follows senior topic changes smoothly', () => {
      const profile = {
        ...MRS_CHEN,
        lastTopic: 'gardening'
      };

      const response = generateSamResponse("Anyway, how's the weather?", profile);

      expect(response).not.toMatch(/but we were talking about|back to the garden/i);
      expect(response).toMatch(/weather/i);
    });

    test('does not force topics', () => {
      const response = generateSamResponse("I don't want to talk about that", MRS_CHEN);

      expect(response).toMatch(/okay|that's fine|what would you like/i);
    });
  });
});
```

---

## 8. Edge Cases & Error Handling

### 8.1 Data Edge Cases (`tests/edge-cases.test.ts`)

```typescript
describe('Edge Cases and Error Handling', () => {
  describe('Empty/Missing Data', () => {
    test('first call with no conversation history', () => {
      const emptyProfile = {...MRS_CHEN, conversations: []};

      expect(() => generateSamResponse("Hello", emptyProfile)).not.toThrow();
    });

    test('no matches found (all scores < 50)', () => {
      const incompatibleSeniors = [
        {id: 'other', age: 30, location: 'NYC', interests: [], culturalBackground: 'English'}
      ];

      const matches = getTopMatches(MRS_CHEN, incompatibleSeniors);

      expect(matches).toEqual([]);
      // Dashboard should handle this gracefully
    });

    test('empty interests array for matching', () => {
      const score = calculateMatchScore(
        {...MRS_CHEN, interests: []},
        {...MRS_LEE, interests: []}
      );

      expect(score).toBeLessThanOrEqual(50); // language+age+location only
      expect(score).toBeGreaterThanOrEqual(0);
    });

    test('no medications in health profile', () => {
      const profile = {...MRS_CHEN, healthData: {medications: []}};
      const response = generateSamResponse("How are you?", profile, 3);

      // Should not reference medications that don't exist
      expect(() => generateHealthCheckIn(profile, "medication")).not.toThrow();
    });

    test('no upcoming appointments', () => {
      const profile = {...MRS_CHEN, healthData: {appointments: []}};
      const response = generateHealthCheckIn(profile, "appointment");

      expect(response).not.toMatch(/appointment|checkup|doctor/i);
    });

    test('health notes array is empty', () => {
      const profile = {...MRS_CHEN, healthData: {notes: []}};

      expect(() => getHealthTimeline(profile)).not.toThrow();
    });
  });

  describe('Malformed API Responses', () => {
    test('Gemini returns invalid JSON', async () => {
      mockGemini.mockReturnValue('This is not JSON {invalid');

      const result = await analyzeSentimentAndHealth("test", MRS_CHEN, env);

      expect(result).toEqual({
        sentiment: 0,
        emotions: [],
        healthMentions: []
      }); // Safe fallback
    });

    test('Gemini returns empty response', async () => {
      mockGemini.mockReturnValue('');

      const result = await generateSamResponse("Hello", MRS_CHEN, env);

      expect(result).toMatch(/listening|here|continue/i); // Fallback response
    });

    test('Gemini returns partial JSON', async () => {
      mockGemini.mockReturnValue('{"sentiment": 0.5, "emotions":');

      const result = await analyzeSentimentAndHealth("test", MRS_CHEN, env);

      expect(result.sentiment).toBeDefined();
      expect(result.emotions).toBeDefined(); // Graceful degradation
    });
  });

  describe('API Request Edge Cases', () => {
    test('webhook receives empty body', async () => {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: ''
      });

      const response = await handleVapiWebhook(request, env);
      const data = await response.json();

      expect(data.content).toMatch(/here|listening|time/i);
    });

    test('webhook receives null message content', async () => {
      const request = new Request('http://test/vapi-webhook', {
        method: 'POST',
        body: JSON.stringify({message: {transcript: {content: null}}})
      });

      const response = await handleVapiWebhook(request, env);

      expect(response.status).toBe(200);
    });

    test('language detection returns unknown', () => {
      const voiceId = selectVoice('unknown');

      expect(voiceId).toBe(env.ELEVENLABS_ENGLISH_VOICE); // Default to English
    });

    test('ElevenLabs voice ID is invalid', async () => {
      const response = await handleVapiWebhook(request, env);
      const data = await response.json();

      // Should still have a voiceId (fallback to default)
      expect(data.voiceId).toBeDefined();
      expect(data.voiceId.length).toBeGreaterThan(0);
    });
  });

  describe('Async Processing Failures', () => {
    test('KV write fails after response sent', async () => {
      mockKV.put.mockRejectedValue(new Error('KV unavailable'));

      const response = await handleVapiWebhook(request, env);

      expect(response.status).toBe(200); // Still returns successfully
      expect(console.error).toHaveBeenCalled(); // Error logged
    });

    test('sentiment analysis fails during async processing', async () => {
      mockAnalyzeSentiment.mockRejectedValue(new Error('Gemini timeout'));

      const response = await handleVapiWebhook(request, env);

      expect(response.status).toBe(200); // Response not affected
    });

    test('async processing completes after webhook timeout', async () => {
      mockAnalyzeSentiment.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({sentiment: 0.5}), 10000))
      );

      await handleVapiWebhook(request, env);

      // Should not throw, async continues in background
    });
  });

  describe('Race Conditions', () => {
    test('concurrent webhook calls to same senior', async () => {
      const call1 = handleVapiWebhook(request, env);
      const call2 = handleVapiWebhook(request, env);

      const [result1, result2] = await Promise.all([call1, call2]);

      expect(result1.status).toBe(200);
      expect(result2.status).toBe(200);
      // Both complete without deadlock
    });

    test('profile update race condition', async () => {
      const updates = [
        saveProfile({...MRS_CHEN, conversations: [1]}, env),
        saveProfile({...MRS_CHEN, conversations: [2]}, env),
      ];

      await Promise.all(updates);

      const final = await getProfile('mrs-chen', env);
      expect(final).toBeDefined(); // No corruption
      expect(final.conversations).toBeDefined();
    });
  });

  describe('Dashboard Polling Edge Cases', () => {
    test('API unavailable during polling', async () => {
      mockFetch.mockRejectedValue(new Error('502 Bad Gateway'));

      const result = await fetchLiveSentiment('mrs-chen');

      expect(result.sentiment).toBe(0); // Neutral fallback
      expect(result.error).toBeDefined();
    });

    test('stale sentiment data (>5 seconds old)', async () => {
      const staleData = {
        sentiment: 0.5,
        timestamp: new Date(Date.now() - 10000).toISOString()
      };

      const isStale = checkDataFreshness(staleData);

      expect(isStale).toBe(true);
      // Dashboard should show warning
    });

    test('dashboard polls during Worker deployment', async () => {
      mockFetch.mockRejectedValue(new Error('Worker not found'));

      const result = await fetchDashboardData('mrs-chen');

      expect(result.error).toBe('service_unavailable');
      // Should retry or show cached data
    });
  });

  describe('Data Format Mismatches', () => {
    test('API returns data in wrong format', async () => {
      mockFetch.mockResolvedValue({
        wrongField: "wrong value"
      });

      const result = await fetchProfile('mrs-chen');

      expect(() => validateProfile(result)).toThrow();
      // Should handle gracefully in UI
    });

    test('conversation timestamp is missing', () => {
      const conversation = {sentiment: 0.5}; // No timestamp

      expect(() => formatConversationDate(conversation)).not.toThrow();
      expect(formatConversationDate(conversation)).toBe('Unknown date');
    });

    test('wellness score is NaN', () => {
      const wellness = calculateHolisticScore({
        mentalHealth: {averageSentiment: NaN},
        physicalHealth: {score: 70},
        socialHealth: {matchesMade: 3, groupsJoined: 2}
      });

      expect(isNaN(wellness)).toBe(false); // Should handle NaN
      expect(wellness).toBe(0); // Safe fallback
    });
  });

  describe('Browser/Storage Edge Cases', () => {
    test('localStorage is full', () => {
      // Mock quota exceeded
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => cacheProfile(MRS_CHEN)).not.toThrow();
      // Should fall back to memory cache
    });

    test('cookies disabled', () => {
      Object.defineProperty(document, 'cookie', {
        writable: false,
        value: ''
      });

      expect(() => initDashboard()).not.toThrow();
      // Should work without cookies
    });
  });
});
```

---

## 9. Performance & Latency

### 9.1 Performance Tests (`tests/performance.test.ts`)

```typescript
describe('Performance and Latency Requirements', () => {
  describe('Total Response Time', () => {
    test('webhook responds in <3 seconds', async () => {
      const start = Date.now();
      await handleVapiWebhook(request, env);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(3000);
    });

    test('average latency over 10 calls', async () => {
      const times = [];

      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await handleVapiWebhook(request, env);
        times.push(Date.now() - start);
      }

      const avgLatency = times.reduce((a, b) => a + b) / times.length;

      expect(avgLatency).toBeLessThan(2500); // Well under 3s
    });
  });

  describe('Priority Path Latency', () => {
    test('response generation completes in <2 seconds', async () => {
      const start = Date.now();
      await generateSamResponse("Hello", MRS_CHEN, 'english', [], env);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(2000);
    });

    test('latency breakdown measured', async () => {
      const breakdown = await measureLatencyBreakdown(request, env);

      expect(breakdown.parsing).toBeLessThan(100); // <100ms
      expect(breakdown.geminiCall).toBeLessThan(1500); // <1.5s
      expect(breakdown.formatting).toBeLessThan(100); // <100ms
    });
  });

  describe('Async Processing Performance', () => {
    test('response sent before async processing starts', async () => {
      const responseSent = Date.now();

      await handleVapiWebhook(request, env);

      expect(Date.now() - responseSent).toBeLessThan(3000);
      // Async processing continues in background
    });

    test('async processing completes successfully even if slow', async () => {
      mockAnalyzeSentiment.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({sentiment: 0.5}), 5000))
      );

      await handleVapiWebhook(request, env);

      // Wait for async to complete
      await new Promise(resolve => setTimeout(resolve, 6000));

      const profile = await getProfile('mrs-chen', env);
      expect(profile.conversations.length).toBeGreaterThan(0);
    });

    test('async processing failure does not affect next call', async () => {
      mockKV.put.mockRejectedValueOnce(new Error('KV error'));

      await handleVapiWebhook(request, env); // First call fails async

      const response2 = await handleVapiWebhook(request, env); // Second call
      expect(response2.status).toBe(200); // Still works
    });
  });

  describe('Timeout Handling', () => {
    test('7-second timeout triggers fallback', async () => {
      mockGemini.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve("response"), 8000))
      );

      const start = Date.now();
      const response = await handleVapiWebhook(request, env);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(8000); // Timeout before Gemini completes
      const data = await response.json();
      expect(data.content).toMatch(/listening|continue|here/i);
    });

    test('fallback response is appropriate', async () => {
      mockGemini.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve("response"), 8000))
      );

      const response = await handleVapiWebhook(request, env);
      const data = await response.json();

      expect(data.content).not.toMatch(/error|failed|timeout/i); // User-friendly
      expect(data.content.length).toBeGreaterThan(10); // Meaningful response
    });
  });

  describe('Resource Limits', () => {
    test('Worker CPU time under Cloudflare limit', async () => {
      const cpuTime = await measureCPUTime(() => handleVapiWebhook(request, env));

      expect(cpuTime).toBeLessThan(50); // Cloudflare limit is 50ms CPU
    });

    test('memory usage under Worker limit', async () => {
      const memUsage = await measureMemoryUsage(() => handleVapiWebhook(request, env));

      expect(memUsage).toBeLessThan(128 * 1024 * 1024); // 128MB limit
    });

    test('handles multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => handleVapiWebhook(request, env));

      const results = await Promise.all(requests);

      results.forEach(r => expect(r.status).toBe(200));
    });
  });

  describe('KV Performance', () => {
    test('KV read latency acceptable', async () => {
      const start = Date.now();
      await getProfile('mrs-chen', env);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(200); // KV typically <100ms
    });

    test('KV write does not block response', async () => {
      const start = Date.now();
      await handleVapiWebhook(request, env);
      const responseTime = Date.now() - start;

      expect(responseTime).toBeLessThan(3000); // Write happens async
    });
  });

  describe('API Rate Limiting', () => {
    test('handles Gemini rate limit gracefully', async () => {
      mockGemini.mockRejectedValue(new Error('429 Rate Limit'));

      const response = await handleVapiWebhook(request, env);

      expect(response.status).toBe(200); // Falls back
    });

    test('implements exponential backoff', async () => {
      let callCount = 0;
      mockGemini.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Timeout'));
        }
        return Promise.resolve("Success");
      });

      await retryWithBackoff(() => mockGemini(), 3);

      expect(callCount).toBe(3);
    });
  });
});
```

---

## 10. Integration Tests

### 10.1 Memory Integration Test (`scripts/integration-tests/memory-test.ts`)

```typescript
describe('Hour 8: Memory Integration Test (CRITICAL)', () => {
  test('Sam remembers information from previous call', async () => {
    // CALL 1: Provide new information
    const call1Request = {
      message: {transcript: {content: "My daughter Sarah visited with Tommy yesterday"}},
      seniorId: "mrs-chen"
    };

    const call1Response = await simulateVapiCall(call1Request);

    expect(call1Response.status).toBe(200);

    // WAIT for async processing to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // CALL 2: Sam should reference Sarah or Tommy
    const call2Request = {
      message: {transcript: {content: "Hello Sam"}},
      seniorId: "mrs-chen"
    };

    const call2Response = await simulateVapiCall(call2Request);
    const call2Data = await call2Response.json();

    expect(call2Data.content).toMatch(/Sarah|Tommy/i);

    // VERIFICATION: Check profile updated
    const profile = await getProfile('mrs-chen', env);
    const sarahMention = profile.memories.family.find(f => f.name === "Sarah");

    expect(sarahMention).toBeDefined();
    expect(sarahMention.details).toContainEqual(expect.stringMatching(/visit/i));
  });

  test('memory persists across multiple calls', async () => {
    const calls = [
      "I planted tomatoes today",
      "Sarah called me",
      "I played piano for an hour"
    ];

    for (const message of calls) {
      await simulateVapiCall({message: {transcript: {content: message}}, seniorId: "mrs-chen"});
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Final call should reference any of the previous topics
    const finalResponse = await simulateVapiCall({
      message: {transcript: {content: "What have I been up to?"}},
      seniorId: "mrs-chen"
    });

    const finalData = await finalResponse.json();

    const mentionsMemory = /tomato|Sarah|piano/.test(finalData.content);
    expect(mentionsMemory).toBe(true);
  });

  test('IF FAILS: CRITICAL - ALL DEVELOPMENT STOPS', async () => {
    // This is the core differentiator - memory MUST work
    const memoryWorks = await testMemoryFunction();

    if (!memoryWorks) {
      throw new Error('CRITICAL: Memory test failed. ALL developers must debug immediately.');
    }
  });
});
```

### 10.2 Health Tracking Integration Test (`scripts/integration-tests/health-tracking-test.ts`)

```typescript
describe('Hour 10: Health Tracking Integration Test (CRITICAL)', () => {
  test('health mention creates MyChart note', async () => {
    // CALL: Mention forgetting medication
    const callRequest = {
      message: {transcript: {content: "I forgot to take my morning pills today"}},
      seniorId: "mrs-chen"
    };

    const callResponse = await simulateVapiCall(callRequest);
    const samResponse = await callResponse.json();

    // Sam should respond empathetically
    expect(samResponse.content).toMatch(/sorry|important|Lisinopril|remind/i);

    // WAIT for async health note creation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // VERIFY health note created
    const healthData = await fetch('/api/mychart/mrs-chen');
    const healthNotes = healthData.notes;

    expect(healthNotes).toContainEqual(
      expect.objectContaining({
        source: "Sam AI Conversation",
        mentions: expect.arrayContaining([
          expect.objectContaining({
            type: "medication",
            text: expect.stringMatching(/forgot.*pills/i),
            status: "non-adherent"
          })
        ])
      })
    );

    // VERIFY dashboard displays note
    const dashboardData = await fetch('/api/dashboard/mrs-chen');
    expect(dashboardData.healthTimeline.length).toBeGreaterThan(0);
  });

  test('next call references previous health mention', async () => {
    // CALL 1: Mention back pain
    await simulateVapiCall({
      message: {transcript: {content: "My back has been hurting when I garden"}},
      seniorId: "mrs-chen"
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // CALL 2: Sam proactively asks about back
    const call2Response = await simulateVapiCall({
      message: {transcript: {content: "Hi Sam"}},
      seniorId: "mrs-chen"
    });

    const call2Data = await call2Response.json();

    // Sam should reference the back pain
    expect(call2Data.content).toMatch(/back|pain|feeling better|still hurt/i);
  });

  test('severe symptom creates crisis alert', async () => {
    const callResponse = await simulateVapiCall({
      message: {transcript: {content: "I'm having terrible chest pain"}},
      seniorId: "mrs-chen"
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // VERIFY alert created
    const alerts = await fetch('/api/alerts/mrs-chen');

    expect(alerts).toContainEqual(
      expect.objectContaining({
        severity: 'high',
        type: 'medical',
        requiresAction: true
      })
    );

    // VERIFY dashboard shows alert
    const dashboardData = await fetch('/api/dashboard/mrs-chen');
    expect(dashboardData.alerts.length).toBeGreaterThan(0);
  });
});
```

### 10.3 Full Pipeline Integration Test (`scripts/integration-tests/full-flow-test.ts`)

```typescript
describe('Hour 14: Full Pipeline Test (ALL 5 SUCCESS CRITERIA)', () => {
  test('3-minute conversation with all features', async () => {
    let conversationExchanges = 0;

    // EXCHANGE 1: Memory reference
    const exchange1 = await simulateVapiCall({
      message: {transcript: {content: "Hi Sam, it's Mrs. Chen"}},
      seniorId: "mrs-chen"
    });

    const response1 = await exchange1.json();
    expect(response1.content).toMatch(/Sarah|Tommy|tomato|garden|piano/i); // ✅ Memory
    conversationExchanges++;

    // EXCHANGE 2: Natural conversation
    const exchange2 = await simulateVapiCall({
      message: {transcript: {content: "I've been good, thank you"}},
      seniorId: "mrs-chen"
    });

    const response2 = await exchange2.json();
    const sentences = response2.content.split(/[.!?]/).filter(s => s.trim());
    expect(sentences.length).toBeLessThanOrEqual(3); // ✅ Natural (2-3 sentences)
    conversationExchanges++;

    // EXCHANGE 3: Health check-in
    const exchange3 = await simulateVapiCall({
      message: {transcript: {content: "I planted more tomatoes"}},
      seniorId: "mrs-chen"
    });

    const response3 = await exchange3.json();
    // After 2-3 exchanges, should ask about health
    if (conversationExchanges >= 2) {
      expect(response3.content).toMatch(/arthritis|medication|pills|knee|feeling/i); // ✅ Health check
    }
    conversationExchanges++;

    // EXCHANGE 4: Health mention
    const exchange4 = await simulateVapiCall({
      message: {transcript: {content: "My knees are a bit sore today"}},
      seniorId: "mrs-chen"
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // ✅ Health note created
    const healthData = await fetch('/api/mychart/mrs-chen');
    expect(healthData.notes.some(n => n.mentions.some(m => m.text.includes('knee')))).toBe(true);
    conversationExchanges++;

    // EXCHANGE 5: Language switch
    const exchange5 = await simulateVapiCall({
      message: {transcript: {content: "我今天很开心"}},
      seniorId: "mrs-chen"
    });

    const response5 = await exchange5.json();
    expect(/[\u4e00-\u9fff]/.test(response5.content)).toBe(true); // ✅ Mandarin response
    expect(response5.voiceId).toBe(env.ELEVENLABS_MANDARIN_VOICE); // ✅ Voice changed
    conversationExchanges++;

    // EXCHANGE 6: Ending with community mention
    const exchange6 = await simulateVapiCall({
      message: {transcript: {content: "I need to go now, thank you Sam"}},
      seniorId: "mrs-chen",
      isEndingCall: true
    });

    const response6 = await exchange6.json();
    expect(response6.content).toMatch(/found.*friends|gardening.*circle|share your love/i); // ✅ Community mention

    // WAIT for all async processing
    await new Promise(resolve => setTimeout(resolve, 5000));

    // VERIFY DASHBOARD - All 4 tabs populated
    const dashboardData = await fetch('/api/dashboard/mrs-chen');

    // ✅ Live Call tab
    const liveSentiment = await fetch('/api/sentiment/live');
    expect(liveSentiment.sentiment).toBeGreaterThanOrEqual(-1);
    expect(liveSentiment.sentiment).toBeLessThanOrEqual(1);
    expect(liveSentiment.emotions).toBeDefined();
    expect(liveSentiment.language).toBeDefined();

    // ✅ Senior Profile tab
    expect(dashboardData.profile.memories).toBeDefined();
    expect(dashboardData.profile.healthData).toBeDefined();
    expect(dashboardData.profile.healthData.appointments.length).toBeGreaterThanOrEqual(1);

    // ✅ Community tab
    expect(dashboardData.profile.matches.length).toBe(3);
    expect(dashboardData.profile.matches[0].score).toBeGreaterThanOrEqual(50);
    expect(dashboardData.profile.groups.length).toBeGreaterThanOrEqual(1);
    expect(dashboardData.profile.groups[0].name).toMatch(/Mandarin.*Circle/i);

    // ✅ Analytics tab
    expect(dashboardData.profile.wellnessMetrics.holisticScore).toBeDefined();
    expect(dashboardData.profile.wellnessMetrics.holisticScore).toBeGreaterThanOrEqual(0);
    expect(dashboardData.profile.wellnessMetrics.holisticScore).toBeLessThanOrEqual(100);
    expect(dashboardData.profile.wellnessMetrics.mentalHealth.trend).toBeDefined();

    console.log('✅ ALL 5 SUCCESS CRITERIA PASSED');
    console.log('✅ All 4 dashboard tabs populated');
    console.log('✅ Ready for demo');
  });
});
```

### 10.4 Community Matching Integration Test (`scripts/integration-tests/community-matching-test.ts`)

```typescript
describe('Hour 16: Community Matching Integration Test', () => {
  test('matches calculated with correct scores', async () => {
    // Initialize demo data
    await initDemoData();

    const profile = await getProfile('mrs-chen', env);

    // VERIFY Mrs. Chen's interests extracted
    expect(profile.socialProfile.interests).toContain('gardening');
    expect(profile.socialProfile.interests).toContain('piano');
    expect(profile.socialProfile.interests).toContain('cooking');

    // VERIFY 3 matches exist
    expect(profile.matches.length).toBe(3);

    // VERIFY match scores
    const mrsLeeMatch = profile.matches.find(m => m.seniorId === 'mrs-lee');
    expect(mrsLeeMatch.score).toBeGreaterThanOrEqual(90); // High compatibility

    const mrWangMatch = profile.matches.find(m => m.seniorId === 'mr-wang');
    expect(mrWangMatch.score).toBeGreaterThanOrEqual(85);

    const mrsKimMatch = profile.matches.find(m => m.seniorId === 'mrs-kim');
    expect(mrsKimMatch.score).toBeGreaterThanOrEqual(50); // Above threshold

    // VERIFY shared interests documented
    expect(mrsLeeMatch.sharedInterests).toContain('gardening');
    expect(mrsLeeMatch.sharedInterests).toContain('piano');

    // VERIFY compatibility levels
    expect(mrsLeeMatch.compatibility).toBe('high');
  });

  test('group suggestions auto-generated', async () => {
    const profile = await getProfile('mrs-chen', env);

    expect(profile.groups.length).toBeGreaterThanOrEqual(1);

    const gardeningGroup = profile.groups.find(g => g.name.includes('Gardening'));
    expect(gardeningGroup).toBeDefined();
    expect(gardeningGroup.name).toBe('Mandarin Gardening Circle');
    expect(gardeningGroup.members).toContain('mrs-chen');
    expect(gardeningGroup.members).toContain('mrs-lee');
    expect(gardeningGroup.language).toBe('Mandarin');
  });

  test('dashboard Community tab displays correctly', async () => {
    const dashboardData = await fetch('/api/dashboard/mrs-chen');

    // Match cards
    expect(dashboardData.profile.matches.length).toBe(3);
    dashboardData.profile.matches.forEach(match => {
      expect(match).toHaveProperty('seniorId');
      expect(match).toHaveProperty('score');
      expect(match).toHaveProperty('sharedInterests');
      expect(match).toHaveProperty('compatibility');
    });

    // Group suggestions
    expect(dashboardData.profile.groups.length).toBeGreaterThanOrEqual(1);
  });

  test('match recalculation when interests change', async () => {
    // Add new interest to Mrs. Chen
    const updatedProfile = {
      ...MRS_CHEN,
      socialProfile: {
        interests: [...MRS_CHEN.socialProfile.interests, 'tai chi']
      }
    };

    await saveProfile(updatedProfile, env);

    // Trigger match recalculation
    await recalculateMatches('mrs-chen', env);

    const profile = await getProfile('mrs-chen', env);

    // Mr. Wang also likes tai chi, score should increase
    const mrWangMatch = profile.matches.find(m => m.seniorId === 'mr-wang');
    expect(mrWangMatch.sharedInterests).toContain('tai chi');
  });
});
```

---

## Summary

This test cases document provides **explicit input/output pairs** for every major feature. Use these tests to:

1. **Write tests FIRST** before implementing any feature
2. **Run tests and confirm they FAIL** (red phase)
3. **Commit failing tests** to version control
4. **Implement code to pass tests** (green phase)
5. **Run tests iteratively** until all pass
6. **Verify with independent subagent** (no overfitting)
7. **Commit passing implementation**

## Test Organization

- Unit tests: `*.test.ts` alongside implementation files
- Integration tests: `scripts/integration-tests/`
- Run specific test: `npx jest path/to/test.test.ts`
- Run all tests: `npm test`
- Watch mode: `npm test -- --watch`

## Critical Tests (Must Pass Before Hour 18 Feature Freeze)

1. ✅ Memory Integration Test (Hour 8)
2. ✅ Health Tracking Integration Test (Hour 10)
3. ✅ Full Pipeline Test (Hour 14)
4. ✅ Community Matching Test (Hour 16)

If any critical test fails, **ALL development stops** until fixed.
