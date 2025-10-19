/**
 * Task 3.6a: Alert Service Tests (TDD)
 * 
 * Test the crisis detection and alert system
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.6
 * - TDD_TEST_CASES.md Section 6.1
 * - PRD.md lines 568-596 (FR8: Crisis Escalation)
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// These functions will be implemented in alert-service.ts
import {
  loadEscalationKeywords,
  matchesKeywords,
  detectAndCreateAlert,
  storeAlert,
  getAlerts
} from '../src/services/alert-service';

// Mock environment for testing
const mockEnv = {
  KV: {
    get: async (key: string) => null,
    put: async (key: string, value: string) => {},
  }
} as any;

describe('Alert Service - Crisis Detection', () => {
  
  beforeEach(() => {
    // Reset mock KV store before each test
    const kvStore: Record<string, string> = {};
    mockEnv.KV = {
      get: async (key: string) => kvStore[key] || null,
      put: async (key: string, value: string) => {
        kvStore[key] = value;
      }
    };
  });

  // Test 1: Medical emergency creates high severity alert
  test('medical emergency creates high severity alert', async () => {
    const message = "I'm having terrible chest pain and can't breathe";
    const profile = { id: 'mrs-chen', name: 'Mrs. Chen' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('high');
    expect(alert!.type).toBe('medical');
    expect(alert!.requiresAction).toBe(true);
    expect(alert!.seniorId).toBe('mrs-chen');
    expect(alert!.message).toContain('chest pain');
  });

  // Test 2: Suicide ideation creates crisis alert
  test('suicide ideation creates crisis alert', async () => {
    const message = "I don't want to live anymore, I wish I was dead";
    const profile = { id: 'mrs-chen', name: 'Mrs. Chen' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('high');
    expect(alert!.type).toBe('crisis');
    expect(alert!.requiresAction).toBe(true);
    expect(alert!.concerns).toBeDefined();
    expect(alert!.concerns.length).toBeGreaterThan(0);
  });

  // Test 3: Severe depression creates medium severity alert
  test('severe depression creates medium severity alert', async () => {
    const message = "Everything feels hopeless and worthless, nothing matters anymore";
    const profile = { id: 'mrs-chen', name: 'Mrs. Chen' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('medium');
    expect(alert!.type).toBe('depression');
    expect(alert!.requiresAction).toBe(true);
  });

  // Test 4: Mild sadness does not create alert
  test('mild sadness does not create alert', async () => {
    const message = "I'm feeling a bit sad today, the weather is gloomy";
    const profile = { id: 'mrs-chen', name: 'Mrs. Chen' } as any;

    const alert = await detectAndCreateAlert(message, profile, mockEnv);

    expect(alert).toBeNull();
  });

  // Test 5: Loads keywords from escalation-keywords.json
  test('loads keywords from escalation-keywords.json', () => {
    const keywords = loadEscalationKeywords();

    expect(keywords).toBeDefined();
    expect(keywords.medical).toBeDefined();
    expect(keywords.crisis).toBeDefined();
    expect(keywords.depression).toBeDefined();
    expect(keywords.medical.length).toBeGreaterThan(0);
    expect(keywords.crisis.length).toBeGreaterThan(0);
    expect(keywords.depression.length).toBeGreaterThan(0);
  });

  // Test 6: Matches medical emergency keywords
  test('matches medical emergency keywords', () => {
    const keywords = loadEscalationKeywords();
    
    expect(matchesKeywords("I have terrible chest pain", keywords.medical)).toBe(true);
    expect(matchesKeywords("I can't breathe properly", keywords.medical)).toBe(true);
    expect(matchesKeywords("I think I'm having a stroke", keywords.medical)).toBe(true);
    expect(matchesKeywords("I feel tired", keywords.medical)).toBe(false);
  });

  // Test 7: Matches suicide ideation keywords
  test('matches suicide ideation keywords', () => {
    const keywords = loadEscalationKeywords();
    
    expect(matchesKeywords("I want to end it all", keywords.crisis)).toBe(true);
    expect(matchesKeywords("Life is not worth living", keywords.crisis)).toBe(true);
    expect(matchesKeywords("I wish I was dead", keywords.crisis)).toBe(true);
    expect(matchesKeywords("I'm feeling down", keywords.crisis)).toBe(false);
  });

  // Test 8: Avoids false positives
  test('avoids false positives', () => {
    const keywords = loadEscalationKeywords();
    
    // These should NOT trigger alerts (context matters)
    expect(matchesKeywords("My chest is fine, no pain", keywords.medical)).toBe(false);
    expect(matchesKeywords("I'm breathing fresh air", keywords.medical)).toBe(false);
    expect(matchesKeywords("I love my life", keywords.crisis)).toBe(false);
    expect(matchesKeywords("I'm full of hope", keywords.depression)).toBe(false);
  });

  // Test 9: Stores alert in KV with key alerts-{seniorId}
  test('stores alert in KV with key alerts-{seniorId}', async () => {
    const alert = {
      seniorId: 'mrs-chen',
      timestamp: new Date().toISOString(),
      severity: 'high' as const,
      type: 'medical' as const,
      message: 'Chest pain detected',
      concerns: [{ type: 'medical', excerpt: 'chest pain' }],
      requiresAction: true
    };

    await storeAlert('mrs-chen', alert, mockEnv);

    const stored = await mockEnv.KV.get('alerts-mrs-chen');
    expect(stored).not.toBeNull();
    
    const alerts = JSON.parse(stored);
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.length).toBe(1);
    expect(alerts[0].seniorId).toBe('mrs-chen');
  });

  // Test 10: Appends to existing alerts (does not replace)
  test('appends to existing alerts (does not replace)', async () => {
    // Store first alert
    const alert1 = {
      seniorId: 'mrs-chen',
      timestamp: new Date().toISOString(),
      severity: 'medium' as const,
      type: 'depression' as const,
      message: 'Depression detected',
      concerns: [{ type: 'depression', excerpt: 'hopeless' }],
      requiresAction: true
    };
    await storeAlert('mrs-chen', alert1, mockEnv);

    // Store second alert
    const alert2 = {
      seniorId: 'mrs-chen',
      timestamp: new Date().toISOString(),
      severity: 'high' as const,
      type: 'medical' as const,
      message: 'Medical emergency',
      concerns: [{ type: 'medical', excerpt: 'chest pain' }],
      requiresAction: true
    };
    await storeAlert('mrs-chen', alert2, mockEnv);

    // Verify both alerts are stored
    const alerts = await getAlerts('mrs-chen', mockEnv);
    expect(alerts.length).toBe(2);
    expect(alerts[0].type).toBe('depression');
    expect(alerts[1].type).toBe('medical');
  });

  // Test 11: requiresAction flag set correctly
  test('requiresAction flag set correctly', async () => {
    // High severity should require action
    const highSeverityMessage = "I'm having a heart attack";
    const profile = { id: 'mrs-chen', name: 'Mrs. Chen' } as any;
    
    const highAlert = await detectAndCreateAlert(highSeverityMessage, profile, mockEnv);
    expect(highAlert).not.toBeNull();
    expect(highAlert!.requiresAction).toBe(true);

    // Medium severity should require action
    const mediumSeverityMessage = "I feel completely hopeless";
    const mediumAlert = await detectAndCreateAlert(mediumSeverityMessage, profile, mockEnv);
    expect(mediumAlert).not.toBeNull();
    expect(mediumAlert!.requiresAction).toBe(true);
  });
});

