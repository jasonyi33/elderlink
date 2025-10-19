import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

export interface WellnessDataPoint {
  date: string
  mental: number
  physical: number
  social: number
}

export interface Annotation {
  date: string
  label: string
  type: 'warning' | 'success' | 'primary'
}

interface WellnessTrendChartProps {
  data: WellnessDataPoint[]
  height?: number
  annotations?: Annotation[]
}

export default function WellnessTrendChart({
  data,
  height = 256,
  annotations = []
}: WellnessTrendChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-primary mb-2">{formatDate(label)}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.name}:</span>
              <span className="font-bold">{entry.value}/100</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // Custom X-axis tick formatter
  const formatXAxis = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const day = date.getDate()
      // Show every 5th day
      if (day % 5 === 1) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      return ''
    } catch {
      return ''
    }
  }

  // Find annotation positions
  const getAnnotationPosition = (date: string) => {
    const index = data.findIndex(d => d.date === date)
    if (index === -1) return null
    return data[index]
  }

  return (
    <div data-testid="wellness-trend-chart" className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(29, 53, 87, 0.1)" />

          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke="var(--text-muted)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'var(--text-muted)' }}
          />

          <YAxis
            domain={[0, 100]}
            stroke="var(--text-muted)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'var(--text-muted)' }}
            label={{
              value: 'Wellness Score',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'var(--text-muted)', fontSize: '12px' }
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            height={36}
            iconType="line"
            formatter={(value) => (
              <span style={{ color: 'var(--text)', fontWeight: 600, textTransform: 'capitalize' }}>
                {value}
              </span>
            )}
          />

          {/* Wellness dimension lines */}
          <Line
            type="monotone"
            dataKey="mental"
            stroke="var(--chart-blue)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--chart-blue)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Mental"
          />

          <Line
            type="monotone"
            dataKey="physical"
            stroke="var(--chart-teal)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--chart-teal)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Physical"
          />

          <Line
            type="monotone"
            dataKey="social"
            stroke="var(--chart-purple)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--chart-purple)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Social"
          />

          {/* Reference lines for annotations */}
          {annotations.map((annotation, index) => {
            const position = getAnnotationPosition(annotation.date)
            if (!position) return null

            return (
              <ReferenceLine
                key={index}
                x={annotation.date}
                stroke="var(--text-muted)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Annotation labels positioned absolutely */}
      {annotations.map((annotation, index) => {
        const bgColorMap = {
          warning: 'bg-warning-light border-warning',
          success: 'bg-success-light border-success',
          primary: 'bg-primary-light border-primary',
        }
        const textColorMap = {
          warning: 'text-warning-dark',
          success: 'text-gray-900',
          primary: 'text-primary-dark',
        }

        // Position annotations at different vertical positions to avoid overlap
        const positions = [
          'top-4 left-1/4',
          'top-4 right-1/4',
          'bottom-4 left-1/2 transform -translate-x-1/2',
        ]

        return (
          <div
            key={index}
            className={`absolute ${positions[index % 3]} bg-white border rounded px-2 py-1 text-xs shadow-sm ${bgColorMap[annotation.type]}`}
          >
            <div className={`font-semibold ${textColorMap[annotation.type]}`}>
              {annotation.label}
            </div>
            <div className={textColorMap[annotation.type]}>
              {formatDate(annotation.date)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
