#!/bin/bash

# Update ElevenLabs voice settings for more emotional and caring delivery

curl -X PATCH 'https://api.vapi.ai/assistant/5af660dd-dada-4863-af15-383c693873f7' \
  -H 'Authorization: Bearer a0a0d259-804e-4079-8a99-524a6a792cec' \
  -H 'Content-Type: application/json' \
  -d '{
    "voice": {
      "provider": "11labs",
      "voiceId": "EXAVITQu4vr4xnSDxMaL",
      "model": "eleven_multilingual_v2",
      "stability": 0.5,
      "similarityBoost": 0.85,
      "style": 0.75,
      "useSpeakerBoost": true,
      "speed": 1.0,
      "optimizeStreamingLatency": 3
    }
  }'
