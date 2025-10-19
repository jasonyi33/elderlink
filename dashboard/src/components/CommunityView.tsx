import React, { useState, useEffect } from 'react'
import type { SeniorProfile } from '../types'
import { apiClient, apiUtils } from '../services/api-client'

export default function CommunityView() {
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await apiClient.fetchProfile('mrs-chen')
      setProfile(data.profile)

      // Fetch match details
      const matchDetails = await Promise.all(
        data.profile.matches.map(async (m: any) => {
          const matchData = await apiUtils.fetchSeniorProfile(m.seniorId)
          return { ...matchData, matchInfo: m }
        })
      )
      setMatches(matchDetails)
    } catch (error) {
      console.error('Failed to fetch community data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  return (
    <div data-testid="community-view" className="space-y-6 projector-optimized">
      {/* Social Profile Summary */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">
          {profile.name}'s Social Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-text-muted block mb-1">Interests</label>
            <div className="flex flex-wrap gap-1">
              {profile.socialProfile.interests.map((int: string, i: number) => (
                <span key={i} className="badge-primary text-xs">
                  {int}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Cultural Background</label>
            <p className="text-sm font-medium text-primary">{profile.socialProfile.culturalBackground}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Location</label>
            <p className="text-sm font-medium text-primary">{profile.location}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Open to connecting</label>
            <p className="text-sm font-medium text-success">
              {profile.socialProfile.openToMatching ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Social Health Metrics */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Social Health Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl projector-text-3xl font-bold text-primary">{profile.wellnessMetrics.socialHealth.matchesMade}</div>
            <div className="text-sm text-text-muted">Matches Made</div>
          </div>
          <div className="text-center">
            <div className="text-3xl projector-text-3xl font-bold text-success">{profile.wellnessMetrics.socialHealth.communityEngagement}/100</div>
            <div className="text-sm text-text-muted">Community Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl projector-text-3xl font-bold text-secondary">{profile.wellnessMetrics.socialHealth.groupsJoined}</div>
            <div className="text-sm text-text-muted">Groups Joined</div>
          </div>
        </div>
      </div>

      {/* Recommended Matches */}
      <div>
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">
          Recommended Matches ({matches.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      {profile.groups && profile.groups.length > 0 && (
        <div className="card">
          <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Suggested Groups</h3>
          <div className="space-y-3">
            {profile.groups.map((group: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-md bg-success-light rounded-lg border border-success">
                <div>
                  <p className="font-medium text-success-dark">{group.name}</p>
                  <p className="text-sm text-success-dark">
                    {group.memberCount} members • {group.language} • {group.schedule}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {group.language === 'Mandarin' ? '🀄' : '🇺🇸'}
                  </span>
                  <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-normal">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MatchCard({ match }: { match: any }) {
  const { matchInfo } = match
  const stars = matchInfo.score >= 70 ? 5 : matchInfo.score >= 50 ? 4 : 3
  const compatibilityColor = matchInfo.score >= 70 ? 'green' : matchInfo.score >= 50 ? 'yellow' : 'red'

  return (
    <div className="card hover:shadow-lg transition-normal">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-neutral rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
          👤
        </div>
        <h4 className="text-lg font-semibold text-text">{match.name}, {match.age}</h4>
        <p className="text-sm text-text-muted">{match.socialProfile.culturalBackground.replace(', ', ' | ')}</p>
      </div>

      {/* Compatibility Score */}
      <div className="text-center mb-4">
        <div className="text-2xl projector-text-2xl font-bold text-primary">{matchInfo.score}%</div>
        <div className="text-warning">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <p className="text-sm font-medium text-text capitalize">
          {matchInfo.compatibility} Compatibility
        </p>
      </div>

      {/* Compatibility Bar */}
      <div className="mb-4">
        <div className="w-full bg-neutral rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-normal ${
              compatibilityColor === 'green' ? 'bg-success' :
              compatibilityColor === 'yellow' ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${matchInfo.score}%` }}
          />
        </div>
      </div>

      {/* Shared Interests */}
      <div className="mb-4">
        <label className="text-xs font-medium text-text-muted block mb-1">Shared Interests:</label>
        <div className="flex flex-wrap gap-1">
          {matchInfo.sharedInterests.map((int: string, i: number) => (
            <span key={i} className="text-xs bg-primary-light text-primary-dark px-2 py-1 rounded">
              {int}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      <div className="mb-4">
        <label className="text-xs font-medium text-text-muted block mb-1">Suggested Groups:</label>
        <p className="text-xs text-text">
          {matchInfo.sharedInterests.includes('gardening') && matchInfo.sharedInterests.includes('Mandarin') 
            ? 'Mandarin Gardening Circle' 
            : matchInfo.sharedInterests.includes('piano') 
            ? 'Piano & Music Appreciation'
            : 'No groups suggested yet'
          }
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-primary text-white text-sm rounded hover:bg-primary-dark transition-normal">
          View Profile
        </button>
        <button 
          className="px-3 py-2 bg-success text-white text-sm rounded hover:bg-success-dark transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          Facilitate Connection
        </button>
      </div>
    </div>
  )
}
