/**
 * Task 3.6f: Alert Service Verification Tests
 * 
 * Independent verification to prevent overfitting
 * Tests with different inputs than the main test suite
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.6f
 * - PRD.md lines 568-596
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  loadEscalationKeywords,
  matchesKeywords,
  detectAndCreateAlert,
  storeAlert,
  getAlerts
} from '../src/services/alert-service';

// Mock environment
const mockEnv = {
  KV: {
    get: async (_key: string) => null,
    put: async (_key: string, _value: string) => {},
  }
} as any;

describe('Alert Service - Independent Verification', () => {
  
  beforeEach(() => {
    const kvStore: Record<string, string> = {};
    mockEnv.KV = {
      get: async (key: string) => kvStore[key] || null,
      put: async (key: string, value: string) => {
        kvStore[key] = value;
      }
    };
  });

  // Verification Test 1: Different medical emergency phrase
  test('detects medical emergency with different phrasing', async () => {
    const message = "My heart is racing and I'm experiencing severe chest discomfort";
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('high');
    expect(alert!.type).toBe('medical');
  });

  // Verification Test 2: Crisis with indirect language
  test('detects crisis ideation with indirect language', async () => {
    const message = "There's no reason to keep living, I'd be better off dead";
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('high');
    expect(alert!.type).toBe('crisis');
  });

  // Verification Test 3: Depression with multiple indicators
  test('detects depression with multiple keywords', async () => {
    const message = "I feel so worthless and empty inside, like there's no point to anything";
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('medium');
    expect(alert!.type).toBe('depression');
    expect(alert!.concerns.length).toBeGreaterThanOrEqual(2);
  });

  // Verification Test 4: False positive prevention - similar words
  test('does not trigger on similar but benign words', async () => {
    const messages = [
      "I'm breathless with excitement!",
      "The garden is so painless to maintain",
      "I hope you have a good day",
      "Life is wonderful and meaningful"
    ];

    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    for (const message of messages) {
      const alert = await detectAndCreateAlert(message, profile, mockEnv);
      expect(alert).toBeNull();
    }
  });

  // Verification Test 5: Case insensitivity
  test('matches keywords regardless of case', () => {
    const keywords = loadEscalationKeywords();
    
    expect(matchesKeywords("I HAVE CHEST PAIN", keywords.medical)).toBe(true);
    expect(matchesKeywords("i wish i was DEAD", keywords.crisis)).toBe(true);
    expect(matchesKeywords("Everything is HOPELESS", keywords.depression)).toBe(true);
  });

  // Verification Test 6: Multiple alerts accumulate correctly
  test('multiple alerts accumulate correctly in KV', async () => {
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    // Create 3 different alerts
    const alert1 = await detectAndCreateAlert("chest pain", profile, mockEnv);
    const alert2 = await detectAndCreateAlert("I want to end it all", profile, mockEnv);
    const alert3 = await detectAndCreateAlert("I feel hopeless", profile, mockEnv);

    await storeAlert('test-senior', alert1!, mockEnv);
    await storeAlert('test-senior', alert2!, mockEnv);
    await storeAlert('test-senior', alert3!, mockEnv);

    const alerts = await getAlerts('test-senior', mockEnv);
    
    expect(alerts.length).toBe(3);
    expect(alerts[0].type).toBe('medical');
    expect(alerts[1].type).toBe('crisis');
    expect(alerts[2].type).toBe('depression');
  });

  // Verification Test 7: Alert contains all required fields
  test('alert has all required fields per PRD structure', async () => {
    const message = "I'm having a stroke";
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert).toHaveProperty('seniorId');
    expect(alert).toHaveProperty('timestamp');
    expect(alert).toHaveProperty('severity');
    expect(alert).toHaveProperty('type');
    expect(alert).toHaveProperty('message');
    expect(alert).toHaveProperty('concerns');
    expect(alert).toHaveProperty('requiresAction');
    
    // Verify types
    expect(typeof alert!.seniorId).toBe('string');
    expect(typeof alert!.timestamp).toBe('string');
    expect(['high', 'medium', 'low']).toContain(alert!.severity);
    expect(['medical', 'crisis', 'depression', 'general']).toContain(alert!.type);
    expect(typeof alert!.message).toBe('string');
    expect(Array.isArray(alert!.concerns)).toBe(true);
    expect(typeof alert!.requiresAction).toBe('boolean');
  });

  // Verification Test 8: Timestamp is valid ISO string
  test('timestamp is valid ISO 8601 format', async () => {
    const message = "chest pain";
    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    
    // Should parse as valid date
    const date = new Date(alert!.timestamp);
    expect(date.toString()).not.toBe('Invalid Date');
    
    // Should be recent (within last minute)
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    expect(diff).toBeLessThan(60000); // Less than 1 minute
  });

  // Verification Test 9: Keywords loaded have expected structure
  test('loaded keywords have expected categories and count', () => {
    const keywords = loadEscalationKeywords();
    
    // Should have all 3 categories
    expect(keywords.medical).toBeDefined();
    expect(keywords.crisis).toBeDefined();
    expect(keywords.depression).toBeDefined();
    
    // Should have reasonable number of keywords in each
    expect(keywords.medical.length).toBeGreaterThanOrEqual(10);
    expect(keywords.crisis.length).toBeGreaterThanOrEqual(10);
    expect(keywords.depression.length).toBeGreaterThanOrEqual(10);
  });

  // Verification Test 10: No alert for empty or normal messages
  test('no alerts for normal conversation', async () => {
    const normalMessages = [
      "The weather is beautiful today",
      "I had a nice chat with my daughter",
      "My garden is growing well",
      "Thank you for talking with me",
      "I'm feeling okay today"
    ];

    const profile = { id: 'test-senior', name: 'Test Senior' } as any;

    for (const message of normalMessages) {
      const alert = await detectAndCreateAlert(message, profile, mockEnv);
      expect(alert).toBeNull();
    }
  });
});

