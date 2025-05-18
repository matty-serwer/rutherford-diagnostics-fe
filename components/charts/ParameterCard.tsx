'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Parameter } from '@/lib/types'
import { ParameterTrendChart } from './ParameterTrendChart'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface ParameterCardProps {
  parameter: Parameter
  className?: string
  onClose?: () => void
}

export function ParameterCard({ parameter, className, onClose }: ParameterCardProps) {
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
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${isWithinRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {latestValue} {parameter.unit}
          </span>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <div className="h-[1px] w-full bg-border mb-4" />
      <CardContent>
        <div className="h-[300px] w-full">
          <ParameterTrendChart parameter={parameter} height={300} />
        </div>
      </CardContent>
    </Card>
  )
} 