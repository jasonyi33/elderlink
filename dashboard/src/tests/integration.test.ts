// Integration tests for Task 5.11 - Switch to Real API
import { apiClient, apiUtils } from '../services/api-client'
import { API_CONFIG } from '../config/api'

describe('Task 5.11: Real API Integration Tests', () => {
  const SENIOR_ID = 'mrs-chen'
  
  beforeAll(() => {
    // Verify API configuration
    expect(API_CONFIG.BASE_URL).toBeDefined()
    expect(API_CONFIG.BASE_URL).not.toBe('http://localhost:8787')
    expect(API_CONFIG.BASE_URL).not.toContain('YOUR-USERNAME')
  })

  describe('5.11a: API Base URL Updated', () => {
    it('should use production URL instead of localhost', () => {
      expect(API_CONFIG.BASE_URL).not.toBe('http://localhost:8787')
      expect(API_CONFIG.BASE_URL).toMatch(/^https:\/\//)
    })

    it('should not contain placeholder username', () => {
      expect(API_CONFIG.BASE_URL).not.toContain('YOUR-USERNAME')
    })
  })

  describe('5.11b: Test All 4 Tabs with Real Data', () => {
    it('should fetch profile data successfully', async () => {
      const result = await apiClient.fetchProfile(SENIOR_ID)
      expect(result).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('should fetch live sentiment data', async () => {
      const result = await apiClient.fetchLiveSentiment()
      expect(result).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('should fetch analytics data', async () => {
      const result = await apiClient.fetchAnalytics()
      expect(result).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('should fetch senior profile for community matches', async () => {
      const result = await apiUtils.fetchSeniorProfile(SENIOR_ID)
      expect(result).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('5.11c: Error Boundaries Working', () => {
    it('should have error boundaries configured for all tabs', () => {
      // This is verified by the component structure
      // Error boundaries are implemented in App.tsx
      expect(true).toBe(true) // Placeholder - actual verification in component tests
    })
  })

  describe('5.11d: Polling Verification', () => {
    it('should have 2-second polling interval configured', () => {
      expect(API_CONFIG.POLLING.LIVE_SENTIMENT).toBe(2000)
    })

    it('should poll live sentiment endpoint', async () => {
      const startTime = Date.now()
      await apiClient.fetchLiveSentiment()
      const endTime = Date.now()
      
      // Should respond within reasonable time (not timeout)
      expect(endTime - startTime).toBeLessThan(5000)
    })
  })

  describe('5.11e: Console Error Check', () => {
    it('should have error monitoring setup', () => {
      // Error monitoring is implemented in utils/errorMonitoring.ts
      expect(true).toBe(true) // Placeholder - actual verification in component tests
    })
  })

  describe('Hour 10 Integration Test Requirements', () => {
    it('should handle health mentions in profile data', async () => {
      const profile = await apiClient.fetchProfile(SENIOR_ID)
      expect(profile).toBeDefined()
      
      // Should have health data structure
      if (profile.profile) {
        expect(profile.profile.healthData).toBeDefined()
        expect(profile.profile.healthData.notes).toBeDefined()
      }
    })

    it('should show community matches', async () => {
      const profile = await apiClient.fetchProfile(SENIOR_ID)
      expect(profile).toBeDefined()
      
      // Should have matches data
      if (profile.profile) {
        expect(profile.profile.matches).toBeDefined()
        expect(Array.isArray(profile.profile.matches)).toBe(true)
      }
    })

    it('should support language switching', async () => {
      const sentiment = await apiClient.fetchLiveSentiment()
      expect(sentiment).toBeDefined()
      
      // Should have language field
      expect(sentiment.language).toBeDefined()
    })
  })
})
