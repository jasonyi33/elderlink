// Fallback Topics Module - Core AI Conversation System
// Provides fallback topics and responses when conversation stalls

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  languages: string[];
  location: string;
  memories: {
    family: Array<{
      name: string;
      relationship: string;
      details: string[];
    }>;
    hobbies: string[];
    health: string[];
    recentEvents: string[];
    preferences: {
      topicsEnjoys: string[];
      topicsAvoid: string[];
      conversationStyle: string;
    };
  };
  socialProfile: {
    interests: string[];
    culturalBackground: string;
    openToMatching: boolean;
  };
  healthData: {
    conditions: any[];
    medications: any[];
    vitals: { lastUpdated: string };
    appointments: any[];
    notes: any[];
  };
  matches: any[];
  groups: any[];
  conversations: any[];
  wellnessMetrics: {
    mentalHealth: { lonelinessScore: number; averageSentiment: number; trend: string };
    physicalHealth: { symptomMentions: number; medicationAdherence: number; appointmentReminders: number };
    socialHealth: { matchesMade: number; groupsJoined: number; communityEngagement: number };
    holisticScore: number;
    lastCallDate: string;
    callFrequency: number;
  };
}

// Fallback topics organized by category
const FALLBACK_TOPICS = {
  family: [
    "Tell me about your family. What are your children or grandchildren up to?",
    "I'd love to hear about your family. How are they doing?",
    "What's the most recent thing your family did together?"
  ],
  hobbies: [
    "What have you been working on in your garden lately?",
    "How is your piano playing going?",
    "What's your favorite thing to cook?",
    "Tell me about your hobbies. What brings you joy?"
  ],
  memories: [
    "Tell me about your childhood. What was your favorite game?",
    "What did you used to cook for your family?",
    "Tell me about your hometown. What do you miss most?",
    "What was your favorite memory from when you were younger?"
  ],
  cultural: [
    "Tell me about your cultural background. What traditions do you cherish?",
    "What was it like growing up in your hometown?",
    "What cultural foods or customs do you miss most?"
  ],
  general: [
    "What's been the highlight of your week?",
    "Tell me about something that made you smile recently.",
    "What's something you're looking forward to?",
    "What's your favorite thing about this time of year?"
  ]
};

// Fallback responses for when conversation stalls
const FALLBACK_RESPONSES = [
  "Tell me more about that.",
  "I'm listening. Please continue.",
  "That sounds important to you.",
  "How did that make you feel?",
  "I'd love to hear more.",
  "That's interesting. Please go on.",
  "I'm here with you. What else would you like to share?",
  "That sounds wonderful. Tell me more.",
  "I can hear how much that means to you.",
  "Please, continue. I'm enjoying our conversation.",
  "That's a beautiful story. What happened next?",
  "I'm so glad you're sharing this with me.",
  "That must have been quite an experience.",
  "I can tell this is special to you.",
  "Thank you for sharing that with me."
];

/**
 * Select an appropriate fallback topic based on profile and used topics
 * @param usedTopics - Array of recently used topics to avoid repeating
 * @param profile - The senior's profile with interests and preferences
 * @returns A fallback topic string
 */
export function selectFallbackTopic(usedTopics: string[], profile: SeniorProfile): string {
  // Get all available topics
  const allTopics = [
    ...FALLBACK_TOPICS.family,
    ...FALLBACK_TOPICS.hobbies,
    ...FALLBACK_TOPICS.memories,
    ...FALLBACK_TOPICS.cultural,
    ...FALLBACK_TOPICS.general
  ];
  
  // Filter out recently used topics
  const availableTopics = allTopics.filter(topic => 
    !usedTopics.some(used => 
      topic.toLowerCase().includes(used.toLowerCase()) ||
      used.toLowerCase().includes(topic.toLowerCase())
    )
  );
  
  // If all topics have been used, reset and use all topics
  const topicsToUse = availableTopics.length > 0 ? availableTopics : allTopics;
  
  // Prioritize topics based on profile interests
  const prioritizedTopics = topicsToUse.sort((a, b) => {
    const aScore = getTopicRelevanceScore(a, profile);
    const bScore = getTopicRelevanceScore(b, profile);
    return bScore - aScore;
  });
  
  // Select the most relevant topic
  return prioritizedTopics[0] || FALLBACK_TOPICS.general[0];
}

/**
 * Calculate relevance score for a topic based on profile interests
 * @param topic - The topic to score
 * @param profile - The senior's profile
 * @returns Relevance score (higher is more relevant)
 */
function getTopicRelevanceScore(topic: string, profile: SeniorProfile): number {
  let score = 0;
  const lowerTopic = topic.toLowerCase();
  
  // Score based on hobbies
  profile.memories.hobbies.forEach(hobby => {
    if (lowerTopic.includes(hobby.toLowerCase())) {
      score += 3;
    }
  });
  
  // Score based on interests
  profile.socialProfile.interests.forEach(interest => {
    if (lowerTopic.includes(interest.toLowerCase())) {
      score += 2;
    }
  });
  
  // Score based on family mentions
  if (lowerTopic.includes('family') && profile.memories.family.length > 0) {
    score += 2;
  }
  
  // Score based on cultural background
  if (lowerTopic.includes('cultural') || lowerTopic.includes('hometown')) {
    score += 1;
  }
  
  // Score based on preferred topics
  profile.memories.preferences.topicsEnjoys.forEach(pref => {
    if (lowerTopic.includes(pref.toLowerCase())) {
      score += 2;
    }
  });
  
  return score;
}

/**
 * Select a random fallback response
 * @returns A fallback response string
 */
export function selectFallbackResponse(): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[randomIndex];
}
