import { Header } from '@/components/Header'
import { notFound } from 'next/navigation'
import React from 'react'

interface TestPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TestPage({ params }: TestPageProps) {
  const { id } = React.use(params)
  // TODO: Fetch test data based on params.id
  // For now, we'll just show a 404 if the ID isn't valid
  if (!id) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold">Test Details</h1>
        <div className="mt-6">
          <p>Test ID: {id}</p>
          {/* Test details will go here */}
        </div>
      </main>
    </>
  )
} 