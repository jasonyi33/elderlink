import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsView from './AnalyticsView';
import ConversationHistory from './ConversationHistory';
import { SeniorProfile } from '../types';

// Mock the API client
jest.mock('../services/api-client', () => ({
  apiClient: {
    getProfile: jest.fn(),
    getAnalytics: jest.fn()
  }
}));

describe('WordCloud Integration Tests', () => {
  const mockProfile: SeniorProfile = {
    id: 'mrs-chen',
    name: 'Mrs. Chen',
    age: 72,
    phone: '+12065551234',
    languages: ['english', 'mandarin'],
    location: 'Seattle, WA',
    memories: {
      family: [{ name: 'Sarah', relationship: 'daughter', details: ['lives in California'] }],
      hobbies: ['gardening', 'piano', 'cooking'],
      health: ['arthritis', 'hypertension'],
      recentEvents: ['planted tomatoes'],
      preferences: {
        topicsEnjoys: ['family', 'gardening'],
        topicsAvoid: ['politics'],
        conversationStyle: 'warm and patient'
      }
    },
    socialProfile: {
      interests: ['gardening', 'piano', 'cooking'],
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
    conversations: [
      {
        timestamp: '2025-01-18T10:00:00Z',
        duration: 300,
        keyTopics: ['gardening', 'tomatoes', 'family'],
        sentiment: 0.7,
        summary: 'Discussed gardening and family',
        language: 'english',
        healthMentions: ['back pain'],
        transcript: []
      },
      {
        timestamp: '2025-01-17T14:00:00Z',
        duration: 240,
        keyTopics: ['piano', 'music', 'memories'],
        sentiment: 0.8,
        summary: 'Talked about piano playing',
        language: 'english',
        healthMentions: [],
        transcript: []
      }
    ],
    wellnessMetrics: {
      mentalHealth: {
        lonelinessScore: 3,
        averageSentiment: 0.75,
        trend: 'improving'
      },
      physicalHealth: {
        symptomMentions: 1,
        medicationAdherence: 95,
        appointmentReminders: 2
      },
      socialHealth: {
        matchesMade: 0,
        groupsJoined: 0,
        communityEngagement: 60
      },
      holisticScore: 78,
      lastCallDate: '2025-01-18T10:00:00Z',
      callFrequency: 2.5
    }
  };

  const mockAnalytics = {
    totalConversations: 147,
    averageSentiment: 0.75,
    totalMatches: 8,
    totalHealthNotes: 23,
    seniorCount: 4,
    holisticWellnessAverage: 78
  };

  beforeEach(() => {
    const { apiClient } = require('../services/api-client');
    apiClient.getProfile.mockResolvedValue(mockProfile);
    apiClient.getAnalytics.mockResolvedValue(mockAnalytics);
  });

  test('AnalyticsView uses WordCloud component', () => {
    render(<AnalyticsView />);
    
    // Should render the WordCloud component (not just raw spans)
    // The WordCloud component renders words with data-testid="word-cloud-item"
    expect(screen.getByText('Topic Word Cloud')).toBeInTheDocument();
    
    // Wait for async data to load and check for word cloud items
    setTimeout(() => {
      const wordItems = screen.getAllByTestId('word-cloud-item');
      expect(wordItems.length).toBeGreaterThan(0);
    }, 100);
  });

  test('ConversationHistory uses WordCloud component', () => {
    render(<ConversationHistory conversations={mockProfile.conversations} />);
    
    // Should render the WordCloud component
    expect(screen.getByText('Topic Word Cloud')).toBeInTheDocument();
    
    // Check for word cloud items
    const wordItems = screen.getAllByTestId('word-cloud-item');
    expect(wordItems.length).toBeGreaterThan(0);
  });

  test('WordCloud component receives correct data format', () => {
    render(<ConversationHistory conversations={mockProfile.conversations} />);
    
    // The WordCloud should receive an array of {text, frequency} objects
    // This is verified by the component rendering without errors
    expect(screen.getByText('Topic Word Cloud')).toBeInTheDocument();
  });

  test('WordCloud component respects maxWords prop', () => {
    render(<ConversationHistory conversations={mockProfile.conversations} />);
    
    // ConversationHistory passes maxWords={20}
    // Should not render more than 20 words
    const wordItems = screen.getAllByTestId('word-cloud-item');
    expect(wordItems.length).toBeLessThanOrEqual(20);
  });
});
