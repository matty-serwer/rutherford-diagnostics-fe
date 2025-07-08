/**
 * TypeScript definitions for Rutherford Diagnostics API data models
 * Based on backend API documentation
 */

export interface Patient {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string // ISO 8601 format (YYYY-MM-DD)
  ownerName: string
  ownerContact: string
  tests?: Test[] // Optional when nested to prevent circular references
}

export interface Test {
  id: number
  name: string
  datePerformed: string // ISO 8601 format (YYYY-MM-DD)
  patient?: Patient // Optional when nested to prevent circular references
  parameters?: Parameter[] // Optional when nested to prevent circular references
}

export interface Parameter {
  id: number
  name: string
  unit: string
  referenceMin: number
  referenceMax: number
  test?: Test // Optional when nested to prevent circular references
  history?: ResultHistory[] // Optional when nested to prevent circular references
}

export interface ResultHistory {
  id: number
  resultDate: string // ISO 8601 format (YYYY-MM-DD)
  value: number
  parameter?: Parameter // Optional when nested to prevent circular references
}

export interface APIError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
} 