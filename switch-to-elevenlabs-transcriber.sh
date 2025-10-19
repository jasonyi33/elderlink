#!/bin/bash

# Switch transcriber to ElevenLabs for both ways

echo "Switching transcriber to ElevenLabs..."

curl -X PATCH https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7 \
  -H "Authorization: Bearer a0a0d259-804e-4079-8a99-524a6a792cec" \
  -H "Content-Type: application/json" \
  -d '{
    "transcriber": {
      "provider": "11labs",
      "model": "eleven_turbo_v2",
      "language": "auto"
    }
  }' | python3 -m json.tool

echo ""
echo "✅ Transcriber switched to ElevenLabs with auto language detection"
echo "This enables true multilingual support for both input and output"
echo ""
echo "Re-test by calling (224) 858-1016 and speaking Chinese"
