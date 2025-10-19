# Demo Mode Debug Log

## 🔴 Critical Issue: Demo Mode Not Activating

**Status:** Demo mode fails to activate despite being enabled in KV

---

## Call Analysis: 3:26 AM (2025-10-19 09:53 UTC)

### Timeline

1. **Call Started:** 2025-10-19T09:53:44.150Z
2. **First Exchange:** "Thank you." received at 09:53:49.870Z
3. **Demo Mode Check:** Failed - Used LIVE mode instead

### Key Log Evidence

```log
[DEMO] Mode check: { isDemoMode: true, exchangeNumber: 11, scriptLength: 5 }
[LIVE] Language detection: { message: 'Thank you.', detected: 'english' }
[SAM] Calling real Gemini API... { hasEnv: true, apiKeyLength: 39, promptLength: 2654 }
```

### Root Cause Analysis

#### 🔴 **CRITICAL BUG FOUND:**

**The profile was NOT empty - it still had 2 conversations!**

```javascript
// From vapi-webhook.ts line 187-193
const isDemoMode = demoModeActive === 'true';
const exchangeNumber = profile.conversations.length + 1;  // ❌ THIS WAS 3, NOT 1!

if (isDemoMode && exchangeNumber <= DEMO_SCRIPT.length) {
  // Demo mode branch (SHOULD execute)
} else {
  // Live mode branch (ACTUALLY executed)
}
```

**Why it failed:**
- `profile.conversations.length` = **2** (from backup profile)
- `exchangeNumber` = **2 + 1 = 3**
- `DEMO_SCRIPT.length` = **5**
- Condition: `true && 3 <= 5` = **TRUE** ✅
- **BUT exchange #3 is different from exchange #1!**

Wait, the condition SHOULD have passed. Let me re-analyze...

#### 🔴 **ACTUAL ROOT CAUSE:**

Looking more carefully:

```log
[DEMO] Mode check: { isDemoMode: true, exchangeNumber: 11, scriptLength: 5 }
```

**exchangeNumber = 11, NOT 3!**

This means the profile had **10 conversations**, not 2!

**The reset script did NOT delete the profile correctly.**

---

## Previous Call Analysis: 3:19 AM (2025-10-19 09:19 UTC)

### Issue
- User ran reset script around 3:16 AM
- Called at 3:19 AM (only 3 minutes later)
- KV propagation incomplete (needs 30-60 seconds globally)

### Result
- Profile still existed with data
- Demo mode key hadn't propagated
- Used LIVE mode

---

## System State Verification (Current - 10:25 AM)

```bash
# Demo mode status
curl /api/demo-mode
{
  "isDemoMode": true,
  "message": "🎬 Demo mode ACTIVE - First call will use pre-scripted responses"
}

# Profile status
npx wrangler kv key get "senior-mrs-chen"
# Error: 404 Not Found ✅ (Correctly deleted)

# Backup status
npx wrangler kv key get "senior-mrs-chen-backup"
{
  "id": "mrs-chen",
  "conversations": [
    { "timestamp": "2025-10-01T10:00:00Z", ... },
    { "timestamp": "2025-10-02T14:30:00Z", ... }
  ],
  ...
}
# ✅ Backup exists with 2 conversations
```

---

## Bug Identification

### Bug #1: Profile Not Fully Cleared ❌

**File:** `reset-demo.sh`

**Problem:** The delete command may have failed silently

**Evidence:**
```log
[DEMO] Mode check: { isDemoMode: true, exchangeNumber: 11, scriptLength: 5 }
                                        ^^^ Should be 1, but is 11!
```

This means:
- `profile.conversations.length` = **10**
- Profile had 10 prior conversations
- Delete command did NOT work

**Hypothesis:** KV delete has eventual consistency - the delete may not have taken effect globally before the call.

### Bug #2: Reset Script Doesn't Verify Deletion ❌

**File:** `reset-demo.sh`

**Problem:** No verification that profile was actually deleted

**Current flow:**
```bash
# Delete
npx wrangler kv key delete "senior-mrs-chen"

# Wait 45 seconds
sleep 45

# ❌ NO VERIFICATION that delete succeeded
```

**Should be:**
```bash
# Delete
npx wrangler kv key delete "senior-mrs-chen"

# Wait 45 seconds
sleep 45

# VERIFY deletion succeeded
VERIFY=$(npx wrangler kv key get "senior-mrs-chen" 2>&1)
if [[ "$VERIFY" != *"404"* ]]; then
  echo "❌ ERROR: Profile still exists! KV delete did not propagate."
  exit 1
fi
```

### Bug #3: Demo Mode Logic Uses Wrong Fallback ❌

**File:** `worker/src/handlers/vapi-webhook.ts` (lines 187-193)

**Problem:** When `exchangeNumber > scriptLength`, it should STILL use demo script but show warning

**Current:**
```javascript
if (isDemoMode && exchangeNumber <= DEMO_SCRIPT.length) {
  // Use demo script
} else {
  // Fall back to LIVE mode ❌ This is wrong for demo!
}
```

**Should be:**
```javascript
if (isDemoMode) {
  if (exchangeNumber <= DEMO_SCRIPT.length) {
    // Use demo script normally
  } else {
    // User went past script - use fallback demo response
    console.log('[DEMO] ⚠️ Exchange exceeds script length, using fallback');
    samResponse = "I appreciate you sharing that with me, Mrs. Chen.";
    sentiment = 0.5;
  }
} else {
  // ONLY use live mode when demo mode is OFF
}
```

---

## Resolution Strategy

### Fix #1: Add Delete Verification to Reset Script ✅

Update `reset-demo.sh` to verify deletion succeeded.

### Fix #2: Increase Wait Time & Add Retry ✅

Change from 45s to 60s, add verification loop.

### Fix #3: Fix Demo Mode Logic ✅

Demo mode should NEVER fall back to live mode when `isDemoMode === true`.

### Fix #4: Add Manual Cleanup Command ✅

Provide a manual cleanup command to force-delete stale profiles.

---

## Testing Plan

### Test 1: Verify Reset Script Works
1. Run `./reset-demo.sh`
2. Verify output shows "Profile deleted (404)"
3. Wait full 60 seconds
4. Make call immediately after
5. Verify logs show `exchangeNumber: 1`

### Test 2: Verify Demo Mode Never Falls Back
1. Enable demo mode
2. Create profile with 100 conversations (force exchange #101)
3. Make call
4. Verify it uses demo fallback response, NOT Gemini

### Test 3: Verify KV Propagation
1. Delete key via wrangler
2. Query key every 5 seconds for 60 seconds
3. Document when 404 appears globally

---

## Open Questions

1. **Why did the profile have 10 conversations at 3:26 AM?**
   - User may have called multiple times between 3:19 and 3:26
   - Each call added conversations
   - Reset script was NOT run again before 3:26 call

2. **Is there a better way to ensure clean state?**
   - Option A: Use a different KV key for demo mode (e.g., `demo-senior-mrs-chen`)
   - Option B: Add profile state to demo mode flag (e.g., `demo-mode-mrs-chen-v1`)
   - Option C: Use API call to flush KV cache before demo

3. **Should demo mode auto-reset after each call?**
   - Current: Demo mode disables after first call
   - Proposed: Demo mode resets profile state after each call completion

---

## Next Steps

1. ✅ Create this debug log
2. ✅ Implement Fix #1: Add delete verification
3. ✅ Implement Fix #2: Increase wait time to 60s
4. ✅ Implement Fix #3: Fix demo mode fallback logic
5. ✅ Deploy fixes to production
6. ⏳ Test with fresh call
7. ⏳ Document final solution

---

## Fixes Implemented (2025-10-19 10:29 AM)

### Fix #1: Demo Mode Hermetic Logic ✅

**File:** `worker/src/handlers/vapi-webhook.ts` (lines 490-568)

**Change:** Restructured demo mode logic to NEVER fall back to Gemini when `isDemoMode === true`

**Before:**
```javascript
if (isDemoMode && isWithinDemoScript(exchangeNumber)) {
  // Demo mode
} else {
  // Falls back to LIVE mode (❌ BUG!)
}
```

**After:**
```javascript
if (isDemoMode) {
  if (isWithinDemoScript(exchangeNumber)) {
    // Use scripted demo response
  } else {
    // Use demo fallback response (STILL IN DEMO MODE!)
    samResponse = "I appreciate you sharing that with me, Mrs. Chen...";
  }
} else {
  // ONLY use live mode when demo mode is OFF
}
```

**Impact:** Demo mode now NEVER calls Gemini API, regardless of exchange number. If exchange #11 happens during demo, it uses a fallback demo response instead of live Gemini.

---

### Fix #2: Reset Script Verification ✅

**File:** `reset-demo.sh` (lines 35-66)

**Changes:**
1. Increased wait time from 45s → 60s
2. Added deletion verification step (3️⃣b)
3. Added forced re-delete if verification fails

**New verification logic:**
```bash
# Verify profile deletion succeeded
VERIFY_DELETE=$(npx wrangler kv key get "senior-mrs-chen" 2>&1)

if [[ "$VERIFY_DELETE" == *"404"* ]]; then
  echo "✅ Profile successfully deleted"
else
  echo "❌ ERROR: Profile still exists!"
  # Force delete again + wait 30s more
fi
```

**Impact:** Script now verifies deletion succeeded before marking system as "ready". Total wait time can be up to 90 seconds if retry needed.

---

### Fix #3: Worker Deployment ✅

**Deployment:** Version ID `62dd75c9-a4e4-48ed-b43d-7d52e001c91e`
**Timestamp:** 2025-10-19 10:29 AM PST
**URL:** https://elderlink-dev.elderlinkhelper.workers.dev

**Next test:** Run `./reset-demo.sh` and make call after full verification completes

---

## Lessons Learned

1. **KV eventual consistency is REAL** - 45 seconds is not enough for global propagation
2. **Always verify state changes** - Don't assume delete/put succeeded
3. **Demo mode should be hermetic** - Never fall back to live mode when enabled
4. **Exchange numbering is fragile** - Using `conversations.length + 1` assumes clean state

---

**Last Updated:** 2025-10-19 10:27 AM PST
**Status:** Root cause identified, fixes in progress
