#!/bin/bash

# Voice Quality Testing Script for ElderLink
# Tests both English and Mandarin voice configurations

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🎤 Testing ElevenLabs Voice Quality for ElderLink"
echo "=================================================="
echo ""

# Check if ELEVENLABS_API_KEY is set
if [ -z "$ELEVENLABS_API_KEY" ]; then
  echo -e "${RED}❌ Error: ELEVENLABS_API_KEY environment variable not set${NC}"
  echo "Please set it with: export ELEVENLABS_API_KEY=your_key_here"
  echo "Or add it to your .env file"
  exit 1
fi

echo -e "${YELLOW}📝 Creating test audio files...${NC}"
echo ""

# Test English voice
echo "1️⃣  Testing English voice (EXAVITQu4vr4xnSDxMaL)..."
curl -X POST https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello Mrs. Chen! How are those tomatoes in your garden doing? I hope Sarah had a wonderful visit last weekend.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.7,
      "similarity_boost": 0.8,
      "style": 0.5,
      "use_speaker_boost": true
    }
  }' \
  --output recordings/test-english.mp3 \
  --silent

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ English audio file created: recordings/test-english.mp3${NC}"
else
  echo -e "${RED}❌ Failed to create English audio file${NC}"
  exit 1
fi

echo ""

# Test Mandarin voice
echo "2️⃣  Testing Mandarin voice (FGY2WhTYpPnrIDTdsKH5)..."
curl -X POST https://api.elevenlabs.io/v1/text-to-speech/FGY2WhTYpPnrIDTdsKH5 \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "你好陈太太！你的花园里的西红柿怎么样了？我希望莎拉上周末来看你了。",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.7,
      "similarity_boost": 0.8,
      "style": 0.5,
      "use_speaker_boost": true
    }
  }' \
  --output recordings/test-mandarin.mp3 \
  --silent

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Mandarin audio file created: recordings/test-mandarin.mp3${NC}"
else
  echo -e "${RED}❌ Failed to create Mandarin audio file${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Both audio files generated successfully!${NC}"
echo ""
echo "📋 Quality Checklist:"
echo "  [ ] Voice sounds warm and friendly (not robotic)"
echo "  [ ] Clear pronunciation"
echo "  [ ] Appropriate pace (not too fast)"
echo "  [ ] Natural intonation"
echo "  [ ] No crackling or artifacts"
echo "  [ ] Suitable for elderly (clear, not too high-pitched)"
echo ""
echo "🎧 To play the audio files:"
echo "  English: afplay recordings/test-english.mp3"
echo "  Mandarin: afplay recordings/test-mandarin.mp3"
echo ""
echo "🔊 For speakerphone test (Task 4.3c):"
echo "  1. Play through speakerphone"
echo "  2. Listen from 6-8 feet away"
echo "  3. Check for echo, clarity, and volume"
