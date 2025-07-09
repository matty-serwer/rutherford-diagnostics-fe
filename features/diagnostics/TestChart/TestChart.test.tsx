import { render, screen } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { TestChart } from './TestChart'
import { mockTestDetail, mockTestDetailEmpty } from '@/lib/__mocks__/api'

// Mock recharts components to avoid rendering issues in tests
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    ReferenceLine: () => <div data-testid="reference-line" />,
    Tooltip: () => <div data-testid="tooltip" />
  }
})

// Mock ChartContainer to avoid nested ResponsiveContainer issues
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="chart-container" {...props}>
      {children}
    </div>
  ),
  ChartTooltip: ({ children }: any) => <div data-testid="chart-tooltip">{children}</div>,
  ChartTooltipContent: ({ children }: any) => <div data-testid="chart-tooltip-content">{children}</div>
}))

describe('TestChart', () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks()
  })

  test('should render test chart with parameter data', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    expect(screen.getByTestId(`test-chart-${testData.id}`)).toBeInTheDocument()
    expect(screen.getByTestId('chart-title')).toHaveTextContent(testData.parameterName)
    expect(screen.getByTestId('chart-description')).toHaveTextContent(`${testData.name} • ${testData.unit}`)
    expect(screen.getByTestId('chart-metadata')).toBeInTheDocument()
  })

  test('should display reference range information', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    const referenceRange = screen.getByTestId('reference-range')
    expect(referenceRange).toHaveTextContent(`Reference Range: ${testData.referenceMin} - ${testData.referenceMax} ${testData.unit}`)
  })

  test('should display measurement count', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    const measurementCount = screen.getByTestId('measurement-count')
    expect(measurementCount).toHaveTextContent(`${testData.parameters.length} measurements recorded`)
  })

  test('should display singular measurement when count is 1', () => {
    // Arrange
    const testDataWithOneParameter = {
      ...mockTestDetail,
      parameters: [mockTestDetail.parameters[0]]
    }

    // Act
    render(<TestChart test={testDataWithOneParameter} />)

    // Assert
    const measurementCount = screen.getByTestId('measurement-count')
    expect(measurementCount).toHaveTextContent('1 measurement recorded')
  })

  test('should render chart container when data is available', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  test('should render chart components when data is available', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    expect(screen.getByTestId('line')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    // Reference lines should appear twice (min and max)
    expect(screen.getAllByTestId('reference-line')).toHaveLength(2)
  })

  test('should handle empty parameter data gracefully', () => {
    // Arrange
    const testDataEmpty = mockTestDetailEmpty

    // Act
    render(<TestChart test={testDataEmpty} />)

    // Assert
    expect(screen.getByTestId(`test-chart-${testDataEmpty.id}`)).toBeInTheDocument()
    expect(screen.getByTestId('chart-title')).toHaveTextContent(testDataEmpty.parameterName)
    expect(screen.getByTestId('chart-description')).toHaveTextContent(`${testDataEmpty.name} • ${testDataEmpty.unit}`)
    expect(screen.getByTestId('no-data-message')).toHaveTextContent('No measurement data available for this test')
  })

  test('should not render chart container when no data available', () => {
    // Arrange
    const testDataEmpty = mockTestDetailEmpty

    // Act
    render(<TestChart test={testDataEmpty} />)

    // Assert
    expect(screen.queryByTestId('chart-container')).not.toBeInTheDocument()
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument()
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument()
  })

  test('should render with correct test ID based on test data', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    const chartElement = screen.getByTestId(`test-chart-${testData.id}`)
    expect(chartElement).toBeInTheDocument()
    // Check for actual Card classes from shadcn
    expect(chartElement).toHaveClass('rounded-xl', 'border', 'shadow-sm')
  })

  test('should display test information correctly', () => {
    // Arrange
    const testData = mockTestDetail

    // Act
    render(<TestChart test={testData} />)

    // Assert
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Hemoglobin')
    expect(screen.getByTestId('chart-description')).toHaveTextContent('Complete Blood Count • g/dL')
    expect(screen.getByTestId('reference-range')).toHaveTextContent('Reference Range: 12 - 18 g/dL')
    expect(screen.getByTestId('measurement-count')).toHaveTextContent('5 measurements recorded')
  })
}) 