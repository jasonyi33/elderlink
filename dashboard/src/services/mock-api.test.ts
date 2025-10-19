import { describe, it, expect } from 'vitest'
import { getMrsChenProfile, getMatchProfiles, getWellnessMetrics } from './mock-api'
import type { SeniorProfile } from '../types'

describe('Mock API', () => {
  describe('Mrs. Chen Profile', () => {
    it('mock Mrs. Chen profile matches structure', () => {
      const profile = getMrsChenProfile()
      
      // Verify basic structure
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('name')
      expect(profile).toHaveProperty('age')
      expect(profile).toHaveProperty('phone')
      expect(profile).toHaveProperty('languages')
      expect(profile).toHaveProperty('location')
      expect(profile).toHaveProperty('memories')
      expect(profile).toHaveProperty('socialProfile')
      expect(profile).toHaveProperty('healthData')
      expect(profile).toHaveProperty('matches')
      expect(profile).toHaveProperty('groups')
      expect(profile).toHaveProperty('conversations')
      expect(profile).toHaveProperty('wellnessMetrics')
      
      // Verify specific values
      expect(profile.name).toBe('Mrs. Chen')
      expect(profile.age).toBe(72)
      expect(profile.location).toBe('Seattle, WA')
      expect(profile.languages).toContain('english')
      expect(profile.languages).toContain('mandarin')
    })

    it('mock includes 5 conversations with health mentions', () => {
      const profile = getMrsChenProfile()
      
      // Verify exactly 5 conversations
      expect(profile.conversations).toHaveLength(5)
      
      // Verify each conversation has health mentions
      profile.conversations.forEach((conv, index) => {
        expect(conv).toHaveProperty('timestamp')
        expect(conv).toHaveProperty('sentiment')
        expect(conv).toHaveProperty('summary')
        expect(conv).toHaveProperty('language')
        expect(conv.healthMentions).toBeDefined()
        expect(conv.healthMentions!.length).toBeGreaterThan(0)
      })
      
      // Verify specific health mentions from PRD
      const healthMentions = profile.conversations.flatMap(c => c.healthMentions || [])
      expect(healthMentions.some(h => h.includes('knees') || h.includes('knee'))).toBe(true)
      expect(healthMentions.some(h => h.includes('medication') || h.includes('pills'))).toBe(true)
      expect(healthMentions.some(h => h.includes('arthritis'))).toBe(true)
      expect(healthMentions.some(h => h.includes('blood sugar') || h.includes('checkup'))).toBe(true)
      expect(healthMentions.some(h => h.includes('tired') || h.includes('social'))).toBe(true)
    })

    it('mock includes 3 match profiles', () => {
      const matches = getMatchProfiles()
      
      // Verify exactly 3 matches
      expect(matches).toHaveLength(3)
      
      // Verify each match has required structure
      matches.forEach(match => {
        expect(match).toHaveProperty('id')
        expect(match).toHaveProperty('name')
        expect(match).toHaveProperty('age')
        expect(match).toHaveProperty('location')
        expect(match).toHaveProperty('socialProfile')
        expect(match.socialProfile).toHaveProperty('interests')
        expect(match.socialProfile).toHaveProperty('culturalBackground')
      })
      
      // Verify specific match profiles from PRD
      const names = matches.map(m => m.name)
      expect(names).toContain('Mrs. Lee')
      expect(names).toContain('Mr. Wang')
      expect(names).toContain('Mrs. Kim')
      
      // Verify Mrs. Lee has high compatibility
      const mrsLee = matches.find(m => m.name === 'Mrs. Lee')
      expect(mrsLee).toBeDefined()
      expect(mrsLee!.socialProfile.interests).toContain('gardening')
      expect(mrsLee!.socialProfile.interests).toContain('piano')
      expect(mrsLee!.socialProfile.culturalBackground).toContain('Mandarin')
    })

    it('mock wellness metrics present', () => {
      const metrics = getWellnessMetrics()
      
      // Verify structure
      expect(metrics).toHaveProperty('mentalHealth')
      expect(metrics).toHaveProperty('physicalHealth')
      expect(metrics).toHaveProperty('socialHealth')
      expect(metrics).toHaveProperty('holisticScore')
      expect(metrics).toHaveProperty('lastCallDate')
      expect(metrics).toHaveProperty('callFrequency')
      
      // Verify mental health metrics
      expect(metrics.mentalHealth).toHaveProperty('lonelinessScore')
      expect(metrics.mentalHealth).toHaveProperty('averageSentiment')
      expect(metrics.mentalHealth).toHaveProperty('trend')
      
      // Verify physical health metrics
      expect(metrics.physicalHealth).toHaveProperty('symptomMentions')
      expect(metrics.physicalHealth).toHaveProperty('medicationAdherence')
      expect(metrics.physicalHealth).toHaveProperty('appointmentReminders')
      
      // Verify social health metrics
      expect(metrics.socialHealth).toHaveProperty('matchesMade')
      expect(metrics.socialHealth).toHaveProperty('groupsJoined')
      expect(metrics.socialHealth).toHaveProperty('communityEngagement')
      
      // Verify holistic score is within valid range
      expect(metrics.holisticScore).toBeGreaterThanOrEqual(0)
      expect(metrics.holisticScore).toBeLessThanOrEqual(100)
    })
  })
})
