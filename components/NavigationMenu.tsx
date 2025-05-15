'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
  {
    href: '/dashboard',
    label: 'Dashboard'
  },
  {
    href: '/tests',
    label: 'Tests'
  },
  {
    href: '/patients',
    label: 'Patients'
  }
]

export function NavigationMenu() {
  const pathname = usePathname()

  return (
    <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${pathname === route.href
            ? 'text-foreground'
            : 'text-foreground/60'
            }`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
} 