import { redirect } from 'next/navigation'

/**
 * Home Page Component
 * For now, simulates logged-in state by redirecting to dashboard
 * In future, will check authentication status and show login if needed
 */
export default function HomePage() {
  // Simulate logged-in state by redirecting to dashboard
  // In a real app, this would check authentication status
  redirect('/dashboard')
}
