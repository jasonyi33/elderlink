/**
 * Loading Skeleton Components with Shimmer Effect
 * Used for graceful loading states across the dashboard
 */

import React from 'react'

export function CardSkeleton() {
  return (
    <div className="medical-card">
      <div className="card-header">
        <div className="skeleton" style={{ height: '24px', width: '200px', borderRadius: '8px' }} />
      </div>
      <div className="card-section">
        <div className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: '8px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '8px' }} />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: '32px', width: '32px', borderRadius: '50%', margin: '0 auto 12px' }} />
      <div className="skeleton" style={{ height: '28px', width: '80%', borderRadius: '8px', margin: '0 auto 8px' }} />
      <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '8px', margin: '0 auto' }} />
    </div>
  )
}

export function TimelineItemSkeleton() {
  return (
    <div className="flex items-start gap-6 mb-6">
      {/* Pulse marker skeleton */}
      <div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0 }} />

      {/* Content skeleton */}
      <div className="flex-1 glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton" style={{ height: '14px', width: '150px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '12px' }} />
        </div>
        <div className="skeleton" style={{ height: '16px', width: '100%', borderRadius: '8px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%', borderRadius: '8px' }} />
      </div>
    </div>
  )
}

export function MatchCardSkeleton() {
  return (
    <div className="medical-card">
      {/* Avatar skeleton */}
      <div className="text-center mb-4">
        <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ height: '20px', width: '120px', borderRadius: '8px', margin: '0 auto 8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '100px', borderRadius: '8px', margin: '0 auto' }} />
      </div>

      {/* Score skeleton */}
      <div className="glass-card p-4 mb-4">
        <div className="skeleton" style={{ height: '48px', width: '80px', borderRadius: '8px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ height: '14px', width: '100px', borderRadius: '8px', margin: '0 auto' }} />
      </div>

      {/* Interests skeleton */}
      <div className="mb-4">
        <div className="skeleton" style={{ height: '14px', width: '100px', borderRadius: '8px', marginBottom: '8px' }} />
        <div className="flex gap-2 flex-wrap">
          <div className="skeleton" style={{ height: '28px', width: '70px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '28px', width: '90px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '28px', width: '80px', borderRadius: '8px' }} />
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '10px' }} />
        <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '10px' }} />
      </div>
    </div>
  )
}

export function RadialChartSkeleton() {
  return (
    <div className="medical-card">
      <div className="card-header">
        <div className="skeleton" style={{ height: '24px', width: '250px', borderRadius: '8px' }} />
      </div>
      <div className="card-section flex flex-col items-center">
        {/* Chart circle skeleton */}
        <div className="skeleton" style={{ width: '300px', height: '300px', borderRadius: '50%', marginBottom: '24px' }} />

        {/* Legend skeleton */}
        <div className="flex gap-6">
          <div className="skeleton" style={{ height: '16px', width: '120px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '16px', width: '130px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '16px', width: '110px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  )
}

export default {
  CardSkeleton,
  StatCardSkeleton,
  TimelineItemSkeleton,
  MatchCardSkeleton,
  RadialChartSkeleton,
}
