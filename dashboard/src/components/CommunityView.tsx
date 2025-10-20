import React, { useState, useEffect } from 'react'
import type { SeniorProfile } from '../types'
import { apiClient, apiUtils } from '../services/api-client'
import Icons from './ui/Icons'

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

      // Use match data directly - it already contains all needed info
      setMatches(data.profile.matches || [])
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
              {(profile.memories?.hobbies || profile.interests || []).map((int: string, i: number) => (
                <span key={i} className="badge-primary text-xs">
                  {int}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Languages</label>
            <p className="text-sm font-medium text-primary">{profile.languages?.join(', ') || 'English'}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Location</label>
            <p className="text-sm font-medium text-primary">{profile.location?.city || profile.location?.address || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-1">Open to connecting</label>
            <p className="text-sm font-medium text-primary">
              Yes
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
            <div className="text-3xl projector-text-3xl font-bold text-gray-900">{profile.wellnessMetrics.socialHealth.communityEngagement}/100</div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-6">
          {matches.map((match: any) => (
            <MatchCard key={match.seniorId || match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      {profile.groups && profile.groups.length > 0 && (
        <div className="card">
          <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Suggested Groups</h3>
          <div className="space-y-3">
            {profile.groups.map((group: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-md bg-success-light rounded-lg border-2 border-success-dark">
                <div>
                  <p className="font-semibold text-gray-900 text-base projector-text-lg">{group.name}</p>
                  <p className="text-sm projector-text-base text-gray-700">
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
  const stars = match.score >= 70 ? 5 : match.score >= 50 ? 4 : 3
  const compatibilityColor = match.score >= 70 ? 'success' : match.score >= 50 ? 'warning' : 'error'
  const compatibilityLabel = match.score >= 90 ? 'Excellent' : match.score >= 70 ? 'Very Good' : match.score >= 50 ? 'Good' : 'Fair'

  // Create cultural background from languages
  const culturalBackground = match.languages?.join(' | ') || 'English'

  // Get initials for avatar
  const initials = match.name.split(' ').map((n: string) => n[0]).join('')

  return (
    <div className="medical-card hover-lift group relative overflow-hidden">
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-teal/20 to-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

      <div className="relative px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white font-bold shadow-lg">
            {initials}
          </div>
          <h4 className="text-lg font-semibold text-primary">{match.name}, {match.age}</h4>
          <p className="text-caption text-text-muted uppercase tracking-wide">{culturalBackground}</p>
        </div>

        {/* Compatibility Score */}
        <div className="text-center mb-4 glass-card py-4">
          <div className="text-display font-display bg-gradient-to-r from-primary via-teal to-purple bg-clip-text text-transparent">
            {match.score}%
          </div>
          <div className="text-warning text-2xl mb-2">
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </div>
          <p className="text-caption uppercase tracking-wide font-semibold text-text-muted">
            {compatibilityLabel} Match
          </p>
        </div>

        {/* Compatibility Bar */}
        <div className="mb-4">
          <div className="w-full bg-clinical-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                compatibilityColor === 'success' ? 'bg-gradient-to-r from-success to-success-dark' :
                compatibilityColor === 'warning' ? 'bg-gradient-to-r from-warning to-warning-dark' :
                'bg-gradient-to-r from-error to-red-700'
              }`}
              style={{ width: `${match.score}%` }}
            />
          </div>
        </div>

        {/* Shared Interests */}
        <div className="mb-4">
          <label className="text-caption font-semibold text-text-muted block mb-2 uppercase tracking-wide">
            <Icons.heart size={14} className="inline mr-1" />
            Shared Interests
          </label>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {match.sharedInterests?.map((int: string, i: number) => (
              <span key={i} className="interest-tag text-xs break-words max-w-full">
                {int}
              </span>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="text-caption font-semibold text-text-muted block mb-1 uppercase tracking-wide">
            <Icons.hospital size={14} className="inline mr-1" />
            Location
          </label>
          <p className="text-sm text-primary flex items-center gap-2">
            <span className="font-medium">{match.location?.city}</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-muted">{match.location?.distance} mi</span>
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary text-sm">
            <Icons.userCircle size={16} />
            View Profile
          </button>
          <button className="btn-secondary text-sm" disabled>
            <Icons.users size={16} />
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}
