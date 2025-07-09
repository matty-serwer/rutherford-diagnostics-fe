import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPatientById } from '@/lib/api'
import { Patient } from '@/types'
import { notFound } from 'next/navigation'
import { PatientTestsSection } from '@/components/PatientTestsSection'

/**
 * Patient Detail Page Component
 * Displays detailed information for a specific patient
 * Accessible via /patient/[id] route
 */

interface PatientPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params
  const patientId = parseInt(id, 10)

  // Validate the ID parameter
  if (isNaN(patientId)) {
    notFound()
  }

  let patient: Patient | null = null
  let error: string | null = null

  try {
    // Fetch patient data from the backend API
    patient = await getPatientById(patientId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load patient'
    console.error('Error fetching patient:', err)
  }

  // If patient not found, show 404 page
  if (!patient && !error) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Patient</CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              Please ensure the backend is running and the patient ID is valid.
            </p>
          </CardContent>
        </Card>
      ) : patient ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription>
                Patient ID: {patient.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Animal Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Species:</strong> {patient.species}</p>
                    <p><strong>Breed:</strong> {patient.breed}</p>
                    <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Owner Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Owner Name:</strong> {patient.ownerName}</p>
                    <p><strong>Contact:</strong> {patient.ownerContact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test History Section with Charts */}
          <PatientTestsSection
            tests={patient.diagnosticHistory || []}
            patientName={patient.name}
          />
        </div>
      ) : null}
    </div>
  )
} 