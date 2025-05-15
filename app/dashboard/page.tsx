import { Header } from '@/components/Header'

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Dashboard cards will go here */}
        </div>
      </main>
    </>
  )
} 