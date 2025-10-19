import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

// Mock the view components since they don't exist yet
jest.mock('./components/LiveCallView', () => {
  return function LiveCallView() {
    return <div data-testid="live-call-view">Live Call View</div>
  }
})

jest.mock('./components/SeniorProfileView', () => {
  return function SeniorProfileView() {
    return <div data-testid="senior-profile-view">Senior Profile View</div>
  }
})

jest.mock('./components/CommunityView', () => {
  return function CommunityView() {
    return <div data-testid="community-view">Community View</div>
  }
})

jest.mock('./components/AnalyticsView', () => {
  return function AnalyticsView() {
    return <div data-testid="analytics-view">Analytics View</div>
  }
})

describe('App - 4-Tab Navigation', () => {
  it('renders 4 tabs: Live Call, Senior Profile, Community, Analytics', () => {
    render(<App />)
    
    // Check that all 4 tab buttons are rendered
    expect(screen.getByText('📞 Live Call 🔴')).toBeInTheDocument()
    expect(screen.getByText('👤 Senior Profile')).toBeInTheDocument()
    expect(screen.getByText('👥 Community')).toBeInTheDocument()
    expect(screen.getByText('📊 Analytics')).toBeInTheDocument()
  })

  it('active tab highlighted with blue underline', () => {
    render(<App />)
    
    // Live Call should be active by default
    const liveCallTab = screen.getByText('📞 Live Call 🔴').closest('button')
    expect(liveCallTab).toHaveClass('border-blue-500', 'text-blue-600')
    
    // Other tabs should not be highlighted
    const profileTab = screen.getByText('👤 Senior Profile').closest('button')
    const communityTab = screen.getByText('👥 Community').closest('button')
    const analyticsTab = screen.getByText('📊 Analytics').closest('button')
    
    expect(profileTab).toHaveClass('border-transparent', 'text-gray-600')
    expect(communityTab).toHaveClass('border-transparent', 'text-gray-600')
    expect(analyticsTab).toHaveClass('border-transparent', 'text-gray-600')
  })

  it('clicking tab switches view', () => {
    render(<App />)
    
    // Initially Live Call view should be shown
    expect(screen.getByTestId('live-call-view')).toBeInTheDocument()
    expect(screen.queryByTestId('senior-profile-view')).not.toBeInTheDocument()
    
    // Click on Senior Profile tab
    const profileTab = screen.getByText('👤 Senior Profile')
    fireEvent.click(profileTab)
    
    // Senior Profile view should now be shown
    expect(screen.getByTestId('senior-profile-view')).toBeInTheDocument()
    expect(screen.queryByTestId('live-call-view')).not.toBeInTheDocument()
    
    // Click on Community tab
    const communityTab = screen.getByText('👥 Community')
    fireEvent.click(communityTab)
    
    // Community view should now be shown
    expect(screen.getByTestId('community-view')).toBeInTheDocument()
    expect(screen.queryByTestId('senior-profile-view')).not.toBeInTheDocument()
    
    // Click on Analytics tab
    const analyticsTab = screen.getByText('📊 Analytics')
    fireEvent.click(analyticsTab)
    
    // Analytics view should now be shown
    expect(screen.getByTestId('analytics-view')).toBeInTheDocument()
    expect(screen.queryByTestId('community-view')).not.toBeInTheDocument()
  })

  it('smooth transitions between views', () => {
    render(<App />)
    
    // Check that the main container has transition classes
    const mainElement = screen.getByRole('main')
    expect(mainElement).toHaveClass('transition-all', 'duration-300')
    
    // Check that tab buttons have transition classes
    const liveCallTab = screen.getByText('📞 Live Call 🔴').closest('button')
    expect(liveCallTab).toHaveClass('transition-colors')
    
    const profileTab = screen.getByText('👤 Senior Profile').closest('button')
    expect(profileTab).toHaveClass('transition-colors')
    
    const communityTab = screen.getByText('👥 Community').closest('button')
    expect(communityTab).toHaveClass('transition-colors')
    
    const analyticsTab = screen.getByText('📊 Analytics').closest('button')
    expect(analyticsTab).toHaveClass('transition-colors')
  })
})
