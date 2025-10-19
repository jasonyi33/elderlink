#!/bin/bash

# Test the 5 demo script exchanges

echo "Testing Exchange 1: Initial greeting"
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are Sam"},
      {"role": "user", "content": "This is Mrs. Chen"}
    ]
  }' | jq -r '.choices[0].message.content'

echo ""
echo "---"
echo ""

echo "Testing Exchange 2: Tomatoes + knee ache"
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are Sam"},
      {"role": "user", "content": "My tomatoes are growing great, but my knee aches a bit"}
    ]
  }' | jq -r '.choices[0].message.content'

echo ""
echo "---"
echo ""

echo "Testing Exchange 3: Yes took meds, stretches"
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are Sam"},
      {"role": "user", "content": "Yes I took it, and the stretches are helping too"}
    ]
  }' | jq -r '.choices[0].message.content'

echo ""
echo "---"
echo ""

echo "Testing Exchange 4: Chinese - tired"
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are Sam"},
      {"role": "user", "content": "谢谢你，Sam。我今天有点累"}
    ]
  }' | jq -r '.choices[0].message.content'

echo ""
echo "---"
echo ""

echo "Testing Exchange 5: Chinese - okay thank you"
curl -s -X POST https://elderlink-dev.elderlinkhelper.workers.dev/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "custom",
    "messages": [
      {"role": "system", "content": "You are Sam"},
      {"role": "user", "content": "好的，谢谢"}
    ]
  }' | jq -r '.choices[0].message.content'
