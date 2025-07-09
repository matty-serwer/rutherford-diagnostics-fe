import { RootState } from './index'

// Auth selectors
export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error

// Patient selectors
export const selectPatients = (state: RootState) => state.patient.patients
export const selectFilteredPatients = (state: RootState) => state.patient.filteredPatients
export const selectCurrentPatient = (state: RootState) => state.patient.currentPatient
export const selectPatientSearchQuery = (state: RootState) => state.patient.searchQuery
export const selectPatientsLoading = (state: RootState) => state.patient.isLoading
export const selectCurrentPatientLoading = (state: RootState) => state.patient.isLoadingCurrentPatient
export const selectPatientError = (state: RootState) => state.patient.error

// Test selectors
export const selectTests = (state: RootState) => state.test.tests
export const selectFilteredTests = (state: RootState) => state.test.filteredTests
export const selectCurrentTest = (state: RootState) => state.test.currentTest
export const selectTestSearchQuery = (state: RootState) => state.test.searchQuery
export const selectTestsLoading = (state: RootState) => state.test.isLoading
export const selectCurrentTestLoading = (state: RootState) => state.test.isLoadingCurrentTest
export const selectTestError = (state: RootState) => state.test.error
export const selectChartDateRange = (state: RootState) => state.test.chartDateRange
export const selectShowReferenceLines = (state: RootState) => state.test.showReferenceLines

// Test chart data selector (derived state)
export const selectCurrentTestChartData = (state: RootState) => {
  const currentTest = state.test.currentTest
  const dateRange = state.test.chartDateRange

  if (!currentTest?.parameters) return null

  let filteredParameters = currentTest.parameters

  // Apply date range filter if set
  if (dateRange.start || dateRange.end) {
    filteredParameters = currentTest.parameters.filter(param => {
      const paramDate = new Date(param.datePerformed)
      if (dateRange.start && paramDate < new Date(dateRange.start)) return false
      if (dateRange.end && paramDate > new Date(dateRange.end)) return false
      return true
    })
  }

  return {
    parameters: filteredParameters,
    parameterName: currentTest.parameterName,
    unit: currentTest.unit,
    referenceMin: currentTest.referenceMin,
    referenceMax: currentTest.referenceMax,
    showReferenceLines: state.test.showReferenceLines,
  }
}

// UI selectors
export const selectUI = (state: RootState) => state.ui
export const selectIsGlobalLoading = (state: RootState) => state.ui.isGlobalLoading
export const selectGlobalLoadingMessage = (state: RootState) => state.ui.globalLoadingMessage
export const selectNotifications = (state: RootState) => state.ui.notifications
export const selectActiveModals = (state: RootState) => state.ui.activeModals
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed
export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen
export const selectTheme = (state: RootState) => state.ui.theme
export const selectReducedMotion = (state: RootState) => state.ui.reducedMotion
export const selectCurrentPage = (state: RootState) => state.ui.currentPage
export const selectBreadcrumbs = (state: RootState) => state.ui.breadcrumbs
export const selectLastDataRefresh = (state: RootState) => state.ui.lastDataRefresh
export const selectGlobalError = (state: RootState) => state.ui.globalError
export const selectSearchModalOpen = (state: RootState) => state.ui.searchModalOpen
export const selectFiltersVisible = (state: RootState) => state.ui.filtersVisible

// Combined selectors for common use cases
export const selectHasActiveNotifications = (state: RootState) =>
  state.ui.notifications.length > 0

export const selectHasActiveModals = (state: RootState) =>
  state.ui.activeModals.length > 0

export const selectIsAnyLoading = (state: RootState) =>
  state.ui.isGlobalLoading ||
  state.auth.isLoading ||
  state.patient.isLoading ||
  state.patient.isLoadingCurrentPatient ||
  state.test.isLoading ||
  state.test.isLoadingCurrentTest

export const selectHasAnyError = (state: RootState) =>
  !!state.ui.globalError ||
  !!state.auth.error ||
  !!state.patient.error ||
  !!state.test.error

// User role-based selectors
export const selectUserRole = (state: RootState) => state.auth.user?.role
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin'
export const selectIsVeterinarian = (state: RootState) => state.auth.user?.role === 'veterinarian'
export const selectIsTechnician = (state: RootState) => state.auth.user?.role === 'technician'

// Data freshness selectors
export const selectDataAge = (state: RootState) => {
  if (!state.ui.lastDataRefresh) return null
  return Date.now() - state.ui.lastDataRefresh
}

export const selectIsDataStale = (state: RootState, maxAgeMs: number = 5 * 60 * 1000) => {
  const dataAge = selectDataAge(state)
  return dataAge ? dataAge > maxAgeMs : true
} 