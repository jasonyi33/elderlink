import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HealthTimeline from './HealthTimeline'
import type { SeniorProfile } from '../types'

// Mock health notes data using correct SeniorProfile structure
const mockHealthNotes: SeniorProfile['healthData']['notes'] = [
  {
    timestamp: '2025-01-15T14:30:00Z',
    source: 'Sam AI Conversation',
    note: 'Patient reports: knees ache when kneeling in garden. Taking morning medication regularly.',
    mentions: [
      { type: 'symptom', text: 'knees ache', context: 'gardening', severity: 'mild' },
      { type: 'medication', text: 'morning medication', context: 'adherence', severity: 'mild' }
    ]
  },
  {
    timestamp: '2025-01-12T10:15:00Z',
    source: 'Sam AI Conversation',
    note: 'Patient reports: forgot morning pills yesterday but remembered today. Feeling good overall.',
    mentions: [
      { type: 'medication', text: 'forgot morning pills', context: 'adherence', severity: 'mild' }
    ]
  },
  {
    timestamp: '2025-01-10T09:00:00Z',
    source: 'Manual Entry',
    note: 'Severe chest pain reported during morning walk. Immediate attention required.',
    mentions: [
      { type: 'symptom', text: 'chest pain', context: 'walking', severity: 'severe' }
    ]
  },
  {
    timestamp: '2025-01-08T16:45:00Z',
    source: 'Provider',
    note: 'Blood pressure elevated during routine check. Medication adjustment recommended.',
    mentions: [
      { type: 'symptom', text: 'blood pressure elevated', context: 'routine check', severity: 'moderate' }
    ]
  }
]

describe('HealthTimeline', () => {
  it('chronological list of health notes', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Should show all health notes
    expect(screen.getByText('Patient reports: knees ache when kneeling in garden. Taking morning medication regularly.')).toBeInTheDocument()
    expect(screen.getByText('Patient reports: forgot morning pills yesterday but remembered today. Feeling good overall.')).toBeInTheDocument()
    expect(screen.getByText('Severe chest pain reported during morning walk. Immediate attention required.')).toBeInTheDocument()
    expect(screen.getByText('Blood pressure elevated during routine check. Medication adjustment recommended.')).toBeInTheDocument()
  })

  it('each note shows timestamp, source, natural language note', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check timestamps are displayed
    expect(screen.getByText('Jan 15, 2025, 2:30:00 PM')).toBeInTheDocument()
    expect(screen.getByText('Jan 12, 2025, 10:15:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Jan 10, 2025, 9:00:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Jan 8, 2025, 4:45:00 PM')).toBeInTheDocument()
    
    // Check sources are displayed
    expect(screen.getByText('Sam AI Conversation')).toBeInTheDocument()
    expect(screen.getByText('Manual Entry')).toBeInTheDocument()
    expect(screen.getByText('Provider')).toBeInTheDocument()
    
    // Check natural language notes are displayed
    expect(screen.getByText('Patient reports: knees ache when kneeling in garden. Taking morning medication regularly.')).toBeInTheDocument()
  })

  it('structured mentions displayed as tags (symptoms red, medications green)', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check symptom tags are red
    const symptomTags = screen.getAllByText('knees ache')
    symptomTags.forEach(tag => {
      expect(tag).toHaveClass('bg-red-100', 'text-red-800')
    })
    
    // Check medication tags are green
    const medicationTags = screen.getAllByText('morning medication')
    medicationTags.forEach(tag => {
      expect(tag).toHaveClass('bg-green-100', 'text-green-800')
    })
    
    // Check concern tags (if any) are yellow
    const concernTags = screen.getAllByText('forgot morning pills')
    concernTags.forEach(tag => {
      expect(tag).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })
  })

  it('severity indicators for symptoms (mild/moderate/severe)', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check mild severity icon
    expect(screen.getByText('⚠️')).toBeInTheDocument()
    
    // Check moderate severity icon
    expect(screen.getByText('⚠️⚠️')).toBeInTheDocument()
    
    // Check severe severity icon
    expect(screen.getByText('🚨')).toBeInTheDocument()
  })

  it('displays notes in chronological order', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    const timelineItems = screen.getAllByTestId('timeline-item')
    
    // Should be in chronological order (newest first)
    expect(timelineItems[0]).toHaveTextContent('Jan 15, 2025') // Most recent
    expect(timelineItems[1]).toHaveTextContent('Jan 12, 2025')
    expect(timelineItems[2]).toHaveTextContent('Jan 10, 2025')
    expect(timelineItems[3]).toHaveTextContent('Jan 8, 2025') // Oldest
  })

  it('shows source badge for each note', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check source badges exist
    expect(screen.getByText('Sam AI')).toBeInTheDocument()
    expect(screen.getByText('Manual')).toBeInTheDocument()
    expect(screen.getByText('Provider')).toBeInTheDocument()
  })

  it('highlights severity levels with icons', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check that severity icons are displayed
    expect(screen.getByText('⚠️')).toBeInTheDocument() // mild
    expect(screen.getByText('⚠️⚠️')).toBeInTheDocument() // moderate
    expect(screen.getByText('🚨')).toBeInTheDocument() // severe
  })

  it('links to MyChart portal', () => {
    render(<HealthTimeline healthNotes={mockHealthNotes} />)
    
    // Check for MyChart portal link
    const myChartLink = screen.getByText('View in MyChart')
    expect(myChartLink).toBeInTheDocument()
    expect(myChartLink.closest('a')).toHaveAttribute('href', 'https://mychart.uwmedicine.org/portal')
    expect(myChartLink.closest('a')).toHaveAttribute('target', '_blank')
  })
})
