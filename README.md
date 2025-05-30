# Rutherford Diagnostics

A modern veterinary diagnostic data visualization platform built with Next.js 15, TypeScript, and Tailwind CSS. This application provides an intuitive interface for viewing patient information, diagnostic test results, and parameter visualizations for veterinary practices.

## Features

- **Patient Management**: View detailed patient profiles with species, breed, and owner information
- **Diagnostic History**: Browse through patient diagnostic test history with date tracking
- **Parameter Visualization**: Interactive charts and visualizations for test parameters
- **Modern UI**: Clean, responsive design built with shadcn/ui components
- **Type Safety**: Full TypeScript implementation for robust development
- **Real-time Data**: Direct API integration for live diagnostic data

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context API with custom hooks

## Project Structure

```
rutherford-diagnostics/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── patients/[id]/     # Dynamic patient detail pages
│   ├── tests/[id]/        # Dynamic test detail pages
│   └── api/               # API routes (if needed)
├── components/            # Reusable UI components
│   ├── charts/           # Chart components for data visualization
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks (useApi, etc.)
│   └── types.ts          # TypeScript type definitions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rutherford-diagnostics
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Configure your API base URL and other environment variables in `.env.local`.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The application expects a backend API with the following endpoints:

- `GET /patients` - List all patients
- `GET /patients/{id}` - Get patient details with diagnostic history
- `GET /tests/{id}` - Get detailed test information with parameters

### Data Models

**Patient**:
```typescript
interface Patient {
  id: number
  name: string
  species: string
  breed: string
  ownerName: string
  ownerContact: string
  diagnosticHistory?: Test[]
}
```

**Test**:
```typescript
interface Test {
  id: number
  name: string
  datePerformed: string
  patientId: number
  parameters: Parameter[]
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Uses ESLint with Next.js configuration
- Prettier integration for code formatting
- TypeScript strict mode enabled
- Tailwind CSS for styling

### Key Features Implementation

**Centralized API Management**: All API calls are handled through the `useApi` hook in `lib/hooks/useApi.ts`, providing consistent error handling and type safety.

**Dynamic Routing**: Patient and test pages use Next.js dynamic routes with proper TypeScript interfaces for params.

**Component Architecture**: Modular component design with reusable UI components and specialized chart components for data visualization.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Build the application with:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is private and proprietary to Rutherford Diagnostics.
