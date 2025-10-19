/**
 * Task 3.1d: Dashboard API Handler
 * 
 * Single endpoint that returns all dashboard data
 * 
 * Reference: PRD.md lines 1099-1118
 */

import { Env, getProfile, getLiveSentiment } from '../services/kv-service';
import { getAnalytics } from '../services/analytics-service';

/**
 * GET /api/dashboard/:seniorId
 * Returns everything the dashboard needs in one call
 */
export async function handleDashboardAPI(
  seniorId: string,
  env: Env
): Promise<Response> {
  console.log('[DASHBOARD] Get dashboard data for:', seniorId);
  
  try {
    const profile = await getProfile(seniorId, env);
    const analytics = await getAnalytics(env);
    const liveSentiment = await getLiveSentiment(seniorId, env);

    return new Response(JSON.stringify({
      profile,
      analytics,
      liveSentiment
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[DASHBOARD] Error getting dashboard data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load dashboard data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

