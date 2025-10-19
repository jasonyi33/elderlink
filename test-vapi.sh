#!/bin/bash

# Test the Vapi webhook endpoint
curl -X POST https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "content": "Hello Sam, how are you today?"
    },
    "call": {
      "phoneNumber": "+12248581016",
      "language": "english"
    }
  }'