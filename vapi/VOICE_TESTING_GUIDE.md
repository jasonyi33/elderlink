# Voice Quality Testing Guide

## Overview
This guide covers testing the ElevenLabs voice configurations for ElderLink's Sam AI companion.

## Voice Configurations

### English Voice
- **Voice ID**: `EXAVITQu4vr4xnSDxMaL`
- **Name**: Sarah (ElevenLabs)
- **Model**: `eleven_multilingual_v2`
- **Description**: Warm, mature female voice - perfect for elderly companion

### Mandarin Voice
- **Voice ID**: `FGY2WhTYpPnrIDTdsKH5`
- **Name**: Mandarin Female (ElevenLabs)
- **Model**: `eleven_multilingual_v2`
- **Description**: Native Mandarin speaker with warm, caring tone

## Voice Settings (Both Languages)

```json
{
  "stability": 0.7,
  "similarity_boost": 0.8,
  "style": 0.5,
  "use_speaker_boost": true,
  "optimize_streaming_latency": 3
}
```

### Setting Explanations

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Stability** | 0.7 | Balanced consistency - not too robotic (1.0) or variable (0.0). Ensures reliable pronunciation for elderly listeners. |
| **Similarity Boost** | 0.8 | High voice characteristic retention. Maintains natural voice qualities. |
| **Style** | 0.5 | Moderate expressiveness - conversational without being overly dramatic. |
| **Speaker Boost** | true | Enhanced clarity for phone calls and potential hearing difficulties. |
| **Optimize Streaming Latency** | 3 | Maximum optimization for <500ms synthesis time. Critical for <3s total response time. |

## Testing Procedure

### Task 4.3b: Voice Quality Test

#### Step 1: Generate Test Audio

```bash
# Export your ElevenLabs API key
export ELEVENLABS_API_KEY="your_key_here"

# Run the test script
./scripts/test-voice.sh
```

This will create:
- `recordings/test-english.mp3` - English voice sample
- `recordings/test-mandarin.mp3` - Mandarin voice sample

#### Step 2: Listen and Evaluate

**Quality Checklist:**

- [ ] **Warmth**: Does the voice sound warm and friendly (not robotic)?
- [ ] **Clarity**: Is pronunciation clear and easy to understand?
- [ ] **Pace**: Is the speaking pace appropriate (not too fast for elderly)?
- [ ] **Intonation**: Does it sound natural with proper emphasis?
- [ ] **Audio Quality**: No crackling, artifacts, or distortion?
- [ ] **Suitability**: Voice pitch and tone suitable for elderly listeners?
- [ ] **Consistency**: Similar quality between English and Mandarin?

**Play Commands:**
```bash
# macOS
afplay recordings/test-english.mp3
afplay recordings/test-mandarin.mp3

# Linux
mpg123 recordings/test-english.mp3
mpg123 recordings/test-mandarin.mp3

# Windows
start recordings/test-english.mp3
start recordings/test-mandarin.mp3
```

### Task 4.3c: Speakerphone Test

#### Setup
1. Connect to a Bluetooth speaker or use phone speakerphone
2. Play the test audio files
3. Listen from **6-8 feet away** (typical demo distance)

#### Evaluation Checklist

- [ ] **No Echo**: Sound doesn't echo or create feedback loops
- [ ] **Volume**: Clear and loud enough at 6-8 feet distance
- [ ] **Clarity**: Words remain clear at distance (not muffled)
- [ ] **Natural Sound**: Not tinny or distorted through speaker
- [ ] **Consistency**: Quality maintained throughout entire sample

#### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Too Quiet** | Increase volume on playback device, or add `volume: "+3dB"` in settings |
| **Too Fast** | Reduce `speaking_rate` to 0.9 (10% slower) |
| **Unclear** | Increase `stability` to 0.8 or enable/verify `speaker_boost` |
| **Robotic** | Decrease `stability` to 0.6, increase `style` to 0.6 |
| **Echo/Feedback** | Issue with speaker/environment, not voice settings |

## Troubleshooting Voice Issues

### Poor Voice Quality

If voice sounds robotic or unnatural:

1. **Adjust Stability** (try different values):
   ```json
   "stability": 0.6  // More expressive but less consistent
   "stability": 0.8  // More consistent but potentially robotic
   ```

2. **Adjust Similarity Boost**:
   ```json
   "similarity_boost": 0.75  // Lower if voice sounds strange
   "similarity_boost": 0.85  // Higher for more natural characteristics
   ```

3. **Try Different Voice IDs**:
   - Browse ElevenLabs voice library
   - Filter for: Female, Mature, Warm, Conversational
   - Test with same settings

### Latency Issues

If voice synthesis is too slow:

1. **Verify Optimization**:
   ```json
   "optimize_streaming_latency": 4  // Maximum optimization (may reduce quality)
   ```

2. **Check Model**:
   - `eleven_multilingual_v2` required for Mandarin
   - `eleven_monolingual_v1` faster for English-only (not used due to language switching)

3. **Test Synthesis Time**:
   ```bash
   time curl -X POST https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL \
     -H "xi-api-key: $ELEVENLABS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"text": "Test", "model_id": "eleven_multilingual_v2"}' \
     --output test.mp3
   ```

   **Target**: <500ms for synthesis

### Language Switching Issues

If Mandarin detection/switching doesn't work:

1. **Verify Language Detection**:
   ```json
   "language_detection": true
   ```

2. **Check Model**: Must use `eleven_multilingual_v2` for both voices

3. **Test Different Voice ID**: Try other Mandarin voices from ElevenLabs library

## Integration with Vapi

### Voice Configuration in Vapi Assistant

When creating the Vapi assistant (see `VAPI_ACCOUNT_CONFIGURATION_GUIDE.md`), use these settings:

```json
{
  "voice": {
    "provider": "elevenlabs",
    "voiceId": "EXAVITQu4vr4xnSDxMaL",  // Default to English
    "stability": 0.7,
    "similarityBoost": 0.8,
    "model": "eleven_multilingual_v2",
    "optimizeStreamingLatency": 3,
    "languageDetection": true
  }
}
```

### Language Switching Logic

Vapi will automatically:
1. Detect language in user's speech (via Deepgram transcription)
2. Switch to appropriate voice based on detected language
3. Maintain conversation context across language switches

**Expected Behavior:**
- User speaks English → Sam responds with English voice (EXAVITQu4vr4xnSDxMaL)
- User speaks Mandarin → Sam responds with Mandarin voice (FGY2WhTYpPnrIDTdsKH5)
- Switch latency: <200ms

## Performance Targets

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Voice Synthesis | <500ms | TBD | ⏳ Pending |
| Voice Quality Score | >90% | TBD | ⏳ Pending |
| Speakerphone Clarity | Clear at 6-8ft | TBD | ⏳ Pending |
| Language Switch Latency | <200ms | TBD | ⏳ Pending |
| Total Response Time | <3s | TBD | ⏳ Pending |

## Test Results Log

### English Voice Test
- **Date**: _____________
- **Quality Score**: ___/10
- **Issues**: _____________________________________________
- **Adjustments Made**: ___________________________________
- **Final Verdict**: ☐ Pass  ☐ Needs Adjustment  ☐ Fail

### Mandarin Voice Test
- **Date**: _____________
- **Quality Score**: ___/10
- **Issues**: _____________________________________________
- **Adjustments Made**: ___________________________________
- **Final Verdict**: ☐ Pass  ☐ Needs Adjustment  ☐ Fail

### Speakerphone Test
- **Date**: _____________
- **Distance**: ______ feet
- **Echo**: ☐ Yes  ☐ No
- **Clarity**: ☐ Excellent  ☐ Good  ☐ Fair  ☐ Poor
- **Volume**: ☐ Too Loud  ☐ Just Right  ☐ Too Quiet
- **Final Verdict**: ☐ Pass  ☐ Needs Adjustment  ☐ Fail

## Next Steps After Testing

Once voice quality is verified:

1. ✅ **Update** `vapi/assistant-config.json` with final settings
2. ✅ **Create** Vapi assistant with verified configuration
3. ✅ **Test** end-to-end phone call with voice switching
4. ✅ **Measure** actual latency in production environment
5. ✅ **Document** any deviations from original settings

## References

- **Implementation Plan**: `DEVELOPER_3_IMPLEMENTATION_PLAN.md` (Task 4.3)
- **Vapi Configuration**: `VAPI_ACCOUNT_CONFIGURATION_GUIDE.md`
- **Voice Settings**: `vapi/voice-settings.json`
- **Test Script**: `scripts/test-voice.sh`
- **PRD Reference**: `PRD.md` (Section on Voice & Multilingual Support)
