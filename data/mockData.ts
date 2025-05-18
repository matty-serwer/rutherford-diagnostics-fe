import { Patient, Test } from '@/lib/types'

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    dateOfBirth: '2020-01-01',
    ownerName: 'John Doe',
    ownerContact: '123-456-7890'
  },
  {
    id: 2,
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    dateOfBirth: '2021-03-15',
    ownerName: 'Jane Smith',
    ownerContact: '098-765-4321'
  }
]

export const mockTests: Test[] = [
  {
    id: 1,
    name: 'Blood Test',
    datePerformed: '2024-03-14',
    patient: mockPatients[0],
    parameters: [
      {
        id: 1,
        name: 'Hemoglobin',
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 18.0,
        history: [
          { id: 1, resultDate: '2024-03-14', value: 14.5 },
          { id: 2, resultDate: '2024-02-14', value: 13.8 },
          { id: 3, resultDate: '2024-01-14', value: 15.2 },
          { id: 4, resultDate: '2024-01-14', value: 15.2 },
          { id: 5, resultDate: '2024-01-14', value: 13.1 },
          { id: 6, resultDate: '2024-01-14', value: 14.2 },
          { id: 7, resultDate: '2024-01-14', value: 13.3 },
          { id: 8, resultDate: '2024-01-14', value: 13.4 },
          { id: 9, resultDate: '2024-01-14', value: 11.3 },
          { id: 10, resultDate: '2024-01-14', value: 12.0 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Blood Test',
    datePerformed: '2024-03-10',
    patient: mockPatients[1],
    parameters: [
      {
        id: 2,
        name: 'Hemoglobin',
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 18.0,
        history: [
          { id: 4, resultDate: '2024-03-10', value: 16.1 },
          { id: 5, resultDate: '2024-02-10', value: 15.9 },
          { id: 6, resultDate: '2024-01-10', value: 15.5 }
        ]
      }
    ]
  }
] 