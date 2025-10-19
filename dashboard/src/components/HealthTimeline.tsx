import React from 'react'
import type { SeniorProfile } from '../types'

interface HealthTimelineProps {
  healthNotes: SeniorProfile['healthData']['notes']
}

export default function HealthTimeline({ healthNotes }: HealthTimelineProps) {
  // Sort notes by timestamp (newest first)
  const sortedNotes = [...healthNotes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'mild': return '⚠️'
      case 'moderate': return '⚠️⚠️'
      case 'severe': return '🚨'
      default: return '⚠️'
    }
  }

  const getMentionTagColor = (type: string) => {
    switch (type) {
      case 'symptom': return 'bg-red-100 text-red-800'
      case 'medication': return 'bg-green-100 text-green-800'
      case 'concern': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Sam AI Conversation': return 'Sam AI'
      case 'Manual Entry': return 'Manual'
      case 'Provider': return 'Provider'
      default: return source
    }
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Sam AI Conversation': return 'bg-blue-100 text-blue-800'
      case 'Manual Entry': return 'bg-purple-100 text-purple-800'
      case 'Provider': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div data-testid="health-timeline" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Health Timeline</h3>
        <a
          href="https://mychart.uwmedicine.org/portal"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          View in MyChart
        </a>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-6">
          {sortedNotes.map((note, index) => (
            <div key={index} data-testid="timeline-item" className="relative flex items-start">
              {/* Timeline dot */}
              <div className="relative z-10 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* Header with timestamp and source */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(note.source)}`}>
                      {getSourceBadge(note.source)}
                    </span>
                  </div>
                  
                  {/* Natural language note */}
                  <p className="text-gray-900 mb-3">{note.note}</p>
                  
                  {/* Structured mentions */}
                  {note.mentions && note.mentions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {note.mentions.map((mention, mentionIndex) => (
                        <div key={mentionIndex} className="flex items-center gap-1">
                          {mention.severity && (
                            <span className="text-sm">
                              {getSeverityIcon(mention.severity)}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMentionTagColor(mention.type)}`}>
                            {mention.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Context information */}
                  {note.mentions.some(m => m.context) && (
                    <div className="text-xs text-gray-500">
                      Context: {note.mentions.filter(m => m.context).map(m => m.context).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
