import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Notification interface
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number // in milliseconds, null for persistent
  timestamp: number
}

// Modal interface for reusable modals
interface Modal {
  id: string
  type: 'confirmation' | 'form' | 'info' | 'custom'
  title: string
  content?: string
  data?: unknown // for passing data to modal components
  onConfirm?: string // action name to dispatch on confirm
  onCancel?: string // action name to dispatch on cancel
}

// Theme settings
type Theme = 'light' | 'dark' | 'system'

// UI state interface
interface UIState {
  // Global loading state (for app-wide operations)
  isGlobalLoading: boolean
  globalLoadingMessage: string | null

  // Notifications/toasts
  notifications: Notification[]

  // Modals
  activeModals: Modal[]

  // Navigation and layout
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean

  // Theme and preferences
  theme: Theme
  reducedMotion: boolean

  // Page-specific UI states
  currentPage: string
  breadcrumbs: Array<{ label: string; href?: string }>

  // Data refresh indicators
  lastDataRefresh: number | null

  // Error boundaries and global error handling
  globalError: string | null

  // Search and filters UI
  searchModalOpen: boolean
  filtersVisible: boolean
}

// Initial state
const initialState: UIState = {
  isGlobalLoading: false,
  globalLoadingMessage: null,
  notifications: [],
  activeModals: [],
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  theme: 'system',
  reducedMotion: false,
  currentPage: '',
  breadcrumbs: [],
  lastDataRefresh: null,
  globalError: null,
  searchModalOpen: false,
  filtersVisible: false,
}

// Create UI slice with reducers
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Global loading actions
    setGlobalLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isGlobalLoading = action.payload.isLoading
      state.globalLoadingMessage = action.payload.message || null
    },

    clearGlobalLoading: (state) => {
      state.isGlobalLoading = false
      state.globalLoadingMessage = null
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        duration: action.payload.duration ?? 5000, // default 5 seconds
      }
      state.notifications.push(notification)
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },

    clearAllNotifications: (state) => {
      state.notifications = []
    },

    // Modal actions
    openModal: (state, action: PayloadAction<Omit<Modal, 'id'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: `modal-${Date.now()}-${Math.random()}`,
      }
      state.activeModals.push(modal)
    },

    closeModal: (state, action: PayloadAction<string>) => {
      state.activeModals = state.activeModals.filter(m => m.id !== action.payload)
    },

    closeTopModal: (state) => {
      state.activeModals.pop()
    },

    clearAllModals: (state) => {
      state.activeModals = []
    },

    // Layout and navigation actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },

    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload
    },

    // Page and navigation actions
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },

    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload
    },

    addBreadcrumb: (state, action: PayloadAction<{ label: string; href?: string }>) => {
      state.breadcrumbs.push(action.payload)
    },

    // Data refresh tracking
    updateLastDataRefresh: (state) => {
      state.lastDataRefresh = Date.now()
    },

    // Global error handling
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload
    },

    clearGlobalError: (state) => {
      state.globalError = null
    },

    // Search and filters UI
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen
    },

    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.searchModalOpen = action.payload
    },

    toggleFiltersVisible: (state) => {
      state.filtersVisible = !state.filtersVisible
    },

    setFiltersVisible: (state, action: PayloadAction<boolean>) => {
      state.filtersVisible = action.payload
    },

    // Reset UI state (useful for logout)
    resetUIState: (state) => {
      // Keep theme and accessibility preferences
      const { theme, reducedMotion } = state
      return {
        ...initialState,
        theme,
        reducedMotion,
      }
    },
  },
})

// Export actions for use in components
export const {
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
} = uiSlice.actions

// Export reducer as default
export default uiSlice.reducer 