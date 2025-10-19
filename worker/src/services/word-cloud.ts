/**
 * Task 3.11d: Word Cloud Service Implementation
 * 
 * Generate word frequency visualization for Analytics dashboard
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.11
 * - PRD.md line 563 (word frequency analytics)
 * - PRD.md line 2186 (word cloud component)
 * 
 * Word sizing formula: size = frequency^0.7
 * This creates sublinear scaling for better visual appeal
 */

/**
 * Stop words to filter out (same as conversation-summary)
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
  'yes', 'no', 'okay', 'ok', 'um', 'uh', 'like', 'really', 'me', 'them',
  'him', 'her', 'us', 'get', 'got', 'going', 'go', 'went', 'make', 'made'
]);

/**
 * Word cloud item interface
 */
export interface WordCloudItem {
  word: string;
  size: number;
  frequency: number;
}

/**
 * Remove stop words from text and return array of meaningful words
 * 
 * @param text - Text to process
 * @returns Array of words with stop words removed
 */
export function removeStopWords(text: string): string[] {
  // Tokenize: split into words, lowercase, remove punctuation
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0) // Remove empty strings
    .filter(word => !STOP_WORDS.has(word)); // Remove stop words

  return words;
}

/**
 * Calculate word frequency from array of words
 * 
 * @param words - Array of words
 * @returns Object with word -> frequency mapping
 */
export function calculateWordFrequency(words: string[]): Record<string, number> {
  const frequency: Record<string, number> = {};

  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return frequency;
}

/**
 * Calculate word size for visual display
 * Uses frequency^0.7 for sublinear scaling
 * 
 * @param frequency - How many times the word appears
 * @returns Visual size (scaled by frequency^0.7)
 */
export function calculateWordSize(frequency: number): number {
  // Formula: frequency^0.7
  // This creates better visual distribution than linear
  // Example: freq 1 → size 1, freq 10 → size 5, freq 100 → size 25
  return Math.pow(frequency, 0.7);
}

/**
 * Generate word cloud data from all conversations
 * Returns top 50 words sorted by frequency
 * 
 * @param conversations - Array of conversation objects with transcripts
 * @returns Array of {word, size, frequency} sorted by frequency descending
 */
export function generateWordCloud(
  conversations: Array<{ transcript?: Array<{ role: string; content: string }> }>
): WordCloudItem[] {
  console.log('[WORD_CLOUD] Generating word cloud from', conversations.length, 'conversations');

  // Handle empty input
  if (!conversations || conversations.length === 0) {
    return [];
  }

  // Extract all text from all conversations (senior messages only)
  let allText = '';

  conversations.forEach(conv => {
    if (conv.transcript) {
      const seniorMessages = conv.transcript
        .filter(t => t.role === 'senior')
        .map(t => t.content);
      
      allText += ' ' + seniorMessages.join(' ');
    }
  });

  // Remove stop words
  const meaningfulWords = removeStopWords(allText);

  // Calculate frequency
  const frequency = calculateWordFrequency(meaningfulWords);

  // Convert to word cloud items
  const wordCloudItems: WordCloudItem[] = Object.entries(frequency).map(([word, freq]) => ({
    word,
    frequency: freq,
    size: calculateWordSize(freq)
  }));

  // Sort by frequency descending
  wordCloudItems.sort((a, b) => b.frequency - a.frequency);

  // Return top 50
  const top50 = wordCloudItems.slice(0, 50);

  console.log('[WORD_CLOUD] Generated', top50.length, 'words');
  if (top50.length > 0) {
    console.log('[WORD_CLOUD] Top word:', top50[0].word, 'frequency:', top50[0].frequency);
  }

  return top50;
}

