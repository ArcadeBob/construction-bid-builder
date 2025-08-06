'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User;
  onSignOut: () => void;
}

export default function DashboardHeader({
  user,
  onSignOut,
}: DashboardHeaderProps) {
  return (
    <div className="card mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome to Construction Bid Builder
          </h1>
          <p className="text-secondary-600 mb-4">
            Logged in as: <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-sm text-secondary-500">User ID: {user.id}</p>
        </div>
        <Button variant="outline" onClick={onSignOut} className="flex-shrink-0">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
