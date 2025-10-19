# Manual Setup Tasks for Developer 3

This document contains tasks that require manual interaction and cannot be automated. Complete these in order before proceeding with automated configuration.

## ⚠️ CRITICAL: Complete These FIRST (Hour 0-1)

### Task 4.1a: Purchase Vapi Phone Number

**Status:** ⏳ WAITING FOR MANUAL COMPLETION
**Priority:** CRITICAL - Blocks all phone testing
**Estimated Time:** 15 minutes
**Cost:** ~$2/month

#### Prerequisites:
- [ ] Vapi account created at https://vapi.ai
- [ ] Payment method added to Vapi account
- [ ] VAPI_API_KEY obtained and added to `.env` file

#### Steps:

1. **Log in to Vapi Dashboard**
   ```
   URL: https://dashboard.vapi.ai
   Navigate to: "Phone Numbers" section
   ```

2. **Purchase Phone Number**
   - **Area Code:** 206 (Seattle - matches Mrs. Chen's location in PRD)
   - **Type:** Local number (NOT toll-free)
   - **Reason:** Appears more personal to seniors vs. 1-800 numbers
   - **Expected Cost:** ~$2/month

   Click "Purchase Number" → Select 206 area code → Confirm purchase

3. **Verify Purchase**
   - [ ] Number shows as "Active" in Vapi dashboard
   - [ ] Number displayed in format: `+1206XXXXXXX`
   - [ ] Test dial from your personal phone
   - [ ] Should hear Vapi's default greeting/IVR

4. **Document the Phone Number**

   Once you have the number, update your `.env` file:
   ```bash
   # Add this line to .env with your actual number
   VAPI_PHONE_NUMBER=+1206XXXXXXX
   ```

   Example:
   ```bash
   VAPI_PHONE_NUMBER=+12065551234
   ```

5. **Verification Checklist**
   - [ ] Phone number is active in Vapi dashboard
   - [ ] Successfully called the number from another phone
   - [ ] Heard Vapi's default greeting (confirms number is working)
   - [ ] Phone number added to `.env` file
   - [ ] `.env` file NOT committed to git (should be in `.gitignore`)

---

### Task 4.1b: Obtain API Keys

**Status:** ⏳ VERIFY COMPLETION
**Priority:** CRITICAL

#### Check Your `.env` File

You should already have these from earlier setup. Verify all are present:

```bash
# Check if these exist in your .env file
grep "VAPI_API_KEY" .env
grep "ELEVENLABS_API_KEY" .env
grep "GEMINI_API_KEY" .env
```

#### If Missing Any Keys:

**VAPI_API_KEY:**
1. Go to https://dashboard.vapi.ai
2. Navigate to "API Keys" or "Settings"
3. Create new API key or copy existing
4. Add to `.env`: `VAPI_API_KEY=your_key_here`

**ELEVENLABS_API_KEY:**
1. Go to https://elevenlabs.io/app/settings
2. Navigate to "API Keys"
3. Create new key or copy existing
4. Add to `.env`: `ELEVENLABS_API_KEY=your_key_here`

**GEMINI_API_KEY:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to `.env`: `GEMINI_API_KEY=your_key_here`

---

### Task 4.1c: Configure Vapi Account Settings

**Status:** ⏳ WAITING FOR PHONE NUMBER
**Prerequisites:** Task 4.1a must be completed first

#### Steps:

1. **Log in to Vapi Dashboard**
   ```
   URL: https://dashboard.vapi.ai
   ```

2. **Enable Required Features**
   - [ ] Navigate to Settings → Features
   - [ ] Enable "Webhooks" (if not already enabled)
   - [ ] Enable "Transcription" (required for Deepgram)
   - [ ] Enable "Phone Calls" (should be automatic with number purchase)

3. **Set Default Transcription Provider**
   - [ ] Go to Settings → Transcription
   - [ ] Select "Deepgram" as provider (NOT default Vapi transcription)
   - [ ] Reason: Deepgram has better accuracy for elderly speech patterns
   - [ ] Note: Deepgram API key will be configured later in Task 4.6

4. **Verification**
   - [ ] All features show as "Enabled" in dashboard
   - [ ] Deepgram selected as transcription provider
   - [ ] Screenshot settings page for reference (save to `docs/vapi-settings.png`)

---

## 📋 Completion Checklist

Before proceeding to automated tasks, verify:

- [ ] **Task 4.1a:** Phone number purchased and active (`VAPI_PHONE_NUMBER` in `.env`)
- [ ] **Task 4.1b:** All API keys present in `.env` file
- [ ] **Task 4.1c:** Vapi account settings configured correctly

---

## ⏭️ Next Steps (Automated)

Once the above manual tasks are complete, the following can be automated:

1. ✅ **Task 4.2a:** Create Vapi Assistant Configuration File
2. ✅ **Task 4.2b:** Configure Webhook Integration
3. ✅ **Task 4.3a:** ElevenLabs Voice Configuration
4. ✅ **Task 4.4:** Latency Testing Scripts (with TDD)

---

## 🆘 Troubleshooting

### Issue: Cannot purchase phone number
- **Check:** Payment method added to Vapi account?
- **Check:** Sufficient funds/credit on payment method?
- **Try:** Different area code if 206 unavailable (use 425 or 253 as backup)

### Issue: Phone number not showing as active
- **Wait:** Can take 2-5 minutes for activation
- **Refresh:** Dashboard page after 1 minute
- **Check:** Vapi status page (https://status.vapi.ai) for outages

### Issue: Cannot call the number
- **Wait:** Allow 5 minutes after purchase for carrier propagation
- **Try:** Call from different phone (some carriers have delays)
- **Check:** Number format is correct: `+1206XXXXXXX` (must include +1)

### Issue: No greeting when calling
- **Check:** Number is assigned to an assistant (default should be automatic)
- **Check:** Vapi account is active (not suspended)
- **Contact:** Vapi support via dashboard chat if issue persists

---

## 📞 Demo Day Backup Plan

If phone number purchase fails or has issues:

1. **Use Vapi Simulator:** Dashboard has built-in call simulator (no phone needed)
2. **Use Recording:** Task 4.7 creates backup demo recordings
3. **Alternative Demo:** Show webhook testing with curl commands instead of phone

**Remember:** Per PRD Section 9 (Demo), phone interaction is CRITICAL but we have backups!

---

## ⏰ Timeline Expectations

- **Task 4.1a (Phone Purchase):** 15 minutes
- **Task 4.1b (API Keys Check):** 5 minutes
- **Task 4.1c (Account Settings):** 10 minutes
- **Total Manual Setup:** ~30 minutes

**Target Completion:** Hour 1 (to unblock Hour 2 integration testing)

---

## 📝 Notes for Team Integration

Once phone number is configured:

1. **Share with Developer 2:** They need the number for dashboard display
2. **Share with Developer 1:** They may need it for testing webhook calls
3. **Add to Team Docs:** Update team Notion/docs with phone number (if private channel)
4. **DO NOT:** Commit `.env` file to git (contains sensitive keys)

---

**Status Updated:** [Date/Time]
**Completed By:** Developer 3
**Next Task:** Proceed to automated configuration in `DEVELOPER_3_IMPLEMENTATION_PLAN.md`
