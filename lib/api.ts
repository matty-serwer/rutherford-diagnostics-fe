/**
 * API client functions for Rutherford Diagnostics backend
 * Updated to match the new cleaner API structure
 */

import { Patient, Test, APIError, PatientSummary, TestSummary } from '@/types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

/**
 * Base fetch wrapper with error handling
 * Provides consistent error handling and response parsing
 */
async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`)

    if (!response.ok) {
      const errorData: APIError = await response.json()
      throw new Error(`API Error: ${errorData.message}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Fetch all patients from the backend (summary view)
 * Returns array of PatientSummary objects
 */
export async function getAllPatients(): Promise<PatientSummary[]> {
  return apiRequest<PatientSummary[]>('/patient')
}

/**
 * Fetch a specific patient by ID with diagnostic history
 * Returns Patient object with diagnosticHistory
 */
export async function getPatientById(id: number): Promise<Patient> {
  return apiRequest<Patient>(`/patient/${id}`)
}

/**
 * Fetch all tests from the backend (summary view)
 * Returns array of TestSummary objects
 */
export async function getAllTests(): Promise<TestSummary[]> {
  return apiRequest<TestSummary[]>('/test')
}

/**
 * Fetch a specific test by ID with full details
 * Returns Test object with parameters and reference ranges
 */
export async function getTestById(id: number): Promise<Test> {
  return apiRequest<Test>(`/test/${id}`)
} 