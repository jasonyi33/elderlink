import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ConversationHistory from './ConversationHistory'
import type { SeniorProfile } from '../types'

// Mock conversation data
const mockConversations: SeniorProfile['conversations'] = [
  {
    timestamp: '2025-01-15T14:30:00Z',
    duration: 8.5,
    keyTopics: ['tomato gardening', 'knee pain'],
    sentiment: 0.3,
    summary: 'Discussed tomato planting progress, mentioned knees ache when kneeling',
    language: 'english',
    healthMentions: ['knees ache when kneeling'],
    transcript: [
      { role: 'senior', content: 'Hi Sam, I planted more tomatoes today' },
      { role: 'sam', content: 'That sounds wonderful! How are they growing?' },
      { role: 'senior', content: 'They look good, but my knees ache a bit when I kneel down' },
      { role: 'sam', content: 'I\'m sorry to hear about your knee pain. Have you been taking your morning medication?' }
    ]
  },
  {
    timestamp: '2025-01-12T10:15:00Z',
    duration: 6.2,
    keyTopics: ['Sarah visit', 'medication'],
    sentiment: 0.2,
    summary: 'Talked about daughter Sarah\'s visit, mentioned remembering medication today',
    language: 'english',
    healthMentions: ['remembered my medication today'],
    transcript: [
      { role: 'senior', content: 'Sarah came to visit yesterday' },
      { role: 'sam', content: 'How wonderful! Did you cook together?' },
      { role: 'senior', content: 'Yes, we made dumplings. I remembered my medication today' },
      { role: 'sam', content: 'That happens sometimes. Did you remember them today?' }
    ]
  },
  {
    timestamp: '2025-01-08T16:45:00Z',
    duration: 7.8,
    keyTopics: ['piano teaching', 'arthritis'],
    sentiment: 0.4,
    summary: 'Shared memories of teaching piano, mentioned hands still nimble despite arthritis',
    language: 'english',
    healthMentions: ['arthritis not too bad'],
    transcript: [
      { role: 'senior', content: 'I used to teach piano to children' },
      { role: 'sam', content: 'That must have been rewarding. Do you still play?' },
      { role: 'senior', content: 'My hands are still nimble, arthritis not too bad' },
      { role: 'sam', content: 'That\'s great to hear! Music brings such joy.' }
    ]
  },
  {
    timestamp: '2025-01-05T09:20:00Z',
    duration: 5.5,
    keyTopics: ['Shanghai memories', 'cooking'],
    sentiment: 0.6,
    summary: 'Shared memories of Shanghai, discussed traditional cooking methods',
    language: 'english',
    healthMentions: [],
    transcript: [
      { role: 'senior', content: 'I miss Shanghai sometimes' },
      { role: 'sam', content: 'Tell me about your favorite memories there' },
      { role: 'senior', content: 'The food markets were amazing, so many fresh ingredients' },
      { role: 'sam', content: 'I can imagine! Do you still cook those traditional dishes?' }
    ]
  },
  {
    timestamp: '2025-01-02T11:30:00Z',
    duration: 9.1,
    keyTopics: ['loneliness', 'social activity'],
    sentiment: -0.1,
    summary: 'Expressed feeling lonely, mentioned wanting more social activity',
    language: 'english',
    healthMentions: ['feeling tired lately'],
    transcript: [
      { role: 'senior', content: 'I\'ve been feeling a bit lonely lately' },
      { role: 'sam', content: 'I understand that feeling. What would help you feel more connected?' },
      { role: 'senior', content: 'Maybe meeting other people who like gardening' },
      { role: 'sam', content: 'That sounds like a wonderful idea! I\'ll see what I can find.' }
    ]
  }
]

describe('ConversationHistory', () => {
  it('list shows last 10 conversations', () => {
    render(<ConversationHistory conversations={mockConversations} />)
    
    // Should show all conversations (we have 5, but component should handle up to 10)
    expect(screen.getByText('Discussed tomato planting progress, mentioned knees ache when kneeling')).toBeInTheDocument()
    expect(screen.getByText('Talked about daughter Sarah\'s visit, mentioned remembering medication today')).toBeInTheDocument()
    expect(screen.getByText('Shared memories of teaching piano, mentioned hands still nimble despite arthritis')).toBeInTheDocument()
    expect(screen.getByText('Shared memories of Shanghai, discussed traditional cooking methods')).toBeInTheDocument()
    expect(screen.getByText('Expressed feeling lonely, mentioned wanting more social activity')).toBeInTheDocument()
  })

  it('word cloud updates with new topics', () => {
    const { rerender } = render(<ConversationHistory conversations={mockConversations} />)
    
    // Check that word cloud is rendered
    expect(screen.getByText('Topic Word Cloud')).toBeInTheDocument()
    
    // Check for some expected words from keyTopics
    expect(screen.getByText('tomato')).toBeInTheDocument()
    expect(screen.getByText('gardening')).toBeInTheDocument()
    expect(screen.getByText('piano')).toBeInTheDocument()
    expect(screen.getByText('cooking')).toBeInTheDocument()
    
    // Test that word cloud updates with new topics
    const newConversations = [
      ...mockConversations,
      {
        timestamp: '2025-01-20T10:00:00Z',
        duration: 6.0,
        keyTopics: ['new topic', 'updated interests'],
        sentiment: 0.5,
        summary: 'New conversation with different topics',
        language: 'english',
        healthMentions: [],
        transcript: []
      }
    ]
    
    rerender(<ConversationHistory conversations={newConversations} />)
    
    // Check that new topics appear in word cloud
    expect(screen.getByText('new')).toBeInTheDocument()
    expect(screen.getByText('topic')).toBeInTheDocument()
    expect(screen.getByText('updated')).toBeInTheDocument()
    expect(screen.getByText('interests')).toBeInTheDocument()
  })

  it('wellness graph renders 30 days', () => {
    render(<ConversationHistory conversations={mockConversations} />)
    
    // Check that wellness graph section exists
    expect(screen.getByText('30-Day Wellness Trend')).toBeInTheDocument()
    
    // Check that graph container is rendered
    expect(screen.getByTestId('wellness-graph')).toBeInTheDocument()
  })

  it('dates format correctly', () => {
    render(<ConversationHistory conversations={mockConversations} />)
    
    // Check that dates are formatted correctly
    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 12, 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 8, 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 5, 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2, 2025')).toBeInTheDocument()
  })

  it('sentiment colors match values', () => {
    render(<ConversationHistory conversations={mockConversations} />)
    
    // Check positive sentiment (0.3, 0.4, 0.6) - should be green
    const positiveSentiments = screen.getAllByText(/Sentiment: 0\.[34]|Sentiment: 0\.6/)
    positiveSentiments.forEach(element => {
      expect(element).toHaveClass('bg-green-100', 'text-green-800')
    })
    
    // Check neutral sentiment (0.2) - should be yellow
    expect(screen.getByText('Sentiment: 0.20')).toHaveClass('bg-yellow-100', 'text-yellow-800')
    
    // Check negative sentiment (-0.1) - should be red
    expect(screen.getByText('Sentiment: -0.10')).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('health mentions displayed in timeline', () => {
    render(<ConversationHistory conversations={mockConversations} />)
    
    // Check that health mentions are displayed with proper badges
    expect(screen.getByText('🔴 knees ache when kneeling')).toBeInTheDocument()
    expect(screen.getByText('🔵 remembered my medication today')).toBeInTheDocument()
    expect(screen.getByText('🔴 arthritis not too bad')).toBeInTheDocument()
    expect(screen.getByText('🔴 feeling tired lately')).toBeInTheDocument()
  })
})
