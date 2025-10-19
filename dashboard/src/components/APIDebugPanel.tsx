import React, { useState, useEffect } from 'react'
import { API_CONFIG } from '../config/api'

export default function APIDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    // Gather debug info on mount
    const info = {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API,
      DEV_MODE: import.meta.env.DEV,
      MODE: import.meta.env.MODE,
      BASE_URL_from_config: API_CONFIG.BASE_URL,
      PRODUCTION_URL: API_CONFIG.PRODUCTION_URL,
      DEVELOPMENT_URL: API_CONFIG.DEVELOPMENT_URL,
    }
    setDebugInfo(info)
  }, [])

  const testDashboardAPI = async () => {
    setTestResult('Testing...')
    try {
      const url = `${API_CONFIG.BASE_URL}/api/dashboard/mrs-chen`
      console.log('[DEBUG] Fetching from:', url)

      const response = await fetch(url)
      console.log('[DEBUG] Response status:', response.status)

      const data = await response.json()
      console.log('[DEBUG] Response data:', data)

      if (data.profile) {
        setTestResult(`✅ SUCCESS! Profile: ${data.profile.name}, Wellness: ${data.profile.wellnessMetrics.holisticScore}`)
      } else {
        setTestResult(`❌ No profile in response. Got: ${JSON.stringify(Object.keys(data))}`)
      }
    } catch (error: any) {
      setTestResult(`❌ ERROR: ${error.message}`)
      console.error('[DEBUG] Error:', error)
    }
  }

  const testHealthCheck = async () => {
    setTestResult('Testing health...')
    try {
      const url = `${API_CONFIG.BASE_URL}/api/health`
      const response = await fetch(url)
      const data = await response.json()
      setTestResult(`✅ Health check: ${data.status}`)
    } catch (error: any) {
      setTestResult(`❌ Health check failed: ${error.message}`)
    }
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-xs font-mono">
      <h3 className="text-lg font-bold mb-2">🔧 API Debug Panel</h3>

      <div className="mb-4">
        <h4 className="font-bold mb-1">Environment:</h4>
        <pre className="bg-gray-900 p-2 rounded overflow-x-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={testDashboardAPI}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
        >
          Test Dashboard API
        </button>
        <button
          onClick={testHealthCheck}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
        >
          Test Health Check
        </button>
      </div>

      {testResult && (
        <div className={`p-2 rounded ${testResult.includes('✅') ? 'bg-green-900' : 'bg-red-900'}`}>
          {testResult}
        </div>
      )}
    </div>
  )
}
