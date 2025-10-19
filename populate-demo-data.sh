#!/bin/bash

# ElderLink Demo Data Population Script
# Populates Mrs. Chen's profile with full demo data for presentation
# This creates the "after demo" state with 147 conversations, analytics, etc.

set -e

echo "🎯 ElderLink Demo Data Population"
echo "===================================="
echo ""
echo "This script will populate Mrs. Chen's profile with:"
echo "  ✅ 147 conversations over 30 days"
echo "  ✅ 3 community matches (Mrs. Lee, Mr. Wong, Mrs. Park)"
echo "  ✅ Complete wellness metrics (score: 78, up from 52)"
echo "  ✅ Health timeline with medication tracking"
echo "  ✅ Word cloud data (Sarah, garden, happy, piano, etc.)"
echo ""

# Check if wrangler is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

echo "1️⃣  Uploading Mrs. Chen's full profile to KV storage..."
echo ""

# Create the comprehensive profile JSON
npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mrs-chen" '{
  "id": "mrs-chen",
  "name": "Mrs. Chen",
  "age": 72,
  "languages": ["english", "mandarin"],
  "phoneNumber": "+14087066183",
  "email": "chen@example.com",
  "location": {
    "address": "123 Garden St, San Francisco, CA 94102",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "coordinates": { "lat": 37.7749, "lng": -122.4194 }
  },
  "emergencyContact": {
    "name": "Sarah Chen",
    "relationship": "daughter",
    "phone": "+14155551234",
    "email": "sarah.chen@example.com"
  },
  "conversations": [],
  "memories": {
    "family": [
      "Sarah (daughter, visits weekly)",
      "Michael (grandson, 8 years old, loves soccer)",
      "Emily (granddaughter, 5 years old, starting kindergarten)",
      "Late husband David (passed 3 years ago, enjoyed fishing)"
    ],
    "hobbies": [
      "Gardening (tomatoes, roses, herbs)",
      "Piano (plays Chopin, learning new pieces)",
      "Reading (mystery novels, historical fiction)",
      "Cooking (traditional Chinese dishes, dim sum)"
    ],
    "health": [
      "Arthritis in knees (managed with stretching)",
      "Takes Lisinopril 10mg daily for blood pressure",
      "Mild hearing loss in left ear",
      "Sleeps well most nights (7-8 hours)"
    ],
    "recentEvents": [
      "Sarah visited last Sunday with the kids",
      "Started new mystery novel last week",
      "Tomatoes are growing well this season",
      "Piano recital coming up next month",
      "Dr. Smith appointment scheduled for Tuesday"
    ],
    "preferences": {
      "topicsEnjoys": [
        "Talking about grandchildren",
        "Discussing garden progress",
        "Sharing recipes",
        "Music and piano practice"
      ],
      "topicsAvoids": [
        "Politics",
        "Sad news",
        "Financial worries"
      ]
    }
  },
  "healthData": {
    "medications": [
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "once daily (morning)",
        "purpose": "blood pressure management",
        "startDate": "2022-01-15",
        "prescribedBy": "Dr. Smith"
      }
    ],
    "conditions": [
      "Hypertension (controlled)",
      "Osteoarthritis (knees)",
      "Mild hearing impairment (left ear)"
    ],
    "notes": [
      {
        "timestamp": "2025-10-15T10:30:00Z",
        "source": "Sam AI Conversation",
        "note": "Patient reports knee pain when kneeling in garden. Arthritis symptoms manageable with daily stretching routine.",
        "mentions": [
          {
            "type": "symptom",
            "value": "knee pain",
            "severity": "mild",
            "context": "Aching from gardening activities"
          }
        ]
      },
      {
        "timestamp": "2025-10-16T14:20:00Z",
        "source": "Sam AI Conversation",
        "note": "Medication compliance excellent. Patient takes Lisinopril every morning as prescribed.",
        "mentions": [
          {
            "type": "medication",
            "value": "Lisinopril - morning dose taken",
            "context": "Patient confirmed daily adherence"
          }
        ]
      }
    ],
    "upcomingAppointments": [
      {
        "date": "2025-10-22T10:00:00Z",
        "provider": "Dr. Smith",
        "type": "routine checkup",
        "location": "San Francisco Medical Center"
      }
    ]
  },
  "interests": [
    "Gardening",
    "Piano",
    "Cooking",
    "Reading",
    "Spending time with grandchildren"
  ],
  "matches": [
    {
      "seniorId": "mrs-lee",
      "name": "Mrs. Lee",
      "age": 70,
      "score": 92,
      "sharedInterests": ["Gardening", "Cooking", "Mandarin language"],
      "languages": ["english", "mandarin"],
      "location": { "city": "San Francisco", "distance": 1.2 },
      "matchedAt": "2025-10-18T12:00:00Z",
      "status": "active",
      "lastContact": "2025-10-18T15:30:00Z"
    },
    {
      "seniorId": "mr-wong",
      "name": "Mr. Wong",
      "age": 75,
      "score": 85,
      "sharedInterests": ["Piano", "Classical music", "Mandarin language"],
      "languages": ["english", "mandarin"],
      "location": { "city": "San Francisco", "distance": 2.5 },
      "matchedAt": "2025-10-17T10:00:00Z",
      "status": "active"
    },
    {
      "seniorId": "mrs-park",
      "name": "Mrs. Park",
      "age": 68,
      "score": 78,
      "sharedInterests": ["Gardening", "Reading"],
      "languages": ["english", "korean"],
      "location": { "city": "San Francisco", "distance": 3.0 },
      "matchedAt": "2025-10-16T14:00:00Z",
      "status": "pending"
    }
  ],
  "groups": [
    {
      "groupId": "sf-gardeners",
      "name": "SF Senior Gardeners",
      "members": ["mrs-chen", "mrs-lee", "mrs-park"],
      "interests": ["Gardening"],
      "createdAt": "2025-10-18T16:00:00Z",
      "suggestedActivities": [
        "Weekly garden tips exchange",
        "Seed and plant sharing",
        "Monthly community garden meetup"
      ]
    }
  ],
  "wellnessMetrics": {
    "mentalHealth": {
      "lonelinessScore": 22,
      "averageSentiment": 0.68,
      "trend": "improving"
    },
    "physicalHealth": {
      "symptomMentions": 3,
      "medicationAdherence": 100,
      "appointmentReminders": 1
    },
    "socialHealth": {
      "matchesMade": 3,
      "groupsJoined": 1,
      "communityEngagement": 85
    },
    "holisticScore": 78,
    "previousScore": 52,
    "lastCallDate": "2025-10-18T18:00:00Z",
    "callFrequency": 4.9,
    "totalConversations": 147,
    "conversationTrend": [
      { "date": "2025-09-18", "count": 3, "avgSentiment": 0.45 },
      { "date": "2025-09-25", "count": 5, "avgSentiment": 0.52 },
      { "date": "2025-10-02", "count": 6, "avgSentiment": 0.58 },
      { "date": "2025-10-09", "count": 5, "avgSentiment": 0.64 },
      { "date": "2025-10-16", "count": 7, "avgSentiment": 0.68 }
    ]
  }
}' 2>&1 | grep -q "Writing" && echo "   ✅ Base profile created"

echo ""
echo "2️⃣  Generating 147 conversations (this may take a moment)..."
echo ""

# Create a script to generate and upload conversations
cat > /tmp/generate_conversations.js << 'EOF'
const conversations = [];
const topics = ['garden', 'Sarah', 'grandchildren', 'piano', 'cooking', 'reading', 'health', 'weather', 'memories'];
const sentiments = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8];

// Generate 147 conversations over 30 days
const startDate = new Date('2025-09-18');
for (let i = 0; i < 147; i++) {
  const daysOffset = Math.floor(i / 5); // ~5 conversations per day
  const timestamp = new Date(startDate);
  timestamp.setDate(timestamp.getDate() + daysOffset);
  timestamp.setHours(Math.floor(Math.random() * 12) + 9); // 9am-9pm
  timestamp.setMinutes(Math.floor(Math.random() * 60));

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  conversations.push({
    timestamp: timestamp.toISOString(),
    duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
    keyTopics: [topic],
    sentiment: sentiment,
    language: Math.random() > 0.8 ? 'mandarin' : 'english',
    summary: `Conversation about ${topic}`,
    transcript: [
      { role: 'senior', content: `Hi Sam, let's talk about ${topic}` },
      { role: 'assistant', content: `Of course, Mrs. Chen! I'd love to hear about your ${topic}.` }
    ],
    healthMentions: i % 10 === 0 ? [{
      type: 'medication_check',
      value: 'Lisinopril',
      timestamp: timestamp.toISOString()
    }] : []
  });
}

console.log(JSON.stringify(conversations));
EOF

# Generate conversations and upload
CONVERSATIONS=$(node /tmp/generate_conversations.js)

# Get current profile, add conversations, and re-upload
PROFILE=$(npx wrangler kv key get --env dev --binding KV --preview false --remote "senior-mrs-chen" 2>/dev/null)

# Use Node.js to merge the data
node -e "
const profile = ${PROFILE};
const conversations = ${CONVERSATIONS};
profile.conversations = conversations;
console.log(JSON.stringify(profile));
" > /tmp/full_profile.json

# Upload the complete profile
npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mrs-chen" --path /tmp/full_profile.json 2>&1 | grep -q "Writing" && echo "   ✅ 147 conversations added"

# Cleanup temp files
rm /tmp/generate_conversations.js
rm /tmp/full_profile.json

echo ""
echo "3️⃣  Creating community match profiles..."
echo ""

# Mrs. Lee profile
npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mrs-lee" '{
  "id": "mrs-lee",
  "name": "Mrs. Lee",
  "age": 70,
  "languages": ["english", "mandarin"],
  "interests": ["Gardening", "Cooking", "Traditional crafts"],
  "location": { "city": "San Francisco", "zipCode": "94103", "distance": 1.2 }
}' 2>&1 | grep -q "Writing" && echo "   ✅ Mrs. Lee profile created"

# Mr. Wong profile
npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mr-wong" '{
  "id": "mr-wong",
  "name": "Mr. Wong",
  "age": 75,
  "languages": ["english", "mandarin"],
  "interests": ["Piano", "Classical music", "Chess"],
  "location": { "city": "San Francisco", "zipCode": "94104", "distance": 2.5 }
}' 2>&1 | grep -q "Writing" && echo "   ✅ Mr. Wong profile created"

# Mrs. Park profile
npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mrs-park" '{
  "id": "mrs-park",
  "name": "Mrs. Park",
  "age": 68,
  "languages": ["english", "korean"],
  "interests": ["Gardening", "Reading", "Knitting"],
  "location": { "city": "San Francisco", "zipCode": "94105", "distance": 3.0 }
}' 2>&1 | grep -q "Writing" && echo "   ✅ Mrs. Park profile created"

echo ""
echo "4️⃣  Verifying data population..."
echo ""

# Verify profile was created
VERIFY=$(curl -s https://elderlink-dev.elderlinkhelper.workers.dev/api/seniors/mrs-chen)

if echo "$VERIFY" | grep -q "mrs-chen"; then
  echo "   ✅ Profile verified in worker API"

  # Get conversation count
  CONV_COUNT=$(echo "$VERIFY" | jq '.conversations | length' 2>/dev/null || echo "0")
  echo "   📊 Total conversations: $CONV_COUNT"

  # Get wellness score
  WELLNESS=$(echo "$VERIFY" | jq '.wellnessMetrics.holisticScore' 2>/dev/null || echo "N/A")
  echo "   💪 Wellness score: $WELLNESS"

  # Get match count
  MATCH_COUNT=$(echo "$VERIFY" | jq '.matches | length' 2>/dev/null || echo "0")
  echo "   👥 Community matches: $MATCH_COUNT"
else
  echo "   ⚠️  Warning: Could not verify profile via API"
  echo "   This may be due to KV propagation delay (wait 30-60 seconds)"
fi

echo ""
echo "✅ Demo data population complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 60 seconds for KV propagation"
echo "   2. Open dashboard: http://localhost:5173"
echo "   3. Verify all data appears correctly"
echo "   4. Ready for demo presentation!"
echo ""
echo "🔍 To check data:"
echo "   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/seniors/mrs-chen | jq"
echo ""
