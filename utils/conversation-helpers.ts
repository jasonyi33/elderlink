// Conversation Helpers Module - Core AI Conversation System
// Provides language detection, energy level extraction, and voice selection

/**
 * Detect the primary language of a message
 * @param message - The message to analyze
 * @returns "english" | "mandarin"
 */
export function detectLanguage(message: string): "english" | "mandarin" {
  // Check for Chinese characters (CJK Unified Ideographs)
  const hasChineseChars = /[\u4e00-\u9fff]/.test(message);
  const hasEnglishWords = /[a-zA-Z]/.test(message);
  
  // If mixed language, determine primary language
  if (hasChineseChars && hasEnglishWords) {
    // Count characters to determine primary language
    const chineseCharCount = (message.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWordCount = (message.match(/[a-zA-Z]+/g) || []).length;
    
    // If more Chinese characters than English words, consider Mandarin primary
    return chineseCharCount > englishWordCount ? "mandarin" : "english";
  }
  
  // If only Chinese characters, it's Mandarin
  if (hasChineseChars) {
    return "mandarin";
  }
  
  // Default to English
  return "english";
}

/**
 * Extract energy level from a message
 * @param message - The message to analyze
 * @returns "high" | "normal" | "low"
 */
export function extractEnergyLevel(message: string): "high" | "normal" | "low" {
  const lowerMessage = message.toLowerCase();
  
  // High energy indicators
  const highEnergyIndicators = [
    'excited', 'amazing', 'wonderful', 'fantastic', 'great', 'awesome',
    'love', 'adore', 'thrilled', 'ecstatic', 'brilliant', 'perfect'
  ];
  
  // Low energy indicators
  const lowEnergyIndicators = [
    'tired', 'exhausted', 'drained', 'worn out', 'fatigued', 'weary',
    'depressed', 'sad', 'down', 'blue', 'miserable', 'hopeless'
  ];
  
  // Check for high energy
  const hasHighEnergy = highEnergyIndicators.some(indicator => 
    lowerMessage.includes(indicator)
  ) || (message.match(/!/g) || []).length >= 2; // Multiple exclamation marks
  
  // Check for low energy
  const hasLowEnergy = lowEnergyIndicators.some(indicator => 
    lowerMessage.includes(indicator)
  ) || message.length <= 10; // Very short responses
  
  if (hasHighEnergy) {
    return "high";
  }
  
  if (hasLowEnergy) {
    return "low";
  }
  
  return "normal";
}

/**
 * Select appropriate voice ID based on language
 * @param language - The detected language
 * @returns Voice ID string
 */
export function selectVoice(language: string): string {
  // Voice IDs from ElevenLabs (from PRD configuration)
  const VOICE_IDS = {
    english: "EXAVITQu4vr4xnSDxMaL",    // English voice
    mandarin: "FGY2WhTYpPnrIDTdsKH5"   // Mandarin voice
  };
  
  // Return appropriate voice ID or default to English
  return VOICE_IDS[language as keyof typeof VOICE_IDS] || VOICE_IDS.english;
}
