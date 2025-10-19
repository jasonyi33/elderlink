# Enable Demo Mode for Mrs. Chen

## ✅ Demo Mode Implemented

Demo mode is now implemented and will make Sam follow your exact demo script word-for-word!

## 🔧 How to Enable

Run this command to enable demo mode:

```bash
curl -X PUT https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode/mrs-chen \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

To disable demo mode later:

```bash
curl -X PUT https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode/mrs-chen \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

**OR** you can manually clear and reload the profile:

```bash
# Clear current profile
npx wrangler kv key delete --env dev --binding KV --preview false "profile:mrs-chen"

# Next call will auto-reload with demoMode: true
```

## 📝 What Demo Mode Does

When enabled, Sam will respond with **EXACT** phrases from your script:

### Exchange 1: Greeting
**User says**: "Mrs. Chen" or "This is Mrs. Chen"
**Sam says**: "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"

### Exchange 2: Health Check
**User says**: "The tomatoes are growing well, but my knees ache"
**Sam says**: "I recall your arthritis bothers you sometimes—did you take your Lisinopril this morning?"

### Exchange 3: MyChart
**User says**: "Yes, I took it. My stretches are helping"
**Sam says**: "Good. I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

### Exchange 4: Language Switch
**User says**: "谢谢你，Sam。今天有点累。" (Thank you, Sam. I'm a bit tired today.)
**Sam says**: "没关系，陈太太。记得多休息，多喝水。" (It's okay, Mrs. Chen. Remember to rest and drink water.)

### Exchange 5: Closing
**User says**: "好的，谢谢" (Okay, thank you)
**Sam says**: "Take care, Mrs. Chen. I'll check in on you tomorrow!"

---

## 🎯 Testing

After enabling, test with:

```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"This is Mrs. Chen"}]}'
```

You should see:
```json
{
  "content": "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?"
}
```

---

## ⚠️ Important Notes

1. **Demo mode ONLY affects Gemini prompts** - all other functionality (health tracking, sentiment, etc.) works normally
2. **Pattern matching is flexible** - Sam recognizes variations like "mrs chen", "this is mrs", etc.
3. **Fallback included** - If message doesn't match script, Sam gives a warm generic response
4. **Turn OFF after demo** - Remember to disable demo mode for real usage!

---

## 🚨 Current Status

- ✅ Code deployed
- ✅ Demo script patterns implemented
- ⚠️ **Demo mode NOT yet enabled** - profile still has old version without `demoMode: true`
- ⏳ Waiting for profile refresh

**Next Step**: Clear the profile or wait for it to expire, then next call will load with demo mode enabled!
