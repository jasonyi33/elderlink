import React, { useState, useEffect } from 'react'
import type { SeniorProfile } from '../types'
import HealthTimeline from './HealthTimeline'
import { apiClient } from '../services/api-client'

export default function SeniorProfileView() {
  const [profile, setProfile] = useState<SeniorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const data = await apiClient.fetchProfile('mrs-chen')
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
    <div data-testid="senior-profile-view" className="space-y-6 projector-optimized">
      {/* Personal Info Card */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-text-muted">Name</label>
            <p className="text-lg projector-text-lg font-medium text-primary">{profile.name}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Age</label>
            <p className="text-lg projector-text-lg font-medium text-primary">{profile.age}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Location</label>
            <p className="text-lg projector-text-lg font-medium text-primary">
              {typeof profile.location === 'string' ? profile.location : profile.location?.city || profile.location?.address || 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Languages</label>
            <p className="text-lg projector-text-lg font-medium text-primary">{profile.languages.join(', ')}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Phone</label>
            <p className="text-lg projector-text-lg font-medium text-primary">{profile.phoneNumber || profile.phone || 'Not specified'}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-text-muted block mb-2">Family</label>
          <div className="space-y-2">
            {(profile.memories?.family || []).map((fm: any, i: number) => (
              <div key={i} className="flex items-start">
                <span className="text-2xl mr-2">👤</span>
                <div>
                  <p className="font-medium text-primary">{fm.name} ({fm.relationship})</p>
                  {fm.details && fm.details.length > 0 && (
                    <p className="text-sm text-text-muted">{fm.details.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Overview Card */}
      <HealthOverviewCard healthData={profile.healthData} />

      {/* Wearable Watch Analytics Card */}
      <WearableAnalyticsCard />

      {/* Interests Card */}
      <div className="card">
        <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Interests & Hobbies</h3>
        <div className="flex flex-wrap gap-2">
          {profile.memories.hobbies.map((hobby, i) => (
            <span
              key={i}
              className="badge-primary font-semibold border-2 border-primary-900 transition-all duration-300 hover:scale-105"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

          {/* Health Timeline */}
          <HealthTimeline healthNotes={profile.healthData.notes} />

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
    <div className="card">
      <h3 className="text-xl projector-text-xl font-semibold card-section text-primary">Health Overview</h3>

      {/* Medications */}
      <div className="card-section">
        <button
          onClick={() => setExpanded(e => ({...e, medications: !e.medications}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.medications ? '▼' : '▶'} Medications ({healthData.medications.length})
          </span>
        </button>
        {expanded.medications && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.medications.map((med, i) => (
              <div key={i} className="border-l-4 border-primary-900 pl-3 bg-primary-50">
                <p className="font-medium text-primary-900">{med.name} {med.dosage}</p>
                <p className="text-sm text-text-muted-dark">{med.frequency} - {med.purpose}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="card-section">
        <button
          onClick={() => setExpanded(e => ({...e, conditions: !e.conditions}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.conditions ? '▼' : '▶'} Conditions ({healthData.conditions?.length || 0})
          </span>
        </button>
        {expanded.conditions && healthData.conditions && (
          <div className="mt-2 space-y-2 ml-4">
            {healthData.conditions.map((cond: any, i: number) => (
              <div key={i} className="border-l-4 border-success-dark pl-3 bg-success-light">
                <p className="font-medium text-gray-900">
                  {typeof cond === 'string' ? cond : cond.name}
                </p>
                {typeof cond === 'object' && cond.since && (
                  <p className="text-sm text-gray-700">Since {cond.since} - {cond.status}</p>
                )}
                {typeof cond === 'object' && cond.a1c && (
                  <p className="text-sm text-gray-700">A1C: {cond.a1c}</p>
                )}
                {typeof cond === 'object' && cond.locations && (
                  <p className="text-sm text-gray-700">Locations: {cond.locations.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Appointment */}
      {healthData.upcomingAppointments && healthData.upcomingAppointments.length > 0 && (
        <div className="card-section">
          <button
            onClick={() => setExpanded(e => ({...e, appointments: !e.appointments}))}
            className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
          >
            <span className="font-medium text-primary">
              {expanded.appointments ? '▼' : '▶'} Next Appointment
            </span>
          </button>
          {expanded.appointments && healthData.upcomingAppointments[0] && (
            <div className="mt-2 ml-4 p-3 bg-warning-light border-l-4 border-warning rounded">
              <p className="font-medium text-warning-dark">{healthData.upcomingAppointments[0].type || 'Appointment'}</p>
              <p className="text-sm text-warning-dark">
                {new Date(healthData.upcomingAppointments[0].date).toLocaleDateString()}
                {healthData.upcomingAppointments[0].time ? ` at ${healthData.upcomingAppointments[0].time}` : ''}
              </p>
              {(healthData.upcomingAppointments[0].provider || healthData.upcomingAppointments[0].doctor) && (
                <p className="text-sm text-warning-dark">
                  with {healthData.upcomingAppointments[0].provider || healthData.upcomingAppointments[0].doctor}
                </p>
              )}
              {healthData.upcomingAppointments[0].location && (
                <p className="text-sm text-warning-dark">📍 {healthData.upcomingAppointments[0].location}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Latest Vitals */}
      {healthData.vitals && (
        <div className="card-section">
          <button
            onClick={() => setExpanded(e => ({...e, vitals: !e.vitals}))}
            className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
          >
            <span className="font-medium text-primary">
              {expanded.vitals ? '▼' : '▶'} Latest Vitals
            </span>
          </button>
          {expanded.vitals && (
            <div className="mt-2 ml-4 p-3 bg-success-light border-l-4 border-success rounded">
              <p className="text-sm text-gray-700 mb-2">Last updated: {healthData.vitals.lastUpdated}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthData.vitals.bloodPressure && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Blood Pressure</p>
                    <p className="text-lg font-bold text-gray-900">{healthData.vitals.bloodPressure}</p>
                  </div>
                )}
                {healthData.vitals.weight && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weight</p>
                    <p className="text-lg font-bold text-gray-900">{healthData.vitals.weight}</p>
                  </div>
                )}
                {healthData.vitals.bloodSugar && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Blood Sugar</p>
                    <p className="text-lg font-bold text-gray-900">{healthData.vitals.bloodSugar}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Health Notes */}
      <div>
        <button
          onClick={() => setExpanded(e => ({...e, notes: !e.notes}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.notes ? '▼' : '▶'} Recent Health Notes ({healthData.notes.length})
          </span>
        </button>
        {expanded.notes && (
          <div className="mt-2 space-y-3 ml-4">
            {healthData.notes.slice(-3).reverse().map((note, i) => (
              <div key={i} className="p-3 bg-primary-light border-l-4 border-primary rounded">
                <p className="text-xs text-primary mb-1">
                  {new Date(note.timestamp).toLocaleString()} - {note.source}
                </p>
                <p className="text-sm text-primary-dark">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function WearableAnalyticsCard() {
  const [expanded, setExpanded] = useState({
    heartRate: true,
    bloodPressure: true,
    sleep: true
  })

  // Mocked wearable data - completely self-contained
  const mockData = {
    heartRate: {
      current: 72,
      average24h: 68,
      status: 'Normal',
      lastSync: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString() // 15 mins ago
    },
    bloodPressure: {
      systolic: 125,
      diastolic: 78,
      trend: 'Stable',
      lastReading: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleTimeString() // 2 hours ago
    },
    sleep: {
      lastNightHours: 7.2,
      quality: 85,
      deepSleepHours: 2.1,
      remSleepHours: 1.8,
      date: new Date(Date.now() - 1000 * 60 * 60 * 8).toLocaleDateString() // Last night
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between card-section">
        <h3 className="text-xl projector-text-xl font-semibold text-primary">
          ⌚ Wearable Watch Analytics
        </h3>
        <span className="text-xs text-success bg-success-light px-2 py-1 rounded">Connected</span>
      </div>

      {/* Heart Rate Section */}
      <div className="card-section">
        <button
          onClick={() => setExpanded(e => ({...e, heartRate: !e.heartRate}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.heartRate ? '▼' : '▶'} ❤️ Heart Rate
          </span>
          <span className="text-sm font-bold text-error">{mockData.heartRate.current} BPM</span>
        </button>
        {expanded.heartRate && (
          <div className="mt-2 ml-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-error rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Current</p>
                <p className="text-2xl font-bold text-error">{mockData.heartRate.current} BPM</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">24h Average</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.heartRate.average24h} BPM</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className="text-2xl font-bold text-success">{mockData.heartRate.status}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Last synced: {mockData.heartRate.lastSync}</p>
          </div>
        )}
      </div>

      {/* Blood Pressure Section */}
      <div className="card-section">
        <button
          onClick={() => setExpanded(e => ({...e, bloodPressure: !e.bloodPressure}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.bloodPressure ? '▼' : '▶'} 🩺 Blood Pressure
          </span>
          <span className="text-sm font-bold text-primary">
            {mockData.bloodPressure.systolic}/{mockData.bloodPressure.diastolic} mmHg
          </span>
        </button>
        {expanded.bloodPressure && (
          <div className="mt-2 ml-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Systolic</p>
                <p className="text-2xl font-bold text-primary">{mockData.bloodPressure.systolic}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Diastolic</p>
                <p className="text-2xl font-bold text-primary">{mockData.bloodPressure.diastolic}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Trend</p>
                <p className="text-2xl font-bold text-success">→ {mockData.bloodPressure.trend}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Last reading: {mockData.bloodPressure.lastReading}</p>
          </div>
        )}
      </div>

      {/* Sleep Patterns Section */}
      <div className="card-section">
        <button
          onClick={() => setExpanded(e => ({...e, sleep: !e.sleep}))}
          className="flex items-center justify-between w-full text-left transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
        >
          <span className="font-medium text-primary">
            {expanded.sleep ? '▼' : '▶'} 😴 Sleep Patterns
          </span>
          <span className="text-sm font-bold text-purple-600">{mockData.sleep.lastNightHours}h</span>
        </button>
        {expanded.sleep && (
          <div className="mt-2 ml-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Total Sleep</p>
                <p className="text-2xl font-bold text-purple-600">{mockData.sleep.lastNightHours} hours</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Sleep Quality</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-success">{mockData.sleep.quality}%</p>
                  <span className="text-xs bg-success text-white px-2 py-1 rounded">Excellent</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Deep Sleep</p>
                <p className="text-lg font-bold text-indigo-600">{mockData.sleep.deepSleepHours}h</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">REM Sleep</p>
                <p className="text-lg font-bold text-indigo-600">{mockData.sleep.remSleepHours}h</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Data from: {mockData.sleep.date}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationHistoryCard({ conversations }: { conversations: SeniorProfile['conversations'] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left card-section transition-all duration-300 hover:bg-neutral-dark p-2 rounded"
      >
        <h3 className="text-xl projector-text-xl font-semibold text-primary">
          {expanded ? '▼' : '▶'} Conversation History
        </h3>
        <span className="text-sm text-text-muted">{conversations.length} conversations</span>
      </button>

      {expanded && (
        <div className="space-y-3">
          {conversations.slice(-5).reverse().map((conv, i) => (
            <div key={i} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-primary">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </span>
                <span className={`badge ${
                  conv.sentiment > 0.3 ? 'badge-success' :
                  conv.sentiment < 0 ? 'badge-secondary' :
                  'badge-primary'
                }`}>
                  Sentiment: {conv.sentiment.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-text-muted mb-2">{conv.summary}</p>
              <div className="flex flex-wrap gap-1">
                {conv.keyTopics?.map((topic, j) => (
                  <span key={j} className="badge-primary text-xs">
                    {topic}
                  </span>
                ))}
              </div>
              {conv.healthMentions && conv.healthMentions.length > 0 && (
                <div className="mt-2 text-xs text-primary">
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
