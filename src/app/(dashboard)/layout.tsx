import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      // Not authenticated, redirect to login
      redirect('/login')
    }

    // User is authenticated, render the dashboard content
    return (
      <div className="min-h-screen bg-secondary-50">
        {children}
      </div>
    )
  } catch (error) {
    console.error('Authentication error:', error)
    // On any auth error, redirect to login
    redirect('/login')
  }
}