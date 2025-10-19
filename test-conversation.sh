#!/bin/bash

echo "Testing ElderLink Vapi Conversation Flow..."
echo "==========================================="
echo ""

URL="https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook"

# Test 1: Initial greeting
echo "Test 1: Initial Greeting"
echo "User: 'Hello Sam'"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "Hello Sam",
      "language": "en-US"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print('Sam:', data['message']['content'])"

echo ""
echo "---"

# Test 2: Health mention
echo "Test 2: Health Mention"
echo "User: 'My arthritis is bothering me today'"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "My arthritis is bothering me today",
      "language": "en-US"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print('Sam:', data['message']['content'])"

echo ""
echo "---"

# Test 3: Family mention
echo "Test 3: Family Reference"
echo "User: 'Sarah called me yesterday'"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "Sarah called me yesterday",
      "language": "en-US"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print('Sam:', data['message']['content'])"

echo ""
echo "---"

# Test 4: Language switch to Mandarin
echo "Test 4: Language Switch"
echo "User: '我今天很累' (I'm very tired today)"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "我今天很累",
      "language": "zh-CN"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print('Sam:', data['message']['content'], '(Language:', data['message']['language'], ')')"

echo ""
echo "---"

# Test 5: Ending conversation
echo "Test 5: Ending Conversation"
echo "User: 'Goodbye Sam, talk to you later'"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "Goodbye Sam, talk to you later",
      "language": "en-US"
    },
    "call": {
      "phoneNumber": "+12248581016"
    }
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print('Sam:', data['message']['content'])"

echo ""
echo "==========================================="
echo "Conversation flow test complete!"