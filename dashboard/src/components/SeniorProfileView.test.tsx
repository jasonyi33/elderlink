import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SeniorProfileView from './SeniorProfileView'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

// Mock the mock API data
const mockProfile = {
  id: 'mrs-chen',
  name: 'Mrs. Chen',
  age: 72,
  phone: '+1 (206) 555-0123',
  languages: ['english', 'mandarin'],
  location: 'Seattle, WA',
  memories: {
    family: [
      {
        name: 'Sarah',
        relationship: 'daughter',
        details: ['lives in Portland', 'visits monthly', 'cooks together']
      }
    ],
    hobbies: ['gardening', 'piano', 'cooking'],
    health: ['arthritis', 'trouble sleeping'],
    recentEvents: [
      'Sarah visited last weekend',
      'Planted new tomato seeds',
      'Played piano for first time in months'
    ]
  },
  healthData: {
    conditions: [
      { name: 'Hypertension', since: '2018', status: 'controlled' },
      { name: 'Type 2 Diabetes', since: '2020', a1c: '6.5%' },
      { name: 'Osteoarthritis', locations: ['knees', 'back'], status: 'managed' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'daily morning', purpose: 'blood pressure' },
      { name: 'Metformin', dosage: '500mg', frequency: 'with meals', purpose: 'diabetes' },
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily', purpose: 'bone health' }
    ],
    vitals: {
      lastUpdated: '2025-01-10',
      bloodPressure: '128/82',
      weight: '145 lbs',
      bloodSugar: '110 mg/dL fasting'
    },
    appointments: [
      { date: '2025-01-25', time: '10:00am', type: 'Primary care checkup', doctor: 'Dr. Smith' },
      { date: '2025-02-15', time: '2:00pm', type: 'Cardiology follow-up', doctor: 'Dr. Johnson' }
    ],
    notes: [
      {
        timestamp: '2025-01-18T14:32:00Z',
        source: 'Sam AI Conversation',
        note: 'Patient reports: back pain when gardening (mild severity). Medication adherence: took morning Lisinopril.',
        mentions: [
          { type: 'symptom', text: 'back pain', context: 'gardening', severity: 'mild' },
          { type: 'medication', text: 'took morning pills', status: 'adherent' }
        ]
      }
    ]
  },
  conversations: [
    {
      timestamp: '2025-01-18T10:30:00Z',
      duration: 8.5,
      keyTopics: ['gardening', 'family'],
      sentiment: 0.7,
      summary: 'Discussed tomato garden and Sarah\'s visit',
      language: 'english',
      healthMentions: ['back pain']
    },
    {
      timestamp: '2025-01-15T14:20:00Z',
      duration: 12.3,
      keyTopics: ['piano', 'memories'],
      sentiment: 0.8,
      summary: 'Talked about teaching piano and Shanghai memories',
      language: 'mandarin',
      healthMentions: []
    }
  ],
  wellnessMetrics: {
    mentalHealth: {
      lonelinessScore: 3.2,
      averageSentiment: 0.6,
      trend: 'improving'
    },
    physicalHealth: {
      symptomMentions: 5,
      medicationAdherence: 0.85,
      appointmentReminders: 2
    },
    socialHealth: {
      matchesMade: 3,
      groupsJoined: 1,
      communityEngagement: 0.7
    },
    holisticScore: 78,
    lastCallDate: '2025-01-18T10:30:00Z',
    callFrequency: 2.5
  }
}

describe('SeniorProfileView', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('personal info card renders correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ profile: mockProfile })
    })

    render(<SeniorProfileView />)

    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Mrs. Chen')).toBeInTheDocument()
      expect(screen.getByText('72')).toBeInTheDocument()
      expect(screen.getByText('Seattle, WA')).toBeInTheDocument()
      expect(screen.getByText('english, mandarin')).toBeInTheDocument()
      expect(screen.getByText('+1 (206) 555-0123')).toBeInTheDocument()
    })
  })

  it('memories grouped by category (family, hobbies, health)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ profile: mockProfile })
    })

    render(<SeniorProfileView />)

    await waitFor(() => {
      // Family section
      expect(screen.getByText('Family')).toBeInTheDocument()
      expect(screen.getByText('Sarah (daughter)')).toBeInTheDocument()
      expect(screen.getByText('lives in Portland, visits monthly, cooks together')).toBeInTheDocument()

      // Hobbies section
      expect(screen.getByText('Interests & Hobbies')).toBeInTheDocument()
      expect(screen.getByText('gardening')).toBeInTheDocument()
      expect(screen.getByText('piano')).toBeInTheDocument()
      expect(screen.getByText('cooking')).toBeInTheDocument()
    })
  })

  it('health data displays conditions, medications, vitals', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ profile: mockProfile })
    })

    render(<SeniorProfileView />)

    await waitFor(() => {
      // Health Overview section
      expect(screen.getByText('Health Overview')).toBeInTheDocument()
      
      // Conditions
      expect(screen.getByText('Conditions (3)')).toBeInTheDocument()
      expect(screen.getByText('Hypertension')).toBeInTheDocument()
      expect(screen.getByText('Type 2 Diabetes')).toBeInTheDocument()
      expect(screen.getByText('Osteoarthritis')).toBeInTheDocument()

      // Medications
      expect(screen.getByText('Medications (3)')).toBeInTheDocument()
      expect(screen.getByText('Lisinopril 10mg')).toBeInTheDocument()
      expect(screen.getByText('Metformin 500mg')).toBeInTheDocument()
      expect(screen.getByText('Vitamin D 1000 IU')).toBeInTheDocument()

      // Vitals
      expect(screen.getByText('Latest Vitals')).toBeInTheDocument()
      expect(screen.getByText('128/82')).toBeInTheDocument()
      expect(screen.getByText('145 lbs')).toBeInTheDocument()
      expect(screen.getByText('110 mg/dL fasting')).toBeInTheDocument()
    })
  })

  it('upcoming appointments shown prominently', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ profile: mockProfile })
    })

    render(<SeniorProfileView />)

    await waitFor(() => {
      // Next Appointment section
      expect(screen.getByText('Next Appointment')).toBeInTheDocument()
      expect(screen.getByText('Primary care checkup')).toBeInTheDocument()
      expect(screen.getByText('2025-01-25 at 10:00am')).toBeInTheDocument()
      expect(screen.getByText('with Dr. Smith')).toBeInTheDocument()
    })
  })

  it('conversation history displays correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ profile: mockProfile })
    })

    render(<SeniorProfileView />)

    await waitFor(() => {
      // Conversation History section
      expect(screen.getByText('Conversation History')).toBeInTheDocument()
      expect(screen.getByText('2 conversations')).toBeInTheDocument()
      
      // Should show conversation summaries when expanded
      expect(screen.getByText('Discussed tomato garden and Sarah\'s visit')).toBeInTheDocument()
      expect(screen.getByText('Talked about teaching piano and Shanghai memories')).toBeInTheDocument()
    })
  })
})
