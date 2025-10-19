/**
 * Demo Script for Live Demonstration
 *
 * This script contains pre-scripted conversation exchanges for the first demo call.
 * After the first call completes, the system automatically switches to live mode.
 *
 * Each exchange includes:
 * - Expected user input (for reference/matching)
 * - Sam's pre-scripted response
 * - Language (english/mandarin)
 * - Expected sentiment value for dashboard
 * - Expected emotions to display
 */

export interface DemoExchange {
  exchangeNumber: number;
  userInput: string; // Reference only - not used for matching
  samResponse: string;
  language: 'english' | 'mandarin';
  expectedSentiment: number; // -1 to 1
  expectedEmotions: string[];
  notes?: string; // Internal notes about what this demonstrates
}

// NOTE: Vapi firstMessage: "Hello! This is Sam. Who am I speaking with today?"
// User responds: "Mrs. Chen" or "This is Mrs. Chen"
// Then our demo script takes over starting at exchange #1

export const DEMO_SCRIPT: DemoExchange[] = [
  {
    exchangeNumber: 1,
    userInput: "Mrs. Chen",
    samResponse: "Hello, Mrs. Chen! It's nice to hear from you again. How's your garden doing this week?",
    language: 'english',
    expectedSentiment: 0.3,
    expectedEmotions: ['warm', 'welcomed', 'engaged'],
    notes: 'GREETING: User identifies themselves, Sam greets warmly with personalized garden question'
  },
  {
    exchangeNumber: 2,
    userInput: "The tomatoes are growing well, but my knees ache",
    samResponse: "I recall your arthritis bothers you sometimes—did you take your Lisinopril this morning?",
    language: 'english',
    expectedSentiment: 0.4,
    expectedEmotions: ['comforted', 'engaged', 'caring'],
    notes: 'EXCHANGE 1: User mentions garden and knee pain, Sam remembers arthritis and checks medication'
  },
  {
    exchangeNumber: 3,
    userInput: "Yes, I took it. My stretches are helping",
    samResponse: "Good. I'll note that down for Dr. Smith in MyChart. Your next appointment is on Tuesday at 10 a.m.",
    language: 'english',
    expectedSentiment: 0.6,
    expectedEmotions: ['comforted', 'reassured', 'engaged'],
    notes: 'EXCHANGE 2: MyChart integration - health note appears instantly in dashboard, appointment reminder'
  },
  {
    exchangeNumber: 4,
    userInput: "谢谢你，Sam。今天有点累。",
    samResponse: "没关系，陈太太。记得多休息，多喝水。",
    language: 'mandarin',
    expectedSentiment: 0.7,
    expectedEmotions: ['grateful', 'cared for', 'content'],
    notes: 'EXCHANGE 3 ⭐ MONEY SHOT: Language switch - Mandarin input/response, dashboard language indicator flips'
  },
  {
    exchangeNumber: 5,
    userInput: "好的，谢谢",
    samResponse: "Take care, Mrs. Chen. I'll check in on you tomorrow!",
    language: 'english',
    expectedSentiment: 0.8,
    expectedEmotions: ['happy', 'satisfied', 'content'],
    notes: 'EXCHANGE 4: Closing - Sam switches back to English naturally, sentiment at highest point'
  }
];

/**
 * Helper function to extract health mentions from demo script exchanges
 * This ensures health notes are created during demo mode
 */
export function extractHealthMentionsFromDemoExchange(
  exchangeNumber: number,
  userMessage: string,
  samResponse: string
): any[] {
  const mentions: any[] = [];
  const lowerUser = userMessage.toLowerCase();
  const lowerSam = samResponse.toLowerCase();

  // Exchange 2: Knee pain and Lisinopril mention
  if (exchangeNumber === 2) {
    if (lowerUser.includes('knees ache') || lowerUser.includes('knee') || lowerUser.includes('ache')) {
      mentions.push({
        type: 'symptom',
        value: 'knee pain',
        severity: 'mild',
        context: 'Aching from kneeling in garden, arthritis-related',
        timestamp: new Date().toISOString()
      });
    }

    if (lowerSam.includes('lisinopril')) {
      mentions.push({
        type: 'medication_check',
        value: 'Lisinopril',
        context: 'Sam checking if morning dose was taken',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Exchange 3: Medication compliance and stretching
  if (exchangeNumber === 3) {
    if (lowerUser.includes('took it') || lowerUser.includes('yes') || lowerUser.includes('stretches')) {
      mentions.push({
        type: 'medication',
        value: 'Lisinopril - morning dose taken',
        context: 'Patient confirmed medication compliance',
        timestamp: new Date().toISOString()
      });
    }

    if (lowerUser.includes('stretches') || lowerUser.includes('stretching') || lowerUser.includes('helping')) {
      mentions.push({
        type: 'activity',
        value: 'stretching exercises',
        context: 'Patient reports stretches helping with arthritis symptoms',
        outcome: 'positive',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Exchange 4: Fatigue mention in Mandarin
  if (exchangeNumber === 4) {
    if (lowerUser.includes('累') || lowerSam.includes('休息')) {
      mentions.push({
        type: 'symptom',
        value: 'fatigue',
        severity: 'mild',
        context: 'Patient reports feeling tired today (今天有点累)',
        timestamp: new Date().toISOString()
      });
    }
  }

  return mentions;
}

/**
 * Get demo exchange by number (1-indexed)
 */
export function getDemoExchange(exchangeNumber: number): DemoExchange | null {
  return DEMO_SCRIPT.find(ex => ex.exchangeNumber === exchangeNumber) || null;
}

/**
 * Check if exchange number is within demo script range
 */
export function isWithinDemoScript(exchangeNumber: number): boolean {
  return exchangeNumber >= 1 && exchangeNumber <= DEMO_SCRIPT.length;
}
