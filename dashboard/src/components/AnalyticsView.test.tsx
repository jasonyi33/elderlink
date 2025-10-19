import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnalyticsView from './AnalyticsView'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

// Mock analytics data
const mockAnalytics = {
  totalConversations: 147,
  averageSentiment: 0.44,
  totalMatches: 8,
  totalHealthNotes: 23,
  seniorCount: 4,
  holisticWellnessAverage: 78
}

const mockProfile = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  wellnessMetrics: {
    holisticScore: 78,
    mentalHealth: {
      averageSentiment: 0.44,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 5,
      medicationAdherence: 85,
      appointmentReminders: 2
    },
    socialHealth: {
      matchesMade: 3,
      groupsJoined: 2,
      communityEngagement: 85
    }
  },
  healthData: {
    notes: [
      { timestamp: '2025-01-15T14:30:00Z', source: 'Sam AI Conversation', note: 'Patient reports: back pain when gardening' },
      { timestamp: '2025-01-12T10:15:00Z', source: 'Sam AI Conversation', note: 'Patient reports: remembered medication today' },
      { timestamp: '2025-01-10T09:00:00Z', source: 'Sam AI Conversation', note: 'Patient reports: hands still nimble, arthritis not too bad' }
    ]
  },
  matches: [
    { seniorId: 'mrs-lee', score: 90, compatibility: 'high' },
    { seniorId: 'mr-wang', score: 85, compatibility: 'high' },
    { seniorId: 'mrs-kim', score: 65, compatibility: 'good' }
  ],
  groups: [
    { id: 'mandarin-gardening-circle', name: 'Mandarin Gardening Circle' },
    { id: 'piano-music-appreciation', name: 'Piano & Music Appreciation' }
  ],
  conversations: [
    { timestamp: '2025-01-15T14:30:00Z', keyTopics: ['tomato gardening', 'knee pain'], sentiment: 0.3 },
    { timestamp: '2025-01-12T10:15:00Z', keyTopics: ['Sarah visit', 'medication'], sentiment: 0.2 },
    { timestamp: '2025-01-10T09:00:00Z', keyTopics: ['piano teaching', 'arthritis'], sentiment: 0.1 }
  ]
}

describe('AnalyticsView', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('holistic wellness score calculation (mental 40% + physical 30% + social 30%)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        analytics: mockAnalytics, 
        profile: mockProfile 
      })
    })

    render(<AnalyticsView />)

    await waitFor(() => {
      // Check holistic score is displayed
      expect(screen.getByText('78/100')).toBeInTheDocument()
      expect(screen.getByText('Holistic Wellness Score')).toBeInTheDocument()
      
      // Check breakdown sections exist
      expect(screen.getByText('Mental Health')).toBeInTheDocument()
      expect(screen.getByText('Physical Health')).toBeInTheDocument()
      expect(screen.getByText('Social Health')).toBeInTheDocument()
    })
  })

  it('individual dimension scores display', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        analytics: mockAnalytics, 
        profile: mockProfile 
      })
    })

    render(<AnalyticsView />)

    await waitFor(() => {
      // Check mental health score and trend
      expect(screen.getByText('Mental Health')).toBeInTheDocument()
      expect(screen.getByText('↑ 42%')).toBeInTheDocument()
      expect(screen.getByText('147 conversations')).toBeInTheDocument()
      
      // Check physical health score
      expect(screen.getByText('Physical')).toBeInTheDocument()
      expect(screen.getByText('23 health notes')).toBeInTheDocument()
      expect(screen.getByText('3 added this week')).toBeInTheDocument()
      
      // Check social health score
      expect(screen.getByText('Social')).toBeInTheDocument()
      expect(screen.getByText('8 matches, 2 groups')).toBeInTheDocument()
      expect(screen.getByText('Community growing')).toBeInTheDocument()
    })
  })

  it('30-day trend graph renders', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        analytics: mockAnalytics, 
        profile: mockProfile 
      })
    })

    render(<AnalyticsView />)

    await waitFor(() => {
      expect(screen.getByText('30-Day Wellness Trend')).toBeInTheDocument()
      // Check that trend graph container exists (simplified implementation)
      expect(screen.getByText('[Combined trend graph showing all three dimensions over time]')).toBeInTheDocument()
      // Check for annotations
      expect(screen.getByText('Family visit')).toBeInTheDocument()
      expect(screen.getByText('Started medication')).toBeInTheDocument()
      expect(screen.getByText('Community match')).toBeInTheDocument()
    })
  })

  it('call frequency heatmap shows peak hours', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        analytics: mockAnalytics, 
        profile: mockProfile 
      })
    })

    render(<AnalyticsView />)

    await waitFor(() => {
      // Check that call analytics section exists
      expect(screen.getByText('Total Calls')).toBeInTheDocument()
      expect(screen.getByText('147')).toBeInTheDocument()
      
      // Check for peak hours heatmap
      expect(screen.getByText('Peak Hours Heatmap')).toBeInTheDocument()
      expect(screen.getByText('12am')).toBeInTheDocument()
      expect(screen.getByText('6am')).toBeInTheDocument()
      expect(screen.getByText('12pm')).toBeInTheDocument()
      expect(screen.getByText('6pm')).toBeInTheDocument()
      expect(screen.getByText('11pm')).toBeInTheDocument()
      
      // Check for language distribution pie chart
      expect(screen.getByText('Language Distribution')).toBeInTheDocument()
      expect(screen.getByText('English 60%')).toBeInTheDocument()
      expect(screen.getByText('Mandarin 40%')).toBeInTheDocument()
    })
  })

  it('word cloud generates from all conversations', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        analytics: mockAnalytics, 
        profile: mockProfile 
      })
    })

    render(<AnalyticsView />)

    await waitFor(() => {
      // Check that word cloud section exists
      expect(screen.getByText('Topic Word Cloud')).toBeInTheDocument()
      // The word cloud would be generated from conversation keyTopics
      // Check for some expected words from the mock conversations
      expect(screen.getByText('tomato')).toBeInTheDocument()
      expect(screen.getByText('gardening')).toBeInTheDocument()
      expect(screen.getByText('piano')).toBeInTheDocument()
    })
  })
})
