import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders ElderLink Dashboard title', () => {
    render(<App />)
    expect(screen.getByText('ElderLink Dashboard')).toBeInTheDocument()
  })

  it('renders setup message', () => {
    render(<App />)
    expect(screen.getByText('Dashboard is being set up. React project initialized successfully!')).toBeInTheDocument()
  })
})
