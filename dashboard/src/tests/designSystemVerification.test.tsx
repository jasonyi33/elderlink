/**
 * Design System Verification Test
 * 
 * This test verifies that the design system is properly implemented across all components
 * following the TASK_LIST requirements for Task 5.12.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Import all components
import LiveCallView from '../components/LiveCallView'
import SeniorProfileView from '../components/SeniorProfileView'
import CommunityView from '../components/CommunityView'
import AnalyticsView from '../components/AnalyticsView'

// Mock data
const mockProfile = {
  name: "Mrs. Chen",
  age: 72,
  location: "San Francisco, CA",
  languages: ["English", "Mandarin"],
  phone: "+1 (555) 123-4567",
  socialProfile: {
    interests: ["gardening", "piano", "cooking"],
    culturalBackground: "Chinese-American",
    openToMatching: true
  },
  wellnessMetrics: {
    socialHealth: {
      matchesMade: 3,
      communityEngagement: 85,
      groupsJoined: 2
    }
  },
  groups: [
    {
      name: "Mandarin Gardening Circle",
      memberCount: 12,
      language: "Mandarin",
      schedule: "Saturdays 10am"
    }
  ]
}

const mockMatches = [
  {
    id: 1,
    name: "Mrs. Lee",
    age: 68,
    socialProfile: {
      culturalBackground: "Chinese-American",
      interests: ["gardening", "Mandarin"]
    },
    matchInfo: {
      score: 92,
      compatibility: "Excellent",
      sharedInterests: ["gardening", "Mandarin", "cooking"]
    }
  }
]

const mockAnalytics = {
  totalConversations: 147,
  totalHealthNotes: 23,
  totalMatches: 3
}

describe('Design System Verification', () => {
  describe('5.12a: Design System Colors, Spacing, Shadows, Transitions', () => {
    test('All components use design system color classes', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      // Check for design system color classes
      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have design system color classes
        expect(container.querySelector('.text-primary')).toBeInTheDocument()
        expect(container.querySelector('.bg-primary')).toBeInTheDocument()
        expect(container.querySelector('.text-text')).toBeInTheDocument()
        expect(container.querySelector('.text-text-muted')).toBeInTheDocument()
      })
    })

    test('All components use design system spacing classes', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have design system spacing classes
        expect(container.querySelector('.p-md')).toBeInTheDocument()
        expect(container.querySelector('.mb-md')).toBeInTheDocument()
        expect(container.querySelector('.gap-4')).toBeInTheDocument()
      })
    })

    test('All components use design system shadow classes', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have design system shadow classes
        expect(container.querySelector('.shadow-md')).toBeInTheDocument()
        expect(container.querySelector('.card')).toBeInTheDocument()
      })
    })

    test('All components use design system transition classes', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have design system transition classes
        expect(container.querySelector('.transition-normal')).toBeInTheDocument()
        expect(container.querySelector('.hover\\:shadow-lg')).toBeInTheDocument()
      })
    })

    test('Components use design system color classes instead of hardcoded colors', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have design system color classes
        expect(container.innerHTML).toMatch(/text-primary|text-secondary|text-success|text-warning|text-error/)
        expect(container.innerHTML).toMatch(/bg-primary|bg-secondary|bg-success|bg-warning|bg-error/)
        expect(container.innerHTML).toMatch(/text-text|text-text-muted/)
        expect(container.innerHTML).toMatch(/bg-background|bg-surface|bg-neutral/)
      })
    })
  })

  describe('5.12b: Mobile-First Responsive Breakpoints', () => {
    test('All components have responsive grid layouts', () => {
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      // Check for responsive grid classes (using regex to match partial class names)
      expect(profileContainer.innerHTML).toMatch(/grid-cols-1.*md:grid-cols-2.*lg:grid-cols-3/)
      expect(communityContainer.innerHTML).toMatch(/grid-cols-1.*md:grid-cols-2.*lg:grid-cols-4/)
      expect(communityContainer.innerHTML).toMatch(/grid-cols-1.*md:grid-cols-3/)
      expect(analyticsContainer.innerHTML).toMatch(/grid-cols-2.*md:grid-cols-4/)
      expect(analyticsContainer.innerHTML).toMatch(/grid-cols-1.*md:grid-cols-2.*lg:grid-cols-4/)
    })

    test('All components have responsive text sizing', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have responsive text classes
        expect(container.querySelector('.text-xl')).toBeInTheDocument()
        expect(container.querySelector('.text-lg')).toBeInTheDocument()
        expect(container.querySelector('.text-sm')).toBeInTheDocument()
      })
    })
  })

  describe('5.12c: Projector Optimization (1920x1080)', () => {
    test('All components have projector optimization classes', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have projector optimization classes
        expect(container.innerHTML).toMatch(/projector-optimized/)
        expect(container.innerHTML).toMatch(/projector-text-(xl|2xl|3xl|lg)/)
      })
    })

    test('All components have projector-specific text sizing', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have projector text classes
        expect(container.innerHTML).toMatch(/projector-text-(sm|base|lg|xl|2xl|3xl|4xl)/)
      })
    })
  })

  describe('5.12d: Multi-Device Testing', () => {
    test('Components render without errors on different screen sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      Object.defineProperty(window, 'innerHeight', { value: 667 })
      
      expect(() => render(<LiveCallView />)).not.toThrow()
      expect(() => render(<SeniorProfileView profile={mockProfile} />)).not.toThrow()
      expect(() => render(<CommunityView profile={mockProfile} matches={mockMatches} />)).not.toThrow()
      expect(() => render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)).not.toThrow()

      // Test tablet viewport
      Object.defineProperty(window, 'innerWidth', { value: 768 })
      Object.defineProperty(window, 'innerHeight', { value: 1024 })
      
      expect(() => render(<LiveCallView />)).not.toThrow()
      expect(() => render(<SeniorProfileView profile={mockProfile} />)).not.toThrow()
      expect(() => render(<CommunityView profile={mockProfile} matches={mockMatches} />)).not.toThrow()
      expect(() => render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)).not.toThrow()

      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', { value: 1920 })
      Object.defineProperty(window, 'innerHeight', { value: 1080 })
      
      expect(() => render(<LiveCallView />)).not.toThrow()
      expect(() => render(<SeniorProfileView profile={mockProfile} />)).not.toThrow()
      expect(() => render(<CommunityView profile={mockProfile} matches={mockMatches} />)).not.toThrow()
      expect(() => render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)).not.toThrow()
    })
  })

  describe('Design System CSS Variables', () => {
    test('Design system CSS file is properly imported', () => {
      // This test verifies that the design system CSS is available
      const computedStyle = getComputedStyle(document.documentElement)
      
      // Check if CSS variables are defined (they should have values, not be empty)
      expect(computedStyle.getPropertyValue('--color-primary')).not.toBe('')
      expect(computedStyle.getPropertyValue('--color-secondary')).not.toBe('')
      expect(computedStyle.getPropertyValue('--color-success')).not.toBe('')
      expect(computedStyle.getPropertyValue('--color-warning')).not.toBe('')
      expect(computedStyle.getPropertyValue('--spacing-md')).not.toBe('')
      expect(computedStyle.getPropertyValue('--spacing-lg')).not.toBe('')
      expect(computedStyle.getPropertyValue('--shadow-md')).not.toBe('')
      expect(computedStyle.getPropertyValue('--transition-normal')).not.toBe('')
    })
  })

  describe('Card Component Consistency', () => {
    test('All components use consistent card styling', () => {
      const { container: liveCallContainer } = render(<LiveCallView />)
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)
      const { container: analyticsContainer } = render(<AnalyticsView profile={mockProfile} analytics={mockAnalytics} />)

      const allContainers = [
        liveCallContainer,
        profileContainer,
        communityContainer,
        analyticsContainer
      ]

      allContainers.forEach(container => {
        // Should have card classes
        expect(container.querySelector('.card')).toBeInTheDocument()
        expect(container.querySelector('.card-section')).toBeInTheDocument()
      })
    })
  })

  describe('Badge Component Consistency', () => {
    test('All components use consistent badge styling', () => {
      const { container: profileContainer } = render(<SeniorProfileView profile={mockProfile} />)
      const { container: communityContainer } = render(<CommunityView profile={mockProfile} matches={mockMatches} />)

      // Should have badge classes
      expect(profileContainer.querySelector('.badge-primary')).toBeInTheDocument()
      expect(communityContainer.querySelector('.badge-primary')).toBeInTheDocument()
    })
  })
})
