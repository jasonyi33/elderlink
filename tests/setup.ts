// Jest setup file
import '@testing-library/jest-dom';

// Mock console methods to reduce noise during tests
(global as any).console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  // Keep log for debugging if needed
  log: console.log,
};

// Mock fetch for API tests
(global as any).fetch = jest.fn();

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});