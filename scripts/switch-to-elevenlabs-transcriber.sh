#!/bin/bash

VAPI_API_KEY=""
ASSISTANT_ID=""

echo "🔧 Switching transcriber to ElevenLabs..."
echo ""

curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transcriber": {
      "provider": "talkscriber",
      "model": "whisper",
      "language": "en"
    }
  }' | jq '{
    name: .name,
    transcriber: .transcriber,
    voice: .voice
  }'

echo ""
echo "✅ Switched to ElevenLabs transcriber!"
echo "📞 Try calling: +12248581016"
