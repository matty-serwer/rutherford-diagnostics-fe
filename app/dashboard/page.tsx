import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPatients } from '@/lib/api'
import { PatientSummary } from '@/types'

/**
 * Dashboard Page Component
 * Displays all patients from the backend as navigation links
 * Serves as the main landing page for logged-in users
 */
export default async function DashboardPage() {
  let patients: PatientSummary[] = []
  let error: string | null = null

  try {
    // Fetch all patients from the backend API
    patients = await getAllPatients()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load patients'
    console.error('Error fetching patients:', err)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rutherford Diagnostics Dashboard
        </h1>
        <p className="text-gray-600">
          Select a patient to view their diagnostic information
        </p>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Patients</CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              Please ensure the backend is running on http://localhost:8080
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.length === 0 ? (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No Patients Found</CardTitle>
                <CardDescription>
                  No patients are currently in the system.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            patients.map((patient: PatientSummary) => (
              <Link
                key={patient.id}
                href={`/patient/${patient.id}`}
                className="group block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {patient.name}
                    </CardTitle>
                    <CardDescription>
                      {patient.species} • {patient.breed}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Owner:</strong> {patient.ownerName}</p>
                      <p><strong>DOB:</strong> {patient.dateOfBirth}</p>
                      <p><strong>Contact:</strong> {patient.ownerContact}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
} 