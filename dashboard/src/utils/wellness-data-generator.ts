import type { WellnessDataPoint } from '../components/WellnessTrendChart'

/**
 * Generates realistic 30-day wellness trend data based on the senior's current metrics
 * Shows gradual improvement in mental and social health, stable physical health
 */
export function generate30DayWellnessData(
  currentMental: number = 82,
  currentPhysical: number = 75,
  currentSocial: number = 85
): WellnessDataPoint[] {
  const data: WellnessDataPoint[] = []
  const today = new Date('2025-01-19') // Current date for demo

  // Calculate starting values (30 days ago)
  // Mental health improved by ~15 points over 30 days
  const mentalStart = currentMental - 15
  // Physical health remained stable (±3 points)
  const physicalStart = currentPhysical - 2
  // Social health improved by ~10 points over 30 days
  const socialStart = currentSocial - 10

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Calculate progress through the 30 days (0 to 1)
    const progress = (29 - i) / 29

    // Mental health: gradual improvement with some variance
    // Add a boost around day 20 (family visit)
    const familyVisitBoost = i <= 9 ? 5 : 0
    const mental = Math.round(
      mentalStart +
      (currentMental - mentalStart) * progress +
      familyVisitBoost +
      (Math.random() - 0.5) * 3 // Small random variance
    )

    // Physical health: mostly stable with minor fluctuations
    // Slight improvement after medication started (day 15)
    const medicationEffect = i <= 14 ? 2 : 0
    const physical = Math.round(
      physicalStart +
      (currentPhysical - physicalStart) * progress +
      medicationEffect +
      (Math.random() - 0.5) * 4 // Small random variance
    )

    // Social health: improvement after community matching (day 10)
    const communityBoost = i <= 10 ? 8 : 0
    const social = Math.round(
      socialStart +
      (currentSocial - socialStart) * progress +
      communityBoost +
      (Math.random() - 0.5) * 3 // Small random variance
    )

    data.push({
      date: date.toISOString().split('T')[0],
      mental: Math.max(0, Math.min(100, mental)),
      physical: Math.max(0, Math.min(100, physical)),
      social: Math.max(0, Math.min(100, social)),
    })
  }

  return data
}

/**
 * Get annotations for significant events in the 30-day period
 */
export function getWellnessAnnotations() {
  const today = new Date('2025-01-19')

  return [
    {
      date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Family visit',
      type: 'warning' as const,
    },
    {
      date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Started medication',
      type: 'success' as const,
    },
    {
      date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Community match',
      type: 'primary' as const,
    },
  ]
}
