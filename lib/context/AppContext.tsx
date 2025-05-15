'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Patient, Test, ApiError } from '../types'

// State types
interface AppState {
  patients: Patient[]
  tests: Test[]
  loading: boolean
  error: ApiError | null
}

// Action types
type AppAction =
  | { type: 'SET_PATIENTS'; payload: Patient[] }
  | { type: 'SET_TESTS'; payload: Test[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ApiError | null }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: number }
  | { type: 'ADD_TEST'; payload: Test }
  | { type: 'UPDATE_TEST'; payload: Test }
  | { type: 'DELETE_TEST'; payload: number }

// Initial state
const initialState: AppState = {
  patients: [],
  tests: [],
  loading: false,
  error: null,
}

// Create context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload }
    case 'SET_TESTS':
      return { ...state, tests: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] }
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map((patient) =>
          patient.id === action.payload.id ? action.payload : patient
        ),
      }
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter((patient) => patient.id !== action.payload),
      }
    case 'ADD_TEST':
      return { ...state, tests: [...state.tests, action.payload] }
    case 'UPDATE_TEST':
      return {
        ...state,
        tests: state.tests.map((test) =>
          test.id === action.payload.id ? action.payload : test
        ),
      }
    case 'DELETE_TEST':
      return {
        ...state,
        tests: state.tests.filter((test) => test.id !== action.payload),
      }
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook for using the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 