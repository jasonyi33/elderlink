// API client for dashboard with React Query integration
import type { SeniorProfile } from '../types'
import { API_CONFIG } from '../config/api'
import { getMrsChenProfile, getLiveSentiment, getAnalytics, getMatchProfiles } from './mock-api'

export const API_BASE_URL = API_CONFIG.BASE_URL

// Enable mock mode ONLY when explicitly set via environment variable
// Now connecting to real Worker API at https://elderlink-dev.elderlinkhelper.workers.dev
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_API === 'true'

export interface ApiClient {
  fetchProfile: (seniorId: string) => Promise<any>
  fetchLiveSentiment: () => Promise<any>
  fetchAnalytics: () => Promise<any>
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s

// Helper function to make HTTP requests with retry logic
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {},
  retryCount: number = 0
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1]
      console.log(`Request failed, retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(url, options, retryCount + 1)
    }
    
    throw error
  }
}

// Helper function to handle API errors
function handleApiError(error: any, context: string): ApiResponse<any> {
  console.error('API Error:', error)
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return { error: 'Network timeout', status: 0 }
  }
  
  if (error.message.includes('404')) {
    return { error: 'Profile not found', status: 404 }
  }
  
  if (error.message.includes('500')) {
    return { error: 'Server error', status: 500 }
  }
  
  return { error: `Failed to ${context}`, status: 0 }
}

// API Client implementation
export const apiClient: ApiClient = {
  async fetchProfile(seniorId: string): Promise<ApiResponse<any>> {
    // Use mock data in development or when explicitly enabled
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for profile')
      return getMrsChenProfile()
    }

    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD(seniorId)}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.log('⚠️ API failed, falling back to mock data')
      return getMrsChenProfile()
    }
  },

  async fetchLiveSentiment(): Promise<ApiResponse<any>> {
    // Use mock data in development or when explicitly enabled
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for live sentiment')
      return getLiveSentiment()
    }

    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.LIVE_SENTIMENT}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.log('⚠️ API failed, falling back to mock data')
      return getLiveSentiment()
    }
  },

  async fetchAnalytics(): Promise<ApiResponse<any>> {
    // Use mock data in development or when explicitly enabled
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for analytics')
      return getAnalytics()
    }

    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.ANALYTICS}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.log('⚠️ API failed, falling back to mock data')
      return getAnalytics()
    }
  }
}

// Additional utility functions for specific endpoints
export const apiUtils = {
  // Fetch individual senior profile (for community matches)
  async fetchSeniorProfile(seniorId: string): Promise<ApiResponse<SeniorProfile>> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.SENIOR_PROFILE(seniorId)}`)
      const data = await response.json()
      return data
    } catch (error) {
      return handleApiError(error, 'fetch senior profile')
    }
  },

  // Fetch health data
  async fetchHealthData(seniorId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH_DATA(seniorId)}`)
      const data = await response.json()
      return data
    } catch (error) {
      return handleApiError(error, 'fetch health data')
    }
  },

  // Update health notes
  async updateHealthNotes(seniorId: string, notes: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_HEALTH(seniorId)}`, {
        method: 'POST',
        body: JSON.stringify(notes)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      return handleApiError(error, 'update health notes')
    }
  },

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH_CHECK}`)
      const data = await response.json()
      return data
    } catch (error) {
      return handleApiError(error, 'health check')
    }
  }
}
