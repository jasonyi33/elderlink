// Production URL verification for Task 5.11
import { API_CONFIG } from '../config/api'

export class ProductionUrlChecker {
  static verifyProductionUrl(): {
    isProduction: boolean
    hasPlaceholder: boolean
    isLocalhost: boolean
    isValid: boolean
    message: string
  } {
    const url = API_CONFIG.BASE_URL
    
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1')
    const hasPlaceholder = url.includes('YOUR-USERNAME')
    const isProduction = url.startsWith('https://') && !isLocalhost && !hasPlaceholder
    const isValid = isProduction || (!isLocalhost && !hasPlaceholder)
    
    let message = ''
    if (isLocalhost) {
      message = '❌ Still using localhost - not switched to production'
    } else if (hasPlaceholder) {
      message = '❌ Still using placeholder URL - not updated to real Worker URL'
    } else if (isProduction) {
      message = '✅ Using production URL'
    } else {
      message = '⚠️ URL format unclear'
    }
    
    return {
      isProduction,
      hasPlaceholder,
      isLocalhost,
      isValid,
      message
    }
  }
  
  static getRequiredAction(): string {
    const check = this.verifyProductionUrl()
    
    if (check.isProduction) {
      return 'No action needed - production URL is configured'
    }
    
    if (check.hasPlaceholder) {
      return 'Update PRODUCTION_URL in src/config/api.ts with actual Worker URL'
    }
    
    if (check.isLocalhost) {
      return 'Set VITE_API_BASE_URL environment variable to production URL'
    }
    
    return 'Check API configuration'
  }
}
