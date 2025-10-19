/**
 * Task 3.7f: Wellness Metrics Verification Tests
 * 
 * Independent verification to prevent overfitting
 * Tests with different scenarios than the main test suite
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.7f
 * - PRD.md lines 1455-1492
 */

import { describe, test, expect } from '@jest/globals';
import {
  calculateMentalScore,
  calculateSocialScore,
  calculateHolisticScore,
  calculateTrend,
  updateWellnessMetrics
} from '../src/services/wellness-service';

describe('Wellness Metrics - Independent Verification', () => {

  // Verification Test 1: Mental score with fractional sentiments
  test('mental score handles fractional sentiments correctly', () => {
    expect(calculateMentalScore(-0.75)).toBe(12.5);
    expect(calculateMentalScore(-0.25)).toBe(37.5);
    expect(calculateMentalScore(0.25)).toBe(62.5);
    expect(calculateMentalScore(0.75)).toBe(87.5);
  });

  // Verification Test 2: Mental score bounds
  test('mental score clamped to 0-100 range', () => {
    // Edge cases beyond normal range
    expect(calculateMentalScore(-2)).toBe(0); // Should clamp to 0
    expect(calculateMentalScore(2)).toBe(100); // Should clamp to 100
    expect(calculateMentalScore(-1.5)).toBe(0);
    expect(calculateMentalScore(1.5)).toBe(100);
  });

  // Verification Test 3: Social score with various combinations
  test('social score with various match/group combinations', () => {
    expect(calculateSocialScore({ matchesMade: 1, groupsJoined: 1 })).toBe(30); // 10 + 20
    expect(calculateSocialScore({ matchesMade: 5, groupsJoined: 3 })).toBe(100); // 50 + 60 = 110, capped at 100
    expect(calculateSocialScore({ matchesMade: 10, groupsJoined: 0 })).toBe(100); // Cap at 100
    expect(calculateSocialScore({ matchesMade: 0, groupsJoined: 5 })).toBe(100); // Cap at 100
  });

  // Verification Test 4: Social score edge cases
  test('social score handles zero values', () => {
    expect(calculateSocialScore({ matchesMade: 0, groupsJoined: 0 })).toBe(0);
  });

  // Verification Test 5: Holistic score with different weightings
  test('holistic score correctly applies 40/30/30 weighting', () => {
    // Mental heavy scenario
    const score1 = calculateHolisticScore({
      mentalScore: 100,
      physicalScore: 0,
      socialScore: 0
    });
    expect(score1).toBe(40); // 100 * 0.4 = 40

    // Physical heavy scenario
    const score2 = calculateHolisticScore({
      mentalScore: 0,
      physicalScore: 100,
      socialScore: 0
    });
    expect(score2).toBe(30); // 100 * 0.3 = 30

    // Social heavy scenario
    const score3 = calculateHolisticScore({
      mentalScore: 0,
      physicalScore: 0,
      socialScore: 100
    });
    expect(score3).toBe(30); // 100 * 0.3 = 30
  });

  // Verification Test 6: Holistic score rounds correctly
  test('holistic score rounds to nearest integer', () => {
    const score1 = calculateHolisticScore({
      mentalScore: 75,
      physicalScore: 75,
      socialScore: 75
    });
    expect(score1).toBe(75); // Exact

    const score2 = calculateHolisticScore({
      mentalScore: 77,
      physicalScore: 73,
      socialScore: 71
    });
    // 77*0.4 + 73*0.3 + 71*0.3 = 30.8 + 21.9 + 21.3 = 74.0
    expect(score2).toBe(74);
  });

  // Verification Test 7: Trend with exactly 10 conversations
  test('trend calculation with exactly 10 conversations', () => {
    const conversations = Array(10).fill(null).map((_, i) => ({
      sentiment: i < 5 ? 0.3 : 0.7 // First half: 0.3, second half: 0.7
    })) as any[];

    const trend = calculateTrend(conversations);
    expect(trend).toBe('improving'); // 0.7 > 0.3 + 0.1
  });

  // Verification Test 8: Trend with odd number of conversations
  test('trend with odd number of conversations (7)', () => {
    const conversations = [
      { sentiment: 0.2 }, { sentiment: 0.3 }, { sentiment: 0.2 }, { sentiment: 0.3 }, // First 4
      { sentiment: 0.7 }, { sentiment: 0.8 }, { sentiment: 0.9 } // Last 3
    ] as any[];

    const trend = calculateTrend(conversations);
    expect(trend).toBe('improving');
  });

  // Verification Test 9: Trend at exact threshold boundary
  test('trend at exact threshold boundary (0.1)', () => {
    const conversations = [
      { sentiment: 0.5 }, { sentiment: 0.5 }, { sentiment: 0.5 }, { sentiment: 0.5 }, { sentiment: 0.5 }, // avg: 0.5
      { sentiment: 0.6 }, { sentiment: 0.6 }, { sentiment: 0.6 }, { sentiment: 0.6 }, { sentiment: 0.6 }  // avg: 0.6
    ] as any[];

    const trend = calculateTrend(conversations);
    expect(trend).toBe('stable'); // 0.6 - 0.5 = 0.1, not > 0.1
  });

  // Verification Test 10: updateWellnessMetrics with real-world scenario
  test('updateWellnessMetrics with realistic senior data', () => {
    const profile = {
      id: 'verification-test',
      conversations: [
        { sentiment: 0.1, timestamp: '2025-01-01' },
        { sentiment: 0.2, timestamp: '2025-01-03' },
        { sentiment: 0.3, timestamp: '2025-01-05' },
        { sentiment: 0.4, timestamp: '2025-01-07' },
        { sentiment: 0.5, timestamp: '2025-01-09' }
      ],
      matches: [
        { seniorId: 'match-1', score: 85 }
      ],
      groups: [
        { id: 'group-1', name: 'Gardening Circle' },
        { id: 'group-2', name: 'Piano Group' },
        { id: 'group-3', name: 'Cooking Group' }
      ],
      healthData: {
        notes: [
          { mentions: [{ type: 'symptom', text: 'back pain' }] },
          { mentions: [{ type: 'symptom', text: 'knee pain' }] },
          { mentions: [{ type: 'medication', text: 'took pills' }] }
        ]
      },
      wellnessMetrics: {
        mentalHealth: { averageSentiment: 0, trend: 'stable' as const },
        physicalHealth: { symptomMentions: 0 },
        socialHealth: { matchesMade: 0, groupsJoined: 0 },
        holisticScore: 0,
        lastCallDate: ''
      }
    } as any;

    updateWellnessMetrics(profile);

    // Verify mental health
    expect(profile.wellnessMetrics.mentalHealth.averageSentiment).toBeCloseTo(0.3, 1);
    expect(profile.wellnessMetrics.mentalHealth.trend).toBe('improving');

    // Verify physical health
    expect(profile.wellnessMetrics.physicalHealth.symptomMentions).toBe(2);

    // Verify social health
    expect(profile.wellnessMetrics.socialHealth.matchesMade).toBe(1);
    expect(profile.wellnessMetrics.socialHealth.groupsJoined).toBe(3);

    // Verify holistic score
    // Mental: 0.3 → 65, Physical: 70, Social: 70 (1*10 + 3*20)
    // Holistic: 65*0.4 + 70*0.3 + 70*0.3 = 26 + 21 + 21 = 68
    expect(profile.wellnessMetrics.holisticScore).toBe(68);

    // Verify lastCallDate updated
    expect(profile.wellnessMetrics.lastCallDate).toBeTruthy();
    const callDate = new Date(profile.wellnessMetrics.lastCallDate);
    expect(callDate.toString()).not.toBe('Invalid Date');
  });
});

