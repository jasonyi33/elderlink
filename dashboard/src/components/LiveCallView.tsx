import React, { useState, useEffect } from 'react'

interface LiveSentiment {
  sentiment: number
  emotions: string[]
  language: string
  timestamp: string
  transcript?: Array<{
    role: 'senior' | 'sam'
    content: string
  }>
}

export default function LiveCallView() {
  const [sentiment, setSentiment] = useState(0)
  const [emotions, setEmotions] = useState<string[]>([])
  const [language, setLanguage] = useState('english')
  const [transcript, setTranscript] = useState<Array<{role: 'senior' | 'sam', content: string}>>([])
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const fetchLiveSentiment = async () => {
      try {
        const res = await fetch('/api/sentiment/live')
        if (!res.ok) {
          throw new Error('Network error')
        }
        const data: LiveSentiment = await res.json()
        setSentiment(data.sentiment || 0)
        setEmotions(data.emotions || [])
        setLanguage(data.language || 'english')
        if (data.transcript) {
          setTranscript(data.transcript.slice(-2)) // Last 2 exchanges
        }
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to fetch live sentiment:', error)
        setIsConnected(false)
      }
    }

    // Initial fetch
    fetchLiveSentiment()

    // Set up polling every 2 seconds
    const interval = setInterval(fetchLiveSentiment, 2000)

    return () => clearInterval(interval)
  }, [])

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0) return 'bg-green-500'
    if (sentiment < 0) return 'bg-red-500'
    return 'bg-yellow-500'
  }

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment > 0) return '😊'
    if (sentiment < 0) return '😔'
    return '😐'
  }

  const getLanguageFlag = (lang: string) => {
    return lang === 'mandarin' ? '🇨🇳 Mandarin' : '🇺🇸 English'
  }

  return (
    <div data-testid="live-call-view" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Live Call - Mrs. Chen</h2>
        <span className="flex items-center text-red-600 font-medium">
          <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">Connection lost. Attempting to reconnect...</p>
        </div>
      )}

      {/* Sentiment Meter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Real-time Sentiment
        </label>
        <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden">
          <div
            role="progressbar"
            className={`absolute h-full transition-all duration-500 ${getSentimentColor(sentiment)}`}
            style={{
              width: `${Math.abs(sentiment) * 100}%`,
              left: sentiment < 0 ? '0' : '50%',
              right: sentiment > 0 ? '0' : '50%'
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
            {getSentimentEmoji(sentiment)} {sentiment.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Detected Emotions */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Detected Emotions
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.length > 0 ? (
            emotions.map((emotion, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in"
              >
                {emotion}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No emotions detected yet</span>
          )}
        </div>
      </div>

      {/* Language Indicator */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Language
        </label>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {getLanguageFlag(language)}
        </span>
      </div>

      {/* Current Transcript */}
      {transcript.length > 0 && (
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Current Transcript
          </label>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {transcript.map((exchange, i) => (
              <div key={i} className="flex">
                <span className="font-medium text-gray-700 mr-2">
                  {exchange.role === 'senior' ? 'Mrs. Chen:' : 'Sam:'}
                </span>
                <span className="text-gray-600">{exchange.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
