import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import patientSlice from './slices/patientSlice'
import testSlice from './slices/testSlice'
import uiSlice from './slices/uiSlice'

// Configure the Redux store with all slices
export const store = configureStore({
  reducer: {
    auth: authSlice,
    patient: patientSlice,
    test: testSlice,
    ui: uiSlice,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
})

// Export store types for TypeScript integration
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 