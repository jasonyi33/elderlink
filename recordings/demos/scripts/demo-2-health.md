# Demo 2: Health Tracking & MyChart Integration

**Purpose**: Demonstrate proactive health monitoring and automatic MyChart note creation
**Duration**: 3-4 minutes (single call)
**Success Criteria**: Sam detects health mentions, asks follow-ups, and creates MyChart note visible in dashboard

---

## Setup Instructions

### Before Recording
1. **Verify Health Service Active**:
   ```bash
   # Check health endpoint exists
   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/health
   ```

2. **Clear Previous Health Data** (optional):
   ```bash
   # Check current health notes
   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.healthData.notes'
   ```

3. **Dashboard Setup**:
   - Open dashboard Health Timeline tab
   - Should show existing medications:
     - Lisinopril 10mg (blood pressure)
     - Metformin 500mg (diabetes)
   - Watch for new notes to appear during call

4. **Phone Setup**:
   - Speakerphone enabled
   - Speak clearly when mentioning health symptoms
   - Have script visible but speak naturally

---

## Call Script: Health Monitoring

### Opening (20 seconds)

**Sam**: "Hello! This is Sam. Who am I speaking with today?"

**Mrs. Chen**: "Hi Sam, it's Mrs. Chen."

**Sam**: *(Expected: Warm greeting, may reference previous interactions)*
Example: "Hi Mrs. Chen! How are you feeling today?"

### Health Check Sequence (120-150 seconds)

#### Scenario 1: Medication Reminder

**Mrs. Chen**: "I'm okay, but I've been a bit forgetful lately."

**Sam**: *(Expected: Shows concern, may ask about medications)*
Example: "I'm sorry to hear that. Are you remembering to take your medications?"

**Mrs. Chen**: "Well, I think I missed my blood pressure pill yesterday morning."

**Sam**: *(CRITICAL: Should recognize "blood pressure" → Lisinopril)*
Example: "It's important to take your Lisinopril regularly. Did you take it today?"

**PASS CRITERIA**:
- Sam identifies medication by name (Lisinopril)
- Shows concern and encouragement
- Dashboard creates note: "Missed Lisinopril dose (yesterday morning)"

**Mrs. Chen**: "Yes, I took it this morning. I set a reminder on my phone now."

**Sam**: *(Expected: Positive reinforcement)*
Example: "That's wonderful! Setting reminders is a great idea. How else have you been feeling?"

#### Scenario 2: Pain Mention (Arthritis)

**Mrs. Chen**: "My hands have been hurting more than usual. It's hard to open jars sometimes."

**Sam**: *(CRITICAL: Should recognize arthritis symptom)*
Example: "I'm sorry your arthritis is bothering you. Is it both hands, or mostly one side?"

**PASS CRITERIA**:
- Sam connects symptom to known condition (arthritis)
- Asks clarifying questions
- Shows empathy

**Mrs. Chen**: "Mostly my right hand. It's worse in the mornings."

**Sam**: *(Expected: May suggest tracking or ask about treatment)*
Example: "Have you mentioned this to your doctor? They might be able to adjust your treatment."

**Mrs. Chen**: "I have an appointment next week. I'll bring it up then."

**Sam**: *(Expected: Supportive response)*
Example: "That's good. In the meantime, is there anything that helps with the pain?"

**PASS CRITERIA**:
- Dashboard creates note: "Arthritis pain - right hand, worse in mornings"
- Alert indicator shows yellow (minor health concern)

#### Scenario 3: Positive Health Update

**Mrs. Chen**: "On a good note, my blood sugar has been stable lately. I've been watching what I eat more carefully."

**Sam**: *(Expected: Celebrates positive health behavior)*
Example: "That's wonderful news! Good blood sugar control is so important. What changes have you made to your diet?"

**Mrs. Chen**: "Less rice, more vegetables. And I've been walking more too."

**Sam**: *(Expected: Reinforces healthy behavior)*
Example: "That's excellent! Walking is great for managing diabetes. How often are you walking?"

**Mrs. Chen**: "About 20 minutes after dinner, most days."

**Sam**: *(Expected: Positive reinforcement)*
Example: "That's a wonderful routine. Keep up the great work, Mrs. Chen!"

**PASS CRITERIA**:
- Dashboard creates note: "Positive: Blood sugar stable, improved diet (less rice, more vegetables), walking 20min/day"
- Note marked as "Positive Update" (green indicator)

### Closing (30 seconds)

**Mrs. Chen**: "Thank you, Sam. It's nice to talk about these things."

**Sam**: *(Expected: Warm, supportive closing)*
Example: "I'm always here to listen, Mrs. Chen. Take care of yourself, and don't forget to mention your hand pain to your doctor next week!"

**Mrs. Chen**: "I will. Goodbye, Sam!"

**Sam**: "Goodbye! Talk to you soon."

---

## Success Criteria Summary

### MUST PASS (Critical):
1. ✅ **Sam identifies medication by name** (Lisinopril for blood pressure)
2. ✅ **Dashboard creates 3 MyChart notes**:
   - Missed Lisinopril dose
   - Arthritis pain (right hand, mornings)
   - Positive health update (blood sugar stable)
3. ✅ **Notes appear within 5 seconds** of health mention
4. ✅ **Alert indicator shows** for arthritis pain (yellow)

### SHOULD PASS (Important):
5. ✅ Sam asks clarifying questions about symptoms
6. ✅ Sam shows empathy and support
7. ✅ Sam reinforces positive health behaviors
8. ✅ Notes categorized correctly:
   - Medication adherence
   - Pain/symptoms
   - Positive updates

### BONUS (Nice to Have):
9. ✅ Sam references specific doctor appointment timing
10. ✅ Dashboard shows health trend (improving/stable/concerning)
11. ✅ Notes include exact timestamps and context

---

## Dashboard Verification

### Health Timeline Tab Should Show:

```
📋 Health Notes (Most Recent First)

[TODAY 2:34 PM] ✅ Positive Update
Blood sugar stable, improved diet (less rice, more vegetables),
walking 20min/day
Context: Diabetes management

[TODAY 2:32 PM] ⚠️ Symptom Report
Arthritis pain - right hand, worse in mornings
Context: Scheduled doctor appointment next week

[TODAY 2:31 PM] 💊 Medication
Missed Lisinopril dose (yesterday morning), took today
Context: Set phone reminder to prevent future misses

───────────────────────────────────

📊 Active Medications
- Lisinopril 10mg (Blood pressure) - Daily
- Metformin 500mg (Diabetes) - Twice daily
```

### Alert Dashboard Should Show:

```
🟡 Minor Health Concern
Arthritis pain increase - right hand
Mentioned: 2 minutes ago
Action: Scheduled doctor visit next week
```

---

## Technical Verification

### 1. Check Backend Processing

```bash
# Verify notes were saved to KV
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.healthData.notes[] | {timestamp, category, content}'

# Expected output:
# {
#   "timestamp": "2025-10-18T14:34:22Z",
#   "category": "positive_update",
#   "content": "Blood sugar stable, improved diet, walking 20min/day"
# }
# {
#   "timestamp": "2025-10-18T14:32:15Z",
#   "category": "symptom",
#   "content": "Arthritis pain - right hand, worse in mornings",
#   "severity": "minor"
# }
# {
#   "timestamp": "2025-10-18T14:31:08Z",
#   "category": "medication",
#   "content": "Missed Lisinopril dose (yesterday morning)"
# }
```

### 2. Check Alert Generation

```bash
# Verify alert was created
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/alerts/mrs-chen

# Expected output:
# [{
#   "type": "health",
#   "severity": "minor",
#   "message": "Arthritis pain increase - right hand",
#   "timestamp": "2025-10-18T14:32:15Z",
#   "requiresAction": false,
#   "context": "Scheduled doctor visit next week"
# }]
```

### 3. Monitor Webhook Performance

During call, check Worker logs for:

```
[HEALTH] Detected health mention: "blood pressure pill"
[HEALTH] Extracted: medication=Lisinopril, status=missed
[KV] Saving health note: medication_adherence
[ALERT] Created minor alert: arthritis_pain
[WEBHOOK] Health processing completed in 234ms
```

---

## Troubleshooting

### Issue: Health notes not appearing in dashboard

**Possible Causes**:
1. Async processing not running (`waitUntil` not called)
2. Health extraction prompt not detecting keywords
3. Dashboard polling not fetching updated data

**Debug Steps**:
```bash
# Check if health service is extracting correctly
# Look for keywords in Worker logs:
# - "medication", "pill", "dose"
# - "pain", "hurting", "aches"
# - "blood sugar", "blood pressure", "arthritis"

# Manually trigger health note creation
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen/health-notes \
  -H "Content-Type: application/json" \
  -d '{"category": "test", "content": "Manual test note"}'

# Check dashboard API call
# Open DevTools → Network → Filter "profiles"
# Should see 200 response with healthData.notes array
```

### Issue: Sam doesn't ask follow-up questions

**Possible Causes**:
1. Prompt not instructed to probe health mentions
2. Gemini temperature too low (not creative)
3. Response length limit too short

**Fix**: Check [prompts/sentiment-health.ts](../../../prompts/sentiment-health.ts):
```typescript
// Should include instruction like:
"When user mentions health symptoms or medications:
1. Show empathy and concern
2. Ask at least one clarifying question
3. Reference known health conditions if relevant
4. Encourage positive behaviors"
```

### Issue: Medication not identified by name

**Possible Causes**:
1. Profile medications not loaded into prompt context
2. Gemini not trained on medication names
3. Keyword matching too strict

**Fix**: Verify profile data includes medications:
```bash
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.healthData.medications'

# Should return:
# [
#   {"name": "Lisinopril", "dosage": "10mg", "frequency": "daily", "condition": "blood pressure"},
#   {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily", "condition": "diabetes"}
# ]
```

And check prompt includes this data:
```typescript
const context = `
Known medications:
- Lisinopril 10mg (blood pressure)
- Metformin 500mg (diabetes)

Known conditions:
- Arthritis (hands)
- Occasional forgetfulness

If user mentions "blood pressure pill" or similar, refer to Lisinopril by name.
`;
```

---

## Recording Instructions

### Camera Setup:
1. **Split Screen**:
   - Left: Phone interface or speaker
   - Right: Dashboard Health Timeline tab

2. **Highlight Moments** (zoom/circle):
   - When "blood pressure pill" → Sam says "Lisinopril"
   - When health note appears in dashboard (within 5s)
   - When alert indicator turns yellow

3. **Voiceover Script**:
   ```
   "Mrs. Chen mentions forgetting her blood pressure medication.
   Watch how Sam immediately identifies it as Lisinopril and
   asks if she took it today."

   [Note appears in dashboard]

   "Behind the scenes, Sam creates a MyChart note documenting
   the missed dose. This note is automatically available to
   healthcare providers."

   [Mrs. Chen mentions arthritis pain]

   "When Mrs. Chen describes hand pain, Sam connects it to her
   known arthritis condition and asks clarifying questions.
   A new note appears, and the system generates a minor health
   alert - all in real-time."
   ```

### For Judges Demo:
**Key Talking Points**:
1. "Sam proactively monitors health without feeling like a medical device"
2. "Natural conversation creates structured medical records"
3. "Integration with MyChart means doctors see the full picture"
4. "Alert system catches concerning patterns early"

---

## Health Keywords Reference

From [data/escalation-keywords.json](../../../data/escalation-keywords.json) and health service:

### Medication Keywords:
- "pill", "medication", "dose", "prescription"
- "forgot", "missed", "skipped"
- "took", "taking", "remember"

### Symptom Keywords:
- **Pain**: "hurting", "aches", "sore", "painful"
- **Breathing**: "short of breath", "wheezing", "can't breathe"
- **Dizziness**: "dizzy", "lightheaded", "faint"
- **Chest**: "chest pain", "chest pressure", "tightness"

### Emergency Keywords (should escalate to high alert):
- "chest pain", "can't breathe", "stroke symptoms"
- "severe pain", "unbearable", "emergency"

### Positive Keywords:
- "stable", "better", "improving", "good control"
- "walking", "exercise", "healthy eating"

---

## Test Data Reference

Mrs. Chen profile health data:
```json
{
  "healthData": {
    "conditions": ["arthritis", "hypertension", "type-2-diabetes"],
    "medications": [
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "daily",
        "condition": "blood pressure"
      },
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "twice daily",
        "condition": "diabetes"
      }
    ],
    "notes": []
  }
}
```

---

**Last Updated**: 2025-10-18
**Script Version**: 1.0
**Test Owner**: Developer 3 (Voice & Phone System)
