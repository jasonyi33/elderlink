import React, { useState, useEffect } from 'react'
import type { SeniorProfile, Analytics } from '../types'
import { apiClient } from '../services/api-client'
import WordCloud from './WordCloud'

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const data = await apiClient.fetchProfile('mrs-chen')
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

  // Use specific scores as per TASK_LIST requirements
  const mentalScore = 82
  const physicalScore = 75
  const socialScore = 85
  const holisticScore = 78 // As per PRD

  // Generate word cloud data from conversations
  const wordCloudData = generateWordCloud(profile.conversations)

  return (
    <div data-testid="analytics-view" className="space-y-6 projector-optimized">
      {/* Holistic Wellness Score */}
      <div className="card projector-spacing">
        <h3 className="text-2xl projector-text-2xl font-semibold card-section text-center text-primary">
          Holistic Wellness Score
        </h3>

        {/* Big Score Display */}
        <div className="text-center card-section">
          <div className="text-6xl projector-text-3xl font-bold text-primary mb-2">
            {holisticScore}/100
          </div>
          <div className="w-64 h-64 mx-auto">
            {/* Radial progress indicator - simplified as percentage bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-neutral-dark">
                <div
                  style={{ width: `${holisticScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-success transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">Breakdown:</h4>

          {/* Mental Health */}
          <div className="border-l-4 border-primary pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary">Mental Health</span>
              <span className="text-primary font-bold">↑ 42%</span>
            </div>
            <p className="text-sm text-text-muted">
              {analytics.totalConversations} conversations
            </p>
          </div>

          {/* Physical Health */}
          <div className="border-l-4 border-success pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary">Physical</span>
              <span className="text-success font-bold">{analytics.totalHealthNotes} health notes</span>
            </div>
            <p className="text-sm text-text-muted">
              {profile.healthData.notes.filter((n: any) => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(n.timestamp) > weekAgo
              }).length} added this week
            </p>
          </div>

          {/* Social Health */}
          <div className="border-l-4 border-secondary pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary">Social</span>
              <span className="text-secondary font-bold">
                {analytics.totalMatches} matches, {profile.groups.length} groups
              </span>
            </div>
            <p className="text-sm text-text-muted">Community growing</p>
          </div>
        </div>

        {/* 30-Day Trend Graph */}
        <div className="mt-8">
          <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">30-Day Wellness Trend</h4>
          <div className="h-64 bg-neutral rounded-lg relative flex items-center justify-center">
            {/* Recharts implementation would go here - using placeholder for now */}
            <div className="text-center">
              <p className="text-text-muted mb-4">[Recharts line chart with 3 lines: mental, physical, social]</p>
              <div className="text-sm text-text-muted">
                <p>Mental Health: 82/100 (↑ improving)</p>
                <p>Physical Health: 75/100 (→ stable)</p>
                <p>Social Health: 85/100 (↑ improving)</p>
              </div>
            </div>
            
            {/* Annotations for significant events */}
            <div className="absolute top-4 left-4 bg-warning-light border border-warning rounded px-2 py-1 text-xs">
              <div className="font-semibold text-warning-dark">Family visit</div>
              <div className="text-warning-dark">Jan 10</div>
            </div>
            <div className="absolute top-4 right-4 bg-success-light border border-success rounded px-2 py-1 text-xs">
              <div className="font-semibold text-success-dark">Started medication</div>
              <div className="text-success-dark">Jan 15</div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-light border border-primary rounded px-2 py-1 text-xs">
              <div className="font-semibold text-primary-dark">Community match</div>
              <div className="text-primary-dark">Jan 20</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Analytics */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Call Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl projector-text-2xl font-bold text-primary">{analytics.totalConversations}</div>
            <div className="text-sm text-text-muted">Total Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl projector-text-2xl font-bold text-success">8.5 min</div>
            <div className="text-sm text-text-muted">Average Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl projector-text-2xl font-bold text-secondary">2-4pm</div>
            <div className="text-sm text-text-muted">Peak Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl projector-text-2xl font-bold text-warning">60/40</div>
            <div className="text-sm text-text-muted">English/Mandarin</div>
          </div>
        </div>
        
        {/* Peak Hours Heatmap */}
        <div className="mt-6">
          <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">Peak Hours Heatmap</h4>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className={`h-8 rounded text-xs flex items-center justify-center transition-all duration-300 ${
                  hour >= 14 && hour <= 16 
                    ? 'bg-secondary text-white' 
                    : hour >= 10 && hour <= 18 
                    ? 'bg-warning text-text' 
                    : 'bg-neutral-dark text-text-muted'
                }`}
                title={`${hour}:00`}
              >
                {hour}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
            <span>11pm</span>
          </div>
        </div>

        {/* Language Distribution Pie Chart */}
        <div className="mt-6">
          <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">Language Distribution</h4>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-8 border-primary" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-success" style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
              <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">60/40</div>
                  <div className="text-xs text-text-muted">EN/MN</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm text-text-muted">English 60%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-sm text-text-muted">Mandarin 40%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Word Cloud */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Topic Word Cloud</h3>
        <WordCloud words={wordCloudData} maxWords={50} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          value={analytics.totalConversations}
          label="Total Calls"
          icon="📞"
          color="primary"
        />
        <MetricCard
          value={`+${Math.round(mentalScore)}%`}
          label="Mood"
          icon="😊"
          color="success"
        />
        <MetricCard
          value={analytics.totalHealthNotes}
          label="Health Notes"
          icon="🩺"
          color="secondary"
        />
        <MetricCard
          value={analytics.totalMatches}
          label="Matches"
          icon="👥"
          color="warning"
        />
      </div>
    </div>
  )
}

function MetricCard({ value, label, icon, color }: any) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary-dark border-primary',
    success: 'bg-success-light text-success-dark border-success',
    secondary: 'bg-secondary-light text-secondary-dark border-secondary',
    warning: 'bg-warning-light text-warning-dark border-warning'
  }

  return (
    <div className={`${colorClasses[color]} rounded-lg border p-4 text-center transition-all duration-300 hover:scale-105`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl projector-text-2xl font-bold">{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
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
    .slice(0, 50) // Top 50 words as per TASK_LIST
}
