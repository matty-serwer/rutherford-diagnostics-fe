import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-primary">Rutherford Diagnostics</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/patients"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Patients
          </Link>
        </nav>
      </div>
    </header>
  )
} 