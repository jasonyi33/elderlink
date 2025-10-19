#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "🔧 Reverting to default firstMessage mode..."
echo ""

# Revert to default: assistant-speaks-first (no webhook call for first message)
curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstMessageMode": "assistant-speaks-first"
  }' | jq '{
    name: .name,
    firstMessage: .firstMessage,
    firstMessageMode: .firstMessageMode,
    serverUrl: .serverUrl
  }'

echo ""
echo "✅ Reverted to default mode!"
echo ""
echo "Expected behavior:"
echo "  1. Call connects"
echo "  2. Static firstMessage plays: 'Hello! This is Sam. Who am I speaking with today?'"
echo "  3. You respond to Sam"
echo "  4. Deepgram transcribes your speech"
echo "  5. Webhook receives conversation-update with your message"
echo "  6. We generate response and conversation continues"
echo ""
echo "📞 Call now: +12248581016"
