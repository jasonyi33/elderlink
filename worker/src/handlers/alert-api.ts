/**
 * Task 3.1d: Alert API Handler
 * 
 * Retrieves alerts for a senior
 * 
 * Reference: PRD.md lines 568-596
 */

import { Env } from '../services/kv-service';
import { getAlerts } from '../services/alert-service';

/**
 * GET /api/alerts/:seniorId
 * Returns array of alerts for the senior
 */
export async function handleGetAlerts(seniorId: string, env: Env): Promise<Response> {
  console.log('[ALERTS] Get alerts for:', seniorId);
  
  try {
    const alerts = await getAlerts(seniorId, env);
    
    return new Response(JSON.stringify(alerts), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[ALERTS] Error getting alerts:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve alerts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

