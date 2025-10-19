#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
ASSISTANT_ID="5af660dd-dada-4863-af15-383c693873f7"

echo "📞 Fetching recent Vapi calls..."
echo ""

curl -X GET "https://api.vapi.ai/call?assistantId=${ASSISTANT_ID}&limit=10" \
  -H "Authorization: Bearer ${VAPI_API_KEY}" \
  | jq '.[] | {
    id: .id,
    createdAt: .createdAt,
    status: .status,
    endedReason: .endedReason,
    duration: .duration,
    type: .type,
    customerNumber: .customer.number
  }'
