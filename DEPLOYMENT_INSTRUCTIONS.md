# ElderLink Deployment Instructions

**Task:** 3.1g - Deploy Worker to Cloudflare Dev Environment  
**Status:** Code ready, awaiting credential configuration  

---

## ⚠️ PREREQUISITES (Task 1.1b)

Before deploying, ensure these are configured:

### 1. Cloudflare Authentication
**Option A:** Login interactively
```bash
wrangler login
```

**Option B:** Use API token
```bash
export CLOUDFLARE_API_TOKEN=<your-token>
# Get token from: https://dash.cloudflare.com/profile/api-tokens
```

### 2. Set Wrangler Secrets (Required for functionality)
```bash
# Gemini API Key
wrangler secret put GEMINI_API_KEY --env dev
# Enter: <your-gemini-api-key>

# Vapi API Key
wrangler secret put VAPI_API_KEY --env dev
# Enter: <your-vapi-api-key>

# ElevenLabs English Voice ID
wrangler secret put ELEVENLABS_ENGLISH_VOICE --env dev
# Enter: <elevenlabs-english-voice-id>

# ElevenLabs Mandarin Voice ID
wrangler secret put ELEVENLABS_MANDARIN_VOICE --env dev
# Enter: <elevenlabs-mandarin-voice-id>
```

---

## 🚀 DEPLOYMENT COMMANDS

### Deploy to Dev Environment
```bash
cd /Users/bowenxia/elderlink
wrangler deploy --env dev
```

**Expected Output:**
```
⛅️ wrangler 4.43.0
-------------------
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded elderlink-dev (X.XX sec)
Published elderlink-dev (X.XX sec)
  https://elderlink-dev.<account-id>.workers.dev
```

### Verify Deployment
```bash
# Test health check endpoint
curl https://elderlink-dev.<account-id>.workers.dev/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-01-19T...","environment":"development",...}
```

---

## 📢 SHARE WITH TEAM (Hour 2 Critical Handoff)

Once deployed, **immediately share** in team channel:

```
✅ Worker Deployed!
🔗 URL: https://elderlink-dev.<account-id>.workers.dev
🏥 Health Check: https://elderlink-dev.<account-id>.workers.dev/api/health
📞 Webhook: https://elderlink-dev.<account-id>.workers.dev/vapi-webhook

All developers: Please test /api/health endpoint to verify connectivity
```

---

## 🔧 TROUBLESHOOTING

### Error: "CLOUDFLARE_API_TOKEN not set"
**Solution:** Run `wrangler login` or set environment variable

### Error: "Unauthorized"
**Solution:** Check account_id in wrangler.toml matches your Cloudflare account

### Error: "KV namespace not found"
**Solution:** Run `wrangler kv:namespace create "ELDERLINK_KV"` and update wrangler.toml

### Error: "Secrets not found" at runtime
**Solution:** Set all required secrets with `wrangler secret put <KEY> --env dev`

---

## ✅ DEPLOYMENT CHECKLIST

Per DEVELOPER_2_IMPLEMENTATION.md Hour 2 Handoff:
- [ ] Worker deployed to dev environment
- [ ] Health check endpoint accessible
- [ ] URL shared with ALL developers
- [ ] All developers test connection
- [ ] Verify response time <100ms for health check

---

**Current Status:** Code committed, ready for deployment once credentials configured

**Commit:** 4d89afc - "feat: Implement API routes (12/12 tests passing)"

