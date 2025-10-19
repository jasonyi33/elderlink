import React, { useState, useEffect } from 'react'
import type { SeniorProfile } from '../types'

const API_BASE = process.env.REACT_APP_API_BASE || ''

export default function SeniorProfileView() {
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/mrs-chen`)
      const data = await res.json()
      setProfile(data.profile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  return (
    <div data-testid="senior-profile-view" className="space-y-6">
      {/* Personal Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <p className="text-lg font-medium">{profile.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Age</label>
            <p className="text-lg font-medium">{profile.age}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <p className="text-lg font-medium">{profile.location}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Languages</label>
            <p className="text-lg font-medium">{profile.languages.join(', ')}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <p className="text-lg font-medium">{profile.phone}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600 block mb-2">Family</label>
          <div className="space-y-2">
            {profile.memories.family.map((fm, i) => (
              <div key={i} className="flex items-start">
                <span className="text-2xl mr-2">👤</span>
                <div>
                  <p className="font-medium">{fm.name} ({fm.relationship})</p>
                  <p className="text-sm text-gray-600">{fm.details.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Overview Card */}
      <HealthOverviewCard healthData={profile.healthData} />

      {/* Interests Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Interests & Hobbies</h3>
        <div className="flex flex-wrap gap-2">
          {profile.memories.hobbies.map((hobby, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

      {/* Conversation History */}
      <ConversationHistoryCard conversations={profile.conversations} />
    </div>
  )
}

function HealthOverviewCard({ healthData }: { healthData: SeniorProfile['healthData'] }) {
  const [expanded, setExpanded] = useState({
    medications: true,
    conditions: true,
    appointments: true,
    vitals: true,
    notes: true
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Health Overview</h3>

      {/* Medications */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, medications: !e.medications}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.medications ? '▼' : '▶'} Medications ({healthData.medications.length})
          </span>
        </button>
        {expanded.medications && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.medications.map((med, i) => (
              <div key={i} className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium">{med.name} {med.dosage}</p>
                <p className="text-sm text-gray-600">{med.frequency} - {med.purpose}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, conditions: !e.conditions}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.conditions ? '▼' : '▶'} Conditions ({healthData.conditions.length})
          </span>
        </button>
        {expanded.conditions && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.conditions.map((cond, i) => (
              <div key={i} className="border-l-2 border-green-500 pl-3">
                <p className="font-medium">{cond.name}</p>
                <p className="text-sm text-gray-600">Since {cond.since} - {cond.status}</p>
                {cond.a1c && <p className="text-sm text-gray-600">A1C: {cond.a1c}</p>}
                {cond.locations && <p className="text-sm text-gray-600">Locations: {cond.locations.join(', ')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Appointment */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, appointments: !e.appointments}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.appointments ? '▼' : '▶'} Next Appointment
          </span>
        </button>
        {expanded.appointments && healthData.appointments[0] && (
          <div className="mt-2 ml-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="font-medium text-yellow-900">{healthData.appointments[0].type}</p>
            <p className="text-sm text-yellow-800">
              {healthData.appointments[0].date} at {healthData.appointments[0].time}
            </p>
            <p className="text-sm text-yellow-800">with {healthData.appointments[0].doctor}</p>
          </div>
        )}
      </div>

      {/* Latest Vitals */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(e => ({...e, vitals: !e.vitals}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.vitals ? '▼' : '▶'} Latest Vitals
          </span>
        </button>
        {expanded.vitals && (
          <div className="mt-2 ml-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-800 mb-2">Last updated: {healthData.vitals.lastUpdated}</p>
            <div className="grid grid-cols-2 gap-4">
              {healthData.vitals.bloodPressure && (
                <div>
                  <p className="text-sm font-medium text-green-900">Blood Pressure</p>
                  <p className="text-lg font-bold text-green-800">{healthData.vitals.bloodPressure}</p>
                </div>
              )}
              {healthData.vitals.weight && (
                <div>
                  <p className="text-sm font-medium text-green-900">Weight</p>
                  <p className="text-lg font-bold text-green-800">{healthData.vitals.weight}</p>
                </div>
              )}
              {healthData.vitals.bloodSugar && (
                <div>
                  <p className="text-sm font-medium text-green-900">Blood Sugar</p>
                  <p className="text-lg font-bold text-green-800">{healthData.vitals.bloodSugar}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Health Notes */}
      <div>
        <button
          onClick={() => setExpanded(e => ({...e, notes: !e.notes}))}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">
            {expanded.notes ? '▼' : '▶'} Recent Health Notes ({healthData.notes.length})
          </span>
        </button>
        {expanded.notes && (
          <div className="mt-2 space-y-3 ml-4">
            {healthData.notes.slice(-3).reverse().map((note, i) => (
              <div key={i} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-xs text-blue-600 mb-1">
                  {new Date(note.timestamp).toLocaleString()} - {note.source}
                </p>
                <p className="text-sm text-blue-900">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationHistoryCard({ conversations }: { conversations: SeniorProfile['conversations'] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h3 className="text-xl font-semibold text-gray-900">
          {expanded ? '▼' : '▶'} Conversation History
        </h3>
        <span className="text-sm text-gray-600">{conversations.length} conversations</span>
      </button>

      {expanded && (
        <div className="space-y-3">
          {conversations.slice(-5).reverse().map((conv, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  conv.sentiment > 0.3 ? 'bg-green-100 text-green-800' :
                  conv.sentiment < 0 ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Sentiment: {conv.sentiment.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{conv.summary}</p>
              <div className="flex flex-wrap gap-1">
                {conv.keyTopics?.map((topic, j) => (
                  <span key={j} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
              {conv.healthMentions && conv.healthMentions.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  🩺 Health: {conv.healthMentions.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
