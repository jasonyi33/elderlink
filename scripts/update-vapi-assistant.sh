#!/bin/bash

# Update Vapi Assistant Configuration to ensure conversation-update is enabled

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "🔄 Updating Vapi Assistant Configuration..."
echo "Assistant ID: $ASSISTANT_ID"
echo ""

# Update assistant with serverMessages configuration
curl -X PATCH "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "serverUrl": "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook",
    "serverMessages": [
      "conversation-update",
      "end-of-call-report",
      "hang",
      "speech-update",
      "status-update"
    ],
    "model": {
      "provider": "custom-llm",
      "url": "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook",
      "model": "custom",
      "temperature": 0.7,
      "maxTokens": 150
    }
  }' | jq .

echo ""
echo "✅ Assistant configuration updated!"
echo ""
echo "🔍 Verifying configuration..."

# Get and display the updated configuration
curl -X GET "https://api.vapi.ai/assistant/$ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  | jq '{
    name: .name,
    serverUrl: .serverUrl,
    serverMessages: .serverMessages,
    model: .model
  }'

echo ""
echo "📞 Now try calling: +12248581016"
