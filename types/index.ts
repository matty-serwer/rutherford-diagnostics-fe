/**
 * TypeScript definitions for Rutherford Diagnostics API data models
 * Updated to match backend where parameters have individual datePerformed fields
 */

// Redux Store Types
export type { RootState, AppDispatch } from '../lib/store'

// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'veterinarian' | 'technician'
  isVerified: boolean
}

// Patient and Diagnostic Types
export interface Patient {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string
  ownerName: string
  ownerContact: string
  diagnosticHistory?: DiagnosticTest[]
}

export interface DiagnosticTest {
  id: number
  name: string
}

// Test and Parameter Types
export interface TestParameter {
  id: number
  value: number
  datePerformed: string
}

export interface PatientSummary {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string
  ownerName: string
  ownerContact: string
}

export interface TestSummary {
  id: number
  name: string
}

export interface TestDetail {
  id: number
  name: string
  patient: PatientSummary
  parameterName: string
  unit: string
  referenceMin: number
  referenceMax: number
  parameters: TestParameter[]
}

// UI Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: number
}

export interface Modal {
  id: string
  type: 'confirmation' | 'form' | 'info' | 'custom'
  title: string
  content?: string
  data?: unknown
  onConfirm?: string
  onCancel?: string
}

export type Theme = 'light' | 'dark' | 'system'

// API Response Types
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// Chart and Visualization Types
export interface ChartDataPoint {
  date: string
  value: number
  id: number
}

export interface ChartConfig {
  showReferenceLines: boolean
  dateRange: {
    start: string | null
    end: string | null
  }
  parameterName: string
  unit: string
  referenceMin: number
  referenceMax: number
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface PatientFormData {
  name: string
  species: string
  breed: string
  dateOfBirth: string
  ownerName: string
  ownerContact: string
}

export interface TestParameterFormData {
  value: number
  datePerformed: string
} 