import { NextResponse } from 'next/server'
import { mockTests } from '@/data/mockData'
import { Test } from '@/lib/types'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const patientTests = mockTests.filter((test: Test) => test.patient?.id === Number(id))
  return NextResponse.json(patientTests)
} 