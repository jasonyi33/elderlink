#!/bin/bash
# ElderLink Demo Mode Reset Script
# Prepares the system for a fresh demo demonstration
# BACKS UP original profile and restores it after demo call

echo "🎬 ElderLink Demo Mode Reset"
echo "=============================="
echo ""

cd "$(dirname "$0")"

# Step 1: Backup current profile (will be restored after demo)
echo "1️⃣  Backing up Mrs. Chen profile..."
CURRENT_PROFILE=$(npx wrangler kv key get --env dev --binding KV --preview false --remote "senior-mrs-chen" 2>/dev/null)

if [ -n "$CURRENT_PROFILE" ] && [ "$CURRENT_PROFILE" != "null" ]; then
  npx wrangler kv key put --env dev --binding KV --preview false --remote "senior-mrs-chen-backup" "$CURRENT_PROFILE" 2>&1 | grep -q "Writing" && echo "   ✅ Profile backed up successfully"

  # Delete main profile to start fresh for demo
  npx wrangler kv key delete --env dev --binding KV --preview false --remote "senior-mrs-chen" 2>/dev/null
  echo "   ✅ Main profile cleared for demo"
else
  echo "   ⚠️  No existing profile found to backup"
fi

# Also delete any legacy key variations (cleanup)
npx wrangler kv key delete --env dev --binding KV --preview false --remote "senior:mrs-chen" 2>/dev/null
npx wrangler kv key delete --env dev --binding KV --preview false --remote "profile:mrs-chen" 2>/dev/null

# Clear call state (critical for demo mode exchange counting)
npx wrangler kv key delete --env dev --binding KV --preview false --remote "call-state-mrs-chen" 2>/dev/null

# Step 2: Enable demo mode
echo ""
echo "2️⃣  Enabling demo mode..."
npx wrangler kv key put --env dev --binding KV --preview false --remote demo-mode-active "true" 2>&1 | grep -q "Writing" && echo "   ✅ Demo mode key written"
echo "   ✅ Call state cleared (exchange will start at #1)"

# Step 3: Wait for KV propagation and verify deletion (CRITICAL!)
echo ""
echo "3️⃣  Waiting for KV propagation (60 seconds - DO NOT SKIP!)..."
echo "   ⚠️  IMPORTANT: Cloudflare KV can take 30-60 seconds to propagate globally"
echo "   ⚠️  If you call too early, demo mode will NOT activate!"
echo ""
for i in {60..1}; do
  echo -ne "   ⏳ $i seconds remaining...\r"
  sleep 1
done
echo "   ✅ Propagation wait complete                          "
echo ""

# Verify profile deletion succeeded
echo "3️⃣b Verifying profile deletion..."
VERIFY_DELETE=$(npx wrangler kv key get --env dev --binding KV --preview false --remote "senior-mrs-chen" 2>&1)

if [[ "$VERIFY_DELETE" == *"404"* ]] || [ -z "$VERIFY_DELETE" ]; then
  echo "   ✅ Profile successfully deleted (404 confirmed)"
else
  echo "   ❌ ERROR: Profile still exists in KV storage!"
  echo "   ⚠️  This will cause demo mode to fail (exchange number will be wrong)"
  echo "   🔧 Attempting forced delete..."
  npx wrangler kv key delete --env dev --binding KV --preview false --remote "senior-mrs-chen" 2>/dev/null
  sleep 10
  echo "   ⏳ Waiting additional 30 seconds for deletion to propagate..."
  for i in {30..1}; do
    echo -ne "   ⏳ $i seconds remaining...\r"
    sleep 1
  done
  echo "   ✅ Additional wait complete                           "
fi

# Step 4: Verify status
echo ""
echo "4️⃣  Verifying demo mode status..."
DEMO_MODE=$(curl -s https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode | jq -r '.isDemoMode')

if [ "$DEMO_MODE" = "true" ]; then
  echo "   ✅ Demo mode is ACTIVE"
else
  echo "   ⚠️  Demo mode showing as: $DEMO_MODE"
  echo "   ⏳ KV may still be propagating (can take up to 60 seconds)"
fi

# Step 5: Ready for demo
echo ""
echo "=============================="
echo "✨ System Ready for Demo!"
echo "=============================="
echo ""
echo "📋 What happens during demo:"
echo "   1. Make a phone call to +1 (224) 858-1016"
echo "   2. First call will use pre-scripted responses (exchanges 1-5)"
echo "   3. Dashboard shows instant sentiment/health updates"
echo "   4. Language switches from English → Mandarin at exchange 4"
echo ""
echo "📋 What happens after demo call ends:"
echo "   ✅ Demo mode auto-disables"
echo "   ✅ Original profile is RESTORED automatically"
echo "   ✅ Dashboard shows full history (147 conversations, analytics, etc.)"
echo "   ✅ All subsequent calls use live Gemini/ElevenLabs"
echo ""
echo "🔍 To verify status:"
echo "   curl https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode | jq"
echo ""
