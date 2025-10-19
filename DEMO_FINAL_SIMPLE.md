# ElderLink Demo - Final Simple Version

## ✅ Demo Mode: SEQUENTIAL (No Keywords Required!)

### How It Works
- System tracks exchange number (1, 2, 3, 4, 5)
- After you speak, it responds with the scripted line for that number
- **You can say ANYTHING** - no specific words needed
- Auto-increments to next exchange

## 📞 Phone: (224) 858-1016

## 🎯 The 5 Exchanges

### Exchange 1
**You say**: *Anything* (e.g., "Hello")
**Sam**: "Hello, Mrs. Chen! It's so nice to hear from you again... How's your garden doing this week?"

### Exchange 2
**You say**: *Anything* (e.g., "They're doing great")
**Sam**: "Oh, I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes... did you take your Lisinopril this morning?"

### Exchange 3
**You say**: *Anything* (e.g., "Yes I did")
**Sam**: "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

### Exchange 4
**You say**: *Anything* (can say in English or Chinese)
**Sam**: "没关系，陈太太... 记得多休息，多喝水。" *(Mandarin response)*

### Exchange 5
**You say**: *Anything* (e.g., "Okay, thank you")
**Sam**: "Take care, Mrs. Chen... I'll check in on you tomorrow!"

## 🔄 Reset Demo (Start Fresh)

Run this before each demo to start from exchange 1:

```bash
curl -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode' \
  -H 'Content-Type: application/json' \
  -d '{"enabled": true}'
```

## ✅ Key Features to Highlight

1. **Memory**: Sam remembers without being told (mentions garden, arthritis, medication)
2. **Health Tracking**: Proactively asks about medication, creates MyChart note
3. **Multilingual**: Responds in Mandarin naturally
4. **Emotional Voice**: Warm pauses, empathy ("Oh, I'm sorry...")
5. **Dashboard**: Real-time updates during call

## 📊 Dashboard Points

Show while on call:
- Real-time sentiment meter
- Health timeline (knee pain note)
- Community matches (3 seniors)
- Wellness score

## 💡 Pro Tips

- **Just talk naturally** - no script memorization
- **Short responses work** - "Okay", "Yes", "Thank you" all work
- **Transcription doesn't matter** - system follows sequence not keywords
- **Can't mess up** - it will always go 1→2→3→4→5

## 🚀 Day-of-Demo Checklist

- [ ] Run reset command to start at exchange 1
- [ ] Check status: `curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode`
- [ ] Verify `demoExchangeNumber: 1`
- [ ] Have dashboard open
- [ ] Phone number visible: (224) 858-1016
- [ ] Relax and talk naturally!

---

**That's it!** No memorization, no keywords, no stress. Just call and talk! 🎉
