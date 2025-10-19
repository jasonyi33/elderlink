/**
 * Task 3.10d: Conversation Summary Service Implementation
 * 
 * Generates summaries and extracts topics from conversation transcripts
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.10
 * - PRD.md lines 227-230 (conversation structure with summary, keyTopics)
 * - PRD.md lines 1269, 1273 (currently empty, will populate)
 */

/**
 * Stop words to filter out when extracting topics
 * Common words that don't represent meaningful topics
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may',
  'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your',
  'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'am', 'very', 'so', 'too', 'about', 'how', 'what', 'when', 'where', 'why',
  'who', 'which', 'just', 'even', 'also', 'well', 'today', 'hi', 'hello',
  'yes', 'no', 'okay', 'ok', 'um', 'uh', 'like', 'really', 'me'
]);

/**
 * Emotion keywords for simple emotion detection
 */
const EMOTION_KEYWORDS = {
  happy: ['happy', 'wonderful', 'great', 'excited', 'joyful', 'pleased', 'glad', 'love', 'enjoying'],
  sad: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'disappointed'],
  lonely: ['lonely', 'alone', 'isolated', 'miss', 'missing'],
  anxious: ['worried', 'anxious', 'nervous', 'concerned', 'stress'],
  content: ['content', 'peaceful', 'calm', 'relaxed', 'comfortable'],
  nostalgic: ['remember', 'memories', 'past', 'used to', 'back then']
};

/**
 * Generate 1-2 sentence summary from conversation transcript
 * Focuses on senior's messages (not Sam's)
 * 
 * @param transcript - Array of conversation exchanges
 * @returns Summary string (1-2 sentences)
 */
export function generateSummary(
  transcript: Array<{ role: 'sam' | 'senior'; content: string }>
): string {
  console.log('[SUMMARY] Generating summary from', transcript.length, 'exchanges');

  // Handle empty transcript
  if (!transcript || transcript.length === 0) {
    return '';
  }

  // Extract only senior's messages
  const seniorMessages = transcript
    .filter(t => t.role === 'senior')
    .map(t => t.content);

  if (seniorMessages.length === 0) {
    return '';
  }

  // Create concise 1-2 sentence summary
  // Strategy: Extract first sentence from first 2 messages
  let summary = '';
  
  for (let i = 0; i < Math.min(2, seniorMessages.length); i++) {
    const message = seniorMessages[i];
    // Extract first sentence only
    const firstSentence = message.split(/[.!?]/)[0].trim();
    if (firstSentence) {
      summary += firstSentence + '. ';
    }
  }

  summary = summary.trim();

  // Limit to ~150 characters
  if (summary.length > 150) {
    summary = summary.substring(0, 147) + '...';
  }

  console.log('[SUMMARY] Generated summary:', summary.substring(0, 50) + '...');
  return summary;
}

/**
 * Extract top 3 key topics from conversation
 * Uses word frequency analysis, removes stop words
 * 
 * @param transcript - Array of conversation exchanges
 * @returns Array of top 3 topics (strings)
 */
export function extractKeyTopics(
  transcript: Array<{ role: 'sam' | 'senior'; content: string }>
): string[] {
  console.log('[TOPICS] Extracting topics from', transcript.length, 'exchanges');

  // Handle empty transcript
  if (!transcript || transcript.length === 0) {
    return [];
  }

  // Extract only senior's messages
  const seniorMessages = transcript
    .filter(t => t.role === 'senior')
    .map(t => t.content);

  if (seniorMessages.length === 0) {
    return [];
  }

  // Combine all senior messages
  const combinedText = seniorMessages.join(' ').toLowerCase();

  // Tokenize: split into words
  const words = combinedText
    .replace(/[^a-z\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3) // At least 4 characters
    .filter(word => !STOP_WORDS.has(word)); // Remove stop words

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency descending
  const sortedWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  // Return top 3 unique topics
  const topics = sortedWords.slice(0, 3);

  console.log('[TOPICS] Extracted topics:', topics);
  return topics;
}

/**
 * Identify primary emotion from conversation
 * Uses simple keyword matching
 * 
 * @param transcript - Array of conversation exchanges
 * @returns Primary emotion as string
 */
export function identifyPrimaryEmotion(
  transcript: Array<{ role: 'sam' | 'senior'; content: string }>
): string {
  console.log('[EMOTION] Identifying emotion from', transcript.length, 'exchanges');

  // Handle empty transcript
  if (!transcript || transcript.length === 0) {
    return 'neutral';
  }

  // Extract only senior's messages
  const seniorMessages = transcript
    .filter(t => t.role === 'senior')
    .map(t => t.content.toLowerCase());

  if (seniorMessages.length === 0) {
    return 'neutral';
  }

  const combinedText = seniorMessages.join(' ');

  // Count emotion keyword matches
  const emotionCounts: Record<string, number> = {};

  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
    emotionCounts[emotion] = 0;
    keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        emotionCounts[emotion]++;
      }
    });
  });

  // Find dominant emotion
  const sortedEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1]);

  const primaryEmotion = sortedEmotions[0][1] > 0 ? sortedEmotions[0][0] : 'neutral';

  console.log('[EMOTION] Primary emotion:', primaryEmotion);
  return primaryEmotion;
}

