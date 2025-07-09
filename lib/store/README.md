# Redux Store Documentation

This document explains how to use the Redux store in the Rutherford Diagnostics application.

## Quick Start

### 1. Import the hooks
```typescript
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
```

### 2. Use in components
```typescript
'use client'

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { addNotification, setCurrentPatient } from '@/lib/store/actions'
import { selectIsAuthenticated, selectCurrentUser, selectPatients } from '@/lib/store/selectors'

export function ExampleComponent() {
  // Get state using selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const currentUser = useAppSelector(selectCurrentUser)
  const patients = useAppSelector(selectPatients)
  
  // Get dispatch function
  const dispatch = useAppDispatch()
  
  // Dispatch actions
  const handleShowNotification = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Success!',
      message: 'Operation completed successfully'
    }))
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {currentUser?.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
      <button onClick={handleShowNotification}>
        Show Notification
      </button>
    </div>
  )
}
```

## Store Structure

### Auth State
- `isAuthenticated`: boolean - User login status
- `user`: User object or null - Current user data
- `token`: string or null - JWT token (placeholder)
- `isLoading`: boolean - Auth operation loading state
- `error`: string or null - Auth errors

### Patient State
- `patients`: Patient[] - All patients list
- `currentPatient`: Patient or null - Selected patient
- `filteredPatients`: Patient[] - Filtered by search
- `searchQuery`: string - Current search term
- `isLoading`: boolean - Loading patients
- `isLoadingCurrentPatient`: boolean - Loading current patient details

### Test State  
- `tests`: TestSummary[] - All tests list
- `currentTest`: TestDetail or null - Selected test with full data
- `filteredTests`: TestSummary[] - Filtered by search
- `chartDateRange`: { start, end } - Date filter for charts
- `showReferenceLines`: boolean - Chart display option

### UI State
- `notifications`: Notification[] - Toast notifications
- `activeModals`: Modal[] - Open modals
- `sidebarCollapsed`: boolean - Sidebar state
- `theme`: 'light' | 'dark' | 'system' - Theme preference
- `breadcrumbs`: Array - Navigation breadcrumbs

## Common Patterns

### Loading States
```typescript
const isLoading = useAppSelector(selectIsAnyLoading)
const patientsLoading = useAppSelector(selectPatientsLoading)

if (isLoading) {
  return <div>Loading...</div>
}
```

### Error Handling
```typescript
const error = useAppSelector(selectPatientError)
const hasAnyError = useAppSelector(selectHasAnyError)

if (error) {
  return <div>Error: {error}</div>
}
```

### User Role Checks
```typescript
const isAdmin = useAppSelector(selectIsAdmin)
const userRole = useAppSelector(selectUserRole)

if (isAdmin) {
  return <AdminPanel />
}
```

### Notifications
```typescript
const dispatch = useAppDispatch()

// Success notification
dispatch(addNotification({
  type: 'success',
  title: 'Patient Updated',
  message: 'Patient information saved successfully'
}))

// Error notification  
dispatch(addNotification({
  type: 'error',
  title: 'Save Failed',
  message: 'Could not save patient data',
  duration: 0 // Persistent notification
}))
```

### Search and Filtering
```typescript
const searchQuery = useAppSelector(selectPatientSearchQuery)
const filteredPatients = useAppSelector(selectFilteredPatients)

const handleSearch = (query: string) => {
  dispatch(setPatientSearchQuery(query))
}
```

### Chart Data
```typescript
const chartData = useAppSelector(selectCurrentTestChartData)
const showReferenceLines = useAppSelector(selectShowReferenceLines)

const toggleReferences = () => {
  dispatch(toggleReferenceLines())
}
```

## Development Notes

- **Placeholder Authentication**: The auth state is currently set to logged in for development
- **JWT Ready**: When JWT is implemented, update the auth slice actions
- **Type Safety**: All hooks and selectors are fully typed
- **DevTools**: Redux DevTools are enabled in development
- **Immutable Updates**: Using Redux Toolkit's Immer for safe state updates

## File Structure
```
lib/store/
├── index.ts          # Store configuration and types
├── ReduxProvider.tsx # Provider component for app wrapper
├── hooks.ts          # Typed useSelector and useDispatch hooks
├── actions.ts        # Centralized action exports
├── selectors.ts      # Reusable state selectors
└── slices/
    ├── authSlice.ts     # Authentication state
    ├── patientSlice.ts  # Patient data state  
    ├── testSlice.ts     # Test data state
    └── uiSlice.ts       # UI state and preferences
```

## Next Steps

1. Implement JWT authentication integration
2. Add async thunks for API calls
3. Add persistence middleware for auth state
4. Implement real-time updates via WebSocket
5. Add optimistic updates for better UX 