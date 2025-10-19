import React, { useState, useEffect } from 'react'
import type { SeniorProfile } from '../types'

const API_BASE = process.env.REACT_APP_API_BASE || ''

export default function CommunityView() {
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`)
      const data = await res.json()
      setProfile(data.profile)

      // Fetch match details
      const matchDetails = await Promise.all(
        data.profile.matches.map(async (m: any) => {
          const matchRes = await fetch(`${API_BASE}/api/senior/${m.seniorId}`)
          const matchData = await matchRes.json()
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
    <div data-testid="community-view" className="space-y-6">
      {/* Social Profile Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          {profile.name}'s Social Profile
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Interests</label>
            <div className="flex flex-wrap gap-1">
              {profile.socialProfile.interests.map((int: string, i: number) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {int}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Cultural Background</label>
            <p className="text-sm font-medium">{profile.socialProfile.culturalBackground}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Location</label>
            <p className="text-sm font-medium">{profile.location}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Open to connecting</label>
            <p className="text-sm font-medium text-green-600">
              {profile.socialProfile.openToMatching ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Social Health Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Social Health Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{profile.wellnessMetrics.socialHealth.matchesMade}</div>
            <div className="text-sm text-gray-600">Matches Made</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{profile.wellnessMetrics.socialHealth.communityEngagement}/100</div>
            <div className="text-sm text-gray-600">Community Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{profile.wellnessMetrics.socialHealth.groupsJoined}</div>
            <div className="text-sm text-gray-600">Groups Joined</div>
          </div>
        </div>
      </div>

      {/* Recommended Matches */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Suggested Groups</h3>
          <div className="space-y-3">
            {profile.groups.map((group: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-900">{group.name}</p>
                  <p className="text-sm text-green-700">
                    {group.memberCount} members • {group.language} • {group.schedule}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {group.language === 'Mandarin' ? '🀄' : '🇺🇸'}
                  </span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
          👤
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{match.name}, {match.age}</h4>
        <p className="text-sm text-gray-600">{match.socialProfile.culturalBackground.replace(', ', ' | ')}</p>
      </div>

      {/* Compatibility Score */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-blue-600">{matchInfo.score}%</div>
        <div className="text-yellow-500">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <p className="text-sm font-medium text-gray-700 capitalize">
          {matchInfo.compatibility} Compatibility
        </p>
      </div>

      {/* Compatibility Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              compatibilityColor === 'green' ? 'bg-green-500' :
              compatibilityColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${matchInfo.score}%` }}
          />
        </div>
      </div>

      {/* Shared Interests */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-1">Shared Interests:</label>
        <div className="flex flex-wrap gap-1">
          {matchInfo.sharedInterests.map((int: string, i: number) => (
            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {int}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-1">Suggested Groups:</label>
        <p className="text-xs text-gray-700">
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
        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
          View Profile
        </button>
        <button 
          className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          Facilitate Connection
        </button>
      </div>
    </div>
  )
}
