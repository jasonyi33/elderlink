// Design System Tests for Task 5.12
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LiveCallView from '../components/LiveCallView'
import SeniorProfileView from '../components/SeniorProfileView'
import CommunityView from '../components/CommunityView'
import AnalyticsView from '../components/AnalyticsView'

describe('Design System Implementation', () => {
  // Mock data for components
  const mockProfile = {
    id: 'mrs-chen',
    name: 'Mrs. Chen',
    age: 72,
    location: 'Seattle, WA',
    languages: ['english', 'mandarin'],
    phone: '+1 (206) 555-0123',
    memories: {
      family: [{ name: 'Sarah', relationship: 'daughter', details: ['visits weekly'] }],
      hobbies: ['gardening', 'piano'],
      health: ['arthritis'],
      recentEvents: ['planted tomatoes']
    },
    socialProfile: {
      interests: ['gardening', 'piano'],
      culturalBackground: 'Shanghai, Mandarin',
      openToMatching: true
    },
    healthData: {
      conditions: [{ name: 'Hypertension', since: '2018', status: 'controlled' }],
      medications: [{ name: 'Lisinopril', dosage: '10mg', frequency: 'daily' }],
      vitals: { lastUpdated: '2025-01-10', bloodPressure: '128/82' },
      appointments: [{ date: '2025-01-25', time: '10:00am', type: 'Checkup', doctor: 'Dr. Smith' }],
      notes: []
    },
    matches: [],
    groups: [],
    conversations: [],
    wellnessMetrics: {
      mentalHealth: { averageSentiment: 0.2, trend: 'improving' },
      physicalHealth: { symptomMentions: 5 },
      socialHealth: { matchesMade: 3, groupsJoined: 2 },
      holisticScore: 78
    }
  }

  describe('5.12a: Design System Colors', () => {
    test('LiveCallView uses primary colors for text', () => {
      render(<LiveCallView />)
      const title = screen.getByText('Live Call - Mrs. Chen')
      expect(title).toHaveClass('text-primary')
    })

    test('LiveCallView uses secondary colors for accent elements', () => {
      render(<LiveCallView />)
      const liveIndicator = screen.getByText('LIVE')
      expect(liveIndicator).toHaveClass('text-secondary')
    })

    test('CommunityView uses success colors for positive indicators', () => {
      render(<CommunityView />)
      const openToConnecting = screen.getByText('Yes')
      expect(openToConnecting).toHaveClass('text-success')
    })

    test('All components use design system background colors', () => {
      const { container: liveContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView />)
      
      expect(liveContainer.firstChild).toHaveClass('bg-background')
      expect(profileContainer.firstChild).toHaveClass('bg-background')
    })
  })

  describe('5.12a: Design System Spacing', () => {
    test('Components use card spacing (16px)', () => {
      const { container } = render(<LiveCallView />)
      const card = container.querySelector('.p-card')
      expect(card).toBeInTheDocument()
    })

    test('Components use section spacing (20px)', () => {
      const { container } = render(<LiveCallView />)
      const section = container.querySelector('.mb-section')
      expect(section).toBeInTheDocument()
    })

    test('Components use component spacing (8px)', () => {
      const { container } = render(<CommunityView />)
      const component = container.querySelector('.px-component')
      expect(component).toBeInTheDocument()
    })
  })

  describe('5.12a: Material Design Shadows', () => {
    test('All cards use shadow-md', () => {
      const { container: liveContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView />)
      
      expect(liveContainer.firstChild).toHaveClass('shadow-md')
      expect(profileContainer.firstChild).toHaveClass('shadow-md')
    })
  })

  describe('5.12a: Transitions', () => {
    test('Interactive elements have transition-all duration-300', () => {
      const { container } = render(<CommunityView />)
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all', 'duration-300')
      })
    })

    test('Tab navigation has smooth transitions', () => {
      const { container } = render(<LiveCallView />)
      const tabElements = container.querySelectorAll('[class*="transition"]')
      expect(tabElements.length).toBeGreaterThan(0)
    })
  })

  describe('5.12b: Responsive Breakpoints', () => {
    test('LiveCallView is mobile-first responsive', () => {
      const { container } = render(<LiveCallView />)
      const responsiveElements = container.querySelectorAll('[class*="md:"]')
      expect(responsiveElements.length).toBeGreaterThan(0)
    })

    test('CommunityView uses responsive grid', () => {
      const { container } = render(<CommunityView />)
      const gridElement = container.querySelector('.grid-cols-1')
      expect(gridElement).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
    })

    test('SeniorProfileView has responsive layout', () => {
      const { container } = render(<SeniorProfileView />)
      const responsiveElements = container.querySelectorAll('[class*="lg:"]')
      expect(responsiveElements.length).toBeGreaterThan(0)
    })

    test('AnalyticsView is responsive', () => {
      const { container } = render(<AnalyticsView />)
      const responsiveElements = container.querySelectorAll('[class*="md:"]')
      expect(responsiveElements.length).toBeGreaterThan(0)
    })
  })

  describe('5.12d: Projector Optimization', () => {
    test('Components have projector-optimized classes', () => {
      const { container } = render(<LiveCallView />)
      const projectorElement = container.querySelector('.projector-optimized')
      expect(projectorElement).toBeInTheDocument()
    })

    test('Text is readable on large displays', () => {
      const { container } = render(<AnalyticsView />)
      const largeText = container.querySelector('.text-2xl')
      expect(largeText).toBeInTheDocument()
    })
  })

  describe('Design System Consistency', () => {
    test('No hardcoded colors (gray-900, red-600, etc.)', () => {
      const { container } = render(<LiveCallView />)
      const hardcodedColors = container.querySelectorAll('[class*="gray-"], [class*="red-"], [class*="blue-"]')
      expect(hardcodedColors.length).toBe(0)
    })

    test('No hardcoded spacing (p-6, mb-4, etc.)', () => {
      const { container } = render(<CommunityView />)
      const hardcodedSpacing = container.querySelectorAll('[class*="p-[0-9]"], [class*="m-[0-9]"]')
      expect(hardcodedSpacing.length).toBe(0)
    })

    test('All interactive elements have transitions', () => {
      const { container } = render(<CommunityView />)
      const interactiveElements = container.querySelectorAll('button, [role="button"]')
      interactiveElements.forEach(element => {
        expect(element).toHaveClass('transition-all', 'duration-300')
      })
    })
  })
})
