import { vi } from 'vitest'
import { Patient, TestDetail, PatientSummary, TestSummary } from '@/types'

/**
 * Mock data for testing components
 */

// Mock patient data
export const mockPatientSummary: PatientSummary = {
  id: 1,
  name: 'Walter',
  species: 'Dog',
  breed: 'Labrador',
  dateOfBirth: '2018-05-20',
  ownerName: 'Jane Doe',
  ownerContact: '555-1234'
}

export const mockPatientWithHistory: Patient = {
  ...mockPatientSummary,
  diagnosticHistory: [
    { id: 22, name: 'Complete Blood Count' },
    { id: 23, name: 'Chemistry Panel' }
  ]
}

// Mock test summaries
export const mockTestSummaries: TestSummary[] = [
  { id: 22, name: 'Complete Blood Count' },
  { id: 23, name: 'Chemistry Panel' },
  { id: 24, name: 'Thyroid Panel' }
]

// Mock test details with parameters
export const mockTestDetail: TestDetail = {
  id: 22,
  name: 'Complete Blood Count',
  patient: mockPatientSummary,
  parameterName: 'Hemoglobin',
  unit: 'g/dL',
  referenceMin: 12.0,
  referenceMax: 18.0,
  parameters: [
    { id: 292, value: 14.5, datePerformed: '2024-03-14' },
    { id: 293, value: 13.8, datePerformed: '2024-02-14' },
    { id: 294, value: 15.2, datePerformed: '2024-01-12' },
    { id: 295, value: 15.2, datePerformed: '2023-09-24' },
    { id: 296, value: 13.1, datePerformed: '2022-04-21' }
  ]
}

export const mockTestDetailEmpty: TestDetail = {
  id: 25,
  name: 'Empty Test',
  patient: mockPatientSummary,
  parameterName: 'Empty Parameter',
  unit: 'unit',
  referenceMin: 0,
  referenceMax: 10,
  parameters: []
}

// Mock API functions
export const getAllPatients = vi.fn().mockResolvedValue([mockPatientSummary])

export const getPatientById = vi.fn().mockImplementation((id: number) => {
  if (id === 1) {
    return Promise.resolve(mockPatientWithHistory)
  }
  throw new Error('Patient not found')
})

export const getAllTests = vi.fn().mockResolvedValue(mockTestSummaries)

export const getTestById = vi.fn().mockImplementation((id: number) => {
  if (id === 22) {
    return Promise.resolve(mockTestDetail)
  }
  if (id === 25) {
    return Promise.resolve(mockTestDetailEmpty)
  }
  throw new Error('Test not found')
}) 