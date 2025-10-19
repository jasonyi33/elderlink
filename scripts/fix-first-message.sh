#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "🔧 Fixing firstMessage configuration..."
echo ""

# Option 1: Generate first message via model
curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstMessageMode": "assistant-speaks-first-with-model-generated-message"
  }' | jq '{
    name: .name,
    firstMessage: .firstMessage,
    firstMessageMode: .firstMessageMode,
    serverUrl: .serverUrl
  }'

echo ""
echo "✅ Configuration updated!"
echo "📞 Now try calling: +12248581016"
echo ""
echo "Expected behavior:"
echo "  1. Call connects"
echo "  2. Our webhook is called to generate first message"
echo "  3. Sam says generated greeting"
echo "  4. Deepgram starts transcribing your speech"
echo "  5. Webhook receives conversation-update messages"
