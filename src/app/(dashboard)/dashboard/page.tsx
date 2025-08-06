'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-6 w-6 text-primary-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-secondary-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Layout will handle redirect, but this is a fallback
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <DashboardHeader user={user} onSignOut={handleSignOut} />

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Proposals */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Recent Proposals
            </h3>
            <p className="text-secondary-600">
              Your recent bid proposals will appear here.
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/proposals')}
                className="w-full"
              >
                View All Proposals
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full"
                onClick={() => router.push('/proposals/new')}
              >
                New Proposal
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                Browse Templates
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                View Reports
              </Button>
            </div>
          </div>

          {/* Getting Started */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Getting Started
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-secondary-600">
                  Create your first proposal
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                <span className="text-secondary-600">
                  Set up pricing templates
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                <span className="text-secondary-600">
                  Configure company details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Protection Success Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Route Protection Active!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  ✅ Server-side authentication protection is working
                  <br />
                  ✅ Unauthorized users are redirected to login
                  <br />✅ Session validation is operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
