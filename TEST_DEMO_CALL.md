# Testing Demo Mode - Quick Guide

## Current Status

✅ **Exchange counter bug FIXED**
✅ **Deployed to dev environment**
✅ **Exchange counter reset to 1**

## Test the Fix

### 1. Make First Call

Call Mrs. Chen's number: **+1 (224) 858-1016**

**Expected Exchanges**:

1. **You say**: "My tomatoes are growing great, but my knee aches"
   **Sam responds**: "I'm sorry to hear about your knee. I recall your arthritis bothers you sometimes. Did you take your Lisinopril this morning?"

2. **You say**: "Yes, I took it this morning"
   **Sam responds**: "That's wonderful to hear! I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m."

3. **You say**: "我今天有点累" (I'm a bit tired today)
   **Sam responds**: "没关系，陈太太。记得多休息，多喝水。" (No worries, Mrs. Chen. Remember to rest more and drink more water.)

4. **You say**: "Thank you, Sam"
   **Sam responds**: "Take care, Mrs. Chen. I'll check in on you tomorrow!"

5. **Hang up**

### 2. Immediately Make Second Call

Call the same number again: **+1 (224) 858-1016**

**Expected Behavior**: Should start from **Exchange 1 again** (not Exchange 2 or later!)

✅ **FIX VERIFIED** if it starts at Exchange 1

❌ **BUG STILL EXISTS** if it starts at Exchange 2, 3, or 4

### 3. Watch Logs (Optional)

Monitor live logs to see reset happening:

```bash
cd /Users/jasonyi/elderlink/worker
npx wrangler tail --env dev --format pretty | grep -E '\[DEMO\]|\[VAPI\]'
```

**Look for these messages**:

**On call start**:
```
[DEMO] New call detected, resetting exchange number from X to 1
```

**During call**:
```
[DEMO] Incremented exchange number to: 2
[DEMO] Incremented exchange number to: 3
[DEMO] Incremented exchange number to: 4
[DEMO] At final exchange (4), not incrementing further
```

**On call end**:
```
[VAPI] End of call detected, clearing call state and resetting demo mode
[DEMO] Reset exchange number to 1 for next call
```

## Quick Reset (If Needed)

If exchange counter gets out of sync, manually reset:

```bash
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode \
  -H 'Content-Type: application/json' \
  -d '{"seniorId": "mrs-chen", "enabled": true}'
```

Expected response:
```json
{
  "success": true,
  "demoMode": true,
  "demoExchangeNumber": 1,
  "message": "Demo mode enabled for Mrs. Chen"
}
```

## Troubleshooting

### Issue: Call still jumping to wrong exchange

**Check**:
1. Did deployment succeed?
   ```bash
   curl https://elderlink-dev.elderlinkhelper.workers.dev/health
   ```
   Should return `{"status":"ok","service":"ElderLink Dev"}`

2. Is demo mode enabled?
   ```bash
   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode?seniorId=mrs-chen
   ```
   Should return `{"demoMode":true,"demoExchangeNumber":1}`

3. Check live logs for errors

### Issue: Voice sounds robotic or wrong

**Check ElevenLabs settings**:
- Stability: 0.5
- Style: 0.75
- SimilarityBoost: 0.85
- UseSpeakerBoost: true

**Update if needed**:
```bash
./update-voice-settings.sh
```

## Files

- **Fix Documentation**: [DEMO_EXCHANGE_COUNTER_FIX.md](DEMO_EXCHANGE_COUNTER_FIX.md)
- **Demo Script**: [DEMO_SCRIPT_FINAL.md](DEMO_SCRIPT_FINAL.md)
- **Voice Settings**: [VOICE_OPTIMIZATION.md](VOICE_OPTIMIZATION.md)

## Support

If issues persist:
1. Check wrangler logs: `npx wrangler tail --env dev --format pretty`
2. Verify profile state in KV via dashboard
3. Review [DEMO_EXCHANGE_COUNTER_FIX.md](DEMO_EXCHANGE_COUNTER_FIX.md) for technical details
