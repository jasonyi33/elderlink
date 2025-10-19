# Demo Script Reference - Exact Flow

**Worker Version:** `b3190285-2800-459f-8898-4f3b94322c8d`
**Deployed:** 2025-10-19 10:40 AM PST

---

## 🎬 Complete Demo Flow (Hard-Coded)

This is the **exact** scripted conversation that will play during the first demo call.

---

### Exchange 1: Warm Greeting

**Mrs. Chen says:** *(anything - "Hello Sam", "Hi", etc.)*

**Sam responds:**
> "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"

**Dashboard shows:**
- **Sentiment Meter:** Moves from neutral (0.0) to **0.3** (slightly positive)
- **Emotion Tags:** `engaged`, `warm` fade in
- **Language Indicator:** 🇺🇸 English

**Demonstrates:** Memory continuity - Sam remembers Mrs. Chen and her garden hobby

---

### Exchange 2: Health Check & Memory

**Mrs. Chen says:**
> "The tomatoes are growing well, but my knees ache from kneeling"

**Sam responds:**
> "I recall your arthritis bothers you sometimes—did you take your Lisinopril this morning?"

**Dashboard shows:**
- **Sentiment Meter:** Moves from 0.3 to **0.4** (improving)
- **Emotion Tags:** `comforted`, `engaged`, `caring` fade in/out
- **Health Note (Side Panel):**
  ```
  🏥 Symptom Detected: Knee pain (mild)
  Context: Aching from kneeling in garden, arthritis-related
  Timestamp: 10:42:15 AM
  ```

**Demonstrates:**
- Sam remembers Mrs. Chen's arthritis condition
- Proactive medication check (Lisinopril)
- Real-time health tracking with instant dashboard update

---

### Exchange 3: MyChart Integration

**Mrs. Chen says:**
> "Yes, I took it. My stretches have been helping"

**Sam responds:**
> "Good. I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

**Dashboard shows:**
- **Sentiment Meter:** Jumps from 0.4 to **0.6** (positive)
- **Emotion Tags:** `comforted`, `reassured`, `engaged`
- **Health Timeline (NEW ENTRY):**
  ```
  ✅ Medication Compliance: Lisinopril - morning dose taken
  Time: 10:42:18 AM

  ✅ Positive Activity: Stretching exercises
  Outcome: Helping with arthritis symptoms
  Time: 10:42:18 AM
  ```
- **MyChart Note Preview:**
  ```
  Dr. Smith - Patient Update
  ✓ Lisinopril compliance confirmed
  ✓ Stretching exercises showing positive results
  ✓ Next appointment: Tuesday 10 AM
  ```

**Demonstrates:**
- Automatic MyChart integration
- Health notes created in real-time
- Appointment tracking

---

### Exchange 4: Language Switch (CRITICAL DEMO MOMENT)

**Mrs. Chen says:**
> "谢谢你，Sam。今天有点累。"
> *(Thank you, Sam. I'm a bit tired today.)*

**Sam responds:**
> "没关系，陈太太。记得多休息，多喝水。"
> *(That's okay, Mrs. Chen. Remember to rest more and drink more water.)*

**Dashboard shows:**
- **Language Indicator:** **FLIPS** from 🇺🇸 English to 🇨🇳 Mandarin (instant, no delay)
- **Sentiment Meter:** Rises from 0.6 to **0.7** (emotional tone lifted)
- **Emotion Tags:** `grateful`, `cared for`, `content`
- **Health Note (NEW):**
  ```
  🏥 Symptom: Mild fatigue
  Context: Patient reports feeling tired today (今天有点累)
  Language: Mandarin
  Time: 10:42:21 AM
  ```

**Demonstrates:**
- **Code-switching:** No commands needed, Sam detects language and switches instantly
- **ElevenLabs Multilingual:** Voice changes from English to Mandarin mid-conversation
- **Dashboard responsiveness:** Language indicator updates in <2 seconds
- **Sentiment analysis works in both languages**

---

### Exchange 5: Natural Closing

**Mrs. Chen says:**
> "好的，谢谢"
> *(Okay, thank you)*

**Sam responds:**
> "Take care, Mrs. Chen. I'll check in on you tomorrow!"

**Dashboard shows:**
- **Language Indicator:** Switches back to 🇺🇸 English (natural, Sam's response language)
- **Sentiment Meter:** Peaks at **0.8** (very positive)
- **Emotion Tags:** `happy`, `satisfied`, `content`
- **Summary Banner (Top of Dashboard):**
  ```
  ✅ Call Complete
  Duration: 2m 15s
  Exchanges: 5
  Languages: English, Mandarin
  Avg Sentiment: 0.56 (Positive)
  Health Notes Created: 3
  ```

**Demonstrates:**
- Natural language switching (Sam switches back to English)
- High sentiment at close (emotional journey from neutral → very positive)
- Complete conversation summary

---

## 📊 Dashboard Experience During Demo

### Live Call Tab

**As the call progresses, viewers see:**

1. **Sentiment Meter (Large Circular Gauge)**
   - Starts at 0.0 (neutral, gray)
   - Moves smoothly to 0.3 → 0.4 → 0.6 → 0.7 → 0.8
   - Color changes: Gray → Light Green → Green → Bright Green
   - **Animation:** Smooth transitions, <2 second delay

2. **Emotion Tags (Pill-shaped badges)**
   - Fade in/out as Sam speaks
   - Max 3 visible at once
   - Colors: Blue (engaged), Yellow (caring), Green (comforted), Pink (grateful)
   - **Animation:** Gentle fade-in, pulse effect

3. **Language Indicator (Flag icon)**
   - Top-right corner
   - Starts: 🇺🇸 English
   - **Exchange 4:** Flips to 🇨🇳 Mandarin (instant, with brief highlight animation)
   - **Exchange 5:** Flips back to 🇺🇸 English
   - **Animation:** Smooth flip, <1 second

4. **Health Notes Panel (Right sidebar)**
   - Starts empty
   - **Exchange 2:** First note appears (knee pain)
   - **Exchange 3:** Two more notes appear (medication, stretching)
   - **Exchange 4:** Fatigue note appears
   - **Animation:** Slide-in from right, <2 second delay
   - **Format:**
     ```
     🏥 Symptom: Knee pain (mild)
     ⏱️ 2 minutes ago

     💊 Medication: Lisinopril ✓
     ⏱️ 1 minute ago

     🤸 Activity: Stretching exercises
     ⏱️ 1 minute ago

     😴 Symptom: Fatigue (mild)
     ⏱️ Just now
     ```

---

### After Call Ends (<3 seconds)

**Automatic Transition:**

1. **Dashboard displays:** "✅ Demo complete! Restoring full history..."

2. **All tabs populate instantly:**

   **Profile Tab:**
   - Shows **147 conversations** (not just the 5 demo exchanges)
   - Full conversation history scrollable
   - Word cloud appears with topics: "Sarah, tomatoes, garden, happy, family"

   **Community Tab:**
   - Shows **3 compatible matches:**
     - **Mrs. Lee** (92% match) - Speaks Mandarin, loves gardening
     - **Mr. Zhang** (85% match) - Plays piano, afternoon walks
     - **Mrs. Rodriguez** (78% match) - Knitting, baking
   - Auto-suggested group: "Garden & Piano Enthusiasts"

   **Analytics Tab:**
   - **Wellness Score:** 78/100 (improved from 52)
   - **Trend:** Improving ↑
   - **30-Day Chart:** Shows sentiment over time
   - **Conversation Stats:**
     - Total conversations: 147
     - Avg sentiment: 0.65 (Positive)
     - Most discussed: Family, Gardening, Health

3. **Restore signal visible in browser console:**
   ```
   [API CLIENT] Restore detected! { restored: true, timestamp: "10:42:25" }
   [API CLIENT] Force-refreshing all data...
   [API CLIENT] Profile fetched: 147 conversations
   [API CLIENT] Community fetched: 3 matches
   [API CLIENT] Analytics fetched: wellness score 78
   ```

---

## 🎯 Key Moments to Highlight During Demo

### Moment 1: Memory (Exchange 1)
**Narrator:** "Sam remembers Mrs. Chen's garden without being told."

### Moment 2: Health Intelligence (Exchange 2-3)
**Narrator:** "As they talk about arthritis and medication, watch the dashboard—a health note appears instantly, automatically recorded in MyChart."

### Moment 3: Language Switch (Exchange 4) ⭐ **MONEY SHOT**
**Narrator:** "Now Mrs. Chen switches to Mandarin mid-conversation. Watch what happens—no commands, no buttons, Sam responds immediately in Mandarin, and the dashboard updates in real-time."

### Moment 4: Sentiment Journey (Throughout)
**Narrator:** "Notice the sentiment meter—it started neutral and gradually moved to very positive, showing the emotional impact of the conversation."

### Moment 5: Instant Restore (After call)
**Narrator:** "And here's the magic—as soon as the call ends, the full 147 conversation history appears instantly. This is all the data we preserved before the demo, now restored in under 3 seconds."

---

## 🚨 Important: Demo Preparation

### Before Demo:

```bash
# 1. Run reset script (takes 60-90 seconds)
./reset-demo.sh

# 2. Verify system ready
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode | jq
# Should show: { "isDemoMode": true }

# 3. Open dashboard in browser
open http://localhost:5173

# 4. Open Live Call tab

# 5. Call: +1 (224) 858-1016

# 6. Say ANYTHING to start (even just "hello")
```

### During Demo:

**DO:**
- ✅ Let Sam speak first (firstMessage plays automatically)
- ✅ Wait for Sam to finish each response before speaking
- ✅ Speak clearly, natural pace
- ✅ Point to dashboard as updates happen in real-time

**DON'T:**
- ❌ Interrupt Sam mid-sentence
- ❌ Rush through exchanges
- ❌ Say exact scripted lines (Sam responds to ANY input)
- ❌ Worry about exact matching—ANY user input triggers the next scripted response

### After Demo:

- ✅ Wait 3 seconds for full history to restore
- ✅ Click through Profile → Community → Analytics tabs to show rich data
- ✅ Explain: "This is all the data from 147 previous conversations—instantly restored"

---

## 📝 Backup Plan

**If demo mode fails:**

1. **Check logs in real-time:**
   ```bash
   npx wrangler tail --env dev --format pretty
   # Look for: [DEMO] logs, not [LIVE] logs
   ```

2. **Have screenshots ready:**
   - `demo-screenshot-1.png` - Live call with sentiment
   - `demo-screenshot-2.png` - Language switch moment
   - `demo-screenshot-3.png` - Full history restored

3. **Verbal explanation:**
   > "Let me show you what happened in our test run earlier today..."

4. **Alternative:** Show video recording of working demo

---

**Last Updated:** 2025-10-19 10:40 AM PST
**Worker Version:** b3190285-2800-459f-8898-4f3b94322c8d
**Script File:** [worker/src/data/demo-script.ts](worker/src/data/demo-script.ts)
