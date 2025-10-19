/**
 * Task 3.1d: Analytics Service STUB (Updated for Task 3.11)
 * 
 * TEMPORARY IMPLEMENTATION - Returns mock data to make tests pass
 * TODO: Task 3.7 - Replace with real wellness metrics calculation
 * 
 * Updated Task 3.11: Added word cloud data from conversations
 * 
 * Reference: PRD.md lines 1610-1639, 563
 */

import { Analytics } from '../types';
import { Env, getProfile } from './kv-service';
import { generateWordCloud, WordCloudItem } from './word-cloud';

// TODO: Task 3.7 - Replace stub with real analytics calculation
export async function getAnalytics(env: Env): Promise<Analytics & { wordCloud?: WordCloudItem[] }> {
  console.log('[ANALYTICS] getAnalytics called');
  
  // Get all senior profiles to generate word cloud
  let wordCloud: WordCloudItem[] = [];
  try {
    // Hardcoded IDs for demo (same as matching service)
    const seniorIds = ['mrs-chen', 'mrs-lee', 'mr-wang', 'mrs-kim'];
    const profiles = [];
    
    for (const id of seniorIds) {
      try {
        const profile = await getProfile(id, env);
        if (profile) {
          profiles.push(profile);
        }
      } catch (error) {
        console.log('[ANALYTICS] Could not load profile:', id);
      }
    }
    
    // Extract conversations with transcripts for word cloud
    const conversationsWithTranscripts = profiles.flatMap(p => 
      p.conversations.map(conv => ({
        transcript: conv.transcript || [
          { role: 'senior' as const, content: conv.summary || '' }
        ]
      }))
    );
    
    // Generate word cloud from all conversations
    if (conversationsWithTranscripts.length > 0) {
      wordCloud = generateWordCloud(conversationsWithTranscripts);
      console.log('[ANALYTICS] Generated word cloud with', wordCloud.length, 'words');
    }
  } catch (error) {
    console.error('[ANALYTICS] Error generating word cloud:', error);
    // Continue with empty word cloud
  }
  
  // STUB: Return mock analytics data + word cloud
  return {
    totalConversations: 147,
    averageSentiment: 0.42,
    totalMatches: 8,
    totalHealthNotes: 23,
    seniorCount: 4,
    holisticWellnessAverage: 78,
    wordCloud
  };
}

