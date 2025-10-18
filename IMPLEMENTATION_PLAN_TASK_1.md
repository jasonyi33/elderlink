# Task 1.0 Implementation Plan: Initialize Project Infrastructure and Environment

**Duration:** Hour 0-2 (Critical Foundation)
**Owner:** Integration Lead + All Developers
**Dependencies:** None (This is the foundation)
**Critical Output:** Fully configured development environment ready for all teams

---

## 🚨 Critical Success Criteria

By Hour 2, we MUST have:
1. ✅ Repository accessible by all developers
2. ✅ Cloudflare KV namespace created and ID shared
3. ✅ All API keys and environment variables configured
4. ✅ Jest testing framework operational
5. ✅ TypeScript configured with strict mode
6. ✅ Worker health check deployed and accessible
7. ✅ Team communication channel active

---

## 📋 Pre-Implementation Checklist

Before starting, ensure you have:
- [ ] GitHub account with repository creation permissions
- [ ] Cloudflare account with Workers and KV access
- [ ] Node.js 18+ installed
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] All API keys ready:
  - [ ] Gemini API key
  - [ ] Vapi API key
  - [ ] ElevenLabs API key
  - [ ] Deepgram API key (if separate from Vapi)
- [ ] Team member GitHub usernames for access
- [ ] Discord/Slack workspace created

---

## 🧪 TDD Test Suite for Infrastructure

### Test 1.1: Project Structure Verification
```typescript
// tests/infrastructure/project-setup.test.ts

describe('Project Infrastructure', () => {
  describe('Directory Structure', () => {
    test('all required directories exist', () => {
      const requiredDirs = [
        'worker/src',
        'worker/tests',
        'prompts',
        'dashboard/src',
        'dashboard/src/components',
        'scripts',
        'recordings',
        'data'
      ];

      requiredDirs.forEach(dir => {
        expect(fs.existsSync(path.join(__dirname, '../..', dir))).toBe(true);
      });
    });

    test('critical configuration files exist', () => {
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'jest.config.js',
        'wrangler.toml',
        '.env.example',
        '.gitignore'
      ];

      requiredFiles.forEach(file => {
        expect(fs.existsSync(path.join(__dirname, '../..', file))).toBe(true);
      });
    });
  });

  describe('Package Dependencies', () => {
    test('all core dependencies installed', () => {
      const pkg = require('../../package.json');
      const requiredDeps = [
        'typescript',
        '@cloudflare/workers-types',
        'wrangler'
      ];

      requiredDeps.forEach(dep => {
        expect(pkg.dependencies[dep] || pkg.devDependencies[dep]).toBeDefined();
      });
    });

    test('all testing dependencies installed', () => {
      const pkg = require('../../package.json');
      const testDeps = [
        'jest',
        '@types/jest',
        'ts-jest',
        '@testing-library/react',
        '@testing-library/jest-dom'
      ];

      testDeps.forEach(dep => {
        expect(pkg.devDependencies[dep]).toBeDefined();
      });
    });
  });

  describe('TypeScript Configuration', () => {
    test('strict mode enabled', () => {
      const tsConfig = require('../../tsconfig.json');
      expect(tsConfig.compilerOptions.strict).toBe(true);
    });

    test('proper module resolution', () => {
      const tsConfig = require('../../tsconfig.json');
      expect(tsConfig.compilerOptions.moduleResolution).toBe('node');
      expect(tsConfig.compilerOptions.esModuleInterop).toBe(true);
    });
  });

  describe('Jest Configuration', () => {
    test('proper test environment configured', () => {
      const jestConfig = require('../../jest.config.js');
      expect(jestConfig.preset).toBe('ts-jest');
      expect(jestConfig.testEnvironment).toBe('node');
    });

    test('coverage thresholds set', () => {
      const jestConfig = require('../../jest.config.js');
      expect(jestConfig.coverageThreshold.global.branches).toBe(70);
      expect(jestConfig.coverageThreshold.global.functions).toBe(70);
      expect(jestConfig.coverageThreshold.global.lines).toBe(70);
    });
  });

  describe('Environment Variables', () => {
    test('all required environment variables present', () => {
      const requiredVars = [
        'GEMINI_API_KEY',
        'VAPI_API_KEY',
        'ELEVENLABS_API_KEY',
        'ELEVENLABS_ENGLISH_VOICE',
        'ELEVENLABS_MANDARIN_VOICE',
        'KV_NAMESPACE_ID'
      ];

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined();
        expect(process.env[varName]?.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cloudflare Configuration', () => {
    test('wrangler.toml properly configured', () => {
      const wranglerConfig = fs.readFileSync('wrangler.toml', 'utf8');
      expect(wranglerConfig).toContain('name = "elderlink"');
      expect(wranglerConfig).toContain('[[kv_namespaces]]');
      expect(wranglerConfig).toContain('binding = "KV"');
    });

    test('KV namespace accessible', async () => {
      // This would be an integration test
      const response = await fetch('http://localhost:8787/api/health');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('ok');
    });
  });
});
```

---

## 📝 Step-by-Step Implementation

### Phase 1: Repository Setup (0-15 minutes)

#### Step 1.1a: Create Repository Structure
```bash
# Create main project directory
mkdir elderlink && cd elderlink

# Initialize git repository
git init
git branch -m main

# Create branch structure
git checkout -b dev
git checkout -b feat/conversation-core
git checkout -b feat/backend-api
git checkout -b feat/voice-phone
git checkout -b feat/dashboard
git checkout main

# Create directory structure
mkdir -p worker/{src,tests}
mkdir -p prompts/tests
mkdir -p dashboard/src/{components,services,utils}
mkdir -p scripts/integration-tests
mkdir -p recordings
mkdir -p data
mkdir -p docs

# Create placeholder files
touch worker/src/index.ts
touch prompts/sam-personality.ts
touch dashboard/src/App.tsx
touch scripts/init-demo-data.ts
touch .gitignore
touch .env.example
touch README.md
```

#### Step 1.1b: Initialize Package Configuration
```bash
# Initialize npm project
npm init -y

# Update package.json with project details
cat > package.json << 'EOF'
{
  "name": "elderlink",
  "version": "1.0.0",
  "description": "AI Companion for Elderly Care - Hackathon Project",
  "main": "worker/src/index.ts",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "dev:worker": "wrangler dev",
    "dev:dashboard": "cd dashboard && npm run dev",
    "deploy:dev": "wrangler deploy --env dev",
    "deploy:prod": "wrangler deploy --env production",
    "init-demo": "ts-node scripts/init-demo-data.ts",
    "build:dashboard": "cd dashboard && npm run build",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["ai", "elderly", "companion", "health", "community"],
  "author": "ElderLink Team",
  "license": "MIT"
}
EOF
```

#### Step 1.1c: Install Dependencies
```bash
# Core dependencies
npm install --save-dev typescript @cloudflare/workers-types wrangler

# Testing dependencies
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Frontend dependencies (for dashboard)
cd dashboard
npm create vite@latest . -- --template react-ts
npm install react react-dom recharts tailwindcss @headlessui/react
npm install @tanstack/react-query zod
cd ..

# Utility dependencies
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier
npm install --save-dev husky lint-staged
```

### Phase 2: Configuration Files (15-30 minutes)

#### Step 1.1d: TypeScript Configuration
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["@cloudflare/workers-types", "jest", "node"]
  },
  "include": [
    "worker/**/*.ts",
    "prompts/**/*.ts",
    "scripts/**/*.ts",
    "tests/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "dashboard"
  ]
}
```

#### Step 1.1e: Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/*.test.ts',
    '**/*.test.tsx'
  ],
  collectCoverageFrom: [
    'worker/src/**/*.ts',
    'prompts/**/*.ts',
    'dashboard/src/**/*.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/worker/src/$1',
    '^@prompts/(.*)$': '<rootDir>/prompts/$1',
    '^@utils/(.*)$': '<rootDir>/worker/src/utils/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

#### Step 1.1f: Cloudflare Wrangler Configuration
```toml
# wrangler.toml
name = "elderlink"
main = "worker/src/index.ts"
compatibility_date = "2025-01-18"
account_id = "YOUR_ACCOUNT_ID"

# Development environment
[env.dev]
name = "elderlink-dev"
workers_dev = true

[[env.dev.kv_namespaces]]
binding = "KV"
id = "KV_NAMESPACE_ID_DEV"
preview_id = "KV_NAMESPACE_ID_PREVIEW"

# Production environment
[env.production]
name = "elderlink-prod"
workers_dev = false
route = "elderlink.com/*"

[[env.production.kv_namespaces]]
binding = "KV"
id = "KV_NAMESPACE_ID_PROD"

# Environment variables (secrets)
[vars]
ENVIRONMENT = "development"

# Note: Sensitive variables should be set via wrangler secret
# wrangler secret put GEMINI_API_KEY
# wrangler secret put VAPI_API_KEY
# wrangler secret put ELEVENLABS_API_KEY
# wrangler secret put ELEVENLABS_ENGLISH_VOICE
# wrangler secret put ELEVENLABS_MANDARIN_VOICE
```

### Phase 3: Environment Setup (30-45 minutes)

#### Step 1.1g: Environment Variables Template
```bash
# .env.example
# API Keys (REQUIRED - Get from respective services)
GEMINI_API_KEY=your_gemini_api_key_here
VAPI_API_KEY=your_vapi_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Voice IDs from ElevenLabs
ELEVENLABS_ENGLISH_VOICE=EXAVITQu4vr4xnSDxMaL
ELEVENLABS_MANDARIN_VOICE=FGY2WhTYpPnrIDTdsKH5

# Cloudflare KV Namespace (Created in next step)
KV_NAMESPACE_ID=your_kv_namespace_id_here

# Vapi Configuration
VAPI_PHONE_NUMBER=+1206XXXXXXX
VAPI_ASSISTANT_ID=your_assistant_id_here

# Dashboard Configuration
VITE_API_BASE_URL=http://localhost:8787
VITE_PRODUCTION_URL=https://elderlink.workers.dev

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

#### Step 1.1h: Create Cloudflare KV Namespace
```bash
# Login to Cloudflare
wrangler login

# Create KV namespace for development
wrangler kv:namespace create "ELDERLINK_KV" --preview
# Output:
# 🌀 Creating namespace with title "elderlink-ELDERLINK_KV"
# ✨ Success!
# Add the following to your configuration file in your kv_namespaces array:
# { binding = "KV", id = "abc123...", preview_id = "def456..." }

# Create KV namespace for production
wrangler kv:namespace create "ELDERLINK_KV" --env production
# Copy the IDs to wrangler.toml and .env
```

### Phase 4: Team Coordination Setup (45-60 minutes)

#### Step 1.2a: Git Repository Setup
```bash
# Add all team members as collaborators
# Go to GitHub repository settings > Manage access > Add people

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.*.local
*.local

# Build outputs
dist/
build/
.cache/
.parcel-cache/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Testing
coverage/
*.lcov
.nyc_output/

# Cloudflare
.wrangler/
.dev.vars

# Recordings (may contain sensitive data)
recordings/*.mp3
recordings/*.wav

# Temporary files
*.tmp
*.bak
EOF

# Initial commit
git add .
git commit -m "Initial project setup with TDD structure

- Created directory structure for all components
- Configured TypeScript with strict mode
- Set up Jest with 70% coverage requirement
- Configured Cloudflare Workers and KV
- Added all necessary dependencies
- Created environment template

Co-Authored-By: Integration Lead <lead@elderlink.com>"

# Push to GitHub
git remote add origin https://github.com/your-org/elderlink.git
git push -u origin main
git push -u origin dev
git push -u origin feat/conversation-core
git push -u origin feat/backend-api
git push -u origin feat/voice-phone
git push -u origin feat/dashboard
```

#### Step 1.2b: Team Communication Setup
```markdown
# Create team-coordination.md
## ElderLink Team Coordination

### Team Roles
- **Integration Lead**: @username1
- **Developer 1 (Conversation)**: @username2
- **Developer 2 (Backend)**: @username3
- **Developer 3 (Voice)**: @username4
- **Developer 4 (Dashboard)**: @username5

### Communication Channels
- **Primary**: Discord #elderlink-dev
- **Emergency**: WhatsApp Group
- **Code Reviews**: GitHub PRs
- **Video Calls**: Discord Voice Channel

### Critical URLs & Resources
- **Dev Worker**: https://elderlink-dev.workers.dev
- **Dashboard Dev**: http://localhost:5173
- **API Docs**: /docs/api-contract.md
- **Vapi Dashboard**: https://vapi.ai/dashboard
- **KV Namespace ID**: abc123-def456-ghi789

### Checkpoint Schedule
| Hour | Checkpoint | Owner | Success Criteria |
|------|-----------|-------|------------------|
| 2 | Foundation Complete | Integration Lead | Worker deployed, health check working |
| 4 | API Contract Locked | Dev 2 | All endpoints documented |
| 6 | First Integration | All | Phone → Worker → Response working |
| 8 | Memory Test | Dev 1 & 2 | Sam remembers previous conversation |
| 10 | Health Tracking | Dev 2 | MyChart notes created |
| 12 | Language Test | Dev 3 | Mandarin/English switching |
| 14 | Full Pipeline | All | All 5 success criteria pass |
| 16 | Community Test | Dev 2 & 4 | Matches displayed |
| 18 | Feature Freeze | Integration Lead | No new features after this |
| 20 | Production Deploy | Dev 2 | All endpoints live |
| 23 | Final Rehearsal | All | Demo ready |

### Emergency Contacts
- Integration Lead: +1-XXX-XXX-XXXX
- Backup Lead: +1-XXX-XXX-XXXX
```

### Phase 5: Development Tools (60-75 minutes)

#### Step 1.3a: Git Hooks Setup
```bash
# Initialize husky for git hooks
npx husky-init && npm install

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests for changed files
npm run test -- --bail --findRelatedTests $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' | tr '\n' ' ')

# Run type checking
npm run type-check

# Run linting
npm run lint
EOF

chmod +x .husky/pre-commit

# Create pre-push hook
cat > .husky/pre-push << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run full test suite before push
npm test

# Check coverage
npm run test:coverage
EOF

chmod +x .husky/pre-push
```

#### Step 1.3b: Development Scripts
```json
// Add to package.json scripts section
{
  "scripts": {
    // Testing scripts
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest tests/integration --runInBand",
    "test:unit": "jest --testPathIgnorePatterns=integration",

    // Development scripts
    "dev": "concurrently \"npm run dev:worker\" \"npm run dev:dashboard\"",
    "dev:worker": "wrangler dev",
    "dev:dashboard": "cd dashboard && npm run dev",

    // Build scripts
    "build": "npm run build:worker && npm run build:dashboard",
    "build:worker": "tsc -p tsconfig.worker.json",
    "build:dashboard": "cd dashboard && npm run build",

    // Deployment scripts
    "deploy:dev": "npm run test && wrangler deploy --env dev",
    "deploy:prod": "npm run test:coverage && wrangler deploy --env production",

    // Data initialization
    "init-demo": "ts-node scripts/init-demo-data.ts",
    "init-matches": "ts-node scripts/init-match-data.ts",
    "init-all": "npm run init-demo && npm run init-matches",

    // Utility scripts
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist build coverage .cache",

    // Integration test helpers
    "test:memory": "jest scripts/integration-tests/memory-test.ts",
    "test:health": "jest scripts/integration-tests/health-tracking-test.ts",
    "test:pipeline": "jest scripts/integration-tests/full-flow-test.ts",

    // Performance monitoring
    "perf:worker": "wrangler tail --env dev --format pretty",
    "perf:measure": "ts-node scripts/measure-latency.ts"
  }
}
```

### Phase 6: Initial Health Check Implementation (75-90 minutes)

#### Step 1.4: Worker Health Check (Following TDD)

##### Step 1.4a: Write Health Check Test
```typescript
// worker/tests/health.test.ts
describe('Health Check Endpoint', () => {
  let worker: any;

  beforeAll(() => {
    worker = require('../src/index').default;
  });

  test('GET /api/health returns ok status', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      environment: 'development',
      version: '1.0.0'
    });
  });

  test('health check includes KV connectivity', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request);
    const data = await response.json();

    expect(data.services).toEqual({
      kv: 'connected',
      gemini: 'not_tested',
      vapi: 'not_tested'
    });
  });

  test('health check responds within 100ms', async () => {
    const start = Date.now();
    const request = new Request('http://localhost/api/health');
    await worker.fetch(request);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
```

##### Step 1.4b: Confirm Test Failure
```bash
# Run the test (should fail)
npm test worker/tests/health.test.ts

# Expected output:
# FAIL worker/tests/health.test.ts
#   ✕ GET /api/health returns ok status
#   ✕ health check includes KV connectivity
#   ✕ health check responds within 100ms
```

##### Step 1.4c: Commit Failing Test
```bash
git add worker/tests/health.test.ts
git commit -m "Add health check endpoint tests (3 tests, all failing)"
```

##### Step 1.4d: Implement Health Check
```typescript
// worker/src/index.ts
export interface Env {
  KV: KVNamespace;
  ENVIRONMENT: string;
  GEMINI_API_KEY: string;
  VAPI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/api/health' && request.method === 'GET') {
      const start = Date.now();

      // Test KV connectivity
      let kvStatus = 'unknown';
      try {
        await env.KV.get('test-key');
        kvStatus = 'connected';
      } catch (error) {
        kvStatus = 'error';
      }

      const healthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'development',
        version: '1.0.0',
        services: {
          kv: kvStatus,
          gemini: 'not_tested',
          vapi: 'not_tested'
        },
        latency: `${Date.now() - start}ms`
      };

      return new Response(JSON.stringify(healthResponse), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 404 for all other routes (for now)
    return new Response('Not found', {
      status: 404,
      headers: corsHeaders
    });
  }
};
```

##### Step 1.4e: Run Tests Until Pass
```bash
# Run tests in watch mode
npm test -- --watch worker/tests/health.test.ts

# Iterate on implementation until all tests pass
# All 3 tests should show green checkmarks
```

##### Step 1.4f: Commit Implementation
```bash
git add worker/src/index.ts
git commit -m "Implement health check endpoint (3/3 tests passing)"
```

### Phase 7: Deploy and Share (90-120 minutes) ⚠️ CRITICAL

#### Step 1.5: Deploy Worker to Development
```bash
# Deploy to Cloudflare Workers dev environment
wrangler deploy --env dev

# Expected output:
# ⛅️ Deploying to Cloudflare Workers...
# ✨ Success! Your worker was deployed to:
# https://elderlink-dev.username.workers.dev

# Test the deployed endpoint
curl https://elderlink-dev.username.workers.dev/api/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "2025-01-18T10:00:00.000Z",
#   "environment": "development",
#   "version": "1.0.0",
#   "services": {
#     "kv": "connected",
#     "gemini": "not_tested",
#     "vapi": "not_tested"
#   },
#   "latency": "45ms"
# }
```

#### Step 1.6: Share with Team ⚠️ CRITICAL BY HOUR 2
```markdown
# Post in team channel IMMEDIATELY:

## 🚀 Foundation Complete - Hour 2 Checkpoint ✅

### Worker Deployed and Ready!
- **Health Check URL**: https://elderlink-dev.username.workers.dev/api/health
- **Status**: ✅ OPERATIONAL
- **Latency**: <50ms
- **KV Connected**: ✅ YES

### Critical Resources for All Developers:
- **KV Namespace ID**: abc123-def456-ghi789
- **Worker Base URL**: https://elderlink-dev.username.workers.dev
- **GitHub Repo**: https://github.com/your-org/elderlink
- **Environment Template**: .env.example in repo

### Developer Action Items:
1. **Dev 1**: Pull latest and start on conversation core
2. **Dev 2**: Begin API endpoint implementation
3. **Dev 3**: Configure Vapi with worker URL
4. **Dev 4**: Start dashboard with API_BASE set to worker URL

### Next Checkpoint:
- **Hour 4**: API Contract Lock
- **Owner**: Developer 2
- **Deliverable**: All 12 endpoints documented in docs/api-contract.md

Please confirm receipt by reacting with ✅
```

---

## 🔄 Continuous Integration Setup

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run type checking
      run: npm run type-check

    - name: Run linting
      run: npm run lint

    - name: Run tests with coverage
      run: npm run test:coverage

    - name: Check coverage thresholds
      run: |
        coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        if (( $(echo "$coverage < 70" | bc -l) )); then
          echo "Coverage below 70%"
          exit 1
        fi

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  deploy-dev:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/dev'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Cloudflare Workers (Dev)
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        environment: 'dev'
```

---

## 📊 Success Metrics & Verification

### Hour 1 Checkpoint
- [ ] Repository created and accessible
- [ ] All directories created
- [ ] Dependencies installed
- [ ] TypeScript configured
- [ ] Jest configured
- [ ] Team has repository access

### Hour 2 Checkpoint ⚠️ CRITICAL
- [ ] Worker deployed to development
- [ ] Health check endpoint operational
- [ ] KV namespace connected
- [ ] All environment variables configured
- [ ] URL shared with team
- [ ] All developers confirmed access

### Verification Commands
```bash
# Verify project structure
find . -type d -maxdepth 2 | sort

# Verify dependencies
npm list --depth=0

# Verify TypeScript
npx tsc --noEmit

# Verify Jest
npm test

# Verify Worker deployment
curl https://elderlink-dev.username.workers.dev/api/health

# Verify KV namespace
wrangler kv:key list --namespace-id=YOUR_NAMESPACE_ID

# Verify team access
git log --oneline -5
```

---

## 🚨 Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Wrangler login fails
```bash
# Solution: Use API token instead
export CLOUDFLARE_API_TOKEN=your_token
wrangler whoami
```

#### Issue: KV namespace not connecting
```bash
# Verify namespace ID in wrangler.toml
# Ensure proper binding name (should be "KV")
# Test with:
wrangler kv:key put --namespace-id=YOUR_ID "test" "value"
wrangler kv:key get --namespace-id=YOUR_ID "test"
```

#### Issue: Jest tests not running
```bash
# Clear Jest cache
npx jest --clearCache
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript errors
```bash
# Ensure strict mode is what you want
# Check tsconfig.json paths
# Verify all type packages installed:
npm install --save-dev @types/node @cloudflare/workers-types
```

---

## ✅ Definition of Done

Task 1.0 is complete when:

1. **Infrastructure Tests**: All 15 infrastructure tests passing
2. **Health Check**: Endpoint returns 200 with proper JSON
3. **Team Access**: All 5 developers have repository access
4. **Worker Deployed**: URL accessible and returning health check
5. **KV Connected**: Namespace created and accessible
6. **Documentation**: This plan checked off and committed
7. **Communication**: Team channel active with URL shared
8. **Hour 2 Checkpoint**: Integration Lead confirms all systems go

---

## 📝 Notes for Integration Lead

- Start this task at Hour 0 (immediately)
- Parallelize where possible (multiple people on different steps)
- The Health Check URL is BLOCKING for all other teams
- Share updates every 30 minutes in team channel
- If behind schedule, skip GitHub Actions setup (not critical for demo)
- Focus on getting Worker deployed above all else

**Remember: Without this foundation, no other work can proceed. This is the critical path.**