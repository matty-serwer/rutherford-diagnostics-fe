'use client'

import { Header } from '@/components/Header'
import { ParameterCard } from '@/components/charts/ParameterCard'
import { useApp } from '@/lib/context/AppContext'
import { useApi } from '@/lib/hooks/useApi'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { state } = useApp()
  const { fetchTests } = useApi()

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  // Find the blood test with hemoglobin parameter
  const bloodTest = state.tests.find((test) => test.name === 'Blood Test')
  const hemoglobinParameter = bloodTest?.parameters?.find(
    (param) => param.name === 'Hemoglobin'
  )

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Hemoglobin Trend Card */}
          {hemoglobinParameter && (
            <ParameterCard
              parameter={hemoglobinParameter}
              className="col-span-full md:col-span-2"
            />
          )}
          {/* Add more parameter cards here */}
        </div>
      </main>
    </>
  )
} 