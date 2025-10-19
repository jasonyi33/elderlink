# Demo 3: Language Switching (English ↔ Mandarin)

**Purpose**: Demonstrate seamless bilingual conversation with automatic voice switching
**Duration**: 3-4 minutes (single call)
**Success Criteria**: Sam detects language changes and responds in matching language with appropriate voice

---

## Setup Instructions

### Before Recording
1. **Verify ElevenLabs Configuration**:
   ```bash
   # Check voice IDs in .env
   grep ELEVENLABS .env

   # Should show:
   # ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL
   # ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5
   ```

2. **Test Voice Quality** (optional):
   ```bash
   # Play test recordings to verify voices
   afplay recordings/test-english.mp3
   afplay recordings/test-mandarin.mp3
   ```

3. **Dashboard Setup**:
   - Open Profile tab
   - Verify languages show: ["en-US", "zh-CN"]
   - Watch conversation history for language detection

4. **Phone Setup**:
   - Speakerphone enabled for clear voice switching demo
   - Pronounce Mandarin clearly (pinyin reference provided below)
   - Have both English and Mandarin phrases visible

### Language Note
- Mrs. Chen is fluent in both English and Mandarin
- She naturally code-switches (common in bilingual seniors)
- Mandarin is used for emotional topics or family terms

---

## Call Script: Bilingual Conversation

### Opening - English (30 seconds)

**Sam** (English voice): "Hello! This is Sam. Who am I speaking with today?"

**Mrs. Chen**: "Hi Sam, it's Mrs. Chen."

**Sam** (English voice): *(Expected: Warm greeting)*
Example: "Hi Mrs. Chen! How are you doing today?"

**Mrs. Chen**: "I'm doing well, thank you. How are you?"

**Sam** (English voice): *(Expected: Polite response, asks about her day)*
Example: "I'm doing well! What have you been up to today?"

### Transition to Mandarin (60 seconds)

**Mrs. Chen**: "I've been thinking about my family today. 我很想念我的女儿。"
*(Wǒ hěn xiǎngniàn wǒ de nǚ'ér.)*
*Translation: "I really miss my daughter."*

**Sam** (CRITICAL: Should switch to Mandarin voice):
Expected response in Mandarin: "我理解。Sarah住得远吗？"
*(Wǒ lǐjiě. Sarah zhù de yuǎn ma?)*
*Translation: "I understand. Does Sarah live far away?"*

**PASS CRITERIA**:
- ✅ Sam detects Mandarin input
- ✅ Voice switches from English to Mandarin voice ID
- ✅ Response is grammatically correct Mandarin
- ✅ Dashboard shows language detection: "zh-CN"

**Mrs. Chen**: "是的，她住在西雅图。我住在芝加哥。"
*(Shì de, tā zhù zài Xīyǎtú. Wǒ zhù zài Zhījiāgē.)*
*Translation: "Yes, she lives in Seattle. I live in Chicago."*

**Sam** (Mandarin voice):
Expected: "那确实很远。你们多久见一次面？"
*(Nà quèshí hěn yuǎn. Nǐmen duōjiǔ jiàn yī cì miàn?)*
*Translation: "That is quite far. How often do you see each other?"*

**Mrs. Chen**: "大概每两个月一次。她很忙，但她总是打电话给我。"
*(Dàgài měi liǎng gè yuè yī cì. Tā hěn máng, dàn tā zǒng shì dǎ diànhuà gěi wǒ.)*
*Translation: "About once every two months. She's very busy, but she always calls me."*

**Sam** (Mandarin voice):
Expected: "那很好。能经常听到她的声音一定让你很开心。"
*(Nà hěn hǎo. Néng jīngcháng tīng dào tā de shēngyīn yīdìng ràng nǐ hěn kāixīn.)*
*Translation: "That's good. Being able to hear her voice often must make you happy."*

### Switch Back to English (60 seconds)

**Mrs. Chen**: "Yes, it does. Actually, she's visiting next weekend. I'm excited!"

**Sam** (CRITICAL: Should switch BACK to English voice):
Expected: "That's wonderful! Are you planning anything special for her visit?"

**PASS CRITERIA**:
- ✅ Sam detects return to English
- ✅ Voice switches back to English voice ID
- ✅ Smooth transition without awkwardness
- ✅ Dashboard shows language detection: "en-US"

**Mrs. Chen**: "I'm going to cook her favorite dumplings. 她最爱吃我做的饺子。"
*(Tā zuì ài chī wǒ zuò de jiǎozi.)*
*Translation: "She loves my dumplings the most."*

**Sam** (CRITICAL: Mixed language - should detect primary language is Mandarin):
Expected (Mandarin voice): "饺子！听起来很美味。你需要帮忙准备吗？"
*(Jiǎozi! Tīng qǐlái hěn měiwèi. Nǐ xūyào bāngmáng zhǔnbèi ma?)*
*Translation: "Dumplings! That sounds delicious. Do you need help preparing?"*

OR (English voice if detection prioritizes first sentence):
"Dumplings! That sounds delicious. Do you need help preparing anything?"

**ACCEPTABLE**: Either language is fine for mixed input
**IDEAL**: Matches the emotional/primary language (Mandarin in this case)

### Multiple Rapid Switches (60 seconds)

**Mrs. Chen**: "No, I have everything ready. 我已经买了菜。But I might make some tea too."
*(Wǒ yǐjīng mǎi le cài.)*
*Translation: "I already bought the vegetables."*

**Sam** (English voice - most of sentence is English):
Expected: "Tea and dumplings sound perfect! What kind of tea do you like to serve?"

**Mrs. Chen**: "绿茶，她喜欢绿茶。"
*(Lǜchá, tā xǐhuān lǜchá.)*
*Translation: "Green tea, she likes green tea."*

**Sam** (Mandarin voice):
Expected: "绿茶很健康。你也喜欢喝绿茶吗？"
*(Lǜchá hěn jiànkāng. Nǐ yě xǐhuān hē lǜchá ma?)*
*Translation: "Green tea is very healthy. Do you also like drinking green tea?"*

**Mrs. Chen**: "Yes, every morning! It helps with my digestion."

**Sam** (English voice):
Expected: "That's a wonderful habit. Green tea has so many benefits!"

### Closing - English (30 seconds)

**Mrs. Chen**: "Thank you, Sam. 谢谢你陪我聊天。"
*(Xièxiè nǐ péi wǒ liáotiān.)*
*Translation: "Thank you for chatting with me."*

**Sam** (CRITICAL: Should detect gratitude and respond in Mandarin OR bilingually):
Expected (Option 1 - Mandarin): "不客气！祝你和Sarah有个美好的周末！"
*(Bù kèqì! Zhù nǐ hé Sarah yǒu gè měihǎo de zhōumò!)*
*Translation: "You're welcome! I wish you and Sarah a wonderful weekend!"*

Expected (Option 2 - Bilingual): "不客气，Mrs. Chen! Have a wonderful visit with Sarah!"

**Mrs. Chen**: "Goodbye, Sam!"

**Sam** (English voice): "Goodbye! 再见！"
*(Zàijiàn!)*
*Translation: "Goodbye!"*

---

## Success Criteria Summary

### MUST PASS (Critical):
1. ✅ **Voice switches at least 3 times** (English → Mandarin → English minimum)
2. ✅ **Language detection is accurate** (>90% correct language choice)
3. ✅ **Voice quality consistent** for both English and Mandarin
4. ✅ **No audio glitches** during voice switching
5. ✅ **Mandarin responses grammatically correct** (native-level)

### SHOULD PASS (Important):
6. ✅ Dashboard shows language detection in real-time
7. ✅ Conversation history labels each message with detected language
8. ✅ Response latency <3 seconds even with language switching
9. ✅ Sam maintains personality/warmth in both languages

### BONUS (Nice to Have):
10. ✅ Handles mixed-language sentences gracefully
11. ✅ Uses culturally appropriate phrases (e.g., "不客气" instead of literal "You're welcome")
12. ✅ Closing includes bilingual goodbye

---

## Dashboard Verification

### Conversation History Should Show:

```
[2:45 PM] 🇺🇸 Mrs. Chen: "Hi Sam, it's Mrs. Chen."
[2:45 PM] 🇺🇸 Sam: "Hi Mrs. Chen! How are you doing today?"
[2:46 PM] 🇺🇸 Mrs. Chen: "I've been thinking about my family today..."
[2:46 PM] 🇨🇳 Mrs. Chen: "我很想念我的女儿。"
[2:46 PM] 🇨🇳 Sam: "我理解。Sarah住得远吗？"
[2:47 PM] 🇨🇳 Mrs. Chen: "是的，她住在西雅图..."
[2:47 PM] 🇨🇳 Sam: "那确实很远。你们多久见一次面？"
[2:48 PM] 🇺🇸 Mrs. Chen: "Yes, it does. Actually, she's visiting..."
[2:48 PM] 🇺🇸 Sam: "That's wonderful! Are you planning anything special?"
```

### Profile Tab Should Show:
```
Languages: 🇺🇸 English (Primary), 🇨🇳 Mandarin (Fluent)
Last Language Used: en-US (2 minutes ago)
Language Switches This Call: 5
```

---

## Technical Verification

### 1. Check Language Detection

```bash
# Verify conversation history includes language metadata
curl https://elderlink-dev.elderlinkhelper.workers.dev/api/profiles/mrs-chen | jq '.conversations[-1]'

# Expected output:
# {
#   "timestamp": "2025-10-18T14:45:00Z",
#   "exchanges": [
#     {"role": "user", "content": "我很想念我的女儿", "language": "zh-CN"},
#     {"role": "assistant", "content": "我理解。Sarah住得远吗？", "language": "zh-CN", "voiceId": "FGY2WhTYpPnrIDTdsKH5"},
#     {"role": "user", "content": "Yes, it does.", "language": "en-US"},
#     {"role": "assistant", "content": "That's wonderful!", "language": "en-US", "voiceId": "EXAVITQu4vr4xnSDxMaL"}
#   ]
# }
```

### 2. Monitor Webhook Response

During call, Worker logs should show:

```
[WEBHOOK] Received message: "我很想念我的女儿"
[LANG] Detected language: zh-CN (confidence: 0.98)
[VOICE] Switching to Mandarin voice: FGY2WhTYpPnrIDTdsKH5
[GEMINI] Generating response in zh-CN...
[WEBHOOK] Response time: 1.2s
```

### 3. Verify Vapi Configuration

```bash
# Check Vapi assistant has both voice IDs configured
curl -X GET "https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7" \
  -H "Authorization: Bearer $VAPI_API_KEY" | jq '.voice'

# Should show:
# {
#   "provider": "11labs",
#   "voiceId": "EXAVITQu4vr4xnSDxMaL",  # Default English
#   "model": "eleven_multilingual_v2"
# }
```

**Note**: Voice switching happens in webhook response, not Vapi config. Vapi receives `voiceId` in each response.

---

## Troubleshooting

### Issue: Voice doesn't switch

**Possible Causes**:
1. Webhook not returning `voiceId` in response
2. Language detection not working
3. ElevenLabs API error

**Debug Steps**:
```bash
# Test webhook directly with Mandarin input
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "transcript": {"content": "我很想念我的女儿"},
      "role": "user",
      "language": "zh-CN"
    }
  }' | jq '.'

# Response MUST include:
# {
#   "content": "我理解...",
#   "voiceId": "FGY2WhTYpPnrIDTdsKH5"  # Mandarin voice
# }
```

### Issue: Mandarin response is gibberish

**Possible Causes**:
1. Gemini not configured for Chinese output
2. Prompt not specifying "respond in same language"
3. Character encoding issue

**Fix**: Check [prompts/sam-personality.ts](../../../prompts/sam-personality.ts):
```typescript
const prompt = `
CRITICAL: Respond in the SAME LANGUAGE as the user's message.
- If user speaks English, respond in English
- If user speaks Mandarin (Chinese), respond in Mandarin
- Maintain natural, fluent language in both

User message: "${message}"
Detected language: "${detectedLanguage}"

Your response (in ${detectedLanguage}):
`;
```

### Issue: Language detection wrong

**Possible Causes**:
1. Detection library not installed
2. Mixed language confusing detector
3. Short phrases ambiguous

**Debug Steps**:
```typescript
// Test language detection utility
import { detectLanguage } from '../utils/conversation-helpers';

console.log(detectLanguage("我很想念我的女儿")); // Should return "zh-CN"
console.log(detectLanguage("Hello Sam")); // Should return "en-US"
console.log(detectLanguage("I love 饺子")); // Mixed - should return "en-US" (majority)
```

### Issue: Mixed language sentences not handled well

**Expected Behavior**:
- If >60% of words are one language, respond in that language
- If truly 50/50, prioritize emotional content language
- For greetings/closings, can be bilingual

**Example**:
```
Input: "Thank you Sam. 谢谢你陪我聊天。" (50% English, 50% Mandarin)
Emotional content: Mandarin (gratitude expressed in native language)
Best response: Mandarin OR bilingual closing
Acceptable: Either language
```

---

## Recording Instructions

### Camera Setup:
1. **Focus on Audio Quality**:
   - Use external microphone if possible
   - Emphasize voice changes (may need to boost volume in post)

2. **Visual Indicators**:
   - Subtitle or caption Mandarin phrases with English translation
   - Show language flag emoji (🇺🇸/🇨🇳) changing in dashboard

3. **Voiceover Script**:
   ```
   "Mrs. Chen is bilingual, fluent in both English and Mandarin.
   Watch how Sam seamlessly adapts to her language switching."

   [Mrs. Chen speaks Mandarin: "我很想念我的女儿"]
   [Caption: "I really miss my daughter"]

   "Sam detects the language change and responds in Mandarin
   with a different voice optimized for Chinese pronunciation."

   [Sam responds in Mandarin with Mandarin voice]

   "When Mrs. Chen switches back to English, Sam follows
   immediately - maintaining the same warm, conversational tone
   in both languages."
   ```

### For Judges Demo:
**Key Talking Points**:
1. "45% of US seniors speak a language other than English at home"
2. "Language switching is natural for bilingual seniors, especially for emotional topics"
3. "ElevenLabs multilingual model provides native-quality pronunciation"
4. "Sam maintains personality and warmth across languages - it's not just translation"

---

## Mandarin Phrases Reference

### Common Phrases Mrs. Chen Might Use:

| Mandarin | Pinyin | English | Topic |
|----------|--------|---------|-------|
| 我很想念我的女儿 | Wǒ hěn xiǎngniàn wǒ de nǚ'ér | I really miss my daughter | Family |
| 她住得很远 | Tā zhù de hěn yuǎn | She lives very far | Distance |
| 我今天有点累 | Wǒ jīntiān yǒudiǎn lèi | I'm a bit tired today | Health |
| 谢谢你陪我聊天 | Xièxiè nǐ péi wǒ liáotiān | Thank you for chatting with me | Gratitude |
| 我很孤单 | Wǒ hěn gūdān | I'm very lonely | Emotional |
| 你真好 | Nǐ zhēn hǎo | You're so kind | Appreciation |

### Expected Sam Responses:

| Mandarin | Pinyin | English | Context |
|----------|--------|---------|---------|
| 我理解 | Wǒ lǐjiě | I understand | Empathy |
| 那很好 | Nà hěn hǎo | That's good | Positive |
| 不客气 | Bù kèqì | You're welcome | Polite |
| 保重身体 | Bǎozhòng shēntǐ | Take care of yourself | Health |
| 我一直在这里 | Wǒ yīzhí zài zhèlǐ | I'm always here | Support |
| 再见 | Zàijiàn | Goodbye | Closing |

---

## Language Detection Algorithm

From [utils/conversation-helpers.ts](../../../utils/conversation-helpers.ts):

```typescript
export function detectLanguage(text: string): string {
  // Check for Chinese characters
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const totalChars = text.length;
  const chineseRatio = chineseChars ? chineseChars.length / totalChars : 0;

  // If >40% Chinese characters, classify as Mandarin
  if (chineseRatio > 0.4) {
    return 'zh-CN';
  }

  // Otherwise, classify as English
  return 'en-US';
}

export function selectVoiceId(language: string): string {
  const ENGLISH_VOICE = process.env.ELEVENLABS_ENGLISH_VOICE || 'EXAVITQu4vr4xnSDxMaL';
  const MANDARIN_VOICE = process.env.ELEVENLABS_MANDARIN_VOICE || 'FGY2WhTYpPnrIDTdsKH5';

  return language === 'zh-CN' ? MANDARIN_VOICE : ENGLISH_VOICE;
}
```

---

## Test Data Reference

Mrs. Chen profile languages:
```json
{
  "userId": "mrs-chen",
  "name": "Mrs. Margaret Chen",
  "languages": ["en-US", "zh-CN"],
  "languagePreferences": {
    "primary": "en-US",
    "emotionalTopics": "zh-CN",
    "familyTopics": "zh-CN"
  }
}
```

---

**Last Updated**: 2025-10-18
**Script Version**: 1.0
**Test Owner**: Developer 3 (Voice & Phone System)
