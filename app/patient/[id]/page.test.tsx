import { render, screen } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import PatientPage from './page'
import { mockPatientWithHistory, mockPatientSummary } from '@/lib/__mocks__/api'

// Mock Next.js navigation and Link
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} data-testid="nav-link" {...props}>
      {children}
    </a>
  )
}))

// Mock the API module
vi.mock('@/lib/api')

// Mock the PatientTestsSection component
vi.mock('@/features/diagnostics', () => ({
  PatientTestsSection: ({ tests, patientName }: { tests: any[], patientName: string }) => (
    <div data-testid="patient-tests-section-mock">
      <div data-testid="mock-patient-name">{patientName}</div>
      <div data-testid="mock-tests-count">{tests.length}</div>
    </div>
  )
}))

describe('PatientPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render patient information successfully', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(mockPatientWithHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert - Use getAllByText and check the first one (the page title)
    const walterElements = screen.getAllByText('Walter')
    expect(walterElements).toHaveLength(2) // One in patient title, one in mock component
    expect(walterElements[0]).toBeInTheDocument()
    expect(screen.getByText('Patient ID: 1')).toBeInTheDocument()
    expect(screen.getByText('Dog')).toBeInTheDocument()
    expect(screen.getByText('Labrador')).toBeInTheDocument()
    expect(screen.getByText('2018-05-20')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('555-1234')).toBeInTheDocument()
  })

  test('should render back to dashboard link', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(mockPatientWithHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    const backLink = screen.getByTestId('nav-link')
    expect(backLink).toHaveAttribute('href', '/dashboard')
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument()
  })

  test('should render PatientTestsSection with correct props', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(mockPatientWithHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByTestId('patient-tests-section-mock')).toBeInTheDocument()
    expect(screen.getByTestId('mock-patient-name')).toHaveTextContent('Walter')
    expect(screen.getByTestId('mock-tests-count')).toHaveTextContent('2') // mockPatientWithHistory has 2 tests
  })

  test('should handle patient without diagnostic history', async () => {
    // Arrange
    const patientWithoutHistory = {
      ...mockPatientSummary,
      diagnosticHistory: undefined
    }
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(patientWithoutHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByTestId('patient-tests-section-mock')).toBeInTheDocument()
    expect(screen.getByTestId('mock-tests-count')).toHaveTextContent('0') // Empty array fallback
  })

  test('should call notFound for invalid patient ID', async () => {
    // Arrange
    const { notFound } = await import('next/navigation')
    const mockParams = Promise.resolve({ id: 'invalid' })

    // Act
    await PatientPage({ params: mockParams })

    // Assert
    expect(notFound).toHaveBeenCalledOnce()
  })

  test('should call notFound for non-numeric ID', async () => {
    // Arrange
    const { notFound } = await import('next/navigation')
    const mockParams = Promise.resolve({ id: 'abc' })

    // Act
    await PatientPage({ params: mockParams })

    // Assert
    expect(notFound).toHaveBeenCalledOnce()
  })

  test('should display error state when API fails', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockRejectedValue(new Error('Network error'))
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByText('Error Loading Patient')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByText('Please ensure the backend is running and the patient ID is valid.')).toBeInTheDocument()
  })

  test('should handle custom error messages', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockRejectedValue(new Error('Patient not found'))
    const mockParams = Promise.resolve({ id: '999' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByText('Patient not found')).toBeInTheDocument()
  })

  test('should handle non-Error thrown objects', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockRejectedValue('String error')
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByText('Failed to load patient')).toBeInTheDocument()
  })

  test('should parse patient ID correctly', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(mockPatientWithHistory)
    const mockParams = Promise.resolve({ id: '42' })

    // Act
    await PatientPage({ params: mockParams })

    // Assert
    expect(getPatientById).toHaveBeenCalledWith(42)
  })

  test('should display patient information sections correctly', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(mockPatientWithHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByText('Animal Information')).toBeInTheDocument()
    expect(screen.getByText('Owner Information')).toBeInTheDocument()
  })

  test('should handle zero ID correctly', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    const patientWithId0 = { ...mockPatientWithHistory, id: 0 }
    vi.mocked(getPatientById).mockResolvedValue(patientWithId0)
    const mockParams = Promise.resolve({ id: '0' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(getPatientById).toHaveBeenCalledWith(0)
    expect(screen.getByText('Patient ID: 0')).toBeInTheDocument()
  })

  test('should render patient with empty diagnostic history', async () => {
    // Arrange
    const patientWithEmptyHistory = {
      ...mockPatientSummary,
      diagnosticHistory: []
    }
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockResolvedValue(patientWithEmptyHistory)
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.getByTestId('patient-tests-section-mock')).toBeInTheDocument()
    expect(screen.getByTestId('mock-tests-count')).toHaveTextContent('0')
  })

  test('should not render patient content when error occurs', async () => {
    // Arrange
    const { getPatientById } = await import('@/lib/api')
    vi.mocked(getPatientById).mockRejectedValue(new Error('Network error'))
    const mockParams = Promise.resolve({ id: '1' })

    // Act
    const component = await PatientPage({ params: mockParams })
    render(component)

    // Assert
    expect(screen.queryByText('Animal Information')).not.toBeInTheDocument()
    expect(screen.queryByTestId('patient-tests-section-mock')).not.toBeInTheDocument()
  })
}) 