# Rutherford Diagnostics Frontend

A modern Next.js application for veterinary diagnostic test management, providing real-time visualization of patient test results and time-series parameter analysis.

## Project Overview

Rutherford Diagnostics Frontend is a React-based web application that allows veterinary professionals to:

- View Patient Records: Browse and search patient information with diagnostic history
- Analyze Test Results: Interactive time-series charts showing parameter trends over time
- Monitor Reference Ranges: Visual indicators for normal/abnormal test values
- Track Multiple Parameters: Support for various diagnostic tests (CBC, Chemistry Panel, Thyroid, etc.)

## Technology Stack

### Core Technologies
- Framework: [Next.js 15.3](https://nextjs.org/) (App Router)
- Language: TypeScript
- Styling: [Tailwind CSS v4.1](https://tailwindcss.com/)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Charts: [Recharts](https://recharts.org/)
- State Management: Redux Toolkit (when implemented)
- Testing: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

### Development Tools
- Package Manager: npm
- Linting: ESLint + TypeScript ESLint
- Fonts: Custom Futura font family + Google Fonts (Geist)

## Prerequisites

Before starting development, ensure you have:

- Node.js: Version 18.0.0 or higher
- npm: Version 8.0.0 or higher
- Git: For version control

### Backend Requirements
- Backend Server: Running on `http://localhost:8080`
- API Endpoints: Patient and test data endpoints (see API Integration section)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd rutherford-diagnostics-fe

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API URL (defaults to http://localhost:8080 if not set)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Environment
NODE_ENV=development
```

### 3. Font Setup

Ensure the following Futura font files are in the `fonts/` directory:
- `Futura-Medium.ttf`
- `Futura-MediumItalic.ttf`
- `Futura-Bold.ttf`
- `Futura-CondensedMedium.ttf`
- `Futura-CondensedExtraBold.ttf`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
rutherford-diagnostics-fe/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Main dashboard
│   ├── patient/[id]/             # Dynamic patient pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── chart.tsx
│   └── layout/                   # Layout components
│       ├── Header/
│       └── Sidebar/
├── features/                     # Feature-specific components
│   ├── diagnostics/              # Diagnostic-related features
│   │   ├── TestChart/            # Chart visualization
│   │   ├── TestDetails/          # Detailed test information
│   │   └── PatientTestsSection/  # Patient test overview
│   └── auth/                     # Authentication features
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client functions
│   ├── utils.ts                  # Helper utilities
│   └── __mocks__/                # Mock data for testing
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Centralized type exports
├── hooks/                        # Custom React hooks
├── context/                      # React Context providers
├── utils/                        # Pure utility functions
├── styles/                       # Additional stylesheets
├── public/                       # Static assets
└── fonts/                        # Custom font files
```

## API Integration

### Backend Requirements

The frontend expects a REST API running on `http://localhost:8080` with the following endpoints:

#### Patient Endpoints
```
GET /patient              # Get all patients (summary)
GET /patient/{id}         # Get patient with diagnostic history
```

#### Test Endpoints
```
GET /test                 # Get all tests (summary)
GET /test/{id}            # Get test with time-series parameters
```

### Data Models

#### Patient Summary
```typescript
{
  id: number
  name: string
  species: string
  breed: string
  dateOfBirth: string     // ISO 8601 (YYYY-MM-DD)
  ownerName: string
  ownerContact: string
}
```

#### Test Detail
```typescript
{
  id: number
  name: string
  patient: PatientSummary
  parameterName: string   // e.g., "Hemoglobin"
  unit: string           // e.g., "g/dL"
  referenceMin: number
  referenceMax: number
  parameters: [          // Time-series data
    {
      id: number
      value: number
      datePerformed: string  // ISO 8601 (YYYY-MM-DD)
    }
  ]
}
```

### API Client Usage

```typescript
import { getAllPatients, getPatientById, getTestById } from '@/lib/api'

// Fetch all patients
const patients = await getAllPatients()

// Fetch specific patient with history
const patient = await getPatientById(1)

// Fetch test with time-series data
const test = await getTestById(22)
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Test Structure

- Component Tests: Located alongside components (`.test.tsx`)
- API Tests: Mock implementations in `lib/__mocks__/`
- Setup: Global test configuration in `vitest.setup.ts`

### Testing Standards

- Use `render()` from `@testing-library/react`
- Include `data-testid` attributes for reliable element selection
- Follow Arrange-Act-Assert pattern
- Mock API calls using `vi.mock()`

Example test:
```typescript
import { render, screen } from '@testing-library/react'
import { TestChart } from './TestChart'
import { mockTestDetail } from '@/lib/__mocks__/api'

test('should render test chart with data', () => {
  render(<TestChart test={mockTestDetail} />)
  
  expect(screen.getByTestId('test-chart-22')).toBeInTheDocument()
  expect(screen.getByText('Hemoglobin')).toBeInTheDocument()
})
```

## Build and Deployment

### Development Build

```bash
npm run build
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

### Production Deployment

The application is optimized for deployment on [Vercel](https://vercel.com/):

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## Styling Guidelines

### Tailwind CSS v4.1

- Configuration: CSS-first approach (no `tailwind.config.js`)
- Custom Variables: Define in `globals.css`
- Component Styling: Use Tailwind classes with shadcn/ui components

### Typography

- Primary Font: Futura (custom) for headings and emphasis
- Body Font: Geist Sans for general content
- Code Font: Geist Mono for code blocks

### Color Scheme

```css
/* Define custom colors in globals.css */
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --success: #16a34a;
  --warning: #d97706;
  --error: #dc2626;
}
```

## Contributing

### Development Workflow

1. Create Feature Branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make Changes
   - Follow TypeScript best practices
   - Add tests for new components
   - Update documentation if needed

3. Test Changes
   ```bash
   npm run test
   npm run build
   ```

4. Commit Changes
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. Create Pull Request
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Ensure all tests pass

### Code Standards

- TypeScript: Strict mode enabled, no `any` types
- Components: Use functional components with hooks
- File Naming: PascalCase for components, camelCase for utilities
- Exports: Named exports preferred over default exports

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)

### Design System
- Components: Based on shadcn/ui with custom Futura typography
- Icons: Lucide React (via shadcn/ui)
- Charts: Recharts with custom styling

## Troubleshooting

### Common Issues

Font Loading Issues
```bash
# Ensure fonts are in the correct directory
ls fonts/
# Should show: Futura-Bold.ttf, Futura-Medium.ttf, etc.
```

API Connection Issues
```bash
# Check if backend is running
curl http://localhost:8080/patient
# Should return JSON array of patients
```

Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Support

For questions or issues:

1. Frontend Issues: Create an issue in this repository
2. Backend Integration: Coordinate with backend team for API changes
3. Design Questions: Refer to the design system documentation
