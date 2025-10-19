import React, { useState, useEffect } from 'react'
import type { SeniorProfile, Analytics } from '../types'

const API_BASE = process.env.REACT_APP_API_BASE || ''

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`)
      const data = await res.json()
      setAnalytics(data.analytics)
      setProfile(data.profile)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!analytics || !profile) return <div>Analytics not available</div>

  // Calculate individual scores
  const mentalScore = Math.round((profile.wellnessMetrics.mentalHealth.averageSentiment + 1) * 50)
  const physicalScore = 75 // Simplified for demo
  const socialScore = Math.min(100, profile.matches.length * 10 + profile.groups.length * 20)

  // Calculate holistic score (mental 40% + physical 30% + social 30%)
  const holisticScore = Math.round(
    (mentalScore * 0.4) + (physicalScore * 0.3) + (socialScore * 0.3)
  )

  // Generate word cloud data from conversations
  const wordCloudData = generateWordCloud(profile.conversations)

  return (
    <div data-testid="analytics-view" className="space-y-6">
      {/* Holistic Wellness Score */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Holistic Wellness Score
        </h3>

        {/* Big Score Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {holisticScore}/100
          </div>
          <div className="w-64 h-64 mx-auto">
            {/* Radial progress indicator - simplified as percentage bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${holisticScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Breakdown:</h4>

          {/* Mental Health */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Mental Health</span>
              <span className="text-blue-600 font-bold">
                {profile.wellnessMetrics.mentalHealth.trend === 'improving' ? '↑' : 
                 profile.wellnessMetrics.mentalHealth.trend === 'declining' ? '↓' : '→'} {mentalScore}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {analytics.totalConversations} conversations • Avg sentiment: {analytics.averageSentiment}
            </p>
          </div>

          {/* Physical Health */}
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Physical Health</span>
              <span className="text-green-600 font-bold">{analytics.totalHealthNotes} health notes</span>
            </div>
            <p className="text-sm text-gray-600">
              {profile.healthData.notes.filter((n: any) => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(n.timestamp) > weekAgo
              }).length} added this week
            </p>
          </div>

          {/* Social Health */}
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Social Health</span>
              <span className="text-purple-600 font-bold">
                {analytics.totalMatches} matches, {profile.groups.length} groups
              </span>
            </div>
            <p className="text-sm text-gray-600">Community growing</p>
          </div>
        </div>

        {/* 30-Day Trend Graph */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">30-Day Wellness Trend</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            {/* Simplified - would use real chart library */}
            <p className="text-gray-500">[Combined trend graph showing all three dimensions over time]</p>
          </div>
        </div>
      </div>

      {/* Call Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Call Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.totalConversations}</div>
            <div className="text-sm text-gray-600">Total Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8.5 min</div>
            <div className="text-sm text-gray-600">Average Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2-4pm</div>
            <div className="text-sm text-gray-600">Peak Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">60/40</div>
            <div className="text-sm text-gray-600">English/Mandarin</div>
          </div>
        </div>
      </div>

      {/* Topic Word Cloud */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Topic Word Cloud</h3>
        <div className="flex flex-wrap gap-2">
          {wordCloudData.map((word, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              style={{ fontSize: `${Math.max(12, word.frequency * 2)}px` }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          value={analytics.totalConversations}
          label="Total Calls"
          icon="📞"
          color="blue"
        />
        <MetricCard
          value={`+${Math.round(mentalScore)}%`}
          label="Mood"
          icon="😊"
          color="green"
        />
        <MetricCard
          value={analytics.totalHealthNotes}
          label="Health Notes"
          icon="🩺"
          color="red"
        />
        <MetricCard
          value={analytics.totalMatches}
          label="Matches"
          icon="👥"
          color="purple"
        />
      </div>
    </div>
  )
}

function MetricCard({ value, label, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    red: 'bg-red-50 text-red-900 border-red-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200'
  }

  return (
    <div className={`${colorClasses[color]} rounded-lg border p-4 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  )
}

function generateWordCloud(conversations: any[]): Array<{text: string, frequency: number}> {
  const wordCount: {[key: string]: number} = {}
  
  conversations.forEach(conv => {
    if (conv.keyTopics) {
      conv.keyTopics.forEach((topic: string) => {
        const words = topic.toLowerCase().split(/\s+/)
        words.forEach(word => {
          if (word.length > 2) {
            wordCount[word] = (wordCount[word] || 0) + 1
          }
        })
      })
    }
  })

  return Object.entries(wordCount)
    .map(([text, frequency]) => ({ text, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20) // Top 20 words
}
