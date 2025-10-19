import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WordCloud from './WordCloud';

describe('WordCloud Component', () => {
  const mockWords = [
    { text: 'Sarah', frequency: 15 },
    { text: 'tomatoes', frequency: 12 },
    { text: 'garden', frequency: 10 },
    { text: 'happy', frequency: 8 },
    { text: 'piano', frequency: 6 },
    { text: 'cooking', frequency: 5 },
    { text: 'family', frequency: 4 },
    { text: 'arthritis', frequency: 3 },
    { text: 'medication', frequency: 2 },
    { text: 'doctor', frequency: 1 }
  ];

  test('renders top 50 words', () => {
    const manyWords = Array.from({ length: 60 }, (_, i) => ({
      text: `word${i}`,
      frequency: Math.max(1, 60 - i)
    }));
    
    render(<WordCloud words={manyWords} />);
    
    // Should only show top 50 words
    const wordElements = screen.getAllByTestId('word-cloud-item');
    expect(wordElements).toHaveLength(50);
  });

  test('sizes based on frequency', () => {
    render(<WordCloud words={mockWords} />);
    
    // Check that words with higher frequency have larger font sizes
    const sarahElement = screen.getByText('Sarah');
    const doctorElement = screen.getByText('doctor');
    
    // Sarah has frequency 15, doctor has frequency 1
    // Size should be calculated as frequency^0.7
    const sarahSize = parseFloat(sarahElement.style.fontSize);
    const doctorSize = parseFloat(doctorElement.style.fontSize);
    
    expect(sarahSize).toBeGreaterThan(doctorSize);
  });

  test('updates when conversations change', () => {
    const { rerender } = render(<WordCloud words={mockWords} />);
    
    // Initial words
    expect(screen.getByText('Sarah')).toBeInTheDocument();
    expect(screen.getByText('tomatoes')).toBeInTheDocument();
    
    // New words
    const newWords = [
      { text: 'newWord', frequency: 20 },
      { text: 'anotherWord', frequency: 15 }
    ];
    
    rerender(<WordCloud words={newWords} />);
    
    // Should show new words
    expect(screen.getByText('newWord')).toBeInTheDocument();
    expect(screen.getByText('anotherWord')).toBeInTheDocument();
    
    // Old words should be gone
    expect(screen.queryByText('Sarah')).not.toBeInTheDocument();
    expect(screen.queryByText('tomatoes')).not.toBeInTheDocument();
  });

  test('handles empty data gracefully', () => {
    render(<WordCloud words={[]} />);
    
    // Should show empty state message
    expect(screen.getByText('No conversation data available')).toBeInTheDocument();
  });
});
