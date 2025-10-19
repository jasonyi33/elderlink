// API Configuration for ElderLink Dashboard
export const API_CONFIG = {
  // Production URL - Updated with actual Worker URL
  PRODUCTION_URL: 'https://elderlink-dev.workers.dev',
  
  // Development URL for local testing
  DEVELOPMENT_URL: 'http://localhost:8787',
  
  // Current environment
  get BASE_URL() {
    return process.env.VITE_API_BASE_URL || this.DEVELOPMENT_URL
  },
  
  // API Endpoints
  ENDPOINTS: {
    DASHBOARD: (seniorId: string) => `/api/dashboard/${seniorId}`,
    LIVE_SENTIMENT: '/api/sentiment/live',
    ANALYTICS: '/api/analytics',
    SENIOR_PROFILE: (seniorId: string) => `/api/senior/${seniorId}`,
    HEALTH_DATA: (seniorId: string) => `/api/mychart/${seniorId}`,
    UPDATE_HEALTH: (seniorId: string) => `/api/mychart/${seniorId}/update`,
    HEALTH_CHECK: '/api/health'
  },
  
  // Polling intervals
  POLLING: {
    LIVE_SENTIMENT: 2000, // 2 seconds
    DASHBOARD_DATA: 30000, // 30 seconds
    HEALTH_CHECK: 60000 // 1 minute
  }
}
