'use client'

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Header } from '../../../components/ui/header'
import { ParameterCard } from '@/components/charts/ParameterCard'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Parameter } from '@/lib/types'
import React from 'react'

interface Test {
  id: string
  name: string
  datePerformed: string
  results: string
  parameters?: Parameter[]
}

interface Patient {
  id: string
  name: string
  tests: Test[]
}
interface PatientParams {
  id: string
}
interface PatientPageProps {
  params: Promise<PatientParams>
}

async function getPatientData(id: string): Promise<Patient> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/patients/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch patient data')
  }

  return res.json()
}
export default function PatientPage({ params }: PatientPageProps) {
  const { id } = React.use(params)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await getPatientData(id)
        setPatientData(data)
      } catch (error) {
        console.error('Failed to load patient:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!patientData) {
    notFound()
  }

  // Mock parameter data for blood test (in real app, this would come from API)
  const bloodTestParameters: Parameter[] = [
    {
      id: 1,
      name: "Hemoglobin",
      unit: "g/dL",
      referenceMin: 12,
      referenceMax: 16,
      history: [
        { id: 1, resultDate: "2024-03-20", value: 14.2 },
        { id: 2, resultDate: "2024-03-10", value: 13.8 },
        { id: 3, resultDate: "2024-03-01", value: 13.5 },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{patientData.name}</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tests</h2>
            <Suspense fallback={<div>Loading tests...</div>}>
              <div className="grid gap-4">
                {patientData.tests.map((test) => (
                  <div key={test.id}>
                    {selectedTest === test.id && test.name === "Blood Test" ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bloodTestParameters.map((parameter) => (
                          <ParameterCard
                            key={parameter.id}
                            parameter={parameter}
                            className="col-span-full md:col-span-2"
                          />
                        ))}
                      </div>
                    ) : (
                      <Card
                        className="p-4 hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{test.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(test.datePerformed).toLocaleDateString()}
                          </span>
                        </div>
                        {test.results && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {test.results}
                          </p>
                        )}
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
} 