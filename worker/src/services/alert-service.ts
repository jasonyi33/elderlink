/**
 * Task 3.1d: Alert Service STUB
 * 
 * TEMPORARY IMPLEMENTATION - Returns empty array to make tests pass
 * TODO: Task 3.6 - Replace with real crisis detection and alert storage
 * 
 * Reference: PRD.md lines 568-596
 */

import { Alert } from '../types';
import { Env } from './kv-service';

// TODO: Task 3.6 - Replace stub with real alert retrieval from KV
export async function getAlerts(_seniorId: string, _env: Env): Promise<Alert[]> {
  console.log('[ALERT-STUB] getAlerts called for:', _seniorId);
  
  // STUB: Return empty alerts array
  return [];
}

