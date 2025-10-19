import React, { useState, useEffect } from 'react'
import type { SeniorProfile, Analytics } from '../types'
import { apiClient } from '../services/api-client'
import WordCloud from './WordCloud'
import Icons from './ui/Icons'

// Apple Watch-style Radial Wellness Chart Component
function RadialWellnessChart({ mental, physical, social }: { mental: number; physical: number; social: number }) {
  const holistic = Math.round((mental + physical + social) / 3);

  return (
    <div className="medical-card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Icons.heartPulse size={24} className="text-primary" />
          <div>
            <h3 className="card-title">Holistic Wellness Score</h3>
            <span className="card-subtitle">Multi-dimensional health tracking</span>
          </div>
        </div>
      </div>

      <div className="card-section flex flex-col items-center">
        {/* Radial Chart SVG */}
        <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] mb-6">
          {/* Background rings */}
          <circle cx="150" cy="150" r="120" fill="none" stroke="var(--clinical-gray-100)" strokeWidth="24" />
          <circle cx="150" cy="150" r="90" fill="none" stroke="var(--clinical-gray-100)" strokeWidth="20" />
          <circle cx="150" cy="150" r="64" fill="none" stroke="var(--clinical-gray-100)" strokeWidth="16" />

          {/* Mental health ring (outer) */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="var(--chart-blue)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeDasharray={`${mental * 7.54} 754`}
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
          />

          {/* Physical health ring (middle) */}
          <circle
            cx="150"
            cy="150"
            r="90"
            fill="none"
            stroke="var(--chart-teal)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${physical * 5.65} 565`}
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
          />

          {/* Social health ring (inner) */}
          <circle
            cx="150"
            cy="150"
            r="64"
            fill="none"
            stroke="var(--chart-purple)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${social * 4.02} 402`}
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
          />

          {/* Center text */}
          <text x="150" y="135" textAnchor="middle" style={{
            fontSize: '14px',
            fontWeight: 600,
            fill: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Holistic Score
          </text>
          <text x="150" y="175" textAnchor="middle" style={{
            fontSize: '56px',
            fontWeight: 800,
            fill: 'var(--primary)',
            letterSpacing: '-2px'
          }}>
            {holistic}
          </text>
        </svg>

        {/* Legend */}
        <div className="flex gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--chart-blue)' }} />
            <span className="text-sm font-semibold text-primary">Mental {mental}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--chart-teal)' }} />
            <span className="text-sm font-semibold text-primary">Physical {physical}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--chart-purple)' }} />
            <span className="text-sm font-semibold text-primary">Social {social}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Radial Wellness Chart */}
      <RadialWellnessChart
        mental={mentalScore}
        physical={physicalScore}
        social={socialScore}
      />

      {/* Health Dimension Breakdown */}
      <div className="medical-card">
        <div className="card-header">
          <h3 className="card-title">Health Dimension Breakdown</h3>
        </div>

        <div className="card-section space-y-4">
          {/* Mental Health */}
          <div className="glass-card p-4 border-l-4" style={{ borderColor: 'var(--chart-blue)' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icons.heartPulse size={20} style={{ color: 'var(--chart-blue)' }} />
                <span className="font-semibold text-primary projector-text-lg">Mental Health</span>
              </div>
              <span className="text-primary font-bold text-xl projector-text-2xl">↑ 42%</span>
            </div>
            <p className="text-base projector-text-base text-text-muted mt-2">
              {analytics.totalConversations} conversations
            </p>
          </div>

          {/* Physical Health */}
          <div className="glass-card p-4 border-l-4" style={{ borderColor: 'var(--chart-teal)' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icons.activity size={20} style={{ color: 'var(--chart-teal)' }} />
                <span className="font-semibold text-primary projector-text-lg">Physical Health</span>
              </div>
              <span className="text-primary font-bold text-xl projector-text-2xl">{analytics.totalHealthNotes} health notes</span>
            </div>
            <p className="text-base projector-text-base text-text-muted mt-2">
              {profile.healthData.notes.filter((n: any) => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(n.timestamp) > weekAgo
              }).length} added this week
            </p>
          </div>

          {/* Social Health */}
          <div className="glass-card p-4 border-l-4" style={{ borderColor: 'var(--chart-purple)' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icons.users size={20} style={{ color: 'var(--chart-purple)' }} />
                <span className="font-semibold text-primary projector-text-lg">Social Health</span>
              </div>
              <span className="text-primary font-bold text-xl projector-text-2xl">
                {analytics.totalMatches} matches, {profile.groups.length} groups
              </span>
            </div>
            <p className="text-base projector-text-base text-text-muted mt-2">Community growing</p>
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
              <div className="font-semibold text-gray-900">Started medication</div>
              <div className="text-gray-900">Jan 15</div>
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
            <div className="text-2xl projector-text-2xl font-bold text-primary">8.5 min</div>
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
  const iconMap: Record<string, any> = {
    '📞': Icons.phone,
    '😊': Icons.heartPulse,
    '🩺': Icons.activity,
    '👥': Icons.users,
  };

  const colorMap: Record<string, string> = {
    primary: 'var(--chart-blue)',
    success: 'var(--chart-teal)',
    secondary: 'var(--primary)',
    warning: 'var(--chart-purple)'
  };

  const IconComponent = iconMap[icon] || Icons.chart;

  return (
    <div className="stat-card hover-lift text-center">
      <div className="mb-3 flex justify-center">
        <IconComponent size={32} style={{ color: colorMap[color] }} />
      </div>
      <div className="text-2xl projector-text-2xl font-bold text-primary">{value}</div>
      <div className="text-caption text-text-muted uppercase tracking-wide">{label}</div>
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
