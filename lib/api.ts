/**
 * API client functions for Rutherford Diagnostics backend
 * Handles all HTTP requests to the backend API
 */

import { Patient, Test, APIError } from '@/types'

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
 * Fetch all patients from the backend
 * Returns array of Patient objects
 */
export async function getAllPatients(): Promise<Patient[]> {
  return apiRequest<Patient[]>('/patients')
}

/**
 * Fetch a specific patient by ID
 * Returns Patient object with full details
 */
export async function getPatientById(id: number): Promise<Patient> {
  return apiRequest<Patient>(`/patients/${id}`)
}

/**
 * Fetch all tests from the backend
 * Returns array of Test objects
 */
export async function getAllTests(): Promise<Test[]> {
  return apiRequest<Test[]>('/tests')
}

/**
 * Fetch a specific test by ID
 * Returns Test object with full details
 */
export async function getTestById(id: number): Promise<Test> {
  return apiRequest<Test>(`/tests/${id}`)
} 