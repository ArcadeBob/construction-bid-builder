'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // User is already authenticated, redirect to dashboard
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleLoginSuccess = () => {
    // Redirect to dashboard on successful login
    router.push('/dashboard');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
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
          <span className="text-secondary-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-secondary-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Access your construction bid builder dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>

        {/* Additional Links */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary-50 text-secondary-500">
                Need help?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Don&apos;t have an account?{' '}
              <span className="font-medium text-primary-600">
                Contact your administrator
              </span>
            </p>
            <p className="mt-2 text-sm text-secondary-600">
              Forgot your password?{' '}
              <span className="font-medium text-primary-600 cursor-not-allowed opacity-50">
                Reset password (Coming soon)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
