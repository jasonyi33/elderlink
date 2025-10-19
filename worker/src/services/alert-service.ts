/**
 * Task 3.6d: Alert Service Implementation
 * 
 * Crisis detection and alerting system for senior safety
 * 
 * Reference:
 * - PRD.md lines 568-596 (FR8: Crisis Escalation)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.6
 * 
 * Alert Structure (Combined from PRD + Task spec):
 * - seniorId: string
 * - timestamp: string (ISO)
 * - severity: "high" | "medium" | "low"
 * - type: "medical" | "crisis" | "depression" | "general"
 * - message: string (human-readable)
 * - concerns: Array<{type: string, excerpt: string}>
 * - requiresAction: boolean
 */

import { Env } from './kv-service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Alert interface - Combined structure from PRD and task requirements
 */
export interface Alert {
  seniorId: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  type: 'medical' | 'crisis' | 'depression' | 'general';
  message: string;
  concerns: Array<{
    type: string;
    excerpt: string;
  }>;
  requiresAction: boolean;
}

/**
 * Escalation keywords structure
 */
export interface EscalationKeywords {
  medical: string[];
  crisis: string[];
  depression: string[];
}

/**
 * Load escalation keywords from JSON file
 * PRD: data/escalation-keywords.json
 */
export function loadEscalationKeywords(): EscalationKeywords {
  try {
    // In Workers environment, we'll need to read from a static location
    // For tests, we can use Node's fs module
    const keywordsPath = path.join(process.cwd(), 'data', 'escalation-keywords.json');
    const keywordsData = fs.readFileSync(keywordsPath, 'utf-8');
    const keywords = JSON.parse(keywordsData) as EscalationKeywords;
    
    console.log('[ALERT] Loaded escalation keywords:', {
      medical: keywords.medical.length,
      crisis: keywords.crisis.length,
      depression: keywords.depression.length
    });
    
    return keywords;
  } catch (error) {
    console.error('[ALERT] Error loading escalation keywords:', error);
    // Return empty keywords if file not found
    return {
      medical: [],
      crisis: [],
      depression: []
    };
  }
}

/**
 * Check if text matches any keyword in a category
 * Case-insensitive matching
 * 
 * @param text - The message to check
 * @param keywords - Array of keywords to match against
 * @returns true if any keyword is found in the text
 */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerText.includes(lowerKeyword)) {
      console.log('[ALERT] Keyword matched:', keyword);
      return true;
    }
  }
  
  return false;
}

/**
 * Detect crisis keywords and create an alert if necessary
 * PRD lines 580-584: Called when high-severity concerns detected
 * 
 * @param message - The senior's message to analyze
 * @param profile - The senior's profile
 * @param env - Cloudflare environment
 * @returns Alert object if crisis detected, null otherwise
 */
export async function detectAndCreateAlert(
  message: string,
  profile: any,
  _env: Env
): Promise<Alert | null> {
  console.log('[ALERT] Analyzing message for crisis keywords:', profile.id);

  const keywords = loadEscalationKeywords();
  const concerns: Array<{type: string, excerpt: string}> = [];
  let severity: 'high' | 'medium' | 'low' = 'low';
  let type: 'medical' | 'crisis' | 'depression' | 'general' = 'general';
  let alertMessage = '';

  // Check for medical emergencies (highest priority)
  if (matchesKeywords(message, keywords.medical)) {
    severity = 'high';
    type = 'medical';
    
    // Extract matched keywords for concerns
    const matchedKeywords: string[] = [];
    keywords.medical.forEach(keyword => {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        concerns.push({
          type: 'medical',
          excerpt: keyword
        });
        matchedKeywords.push(keyword);
      }
    });
    
    // Include matched keywords in alert message
    alertMessage = `Medical emergency detected: ${profile.name || profile.id} - ${matchedKeywords.join(', ')}`;
  }

  // Check for crisis/suicide ideation (highest priority)
  if (matchesKeywords(message, keywords.crisis)) {
    severity = 'high';
    type = 'crisis';
    alertMessage = `CRISIS ALERT: Suicide ideation detected for ${profile.name || profile.id}`;
    
    keywords.crisis.forEach(keyword => {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        concerns.push({
          type: 'crisis',
          excerpt: keyword
        });
      }
    });
  }

  // Check for severe depression (medium priority)
  if (matchesKeywords(message, keywords.depression)) {
    // Only set if not already flagged as medical/crisis
    if (severity !== 'high') {
      severity = 'medium';
      type = 'depression';
      alertMessage = `Depression indicators detected for ${profile.name || profile.id}`;
    }
    
    keywords.depression.forEach(keyword => {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        concerns.push({
          type: 'depression',
          excerpt: keyword
        });
      }
    });
  }

  // If any concerns were detected, create an alert
  if (concerns.length > 0) {
    const alert: Alert = {
      seniorId: profile.id,
      timestamp: new Date().toISOString(),
      severity,
      type,
      message: alertMessage,
      concerns,
      requiresAction: true // All detected crises require action
    };

    console.log('[ALERT] Created alert:', {
      seniorId: alert.seniorId,
      severity: alert.severity,
      type: alert.type,
      concernCount: alert.concerns.length
    });

    return alert;
  }

  // No crisis detected
  console.log('[ALERT] No crisis keywords detected');
  return null;
}

/**
 * Store alert in KV storage
 * Appends to existing alerts array
 * PRD line 583: Store in KV: 'alerts-{seniorId}'
 * 
 * @param seniorId - The senior's ID
 * @param alert - The alert to store
 * @param env - Cloudflare environment
 */
export async function storeAlert(
  seniorId: string,
  alert: Alert,
  env: Env
): Promise<void> {
  console.log('[ALERT] Storing alert for:', seniorId);

  try {
    const key = `alerts-${seniorId}`;
    
    // Get existing alerts
    const existingData = await env.KV.get(key);
    const existingAlerts: Alert[] = existingData ? JSON.parse(existingData) : [];
    
    // Append new alert
    existingAlerts.push(alert);
    
    // Store back to KV
    await env.KV.put(key, JSON.stringify(existingAlerts));
    
    console.log('[ALERT] Alert stored. Total alerts:', existingAlerts.length);

  } catch (error) {
    console.error('[ALERT] Error storing alert:', error);
    throw error;
  }
}

/**
 * Retrieve all alerts for a senior
 * 
 * @param seniorId - The senior's ID
 * @param env - Cloudflare environment
 * @returns Array of alerts (empty if none exist)
 */
export async function getAlerts(
  seniorId: string,
  env: Env
): Promise<Alert[]> {
  console.log('[ALERT] Retrieving alerts for:', seniorId);

  try {
    const key = `alerts-${seniorId}`;
    const data = await env.KV.get(key);
    
    if (!data) {
      console.log('[ALERT] No alerts found');
      return [];
    }
    
    const alerts = JSON.parse(data) as Alert[];
    console.log('[ALERT] Retrieved', alerts.length, 'alerts');
    
    return alerts;

  } catch (error) {
    console.error('[ALERT] Error retrieving alerts:', error);
    return [];
  }
}
