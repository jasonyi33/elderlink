#!/usr/bin/env node

/**
 * Script to update the production API URL for the dashboard
 * Usage: node scripts/update-production-url.js <worker-url>
 * Example: node scripts/update-production-url.js https://elderlink.username.workers.dev
 */

const fs = require('fs')
const path = require('path')

const workerUrl = process.argv[2]

if (!workerUrl) {
  console.error('❌ Error: Worker URL is required')
  console.log('Usage: node scripts/update-production-url.js <worker-url>')
  console.log('Example: node scripts/update-production-url.js https://elderlink.username.workers.dev')
  process.exit(1)
}

// Validate URL format
try {
  new URL(workerUrl)
} catch (error) {
  console.error('❌ Error: Invalid URL format')
  process.exit(1)
}

const configPath = path.join(__dirname, '..', 'src', 'config', 'api.ts')

try {
  // Read current config
  let configContent = fs.readFileSync(configPath, 'utf8')
  
  // Update production URL
  configContent = configContent.replace(
    /PRODUCTION_URL: '[^']*'/,
    `PRODUCTION_URL: '${workerUrl}'`
  )
  
  // Write updated config
  fs.writeFileSync(configPath, configContent)
  
  console.log('✅ Successfully updated production URL to:', workerUrl)
  console.log('📁 Updated file:', configPath)
  
  // Verify the change
  const updatedConfig = fs.readFileSync(configPath, 'utf8')
  const match = updatedConfig.match(/PRODUCTION_URL: '([^']*)'/)
  if (match && match[1] === workerUrl) {
    console.log('✅ Verification successful')
  } else {
    console.error('❌ Verification failed - URL not updated correctly')
    process.exit(1)
  }
  
} catch (error) {
  console.error('❌ Error updating config:', error.message)
  process.exit(1)
}
