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
): Promise<{ sentiment: number; emotions: string[]; timestamp: string; language?: string } | null> {
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

/**
 * 🎬 DEMO MODE: Backup profile before demo
 * Saves current profile to a backup key for restoration after demo
 */
export async function backupProfile(seniorId: string, env: Env): Promise<boolean> {
  console.log('[DEMO] backupProfile called for:', seniorId);

  try {
    const key = `senior-${seniorId}`;
    const backupKey = `senior-${seniorId}-backup`;

    // Get current profile
    const data = await env.KV.get(key);

    if (!data) {
      console.log('[DEMO] No profile to backup:', seniorId);
      return false;
    }

    // Save to backup key with 1-hour TTL (in case we forget to restore)
    await env.KV.put(backupKey, data, { expirationTtl: 3600 });
    console.log('[DEMO] ✅ Profile backed up:', seniorId);
    return true;

  } catch (error) {
    console.error('[DEMO] Error backing up profile:', error);
    return false;
  }
}

/**
 * 🎬 DEMO MODE: Restore profile after demo
 * Replaces demo data with original backed-up profile
 */
export async function restoreProfile(seniorId: string, env: Env): Promise<boolean> {
  console.log('[DEMO] restoreProfile called for:', seniorId);

  try {
    const key = `senior-${seniorId}`;
    const backupKey = `senior-${seniorId}-backup`;

    // Get backup
    const backupData = await env.KV.get(backupKey);

    if (!backupData) {
      console.log('[DEMO] ⚠️ No backup found:', seniorId);
      return false;
    }

    // Restore backup to main key
    await env.KV.put(key, backupData);
    console.log('[DEMO] ✅ Profile restored from backup:', seniorId);

    // Set a "restore complete" signal with 5-minute TTL
    // This tells the dashboard to force-refresh and bypass cache
    const restoreSignal = {
      timestamp: new Date().toISOString(),
      seniorId: seniorId,
      restored: true
    };
    await env.KV.put(`restore-complete-${seniorId}`, JSON.stringify(restoreSignal), {
      expirationTtl: 300 // 5 minutes
    });
    console.log('[DEMO] ✅ Restore signal set - Dashboard will force-refresh:', seniorId);

    // Delete backup key (cleanup)
    await env.KV.delete(backupKey);
    console.log('[DEMO] ✅ Backup key cleaned up:', seniorId);

    return true;

  } catch (error) {
    console.error('[DEMO] Error restoring profile:', error);
    return false;
  }
}

/**
 * 🎬 DEMO MODE: Check if backup exists
 */
export async function hasBackup(seniorId: string, env: Env): Promise<boolean> {
  try {
    const backupKey = `senior-${seniorId}-backup`;
    const data = await env.KV.get(backupKey);
    return data !== null;
  } catch (error) {
    console.error('[DEMO] Error checking backup:', error);
    return false;
  }
}

