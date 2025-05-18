import { NextResponse } from 'next/server'

interface Test {
  id: string
  name: string
  datePerformed: string
  results: string
}

interface Patient {
  id: string
  name: string
  tests: Test[]
}

interface PatientDatabase {
  [key: string]: Patient
}

// This would typically come from your database
const mockPatientData: PatientDatabase = {
  "1": {
    id: "1",
    name: "John Doe",
    tests: [
      {
        id: "test1",
        name: "Blood Test",
        datePerformed: "2024-03-20",
        results: "Normal levels"
      },
      {
        id: "test2",
        name: "X-Ray",
        datePerformed: "2024-03-15",
        results: "No abnormalities detected"
      }
    ]
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = mockPatientData[params.id]

    if (!patient) {
      return new NextResponse('Patient not found', { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 