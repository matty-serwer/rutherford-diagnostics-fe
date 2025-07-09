import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Patient interface based on API documentation
interface Patient {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string
  ownerName: string
  ownerContact: string
  diagnosticHistory?: DiagnosticTest[]
}

// Diagnostic test summary from patient's history
interface DiagnosticTest {
  id: number
  name: string
}

// Patient state interface
interface PatientState {
  // All patients list
  patients: Patient[]
  // Currently selected patient for detailed view
  currentPatient: Patient | null
  // Loading states
  isLoading: boolean
  isLoadingCurrentPatient: boolean
  // Error handling
  error: string | null
  // Search and filtering
  searchQuery: string
  filteredPatients: Patient[]
}

// Initial state
const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  isLoadingCurrentPatient: false,
  error: null,
  searchQuery: '',
  filteredPatients: [],
}

// Create patient slice with reducers
const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    // Fetch all patients actions
    fetchPatientsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchPatientsSuccess: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload
      state.filteredPatients = action.payload
      state.isLoading = false
      state.error = null
    },
    fetchPatientsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Fetch current patient (with diagnostic history) actions
    fetchCurrentPatientStart: (state) => {
      state.isLoadingCurrentPatient = true
      state.error = null
    },
    fetchCurrentPatientSuccess: (state, action: PayloadAction<Patient>) => {
      state.currentPatient = action.payload
      state.isLoadingCurrentPatient = false
      state.error = null
    },
    fetchCurrentPatientFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingCurrentPatient = false
      state.error = action.payload
    },

    // Set current patient (for navigation)
    setCurrentPatient: (state, action: PayloadAction<Patient | null>) => {
      state.currentPatient = action.payload
    },

    // Search and filter patients
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      // Filter patients based on search query
      if (action.payload.trim() === '') {
        state.filteredPatients = state.patients
      } else {
        const query = action.payload.toLowerCase()
        state.filteredPatients = state.patients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(query) ||
            patient.species.toLowerCase().includes(query) ||
            patient.breed.toLowerCase().includes(query) ||
            patient.ownerName.toLowerCase().includes(query)
        )
      }
    },

    // Clear search and show all patients
    clearSearch: (state) => {
      state.searchQuery = ''
      state.filteredPatients = state.patients
    },

    // Add new patient (after creation)
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload)
      // Update filtered patients if no search query
      if (state.searchQuery.trim() === '') {
        state.filteredPatients = state.patients
      }
    },

    // Update existing patient
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.patients[index] = action.payload
        // Update current patient if it's the same one
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload
        }
        // Refresh filtered patients
        state.filteredPatients = state.patients.filter(
          (patient) => {
            if (state.searchQuery.trim() === '') return true
            const query = state.searchQuery.toLowerCase()
            return (
              patient.name.toLowerCase().includes(query) ||
              patient.species.toLowerCase().includes(query) ||
              patient.breed.toLowerCase().includes(query) ||
              patient.ownerName.toLowerCase().includes(query)
            )
          }
        )
      }
    },

    // Clear errors
    clearPatientError: (state) => {
      state.error = null
    },

    // Reset patient state
    resetPatientState: (state) => {
      state.patients = []
      state.currentPatient = null
      state.filteredPatients = []
      state.searchQuery = ''
      state.error = null
      state.isLoading = false
      state.isLoadingCurrentPatient = false
    },
  },
})

// Export actions for use in components
export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchCurrentPatientStart,
  fetchCurrentPatientSuccess,
  fetchCurrentPatientFailure,
  setCurrentPatient,
  setSearchQuery,
  clearSearch,
  addPatient,
  updatePatient,
  clearPatientError,
  resetPatientState,
} = patientSlice.actions

// Export reducer as default
export default patientSlice.reducer 