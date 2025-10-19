# Demo 1: Memory Continuity Test

**Purpose**: Demonstrate that Sam remembers information across multiple calls
**Duration**: 4-6 minutes (2 calls, 2-3 minutes each)
**Success Criteria**: Sam references specific details from Call 1 during Call 2 without being reminded

---

## Setup Instructions

### Before Recording
1. **Clear Previous Data** (if testing fresh memory):
   ```bash
   # Optional: Reset Mrs. Chen's profile to baseline
   curl -X DELETE https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen
   ```

2. **Verify Webhook is Running**:
   ```bash
   curl https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook
   # Should return 200, not 404
   ```

3. **Phone Setup**:
   - Use speakerphone for best audio quality
   - Quiet environment (no background noise)
   - Have script visible but speak naturally

4. **Dashboard Prep**:
   - Open dashboard at http://localhost:5173
   - Navigate to Profile tab for Mrs. Chen
   - Keep Memory section visible to verify updates

---

## CALL 1: Initial Information Sharing
**Objective**: Share 3 memorable details that Sam should remember

### Opening (30 seconds)

**Sam**: "Hello! This is Sam. Who am I speaking with today?"

**Mrs. Chen**: "Hi Sam, this is Margaret Chen. Most people call me Mrs. Chen."

**Sam**: *(Expected: Warm greeting, acknowledges name)*
Example: "It's wonderful to talk with you, Mrs. Chen! How are you doing today?"

### Conversation Body (90-120 seconds)

**Mrs. Chen**: "I'm doing well, thank you. My daughter Sarah visited this weekend, and we had a lovely time."

**Sam**: *(Expected: Shows interest, asks follow-up)*
Example: "That sounds wonderful! What did you and Sarah do together?"

**Mrs. Chen**: "We worked in the garden. I've been growing tomatoes this year, and they're finally starting to ripen. Sarah was so excited to see them."

**Sam**: *(Expected: Engages with gardening topic)*
Example: "Tomatoes are wonderful! What variety are you growing?"

**Mrs. Chen**: "Beefsteak tomatoes, mostly. And my grandson Tommy helped me plant some cherry tomatoes too. He's 8 years old and loves helping in the garden."

**Sam**: *(Expected: Shows warmth about family involvement)*
Example: "How special that Tommy enjoys gardening with you! That's a wonderful way to spend time together."

**Mrs. Chen**: "Yes, he's a sweet boy. I also played some piano this week. I haven't played much lately, but I dusted off my old Chopin pieces."

**Sam**: *(Expected: Acknowledges piano interest)*
Example: "Chopin is beautiful! How long have you been playing piano?"

**Mrs. Chen**: "Oh, since I was a little girl. It's one of my favorite ways to relax."

### Closing (30 seconds)

**Mrs. Chen**: "Well, I should let you go, Sam. Thank you for chatting with me."

**Sam**: *(Expected: Warm goodbye)*
Example: "It was wonderful talking with you, Mrs. Chen! Take care!"

**Mrs. Chen**: "Goodbye!"

---

### Call 1 Verification Checklist

After ending Call 1, immediately check dashboard:

- [ ] **Profile → Memory section** contains:
  - [ ] Daughter: Sarah
  - [ ] Grandson: Tommy (age 8)
  - [ ] Hobbies: Gardening (tomatoes - beefsteak & cherry)
  - [ ] Hobbies: Piano (Chopin pieces)
- [ ] **Conversation History** shows Call 1 transcript
- [ ] **Last Contact** timestamp updated to current time

**Wait 2-5 minutes before Call 2** (simulates real-world gap between calls)

---

## CALL 2: Memory Recall Test
**Objective**: Sam should reference Call 1 details WITHOUT being reminded

### Opening (30 seconds)

**Sam**: "Hello! This is Sam. Who am I speaking with today?"

**Mrs. Chen**: "Hi Sam, it's Mrs. Chen again."

**Sam**: *(CRITICAL: Should recognize and reference previous call)*
Example expected: "Hi Mrs. Chen! It's so nice to hear from you again! How are those tomatoes doing?"
OR: "Hello Mrs. Chen! Have you had a chance to play more piano since we last talked?"

**PASS CRITERIA**: Sam mentions at least ONE specific detail from Call 1 (tomatoes, piano, Sarah, Tommy) without being prompted

**FAIL CRITERIA**: Generic response like "How can I help you today?" or "How are you?"

### Conversation Body (90-120 seconds)

**Mrs. Chen**: "I'm doing well! I actually just came in from the garden."

**Sam**: *(Expected: References tomatoes or gardening from Call 1)*
Example: "Did you check on those beefsteak tomatoes? Or were you working on something else today?"

**Mrs. Chen**: "Yes, I was watering the tomatoes. They're getting bigger!"

**Sam**: *(Expected: Shows continuity, may reference Tommy)*
Example: "That's wonderful! Is Tommy excited to see them growing?"

**Mrs. Chen**: "He is! He came by after school today."

**Sam**: *(Expected: Remembers Tommy is 8, grandson)*
Example: "How sweet! I'm sure he loves checking on those cherry tomatoes you two planted together."

**PASS CRITERIA**: Sam correctly recalls:
- Tommy is the grandson (not son, not neighbor)
- Cherry tomatoes were planted together
- Tommy's involvement in gardening

**Mrs. Chen**: "He does. And I've been practicing piano more too. Sarah suggested I play for her next visit."

**Sam**: *(Expected: References Chopin or piano from Call 1)*
Example: "That's lovely! Are you working on those Chopin pieces you mentioned?"

**PASS CRITERIA**: Sam remembers piano was mentioned in Call 1

### Closing (30 seconds)

**Mrs. Chen**: "Alright Sam, I should go start dinner. Talk to you later!"

**Sam**: *(Expected: Personalized goodbye)*
Example: "Enjoy your dinner, Mrs. Chen! And happy gardening!"

**Mrs. Chen**: "Goodbye!"

---

## Success Criteria Summary

### MUST PASS (Critical):
1. ✅ **Sam greets Mrs. Chen by name in Call 2** (not "Who am I speaking with?")
2. ✅ **Sam references at least 2 specific details from Call 1** unprompted:
   - Tomatoes (beefsteak/cherry)
   - Piano (Chopin)
   - Sarah (daughter)
   - Tommy (grandson, age 8)
3. ✅ **Sam shows conversational continuity** (not starting from scratch)

### SHOULD PASS (Important):
4. ✅ Dashboard shows updated memory after Call 1
5. ✅ Conversation history shows both calls
6. ✅ Sam's responses feel natural (not robotic or generic)

### BONUS (Nice to Have):
7. ✅ Sam references multiple details in single response ("How are those tomatoes and your piano practice going?")
8. ✅ Sam asks follow-up questions showing deep memory ("Did Sarah enjoy the garden?")

---

## Troubleshooting

### Issue: Sam doesn't remember anything from Call 1

**Possible Causes**:
1. Memory extraction prompt not working
2. KV storage not persisting data
3. Profile lookup failing (wrong phone number mapping)

**Debug Steps**:
```bash
# Check if memory was saved
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.memories'

# Check conversation history
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.conversations'

# Verify phone number mapping
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/by-phone/+12248581016
```

### Issue: Sam remembers but responses are robotic

**Possible Causes**:
1. Sam personality prompt needs tuning
2. Temperature too low (not creative enough)
3. Gemini not following instructions

**Fix**: Check [prompts/sam-personality.ts](../../../prompts/sam-personality.ts) for tone settings

### Issue: Dashboard not updating

**Possible Causes**:
1. Async processing not running (no `waitUntil`)
2. CORS issues blocking dashboard API calls
3. Polling interval too long

**Fix**: Check browser console for errors, verify `/api/profiles/mrs-chen` endpoint returns data

---

## Recording Instructions

### For Video Demo:
1. **Screen Layout**:
   - Left half: Phone call interface (Vapi or actual speakerphone)
   - Right half: Dashboard showing Profile tab

2. **Highlight Key Moments**:
   - CALL 1: Zoom into Memory section as it updates
   - CALL 2: Zoom into Sam's greeting referencing previous call
   - CALL 2: Highlight when Sam mentions "tomatoes" or "piano" unprompted

3. **Voiceover Script**:
   ```
   "In Call 1, Mrs. Chen mentions her daughter Sarah, grandson Tommy,
   and her hobbies of gardening and piano. Watch the dashboard update
   in real-time as Sam learns these details."

   [2 minute gap]

   "In Call 2, Mrs. Chen calls back. Notice how Sam immediately
   references her tomatoes and piano without being reminded. This is
   true memory continuity - not just storing data, but using it
   naturally in conversation."
   ```

### For Audio-Only Demo:
1. Record both calls with clear audio
2. Keep 10-15 seconds between calls in final edit (add title card: "5 minutes later...")
3. Emphasize Sam's recall moments with subtle music swell or visual annotation

---

## Test Data Reference

This script uses the Mrs. Chen demo profile from [data/mrs-chen-profile.json](../../../data/mrs-chen-profile.json):

```json
{
  "userId": "mrs-chen",
  "name": "Mrs. Margaret Chen",
  "age": 72,
  "phone": "+12248581016",
  "languages": ["en-US", "zh-CN"],
  "memories": {
    "family": ["Sarah (daughter)", "Tommy (grandson, age 8)"],
    "hobbies": ["gardening", "piano"],
    "health": ["arthritis", "occasional forgetfulness"]
  }
}
```

**Note**: The script introduces NEW details (beefsteak tomatoes, Chopin, Sarah's weekend visit) that should be extracted and remembered.

---

## Files to Monitor During Test

1. **Worker Logs** (`wrangler dev` or `wrangler tail`):
   - Look for `[MEMORY]` extraction logs
   - Look for `[KV]` storage confirmation
   - Look for `[WEBHOOK]` response times

2. **Dashboard Console** (Browser DevTools):
   - API calls to `/api/profiles/mrs-chen`
   - Polling interval (should be every 2s)
   - CORS errors (shouldn't see any)

3. **Network Tab**:
   - Webhook latency (<3 seconds)
   - Profile fetch times (<500ms)

---

**Last Updated**: 2025-10-18
**Script Version**: 1.0
**Test Owner**: Developer 3 (Voice & Phone System)
