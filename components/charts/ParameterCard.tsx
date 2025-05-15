'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Parameter } from '@/lib/types'
import { ParameterTrendChart } from './ParameterTrendChart'

interface ParameterCardProps {
  parameter: Parameter
  className?: string
}

export function ParameterCard({ parameter, className }: ParameterCardProps) {
  const latestValue = [...parameter.history]
    .sort((a, b) => new Date(b.resultDate).getTime() - new Date(a.resultDate).getTime())[0]
    .value

  const isWithinRange =
    latestValue >= parameter.referenceMin && latestValue <= parameter.referenceMax

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {parameter.name} ({parameter.unit})
        </CardTitle>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${isWithinRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
          {latestValue} {parameter.unit}
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ParameterTrendChart parameter={parameter} height={200} />
        </div>
      </CardContent>
    </Card>
  )
} 