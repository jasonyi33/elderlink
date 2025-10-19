/**
 * Task 3.7a: Wellness Metrics Service Tests (TDD)
 * 
 * Test holistic wellness calculation combining mental, physical, and social health
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.7
 * - TDD_TEST_CASES.md Section 5.1
 * - PRD.md lines 1455-1492 (updateWellnessMetrics implementation)
 * - PRD.md lines 239-258 (wellnessMetrics interface)
 */

import { describe, test, expect } from '@jest/globals';

// These functions will be implemented in wellness-service.ts
import {
  calculateMentalScore,
  calculateSocialScore,
  calculateHolisticScore,
  calculateTrend,
  updateWellnessMetrics
} from '../src/services/wellness-service';

describe('Wellness Metrics Service', () => {

  // Test 1-5: Convert sentiment -1 to +1 into 0 to 100
  describe('Mental Score Calculation', () => {
    
    test('converts sentiment -1 to 0', () => {
      const score = calculateMentalScore(-1);
      expect(score).toBe(0);
    });

    test('converts sentiment -0.5 to 25', () => {
      const score = calculateMentalScore(-0.5);
      expect(score).toBe(25);
    });

    test('converts sentiment 0 to 50', () => {
      const score = calculateMentalScore(0);
      expect(score).toBe(50);
    });

    test('converts sentiment 0.5 to 75', () => {
      const score = calculateMentalScore(0.5);
      expect(score).toBe(75);
    });

    test('converts sentiment 1 to 100', () => {
      const score = calculateMentalScore(1);
      expect(score).toBe(100);
    });
  });

  // Test 6: Calculates average from recent conversations
  test('calculates average sentiment from recent conversations', () => {
    const conversations = [
      { sentiment: 0.5 },
      { sentiment: 0.3 },
      { sentiment: 0.7 }
    ] as any[];

    const avgSentiment = conversations.reduce((sum, c) => sum + c.sentiment, 0) / conversations.length;
    const mentalScore = calculateMentalScore(avgSentiment);

    // Average = 0.5, mental score = 75
    expect(mentalScore).toBe(75);
  });

  // Test 7-8: Social score calculation
  describe('Social Score Calculation', () => {
    
    test('matches contribute 10 points each to social score', () => {
      const score = calculateSocialScore({ matchesMade: 3, groupsJoined: 0 });
      expect(score).toBe(30); // 3 * 10
    });

    test('groups contribute 20 points each to social score', () => {
      const score = calculateSocialScore({ matchesMade: 0, groupsJoined: 2 });
      expect(score).toBe(40); // 2 * 20
    });

    // Test 9: Combined calculation
    test('combined: matches*10 + groups*20', () => {
      const score = calculateSocialScore({ matchesMade: 3, groupsJoined: 2 });
      expect(score).toBe(70); // 3*10 + 2*20 = 30 + 40
    });

    // Test 10: Social score capped at 100
    test('social score capped at 100', () => {
      const score = calculateSocialScore({ matchesMade: 8, groupsJoined: 5 });
      // 8*10 + 5*20 = 80 + 100 = 180, but capped at 100
      expect(score).toBe(100);
    });
  });

  // Test 11-13: Holistic score calculation
  describe('Holistic Score Calculation', () => {
    
    test('holistic weighted average: mental*40% + physical*30% + social*30%', () => {
      const score = calculateHolisticScore({
        mentalScore: 80,
        physicalScore: 70,
        socialScore: 60
      });
      // (80 * 0.4) + (70 * 0.3) + (60 * 0.3) = 32 + 21 + 18 = 71
      expect(score).toBe(71);
    });

    test('all metrics at 100 gives 100', () => {
      const score = calculateHolisticScore({
        mentalScore: 100,
        physicalScore: 100,
        socialScore: 100
      });
      expect(score).toBe(100);
    });

    test('all metrics at 0 gives 0', () => {
      const score = calculateHolisticScore({
        mentalScore: 0,
        physicalScore: 0,
        socialScore: 0
      });
      expect(score).toBe(0);
    });
  });

  // Test 14-16: Trend calculation
  describe('Trend Calculation', () => {
    
    test('improving trend (second half > first half)', () => {
      const conversations = [
        { sentiment: 0.2 },
        { sentiment: 0.3 },
        { sentiment: 0.2 },
        { sentiment: 0.3 },
        { sentiment: 0.2 }, // First half avg: 0.24
        { sentiment: 0.6 },
        { sentiment: 0.7 },
        { sentiment: 0.5 },
        { sentiment: 0.6 },
        { sentiment: 0.7 }  // Second half avg: 0.62
      ] as any[];

      const trend = calculateTrend(conversations);
      expect(trend).toBe('improving'); // 0.62 > 0.24 + 0.1
    });

    test('declining trend (second half < first half)', () => {
      const conversations = [
        { sentiment: 0.7 },
        { sentiment: 0.6 },
        { sentiment: 0.8 },
        { sentiment: 0.7 },
        { sentiment: 0.6 }, // First half avg: 0.68
        { sentiment: 0.2 },
        { sentiment: 0.3 },
        { sentiment: 0.1 },
        { sentiment: 0.2 },
        { sentiment: 0.3 }  // Second half avg: 0.22
      ] as any[];

      const trend = calculateTrend(conversations);
      expect(trend).toBe('declining'); // 0.22 < 0.68 - 0.1
    });

    test('stable trend (difference < threshold)', () => {
      const conversations = [
        { sentiment: 0.5 },
        { sentiment: 0.4 },
        { sentiment: 0.5 },
        { sentiment: 0.6 },
        { sentiment: 0.5 }, // First half avg: 0.5
        { sentiment: 0.5 },
        { sentiment: 0.6 },
        { sentiment: 0.4 },
        { sentiment: 0.5 },
        { sentiment: 0.5 }  // Second half avg: 0.5
      ] as any[];

      const trend = calculateTrend(conversations);
      expect(trend).toBe('stable'); // difference < 0.1
    });

    // Test 17: Edge case - empty history
    test('handles empty conversation history', () => {
      const conversations: any[] = [];
      const trend = calculateTrend(conversations);
      expect(trend).toBe('insufficient_data');
    });

    // Test 18: Edge case - single conversation
    test('handles single conversation', () => {
      const conversations = [{ sentiment: 0.5 }] as any[];
      const trend = calculateTrend(conversations);
      expect(trend).toBe('insufficient_data');
    });
  });

  // Test 19: Integration test - updateWellnessMetrics
  test('updateWellnessMetrics updates all metrics in profile', () => {
    const profile = {
      id: 'test-senior',
      conversations: [
        { sentiment: 0.3, timestamp: '2025-01-01' },
        { sentiment: 0.4, timestamp: '2025-01-02' },
        { sentiment: 0.5, timestamp: '2025-01-03' },
        { sentiment: 0.6, timestamp: '2025-01-04' },
        { sentiment: 0.7, timestamp: '2025-01-05' },
        { sentiment: 0.6, timestamp: '2025-01-06' },
        { sentiment: 0.7, timestamp: '2025-01-07' },
        { sentiment: 0.8, timestamp: '2025-01-08' },
        { sentiment: 0.7, timestamp: '2025-01-09' },
        { sentiment: 0.8, timestamp: '2025-01-10' }
      ],
      matches: [
        { seniorId: 'match-1', score: 90 },
        { seniorId: 'match-2', score: 85 },
        { seniorId: 'match-3', score: 70 }
      ],
      groups: [
        { id: 'group-1', name: 'Gardening Circle' },
        { id: 'group-2', name: 'Piano Group' }
      ],
      healthData: {
        notes: [
          { mentions: [{ type: 'symptom', text: 'back pain' }] },
          { mentions: [{ type: 'medication', text: 'took pills' }] }
        ]
      },
      wellnessMetrics: {
        mentalHealth: {
          averageSentiment: 0,
          trend: 'stable' as const
        },
        physicalHealth: {
          symptomMentions: 0
        },
        socialHealth: {
          matchesMade: 0,
          groupsJoined: 0
        },
        holisticScore: 0,
        lastCallDate: ''
      }
    } as any;

    updateWellnessMetrics(profile);

    // Verify mental health updated
    expect(profile.wellnessMetrics.mentalHealth.averageSentiment).toBeCloseTo(0.61, 1); // avg of 0.3-0.8
    expect(profile.wellnessMetrics.mentalHealth.trend).toBe('improving'); // 0.72 > 0.5

    // Verify physical health updated
    expect(profile.wellnessMetrics.physicalHealth.symptomMentions).toBe(1);

    // Verify social health updated
    expect(profile.wellnessMetrics.socialHealth.matchesMade).toBe(3);
    expect(profile.wellnessMetrics.socialHealth.groupsJoined).toBe(2);

    // Verify holistic score calculated
    expect(profile.wellnessMetrics.holisticScore).toBeGreaterThan(0);
    expect(profile.wellnessMetrics.holisticScore).toBeLessThanOrEqual(100);

    // Verify lastCallDate updated
    expect(profile.wellnessMetrics.lastCallDate).toBeTruthy();
  });
});

