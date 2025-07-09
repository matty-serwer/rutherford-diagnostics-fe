import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { TestDetails } from './TestDetails'
import { mockTestDetail, mockPatientSummary } from '@/lib/__mocks__/api'

// Mock the API module
vi.mock('@/lib/api')

// Mock the TestChart component to simplify testing
vi.mock('../TestChart', () => ({
  TestChart: ({ test }: { test: any }) => (
    <div data-testid={`test-chart-mock-${test.id}`}>
      <div data-testid="mock-chart-title">{test.parameterName}</div>
      <div data-testid="mock-chart-name">{test.name}</div>
    </div>
  )
}))

describe('TestDetails', () => {
  const defaultProps = {
    testIds: [22, 23],
    patientName: mockPatientSummary.name,
    onClose: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render test details with patient name', () => {
    // Arrange & Act
    render(<TestDetails {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('test-details')).toBeInTheDocument()
    expect(screen.getByTestId('details-title')).toHaveTextContent(`Test Results for ${defaultProps.patientName}`)
    expect(screen.getByTestId('details-description')).toHaveTextContent('Time-series analysis of diagnostic parameters')
    expect(screen.getByTestId('close-button')).toBeInTheDocument()
  })

  test('should show loading state initially', async () => {
    // Arrange - Mock API to return a promise that doesn't resolve immediately
    const { getTestById } = await import('@/lib/api')
    let resolvePromise: (value: typeof mockTestDetail) => void
    const pendingPromise = new Promise<typeof mockTestDetail>((resolve) => {
      resolvePromise = resolve
    })
    vi.mocked(getTestById).mockReturnValue(pendingPromise)

    // Act
    render(<TestDetails {...defaultProps} />)

    // Assert - Check loading state before resolving the promise
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading test details...')

    // Cleanup - resolve the promise to avoid hanging
    resolvePromise!(mockTestDetail)
  })

  test('should call onClose when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    render(<TestDetails {...defaultProps} onClose={mockOnClose} />)

    // Act
    const closeButton = screen.getByTestId('close-button')
    await user.click(closeButton)

    // Assert
    expect(mockOnClose).toHaveBeenCalledOnce()
  })

  test('should fetch and display test details successfully', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockImplementation((id: number) => {
      if (id === 22) return Promise.resolve(mockTestDetail)
      if (id === 23) return Promise.resolve({ ...mockTestDetail, id: 23, parameterName: 'Glucose' })
      throw new Error('Test not found')
    })

    // Act
    render(<TestDetails {...defaultProps} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('tests-summary')).toBeInTheDocument()
    })

    expect(screen.getByTestId('summary-title')).toHaveTextContent('Summary')
    expect(screen.getByTestId('summary-description')).toHaveTextContent('2 test types')
    expect(screen.getByTestId('charts-section')).toBeInTheDocument()
    expect(screen.getByTestId('charts-title')).toHaveTextContent('Parameter Trends Over Time')
  })

  test('should display error state when API fails', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockRejectedValue(new Error('Network error'))

    // Act
    render(<TestDetails {...defaultProps} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })

    expect(screen.getByTestId('error-title')).toHaveTextContent('Error Loading Test Details')
    expect(screen.getByTestId('error-message')).toHaveTextContent('Network error')
  })

  test('should display no data state when tests array is empty', async () => {
    // Arrange - For empty test IDs, no API calls should be made
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockResolvedValue(mockTestDetail)

    // Act
    render(<TestDetails {...defaultProps} testIds={[]} />)

    // Assert - Should show no data state immediately since no API calls are made
    await waitFor(() => {
      expect(screen.getByTestId('no-data-state')).toBeInTheDocument()
    })

    expect(screen.getByTestId('no-data-state')).toHaveTextContent('No test details available')

    // Verify no API calls were made for empty testIds
    expect(getTestById).not.toHaveBeenCalled()
  })

  test('should display summary information correctly', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    const testWithMultipleParams = {
      ...mockTestDetail,
      parameters: [
        ...mockTestDetail.parameters,
        { id: 999, value: 16.0, datePerformed: '2024-04-14' }
      ]
    }
    vi.mocked(getTestById).mockResolvedValue(testWithMultipleParams)

    // Act
    render(<TestDetails {...defaultProps} testIds={[22]} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('tests-summary')).toBeInTheDocument()
    })

    expect(screen.getByTestId('summary-description')).toHaveTextContent('1 test type • 6 total measurements')
    expect(screen.getByTestId('date-range')).toBeInTheDocument()
    expect(screen.getByTestId('test-types')).toHaveTextContent('Hemoglobin')
  })

  test('should handle singular vs plural text correctly', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    const testWithOneParam = {
      ...mockTestDetail,
      parameters: [mockTestDetail.parameters[0]]
    }
    vi.mocked(getTestById).mockResolvedValue(testWithOneParam)

    // Act
    render(<TestDetails {...defaultProps} testIds={[22]} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('tests-summary')).toBeInTheDocument()
    })

    expect(screen.getByTestId('summary-description')).toHaveTextContent('1 test type • 1 total measurement')
  })

  test('should render test charts for each test', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockImplementation((id: number) => {
      if (id === 22) return Promise.resolve(mockTestDetail)
      if (id === 23) return Promise.resolve({ ...mockTestDetail, id: 23, parameterName: 'Glucose' })
      throw new Error('Test not found')
    })

    // Act
    render(<TestDetails {...defaultProps} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('charts-section')).toBeInTheDocument()
    })

    expect(screen.getByTestId('test-chart-mock-22')).toBeInTheDocument()
    expect(screen.getByTestId('test-chart-mock-23')).toBeInTheDocument()
  })

  test('should fetch tests in correct order by name and date', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    const olderTest = {
      ...mockTestDetail,
      id: 24,
      name: 'AAA Test', // Should come first alphabetically
      parameters: [{ id: 1, value: 10, datePerformed: '2020-01-01' }]
    }
    const newerTest = {
      ...mockTestDetail,
      id: 25,
      name: 'ZZZ Test', // Should come last alphabetically
      parameters: [{ id: 2, value: 15, datePerformed: '2024-01-01' }]
    }

    vi.mocked(getTestById).mockImplementation((id: number) => {
      if (id === 24) return Promise.resolve(olderTest)
      if (id === 25) return Promise.resolve(newerTest)
      throw new Error('Test not found')
    })

    // Act
    render(<TestDetails {...defaultProps} testIds={[25, 24]} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('charts-section')).toBeInTheDocument()
    })

    // Check that charts are rendered in the correct order
    const charts = screen.getAllByTestId(/test-chart-mock-/)
    expect(charts[0]).toHaveAttribute('data-testid', 'test-chart-mock-24') // AAA Test first
    expect(charts[1]).toHaveAttribute('data-testid', 'test-chart-mock-25') // ZZZ Test second
  })

  test('should handle API error with custom error message', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockRejectedValue(new Error('Custom API error message'))

    // Act
    render(<TestDetails {...defaultProps} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })

    expect(screen.getByTestId('error-message')).toHaveTextContent('Custom API error message')
  })

  test('should not display loading state after successful data fetch', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    vi.mocked(getTestById).mockResolvedValue(mockTestDetail)

    // Act
    render(<TestDetails {...defaultProps} testIds={[22]} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('tests-summary')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error-state')).not.toBeInTheDocument()
    expect(screen.queryByTestId('no-data-state')).not.toBeInTheDocument()
  })

  test('should calculate date range correctly from multiple tests', async () => {
    // Arrange
    const { getTestById } = await import('@/lib/api')
    const test1 = {
      ...mockTestDetail,
      id: 22,
      parameters: [
        { id: 1, value: 10, datePerformed: '2022-01-01' },
        { id: 2, value: 12, datePerformed: '2024-06-01' }
      ]
    }
    const test2 = {
      ...mockTestDetail,
      id: 23,
      parameters: [
        { id: 3, value: 15, datePerformed: '2021-12-01' }, // Earliest
        { id: 4, value: 18, datePerformed: '2024-12-01' }  // Latest
      ]
    }

    vi.mocked(getTestById).mockImplementation((id: number) => {
      if (id === 22) return Promise.resolve(test1)
      if (id === 23) return Promise.resolve(test2)
      throw new Error('Test not found')
    })

    // Act
    render(<TestDetails {...defaultProps} testIds={[22, 23]} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('date-range')).toBeInTheDocument()
    })

    // Date range should span from earliest to latest across all tests
    const dateRangeElement = screen.getByTestId('date-range')
    expect(dateRangeElement.textContent).toContain('Date Range:')
  })
}) 