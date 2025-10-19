import React, { useEffect } from 'react'
import { Tab } from '@headlessui/react'
import LiveCallView from './components/LiveCallView'
import SeniorProfileView from './components/SeniorProfileView'
import CommunityView from './components/CommunityView'
import AnalyticsView from './components/AnalyticsView'
import ErrorBoundary from './components/ErrorBoundary'
import { setupGlobalErrorHandling } from './utils/errorMonitoring'
import { Task511Verification } from './utils/task511Verification'
import './utils/consoleErrorCheck' // Auto-start console error monitoring

function App() {
  useEffect(() => {
    // Initialize global error handling
    setupGlobalErrorHandling()
    
    // Verify Task 5.11 requirements
    Task511Verification.verifyAllRequirements()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Tab.Group>
        {/* Tabs only, no header */}
        <nav className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <Tab.List className="flex space-x-8">
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-colors ${
                  selected
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`
              }>
                📞 Live Call 🔴
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-colors ${
                  selected
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`
              }>
                👤 Senior Profile
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-colors ${
                  selected
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`
              }>
                👥 Community
              </Tab>
              <Tab className={({ selected }) =>
                `py-3 px-1 border-b-2 transition-colors ${
                  selected
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`
              }>
                📊 Analytics
              </Tab>
            </Tab.List>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6 transition-all duration-300">
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
