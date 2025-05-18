import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Header } from '../../../components/ui/header'

interface Test {
  id: string
  name: string
  datePerformed: string
  results?: string
}

interface Patient {
  id: string
  name: string
  tests: Test[]
}

interface PatientPageProps {
  params: {
    id: string
  }
}

async function getPatientData(id: string): Promise<Patient> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/patients/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store' // Disable caching for dynamic data
  })

  if (!res.ok) {
    throw new Error('Failed to fetch patient data')
  }

  return res.json()
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const patientData = await getPatientData(id)
  console.log(patientData)

  if (!patientData) {
    notFound()
  }

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
              {patientData.tests?.length > 0 ? (
                <div className="grid gap-4">
                  {patientData.tests.map((test) => (
                    <div
                      key={test.id}
                      className="border rounded-lg p-4 hover:bg-accent transition-colors"
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No tests found for this patient.</p>
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
} 