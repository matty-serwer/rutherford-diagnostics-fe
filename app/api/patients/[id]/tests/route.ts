import { NextResponse } from 'next/server'
import { mockTests } from '@/data/mockData'
import { Test } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const patientTests = mockTests.filter(
    (test: Test) => test.patientId === Number(id)
  )
  return NextResponse.json(patientTests)
}