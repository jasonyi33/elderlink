#!/bin/bash

echo "====== SIMPLE DEMO MODE TEST ======"
echo ""

# Test each response in sequence
echo "Response 1 (conversation count = 0):"
curl -s -X POST "https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"My tomatoes are growing great"}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
echo ""

echo "Response 2 (after 1 conversation saved):"
echo "Note: This won't work via curl because conversations aren't saved between requests"
echo "But on a real phone call, it will work because conversations accumulate"
echo ""

echo "====== HOW IT WORKS ======"
echo "1. First user message → conversation count = 0 → Response 1"
echo "2. Second user message → conversation count = 1 → Response 2"  
echo "3. Third user message → conversation count = 2 → Response 3"
echo "4. Fourth user message → conversation count = 3 → Response 4"
echo ""

echo "====== EXPECTED RESPONSES ======"
echo "Response 1: 'Oh, I'm sorry to hear about your knee...'"
echo "Response 2: 'That's wonderful to hear! I'll note that down...'"
echo "Response 3: '没关系，陈太太... 记得多休息，多喝水。'"
echo "Response 4: 'Take care, Mrs. Chen... I'll check in on you tomorrow!'"
