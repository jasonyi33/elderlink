/**
 * Data validation utilities to prevent crashes with empty/null data
 * Critical for maintaining stability during live demo
 */

// Types
export interface SentimentData {
  sentiment: number;
  emotions: string[];
  timestamp: string;
  language?: 'english' | 'mandarin';
}

export interface HealthData {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    purpose?: string;
  }>;
  conditions: Array<{
    name: string;
    status: string;
    severity?: 'low' | 'medium' | 'high';
  }>;
  appointments: Array<{
    date: string;
    doctor: string;
    type: string;
    location?: string;
  }>;
  notes: Array<{
    timestamp: string;
    note: string;
    severity?: 'low' | 'medium' | 'high';
    mentions?: Array<{ type: string; text: string }>;
  }>;
  vitals: Record<string, any>;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * Validates sentiment data from API, ensuring safe defaults
 */
export function validateSentimentData(data: any): SentimentData {
  return {
    sentiment: typeof data?.sentiment === 'number'
      ? Math.max(-1, Math.min(1, data.sentiment)) // Clamp between -1 and 1
      : 0,
    emotions: Array.isArray(data?.emotions)
      ? data.emotions.filter(e => typeof e === 'string').slice(0, 5) // Max 5 emotions
      : [],
    timestamp: data?.timestamp || new Date().toISOString(),
    language: data?.language === 'mandarin' ? 'mandarin' : 'english',
  };
}

/**
 * Validates health data from API, ensuring arrays are properly formed
 */
export function validateHealthData(data: any): HealthData {
  return {
    medications: Array.isArray(data?.medications)
      ? data.medications.filter(m => m?.name)
      : [],
    conditions: Array.isArray(data?.conditions)
      ? data.conditions.filter(c => c?.name)
      : [],
    appointments: Array.isArray(data?.appointments)
      ? data.appointments.filter(a => a?.date)
      : [],
    notes: Array.isArray(data?.notes)
      ? data.notes.slice(0, 10).filter(n => n?.note) // Limit to 10 for performance
      : [],
    vitals: data?.vitals && typeof data.vitals === 'object'
      ? data.vitals
      : {},
  };
}

/**
 * Validates chart data, providing fallback for empty datasets
 */
export function validateChartData(data: any[]): ChartDataPoint[] {
  if (!Array.isArray(data) || data.length === 0) {
    // Return dummy data for empty charts to prevent crashes
    return [
      { date: new Date().toISOString(), value: 0, label: 'No data' },
    ];
  }

  return data
    .filter(point => point && typeof point.value === 'number')
    .map(point => ({
      date: point.date || new Date().toISOString(),
      value: Math.max(-1, Math.min(1, point.value)), // Clamp values
      label: point.label || '',
    }));
}

/**
 * Validates profile data structure
 */
export function validateProfileData(data: any) {
  return {
    id: data?.id || 'unknown',
    name: data?.name || 'Senior',
    age: typeof data?.age === 'number' ? data.age : 0,
    background: data?.background || '',
    language: data?.language || 'english',
    familyContacts: Array.isArray(data?.familyContacts)
      ? data.familyContacts
      : [],
    interests: Array.isArray(data?.interests)
      ? data.interests
      : [],
    memories: data?.memories && typeof data.memories === 'object'
      ? data.memories
      : {},
  };
}

/**
 * Validates community match data
 */
export function validateMatchData(data: any) {
  return {
    seniorId: data?.seniorId || '',
    name: data?.name || 'Unknown',
    age: typeof data?.age === 'number' ? data.age : 0,
    location: data?.location || '',
    interests: Array.isArray(data?.interests) ? data.interests : [],
    sharedInterests: Array.isArray(data?.sharedInterests) ? data.sharedInterests : [],
    score: typeof data?.score === 'number'
      ? Math.max(0, Math.min(100, data.score))
      : 0,
    suggestedGroup: data?.suggestedGroup || null,
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    console.warn('Failed to parse JSON, using fallback');
    return fallback;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}