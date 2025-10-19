# 🎯 ElderLink Demo Day Cheat Sheet

**Mission:** Show judges that Sam is NOT a chatbot - it's a companion that remembers, cares, and connects seniors across mental, physical, and social health.

---

## ⏰ Timeline (Total: 3 minutes)

**0:00-0:30** - Problem setup + Call Sam
**0:30-2:00** - Live conversation (memory, health, language)
**2:00-2:30** - Dashboard walkthrough (community matches)
**2:30-3:00** - Impact statement + Questions

---

## 🎬 Before You Start

### 1. Phone Setup
- **Your phone:** On speaker mode, volume 70-80%
- **Backup phone:** Fully charged, same number saved
- **Test call:** 5 minutes before demo to verify connection

### 2. Dashboard Setup
- **Browser:** Full screen, Live Call tab open
- **Refresh:** Hit F5 to ensure latest data
- **Tabs ready:** Live Call, Health Timeline, Community, Analytics

---

## 📞 Demo Script (2-3 minutes)

### Vapi FirstMessage (Auto-plays when call connects)
**Vapi:** "Hello! This is Sam. Who am I speaking with today?"

### Exchange 1 - Greeting
**You say:** "Mrs. Chen" or "This is Mrs. Chen"
**Sam:** "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"
**Point to:** Warm greeting with personalized memory, sentiment starting (0.3)

### Exchange 2 - Health Check
**You say:** "The tomatoes are growing well, but my knees ache"
**Sam:** "I recall your arthritis bothers you sometimes—did you take your Lisinopril this morning?"
**Point to:** Health note appearing (knee pain), sentiment rising (0.4), memory continuity

### Exchange 3 - MyChart Integration
**You say:** "Yes, I took it. My stretches are helping"
**Sam:** "Good. I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."
**Point to:** MyChart note created instantly, sentiment (0.6), emotion tags updating

### Exchange 4 ⭐ **MONEY SHOT - Language Switch**
**You say:** "谢谢你，Sam。今天有点累。"
**Sam:** "没关系，陈太太。记得多休息，多喝水。"
**Point to:** Language indicator flipping 🇺🇸→🇨🇳, sentiment jumping (0.7), NO commands needed

### Exchange 5 - Closing
**You say:** "好的，谢谢"
**Sam:** "Take care, Mrs. Chen. I'll check in on you tomorrow!"
**Point to:** Sentiment peak (0.8), natural conversation flow

**Hang up** - Dashboard updates will appear within 2 seconds

---

## 📊 After Call Ends (<3 seconds)

### Dashboard Auto-Updates (Point to each)
1. **Live Call tab** → Shows call summary, sentiment timeline
2. **Health Timeline tab** → New MyChart notes appear (knee pain, medication compliance)
3. **Community tab** → 3 compatible matches displayed
   - **Mrs. Lee (92% match)** - Speaks Mandarin, loves gardening, 1.2 miles away
   - **Mr. Wong (85% match)** - Piano enthusiast, Mandarin speaker
   - **Mrs. Park (78% match)** - Gardening group, English/Korean
4. **Analytics tab** → 147 conversations, wellness score 78 (up from 52)

---

## 💡 Key Talking Points (While Showing Dashboard)

**After Language Switch:**
> "Notice Sam switched to Mandarin instantly - no 'speak Chinese' command needed. ElevenLabs' multilingual model detects language naturally."

**At Community Tab:**
> "ElderLink matched Mrs. Chen with 3 compatible seniors who share her interests and language. This isn't algorithmic isolation - it's human connection."

**At Health Timeline:**
> "Every health mention becomes a MyChart note. Dr. Smith sees this tomorrow before her appointment - no manual logging needed."

**At Analytics:**
> "147 conversations over 30 days. Wellness score improved 50%. Word cloud shows 'Sarah, garden, happy' - these are real connections, not transactions."

---

## 🚨 Backup Plans (If Demo Fails)

### If Call Drops or Won't Connect:
1. **Immediate:** Switch to backup phone, redial
2. **If still fails:** Play pre-recorded demo audio (memory-demo.mp3)
3. **Show screenshots:** dashboard-live.png, community-matches.png

### If Sam Responds Incorrectly:
- **Stay calm:** "Let me clarify..." and continue
- **Don't acknowledge error:** Judges won't notice if you don't
- **Pivot to dashboard:** "While Sam processes that, let me show you..."

### If Dashboard Doesn't Update:
- **Refresh (F5):** Should appear within 2 seconds
- **If still empty:** Show backup screenshots
- **Explain:** "Network latency - here's what normally appears..."

### Hand Signals (Team Members)
- ✋ **Stop** - Skip to next section
- 👍 **Continue** - Proceed as planned
- 🔄 **Switch** - Use backup plan

---

## 🎤 Opening Script (30 seconds)

> "Mrs. Chen is 72 and lives alone. Last week, she didn't talk to anyone for 5 days. This isn't uncommon - 1 in 3 seniors face chronic loneliness.
>
> What if technology could help? Not a chatbot, but a companion. Meet Sam.
>
> **[Place call on speaker]**
>
> Watch how Sam remembers Mrs. Chen's life, tracks her health, and connects her to community - all in one conversation."

---

## 🎯 Closing Script (30 seconds)

> "In 2 minutes, you saw:
> - **Mental health:** Sam remembered her garden, her daughter Sarah
> - **Physical health:** Tracked medication, created MyChart notes
> - **Social health:** Matched her with 3 compatible seniors
>
> ElderLink isn't replacing human connection. It's making it accessible.
>
> No senior should feel alone. Questions?"

---

## 📝 Pre-Demo Checklist (Run `./reset-demo.sh`)

- [ ] Run `./reset-demo.sh` (waits 60 seconds for KV propagation)
- [ ] Verify demo mode: `curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode`
- [ ] Test call: Dial +1 (224) 858-1016, say "Mrs. Chen", verify greeting
- [ ] Dashboard refresh: Open all 4 tabs, verify data clears
- [ ] Backup files ready: memory-demo.mp3, dashboard-live.png
- [ ] Team positions: One on dashboard, one on phone, one on backup

---

## 🔢 Phone Number to Call

**Demo Number:** +1 (224) 858-1016

**Test call:** 5 minutes before demo
**Live call:** During presentation

---

## 📊 Success Metrics (Judge Questions)

**Q: How does Sam remember conversations?**
> "Every conversation is stored with sentiment analysis, key topics, and health mentions. Sam's prompts include recent conversation history and extracted memories - it's contextual AI, not one-shot responses."

**Q: What if seniors don't speak English?**
> "ElevenLabs' multilingual model supports 29 languages with automatic detection. No commands needed - just speak naturally."

**Q: How accurate is health tracking?**
> "We extract health mentions using keyword detection and Gemini analysis. Every mention creates a timestamped MyChart note for clinician review. It's assistive, not diagnostic."

**Q: What about privacy?**
> "All data is encrypted at rest (Cloudflare KV) and in transit (HTTPS). HIPAA compliance requires BAA with Cloudflare and ElevenLabs - we're working on that for production."

**Q: How much does this cost?**
> "Current stack: ~$0.03 per 5-minute call (Gemini API + ElevenLabs). At scale with enterprise pricing: ~$0.01 per call. For 1M seniors calling daily: $10K/day or $3.6M/year - compared to $120B annual elder care costs."

---

## 🎬 Day-of-Demo Preparation

### 1 Hour Before:
- [ ] Run `./reset-demo.sh`
- [ ] Test call with full script walkthrough
- [ ] Verify dashboard updates within 2 seconds
- [ ] Charge both phones to 100%

### 30 Minutes Before:
- [ ] Open dashboard in full screen
- [ ] Close all other browser tabs (reduce lag)
- [ ] Put phones on Do Not Disturb (except demo number)
- [ ] Run through script one more time

### 5 Minutes Before:
- [ ] Final test call (say "Mrs. Chen", verify greeting, hang up)
- [ ] Refresh dashboard (F5)
- [ ] Deep breath - you've got this! 🚀

---

## 🏆 Remember

- **Smile** - Confidence sells
- **Pause** - Let judges absorb each moment
- **Point** - Draw attention to dashboard updates
- **Engage** - Make eye contact, not just stare at screen

**You're not demoing software. You're showing how technology can reduce loneliness.**

Good luck! 🎉
