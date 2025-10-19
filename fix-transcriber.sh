#!/bin/bash

# Fix Vapi transcriber to support multilingual (if phone test fails)

echo "Updating Vapi transcriber to support multilingual..."

curl -X PATCH https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7 \
  -H "Authorization: Bearer a0a0d259-804e-4079-8a99-524a6a792cec" \
  -H "Content-Type: application/json" \
  -d '{
    "transcriber": {
      "model": "whisper",
      "language": "zh",
      "provider": "talkscriber"
    }
  }' | python3 -m json.tool

echo ""
echo "✅ Transcriber updated to Chinese (zh)"
echo "Re-test by calling (224) 858-1016"
