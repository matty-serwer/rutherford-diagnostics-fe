'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TestDetails } from '../TestDetails'
import { TestSummary } from '@/types'

/**
 * PatientTestsSection Component
 * Displays patient tests and handles clicking to show detailed charts
 * Manages the state for showing/hiding test details
 */

interface PatientTestsSectionProps {
  tests: TestSummary[]
  patientName: string
}

export function PatientTestsSection({ tests, patientName }: PatientTestsSectionProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedTestIds, setSelectedTestIds] = useState<number[]>([])

  // Handle clicking on a test to show details
  const handleTestClick = (testId: number) => {
    const allTestIds = tests.map(test => test.id)
    setSelectedTestIds(allTestIds)
    setShowDetails(true)
  }

  // Handle closing the details view
  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedTestIds([])
  }

  if (tests.length === 0) {
    return (
      <Card data-testid="patient-tests-section">
        <CardHeader>
          <CardTitle data-testid="section-title">Test History</CardTitle>
          <CardDescription data-testid="section-description">
            Medical tests performed for {patientName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600" data-testid="no-tests-message">
            This patient does not have any tests on file.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6" data-testid="patient-tests-section">
      <Card>
        <CardHeader>
          <CardTitle data-testid="section-title">Test History</CardTitle>
          <CardDescription data-testid="section-description">
            Medical tests performed for {patientName} - Click on any test to view detailed charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" data-testid="tests-list">
            {tests.map((test: TestSummary) => (
              <Button
                key={test.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleTestClick(test.id)}
                data-testid={`test-button-${test.id}`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-medium" data-testid={`test-name-${test.id}`}>{test.name}</p>
                    <p className="text-sm text-gray-600" data-testid={`test-id-${test.id}`}>Test ID: {test.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Click to view charts</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Show detailed test results when a test is clicked */}
      {showDetails && (
        <div data-testid="test-details-section">
          <TestDetails
            testIds={selectedTestIds}
            patientName={patientName}
            onClose={handleCloseDetails}
          />
        </div>
      )}
    </div>
  )
} 