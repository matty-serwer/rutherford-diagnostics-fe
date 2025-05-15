import { Patient, Test, ApiResponse, ApiError } from './types'
import mockPatients from '@/data/mockPatients.json'
import mockTests from '@/data/mockTests.json'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export async function getMockPatients(): Promise<ApiResponse<Patient[]>> {
  await delay(500) // Simulate network delay
  return mockPatients.patients
}

export async function getMockPatient(id: number): Promise<ApiResponse<Patient>> {
  await delay(300)
  const patient = mockPatients.patients.find(p => p.id === id)

  if (!patient) {
    return {
      status: 404,
      error: 'Not Found',
      message: `Patient not found with id: ${id}`,
      path: `/patients/${id}`,
      timestamp: new Date().toISOString()
    }
  }

  return patient
}

export async function getMockTests(): Promise<ApiResponse<Test[]>> {
  await delay(500)
  return mockTests.tests
}

export async function getMockTest(id: number): Promise<ApiResponse<Test>> {
  await delay(300)
  const test = mockTests.tests.find(t => t.id === id)

  if (!test) {
    return {
      status: 404,
      error: 'Not Found',
      message: `Test not found with id: ${id}`,
      path: `/tests/${id}`,
      timestamp: new Date().toISOString()
    }
  }

  return test
}

// Helper functions
export function getMockPatientTests(patientId: number): Test[] {
  return mockTests.tests.filter(test => test.patient.id === patientId)
}

export function getMockTestParameters(testId: number): Test['parameters'] {
  const test = mockTests.tests.find(t => t.id === testId)
  return test?.parameters || []
}

// Type guard to check if response is an error
export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return 'error' in response && 'status' in response
} 