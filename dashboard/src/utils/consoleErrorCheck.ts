// Console error verification for Task 5.11
import { ErrorMonitor } from './errorMonitoring'

export class ConsoleErrorChecker {
  private static originalConsoleError: typeof console.error
  private static originalConsoleWarn: typeof console.warn
  private static errorCount = 0
  private static warningCount = 0

  static startMonitoring() {
    // Store original console methods
    this.originalConsoleError = console.error
    this.originalConsoleWarn = console.warn

    // Override console.error
    console.error = (...args) => {
      this.errorCount++
      this.originalConsoleError.apply(console, args)
    }

    // Override console.warn
    console.warn = (...args) => {
      this.warningCount++
      this.originalConsoleWarn.apply(console, args)
    }
  }

  static stopMonitoring() {
    // Restore original console methods
    if (this.originalConsoleError) {
      console.error = this.originalConsoleError
    }
    if (this.originalConsoleWarn) {
      console.warn = this.originalConsoleWarn
    }
  }

  static getErrorCount(): number {
    return this.errorCount
  }

  static getWarningCount(): number {
    return this.warningCount
  }

  static resetCounts() {
    this.errorCount = 0
    this.warningCount = 0
  }

  static verifyNoErrors(): boolean {
    const errors = this.getErrorCount()
    const warnings = this.getWarningCount()
    
    console.log(`Console Error Check: ${errors} errors, ${warnings} warnings`)
    
    // Task 5.11e requires 0 console errors
    return errors === 0
  }

  static getDetailedReport(): {
    errors: number
    warnings: number
    errorBoundaryErrors: number
    passed: boolean
  } {
    const errors = this.getErrorCount()
    const warnings = this.getWarningCount()
    const errorBoundaryErrors = ErrorMonitor.getErrorCount()
    
    return {
      errors,
      warnings,
      errorBoundaryErrors,
      passed: errors === 0 && errorBoundaryErrors === 0
    }
  }
}

// Auto-start monitoring when imported
ConsoleErrorChecker.startMonitoring()
