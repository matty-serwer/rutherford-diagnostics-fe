import { Header } from '@/components/Header'
import { notFound } from 'next/navigation'

interface PatientPageProps {
  params: {
    id: string
  }
}

export default function PatientPage({ params }: PatientPageProps) {
  // TODO: Fetch patient data based on params.id
  // For now, we'll just show a 404 if the ID isn't valid
  if (!params.id) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <div className="mt-6">
          <p>Patient ID: {params.id}</p>
          {/* Patient details will go here */}
        </div>
      </main>
    </>
  )
} 