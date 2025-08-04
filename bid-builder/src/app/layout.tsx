import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Construction Bid Builder',
  description: 'Professional bid and proposal builder for glazing contractors',
  keywords: 'construction, glazing, proposals, bids, contractors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-secondary-50">
          {children}
        </div>
      </body>
    </html>
  )
}
