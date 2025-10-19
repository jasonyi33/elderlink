/**
 * Task 3.10a: Conversation Summary Service Tests (TDD)
 * 
 * Test summary generation from conversation transcripts
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.10
 * - PRD.md lines 227-230 (conversation structure)
 * - PRD.md lines 1269, 1273 (currently empty summary and keyTopics)
 */

import { describe, test, expect } from '@jest/globals';

// These functions will be implemented in conversation-summary.ts
import {
  generateSummary,
  extractKeyTopics,
  identifyPrimaryEmotion
} from '../src/services/conversation-summary';

describe('Conversation Summary Service', () => {

  // Test 1: Generates 1-2 sentence summary from transcript
  test('generates 1-2 sentence summary from transcript', () => {
    const transcript = [
      { role: 'sam' as const, content: 'Hi Mrs. Chen! How are you today?' },
      { role: 'senior' as const, content: 'I\'m doing well. I planted tomatoes in my garden yesterday.' },
      { role: 'sam' as const, content: 'That sounds wonderful! How is Sarah doing?' },
      { role: 'senior' as const, content: 'Sarah visited last week with Tommy. We had a great time cooking together.' }
    ];

    const summary = generateSummary(transcript);

    // Should be 1-2 sentences
    const sentenceCount = (summary.match(/[.!?]/g) || []).length;
    expect(sentenceCount).toBeGreaterThanOrEqual(1);
    expect(sentenceCount).toBeLessThanOrEqual(3);

    // Should mention key topics (gardening, family)
    expect(summary.toLowerCase()).toMatch(/garden|tomato|sarah|tommy|cooking|family|visit/);
    
    // Should not be empty
    expect(summary.length).toBeGreaterThan(0);
  });

  // Test 2: Extracts key topics from conversation
  test('extracts key topics from conversation', () => {
    const transcript = [
      { role: 'sam' as const, content: 'How is your garden doing?' },
      { role: 'senior' as const, content: 'My garden is wonderful! The tomatoes are growing well.' },
      { role: 'sam' as const, content: 'That\'s great! Did you take your medication today?' },
      { role: 'senior' as const, content: 'Yes, I took my Lisinopril this morning. My knees hurt a bit when I kneel in the garden.' }
    ];

    const topics = extractKeyTopics(transcript);

    // Should return array of topics
    expect(Array.isArray(topics)).toBe(true);
    
    // Should return top 3 topics (or fewer)
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.length).toBeLessThanOrEqual(3);

    // Should include gardening-related topic
    const topicsString = topics.join(' ').toLowerCase();
    expect(topicsString).toMatch(/garden|medication|health|knee/);
  });

  // Test 3: Identifies primary emotion
  test('identifies primary emotion', () => {
    const transcript = [
      { role: 'senior' as const, content: 'I\'m feeling so happy today! Sarah visited and we had a wonderful time.' },
      { role: 'sam' as const, content: 'That\'s wonderful!' },
      { role: 'senior' as const, content: 'I love spending time with my family.' }
    ];

    const emotion = identifyPrimaryEmotion(transcript);

    // Should return an emotion
    expect(typeof emotion).toBe('string');
    expect(emotion.length).toBeGreaterThan(0);

    // Should be positive emotion
    expect(emotion.toLowerCase()).toMatch(/happy|joyful|content|pleased|glad/);
  });

  // Test 4: Handles empty transcript
  test('handles empty transcript', () => {
    const transcript: Array<{ role: 'sam' | 'senior'; content: string }> = [];

    const summary = generateSummary(transcript);
    const topics = extractKeyTopics(transcript);
    const emotion = identifyPrimaryEmotion(transcript);

    // Should not crash, should return safe defaults
    expect(summary).toBe('');
    expect(topics).toEqual([]);
    expect(emotion).toBe('neutral');
  });

  // Bonus Test 5: Summary doesn't include Sam's messages (only senior's)
  test('summary focuses on senior\'s messages, not Sam\'s', () => {
    const transcript = [
      { role: 'sam' as const, content: 'Tell me about your garden and your family and your health.' },
      { role: 'senior' as const, content: 'I planted roses yesterday.' },
      { role: 'sam' as const, content: 'This is a very long Sam response that should not appear in summary.' }
    ];

    const summary = generateSummary(transcript);

    // Should mention roses (from senior)
    expect(summary.toLowerCase()).toContain('rose');
    
    // Should NOT contain Sam's long text
    expect(summary.toLowerCase()).not.toContain('very long sam response');
  });

  // Bonus Test 6: Key topics are deduplicated
  test('key topics are deduplicated', () => {
    const transcript = [
      { role: 'senior' as const, content: 'I love my garden. My garden is beautiful.' },
      { role: 'senior' as const, content: 'I work in the garden every day. Garden makes me happy.' }
    ];

    const topics = extractKeyTopics(transcript);

    // "garden" should only appear once
    const gardenCount = topics.filter((t: string) => t.toLowerCase().includes('garden')).length;
    expect(gardenCount).toBeLessThanOrEqual(1);
  });
});

