import React, { useState, useEffect } from 'react'

const API_BASE = process.env.REACT_APP_API_BASE || ''

export default function LiveCallView() {
  const [sentiment, setSentiment] = useState(0)
  const [emotions, setEmotions] = useState<string[]>([])
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/api/sentiment/live`)
      const data = await res.json()
      setSentiment(data.sentiment || 0)
      setEmotions(data.emotions || [])
      setLanguage(data.language || 'english')
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Live Call - Mrs. Chen</h2>
        <span className="flex items-center text-red-600 font-medium">
          <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Sentiment Meter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Real-time Sentiment
        </label>
        <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-500 ${
              sentiment > 0 ? 'bg-green-500' : sentiment < 0 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{
              width: `${Math.abs(sentiment) * 100}%`,
              left: sentiment < 0 ? '0' : '50%',
              right: sentiment > 0 ? '0' : '50%'
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
            {sentiment > 0 ? '😊' : sentiment < 0 ? '😔' : '😐'} {sentiment.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Detected Emotions */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Detected Emotions
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in"
            >
              {emotion}
            </span>
          ))}
          {emotions.length === 0 && (
            <span className="text-gray-400 text-sm">No emotions detected yet</span>
          )}
        </div>
      </div>

      {/* Language Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Language:</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {language === 'mandarin' ? '中文 Mandarin' : 'English'}
        </span>
      </div>
    </div>
  )
}
