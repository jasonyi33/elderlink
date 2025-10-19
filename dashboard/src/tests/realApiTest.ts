// Real API testing for Task 5.11b - Test all 4 tabs with real data
import { apiClient, apiUtils } from '../services/api-client'
import { API_CONFIG } from '../config/api'

export class RealApiTester {
  private static testResults: {
    healthCheck: boolean
    profile: boolean
    sentiment: boolean
    analytics: boolean
    seniorProfile: boolean
    healthData: boolean
  } = {
    healthCheck: false,
    profile: false,
    sentiment: false,
    analytics: false,
    seniorProfile: false,
    healthData: false
  }

  static async testAllEndpoints(): Promise<{
    success: boolean
    results: typeof this.testResults
    errors: string[]
  }> {
    const errors: string[] = []
    
    console.log('🧪 Testing all 4 tabs with real API data...')
    console.log(`API Base URL: ${API_CONFIG.BASE_URL}`)

    // Test 1: Health Check
    try {
      const healthResult = await apiUtils.healthCheck()
      this.testResults.healthCheck = !healthResult.error
      if (healthResult.error) {
        errors.push(`Health check failed: ${healthResult.error}`)
      } else {
        console.log('✅ Health check passed')
      }
    } catch (error) {
      errors.push(`Health check error: ${error}`)
      console.log('❌ Health check failed:', error)
    }

    // Test 2: Profile Data (Senior Profile Tab)
    try {
      const profileResult = await apiClient.fetchProfile('mrs-chen')
      this.testResults.profile = !profileResult.error
      if (profileResult.error) {
        errors.push(`Profile fetch failed: ${profileResult.error}`)
      } else {
        console.log('✅ Profile data fetched successfully')
      }
    } catch (error) {
      errors.push(`Profile fetch error: ${error}`)
      console.log('❌ Profile fetch failed:', error)
    }

    // Test 3: Live Sentiment (Live Call Tab)
    try {
      const sentimentResult = await apiClient.fetchLiveSentiment()
      this.testResults.sentiment = !sentimentResult.error
      if (sentimentResult.error) {
        errors.push(`Live sentiment failed: ${sentimentResult.error}`)
      } else {
        console.log('✅ Live sentiment fetched successfully')
      }
    } catch (error) {
      errors.push(`Live sentiment error: ${error}`)
      console.log('❌ Live sentiment failed:', error)
    }

    // Test 4: Analytics Data (Analytics Tab)
    try {
      const analyticsResult = await apiClient.fetchAnalytics()
      this.testResults.analytics = !analyticsResult.error
      if (analyticsResult.error) {
        errors.push(`Analytics fetch failed: ${analyticsResult.error}`)
      } else {
        console.log('✅ Analytics data fetched successfully')
      }
    } catch (error) {
      errors.push(`Analytics fetch error: ${error}`)
      console.log('❌ Analytics fetch failed:', error)
    }

    // Test 5: Senior Profile for Community (Community Tab)
    try {
      const seniorResult = await apiUtils.fetchSeniorProfile('mrs-chen')
      this.testResults.seniorProfile = !seniorResult.error
      if (seniorResult.error) {
        errors.push(`Senior profile fetch failed: ${seniorResult.error}`)
      } else {
        console.log('✅ Senior profile fetched successfully')
      }
    } catch (error) {
      errors.push(`Senior profile fetch error: ${error}`)
      console.log('❌ Senior profile fetch failed:', error)
    }

    // Test 6: Health Data (Health Timeline)
    try {
      const healthDataResult = await apiUtils.fetchHealthData('mrs-chen')
      this.testResults.healthData = !healthDataResult.error
      if (healthDataResult.error) {
        errors.push(`Health data fetch failed: ${healthDataResult.error}`)
      } else {
        console.log('✅ Health data fetched successfully')
      }
    } catch (error) {
      errors.push(`Health data fetch error: ${error}`)
      console.log('❌ Health data fetch failed:', error)
    }

    const success = Object.values(this.testResults).every(result => result)
    
    console.log('📊 Test Results Summary:')
    console.log(`Health Check: ${this.testResults.healthCheck ? '✅' : '❌'}`)
    console.log(`Profile Data: ${this.testResults.profile ? '✅' : '❌'}`)
    console.log(`Live Sentiment: ${this.testResults.sentiment ? '✅' : '❌'}`)
    console.log(`Analytics Data: ${this.testResults.analytics ? '✅' : '❌'}`)
    console.log(`Senior Profile: ${this.testResults.seniorProfile ? '✅' : '❌'}`)
    console.log(`Health Data: ${this.testResults.healthData ? '✅' : '❌'}`)
    console.log(`Overall: ${success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)

    if (!success) {
      console.log('🔧 Troubleshooting:')
      console.log('1. Ensure Worker is deployed: wrangler deploy --env dev')
      console.log('2. Check Worker URL is accessible')
      console.log('3. Verify API endpoints are implemented')
      console.log('4. Check CORS configuration')
    }

    return {
      success,
      results: this.testResults,
      errors
    }
  }

  static getTestResults() {
    return this.testResults
  }

  static resetResults() {
    this.testResults = {
      healthCheck: false,
      profile: false,
      sentiment: false,
      analytics: false,
      seniorProfile: false,
      healthData: false
    }
  }
}
