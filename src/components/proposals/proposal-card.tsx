'use client';

import { useState } from 'react';
import { ProposalListItem, ProposalStatus, PROJECT_TYPE_LABELS, PROPOSAL_STATUS_LABELS } from '@/types/proposal';
import Button from '@/components/ui/Button';

interface ProposalCardProps {
  proposal: ProposalListItem;
  onStatusChange: (proposalId: string, newStatus: ProposalStatus) => void;
  onDelete: (proposalId: string) => void;
  onDuplicate: (proposalId: string) => void;
}

export default function ProposalCard({
  proposal,
  onStatusChange,
  onDelete,
  onDuplicate
}: ProposalCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_send':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: ProposalStatus) => {
    setUpdatingStatus(true);
    try {
      await onStatusChange(proposal.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getNextStatus = (currentStatus: ProposalStatus): ProposalStatus | null => {
    switch (currentStatus) {
      case ProposalStatus.DRAFT:
        return ProposalStatus.REVIEW;
      case ProposalStatus.REVIEW:
        return ProposalStatus.READY_TO_SEND;
      case ProposalStatus.READY_TO_SEND:
        return ProposalStatus.SENT;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(proposal.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {proposal.project_name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                {PROPOSAL_STATUS_LABELS[proposal.status]}
              </span>
            </div>
            
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Client:</span> {proposal.client_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span> {PROJECT_TYPE_LABELS[proposal.project_type]}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total:</span> {formatCurrency(proposal.total_amount)}
              </p>
            </div>

            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
              <span>Created: {formatDate(proposal.created_at)}</span>
              <span>Updated: {formatDate(proposal.updated_at)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {/* Quick Actions */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="text-gray-600 hover:text-gray-900"
              >
                Actions
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowActions(false);
                        window.location.href = `/proposals/${proposal.id}/edit`;
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Proposal
                    </button>
                    
                    {nextStatus && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          handleStatusChange(nextStatus);
                        }}
                        disabled={updatingStatus}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {updatingStatus ? 'Updating...' : `Move to ${PROPOSAL_STATUS_LABELS[nextStatus]}`}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowActions(false);
                        onDuplicate(proposal.id);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Duplicate
                    </button>

                    <button
                      onClick={() => {
                        setShowActions(false);
                        onDelete(proposal.id);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = `/proposals/${proposal.id}`}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 