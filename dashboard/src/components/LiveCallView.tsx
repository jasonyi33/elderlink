import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api-client'

export default function LiveCallView() {
  const [sentiment, setSentiment] = useState(0)
  const [emotions, setEmotions] = useState<string[]>([])
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await apiClient.fetchLiveSentiment()
        setSentiment(data.sentiment || 0)
        setEmotions(data.emotions || [])
        setLanguage(data.language || 'english')
      } catch (error) {
        console.error('Failed to fetch live sentiment:', error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card projector-optimized">
      <div className="flex items-center justify-between card-section">
        <h2 className="text-2xl projector-text-2xl font-semibold text-primary">Live Call - Mrs. Chen</h2>
        <span className="flex items-center text-secondary font-medium">
          <span className="w-3 h-3 bg-secondary rounded-full mr-2 animate-pulse-slow" />
          LIVE
        </span>
      </div>

      {/* Sentiment Meter */}
      <div className="card-section">
        <label className="text-sm font-medium text-text-muted mb-2 block">
          Real-time Sentiment
        </label>
        <div className="relative h-10 bg-neutral-dark rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-500 ${
              sentiment > 0 ? 'bg-success' : sentiment < 0 ? 'bg-secondary' : 'bg-warning'
            }`}
            style={{
              width: `${Math.abs(sentiment) * 100}%`,
              left: sentiment < 0 ? '0' : '50%',
              right: sentiment > 0 ? '0' : '50%'
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
            {sentiment > 0 ? '😊' : sentiment < 0 ? '😔' : '😐'} {sentiment.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Detected Emotions */}
      <div className="card-section">
        <label className="text-sm font-medium text-text-muted mb-2 block">
          Detected Emotions
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion, i) => (
            <span
              key={i}
              className="badge-primary animate-fade-in transition-all duration-300"
            >
              {emotion}
            </span>
          ))}
          {emotions.length === 0 && (
            <span className="text-text-muted text-sm">No emotions detected yet</span>
          )}
        </div>
      </div>

      {/* Language Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-muted">Language:</span>
        <span className="badge bg-info-light text-info">
          {language === 'mandarin' ? '中文 Mandarin' : 'English'}
        </span>
      </div>
    </div>
  )
}
