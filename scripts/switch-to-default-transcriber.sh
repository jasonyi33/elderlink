#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "🔧 Removing custom transcriber settings (use Vapi defaults)..."
echo ""

curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transcriber": null
  }' | jq '{
    name: .name,
    transcriber: .transcriber
  }'

echo ""
echo "✅ Transcriber reset to Vapi defaults!"
echo "📞 Try calling: +12248581016"
