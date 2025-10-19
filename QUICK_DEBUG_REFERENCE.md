# Quick Debug Reference - Demo Mode

**Use this guide for rapid troubleshooting during demo preparation**

---

## 🔍 Quick Status Check

```bash
# One-liner to check all critical state
curl -s https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode | jq && \
npx wrangler kv key get --env dev --binding KV --remote "senior-mrs-chen" 2>&1 | head -1 && \
npx wrangler kv key get --env dev --binding KV --remote "senior-mrs-chen-backup" 2>&1 | head -1
```

**Expected output:**
```
{ "isDemoMode": true, "message": "🎬 Demo mode ACTIVE..." }
Error: Failed to fetch... 404 Not Found  ✅ (Profile deleted)
{ "id": "mrs-chen", ... }  ✅ (Backup exists)
```

---

## 🚨 Common Failures & Instant Fixes

### Issue: "exchangeNumber: 11 instead of 1"

**Cause:** Profile not deleted

**Fix:**
```bash
npx wrangler kv key delete --env dev --binding KV --remote "senior-mrs-chen"
sleep 60
```

---

### Issue: "Used Gemini API during demo"

**Symptoms in logs:**
```
[SAM] Calling real Gemini API...
[GEMINI] Calling API with timeout: 7000 ms
```

**Cause:** Demo mode logic reverted OR profile exists

**Fix:**
```bash
# Check deployed version
curl -s https://elderlink-dev.elderlinkhelper.workers.dev/ | grep "Version"

# Should show: 62dd75c9-a4e4-48ed-b43d-7d52e001c91e (or newer)
# If not, redeploy:
npx wrangler deploy --env dev
```

---

### Issue: "isDemoMode: false"

**Cause:** KV propagation incomplete

**Fix:**
```bash
# Force enable
npx wrangler kv key put --env dev --binding KV --remote demo-mode-active "true"
sleep 60

# Verify
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode | jq
```

---

### Issue: "Dashboard not updating"

**Cause:** Live sentiment not saving OR CORS

**Fix:**
```bash
# Check live sentiment key
npx wrangler kv key get --env dev --binding KV --remote "live-sentiment-mrs-chen"

# If empty, check worker logs for errors
npx wrangler tail --env dev --format pretty
```

---

## ✅ Perfect State Checklist

Before calling, verify ALL of these:

- [ ] Demo mode API returns `"isDemoMode": true"`
- [ ] Profile key returns `404 Not Found`
- [ ] Backup key exists and has `conversations` array
- [ ] Worker version is `62dd75c9-a4e4-48ed-b43d-7d52e001c91e` or newer
- [ ] Reset script completed and showed "✨ System Ready for Demo!"
- [ ] At least 60 seconds passed since running reset script

---

## 📋 Expected Log Sequence (First 10 seconds of call)

```
[VAPI] Webhook request received: 2025-...
[VAPI] Phone: +12248581016 → Senior ID: mrs-chen
[KV] getProfile called for: mrs-chen
[KV] Profile retrieved: mrs-chen  ← Should have 0 conversations
[DEMO] Mode check: { isDemoMode: true, exchangeNumber: 1, scriptLength: 5 }
[DEMO] Using scripted response: { exchange: 1, language: 'english', ... }
[DEMO] Live sentiment saved for instant dashboard update
[VAPI] Response generated in 45ms
```

**Red flags (should NOT appear):**
- ❌ `[LIVE] Language detection: ...`
- ❌ `[SAM] Calling real Gemini API...`
- ❌ `exchangeNumber: 11` (or any number > 1 on first exchange)
- ❌ `isDemoMode: false`

---

## 🔧 Nuclear Reset (Last Resort)

If nothing works, run this:

```bash
#!/bin/bash
# Nuclear reset - clears ALL demo state

echo "🔥 Nuclear reset starting..."

# Delete all related keys
npx wrangler kv key delete --env dev --binding KV --remote "senior-mrs-chen" 2>/dev/null
npx wrangler kv key delete --env dev --binding KV --remote "senior-mrs-chen-backup" 2>/dev/null
npx wrangler kv key delete --env dev --binding KV --remote "demo-mode-active" 2>/dev/null
npx wrangler kv key delete --env dev --binding KV --remote "live-sentiment-mrs-chen" 2>/dev/null
npx wrangler kv key delete --env dev --binding KV --remote "call-state-mrs-chen" 2>/dev/null

echo "⏳ Waiting 60 seconds for deletions to propagate..."
sleep 60

# Create fresh backup profile
echo "📝 Creating fresh backup profile..."
cat > /tmp/backup-profile.json << 'EOF'
{
  "id": "mrs-chen",
  "name": "Mrs. Chen",
  "age": 72,
  "languages": ["english", "mandarin"],
  "conversations": [
    {
      "timestamp": "2025-10-01T10:00:00Z",
      "seniorMessage": "Hello Sam, my garden is doing well!",
      "samResponse": "That's wonderful to hear, Mrs. Chen! How are the tomatoes?",
      "sentiment": 0.7,
      "emotions": ["happy", "engaged"]
    },
    {
      "timestamp": "2025-10-02T14:30:00Z",
      "seniorMessage": "The tomatoes are growing nicely",
      "samResponse": "I'm so glad! Remember to water them regularly.",
      "sentiment": 0.6,
      "emotions": ["content", "peaceful"]
    }
  ],
  "memories": {
    "family": ["Sarah (daughter)"],
    "hobbies": ["gardening", "tomatoes"],
    "health": ["arthritis", "takes Lisinopril"]
  },
  "healthData": {
    "medications": [{"name": "Lisinopril", "dosage": "10mg"}],
    "conditions": ["arthritis"],
    "notes": []
  }
}
EOF

npx wrangler kv key put --env dev --binding KV --remote "senior-mrs-chen-backup" "$(cat /tmp/backup-profile.json)"

# Enable demo mode
npx wrangler kv key put --env dev --binding KV --remote demo-mode-active "true"

echo "⏳ Waiting 60 seconds for writes to propagate..."
sleep 60

echo "✅ Nuclear reset complete!"
echo "🎬 System ready for demo call"
```

Save as `nuclear-reset.sh`, make executable, run only if normal reset fails.

---

## 📞 During Live Demo

If demo fails mid-call:

1. **Keep talking naturally** - Stall for time
2. **Check logs in real-time** - Look for `[DEMO]` vs `[LIVE]` markers
3. **Have backup ready** - Screenshot of working demo or video recording
4. **Worst case** - Switch to dashboard walkthrough showing historical data

---

**Last Updated:** 2025-10-19 10:30 AM PST
