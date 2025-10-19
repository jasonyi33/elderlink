/**
 * ElderLink Dashboard Main App
 * Enhanced with lazy loading and performance monitoring
 */

import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import ErrorBoundary from './components/ErrorBoundary'
import { setupGlobalErrorHandling } from './utils/errorMonitoring'
import { Task511ActualVerification } from './tests/task511ActualVerification'
import { Toaster } from 'react-hot-toast'
import Icons from './components/ui/Icons'
import { CardSkeleton } from './components/ui/LoadingSkeleton'
import './utils/consoleErrorCheck' // Auto-start console error monitoring
import './styles/design-system.css' // Design system styles

// Lazy load all tab components for optimal performance
const LiveCallViewEnhanced = lazy(() => import('./components/LiveCallViewEnhanced'))
const SeniorProfileView = lazy(() => import('./components/SeniorProfileView'))
const CommunityView = lazy(() => import('./components/CommunityView'))
const AnalyticsView = lazy(() => import('./components/AnalyticsView'))

// Loading skeleton component for lazy loading with shimmer effect
function TabSkeleton() {
  return (
    <div className="space-y-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

// Performance monitor component
function PerformanceOverlay({ show }: { show: boolean }) {
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(0)

  useEffect(() => {
    if (!show) return

    let frameCount = 0
    let lastTime = performance.now()

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        setFps(currentFps)

        // Get memory usage if available
        const memoryUsage = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0
        setMemory(memoryUsage)

        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measurePerformance)
    }

    const rafId = requestAnimationFrame(measurePerformance)
    return () => cancelAnimationFrame(rafId)
  }, [show])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-2">
        <div>FPS: <span className={fps < 30 ? 'text-yellow-400' : 'text-green-400'}>{fps}</span></div>
        <div>Memory: {memory}MB</div>
      </div>
      {fps < 30 && (
        <div className="mt-2 text-yellow-400">⚠️ Performance degraded</div>
      )}
    </div>
  )
}

function App() {
  const [performanceMode, setPerformanceMode] = useState(false)
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false)

  useEffect(() => {
    // Initialize global error handling
    setupGlobalErrorHandling()

    // Run ACTUAL verification of Task 5.11
    Task511ActualVerification.verifyTask511()

    // Check URL params for performance mode
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('performance') === 'true') {
      setPerformanceMode(true)
    }
    if (urlParams.get('debug') === 'true') {
      setShowPerformanceOverlay(true)
    }

    // Monitor frame rate and enable performance mode if needed
    let frameCount = 0
    let lastTime = performance.now()
    let lowFpsCount = 0

    const checkPerformance = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        // Track low FPS occurrences
        if (fps < 30) {
          lowFpsCount++
          if (lowFpsCount >= 3) {
            // Enable performance mode after 3 seconds of low FPS
            setPerformanceMode(true)
            console.warn('Auto-enabled performance mode due to low FPS:', fps)
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1)
        }

        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(checkPerformance)
    }

    const rafId = requestAnimationFrame(checkPerformance)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <>
      {/* Toast notifications */}
      <Toaster position="bottom-right" />

      {/* Performance overlay */}
      <PerformanceOverlay show={showPerformanceOverlay} />

      {/* Main app */}
      <div className={`min-h-screen bg-gradient-to-br from-background-alt to-white ${performanceMode ? 'performance-mode' : ''}`}>
        {/* Professional Medical Header */}
        <header style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)',
          borderBottom: '1px solid rgba(29, 53, 87, 0.08)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Icons.heartPulse size={32} style={{color: '#457B9D'}} />
            <div>
              <h1 style={{fontSize: '24px', fontWeight: 700, color: '#457B9D', margin: 0, letterSpacing: '-0.5px'}}>
                ElderLink
              </h1>
              <p style={{fontSize: '12px', color: '#6C757D', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0}}>
                Holistic Senior Care Platform
              </p>
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(69, 123, 157, 0.1)', borderRadius: '8px'}}>
              <Icons.hospital size={16} style={{color: '#457B9D'}} />
              <span style={{fontSize: '13px', fontWeight: 600, color: '#1D3557'}}>Seattle Medical Network</span>
            </div>
            <div style={{fontSize: '13px', color: '#6C757D', fontWeight: 500}}>
              {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
            </div>
          </div>
        </header>

        <Tab.Group>
          {/* Premium tab navigation with professional icons */}
          <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <Tab.List className="flex space-x-8">
                <Tab className={({ selected }) =>
                  `py-3 px-1 border-b-2 transition-all duration-300 font-medium ${
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-primary/30'
                  }`
                }>
                  <span className="flex items-center gap-2">
                    <Icons.phone size={20} /> Live Monitoring
                    <span className="live-indicator"></span>
                  </span>
                </Tab>
                <Tab className={({ selected }) =>
                  `py-3 px-1 border-b-2 transition-all duration-300 font-medium ${
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-primary/30'
                  }`
                }>
                  <span className="flex items-center gap-2">
                    <Icons.userCircle size={20} /> Patient Profile
                  </span>
                </Tab>
                <Tab className={({ selected }) =>
                  `py-3 px-1 border-b-2 transition-all duration-300 font-medium ${
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-primary/30'
                  }`
                }>
                  <span className="flex items-center gap-2">
                    <Icons.users size={20} /> Community Care
                  </span>
                </Tab>
                <Tab className={({ selected }) =>
                  `py-3 px-1 border-b-2 transition-all duration-300 font-medium ${
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-primary/30'
                  }`
                }>
                  <span className="flex items-center gap-2">
                    <Icons.chart size={20} /> Clinical Analytics
                  </span>
                </Tab>
              </Tab.List>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6 transition-all duration-300">
            <Tab.Panels>
              {/* Live Call Tab */}
              <Tab.Panel>
                <ErrorBoundary componentName="LiveCallView">
                  <Suspense fallback={<TabSkeleton />}>
                    <LiveCallViewEnhanced />
                  </Suspense>
                </ErrorBoundary>
              </Tab.Panel>

              {/* Senior Profile Tab */}
              <Tab.Panel>
                <ErrorBoundary componentName="SeniorProfileView">
                  <Suspense fallback={<TabSkeleton />}>
                    <SeniorProfileView />
                  </Suspense>
                </ErrorBoundary>
              </Tab.Panel>

              {/* Community Tab */}
              <Tab.Panel>
                <ErrorBoundary componentName="CommunityView">
                  <Suspense fallback={<TabSkeleton />}>
                    <CommunityView />
                  </Suspense>
                </ErrorBoundary>
              </Tab.Panel>

              {/* Analytics Tab */}
              <Tab.Panel>
                <ErrorBoundary componentName="AnalyticsView">
                  <Suspense fallback={<TabSkeleton />}>
                    <AnalyticsView />
                  </Suspense>
                </ErrorBoundary>
              </Tab.Panel>
            </Tab.Panels>
          </main>
        </Tab.Group>

        {/* Performance mode indicator */}
        {performanceMode && (
          <div className="fixed bottom-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
            🚀 Performance mode enabled
          </div>
        )}
      </div>
    </>
  )
}

export default App