import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from './api-client'
import type { SeniorProfile } from '../types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockConsoleError.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('fetchProfile returns SeniorProfile', async () => {
    const mockProfile: SeniorProfile = {
      id: 'mrs-chen',
      name: 'Mrs. Chen',
      age: 72,
      phone: '+1-206-555-0123',
      languages: ['english', 'mandarin'],
      location: 'Seattle, WA',
      memories: {
        family: [{ name: 'Sarah', relationship: 'daughter', details: ['lives in Seattle'] }],
        hobbies: ['gardening', 'piano'],
        health: ['arthritis'],
        recentEvents: ['planted tomatoes'],
        preferences: {
          topicsEnjoys: ['family', 'gardening'],
          topicsAvoid: ['politics'],
          conversationStyle: 'warm and patient'
        }
      },
      socialProfile: {
        interests: ['gardening', 'piano'],
        culturalBackground: 'Shanghai, Mandarin',
        openToMatching: true
      },
      healthData: {
        conditions: [{ name: 'Hypertension', since: '2018', status: 'controlled' }],
        medications: [{ name: 'Lisinopril', dosage: '10mg', frequency: 'daily', purpose: 'blood pressure' }],
        vitals: { lastUpdated: '2025-01-10', bloodPressure: '128/82' },
        appointments: [{ date: '2025-01-25', time: '10:00am', type: 'Checkup', doctor: 'Dr. Smith' }],
        notes: []
      },
      matches: [],
      groups: [],
      conversations: [],
      wellnessMetrics: {
        mentalHealth: { lonelinessScore: 0.3, averageSentiment: 0.2, trend: 'stable' },
        physicalHealth: { symptomMentions: 2, medicationAdherence: 0.8, appointmentReminders: 1 },
        socialHealth: { matchesMade: 0, groupsJoined: 0, communityEngagement: 0.5 },
        holisticScore: 75,
        lastCallDate: '2025-01-15T14:30:00Z',
        callFrequency: 0.3
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ profile: mockProfile, analytics: {}, liveSentiment: {} })
    })

    const result = await apiClient.fetchProfile('mrs-chen')

    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/mrs-chen')
    expect(result).toEqual({ profile: mockProfile, analytics: {}, liveSentiment: {} })
  })

  it('fetchLiveSentiment returns current sentiment', async () => {
    const mockSentiment = {
      sentiment: 0.3,
      emotions: ['happy', 'content'],
      timestamp: '2025-01-15T14:30:00Z'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSentiment
    })

    const result = await apiClient.fetchLiveSentiment()

    expect(mockFetch).toHaveBeenCalledWith('/api/sentiment/live')
    expect(result).toEqual(mockSentiment)
  })

  it('handles 404 errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    const result = await apiClient.fetchProfile('nonexistent')

    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/nonexistent')
    expect(result).toEqual({ error: 'Profile not found', status: 404 })
    expect(mockConsoleError).toHaveBeenCalledWith('API Error:', expect.any(Error))
  })

  it('handles network timeout', async () => {
    // Mock a timeout by making fetch hang
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 100)
      )
    )

    const result = await apiClient.fetchProfile('mrs-chen')

    expect(result).toEqual({ error: 'Network timeout', status: 0 })
    expect(mockConsoleError).toHaveBeenCalledWith('API Error:', expect.any(Error))
  })

  it('implements retry logic (max 3 attempts)', async () => {
    // Mock fetch to fail twice, then succeed
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: {}, analytics: {}, liveSentiment: {} })
      })

    const result = await apiClient.fetchProfile('mrs-chen')

    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result).toEqual({ profile: {}, analytics: {}, liveSentiment: {} })
  })

  it('caches responses for 30 seconds', async () => {
    const mockData = { profile: { name: 'Mrs. Chen' }, analytics: {}, liveSentiment: {} }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    // First call
    const result1 = await apiClient.fetchProfile('mrs-chen')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result1).toEqual(mockData)

    // Second call within 30 seconds should use cache
    const result2 = await apiClient.fetchProfile('mrs-chen')
    expect(mockFetch).toHaveBeenCalledTimes(1) // Still only 1 call due to caching
    expect(result2).toEqual(mockData)

    // Wait for cache to expire (simulate with time manipulation)
    vi.advanceTimersByTime(31000) // 31 seconds

    // Third call after cache expiry should make new request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const result3 = await apiClient.fetchProfile('mrs-chen')
    expect(mockFetch).toHaveBeenCalledTimes(2) // Now 2 calls total
    expect(result3).toEqual(mockData)
  })
})
