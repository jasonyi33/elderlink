// Console error verification for Task 5.11e - Check console for errors (should be 0)
import { ConsoleErrorChecker } from '../utils/consoleErrorCheck'
import { ErrorMonitor } from '../utils/errorMonitoring'

export class ConsoleErrorTester {
  static async testConsoleErrors(): Promise<{
    success: boolean
    errorCount: number
    warningCount: number
    errorBoundaryErrors: number
    details: any
  }> {
    console.log('🔍 Testing console errors (should be 0)...')

    // Reset counters
    ConsoleErrorChecker.resetCounts()
    ErrorMonitor.clearErrors()

    // Wait a bit for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Get detailed report
    const errorReport = ConsoleErrorChecker.getDetailedReport()
    
    console.log('📊 Console Error Test Results:')
    console.log(`Console errors: ${errorReport.errors}`)
    console.log(`Console warnings: ${errorReport.warnings}`)
    console.log(`Error boundary errors: ${errorReport.errorBoundaryErrors}`)
    console.log(`Test result: ${errorReport.passed ? '✅ PASS' : '❌ FAIL'}`)

    if (!errorReport.passed) {
      console.log('🔧 Error Details:')
      if (errorReport.errors > 0) {
        console.log(`- ${errorReport.errors} console errors found`)
      }
      if (errorReport.errorBoundaryErrors > 0) {
        console.log(`- ${errorReport.errorBoundaryErrors} error boundary errors found`)
      }
    }

    return {
      success: errorReport.passed,
      errorCount: errorReport.errors,
      warningCount: errorReport.warnings,
      errorBoundaryErrors: errorReport.errorBoundaryErrors,
      details: errorReport
    }
  }

  static getErrorDetails() {
    return {
      consoleErrors: ConsoleErrorChecker.getErrorCount(),
      consoleWarnings: ConsoleErrorChecker.getWarningCount(),
      errorBoundaryErrors: ErrorMonitor.getErrorCount(),
      recentErrors: ErrorMonitor.getRecentErrors(5)
    }
  }
}
