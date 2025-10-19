/**
 * Task 3.3d: KV Service Implementation
 * 
 * Real Cloudflare KV operations for senior profiles and live sentiment
 * Implements conversation limit (max 10) and TTL for live data
 * 
 * Reference: 
 * - PRD.md lines 772-788
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.3
 */

import { SeniorProfile } from '../types';

export interface Env {
  KV: KVNamespace;
  ENVIRONMENT: string;
  GEMINI_API_KEY: string;
  VAPI_API_KEY: string;
  ELEVENLABS_ENGLISH_VOICE: string;
  ELEVENLABS_MANDARIN_VOICE: string;
  context: ExecutionContext;
}

/**
 * Get senior profile from KV storage
 * Returns null if profile doesn't exist
 */
export async function getProfile(seniorId: string, env: Env): Promise<SeniorProfile | null> {
  console.log('[KV] getProfile called for:', seniorId);
  
  try {
    const key = `senior-${seniorId}`;
    const data = await env.KV.get(key);
    
    if (!data) {
      console.log('[KV] Profile not found:', seniorId);
      return null;
    }
    
    const profile = JSON.parse(data) as SeniorProfile;
    console.log('[KV] Profile retrieved:', seniorId);
    return profile;
    
  } catch (error) {
    console.error('[KV] Error getting profile:', error);
    return null;
  }
}

/**
 * Save senior profile to KV storage
 * Enforces conversation limit (max 10)
 * Does not mutate input - creates a copy if truncation needed
 */
export async function saveProfile(profile: SeniorProfile, env: Env): Promise<void> {
  console.log('[KV] saveProfile called for:', profile.id);
  
  try {
    // Create a copy to avoid mutating input
    let profileToSave = profile;
    
    // Enforce conversation limit: keep only last 10
    if (profile.conversations && profile.conversations.length > 10) {
      profileToSave = {
        ...profile,
        conversations: profile.conversations.slice(-10)
      };
      console.log('[KV] Truncated conversations to last 10');
    }
    
    const key = `senior-${profile.id}`;
    const value = JSON.stringify(profileToSave);
    
    await env.KV.put(key, value);
    console.log('[KV] Profile saved:', profile.id);
    
  } catch (error) {
    console.error('[KV] Error saving profile:', error);
    throw error;
  }
}

/**
 * Save live sentiment data with 5-minute TTL
 * Used for real-time dashboard updates
 */
export async function saveLiveSentiment(
  seniorId: string,
  data: { sentiment: number; emotions: string[]; timestamp: string },
  env: Env
): Promise<void> {
  console.log('[KV] saveLiveSentiment called for:', seniorId);
  
  try {
    const key = `live-sentiment-${seniorId}`;
    const value = JSON.stringify(data);
    
    // Set 5-minute TTL (300 seconds)
    await env.KV.put(key, value, { expirationTtl: 300 });
    console.log('[KV] Live sentiment saved with 5-min TTL:', seniorId);
    
  } catch (error) {
    console.error('[KV] Error saving live sentiment:', error);
    throw error;
  }
}

/**
 * Get live sentiment data
 * Returns null if expired or doesn't exist
 */
export async function getLiveSentiment(
  seniorId: string,
  env: Env
): Promise<{ sentiment: number; emotions: string[]; timestamp: string } | null> {
  console.log('[KV] getLiveSentiment called for:', seniorId);
  
  try {
    const key = `live-sentiment-${seniorId}`;
    const data = await env.KV.get(key);
    
    if (!data) {
      console.log('[KV] Live sentiment not found or expired:', seniorId);
      return null;
    }
    
    const sentiment = JSON.parse(data);
    console.log('[KV] Live sentiment retrieved:', seniorId);
    return sentiment;
    
  } catch (error) {
    console.error('[KV] Error getting live sentiment:', error);
    return null;
  }
}

