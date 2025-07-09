// Centralized export of all Redux actions for easy imports
// This allows components to import all actions from one place

// Auth actions
export {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError as clearAuthError,
  updateUser,
} from './slices/authSlice'

// Patient actions
export {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchCurrentPatientStart,
  fetchCurrentPatientSuccess,
  fetchCurrentPatientFailure,
  setCurrentPatient,
  setSearchQuery as setPatientSearchQuery,
  clearSearch as clearPatientSearch,
  addPatient,
  updatePatient,
  clearPatientError,
  resetPatientState,
} from './slices/patientSlice'

// Test actions
export {
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
} from './slices/testSlice'

// UI actions
export {
  setGlobalLoading,
  clearGlobalLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeTopModal,
  clearAllModals,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  setTheme,
  toggleTheme,
  setReducedMotion,
  setCurrentPage,
  setBreadcrumbs,
  addBreadcrumb,
  updateLastDataRefresh,
  setGlobalError,
  clearGlobalError,
  toggleSearchModal,
  setSearchModalOpen,
  toggleFiltersVisible,
  setFiltersVisible,
  resetUIState,
} from './slices/uiSlice' 