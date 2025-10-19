#!/bin/bash

##############################################################################
# Vapi Status Verification Script
# Checks current configuration of phone number, assistant, and webhook
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           VAPI CONFIGURATION STATUS CHECK                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Load environment
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

source .env

echo -e "${BLUE}1. Environment Variables:${NC}"
if [ -n "$VAPI_API_KEY" ]; then
    echo -e "   ${GREEN}✅${NC} VAPI_API_KEY: ${VAPI_API_KEY:0:20}..."
else
    echo -e "   ${RED}❌${NC} VAPI_API_KEY: Not set"
fi

if [ -n "$VAPI_PHONE_NUMBER" ]; then
    echo -e "   ${GREEN}✅${NC} VAPI_PHONE_NUMBER: $VAPI_PHONE_NUMBER"
else
    echo -e "   ${RED}❌${NC} VAPI_PHONE_NUMBER: Not set"
fi

if [ -n "$VAPI_ASSISTANT_ID" ]; then
    echo -e "   ${GREEN}✅${NC} VAPI_ASSISTANT_ID: $VAPI_ASSISTANT_ID"
else
    echo -e "   ${RED}❌${NC} VAPI_ASSISTANT_ID: Not set"
fi

if [ -n "$ELEVENLABS_ENGLISH_VOICE" ]; then
    echo -e "   ${GREEN}✅${NC} ELEVENLABS_ENGLISH_VOICE: $ELEVENLABS_ENGLISH_VOICE"
else
    echo -e "   ${YELLOW}⚠️${NC}  ELEVENLABS_ENGLISH_VOICE: Not set"
fi

echo ""
echo -e "${BLUE}2. Assistant Configuration:${NC}"

ASSISTANT_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "https://api.vapi.ai/assistant/$VAPI_ASSISTANT_ID" \
  -H "Authorization: Bearer $VAPI_API_KEY")

HTTP_CODE=$(echo "$ASSISTANT_RESPONSE" | tail -n1)
ASSISTANT_BODY=$(echo "$ASSISTANT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "   ${GREEN}✅ Assistant found${NC}"
    echo "$ASSISTANT_BODY" | jq -r '
        "   Name: \(.name // "N/A")",
        "   Model Provider: \(.model.provider // "N/A")",
        "   Webhook URL: \(.model.url // "N/A")",
        "   Voice Provider: \(.voice.provider // "N/A")",
        "   Voice ID: \(.voice.voiceId // "N/A")",
        "   Voice Model: \(.voice.model // "N/A")",
        "   Transcriber: \(.transcriber.provider // "N/A") \(.transcriber.model // "")",
        "   Request Timeout: \(.requestTimeoutSeconds // "N/A")s"
    '

    # Check if webhook URL is correct
    WEBHOOK_URL=$(echo "$ASSISTANT_BODY" | jq -r '.model.url // ""')
    if [[ "$WEBHOOK_URL" == *"elderlink"*"vapi-webhook"* ]]; then
        echo -e "   ${GREEN}✅${NC} Webhook URL configured correctly"
    else
        echo -e "   ${YELLOW}⚠️${NC}  Webhook URL: $WEBHOOK_URL (should contain 'elderlink' and 'vapi-webhook')"
    fi
else
    echo -e "   ${RED}❌ Failed to fetch assistant (HTTP $HTTP_CODE)${NC}"
    echo "$ASSISTANT_BODY"
fi

echo ""
echo -e "${BLUE}3. Phone Number Configuration:${NC}"

PHONE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "https://api.vapi.ai/phone-number" \
  -H "Authorization: Bearer $VAPI_API_KEY")

HTTP_CODE=$(echo "$PHONE_RESPONSE" | tail -n1)
PHONE_BODY=$(echo "$PHONE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    # Extract our phone number's configuration
    PHONE_CONFIG=$(echo "$PHONE_BODY" | jq --arg phone "$VAPI_PHONE_NUMBER" '.[] | select(.number == $phone)')

    if [ -n "$PHONE_CONFIG" ]; then
        echo -e "   ${GREEN}✅ Phone number found: $VAPI_PHONE_NUMBER${NC}"
        LINKED_ASSISTANT=$(echo "$PHONE_CONFIG" | jq -r '.assistantId // "none"')

        if [ "$LINKED_ASSISTANT" == "$VAPI_ASSISTANT_ID" ]; then
            echo -e "   ${GREEN}✅${NC} Linked to correct assistant"
        elif [ "$LINKED_ASSISTANT" == "none" ] || [ "$LINKED_ASSISTANT" == "null" ]; then
            echo -e "   ${RED}❌${NC} NOT linked to any assistant"
            echo -e "   ${YELLOW}→ Go to Vapi dashboard and link phone to assistant${NC}"
        else
            echo -e "   ${YELLOW}⚠️${NC}  Linked to different assistant: $LINKED_ASSISTANT"
        fi
    else
        echo -e "   ${RED}❌ Phone number $VAPI_PHONE_NUMBER not found${NC}"
    fi
else
    echo -e "   ${RED}❌ Failed to fetch phone numbers (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo -e "${BLUE}4. Webhook Endpoint Status:${NC}"

WEBHOOK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook" \
  -H "Content-Type: application/json" \
  -d '{"message":{"transcript":{"content":"test"},"role":"user","language":"en-US"},"conversationHistory":[]}')

HTTP_CODE=$(echo "$WEBHOOK_RESPONSE" | tail -n1)
WEBHOOK_BODY=$(echo "$WEBHOOK_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "   ${GREEN}✅ Webhook endpoint is LIVE${NC}"
    echo -e "   ${GREEN}✅ Ready to receive calls${NC}"
    echo "$WEBHOOK_BODY" | jq '.' 2>/dev/null || echo "   Response: $WEBHOOK_BODY"
elif [ "$HTTP_CODE" -eq 404 ]; then
    echo -e "   ${YELLOW}⚠️  Webhook endpoint returns 404 (Not Found)${NC}"
    echo -e "   ${YELLOW}→ Developer 2 needs to implement /vapi-webhook handler${NC}"
    echo -e "   ${YELLOW}→ Calls will fail until webhook is deployed${NC}"
else
    echo -e "   ${RED}❌ Webhook returned HTTP $HTTP_CODE${NC}"
    echo "   Response: $WEBHOOK_BODY"
fi

echo ""
echo -e "${BLUE}5. Overall Status:${NC}"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "   ${GREEN}✅ READY FOR PRODUCTION${NC}"
    echo -e "   ${GREEN}→ All systems operational${NC}"
    echo -e "   ${GREEN}→ You can call: $VAPI_PHONE_NUMBER${NC}"
else
    echo -e "   ${YELLOW}⚠️  PARTIALLY CONFIGURED${NC}"
    echo -e "   ${YELLOW}→ Assistant and phone configured${NC}"
    echo -e "   ${YELLOW}→ Waiting for webhook deployment (Developer 2)${NC}"
    echo -e "   ${YELLOW}→ Calls will connect but Sam won't respond yet${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  STATUS CHECK COMPLETE                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
