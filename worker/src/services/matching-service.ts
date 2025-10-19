/**
 * Task 3.5d: Matching Service Implementation
 * 
 * Community matching algorithm for senior social connections
 * 
 * Reference:
 * - PRD.md lines 386-475 (Matching Requirements)
 * - PRD.md lines 1641-1676 (Algorithm Details)
 * - PRD.md lines 1531-1567 (Group Generation)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.5
 */

import { SeniorProfile } from '../types';
import { Env, getProfile } from './kv-service';

/**
 * Calculate match score between two seniors
 * Algorithm per PRD lines 1648-1676
 * 
 * Scoring:
 * - Shared interests: 10 points each (max 50)
 * - Same language: 30 points (Mandarin OR English)
 * - Age within ±10 years: 10 points
 * - Same location: 10 points
 * - Total cap: 100 points
 */
export function calculateMatchScore(
  senior1: Partial<SeniorProfile>,
  senior2: Partial<SeniorProfile>
): number {
  let score = 0;

  // Shared interests (10 points each, max 50)
  const interests1 = senior1.socialProfile?.interests || [];
  const interests2 = senior2.socialProfile?.interests || [];
  
  const sharedInterests = interests1.filter(
    interest => interests2.includes(interest)
  );
  score += Math.min(sharedInterests.length * 10, 50);

  // Same primary language (30 points) - PRD lines 1657-1664
  const s1Lang = (senior1.socialProfile?.culturalBackground || '').toLowerCase();
  const s2Lang = (senior2.socialProfile?.culturalBackground || '').toLowerCase();
  
  if (s1Lang.includes('mandarin') && s2Lang.includes('mandarin')) {
    score += 30;
  } else if (s1Lang.includes('english') && s2Lang.includes('english')) {
    score += 30;
  }

  // Age proximity (10 points if within ±10 years) - PRD lines 1666-1668
  const age1 = senior1.age || 0;
  const age2 = senior2.age || 0;
  const ageDiff = Math.abs(age1 - age2);
  if (ageDiff <= 10) {
    score += 10;
  }

  // Same location (10 points) - PRD lines 1670-1672
  if (senior1.location === senior2.location) {
    score += 10;
  }

  // Cap at 100 - PRD line 1675
  return Math.min(score, 100);
}

/**
 * Get compatibility level based on score
 * PRD lines 1678-1683
 */
export function getCompatibilityLevel(score: number): { level: string; stars: number } {
  if (score >= 70) return { level: 'High Compatibility', stars: 5 };
  if (score >= 50) return { level: 'Good Match', stars: 4 };
  if (score >= 30) return { level: 'Potential Match', stars: 3 };
  return { level: 'Low Match', stars: 2 };
}

/**
 * Get top matches for a senior
 * Returns top 3 matches with score >= 50, sorted by score descending
 * PRD lines 1493-1528
 */
export function getTopMatches(
  seniorId: string,
  allSeniors: Partial<SeniorProfile>[],
  currentSenior: Partial<SeniorProfile>
): Array<{
  seniorId: string;
  score: number;
  compatibility: string;
  sharedInterests: string[];
  calculatedAt: string;
}> {
  console.log('[MATCHING] Calculating matches for:', seniorId);

  const matches = [];

  for (const otherSenior of allSeniors) {
    // Skip self
    if (otherSenior.id === seniorId) continue;

    const score = calculateMatchScore(currentSenior, otherSenior);

    // Only include matches with score >= 50 - PRD line 1503
    if (score >= 50) {
      const interests1 = currentSenior.socialProfile?.interests || [];
      const interests2 = otherSenior.socialProfile?.interests || [];
      
      const sharedInterests = interests1.filter(
        i => interests2.includes(i)
      );

      const compatibility = getCompatibilityLevel(score);

      matches.push({
        seniorId: otherSenior.id!,
        score,
        compatibility: compatibility.level.split(' ')[0].toLowerCase(), // "High Compatibility" → "high"
        sharedInterests,
        calculatedAt: new Date().toISOString()
      });
    }
  }

  // Sort by score descending - PRD line 1521
  matches.sort((a, b) => b.score - a.score);

  // Keep top 3 - PRD line 1524
  return matches.slice(0, 3);
}

/**
 * Auto-generate group suggestions based on shared interests
 * PRD lines 1531-1567
 * 
 * Format: "{Language} {Interest} Circle"
 * Example: "Mandarin Gardening Circle"
 */
export function autoGenerateGroups(
  profile: Partial<SeniorProfile>,
  allSeniors: Partial<SeniorProfile>[]
): Array<{
  id: string;
  name: string;
  memberCount: number;
  activity: string;
  language: string;
  schedule: string;
}> {
  console.log('[MATCHING] Generating groups for:', profile.id);

  const potentialGroups: any[] = [];
  const interests = profile.socialProfile?.interests || [];

  // Find seniors with shared interests - PRD lines 1538-1544
  for (const interest of interests) {
    const membersWithInterest = allSeniors.filter(s =>
      s.socialProfile?.interests.includes(interest) &&
      s.location === profile.location && // Same location
      s.id !== profile.id // Not self
    );

    // Need at least 2 members (including current senior) for a group
    if (membersWithInterest.length >= 1) {
      // Determine language for group - PRD lines 1546-1551
      const allMembers = [profile, ...membersWithInterest];
      const mandarinSpeakers = allMembers.filter(s =>
        (s.socialProfile?.culturalBackground || '').toLowerCase().includes('mandarin')
      );

      const language = mandarinSpeakers.length >= 2 ? 'Mandarin' : 'English';
      
      // Format: "{Language} {Interest} Circle" - PRD line 1552
      const interestCapitalized = interest.charAt(0).toUpperCase() + interest.slice(1);
      const groupName = `${language} ${interestCapitalized} Circle`;

      potentialGroups.push({
        id: groupName.toLowerCase().replace(/\s+/g, '-'),
        name: groupName,
        memberCount: membersWithInterest.length + 1, // Include current senior
        activity: interest,
        language,
        schedule: 'Weekly' // Simplified for demo - PRD line 1560
      });
    }
  }

  // Deduplicate and take top 2 - PRD line 1565
  return potentialGroups.slice(0, 2);
}

/**
 * Recalculate matches for a senior and update their profile
 * Called when interests change during conversation
 * PRD lines 1493-1528
 */
export async function recalculateMatches(
  profile: SeniorProfile,
  env: Env
): Promise<void> {
  console.log('[MATCHING] Recalculating matches for:', profile.id);

  try {
    // Get all other seniors - PRD line 1495
    const allSeniors = await getAllSeniors(env);

    // Calculate matches using getTopMatches - PRD lines 1497-1519
    const newMatches = getTopMatches(profile.id, allSeniors, profile);

    // Update profile.matches - PRD line 1524
    // Cast to proper type for SeniorProfile.matches
    profile.matches = newMatches as any;

    // Auto-generate groups - PRD line 1528
    const groups = autoGenerateGroups(profile, allSeniors);
    profile.groups = groups.slice(0, 2); // Keep top 2 groups

    console.log('[MATCHING] Updated with', newMatches.length, 'matches and', groups.length, 'groups');

  } catch (error) {
    console.error('[MATCHING] Error recalculating matches:', error);
    // Don't throw - matching is non-critical
  }
}

/**
 * Get all senior profiles from KV
 * Simplified for demo - in production would use KV.list()
 * PRD lines 1600-1615
 */
export async function getAllSeniors(env: Env): Promise<SeniorProfile[]> {
  console.log('[MATCHING] Fetching all senior profiles');

  // Hardcoded IDs for demo - PRD line 1602
  const ids = ['mrs-chen', 'mrs-lee', 'mr-wang', 'mrs-kim'];
  const profiles: SeniorProfile[] = [];

  for (const id of ids) {
    try {
      const profile = await getProfile(id, env);
      if (profile) {
        profiles.push(profile);
      }
    } catch (error) {
      console.error('[MATCHING] Error fetching profile:', id, error);
      // Skip if not found - PRD line 1609-1611
    }
  }

  console.log('[MATCHING] Found', profiles.length, 'senior profiles');
  return profiles;
}

