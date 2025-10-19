import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LiveCallView from './LiveCallView'

// Mock the API client
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock the mock API
vi.mock('../../services/mock-api', () => ({
  getLiveSentiment: vi.fn()
}))

describe('LiveCallView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sentiment meter updates every 2 seconds', async () => {
    // Mock initial sentiment data
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.5,
        emotions: ['happy'],
        language: 'english'
      })
    })

    render(<LiveCallView />)

    // Initially should show loading or default state
    expect(screen.getByText('Live Call - Mrs. Chen')).toBeInTheDocument()

    // Fast-forward time by 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Should have made API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/sentiment/live')
    })

    // Fast-forward another 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Should have made another API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it('color changes: green (positive), red (negative), yellow (neutral)', async () => {
    // Test positive sentiment (green)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.8,
        emotions: ['happy'],
        language: 'english'
      })
    })

    const { rerender } = render(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      const sentimentBar = screen.getByRole('progressbar', { hidden: true })
      expect(sentimentBar).toHaveClass('bg-green-500')
    })

    // Test negative sentiment (red)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: -0.6,
        emotions: ['sad'],
        language: 'english'
      })
    })

    rerender(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      const sentimentBar = screen.getByRole('progressbar', { hidden: true })
      expect(sentimentBar).toHaveClass('bg-red-500')
    })

    // Test neutral sentiment (yellow)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.0,
        emotions: ['neutral'],
        language: 'english'
      })
    })

    rerender(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      const sentimentBar = screen.getByRole('progressbar', { hidden: true })
      expect(sentimentBar).toHaveClass('bg-yellow-500')
    })
  })

  it('emotion tags appear/disappear dynamically', async () => {
    // Initial state with no emotions
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.0,
        emotions: [],
        language: 'english'
      })
    })

    const { rerender } = render(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.getByText('No emotions detected yet')).toBeInTheDocument()
    })

    // Update with emotions
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.5,
        emotions: ['happy', 'content'],
        language: 'english'
      })
    })

    rerender(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.getByText('happy')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
      expect(screen.queryByText('No emotions detected yet')).not.toBeInTheDocument()
    })
  })

  it('language indicator switches correctly', async () => {
    // Test English
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.0,
        emotions: [],
        language: 'english'
      })
    })

    const { rerender } = render(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
    })

    // Test Mandarin
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.0,
        emotions: [],
        language: 'mandarin'
      })
    })

    rerender(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.getByText('🇨🇳 Mandarin')).toBeInTheDocument()
    })
  })

  it('handles connection loss gracefully', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      // Should not crash, should show error state or fallback
      expect(screen.getByText('Live Call - Mrs. Chen')).toBeInTheDocument()
      // Should show some indication of connection issue
      expect(screen.getByText(/connection|error|offline/i)).toBeInTheDocument()
    })
  })

  it('current transcript snippet displays last 2 exchanges', async () => {
    // Mock transcript data
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        sentiment: 0.0,
        emotions: [],
        language: 'english',
        transcript: [
          { role: 'senior', content: 'Hello Sam, how are you?' },
          { role: 'sam', content: 'I\'m doing well, thank you for asking!' }
        ]
      })
    })

    render(<LiveCallView />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.getByText('Hello Sam, how are you?')).toBeInTheDocument()
      expect(screen.getByText('I\'m doing well, thank you for asking!')).toBeInTheDocument()
    })
  })
})
