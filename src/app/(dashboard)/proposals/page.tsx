'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ProposalListItem, ProposalStatus, ProposalFilters as ProposalFiltersType, ProposalSortOptions } from '@/types/proposal';
import ProposalList from '@/components/proposals/proposal-list';
import ProposalFilters from '@/components/proposals/proposal-filters';
import Button from '@/components/ui/Button';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProposalFiltersType>({});
  const [sort, setSort] = useState<ProposalSortOptions>({
    field: 'updated_at',
    direction: 'desc'
  });
  const [search, setSearch] = useState('');

  const supabase = createClient();

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      // Build query
      let query = supabase
        .from('proposals')
        .select(`
          id,
          project_name,
          client_name,
          project_type,
          status,
          total_amount,
          created_at,
          updated_at
        `)
        .eq('contractor_id', user.id);

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.project_type && filters.project_type.length > 0) {
        query = query.in('project_type', filters.project_type);
      }

      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }

      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      if (filters.min_amount) {
        query = query.gte('total_amount', filters.min_amount);
      }

      if (filters.max_amount) {
        query = query.lte('total_amount', filters.max_amount);
      }

      // Apply search
      if (search.trim()) {
        query = query.or(`project_name.ilike.%${search}%,client_name.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      const { data, error } = await query;

      if (error) {
        // If the table doesn't exist, show a helpful message
        if (error.message.includes('does not exist')) {
          setError('Database schema not set up. Please run the database migrations first.');
        } else {
          throw error;
        }
      } else {
        setProposals((data || []) as ProposalListItem[]);
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, search, supabase]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleStatusChange = async (proposalId: string, newStatus: ProposalStatus) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: newStatus })
        .eq('id', proposalId);

      if (error) {
        throw error;
      }

      // Update local state
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: newStatus, updated_at: new Date().toISOString() }
            : proposal
        )
      );
    } catch (err) {
      console.error('Error updating proposal status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update proposal status');
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm('Are you sure you want to delete this proposal? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setProposals(prev => prev.filter(proposal => proposal.id !== proposalId));
    } catch (err) {
      console.error('Error deleting proposal:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete proposal');
    }
  };

  const handleDuplicateProposal = async (proposalId: string) => {
    try {
      // Get the original proposal
      const { data: originalProposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

             // Create a copy with draft status
       const { error: createError } = await supabase
        .from('proposals')
        .insert({
          ...originalProposal,
          id: undefined, // Let Supabase generate new ID
          project_name: `${originalProposal.project_name} (Copy)`,
          status: 'draft',
          created_at: undefined,
          updated_at: undefined
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Refresh the list
      fetchProposals();
    } catch (err) {
      console.error('Error duplicating proposal:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate proposal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
              <p className="mt-2 text-gray-600">
                Manage your construction proposals and track their status
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/proposals/new'}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Create New Proposal
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ProposalFilters
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <ProposalList
          proposals={proposals}
          loading={loading}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteProposal}
          onDuplicate={handleDuplicateProposal}
        />
      </div>
    </div>
  );
} 