import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { PatientTestsSection } from './PatientTestsSection'
import { mockTestSummaries, mockPatientSummary } from '@/lib/__mocks__/api'

// Mock the TestDetails component to avoid complex rendering in unit tests
vi.mock('../TestDetails', () => ({
  TestDetails: ({ testIds, patientName, onClose }: { testIds: number[], patientName: string, onClose: () => void }) => (
    <div data-testid="test-details-mock">
      <div data-testid="mock-test-ids">{testIds.join(',')}</div>
      <div data-testid="mock-patient-name">{patientName}</div>
      <button data-testid="mock-close-button" onClick={onClose}>Mock Close</button>
    </div>
  )
}))

describe('PatientTestsSection', () => {
  const defaultProps = {
    tests: mockTestSummaries,
    patientName: mockPatientSummary.name
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render patient tests section with test list', () => {
    // Arrange & Act
    render(<PatientTestsSection {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('patient-tests-section')).toBeInTheDocument()
    expect(screen.getByTestId('section-title')).toHaveTextContent('Test History')
    expect(screen.getByTestId('section-description')).toHaveTextContent(`Medical tests performed for ${defaultProps.patientName} - Click on any test to view detailed charts`)
    expect(screen.getByTestId('tests-list')).toBeInTheDocument()
  })

  test('should render all test buttons', () => {
    // Arrange & Act
    render(<PatientTestsSection {...defaultProps} />)

    // Assert
    mockTestSummaries.forEach(test => {
      expect(screen.getByTestId(`test-button-${test.id}`)).toBeInTheDocument()
      expect(screen.getByTestId(`test-name-${test.id}`)).toHaveTextContent(test.name)
      expect(screen.getByTestId(`test-id-${test.id}`)).toHaveTextContent(`Test ID: ${test.id}`)
    })
  })

  test('should handle clicking on a test button', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<PatientTestsSection {...defaultProps} />)

    // Act
    const firstTestButton = screen.getByTestId(`test-button-${mockTestSummaries[0].id}`)
    await user.click(firstTestButton)

    // Assert
    expect(screen.getByTestId('test-details-section')).toBeInTheDocument()
    expect(screen.getByTestId('test-details-mock')).toBeInTheDocument()
  })

  test('should pass all test IDs to TestDetails when any test is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<PatientTestsSection {...defaultProps} />)

    // Act
    const firstTestButton = screen.getByTestId(`test-button-${mockTestSummaries[0].id}`)
    await user.click(firstTestButton)

    // Assert
    const mockTestIds = screen.getByTestId('mock-test-ids')
    const expectedTestIds = mockTestSummaries.map(test => test.id).join(',')
    expect(mockTestIds).toHaveTextContent(expectedTestIds)
  })

  test('should pass patient name to TestDetails', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<PatientTestsSection {...defaultProps} />)

    // Act
    const firstTestButton = screen.getByTestId(`test-button-${mockTestSummaries[0].id}`)
    await user.click(firstTestButton)

    // Assert
    const mockPatientName = screen.getByTestId('mock-patient-name')
    expect(mockPatientName).toHaveTextContent(defaultProps.patientName)
  })

  test('should close TestDetails when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<PatientTestsSection {...defaultProps} />)

    // Act - Open details
    const firstTestButton = screen.getByTestId(`test-button-${mockTestSummaries[0].id}`)
    await user.click(firstTestButton)
    expect(screen.getByTestId('test-details-section')).toBeInTheDocument()

    // Act - Close details
    const closeButton = screen.getByTestId('mock-close-button')
    await user.click(closeButton)

    // Assert
    expect(screen.queryByTestId('test-details-section')).not.toBeInTheDocument()
    expect(screen.queryByTestId('test-details-mock')).not.toBeInTheDocument()
  })

  test('should handle empty tests array', () => {
    // Arrange
    const emptyProps = {
      tests: [],
      patientName: defaultProps.patientName
    }

    // Act
    render(<PatientTestsSection {...emptyProps} />)

    // Assert
    expect(screen.getByTestId('patient-tests-section')).toBeInTheDocument()
    expect(screen.getByTestId('section-title')).toHaveTextContent('Test History')
    expect(screen.getByTestId('section-description')).toHaveTextContent(`Medical tests performed for ${defaultProps.patientName}`)
    expect(screen.getByTestId('no-tests-message')).toHaveTextContent('This patient does not have any tests on file.')
  })

  test('should not render tests list when no tests available', () => {
    // Arrange
    const emptyProps = {
      tests: [],
      patientName: defaultProps.patientName
    }

    // Act
    render(<PatientTestsSection {...emptyProps} />)

    // Assert
    expect(screen.queryByTestId('tests-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('test-details-section')).not.toBeInTheDocument()
  })

  test('should not show TestDetails initially', () => {
    // Arrange & Act
    render(<PatientTestsSection {...defaultProps} />)

    // Assert
    expect(screen.queryByTestId('test-details-section')).not.toBeInTheDocument()
    expect(screen.queryByTestId('test-details-mock')).not.toBeInTheDocument()
  })

  test('should handle multiple test clicks correctly', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<PatientTestsSection {...defaultProps} />)

    // Act - Click first test
    const firstTestButton = screen.getByTestId(`test-button-${mockTestSummaries[0].id}`)
    await user.click(firstTestButton)
    expect(screen.getByTestId('test-details-section')).toBeInTheDocument()

    // Act - Click second test (should still show details with all test IDs)
    const secondTestButton = screen.getByTestId(`test-button-${mockTestSummaries[1].id}`)
    await user.click(secondTestButton)

    // Assert
    expect(screen.getByTestId('test-details-section')).toBeInTheDocument()
    const mockTestIds = screen.getByTestId('mock-test-ids')
    const expectedTestIds = mockTestSummaries.map(test => test.id).join(',')
    expect(mockTestIds).toHaveTextContent(expectedTestIds)
  })

  test('should render correct patient name in description', () => {
    // Arrange
    const customPatientName = 'Buddy'
    const customProps = {
      ...defaultProps,
      patientName: customPatientName
    }

    // Act
    render(<PatientTestsSection {...customProps} />)

    // Assert
    expect(screen.getByTestId('section-description')).toHaveTextContent(`Medical tests performed for ${customPatientName} - Click on any test to view detailed charts`)
  })
}) 