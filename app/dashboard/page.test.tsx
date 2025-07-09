import { render, screen } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import DashboardPage from './page'
import { mockPatientSummary } from '@/lib/__mocks__/api'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} data-testid="nav-link" {...props}>
      {children}
    </a>
  )
}))

// Mock the API module
vi.mock('@/lib/api')

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render dashboard title and description', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue([mockPatientSummary])

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rutherford Diagnostics Dashboard')
    expect(screen.getByText('Select a patient to view their diagnostic information')).toBeInTheDocument()
  })

  test('should display patients successfully', async () => {
    // Arrange
    const mockPatients = [
      mockPatientSummary,
      {
        ...mockPatientSummary,
        id: 2,
        name: 'Buddy',
        species: 'Cat',
        breed: 'Persian',
        ownerName: 'John Smith'
      }
    ]
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue(mockPatients)

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('Walter')).toBeInTheDocument()
    expect(screen.getByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Dog • Labrador')).toBeInTheDocument()
    expect(screen.getByText('Cat • Persian')).toBeInTheDocument()
  })

  test('should display patient information correctly', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue([mockPatientSummary])

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('Walter')).toBeInTheDocument()
    expect(screen.getByText('Dog • Labrador')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('2018-05-20')).toBeInTheDocument()
    expect(screen.getByText('555-1234')).toBeInTheDocument()
  })

  test('should create correct navigation links for patients', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue([mockPatientSummary])

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    const navLinks = screen.getAllByTestId('nav-link')
    expect(navLinks).toHaveLength(1)
    expect(navLinks[0]).toHaveAttribute('href', `/patient/${mockPatientSummary.id}`)
  })

  test('should display error state when API fails', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockRejectedValue(new Error('Network error'))

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('Error Loading Patients')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByText('Please ensure the backend is running on http://localhost:8080')).toBeInTheDocument()
  })

  test('should display no patients state when empty array returned', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue([])

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('No Patients Found')).toBeInTheDocument()
    expect(screen.getByText('No patients are currently in the system.')).toBeInTheDocument()
  })

  test('should handle custom error messages', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockRejectedValue(new Error('Custom API error'))

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('Custom API error')).toBeInTheDocument()
  })

  test('should handle non-Error thrown objects', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockRejectedValue('String error')

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    expect(screen.getByText('Failed to load patients')).toBeInTheDocument()
  })

  test('should render multiple patients in grid layout', async () => {
    // Arrange
    const mockPatients = Array.from({ length: 5 }, (_, i) => ({
      ...mockPatientSummary,
      id: i + 1,
      name: `Patient ${i + 1}`,
      ownerName: `Owner ${i + 1}`
    }))
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue(mockPatients)

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    // Check that all patients are rendered
    mockPatients.forEach(patient => {
      expect(screen.getByText(patient.name)).toBeInTheDocument()
      expect(screen.getByText(patient.ownerName)).toBeInTheDocument()
    })

    // Check that all navigation links are present
    const navLinks = screen.getAllByTestId('nav-link')
    expect(navLinks).toHaveLength(5)
  })

  test('should render patient cards with correct hover classes', async () => {
    // Arrange
    const { getAllPatients } = await import('@/lib/api')
    vi.mocked(getAllPatients).mockResolvedValue([mockPatientSummary])

    // Act
    const component = await DashboardPage()
    render(component)

    // Assert
    const navLink = screen.getByTestId('nav-link')
    expect(navLink).toHaveClass('group', 'block', 'transition-transform', 'hover:scale-105')
  })
}) 