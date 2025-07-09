import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Test parameter for time-series data
interface TestParameter {
  id: number
  value: number
  datePerformed: string
}

// Patient summary for test details
interface PatientSummary {
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string
  ownerName: string
  ownerContact: string
}

// Test summary interface (for lists)
interface TestSummary {
  id: number
  name: string
}

// Full test details interface (with time-series data)
interface TestDetail {
  id: number
  name: string
  patient: PatientSummary
  parameterName: string
  unit: string
  referenceMin: number
  referenceMax: number
  parameters: TestParameter[]
}

// Test state interface
interface TestState {
  // All tests summary list
  tests: TestSummary[]
  // Currently selected test with full details
  currentTest: TestDetail | null
  // Loading states
  isLoading: boolean
  isLoadingCurrentTest: boolean
  // Error handling
  error: string | null
  // Search and filtering
  searchQuery: string
  filteredTests: TestSummary[]
  // Chart view settings
  chartDateRange: {
    start: string | null
    end: string | null
  }
  showReferenceLines: boolean
}

// Initial state
const initialState: TestState = {
  tests: [],
  currentTest: null,
  isLoading: false,
  isLoadingCurrentTest: false,
  error: null,
  searchQuery: '',
  filteredTests: [],
  chartDateRange: {
    start: null,
    end: null,
  },
  showReferenceLines: true,
}

// Create test slice with reducers
const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    // Fetch all tests (summary) actions
    fetchTestsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchTestsSuccess: (state, action: PayloadAction<TestSummary[]>) => {
      state.tests = action.payload
      state.filteredTests = action.payload
      state.isLoading = false
      state.error = null
    },
    fetchTestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Fetch current test (with full details) actions
    fetchCurrentTestStart: (state) => {
      state.isLoadingCurrentTest = true
      state.error = null
    },
    fetchCurrentTestSuccess: (state, action: PayloadAction<TestDetail>) => {
      state.currentTest = action.payload
      state.isLoadingCurrentTest = false
      state.error = null
    },
    fetchCurrentTestFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingCurrentTest = false
      state.error = action.payload
    },

    // Set current test (for navigation)
    setCurrentTest: (state, action: PayloadAction<TestDetail | null>) => {
      state.currentTest = action.payload
    },

    // Search and filter tests
    setTestSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      // Filter tests based on search query
      if (action.payload.trim() === '') {
        state.filteredTests = state.tests
      } else {
        const query = action.payload.toLowerCase()
        state.filteredTests = state.tests.filter((test) =>
          test.name.toLowerCase().includes(query)
        )
      }
    },

    // Clear test search
    clearTestSearch: (state) => {
      state.searchQuery = ''
      state.filteredTests = state.tests
    },

    // Chart settings and filters
    setChartDateRange: (
      state,
      action: PayloadAction<{ start: string | null; end: string | null }>
    ) => {
      state.chartDateRange = action.payload
    },

    clearChartDateRange: (state) => {
      state.chartDateRange = {
        start: null,
        end: null,
      }
    },

    toggleReferenceLines: (state) => {
      state.showReferenceLines = !state.showReferenceLines
    },

    setShowReferenceLines: (state, action: PayloadAction<boolean>) => {
      state.showReferenceLines = action.payload
    },

    // Add new test parameter (for real-time updates)
    addTestParameter: (state, action: PayloadAction<TestParameter>) => {
      if (state.currentTest) {
        state.currentTest.parameters.push(action.payload)
        // Sort parameters by date (newest first)
        state.currentTest.parameters.sort(
          (a, b) => new Date(b.datePerformed).getTime() - new Date(a.datePerformed).getTime()
        )
      }
    },

    // Update test parameter
    updateTestParameter: (state, action: PayloadAction<TestParameter>) => {
      if (state.currentTest) {
        const index = state.currentTest.parameters.findIndex(
          (p) => p.id === action.payload.id
        )
        if (index !== -1) {
          state.currentTest.parameters[index] = action.payload
        }
      }
    },

    // Remove test parameter
    removeTestParameter: (state, action: PayloadAction<number>) => {
      if (state.currentTest) {
        state.currentTest.parameters = state.currentTest.parameters.filter(
          (p) => p.id !== action.payload
        )
      }
    },

    // Clear errors
    clearTestError: (state) => {
      state.error = null
    },

    // Reset test state
    resetTestState: (state) => {
      state.tests = []
      state.currentTest = null
      state.filteredTests = []
      state.searchQuery = ''
      state.error = null
      state.isLoading = false
      state.isLoadingCurrentTest = false
      state.chartDateRange = {
        start: null,
        end: null,
      }
      state.showReferenceLines = true
    },
  },
})

// Export actions for use in components
export const {
  fetchTestsStart,
  fetchTestsSuccess,
  fetchTestsFailure,
  fetchCurrentTestStart,
  fetchCurrentTestSuccess,
  fetchCurrentTestFailure,
  setCurrentTest,
  setTestSearchQuery,
  clearTestSearch,
  setChartDateRange,
  clearChartDateRange,
  toggleReferenceLines,
  setShowReferenceLines,
  addTestParameter,
  updateTestParameter,
  removeTestParameter,
  clearTestError,
  resetTestState,
} = testSlice.actions

// Export reducer as default
export default testSlice.reducer 