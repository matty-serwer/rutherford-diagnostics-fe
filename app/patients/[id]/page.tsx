'use client'

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Header } from '../../../components/ui/header'
import { ParameterCard } from '@/components/charts/ParameterCard'
import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Patient, Test, ApiError, API_BASE_URL } from '@/lib/types'
import React from 'react'

interface PatientParams {
  id: string
}

interface PatientPageProps {
  params: Promise<PatientParams>
}

async function getPatientData(id: string): Promise<Patient> {
  const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    const error = await res.json() as ApiError
    throw new Error(error.message || 'Failed to fetch patient data')
  }

  return res.json()
}

async function getTestData(testId: number): Promise<Test> {
  const res = await fetch(`${API_BASE_URL}/tests/${testId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    const error = await res.json() as ApiError
    throw new Error(error.message || 'Failed to fetch test data')
  }

  return res.json()
}

export default function PatientPage({ params }: PatientPageProps) {
  const { id } = React.use(params)
  const [selectedTest, setSelectedTest] = useState<number | null>(null)
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [testDetails, setTestDetails] = useState<{ [key: number]: Test }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patient data
  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await getPatientData(id)
        setPatientData(data)
        setError(null)

        console.log(data);

        // Fetch details for each test
        const testPromises = data.diagnosticHistory?.map(async (test: Test) => {
          try {
            const testData = await getTestData(test.id)
            return [test.id, testData] as [number, Test]
          } catch (error) {
            console.error(`Failed to load test ${test.id}:`, error)
            return null
          }
        }) || []

        const testResults = await Promise.all(testPromises)
        const testDetailsMap = Object.fromEntries(
          testResults.filter((result): result is [number, Test] => result !== null)
        )
        setTestDetails(testDetailsMap)
      } catch (error) {
        console.error('Failed to load patient:', error)
        setError(error instanceof Error ? error.message : 'Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [id])

  const handleCloseParameterCard = useCallback(() => {
    setSelectedTest(null)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!patientData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-5xl">{patientData.name}</h1>
            <div className="text-sm text-muted-foreground">
              <p>{patientData.species} - {patientData.breed}</p>
              <p>Owner: {patientData.ownerName}</p>
              <p>Contact: {patientData.ownerContact}</p>
            </div>
          </div>
          <div className="tests-container rounded-lg border border-border bg-card p-6">
            {!selectedTest && (
              <div className="space-y-4 p-6" id="tests">
                <h2 className="text-2xl font-semibold">Tests</h2>
                {/* <div className="rounded-lg border border-border bg-card p-6"> */}
                <Suspense fallback={<div>Loading tests...</div>}>
                  {!selectedTest && (
                    <div className="grid gap-6">
                      {patientData.diagnosticHistory?.map((test) => {
                        const testDetail = testDetails[test.id]
                        return (
                          <Card
                            key={test.id}
                            className="cursor-pointer p-6 hover:bg-accent/50 transition-colors shadow-sm"
                            onClick={() => setSelectedTest(test.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{test.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(test.datePerformed).toLocaleDateString()}
                                </p>
                              </div>
                              {testDetail?.parameters && (
                                <div className="text-sm text-muted-foreground">
                                  {testDetail.parameters.length}
                                </div>
                              )}
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </Suspense>
                {/* </div> */}
              </div>
            )}

            {selectedTest && testDetails[selectedTest]?.parameters && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold ml-6">
                    {patientData.name}'s {testDetails[selectedTest].name}s
                  </h3>
                </div>
                <div className="rounded-lg p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {testDetails[selectedTest].parameters.map((parameter) => (
                      <ParameterCard
                        key={parameter.id}
                        parameter={parameter}
                        onClose={handleCloseParameterCard}
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 