#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

if (!VAPI_API_KEY) {
  console.error('Error: VAPI_API_KEY environment variable not set');
  process.exit(1);
}

if (!ASSISTANT_ID) {
  console.error('Error: VAPI_ASSISTANT_ID environment variable not set');
  process.exit(1);
}

// Read the assistant config
const configPath = path.join(__dirname, 'assistant-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('Updating Vapi assistant:', ASSISTANT_ID);
console.log('Config:', JSON.stringify(config, null, 2));

// Update the assistant
fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${VAPI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(config)
})
.then(async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
})
.then((data) => {
  console.log('✅ Assistant updated successfully!');
  console.log(JSON.stringify(data, null, 2));
})
.catch((error) => {
  console.error('❌ Error updating assistant:', error.message);
  process.exit(1);
});
