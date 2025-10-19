/**
 * Task 3.1d: MyChart API Handler
 * 
 * Mock MyChart integration endpoints (3 total)
 * 
 * Reference: PRD.md lines 330-336, 1022-1052
 */

import { Env, getProfile, saveProfile } from '../services/kv-service';

/**
 * GET /api/mychart/:seniorId
 * Returns all health data for a senior
 */
export async function handleGetHealthData(seniorId: string, env: Env): Promise<Response> {
  console.log('[MYCHART] Get health data for:', seniorId);
  
  try {
    const profile = await getProfile(seniorId, env);
    
    return new Response(JSON.stringify(profile.healthData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[MYCHART] Error getting health data:', error);
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/mychart/:seniorId/appointments
 * Returns upcoming appointments only
 */
export async function handleGetAppointments(seniorId: string, env: Env): Promise<Response> {
  console.log('[MYCHART] Get appointments for:', seniorId);
  
  try {
    const profile = await getProfile(seniorId, env);
    
    return new Response(JSON.stringify(profile.healthData.appointments), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[MYCHART] Error getting appointments:', error);
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/mychart/:seniorId/update
 * Batch update health notes
 */
export async function handleUpdateHealthNotes(
  seniorId: string,
  request: Request,
  env: Env
): Promise<Response> {
  console.log('[MYCHART] Update health notes for:', seniorId);
  
  try {
    const body = await request.json() as any;
    const profile = await getProfile(seniorId, env);
    
    // Append new notes
    if (body.notes && Array.isArray(body.notes)) {
      profile.healthData.notes.push(...body.notes);
      
      // Keep only last 10 notes
      if (profile.healthData.notes.length > 10) {
        profile.healthData.notes = profile.healthData.notes.slice(-10);
      }
    }
    
    await saveProfile(profile, env);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[MYCHART] Error updating health notes:', error);
    return new Response(JSON.stringify({ error: 'Update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

