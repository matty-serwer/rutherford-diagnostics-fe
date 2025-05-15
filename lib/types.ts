export interface Patient {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string // ISO 8601 format (YYYY-MM-DD)
  ownerName: string
  ownerContact: string
  tests?: Test[] // Optional since it might not always be included in responses
}

export interface Test {
  id: number
  name: string
  datePerformed: string // ISO 8601 format (YYYY-MM-DD)
  patient?: Patient // Optional to prevent circular reference issues
  parameters: Parameter[]
}

export interface Parameter {
  id: number
  name: string
  unit: string
  referenceMin: number
  referenceMax: number
  test?: Test // Optional to prevent circular reference issues
  history: ResultHistory[]
}

export interface ResultHistory {
  id: number
  resultDate: string // ISO 8601 format (YYYY-MM-DD)
  value: number
  parameter?: Parameter // Optional to prevent circular reference issues
}

// API Error Response type
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// API Response types
export type ApiResponse<T> = T | ApiError

// Constants
export const API_BASE_URL = 'http://localhost:8080' 