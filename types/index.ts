/**
 * TypeScript definitions for Rutherford Diagnostics API data models
 * Updated to match backend where parameters have individual datePerformed fields
 */

// Patient summary (when listed)
export interface PatientSummary {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string // ISO 8601 format (YYYY-MM-DD)
  ownerName: string
  ownerContact: string
}

// Patient detail (with diagnostic history)
export interface Patient extends PatientSummary {
  diagnosticHistory?: TestSummary[] // Array of test summaries
}

// Test summary (basic info - NO datePerformed here)
export interface TestSummary {
  id: number
  name: string
}

// Test detail (full test information with time-series parameters)
export interface Test extends TestSummary {
  patient?: PatientSummary // Optional when nested
  parameterName: string // e.g., "Hemoglobin"
  unit: string // e.g., "g/dL"
  referenceMin: number
  referenceMax: number
  parameters: Parameter[] // Array of time-series measurements
}

// Individual parameter measurement with its own date
export interface Parameter {
  id: number
  value: number
  datePerformed: string // ISO 8601 format (YYYY-MM-DD) - measurement date
}

// API Error response
export interface APIError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
} 