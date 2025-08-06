'use client';

import { useState } from 'react';
import type { ProposalFilters, ProposalSortOptions } from '@/types/proposal';
import { ProposalStatus, ProjectType, PROPOSAL_STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/types/proposal';

interface ProposalFiltersProps {
  filters: ProposalFilters;
  onFiltersChange: (filters: ProposalFilters) => void;
  sort: ProposalSortOptions;
  onSortChange: (sort: ProposalSortOptions) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function ProposalFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  search,
  onSearchChange
}: ProposalFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleStatusFilter = (status: ProposalStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleProjectTypeFilter = (projectType: ProjectType, checked: boolean) => {
    const currentTypes = filters.project_type || [];
    const newTypes = checked
      ? [...currentTypes, projectType]
      : currentTypes.filter(t => t !== projectType);
    
    onFiltersChange({
      ...filters,
      project_type: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || search.trim() !== '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search proposals by project name or client..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Status Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {Object.values(ProposalStatus).map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status) || false}
                  onChange={(e) => handleStatusFilter(status, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {PROPOSAL_STATUS_LABELS[status]}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Project Type Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Project Type</h4>
            <div className="space-y-2">
              {Object.values(ProjectType).map((projectType) => (
                <label key={projectType} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.project_type?.includes(projectType) || false}
                    onChange={(e) => handleProjectTypeFilter(projectType, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {PROJECT_TYPE_LABELS[projectType]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Created After</label>
                <input
                  type="date"
                  value={filters.created_after || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    created_after: e.target.value || undefined
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Created Before</label>
                <input
                  type="date"
                  value={filters.created_before || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    created_before: e.target.value || undefined
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Amount Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_amount || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    min_amount: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum Amount</label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={filters.max_amount || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    max_amount: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort and Clear */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                onSortChange({
                  field: field as any,
                  direction: direction as 'asc' | 'desc'
                });
              }}
              className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="updated_at-desc">Last Updated (Newest)</option>
              <option value="updated_at-asc">Last Updated (Oldest)</option>
              <option value="created_at-desc">Created (Newest)</option>
              <option value="created_at-asc">Created (Oldest)</option>
              <option value="project_name-asc">Project Name (A-Z)</option>
              <option value="project_name-desc">Project Name (Z-A)</option>
              <option value="client_name-asc">Client Name (A-Z)</option>
              <option value="client_name-desc">Client Name (Z-A)</option>
              <option value="total_amount-desc">Amount (High to Low)</option>
              <option value="total_amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
} 