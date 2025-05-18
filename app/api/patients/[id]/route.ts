import { NextResponse } from 'next/server'
import { mockPatients } from '@/data/mockData'
import { Patient } from '@/lib/types'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const patient = mockPatients.find((p: Patient) => p.id === Number(id))

  if (!patient) {
    return new NextResponse('Patient not found', { status: 404 })
  }

  return NextResponse.json(patient)
} 