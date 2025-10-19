#!/bin/bash

# Test Gemini API directly
API_KEY=""

curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, just testing if API works. Reply with a simple greeting."
      }]
    }]
  }' | jq '.'
