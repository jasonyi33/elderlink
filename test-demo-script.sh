#!/bin/bash

# Test script to reproduce the time-based demo bug
# This simulates the conversation flow described in the issue

API_URL="https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions"

echo "====== TIME-BASED DEMO TEST ======"
echo "Testing conversation flow with ~10 second delays between messages"
echo ""

# Message 1: At ~0 seconds (should trigger Response 1)
echo "[T+0s] Sending message 1: 'My tomatoes are growing great, but my knee aches a bit'"
RESPONSE1=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"My tomatoes are growing great, but my knee aches a bit"}]}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])")

echo "Response 1: $RESPONSE1"
echo ""

# Wait 10 seconds (elapsed time should now be ~10s, triggering Response 2)
echo "Waiting 10 seconds..."
sleep 10

# Message 2: At ~10 seconds (should trigger Response 2)
echo "[T+10s] Sending message 2: 'Yes I took it, and the stretches are helping too'"
RESPONSE2=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"Yes I took it, and the stretches are helping too"}]}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])")

echo "Response 2: $RESPONSE2"
echo ""

# Wait another 10 seconds (elapsed time should now be ~20s, triggering Response 3)
echo "Waiting 10 seconds..."
sleep 10

# Message 3: At ~20 seconds (should trigger Response 3 - Mandarin)
echo "[T+20s] Sending message 3: '谢谢你，Sam。我今天有点累'"
RESPONSE3=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"model":"custom","messages":[{"role":"user","content":"谢谢你，Sam。我今天有点累"}]}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])")

echo "Response 3: $RESPONSE3"
echo ""

# Analysis
echo "====== ANALYSIS ======"
echo "Expected Response 1: 'I'm sorry to hear about your knee...'"
echo "Expected Response 2: 'That's wonderful to hear! I'll note that down...'"
echo "Expected Response 3: '没关系，陈太太。记得多休息，多喝水。'"
echo ""

# Check for the bug
if [[ "$RESPONSE2" == *"sorry to hear about your knee"* ]]; then
  echo "❌ BUG DETECTED: Response 2 is repeating Response 1!"
  echo "This indicates demoCallStartTime is not persisting between requests."
else
  echo "✅ Test PASSED: Responses are progressing correctly"
fi
