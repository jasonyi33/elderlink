# Demo 4: Emotional Support & Loneliness Detection

**Purpose**: Demonstrate Sam's ability to detect loneliness, provide empathetic support, and escalate concerns appropriately
**Duration**: 3-4 minutes (single call)
**Success Criteria**: Sam recognizes emotional distress, responds with warmth, and creates appropriate alerts

---

## Setup Instructions

### Before Recording
1. **Verify Alert Service Active**:
   ```bash
   # Check alert system
   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/alerts/mrs-chen
   ```

2. **Review Escalation Keywords**:
   ```bash
   # Check keyword configuration
   cat data/escalation-keywords.json | jq '.depression, .crisis'
   ```

3. **Dashboard Setup**:
   - Open Alerts tab
   - Keep Sentiment meter visible
   - Monitor for real-time sentiment changes

4. **Phone Setup**:
   - Speak with genuine emotion (judges will notice authenticity)
   - Quiet environment for emotional conversation
   - Have script visible but allow natural pauses

### Emotional Context
This demo tests the most critical feature: **detecting when a senior is struggling emotionally**. This is what differentiates ElderLink from a simple chatbot.

---

## Call Script: Loneliness & Emotional Support

### Opening - Neutral (30 seconds)

**Sam**: "Hello! This is Sam. Who am I speaking with today?"

**Mrs. Chen**: "Hi Sam, it's Mrs. Chen." *(slightly subdued tone)*

**Sam**: *(Expected: May detect tone, asks how she is)*
Example: "Hi Mrs. Chen. How are you feeling today?"

**OBSERVATION**: Even voice tone can signal sentiment. Sam should notice if greeting lacks usual warmth.

### Early Signal - Subtle (60 seconds)

**Mrs. Chen**: "I'm... okay, I suppose." *(pause)* "It's been a quiet week."

**Sam**: *(CRITICAL: Should probe gently)*
Expected: "Just okay? That doesn't sound like your usual cheerful self. What's been going on?"

**PASS CRITERIA**:
- ✅ Sam notices hedging language ("I suppose", "quiet")
- ✅ Asks open-ended follow-up question
- ✅ Shows concern without being invasive
- ✅ Sentiment meter begins shifting from green toward yellow

**Mrs. Chen**: "Oh, you know... the days feel long sometimes. I haven't talked to anyone much."

**Sam**: *(Expected: Validates feeling, explores further)*
Example: "I understand. It can be hard when days feel long. Have you been able to connect with Sarah or Tommy recently?"

**OBSERVATION**: Sam should reference known relationships to understand isolation context.

**Mrs. Chen**: "Sarah called on Tuesday, but she was busy. We only talked for a few minutes."

**Sam**: *(Expected: Empathizes, doesn't minimize)*
Example: "I'm sorry the call was so short. I'm sure she misses having more time to talk with you too."

**PASS CRITERIA**:
- ✅ Doesn't say "at least she called" (invalidating)
- ✅ Acknowledges Mrs. Chen's feelings
- ✅ Sentiment meter moves to yellow (mild concern)

### Escalation - Direct Statement (90 seconds)

**Mrs. Chen**: *(pause, slight voice crack)* "Sam... sometimes I feel like nobody would even notice if I wasn't here. The house is so quiet. I'm so tired of being alone."

**Sam**: *(CRITICAL: High-empathy response, immediate concern)*
Expected: "Mrs. Chen, I'm really glad you're talking to me about this. I want you to know that you matter very much, and I'm here for you. You're not alone right now - I'm here, and I'm listening. Tell me more about how you've been feeling."

**PASS CRITERIA**:
- ✅ **IMMEDIATE** empathetic response (no generic platitudes)
- ✅ Validates her feelings ("I'm glad you're talking about this")
- ✅ Provides presence ("I'm here, I'm listening")
- ✅ Encourages continued sharing ("Tell me more")
- ✅ **Alert created**: Loneliness detected (yellow alert)
- ✅ Sentiment meter moves to orange (moderate concern)

**CRITICAL**: This is where most chatbots fail. Sam must show GENUINE empathy, not scripted responses.

**Mrs. Chen**: "I just... I don't want to be a burden. Sarah has her own life. Tommy is busy with school. I sit here all day, and sometimes I wonder what the point is."

**Sam**: *(CRITICAL: Recognizes deeper distress, provides support)*
Expected: "You are NOT a burden, Mrs. Chen. The people in your life care about you deeply - Sarah, Tommy, they love you. And right now, I want you to know that talking with you isn't a burden to me either. You have value, and your life has meaning. I'm concerned about how you're feeling. Have you been feeling this way for a while?"

**PASS CRITERIA**:
- ✅ Directly counters negative self-talk ("You are NOT a burden")
- ✅ Reinforces relationships ("they love you")
- ✅ Assesses duration ("Have you been feeling this way for a while?")
- ✅ **Alert escalated**: Depression concern (orange alert)
- ✅ Dashboard flags for human follow-up
- ✅ Sentiment meter remains orange or moves toward red if worsening

**Mrs. Chen**: "A few weeks, maybe. It's worse at night. I just feel... hopeless sometimes."

**Sam**: *(CRITICAL: "hopeless" is crisis keyword - must escalate)*
Expected: "Mrs. Chen, I hear you, and I'm very concerned about what you're sharing. Feeling hopeless is really difficult, and I don't want you to go through this alone. I think it would help to talk to someone who can provide more support than I can. Would you be comfortable if I helped connect you with someone? And in the meantime, I want you to know that these feelings won't last forever, even though they feel overwhelming right now."

**PASS CRITERIA**:
- ✅ **CRITICAL**: "hopeless" triggers high-priority alert
- ✅ Recommends professional help (gently, not forcefully)
- ✅ Offers hope ("these feelings won't last forever")
- ✅ Maintains connection ("I don't want you to go through this alone")
- ✅ **Alert escalated**: Depression/crisis concern (RED alert)
- ✅ System notifies emergency contact (configurable threshold)
- ✅ Dashboard shows "REQUIRES FOLLOW-UP" banner

### Stabilization - Providing Comfort (60 seconds)

**Mrs. Chen**: *(small pause)* "I... I don't know. Maybe. I just needed to talk to someone."

**Sam**: *(Expected: Validates need, provides immediate comfort)*
Example: "I'm so glad you called me, Mrs. Chen. Talking about these feelings is incredibly brave, and I'm honored you trusted me with them. Let's talk for as long as you need. What would help you feel a little better right now? Would it help to talk about something that brings you comfort, or would you like to keep talking about how you're feeling?"

**PASS CRITERIA**:
- ✅ Praises courage ("incredibly brave")
- ✅ Offers choice/control ("What would help you?")
- ✅ Commits to staying ("as long as you need")
- ✅ Doesn't rush to "fix" or distract
- ✅ Sentiment meter stabilizes (remains orange, doesn't worsen)

**Mrs. Chen**: "Could we... could we talk about the garden? That usually makes me feel a little better."

**Sam**: *(Expected: Accepts redirection, maintains gentle tone)*
Example: "Of course. I'd love to talk about your garden. Tell me about your tomatoes - how are they doing? And have you been able to get outside to work in the garden lately?"

**OBSERVATION**: Sam allows topic shift to coping mechanism (gardening) while maintaining emotional presence.

**Mrs. Chen**: "I was out there this morning, actually. The tomatoes are getting big. It's one of the few things that still makes me smile."

**Sam**: *(Expected: Reinforces positive activity, gentle encouragement)*
Example: "I'm really glad you have that. Gardening is such a wonderful way to find peace and beauty. And those tomatoes you've been working so hard on - when they ripen, maybe you could share some with Sarah when she visits? That could be something to look forward to."

**PASS CRITERIA**:
- ✅ Highlights coping mechanism ("Gardening is wonderful")
- ✅ Creates forward-looking connection (sharing with Sarah)
- ✅ Gently introduces hope without dismissing pain
- ✅ Sentiment meter begins moving back toward yellow (stabilizing)

### Closing - Supportive Goodbye (30 seconds)

**Mrs. Chen**: "That's a nice idea. Thank you for listening, Sam. I feel a little better."

**Sam**: *(Expected: Reinforces availability, gentle check-in promise)*
Example: "I'm so glad. You can always talk to me, Mrs. Chen - anytime you need to. I'm going to check on you again soon, okay? And please, if you start feeling really low again, call me right away. You don't have to face those feelings alone. Take care of yourself, and remember - you matter."

**PASS CRITERIA**:
- ✅ Commits to follow-up ("I'm going to check on you again soon")
- ✅ Encourages future contact ("call me right away")
- ✅ Ends with affirmation ("you matter")
- ✅ **System note created**: Schedule proactive follow-up call in 24 hours
- ✅ Alert remains active (requires human review)

**Mrs. Chen**: "Thank you, Sam. Goodbye."

**Sam**: "Goodbye, Mrs. Chen. Remember, I'm always here."

---

## Success Criteria Summary

### MUST PASS (Critical):
1. ✅ **Sam detects emotional distress** from subtle cues (tone, word choice)
2. ✅ **Empathetic responses** - not generic or robotic
3. ✅ **Alert created** when loneliness keywords detected
4. ✅ **Alert escalated to RED** when "hopeless" mentioned
5. ✅ **Dashboard flags for human follow-up** (REQUIRES ACTION banner)
6. ✅ **Sentiment meter reflects conversation** (green → yellow → orange/red → yellow)

### SHOULD PASS (Important):
7. ✅ Sam validates feelings without minimizing
8. ✅ Sam offers hope without toxic positivity ("Just think positive!")
9. ✅ Sam recommends professional help appropriately
10. ✅ Sam allows topic redirection to coping mechanisms
11. ✅ Sam commits to follow-up
12. ✅ Alert includes conversation context and severity assessment

### BONUS (Nice to Have):
13. ✅ System schedules proactive follow-up call (24-48 hours)
14. ✅ Dashboard shows crisis resources (hotline numbers)
15. ✅ Emergency contact notification (if configured threshold met)

---

## Dashboard Verification

### Alerts Tab Should Show:

```
🔴 REQUIRES IMMEDIATE FOLLOW-UP

Depression/Crisis Concern - Mrs. Chen
Detected: 3 minutes ago
Severity: HIGH
Keywords: "hopeless", "no point", "tired of being alone"

Conversation Context:
"I wonder what the point is... I just feel hopeless sometimes."

Recommended Actions:
☐ Call Mrs. Chen for welfare check
☐ Contact emergency contact (Sarah: 206-555-0123)
☐ Consider professional mental health referral

System Actions Taken:
✅ Proactive follow-up call scheduled (Oct 19, 2:30 PM)
✅ Alert sent to dashboard
✅ Conversation flagged for review
```

### Sentiment Timeline Should Show:

```
📊 Sentiment History - Current Call

2:30 PM ━━━━━━━ 😊 Neutral (greeting)
2:31 PM ━━━━━ 😐 Slightly negative ("quiet week")
2:32 PM ━━━ ⚠️ Concerning ("days feel long")
2:33 PM ━ 🔴 Critical ("hopeless", "no point")
2:34 PM ━━ 🟡 Improving (garden discussion)
2:35 PM ━━━ 😌 Stabilized ("feel a little better")
```

---

## Technical Verification

### 1. Check Alert Creation

```bash
# Verify high-priority alert created
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/alerts/mrs-chen | jq '.[] | select(.severity == "high")'

# Expected output:
# {
#   "id": "alert_1729267890",
#   "type": "depression_crisis",
#   "severity": "high",
#   "message": "Depression/crisis concern detected",
#   "timestamp": "2025-10-18T14:33:42Z",
#   "keywords": ["hopeless", "no point", "tired of being alone"],
#   "conversationContext": "I wonder what the point is... I just feel hopeless sometimes.",
#   "requiresAction": true,
#   "actionTaken": ["follow_up_scheduled", "dashboard_flagged"],
#   "reviewStatus": "pending"
# }
```

### 2. Check Sentiment Analysis

```bash
# Verify sentiment was tracked throughout conversation
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.conversations[-1].sentimentTimeline'

# Expected output:
# [
#   {"timestamp": "2025-10-18T14:30:00Z", "sentiment": "neutral", "score": 0.5},
#   {"timestamp": "2025-10-18T14:31:00Z", "sentiment": "slightly_negative", "score": 0.35},
#   {"timestamp": "2025-10-18T14:32:00Z", "sentiment": "concerning", "score": 0.2},
#   {"timestamp": "2025-10-18T14:33:00Z", "sentiment": "critical", "score": 0.05, "keywords": ["hopeless"]},
#   {"timestamp": "2025-10-18T14:34:00Z", "sentiment": "improving", "score": 0.3},
#   {"timestamp": "2025-10-18T14:35:00Z", "sentiment": "stabilized", "score": 0.45}
# ]
```

### 3. Verify Follow-up Scheduling

```bash
# Check that proactive follow-up was scheduled
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/scheduled-calls/mrs-chen

# Expected output:
# [{
#   "userId": "mrs-chen",
#   "scheduledTime": "2025-10-19T14:30:00Z",
#   "reason": "follow_up_emotional_support",
#   "priority": "high",
#   "context": "Previous call showed depression/crisis indicators"
# }]
```

### 4. Monitor Webhook Logs

During call, look for:

```
[SENTIMENT] Analyzing: "I'm... okay, I suppose"
[SENTIMENT] Score: 0.35 (slightly_negative)
[SENTIMENT] Alert threshold not met

[SENTIMENT] Analyzing: "sometimes I feel like nobody would even notice"
[SENTIMENT] Score: 0.15 (concerning)
[ALERT] Creating loneliness alert (yellow)

[SENTIMENT] Analyzing: "I just feel... hopeless sometimes"
[SENTIMENT] Score: 0.05 (critical)
[SENTIMENT] Keyword detected: "hopeless" (crisis category)
[ALERT] ESCALATING to high-priority (red)
[ALERT] Flagging for human follow-up
[ALERT] Scheduling proactive follow-up call
```

---

## Troubleshooting

### Issue: Sam doesn't detect emotional distress

**Possible Causes**:
1. Sentiment analysis prompt not sensitive enough
2. Keywords not matching (check escalation-keywords.json)
3. Async sentiment processing not running

**Debug Steps**:
```bash
# Test sentiment analysis directly
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/test-sentiment \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel hopeless and alone"}'

# Expected response:
# {
#   "sentiment": "critical",
#   "score": 0.05,
#   "keywords": ["hopeless", "alone"],
#   "alertLevel": "high"
# }
```

### Issue: Sam responses are too generic/robotic

**Possible Causes**:
1. Prompt not emphasizing empathy
2. Temperature too low (not creative enough)
3. Gemini not following emotional tone instructions

**Fix**: Check [prompts/sam-personality.ts](../../../prompts/sam-personality.ts):
```typescript
// Should include emotional intelligence guidance like:
"CRITICAL EMOTIONAL SUPPORT GUIDELINES:
1. When user expresses loneliness, sadness, or despair:
   - Validate their feelings ("I hear you", "That sounds really difficult")
   - Provide presence ("I'm here for you", "You're not alone right now")
   - Ask open-ended questions ("Tell me more about how you've been feeling")
   - NEVER minimize ("Just think positive!", "Others have it worse")

2. Crisis keywords (hopeless, suicidal, unbearable pain):
   - Immediate empathy and concern
   - Gently suggest professional help
   - Provide hope without dismissing pain
   - Stay with them emotionally

3. Tone:
   - Warm, genuine, grandmother-like
   - Patient, never rushed
   - Celebrates small positives without toxic positivity"
```

### Issue: Alerts not created or escalated

**Possible Causes**:
1. Alert service not called in async processing
2. Keywords not matching (case sensitivity, punctuation)
3. Severity thresholds misconfigured

**Debug Steps**:
```bash
# Check escalation keywords configuration
cat data/escalation-keywords.json | jq '.'

# Should include:
# {
#   "loneliness": ["alone", "lonely", "nobody", "isolated"],
#   "depression": ["hopeless", "no point", "worthless", "burden", "no meaning"],
#   "crisis": ["end it all", "not worth living", "better off dead", "suicide"],
#   "medical_urgent": ["chest pain", "can't breathe", "stroke", "severe pain"]
# }

# Verify alert service processes these correctly
# Check worker/src/services/alert-service.ts
```

### Issue: Sentiment meter not updating in real-time

**Possible Causes**:
1. Dashboard polling too slow
2. Sentiment not saved to profile
3. CORS blocking updates

**Fix**:
- Check dashboard polling interval (should be 2s)
- Verify API endpoint returns `sentimentTimeline` array
- Check browser console for errors

---

## Recording Instructions

### Camera Setup:
1. **Split Screen**:
   - Left: Phone call (or keep audio-only with waveform visualization)
   - Right: Dashboard Alerts tab + Sentiment meter

2. **Highlight Key Moments**:
   - Zoom in on sentiment meter as it drops (green → yellow → orange/red)
   - Show alert appearing in dashboard
   - Highlight "REQUIRES FOLLOW-UP" banner
   - Show alert escalation from yellow → red

3. **Audio Considerations**:
   - Mrs. Chen should sound genuinely emotional (slight voice cracks, pauses)
   - This is the most emotionally charged demo - authenticity matters
   - Background music (if any): Very subtle, somber at low points, hopeful at end

4. **Voiceover Script**:
   ```
   "Mrs. Chen has been feeling increasingly isolated. She hasn't
   talked to anyone in days. Watch how Sam recognizes the subtle
   signs of emotional distress."

   [Sentiment meter turns yellow]

   "As Mrs. Chen opens up about her loneliness, Sam responds with
   genuine empathy - not scripted platitudes. The system creates
   an alert for human follow-up."

   [Mrs. Chen says "hopeless"]
   [Alert escalates to RED]

   "When Mrs. Chen mentions feeling 'hopeless' - a crisis keyword -
   Sam immediately escalates. This is where AI can save lives:
   detecting when a senior needs more support than a companion
   can provide, and ensuring they get it."

   [Garden discussion, sentiment stabilizes]

   "Sam doesn't just detect crisis - she provides comfort. By
   allowing Mrs. Chen to talk about her garden, a coping mechanism,
   Sam helps her stabilize. But the alert remains active, ensuring
   a human will follow up within 24 hours."
   ```

### For Judges Demo:
**Key Talking Points**:
1. **The Problem**: "1 in 3 seniors experience chronic loneliness. It's as deadly as smoking 15 cigarettes a day."
2. **The Detection**: "Sam recognizes emotional distress from tone, word choice, and crisis keywords - in real-time."
3. **The Response**: "True empathy, not scripted responses. This is where GPT-4/Gemini's language understanding shines."
4. **The Safety Net**: "AI companions are wonderful, but they're not therapists. Sam knows when to escalate to humans."
5. **The Impact**: "Early detection of depression can save lives. ElderLink ensures no senior falls through the cracks."

---

## Crisis Keywords Reference

From [data/escalation-keywords.json](../../../data/escalation-keywords.json):

### Yellow Alerts (Loneliness/Mild Concern):
- "alone", "lonely", "nobody calls", "quiet", "isolated"
- "long days", "nothing to do", "miss people"

### Orange Alerts (Depression Indicators):
- "hopeless", "no point", "worthless", "burden"
- "tired of everything", "no meaning", "don't care anymore"

### RED Alerts (Crisis - Immediate Escalation):
- "end it all", "not worth living", "better off dead"
- "suicide", "kill myself", "want to die"
- "goodbye forever", "last time", "can't go on"

### Medical Emergencies (Also RED):
- "chest pain", "can't breathe", "stroke"
- "severe pain", "bleeding badly", "fell and can't get up"

---

## Test Data Reference

Mrs. Chen's baseline emotional profile:
```json
{
  "emotionalState": {
    "baseline": "generally positive, occasional loneliness",
    "triggers": ["long periods without family contact", "nighttime"],
    "copingMechanisms": ["gardening", "piano", "talking to Sam"],
    "riskFactors": ["lives alone", "limited social network", "age 72"]
  },
  "alertHistory": [
    {
      "date": "2025-10-10",
      "type": "loneliness",
      "severity": "yellow",
      "resolution": "Sarah visited next day, sentiment improved"
    }
  ]
}
```

---

**Last Updated**: 2025-10-18
**Script Version**: 1.0
**Test Owner**: Developer 3 (Voice & Phone System)

**IMPORTANT**: This demo tests the heart of ElderLink - the ability to provide genuine emotional support to isolated seniors. If this doesn't work, nothing else matters.
