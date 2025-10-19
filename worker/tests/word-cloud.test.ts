/**
 * Task 3.11a: Word Cloud Service Tests (TDD)
 * 
 * Test word frequency analysis for Analytics dashboard
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.11
 * - PRD.md line 563 (word frequency mentioned)
 * - PRD.md line 2186 (word cloud in Analytics view)
 */

import { describe, test, expect } from '@jest/globals';

// These functions will be implemented in word-cloud.ts
import {
  generateWordCloud,
  removeStopWords,
  calculateWordFrequency,
  calculateWordSize
} from '../src/services/word-cloud';

describe('Word Cloud Service', () => {

  // Test 1: Extracts top 50 words from all conversations
  test('extracts top 50 words from all conversations', () => {
    const conversations = [
      { 
        transcript: [
          { role: 'senior' as const, content: 'I love gardening and cooking and piano' }
        ]
      },
      {
        transcript: [
          { role: 'senior' as const, content: 'Gardening makes me happy. I plant tomatoes and roses.' }
        ]
      },
      {
        transcript: [
          { role: 'senior' as const, content: 'My family visited. We cooked together.' }
        ]
      }
    ] as any[];

    const wordCloud = generateWordCloud(conversations);

    // Should return array of word objects
    expect(Array.isArray(wordCloud)).toBe(true);
    expect(wordCloud.length).toBeGreaterThan(0);
    expect(wordCloud.length).toBeLessThanOrEqual(50);

    // Each word should have required properties
    wordCloud.forEach((item: any) => {
      expect(item).toHaveProperty('word');
      expect(item).toHaveProperty('size');
      expect(item).toHaveProperty('frequency');
      expect(typeof item.word).toBe('string');
      expect(typeof item.size).toBe('number');
      expect(typeof item.frequency).toBe('number');
    });

    // Most frequent word should be first
    if (wordCloud.length > 1) {
      expect(wordCloud[0].frequency).toBeGreaterThanOrEqual(wordCloud[1].frequency);
    }
  });

  // Test 2: Removes stop words (the, a, is, etc.)
  test('removes stop words', () => {
    const text = 'the quick brown fox is jumping and the cat is sleeping';
    const cleanedWords = removeStopWords(text);

    // Should remove stop words
    expect(cleanedWords).not.toContain('the');
    expect(cleanedWords).not.toContain('is');
    expect(cleanedWords).not.toContain('and');

    // Should keep meaningful words
    expect(cleanedWords).toContain('quick');
    expect(cleanedWords).toContain('brown');
    expect(cleanedWords).toContain('fox');
    expect(cleanedWords).toContain('jumping');
    expect(cleanedWords).toContain('cat');
    expect(cleanedWords).toContain('sleeping');
  });

  // Test 3: Calculates word frequency
  test('calculates word frequency', () => {
    const words = ['garden', 'love', 'garden', 'happy', 'garden', 'family'];
    const frequency = calculateWordFrequency(words);

    // Should return frequency map
    expect(frequency).toHaveProperty('garden');
    expect(frequency).toHaveProperty('love');
    expect(frequency).toHaveProperty('happy');
    expect(frequency).toHaveProperty('family');

    // Garden appears 3 times
    expect(frequency['garden']).toBe(3);
    
    // Others appear 1 time each
    expect(frequency['love']).toBe(1);
    expect(frequency['happy']).toBe(1);
    expect(frequency['family']).toBe(1);
  });

  // Test 4: Sizes words by frequency^0.7
  test('sizes words by frequency^0.7', () => {
    // Test with known frequencies
    expect(calculateWordSize(1)).toBeCloseTo(1.0, 1); // 1^0.7 = 1
    expect(calculateWordSize(10)).toBeCloseTo(5.01, 1); // 10^0.7 ≈ 5.01
    expect(calculateWordSize(100)).toBeCloseTo(25.12, 1); // 100^0.7 ≈ 25.12

    // Size should increase with frequency, but sublinearly
    const size5 = calculateWordSize(5);
    const size10 = calculateWordSize(10);
    const size20 = calculateWordSize(20);

    expect(size10).toBeGreaterThan(size5);
    expect(size20).toBeGreaterThan(size10);
    
    // But not linearly (10^0.7 should be less than 2 * 5^0.7)
    expect(size10).toBeLessThan(size5 * 2);
  });

  // Bonus Test 5: generateWordCloud returns sorted by frequency
  test('word cloud sorted by frequency descending', () => {
    const conversations = [
      {
        transcript: [
          { role: 'senior' as const, content: 'garden garden garden family family health' }
        ]
      }
    ] as any[];

    const wordCloud = generateWordCloud(conversations);

    // Should be sorted by frequency
    for (let i = 0; i < wordCloud.length - 1; i++) {
      expect(wordCloud[i].frequency).toBeGreaterThanOrEqual(wordCloud[i + 1].frequency);
    }
  });

  // Bonus Test 6: Handles empty conversations
  test('handles empty conversations', () => {
    const conversations: any[] = [];
    const wordCloud = generateWordCloud(conversations);

    expect(Array.isArray(wordCloud)).toBe(true);
    expect(wordCloud.length).toBe(0);
  });
});

