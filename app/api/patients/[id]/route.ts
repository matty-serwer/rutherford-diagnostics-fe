import { NextResponse } from 'next/server'
import { Parameter } from '@/lib/types'

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

interface PatientDatabase {
  [key: string]: Patient
}

// Mock parameter data
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
        results: "Normal levels",
        parameters: bloodTestParameters
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