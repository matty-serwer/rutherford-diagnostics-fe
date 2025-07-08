import { NextRequest, NextResponse } from 'next/server'

/**
 * GET handler for the base API route
 * Provides basic API information and health check
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Rutherford Diagnostics API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

/**
 * POST handler for the base API route
 * Can be extended for general API operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json(
      {
        message: 'Data received successfully',
        data: body,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }
} 