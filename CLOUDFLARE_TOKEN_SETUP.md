# ⚠️ CLOUDFLARE_API_TOKEN Setup Required

**Task:** 3.1g - Deploy Worker to Cloudflare  
**Blocker:** CLOUDFLARE_API_TOKEN missing from `.env`  
**Priority:** HIGH - Required for Hour 2 deployment  

---

## 🔧 IMMEDIATE ACTION REQUIRED

Your `.env` file is missing the `CLOUDFLARE_API_TOKEN`. Add it manually:

### Step 1: Get Your Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use template: "Edit Cloudflare Workers"
4. Or create custom token with permissions:
   - Account > Workers Scripts > Edit
   - Account > Workers KV Storage > Edit

### Step 2: Add to .env File

**Open:** `/Users/bowenxia/elderlink/.env`

**Add this line after `KV_NAMESPACE_ID`:**
```bash
CLOUDFLARE_API_TOKEN=your_actual_token_here
```

**Your .env should look like:**
```bash
# ... existing keys ...

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=1a12fe1e4724fdc46a36663cc6f8e7b7
CLOUDFLARE_API_TOKEN=YOUR_ACTUAL_TOKEN_HERE  # ← ADD THIS
KV_NAMESPACE_ID=0da346fb61be4a37b28d119fcc886f6b

# ... rest of file ...
```

### Step 3: Deploy Worker

Once added, run:
```bash
cd /Users/bowenxia/elderlink
wrangler deploy --env dev
```

Expected output:
```
✨ Built successfully
📦 Uploaded elderlink-dev
🌍 Published elderlink-dev
   https://elderlink-dev.1a12fe1e4724fdc46a36663cc6f8e7b7.workers.dev
```

### Step 4: Share URL with Team

Post in team channel:
```
✅ Worker Deployed!
🔗 URL: https://elderlink-dev.1a12fe1e4724fdc46a36663cc6f8e7b7.workers.dev
🏥 Health Check: https://elderlink-dev.1a12fe1e4724fdc46a36663cc6f8e7b7.workers.dev/api/health

All developers: Please test the health endpoint
```

---

## 🔄 ALTERNATIVE: Use Wrangler Login

If you prefer not to use API token in .env:

```bash
# Login interactively
wrangler login

# Then deploy (no .env token needed)
wrangler deploy --env dev
```

This opens browser for OAuth authentication.

---

## ✅ VERIFICATION

After deployment, test:
```bash
curl https://elderlink-dev.1a12fe1e4724fdc46a36663cc6f8e7b7.workers.dev/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"development",...}
```

---

**CURRENT STATUS:**
- ✅ All code committed and ready
- ⏸️ Waiting for CLOUDFLARE_API_TOKEN to be added to .env
- ⏸️ Then run: `wrangler deploy --env dev`

**See also:** `DEPLOYMENT_INSTRUCTIONS.md` for detailed deployment guide

