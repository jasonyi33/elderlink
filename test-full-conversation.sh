#!/bin/bash

echo "Testing ElderLink Conversation System"
echo "======================================"

# Test 1: Initial greeting
echo -e "\n1. Testing initial greeting..."
curl -s -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook' \
  -H 'Content-Type: application/json' \
  -d '{"message":{"content":"Hello Sam"},"call":{"phoneNumber":"+12248581016","language":"english"}}' | \
  jq -r '.message.content'

sleep 2

# Test 2: Health mention
echo -e "\n2. Testing health mention..."
curl -s -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook' \
  -H 'Content-Type: application/json' \
  -d '{"message":{"content":"My arthritis has been bothering me today"},"call":{"phoneNumber":"+12248581016","language":"english"}}' | \
  jq -r '.message.content'

sleep 2

# Test 3: Family memory
echo -e "\n3. Testing family memory reference..."
curl -s -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook' \
  -H 'Content-Type: application/json' \
  -d '{"message":{"content":"I talked to Sarah yesterday"},"call":{"phoneNumber":"+12248581016","language":"english"}}' | \
  jq -r '.message.content'

sleep 2

# Test 4: Mandarin language
echo -e "\n4. Testing Mandarin language..."
curl -s -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook' \
  -H 'Content-Type: application/json' \
  -d '{"message":{"content":"你好，我今天很累"},"call":{"phoneNumber":"+12248581016","language":"mandarin"}}' | \
  jq -r '.message.content'

sleep 2

# Test 5: Goodbye
echo -e "\n5. Testing goodbye..."
curl -s -X POST 'https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook' \
  -H 'Content-Type: application/json' \
  -d '{"message":{"content":"Goodbye Sam, talk to you later"},"call":{"phoneNumber":"+12248581016","language":"english"}}' | \
  jq -r '.message.content'

echo -e "\n======================================"
echo "Tests complete!"