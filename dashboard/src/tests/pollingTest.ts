// Polling verification for Task 5.11d - Verify polling works (2-second interval)
import { apiClient } from '../services/api-client'
import { API_CONFIG } from '../config/api'

export class PollingTester {
  private static pollCount = 0
  private static pollTimes: number[] = []
  private static pollResults: any[] = []

  static async testPollingInterval(): Promise<{
    success: boolean
    averageInterval: number
    pollCount: number
    errors: string[]
  }> {
    const errors: string[] = []
    this.pollCount = 0
    this.pollTimes = []
    this.pollResults = []

    console.log('🔄 Testing 2-second polling interval...')
    console.log(`Expected interval: ${API_CONFIG.POLLING.LIVE_SENTIMENT}ms`)

    return new Promise((resolve) => {
      const startTime = Date.now()
      let lastPollTime = startTime

      const pollInterval = setInterval(async () => {
        try {
          const currentTime = Date.now()
          const actualInterval = currentTime - lastPollTime
          
          this.pollTimes.push(actualInterval)
          this.pollCount++

          console.log(`Poll ${this.pollCount}: ${actualInterval}ms interval`)

          // Test the actual API call
          const result = await apiClient.fetchLiveSentiment()
          this.pollResults.push({
            timestamp: currentTime,
            result,
            interval: actualInterval
          })

          lastPollTime = currentTime

          // Stop after 5 polls (10 seconds)
          if (this.pollCount >= 5) {
            clearInterval(pollInterval)
            
            const averageInterval = this.pollTimes.reduce((sum, time) => sum + time, 0) / this.pollTimes.length
            const expectedInterval = API_CONFIG.POLLING.LIVE_SENTIMENT
            const tolerance = 500 // 500ms tolerance
            
            const intervalCorrect = Math.abs(averageInterval - expectedInterval) <= tolerance
            const allPollsSuccessful = this.pollResults.every(poll => !poll.result.error)

            if (!intervalCorrect) {
              errors.push(`Average interval ${averageInterval}ms doesn't match expected ${expectedInterval}ms`)
            }

            if (!allPollsSuccessful) {
              errors.push('Some polling calls failed')
            }

            console.log('📊 Polling Test Results:')
            console.log(`Polls completed: ${this.pollCount}`)
            console.log(`Average interval: ${averageInterval.toFixed(2)}ms`)
            console.log(`Expected interval: ${expectedInterval}ms`)
            console.log(`Interval accuracy: ${intervalCorrect ? '✅' : '❌'}`)
            console.log(`All polls successful: ${allPollsSuccessful ? '✅' : '❌'}`)

            resolve({
              success: intervalCorrect && allPollsSuccessful,
              averageInterval,
              pollCount: this.pollCount,
              errors
            })
          }
        } catch (error) {
          errors.push(`Polling error: ${error}`)
          console.log('❌ Polling error:', error)
        }
      }, API_CONFIG.POLLING.LIVE_SENTIMENT)
    })
  }

  static getPollingStats() {
    return {
      pollCount: this.pollCount,
      pollTimes: this.pollTimes,
      pollResults: this.pollResults
    }
  }
}
