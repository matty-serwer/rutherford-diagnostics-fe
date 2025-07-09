import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Cleanup after each test case (React Testing Library)
afterEach(() => {
  cleanup()
})

// Mock Next.js environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8080'
})

// Mock window.ResizeObserver (required for recharts)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock console methods to avoid noise in tests
Object.defineProperty(window, 'console', {
  value: {
    ...console,
    // Optionally silence console.log in tests
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
})

// Mock fetch globally for API calls
global.fetch = vi.fn() 