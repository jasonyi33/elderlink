// Test script to verify Gemini API integration
async function testGeminiIntegration() {
  const response = await fetch('https://elderlink-dev.elderlinkhelper.workers.dev/vapi-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        content: "Hello Sam, how are you today?"
      },
      call: {
        phoneNumber: "+12248581016",
        language: "english"
      }
    })
  });

  const data = await response.json() as any;
  console.log('Response:', JSON.stringify(data, null, 2));

  // Check if it's using real Gemini or fallback
  if (data.message?.content?.includes("That sounds important") ||
      data.message?.content?.includes("I'm listening")) {
    console.log('\n❌ ISSUE: Getting fallback response, not real Gemini API response');
    console.log('This means the Gemini API is not being called correctly.');
  } else {
    console.log('\n✅ SUCCESS: Got dynamic response from Gemini API');
  }
}

testGeminiIntegration().catch(console.error);