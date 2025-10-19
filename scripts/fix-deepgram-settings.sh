#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "🔧 Updating Deepgram transcriber settings for better audio detection..."
echo ""

curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transcriber": {
      "provider": "deepgram",
      "model": "nova-2",
      "language": "en",
      "smartFormat": false,
      "languageDetectionEnabled": true,
      "endpointing": 255,
      "keywords": []
    }
  }' | jq '{
    name: .name,
    transcriber: .transcriber
  }'

echo ""
echo "✅ Updated transcriber settings!"
echo ""
echo "Changes made:"
echo "  - Removed strict keywords that might be blocking transcription"
echo "  - Enabled language detection"
echo "  - Set endpointing to maximum (255ms) for better speech detection"
echo "  - Disabled smart formatting to reduce processing overhead"
echo ""
echo "📞 Try calling again: +12248581016"
