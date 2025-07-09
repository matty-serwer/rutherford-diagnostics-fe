'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Test } from '@/types'

/**
 * TestChart Component
 * Displays a line chart for a single test's parameters over time
 * Each parameter has its own datePerformed and value
 */

interface TestChartProps {
  test: Test // Single test with time-series parameters
}

export function TestChart({ test }: TestChartProps) {
  // Prepare chart data from the test's parameters array
  const chartData = test.parameters.map((parameter) => ({
    date: parameter.datePerformed,
    value: parameter.value,
    displayDate: new Date(parameter.datePerformed).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    parameterId: parameter.id
  }))

  // Sort by date (oldest first for proper line chart progression)
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Chart configuration for shadcn chart
  const chartConfig = {
    value: {
      label: test.parameterName,
      color: "#2563eb",
    },
  } satisfies ChartConfig

  // If no parameter data, show message
  if (chartData.length === 0) {
    return (
      <Card data-testid={`test-chart-${test.id}`}>
        <CardHeader>
          <CardTitle className="text-lg" data-testid="chart-title">{test.parameterName}</CardTitle>
          <CardDescription data-testid="chart-description">
            {test.name} • {test.unit}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500" data-testid="no-data-message">No measurement data available for this test</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate Y-axis domain to include reference ranges
  const values = chartData.map(d => d.value)
  const minValue = Math.min(...values, test.referenceMin)
  const maxValue = Math.max(...values, test.referenceMax)
  const padding = (maxValue - minValue) * 0.1
  const yDomain = [minValue - padding, maxValue + padding]

  return (
    <Card data-testid={`test-chart-${test.id}`}>
      <CardHeader>
        <CardTitle className="text-lg" data-testid="chart-title">{test.parameterName}</CardTitle>
        <CardDescription data-testid="chart-description">
          {test.name} • {test.unit}
        </CardDescription>
        <div className="flex gap-4 text-sm" data-testid="chart-metadata">
          <span className="text-gray-600" data-testid="reference-range">
            Reference Range: {test.referenceMin} - {test.referenceMax} {test.unit}
          </span>
          <span className="text-gray-600" data-testid="measurement-count">
            {chartData.length} measurement{chartData.length !== 1 ? 's' : ''} recorded
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full" data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 12 }}
                label={{ value: test.unit, angle: -90, position: 'insideLeft' }}
              />

              {/* Reference range lines */}
              <ReferenceLine
                y={test.referenceMin}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Min", position: "insideTopRight" }}
              />
              <ReferenceLine
                y={test.referenceMax}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Max", position: "insideBottomRight" }}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Date: ${value}`}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)} ${test.unit}`,
                      test.parameterName
                    ]}
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-value)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 