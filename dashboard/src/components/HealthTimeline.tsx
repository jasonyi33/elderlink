import React from 'react'
import type { SeniorProfile } from '../types'
import Icons from './ui/Icons'

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
      case 'symptom': return 'bg-secondary-light text-secondary-dark'
      case 'medication': return 'bg-blue-50 text-primary-dark'
      case 'concern': return 'bg-warning-light text-warning-dark'
      default: return 'bg-neutral text-text-muted'
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
      case 'Sam AI Conversation': return 'bg-primary-light text-primary-dark'
      case 'Manual Entry': return 'bg-warning-light text-warning-dark'
      case 'Provider': return 'bg-blue-50 text-primary-dark'
      default: return 'bg-neutral text-text-muted'
    }
  }

  return (
    <div data-testid="health-timeline" className="medical-card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icons.activity size={24} className="text-primary" />
          <h3 className="card-title">Clinical Health Timeline</h3>
        </div>
        <a
          href="https://mychart.uwmedicine.org/portal"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
        >
          <Icons.externalLink size={16} />
          View in MyChart
        </a>
      </div>

      <div className="card-section relative">
        {/* Vertical gradient timeline track */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-teal to-purple rounded-full opacity-30"></div>
        
        <div className="space-y-6">
          {sortedNotes.map((note, index) => (
            <div key={index} data-testid="timeline-item" className="relative flex items-start">
              {/* Animated pulse marker */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Pulse rings */}
                <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                <div className="absolute w-6 h-6 bg-primary/30 rounded-full animate-pulse"></div>
                {/* Center dot */}
                <div className="relative w-4 h-4 bg-gradient-to-br from-primary to-teal rounded-full shadow-glow-primary border-2 border-white"></div>
              </div>
              
              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="glass-card p-4 hover-lift">
                  {/* Header with timestamp and source */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icons.clock size={14} className="text-text-muted" />
                      <span className="text-caption text-text-muted font-mono">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className={`status-badge ${getSourceBadgeColor(note.source)}`}>
                      {getSourceBadge(note.source)}
                    </span>
                  </div>

                  {/* Natural language note */}
                  <p className="text-base text-primary leading-relaxed mb-3">{note.note}</p>
                  
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
                    <div className="text-xs text-text-muted">
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
