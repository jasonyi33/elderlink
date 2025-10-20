#!/bin/bash

echo "====== VAPI CONFIGURATION TEST ======"
echo ""

# Test if both endpoints are accessible
echo "1. Testing /chat/completions endpoint..."
RESPONSE1=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"test"}]}')

HTTP_CODE1=$(echo "$RESPONSE1" | grep "HTTP_CODE" | cut -d: -f2)
BODY1=$(echo "$RESPONSE1" | sed '/HTTP_CODE/d')

echo "HTTP Code: $HTTP_CODE1"
echo "Response: ${BODY1:0:100}..."
echo ""

echo "2. Testing /vapi-webhook endpoint..."
RESPONSE2=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"test"}]}')

HTTP_CODE2=$(echo "$RESPONSE2" | grep "HTTP_CODE" | cut -d: -f2)
BODY2=$(echo "$RESPONSE2" | sed '/HTTP_CODE/d')

echo "HTTP Code: $HTTP_CODE2"
echo "Response: ${BODY2:0:100}..."
echo ""

echo "3. Checking demo mode status..."
DEMO_STATUS=$(curl -s https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode)
echo "$DEMO_STATUS"
echo ""

echo "====== INSTRUCTIONS ======"
echo "The Vapi assistant should be configured with:"
echo "  Model URL: https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions"
echo "  (or /vapi-webhook - both work)"
echo ""
echo "To verify Vapi configuration:"
echo "1. Go to https://dashboard.vapi.ai/assistants"
echo "2. Find 'Sam - ElderLink AI Companion'"
echo "3. Check Model → Server URL"
echo "4. Should be one of the URLs above"
echo ""
echo "To test with a phone call:"
echo "1. Call: +1 (224) 858-1016"
echo "2. The responses should progress through the time-based script"
echo "3. Watch logs: npx wrangler tail --env dev | grep '\[DEMO\]'"
