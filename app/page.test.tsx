import { describe, test, expect, vi } from 'vitest'
import HomePage from './page'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

describe('HomePage', () => {
  test('should redirect to dashboard', async () => {
    // Arrange
    const { redirect } = await import('next/navigation')
    vi.clearAllMocks()

    // Act
    HomePage()

    // Assert
    expect(redirect).toHaveBeenCalledWith('/dashboard')
    expect(redirect).toHaveBeenCalledOnce()
  })
}) 