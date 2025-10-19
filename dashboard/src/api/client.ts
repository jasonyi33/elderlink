// API client for dashboard
// This will be implemented in later tasks

export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8787'

export interface ApiClient {
  fetchProfile: (seniorId: string) => Promise<any>
  fetchLiveSentiment: () => Promise<any>
  fetchAnalytics: () => Promise<any>
}

// Placeholder - will be implemented in task 5.10
export const apiClient: ApiClient = {
  fetchProfile: async () => ({}),
  fetchLiveSentiment: async () => ({}),
  fetchAnalytics: async () => ({})
}
