import React from 'react';

interface WordData {
  text: string;
  frequency: number;
}

interface WordCloudProps {
  words: WordData[];
  maxWords?: number;
  className?: string;
}

const WordCloud: React.FC<WordCloudProps> = ({ 
  words, 
  maxWords = 50, 
  className = '' 
}) => {
  // Handle empty data gracefully
  if (!words || words.length === 0) {
    return (
      <div className={`text-center text-gray-500 py-8 ${className}`}>
        <p>No conversation data available</p>
      </div>
    );
  }

  // Sort by frequency and take top maxWords
  const sortedWords = [...words]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, maxWords);

  // Calculate size range for dynamic sizing
  const maxFreq = Math.max(...sortedWords.map(w => w.frequency));
  const minFreq = Math.min(...sortedWords.map(w => w.frequency));
  const sizeRange = 24 - 12; // 12px to 24px range

  // Calculate font size based on frequency^0.7
  const getFontSize = (frequency: number): number => {
    if (maxFreq === minFreq) return 16; // All same size if no variation
    
    const normalizedFreq = (frequency - minFreq) / (maxFreq - minFreq);
    const scaledFreq = Math.pow(normalizedFreq, 0.7);
    return 12 + (scaledFreq * sizeRange);
  };

  // Phase 4: High-contrast PRD-compliant colors for projector visibility
  const getColorClass = (frequency: number): string => {
    const percentile = (frequency - minFreq) / (maxFreq - minFreq);

    if (percentile >= 0.8) return 'text-primary-900'; // Highest: #2C5570 (primary-900)
    if (percentile >= 0.6) return 'text-primary-dark'; // High: #2C5570 (primary-dark)
    if (percentile >= 0.4) return 'text-warning-dark'; // Medium: #E08B47 (warning-dark)
    if (percentile >= 0.2) return 'text-error-dark'; // Low: #C82333 (error-dark)
    return 'text-secondary-dark'; // Lowest: #0D1D2F (secondary-dark)
  };

  return (
    <div className={`flex flex-wrap gap-2 justify-center items-center p-4 ${className}`}>
      {sortedWords.map((word, index) => (
        <span
          key={`${word.text}-${index}`}
          data-testid="word-cloud-item"
          className={`inline-block px-2 py-1 rounded-full transition-all duration-300 hover:scale-105 ${getColorClass(word.frequency)}`}
          style={{
            fontSize: `${getFontSize(word.frequency)}px`,
            fontWeight: word.frequency > maxFreq * 0.7 ? 'bold' : 'normal'
          }}
          title={`Frequency: ${word.frequency}`}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
};

export default WordCloud;
