#!/bin/bash

VAPI_API_KEY="a0a0d259-804e-4079-8a99-524a6a792cec"
CALL_ID="$1"

if [ -z "$CALL_ID" ]; then
  echo "Usage: $0 <call_id>"
  exit 1
fi

echo "📞 Fetching call details for: $CALL_ID"
echo ""

curl -X GET "https://api.vapi.ai/call/${CALL_ID}" \
  -H "Authorization: Bearer ${VAPI_API_KEY}" \
  | jq '{
    id: .id,
    status: .status,
    endedReason: .endedReason,
    startedAt: .startedAt,
    endedAt: .endedAt,
    cost: .cost,
    messages: .messages | length,
    transcript: .transcript,
    analysis: .analysis
  }'
