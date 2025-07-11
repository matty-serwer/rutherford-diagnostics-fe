'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TestChart } from '../TestChart'
import { getTestById } from '@/lib/api'
import { Test } from '@/types'

/**
 * TestDetails Component
 * Displays detailed information for all tests of a patient
 * Each test contains time-series parameter data to be charted
 */

interface TestDetailsProps {
  testIds: number[]
  patientName: string
  onClose: () => void
}

export function TestDetails({ testIds, patientName, onClose }: TestDetailsProps) {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all test details when component mounts
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all tests by ID
        const testPromises = testIds.map(id => getTestById(id))
        const fetchedTests = await Promise.all(testPromises)
        console.log('fetchedTests', fetchedTests);

        // Sort by test name and then by the earliest parameter date
        fetchedTests.sort((a, b) => {
          // First sort by test name
          const nameCompare = a.name.localeCompare(b.name)
          if (nameCompare !== 0) return nameCompare

          // Then by earliest measurement date if same test name
          const aEarliestDate = a.parameters.length > 0
            ? Math.min(...a.parameters.map(p => new Date(p.datePerformed).getTime()))
            : 0
          const bEarliestDate = b.parameters.length > 0
            ? Math.min(...b.parameters.map(p => new Date(p.datePerformed).getTime()))
            : 0

          return bEarliestDate - aEarliestDate // Most recent first
        })

        setTests(fetchedTests)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load test details')
        console.error('Error fetching test details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestDetails()
  }, [testIds])

  // Calculate date range across all tests
  const getDateRange = (tests: Test[]): { earliest: string, latest: string } => {
    const allDates: Date[] = []
    tests.forEach(test => {
      test.parameters.forEach(param => {
        allDates.push(new Date(param.datePerformed))
      })
    })

    if (allDates.length === 0) return { earliest: '', latest: '' }

    const earliest = new Date(Math.min(...allDates.map(d => d.getTime())))
    const latest = new Date(Math.max(...allDates.map(d => d.getTime())))

    return {
      earliest: earliest.toLocaleDateString(),
      latest: latest.toLocaleDateString()
    }
  }

  const dateRange = getDateRange(tests)
  const totalMeasurements = tests.reduce((sum, test) => sum + test.parameters.length, 0)

  return (
    <Card className="w-full" data-testid="test-details">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl" data-testid="details-title">Test Results for {patientName}</CardTitle>
            <CardDescription data-testid="details-description">
              Time-series analysis of diagnostic parameters
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose} data-testid="close-button">
            Close Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8" data-testid="loading-state">
            <div className="text-gray-500">Loading test details...</div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50" data-testid="error-state">
            <CardContent className="pt-6">
              <div className="text-red-800 font-medium" data-testid="error-title">Error Loading Test Details</div>
              <div className="text-red-600 text-sm mt-1" data-testid="error-message">{error}</div>
            </CardContent>
          </Card>
        ) : tests.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="no-data-state">
            No test details available
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary of all tests */}
            <Card className="bg-blue-50 border-blue-200" data-testid="tests-summary">
              <CardHeader>
                <CardTitle className="text-lg" data-testid="summary-title">Summary</CardTitle>
                <CardDescription data-testid="summary-description">
                  {tests.length} test type{tests.length !== 1 ? 's' : ''} • {totalMeasurements} total measurement{totalMeasurements !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm" data-testid="summary-content">
                  {dateRange.earliest && (
                    <div data-testid="date-range"><strong>Date Range:</strong> {dateRange.earliest} to {dateRange.latest}</div>
                  )}
                  <div data-testid="test-types"><strong>Test Types:</strong> {tests.map(t => t.parameterName).join(', ')}</div>
                </div>
              </CardContent>
            </Card>

            {/* Test results - each test shows chart followed by detailed information */}
            <div className="space-y-8" data-testid="test-results-section">
              <h2 className="text-lg font-semibold" data-testid="test-results-title">Test Results</h2>
              {tests.map((test, index) => (
                <div key={test.id} className="space-y-4" data-testid={`test-group-${test.id}`}>
                  <h3 className="text-lg font-semibold" data-testid="test-results-title">
                    {test.name}
                  </h3>
                  {/* Test Chart */}
                  <div data-testid={`chart-section-${test.id}`}>
                    <h4 className="text-md font-medium mb-3 text-gray-700">
                      {/* {test.parameterName} Over Time */}
                    </h4>
                    <TestChart test={test} />
                  </div>

                  {/* Corresponding Detailed Information */}
                  <div data-testid={`details-section-${test.id}`}>
                    <h4 className="text-md font-medium mb-3 text-gray-700">
                      {/* {test.parameterName} Detailed Information */}
                    </h4>
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-base">{test.name}</CardTitle>
                        <CardDescription>
                          Test ID: {test.id} • Parameter: {test.parameterName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div><strong>Parameter:</strong> {test.parameterName}</div>
                            <div><strong>Unit:</strong> {test.unit}</div>
                            <div><strong>Reference Range:</strong> {test.referenceMin} - {test.referenceMax} {test.unit}</div>
                            <div><strong>Measurements:</strong> {test.parameters.length}</div>
                          </div>

                          {test.parameters.length > 0 && (
                            <div>
                              <strong>Measurement History:</strong>
                              <div className="mt-2 space-y-1">
                                {test.parameters
                                  .sort((a, b) => new Date(b.datePerformed).getTime() - new Date(a.datePerformed).getTime())
                                  .map((param) => (
                                    <div key={param.id} className="text-xs bg-gray-50 p-2 rounded">
                                      <span className="font-medium">{new Date(param.datePerformed).toLocaleDateString()}</span>: {param.value} {test.unit}
                                      {param.value < test.referenceMin && <span className="text-red-600 ml-2">↓ Below range</span>}
                                      {param.value > test.referenceMax && <span className="text-red-600 ml-2">↑ Above range</span>}
                                      {param.value >= test.referenceMin && param.value <= test.referenceMax && <span className="text-green-600 ml-2">✓ Normal</span>}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Add divider between test groups (except for the last one) */}
                  {index < tests.length - 1 && (
                    <hr className="border-gray-200 my-6" data-testid={`divider-${test.id}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 