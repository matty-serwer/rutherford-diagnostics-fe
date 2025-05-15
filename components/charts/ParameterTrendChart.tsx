'use client'

import { Parameter } from '@/lib/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'

interface ParameterTrendChartProps {
  parameter: Parameter
  height?: number
  showReferenceRanges?: boolean
}

export function ParameterTrendChart({
  parameter,
  height = 300,
  showReferenceRanges = true,
}: ParameterTrendChartProps) {
  // Sort history by date and format for chart
  const data = [...parameter.history]
    .sort((a, b) => new Date(a.resultDate).getTime() - new Date(b.resultDate).getTime())
    .map((record) => ({
      date: format(new Date(record.resultDate), 'MMM d, yyyy'),
      value: record.value,
    }))

  // Calculate y-axis domain with padding
  const minValue = Math.min(...parameter.history.map((h) => h.value))
  const maxValue = Math.max(...parameter.history.map((h) => h.value))
  const padding = (maxValue - minValue) * 0.1
  const yMin = Math.min(minValue - padding, parameter.referenceMin)
  const yMax = Math.max(maxValue + padding, parameter.referenceMax)

  // Calculate number of ticks based on range
  const range = yMax - yMin
  const tickCount = Math.min(Math.ceil(range) + 1, 8) // Cap at 8 ticks

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">
        {parameter.name} Trend ({parameter.unit})
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickCount={tickCount}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(1)}
            label={{
              value: parameter.unit,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} ${parameter.unit}`, parameter.name]}
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 