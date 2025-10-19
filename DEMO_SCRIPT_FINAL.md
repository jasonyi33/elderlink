# ElderLink Demo Script - Final (4 Exchanges)

## 📞 Call: (224) 858-1016

## How It Works

**Vapi automatically says the first message** when the call starts:
> "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"

Then you respond, and the system goes through **4 sequential exchanges**.

---

## The 4 Exchanges

### Exchange 1: Your First Response
**You say**: *Anything* (e.g., "They're doing great!" or just "Good")

**Sam responds**:
> "Oh, I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes... did you take your Lisinopril this morning?"

**What this shows**:
- ✅ Memory (remembers arthritis without being told)
- ✅ Health tracking (mentions specific medication)
- ✅ Natural conversation flow

---

### Exchange 2: Medication Response
**You say**: *Anything* (e.g., "Yes I did" or "Yes")

**Sam responds**:
> "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

**What this shows**:
- ✅ Proactive health tracking (creates MyChart note)
- ✅ Appointment management
- ✅ Warm encouragement

---

### Exchange 3: Switch to Mandarin
**You say**: *Anything* (can be in English or Chinese - e.g., "Thank you" or "谢谢")

**Sam responds** (in Mandarin):
> "没关系，陈太太... 记得多休息，多喝水。"
> *(Translation: "It's okay, Mrs. Chen... remember to rest more and drink more water.")*

**What this shows**:
- ✅ Multilingual support (responds in Mandarin)
- ✅ Cultural sensitivity
- ✅ Health advice

---

### Exchange 4: Closing
**You say**: *Anything* (e.g., "Okay" or "好的")

**Sam responds**:
> "Take care, Mrs. Chen... I'll check in on you tomorrow!"

**What this shows**:
- ✅ Warm closure
- ✅ Promise of continuity
- ✅ Relationship building

---

## Complete Flow Example

| Person | Says | Notes |
|--------|------|-------|
| **Sam** (auto) | "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?" | Vapi firstMessage |
| **You** | "They're doing great!" | Anything works |
| **Sam** | "Oh, I'm sorry to hear about your knee..." | Exchange 1 |
| **You** | "Yes I took it" | Anything works |
| **Sam** | "That's wonderful to hear! I'll note that down..." | Exchange 2 |
| **You** | "Thank you" | Anything works |
| **Sam** | "没关系，陈太太... 记得多休息，多喝水。" | Exchange 3 (Mandarin) |
| **You** | "Okay" | Anything works |
| **Sam** | "Take care, Mrs. Chen... I'll check in on you tomorrow!" | Exchange 4 |

---

## Reset Command (Run Before Demo)

```bash
curl -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode' \
  -H 'Content-Type: application/json' \
  -d '{"enabled": true}'
```

**Response**:
```json
{
  "success": true,
  "demoMode": true,
  "demoExchangeNumber": 1,
  "message": "Demo mode enabled for Mrs. Chen"
}
```

---

## Dashboard Points to Highlight

While on the call, show:

1. **Real-time Sentiment** - Watch it update as you talk
2. **Health Timeline** - New note appears about knee/medication
3. **Community Matches** - 3 compatible seniors displayed
4. **Wellness Score** - Overall health metrics
5. **Word Cloud** - "garden", "tomatoes", "Sarah" visible

---

## Key Demo Messages

### Introduction (30 seconds)
> "ElderLink addresses the loneliness epidemic through Sam, an AI companion accessible by phone. Unlike chatbots, Sam provides holistic care across three dimensions: **mental health** through warm conversations with memory, **physical health** through natural monitoring with MyChart integration, and **social health** through community matching for real connections."

### During Call (point out features)
1. **After Exchange 1**: "Notice Sam remembers her arthritis and medication without being told"
2. **After Exchange 2**: "See the MyChart note being created in real-time on the dashboard"
3. **After Exchange 3**: "Watch how naturally it switches to Mandarin - that's ElevenLabs multilingual voice"
4. **After Exchange 4**: "The relationship continues - Sam promises to check in tomorrow"

### Closing (30 seconds)
> "This is more than technology - it's companionship. While competitors focus on emergency alerts, ElderLink prevents crises through daily connection. Mrs. Chen hasn't just talked to AI - she's had a conversation with a friend who remembers her, cares about her health, and will connect her with others who share her interests."

---

## Troubleshooting

### If the call doesn't follow the script:
- Check that demo mode is enabled: `curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode`
- Reset by running the enable command again

### If Vapi doesn't answer:
- Phone number might be experiencing issues
- Have the recorded backup ready
- Show screenshots of previous successful calls

### If dashboard doesn't update:
- Refresh the page
- The data updates within 2-3 seconds after each exchange

---

## Deployment Info

**Version**: `5c335a2f-d5ce-42e1-87ec-3ff2f379d755`
**Phone**: (224) 858-1016
**Dashboard**: https://elderlink-dev.elderlinkhelper.workers.dev
**Status**: ✅ Ready for demo

---

## Timeline (Total: 90-120 seconds)

- **0:00-0:10**: Introduction & context
- **0:10-0:15**: Call the number on speaker
- **0:15-0:20**: Vapi greeting plays
- **0:20-0:35**: Exchange 1 (garden → knee/medication)
- **0:35-0:50**: Exchange 2 (medication confirmation → MyChart note)
- **0:50-1:05**: Exchange 3 (Mandarin response)
- **1:05-1:20**: Exchange 4 (closing)
- **1:20-1:30**: Dashboard walkthrough
- **1:30-2:00**: Closing message & questions

---

**You're ready! Just call, talk naturally, and let the system handle the rest.** 🎉
