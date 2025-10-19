import React, { useState } from 'react'
import type { SeniorProfile } from '../types'
import WordCloud from './WordCloud'

interface ConversationHistoryProps {
  conversations: SeniorProfile['conversations']
}

export default function ConversationHistory({ conversations }: ConversationHistoryProps) {
  const [expandedConversation, setExpandedConversation] = useState<number | null>(null)

  // Sort conversations by timestamp (newest first) and limit to last 10
  const sortedConversations = [...conversations]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  // Generate word cloud data from all conversations
  const wordCloudData = generateWordCloud(conversations)

  // Generate wellness data for 30-day graph
  const wellnessData = generateWellnessData(conversations)

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'bg-success-light text-success-dark'
    if (sentiment < 0) return 'bg-secondary-light text-secondary-dark'
    return 'bg-warning-light text-warning-dark'
  }

  const getHealthMentionBadge = (mention: string) => {
    if (mention.includes('pain') || mention.includes('ache') || mention.includes('arthritis') || mention.includes('tired')) {
      return '🔴'
    }
    if (mention.includes('medication') || mention.includes('pills') || mention.includes('medicine')) {
      return '🔵'
    }
    return '🩺'
  }

  const toggleConversation = (index: number) => {
    setExpandedConversation(expandedConversation === index ? null : index)
  }

  return (
    <div data-testid="conversation-history" className="card">
      <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Conversation History</h3>

      {/* 30-Day Wellness Graph */}
      <div className="mb-8">
        <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">30-Day Wellness Trend</h4>
        <div 
          data-testid="wellness-graph"
          className="h-48 bg-neutral rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-text-muted mb-2">[Wellness trend graph showing sentiment over 30 days]</p>
            <div className="text-sm text-text-muted">
              <p>Average Sentiment: {wellnessData.averageSentiment.toFixed(2)}</p>
              <p>Trend: {wellnessData.trend}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Word Cloud */}
      <div className="mb-8">
        <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">Topic Word Cloud</h4>
        <WordCloud words={wordCloudData} maxWords={20} />
      </div>

      {/* Conversation Timeline */}
      <div className="space-y-4">
        <h4 className="text-lg projector-text-lg font-semibold text-primary card-section">Recent Conversations</h4>
        {sortedConversations.map((conv, index) => (
          <div 
            key={index} 
            data-testid="conversation-item"
            className="border-l-4 border-primary pl-4 py-3 cursor-pointer hover:bg-neutral-dark rounded-r-lg transition-normal"
            onClick={() => toggleConversation(index)}
          >
            {/* Conversation Header */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-primary">
                {new Date(conv.timestamp).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(conv.sentiment)}`}>
                Sentiment: {conv.sentiment.toFixed(2)}
              </span>
            </div>

            {/* Summary */}
            <p className="text-sm text-text-muted mb-2">{conv.summary}</p>

            {/* Key Topics */}
            <div className="flex flex-wrap gap-1 mb-2">
              {conv.keyTopics?.map((topic, j) => (
                <span key={j} className="badge-primary text-xs">
                  {topic}
                </span>
              ))}
            </div>

            {/* Health Mentions */}
            {conv.healthMentions && conv.healthMentions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {conv.healthMentions.map((mention, k) => (
                  <span key={k} className="text-xs bg-secondary-light text-secondary-dark px-2 py-1 rounded">
                    {getHealthMentionBadge(mention)} {mention}
                  </span>
                ))}
              </div>
            )}

            {/* Expandable Transcript */}
            {expandedConversation === index && conv.transcript && (
              <div className="mt-3 p-3 bg-neutral rounded-lg">
                <h5 className="text-sm font-semibold text-primary mb-2">Full Transcript:</h5>
                <div className="space-y-2">
                  {conv.transcript.map((exchange, l) => (
                    <div key={l} className="text-xs">
                      <span className={`font-medium ${
                        exchange.role === 'senior' ? 'text-primary' : 'text-success'
                      }`}>
                        {exchange.role === 'senior' ? 'Mrs. Chen' : 'Sam'}:
                      </span>
                      <span className="ml-2 text-text-muted">{exchange.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Click indicator */}
            <div className="text-xs text-text-muted mt-1">
              {expandedConversation === index ? 'Click to collapse' : 'Click to expand transcript'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to generate word cloud data
function generateWordCloud(conversations: SeniorProfile['conversations']): Array<{text: string, frequency: number}> {
  const wordCount: {[key: string]: number} = {}
  
  conversations.forEach(conv => {
    if (conv.keyTopics) {
      conv.keyTopics.forEach((topic: string) => {
        const words = topic.toLowerCase().split(/\s+/)
        words.forEach(word => {
          if (word.length > 2) { // Filter out short words
            wordCount[word] = (wordCount[word] || 0) + 1
          }
        })
      })
    }
  })

  return Object.entries(wordCount)
    .map(([text, frequency]) => ({ text, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 50) // Top 50 words
}

// Helper function to generate wellness data
function generateWellnessData(conversations: SeniorProfile['conversations']) {
  const recentConversations = conversations.slice(-10)
  const averageSentiment = recentConversations.reduce((sum, c) => sum + c.sentiment, 0) / recentConversations.length
  
  // Simple trend calculation
  const firstHalf = recentConversations.slice(0, Math.floor(recentConversations.length / 2))
  const secondHalf = recentConversations.slice(Math.floor(recentConversations.length / 2))
  
  const firstHalfAvg = firstHalf.reduce((sum, c) => sum + c.sentiment, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, c) => sum + c.sentiment, 0) / secondHalf.length
  
  let trend = 'stable'
  if (secondHalfAvg > firstHalfAvg + 0.1) trend = 'improving'
  else if (secondHalfAvg < firstHalfAvg - 0.1) trend = 'declining'

  return {
    averageSentiment,
    trend
  }
}
