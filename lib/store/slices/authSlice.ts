import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// User interface for authenticated user data
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'veterinarian' | 'technician'
  isVerified: boolean
}

// Auth state interface
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Initial state - placeholder keeps user logged in for development
const initialState: AuthState = {
  isAuthenticated: true, // TODO: Set to false when JWT implementation is ready
  user: {
    id: '1',
    email: 'dev@rutherford.com',
    name: 'Development User',
    role: 'veterinarian',
    isVerified: true,
  }, // TODO: Remove placeholder user when JWT is implemented
  token: 'dev-placeholder-token', // TODO: Replace with actual JWT token
  isLoading: false,
  error: null,
}

// Create auth slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action - will integrate with JWT later
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.isLoading = false
      state.error = action.payload
    },
    // Logout action
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.isLoading = false
      state.error = null
    },
    // Clear auth errors
    clearError: (state) => {
      state.error = null
    },
    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

// Export actions for use in components
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions

// Export reducer as default
export default authSlice.reducer 