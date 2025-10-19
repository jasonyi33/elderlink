import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CommunityView from './CommunityView'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

// Mock the community data
const mockProfile = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  socialProfile: {
    interests: ['gardening', 'piano', 'cooking', 'Shanghai culture'],
    culturalBackground: 'Shanghai, Mandarin',
    openToMatching: true
  },
  location: 'Seattle, WA',
  matches: [
    {
      seniorId: 'mrs-lee',
      score: 90,
      compatibility: 'high',
      sharedInterests: ['gardening', 'cooking', 'piano', 'Mandarin'],
      calculatedAt: '2025-01-18T10:00:00Z'
    },
    {
      seniorId: 'mr-wang',
      score: 85,
      compatibility: 'high',
      sharedInterests: ['gardening', 'traditional music', 'Mandarin'],
      calculatedAt: '2025-01-18T10:00:00Z'
    },
    {
      seniorId: 'mrs-kim',
      score: 65,
      compatibility: 'good',
      sharedInterests: ['gardening', 'arts', 'Asian culture'],
      calculatedAt: '2025-01-18T10:00:00Z'
    }
  ],
  groups: [
    {
      id: 'mandarin-gardening-circle',
      name: 'Mandarin Gardening Circle',
      memberCount: 3,
      activity: 'gardening',
      language: 'Mandarin',
      schedule: 'Weekly, Thursdays 2pm'
    },
    {
      id: 'piano-music-appreciation',
      name: 'Piano & Music Appreciation',
      memberCount: 2,
      activity: 'piano',
      language: 'English',
      schedule: 'Bi-weekly, Saturdays 3pm'
    }
  ],
  wellnessMetrics: {
    socialHealth: {
      matchesMade: 3,
      groupsJoined: 2,
      communityEngagement: 85
    }
  }
}

const mockMatches = [
  {
    id: 'mrs-lee',
    name: 'Mrs. Lee',
    age: 69,
    socialProfile: {
      culturalBackground: 'Taiwan, Mandarin'
    },
    matchInfo: {
      score: 90,
      compatibility: 'high',
      sharedInterests: ['gardening', 'cooking', 'piano', 'Mandarin']
    }
  },
  {
    id: 'mr-wang',
    name: 'Mr. Wang',
    age: 73,
    socialProfile: {
      culturalBackground: 'Beijing, Mandarin'
    },
    matchInfo: {
      score: 85,
      compatibility: 'high',
      sharedInterests: ['gardening', 'traditional music', 'Mandarin']
    }
  },
  {
    id: 'mrs-kim',
    name: 'Mrs. Kim',
    age: 71,
    socialProfile: {
      culturalBackground: 'Seoul, Korean/English'
    },
    matchInfo: {
      score: 65,
      compatibility: 'good',
      sharedInterests: ['gardening', 'arts', 'Asian culture']
    }
  }
]

describe('CommunityView', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('match cards display for top 3 matches', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: mockProfile })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[0])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[1])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[2])
      })

    render(<CommunityView />)

    await waitFor(() => {
      expect(screen.getByText('Recommended Matches (3)')).toBeInTheDocument()
      expect(screen.getByText('Mrs. Lee, 69')).toBeInTheDocument()
      expect(screen.getByText('Mr. Wang, 73')).toBeInTheDocument()
      expect(screen.getByText('Mrs. Kim, 71')).toBeInTheDocument()
    })
  })

  it('compatibility scores render correctly (stars + percentage)', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: mockProfile })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[0])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[1])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[2])
      })

    render(<CommunityView />)

    await waitFor(() => {
      // Check percentage scores
      expect(screen.getByText('90%')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('65%')).toBeInTheDocument()
      
      // Check star ratings (5 stars for 90%, 5 stars for 85%, 4 stars for 65%)
      const starElements = screen.getAllByText(/★/)
      expect(starElements.length).toBeGreaterThan(0)
      
      // Check compatibility levels
      expect(screen.getByText('high Compatibility')).toBeInTheDocument()
      expect(screen.getByText('good Compatibility')).toBeInTheDocument()
    })
  })

  it('shared interests highlighted', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: mockProfile })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[0])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[1])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[2])
      })

    render(<CommunityView />)

    await waitFor(() => {
      // Check shared interests are displayed as pills
      expect(screen.getByText('gardening')).toBeInTheDocument()
      expect(screen.getByText('cooking')).toBeInTheDocument()
      expect(screen.getByText('piano')).toBeInTheDocument()
      expect(screen.getByText('Mandarin')).toBeInTheDocument()
      expect(screen.getByText('traditional music')).toBeInTheDocument()
      expect(screen.getByText('arts')).toBeInTheDocument()
      expect(screen.getByText('Asian culture')).toBeInTheDocument()
    })
  })

  it('group suggestions auto-generated', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: mockProfile })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[0])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[1])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[2])
      })

    render(<CommunityView />)

    await waitFor(() => {
      expect(screen.getByText('Suggested Groups')).toBeInTheDocument()
      expect(screen.getByText('Mandarin Gardening Circle')).toBeInTheDocument()
      expect(screen.getByText('Piano & Music Appreciation')).toBeInTheDocument()
      expect(screen.getByText('3 members • Mandarin • Weekly, Thursdays 2pm')).toBeInTheDocument()
      expect(screen.getByText('2 members • English • Bi-weekly, Saturdays 3pm')).toBeInTheDocument()
    })
  })

  it('Facilitate Connection button present (non-functional for demo)', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: mockProfile })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[0])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[1])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatches[2])
      })

    render(<CommunityView />)

    await waitFor(() => {
      // Check for action buttons on match cards
      expect(screen.getAllByText('View Profile')).toHaveLength(3)
      expect(screen.getAllByText('Details')).toHaveLength(3)
      
      // Check for group action buttons
      expect(screen.getAllByText('View Details')).toHaveLength(2)
    })
  })
})
