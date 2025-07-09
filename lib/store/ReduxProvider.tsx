'use client'

import { Provider } from 'react-redux'
import { store } from './index'

// Redux Provider component to wrap the app
// Uses 'use client' directive for Next.js 13+ App Router compatibility
export function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
} 