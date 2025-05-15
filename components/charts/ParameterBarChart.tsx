'use client'

import { Parameter } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'

interface ParameterBarChartProps {
  parameter: Parameter
  height?: number
  showReferenceRanges?: boolean
}

export function ParameterBarChart({
  parameter,
  height = 300,
  showReferenceRanges = true,
}: ParameterBarChartProps) {
  // Get the latest value
  const latestResult = parameter.history
    .sort((a, b) => new Date(b.resultDate).getTime() - new Date(a.resultDate).getTime())[0]

  // Determine if value is within range
  const isWithinRange =
    latestResult.value >= parameter.referenceMin &&
    latestResult.value <= parameter.referenceMax

  // Calculate y-axis domain with padding
  const padding = Math.max(
    Math.abs(parameter.referenceMax - parameter.referenceMin) * 0.2,
    Math.abs(latestResult.value - parameter.referenceMin) * 0.2,
    Math.abs(latestResult.value - parameter.referenceMax) * 0.2
  )
  const yDomain = [
    Math.min(parameter.referenceMin - padding, latestResult.value - padding),
    Math.max(parameter.referenceMax + padding, latestResult.value + padding),
  ]

  // Format data for the chart
  const data = [
    {
      name: parameter.name,
      value: latestResult.value,
    },
  ]

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">
        {parameter.name} ({parameter.unit})
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            label={{
              value: parameter.unit,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} ${parameter.unit}`, parameter.name]}
          />
          {showReferenceRanges && (
            <>
              <ReferenceLine
                y={parameter.referenceMin}
                stroke="#FF8C00"
                strokeDasharray="3 3"
                label={{
                  value: `Min: ${parameter.referenceMin}`,
                  position: 'right',
                  fill: '#FF8C00',
                }}
              />
              <ReferenceLine
                y={parameter.referenceMax}
                stroke="#FF8C00"
                strokeDasharray="3 3"
                label={{
                  value: `Max: ${parameter.referenceMax}`,
                  position: 'right',
                  fill: '#FF8C00',
                }}
              />
            </>
          )}
          <Bar dataKey="value">
            <Cell fill={isWithinRange ? '#22c55e' : '#ef4444'} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-sm text-gray-500 mt-2">
        Latest value: {latestResult.value} {parameter.unit}{' '}
        <span
          className={`inline-block px-2 py-1 rounded ${isWithinRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
          {isWithinRange ? 'Within Range' : 'Out of Range'}
        </span>
      </div>
    </div>
  )
} 