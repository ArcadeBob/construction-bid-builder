import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Construction Bid Builder',
  description: 'Sign in to access your construction bid builder dashboard',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary-50">
      {children}
    </div>
  )
}