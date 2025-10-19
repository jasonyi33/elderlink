// Error monitoring utilities for dashboard
export class ErrorMonitor {
  private static errors: Error[] = []
  private static maxErrors = 100

  static logError(error: Error, context?: string) {
    const errorWithContext = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    this.errors.push(errorWithContext as Error)
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }
    
    console.error('Dashboard Error:', errorWithContext)
  }

  static getErrors(): Error[] {
    return [...this.errors]
  }

  static clearErrors(): void {
    this.errors = []
  }

  static getErrorCount(): number {
    return this.errors.length
  }

  static hasErrors(): boolean {
    return this.errors.length > 0
  }

  static getRecentErrors(count: number = 10): Error[] {
    return this.errors.slice(-count)
  }
}

// Global error handler
export function setupGlobalErrorHandling() {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorMonitor.logError(new Error(event.reason), 'unhandled-promise-rejection')
  })

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    ErrorMonitor.logError(event.error || new Error(event.message), 'uncaught-error')
  })

  // Monitor console errors
  const originalConsoleError = console.error
  console.error = (...args) => {
    ErrorMonitor.logError(new Error(args.join(' ')), 'console-error')
    originalConsoleError.apply(console, args)
  }
}

// React error boundary integration
export function createErrorHandler(componentName: string) {
  return (error: Error, errorInfo: any) => {
    ErrorMonitor.logError(error, `react-error-boundary-${componentName}`)
  }
}
