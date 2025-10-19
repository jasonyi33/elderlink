import React, { useEffect } from 'react'
import { Tab } from '@headlessui/react'
import LiveCallView from './components/LiveCallView'
import SeniorProfileView from './components/SeniorProfileView'
import CommunityView from './components/CommunityView'
import AnalyticsView from './components/AnalyticsView'
import ErrorBoundary from './components/ErrorBoundary'
import { setupGlobalErrorHandling } from './utils/errorMonitoring'
import { Task511ActualVerification } from './tests/task511ActualVerification'
import './utils/consoleErrorCheck' // Auto-start console error monitoring
import './styles/design-system.css' // Design system styles

function App() {
  useEffect(() => {
    // Initialize global error handling
    setupGlobalErrorHandling()
    
    // Run ACTUAL verification of Task 5.11
    Task511ActualVerification.verifyTask511()
  }, [])

  return (
    <div className="min-h-screen bg-background-alt projector-optimized">
      <Tab.Group>
        {/* Tabs only, no header */}
        <nav className="bg-background border-b sticky top-0 z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <Tab.List className="flex space-x-8">
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-all duration-300 ${
                  selected
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-primary'
                }`
              }>
                📞 Live Call 🔴
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-all duration-300 ${
                  selected
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-primary'
                }`
              }>
                👤 Senior Profile
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-all duration-300 ${
                  selected
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-primary'
                }`
              }>
                👥 Community
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-all duration-300 ${
                  selected
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-primary'
                }`
              }>
                📊 Analytics
              </Tab>
            </Tab.List>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6 transition-all duration-300 projector-optimized">
          <Tab.Panels>
            <Tab.Panel>
              <ErrorBoundary componentName="LiveCallView">
                <LiveCallView />
              </ErrorBoundary>
            </Tab.Panel>
            <Tab.Panel>
              <ErrorBoundary componentName="SeniorProfileView">
                <SeniorProfileView />
              </ErrorBoundary>
            </Tab.Panel>
            <Tab.Panel>
              <ErrorBoundary componentName="CommunityView">
                <CommunityView />
              </ErrorBoundary>
            </Tab.Panel>
            <Tab.Panel>
              <ErrorBoundary componentName="AnalyticsView">
                <AnalyticsView />
              </ErrorBoundary>
            </Tab.Panel>
          </Tab.Panels>
        </main>
      </Tab.Group>
    </div>
  )
}

export default App
