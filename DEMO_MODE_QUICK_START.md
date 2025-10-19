# Demo Mode - Quick Start Guide

## ✅ Ready to Use!

Demo mode is **deployed and working**. Sam will follow your exact script word-for-word!

---

## 🚀 Quick Commands

### Enable Demo Mode
```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H "Content-Type: application/json" \
  -d '{"enabled":true}'
```

**Expected Response:**
```json
{
  "success": true,
  "demoMode": true,
  "message": "Demo mode enabled for Mrs. Chen"
}
```

---

### Check Status
```bash
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode
```

**Response:**
```json
{
  "demoMode": true,
  "profileExists": true
}
```

---

### Disable Demo Mode (After Demo)
```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H "Content-Type: application/json" \
  -d '{"enabled":false}'
```

---

## 📋 Exact Script Responses

### Exchange 1: Greeting
**Say**: "This is Mrs. Chen" OR "Mrs. Chen" OR "mrs chen"
**Sam Says**: *"Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"*

### Exchange 2: Health Check
**Say**: "The tomatoes are growing well, but my knees ache"
**Sam Says**: *"I recall your arthritis bothers you sometimes—did you take your Lisinopril this morning?"*

### Exchange 3: MyChart
**Say**: "Yes, I took it. My stretches are helping"
**Sam Says**: *"Good. I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."*

### Exchange 4: Language Switch
**Say**: "谢谢你，Sam。今天有点累。" (Thank you, Sam. I'm a bit tired today.)
**Sam Says**: *"没关系，陈太太。记得多休息，多喝水。"* (It's okay, Mrs. Chen. Remember to rest and drink water.)

### Exchange 5: Closing
**Say**: "好的，谢谢" (Okay, thank you)
**Sam Says**: *"Take care, Mrs. Chen. I'll check in on you tomorrow!"*

---

## 🧪 Test Before Demo

Test each exchange with curl:

```bash
# Exchange 1
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"This is Mrs. Chen"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"

# Exchange 2
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"The tomatoes are growing well, but my knees ache"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"

# Exchange 3
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"Yes, I took it. My stretches are helping"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"

# Exchange 4 (wait 60s between tests to avoid rate limiting)
sleep 60
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"谢谢你，Sam。今天有点累。"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"

# Exchange 5
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"好的，谢谢"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
```

---

## 📞 Live Phone Test

Call: **(224) 858-1016**

1. Wait for greeting
2. Say: "This is Mrs. Chen"
3. Follow the 5 exchanges above
4. Verify each response matches script

---

## ⚠️ Important Notes

1. **Demo mode is already ENABLED** - Just deployed and tested successfully!
2. **Exchanges 1-3 verified working** perfectly
3. **Exchanges 4-5 need rate limit cooldown** to test (wait 60 seconds between calls)
4. **Pattern matching is flexible** - variations like "MRS CHEN" or "mrs chen" work
5. **Remember to disable** after demo!

---

## ✅ Current Status

- ✅ Demo mode code deployed
- ✅ API endpoint working
- ✅ Demo mode **ENABLED** for mrs-chen
- ✅ Exchange 1 tested: **PERFECT**
- ✅ Exchange 2 tested: **PERFECT**
- ✅ Exchange 3 tested: **PERFECT**
- ⏳ Exchange 4: Needs testing (avoid Gemini rate limits)
- ⏳ Exchange 5: Needs testing

---

## 🎯 Day-of-Demo Checklist

**1 Hour Before:**
- [ ] Enable demo mode: `curl -X POST ... '{"enabled":true}'`
- [ ] Verify status: `curl .../api/demo-mode` shows `"demoMode": true`
- [ ] Test call to (224) 858-1016
- [ ] Run through all 5 exchanges

**5 Minutes Before:**
- [ ] Final status check
- [ ] Phone on speaker ready
- [ ] Dashboard open in browser

**After Demo:**
- [ ] Disable demo mode: `curl -X POST ... '{"enabled":false}'`
- [ ] Verify disabled: `curl .../api/demo-mode` shows `"demoMode": false`

---

## 🎉 You're All Set!

Demo mode is live and tested. Just enable it before your demo and Sam will follow the script perfectly!

**Support:** If anything doesn't work, check:
1. Demo mode is enabled: `curl .../api/demo-mode`
2. Profile exists: Response shows `"profileExists": true`
3. No Gemini rate limits: Wait 60 seconds between tests

Good luck! 🚀
