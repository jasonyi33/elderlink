#!/bin/bash

##############################################################################
# Vapi Assistant Deployment Script
# Updates existing Vapi assistant with ElderLink configuration
##############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        ELDERLINK VAPI ASSISTANT DEPLOYMENT                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Load environment variables
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    exit 1
fi

source .env

# Validate required environment variables
if [ -z "$VAPI_API_KEY" ]; then
    echo -e "${RED}❌ Error: VAPI_API_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$VAPI_ASSISTANT_ID" ]; then
    echo -e "${RED}❌ Error: VAPI_ASSISTANT_ID not set in .env${NC}"
    echo -e "${YELLOW}If you haven't created an assistant yet, create one first in the Vapi dashboard${NC}"
    exit 1
fi

if [ -z "$ELEVENLABS_ENGLISH_VOICE" ]; then
    echo -e "${RED}❌ Error: ELEVENLABS_ENGLISH_VOICE not set in .env${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Assistant ID: $VAPI_ASSISTANT_ID"
echo "   English Voice: $ELEVENLABS_ENGLISH_VOICE"
echo "   Mandarin Voice: ${ELEVENLABS_MANDARIN_VOICE:-Not set}"
echo "   Worker URL: https://elderlink-dev.elderlinkhelper.workers.dev"
echo ""

# Create the update payload
PAYLOAD=$(cat <<EOF
{
  "name": "Sam - ElderLink Companion",
  "model": {
    "provider": "custom-llm",
    "url": "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook",
    "model": "custom",
    "temperature": 0.7,
    "maxTokens": 150
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "$ELEVENLABS_ENGLISH_VOICE",
    "model": "eleven_multilingual_v2",
    "stability": 0.7,
    "similarityBoost": 0.8,
    "style": 0.5,
    "useSpeakerBoost": true,
    "optimizeStreamingLatency": 3
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en-US",
    "smartFormat": true,
    "keywords": ["Chen:2", "Sarah:2", "Tommy:2", "gardening", "piano", "Lisinopril:2", "Metformin:2", "arthritis"]
  },
  "firstMessage": "Hello! This is Sam. Who am I speaking with today?",
  "endCallMessage": "It was wonderful talking with you. Take care!",
  "endCallPhrases": ["goodbye", "bye", "talk to you later", "gotta go", "need to go"],
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 900,
  "backgroundSound": "off",
  "backchannelingEnabled": false,
  "serverMessages": [
    "conversation-update",
    "end-of-call-report",
    "hang",
    "speech-update"
  ],
  "clientMessages": [],
  "serverUrl": "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook"
}
EOF
)

echo -e "${YELLOW}🚀 Updating Vapi assistant...${NC}"

# Update the assistant using Vapi API
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  "https://api.vapi.ai/assistant/$VAPI_ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
# Extract response body (all but last line)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✅ SUCCESS! Assistant updated successfully${NC}"
    echo ""
    echo -e "${BLUE}📊 Assistant Details:${NC}"
    echo "$BODY" | jq -r '
        "   Name: \(.name // "N/A")",
        "   ID: \(.id // "N/A")",
        "   Model Provider: \(.model.provider // "N/A")",
        "   Webhook URL: \(.model.url // "N/A")",
        "   Voice Provider: \(.voice.provider // "N/A")",
        "   Voice ID: \(.voice.voiceId // "N/A")",
        "   Transcriber: \(.transcriber.provider // "N/A") \(.transcriber.model // "")"
    '
    echo ""
    echo -e "${GREEN}✅ Configuration Applied:${NC}"
    echo "   • Custom LLM webhook configured"
    echo "   • ElevenLabs multilingual voice enabled"
    echo "   • Deepgram nova-2 transcription configured"
    echo "   • Elderly-friendly voice settings applied"
    echo "   • Keywords for Mrs. Chen context added"
    echo "   • Response timeout: 10 seconds"
    echo "   • Silence timeout: 30 seconds"
    echo ""
    echo -e "${BLUE}📞 Next Steps:${NC}"
    echo "   1. Link assistant to phone number: $VAPI_PHONE_NUMBER"
    echo "   2. Test by calling: $VAPI_PHONE_NUMBER"
    echo "   3. Verify Sam responds within 3 seconds"
    echo "   4. Test language switching (English ↔ Mandarin)"
    echo ""
    echo -e "${YELLOW}⚠️  Note: The webhook endpoint must be deployed by Developer 2${NC}"
    echo -e "${YELLOW}   Current status: Check https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook${NC}"
    echo ""
else
    echo -e "${RED}❌ FAILED to update assistant${NC}"
    echo -e "${RED}HTTP Status: $HTTP_CODE${NC}"
    echo ""
    echo -e "${YELLOW}Response:${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${YELLOW}Common Issues:${NC}"
    echo "   • Invalid API key (check VAPI_API_KEY in .env)"
    echo "   • Invalid assistant ID (check VAPI_ASSISTANT_ID in .env)"
    echo "   • Invalid voice ID (check ELEVENLABS_ENGLISH_VOICE in .env)"
    echo "   • Network connectivity issues"
    echo ""
    exit 1
fi

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            DEPLOYMENT COMPLETE                             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
