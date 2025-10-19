/**
 * Task 3.7d: Wellness Metrics Service Implementation
 * 
 * Calculates holistic wellness combining mental, physical, and social health
 * 
 * Reference:
 * - PRD.md lines 1455-1492 (updateWellnessMetrics implementation)
 * - PRD.md lines 239-258 (wellnessMetrics interface)
 * - PRD.md lines 1483-1490 (holistic score calculation)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.7
 * 
 * Wellness Calculation:
 * - Mental Score: (sentiment + 1) * 50 → converts -1 to +1 into 0 to 100
 * - Physical Score: Fixed at 70 for demo (PRD line 1485)
 * - Social Score: matches*10 + groups*20 (capped at 100)
 * - Holistic Score: mental*40% + physical*30% + social*30%
 */

import { SeniorProfile } from '../types';

/**
 * Calculate mental health score from sentiment
 * Converts sentiment range -1 to +1 into score 0 to 100
 * PRD line 1484
 * 
 * @param sentiment - Sentiment value from -1 (very negative) to +1 (very positive)
 * @returns Mental health score 0-100
 */
export function calculateMentalScore(sentiment: number): number {
  // Convert -1 to +1 → 0 to 100
  // Formula: (sentiment + 1) * 50
  const score = (sentiment + 1) * 50;
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate social health score from matches and groups
 * PRD line 1486
 * 
 * @param metrics - Object with matchesMade and groupsJoined counts
 * @returns Social health score 0-100
 */
export function calculateSocialScore(metrics: {
  matchesMade: number;
  groupsJoined: number;
}): number {
  // Matches: 10 points each
  // Groups: 20 points each
  // Capped at 100
  const score = (metrics.matchesMade * 10) + (metrics.groupsJoined * 20);
  
  return Math.min(100, score);
}

/**
 * Calculate holistic wellness score using weighted average
 * PRD lines 1488-1490
 * 
 * @param scores - Individual dimension scores
 * @returns Holistic wellness score 0-100 (rounded)
 */
export function calculateHolisticScore(scores: {
  mentalScore: number;
  physicalScore: number;
  socialScore: number;
}): number {
  // Weighted average: mental*40% + physical*30% + social*30%
  const holistic = (scores.mentalScore * 0.4) +
                   (scores.physicalScore * 0.3) +
                   (scores.socialScore * 0.3);
  
  return Math.round(holistic);
}

/**
 * Calculate wellness trend from conversation history
 * Compares first half vs second half of recent conversations
 * PRD lines 1462-1472
 * 
 * @param conversations - Array of conversation objects with sentiment
 * @returns Trend: "improving" | "declining" | "stable" | "insufficient_data"
 */
export function calculateTrend(
  conversations: Array<{ sentiment: number }>
): 'improving' | 'declining' | 'stable' | 'insufficient_data' {
  // Edge case: Not enough data
  if (!conversations || conversations.length < 2) {
    return 'insufficient_data';
  }

  // Use last 10 conversations for trend calculation
  const recentConversations = conversations.slice(-10);
  
  if (recentConversations.length < 2) {
    return 'insufficient_data';
  }

  // Split into first half and second half
  const midpoint = Math.ceil(recentConversations.length / 2);
  const firstHalf = recentConversations.slice(0, midpoint);
  const secondHalf = recentConversations.slice(midpoint);

  // Calculate averages
  const firstHalfAvg = firstHalf.reduce((sum, c) => sum + c.sentiment, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, c) => sum + c.sentiment, 0) / secondHalf.length;

  console.log('[WELLNESS] Trend calculation:', {
    firstHalfAvg: firstHalfAvg.toFixed(2),
    secondHalfAvg: secondHalfAvg.toFixed(2),
    diff: (secondHalfAvg - firstHalfAvg).toFixed(2)
  });

  // Threshold: 0.1 difference - PRD lines 1466-1472
  const TREND_THRESHOLD = 0.1;

  if (secondHalfAvg > firstHalfAvg + TREND_THRESHOLD) {
    return 'improving';
  } else if (secondHalfAvg < firstHalfAvg - TREND_THRESHOLD) {
    return 'declining';
  } else {
    return 'stable';
  }
}

/**
 * Update all wellness metrics in the senior profile
 * Main function that calculates and updates all wellness metrics
 * PRD lines 1455-1492
 * 
 * @param profile - The senior profile to update (modified in place)
 */
export function updateWellnessMetrics(profile: SeniorProfile): void {
  console.log('[WELLNESS] Updating wellness metrics for:', profile.id);

  // Defensive: Ensure required structures exist
  if (!profile.conversations) {
    console.log('[WELLNESS] No conversations array, skipping update');
    return;
  }

  const recentConversations = profile.conversations.slice(-10);

  // Skip if no conversations
  if (recentConversations.length === 0) {
    console.log('[WELLNESS] No conversations, skipping update');
    return;
  }

  // Defensive: Ensure wellnessMetrics structure exists
  if (!profile.wellnessMetrics) {
    console.log('[WELLNESS] No wellnessMetrics structure, skipping update');
    return;
  }

  // Ensure sub-structures exist
  if (!profile.wellnessMetrics.mentalHealth) {
    profile.wellnessMetrics.mentalHealth = { averageSentiment: 0, trend: 'stable' as const, lonelinessScore: 0 };
  }
  if (!profile.wellnessMetrics.physicalHealth) {
    profile.wellnessMetrics.physicalHealth = { symptomMentions: 0, medicationAdherence: 0, appointmentReminders: 0 };
  }
  if (!profile.wellnessMetrics.socialHealth) {
    profile.wellnessMetrics.socialHealth = { matchesMade: 0, groupsJoined: 0, communityEngagement: 0 };
  }

  // === MENTAL HEALTH === (PRD lines 1458-1472)
  
  // Calculate average sentiment
  const avgSentiment = recentConversations.reduce((sum, c) => sum + c.sentiment, 0) / recentConversations.length;
  profile.wellnessMetrics.mentalHealth.averageSentiment = avgSentiment;

  // Calculate trend
  profile.wellnessMetrics.mentalHealth.trend = calculateTrend(recentConversations);

  // === PHYSICAL HEALTH === (PRD lines 1474-1477)
  
  // Count symptom mentions from health notes (defensive: check if exists)
  if (profile.healthData && profile.healthData.notes) {
    profile.wellnessMetrics.physicalHealth.symptomMentions = profile.healthData.notes.filter(
      n => n.mentions && n.mentions.some((m: any) => m.type === 'symptom')
    ).length;
  }

  // === SOCIAL HEALTH === (PRD lines 1479-1481)
  
  // Count matches and groups (defensive: check if exists)
  profile.wellnessMetrics.socialHealth.matchesMade = profile.matches ? profile.matches.length : 0;
  profile.wellnessMetrics.socialHealth.groupsJoined = profile.groups ? profile.groups.length : 0;

  // === HOLISTIC SCORE === (PRD lines 1483-1490)
  
  // Calculate individual dimension scores
  const mentalScore = calculateMentalScore(avgSentiment);
  const physicalScore = 70; // Simplified for demo - PRD line 1485
  const socialScore = calculateSocialScore({
    matchesMade: profile.matches.length,
    groupsJoined: profile.groups.length
  });

  // Calculate weighted holistic score
  profile.wellnessMetrics.holisticScore = calculateHolisticScore({
    mentalScore,
    physicalScore,
    socialScore
  });

  // Update last call date (PRD line 1492)
  profile.wellnessMetrics.lastCallDate = new Date().toISOString();

  console.log('[WELLNESS] Updated metrics:', {
    mentalScore,
    physicalScore,
    socialScore,
    holisticScore: profile.wellnessMetrics.holisticScore,
    trend: profile.wellnessMetrics.mentalHealth.trend
  });
}

