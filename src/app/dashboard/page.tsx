'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          // Not authenticated, redirect to login
          router.replace('/login')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Auth error:', error)
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-secondary-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="card mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Welcome to Construction Bid Builder
              </h1>
              <p className="text-secondary-600 mb-4">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-sm text-secondary-500">
                User ID: {user.id}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex-shrink-0"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Recent Projects
            </h3>
            <p className="text-secondary-600">
              Your recent bid projects will appear here.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="primary" size="sm" className="w-full">
                New Bid
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                View Templates
              </Button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Account Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Account Type:</span>
                <span className="font-medium">Contractor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Test Success Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Authentication Working!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  ✅ Login form authentication is working correctly<br/>
                  ✅ User session management is active<br/>
                  ✅ Redirect functionality is operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}