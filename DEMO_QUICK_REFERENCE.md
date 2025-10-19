# ElderLink Demo - Quick Reference Card

## 📞 Phone Number
**Call Sam**: (224) 858-1016

## 🎯 Demo Status
- ✅ Demo Mode: **ENABLED**
- ✅ Voice Optimization: **APPLIED**
- ✅ All 5 Exchanges: **TESTED & WORKING**

## 📝 Demo Script (5 Exchanges)

### Exchange 1: Initial Greeting
**You say**: "Hello, this is Mrs. Chen"

**Sam responds**:
> "Hello, Mrs. Chen! It's so nice to hear from you again... How's your garden doing this week?"

**Listen for**: Warm, enthusiastic tone with natural pause

---

### Exchange 2: Garden + Health Concern
**You say**: "My tomatoes are growing great, but my knee aches a bit"

**Sam responds**:
> "Oh, I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes... did you take your Lisinopril this morning?"

**Listen for**: Empathy ("Oh, I'm sorry"), caring pause, remembers medication

---

### Exchange 3: Medication Confirmation
**You say**: "Yes I took it, and the stretches are helping too"

**Sam responds**:
> "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

**Listen for**: Enthusiastic encouragement, proactive health tracking, appointment reminder

---

### Exchange 4: Language Switch - Mandarin
**You say** (in Mandarin): "谢谢你，Sam。我今天有点累"
*(Translation: "Thank you, Sam. I'm a little tired today")*

**Sam responds** (in Mandarin):
> "没关系，陈太太... 记得多休息，多喝水。"
> *(Translation: "It's okay, Mrs. Chen... remember to rest more and drink more water.")*

**Listen for**: Voice switches to Mandarin, gentle caring tone

---

### Exchange 5: Closing
**You say** (in Mandarin): "好的，谢谢"
*(Translation: "Okay, thank you")*

**Sam responds** (in English):
> "Take care, Mrs. Chen... I'll check in on you tomorrow!"

**Listen for**: Warm goodbye with promise to reconnect

---

## 🎤 Voice Settings (Optimized for Emotion)

| Parameter | Value | Effect |
|-----------|-------|--------|
| Stability | 0.5 | Natural emotional variation |
| Style | 0.75 | More expressive & caring |
| Speaker Boost | ON | Enhanced warmth & clarity |
| Model | eleven_multilingual_v2 | English + Mandarin |

## 🔄 Quick Commands

### Toggle Demo Mode
```bash
# Enable
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'

# Disable
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'

# Check Status
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode
```

## 🚨 Troubleshooting During Demo

### If Sam doesn't respond correctly:
1. **Speak clearly** - Pattern matching needs key words
2. **Pace yourself** - Give Sam time to process
3. **Use key phrases**:
   - Exchange 1: "Mrs. Chen"
   - Exchange 2: "tomatoes" + "knee" or "ache"
   - Exchange 3: "yes" or "took" + "stretch"
   - Exchange 4: "谢谢" + "累"
   - Exchange 5: "好的" + "谢谢"

### If voice sounds robotic:
- Voice settings have been optimized (stability: 0.5, style: 0.75)
- This should NOT happen with new settings
- Backup: mention in demo that we can fine-tune further

### If latency is too high:
- Demo mode bypasses Gemini (should be <10ms)
- Phone lag is normal (1-2 seconds)
- This is much faster than competitors

## 📊 Dashboard Highlights to Show

While on the call, show:

1. **Real-time Sentiment** - Should update during conversation
2. **Health Timeline** - Note about knee pain should appear
3. **Community Matches** - 3 compatible seniors
4. **Word Cloud** - "garden", "tomatoes", "Sarah" visible

## 🎯 Key Demo Points to Emphasize

1. **Memory**: Sam remembers garden without being told
2. **Health Tracking**: Proactively asks about medication
3. **Multilingual**: Seamless switch to Mandarin
4. **Emotional**: Warm, caring, NOT robotic
5. **Dashboard**: Live updates show comprehensive care

## ⏱️ Timing
- **Total call**: ~90 seconds
- **Each exchange**: 15-20 seconds
- **Buffer time**: 30 seconds for transitions

## 🔐 Backup Plan

If live demo fails:
1. Pre-recorded call audio ✅
2. Screenshots of dashboard ✅
3. Verbal walkthrough of features
4. Show test results from development

## 📱 Contact for Support
- Phone line: (224) 858-1016
- Dashboard: https://elderlink-dev.elderlinkhelper.workers.dev
- Logs: Running in background (wrangler tail)

---

**Last Updated**: 2025-10-19
**Version**: 4910e3ff-2e5c-4722-a734-3fccc233cd33
**Status**: ✅ READY FOR DEMO
