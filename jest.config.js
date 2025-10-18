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