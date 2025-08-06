'use client';

import { useState } from 'react';
import { Proposal, ProposalStatus } from '@/types/proposal';
import { ProposalWorkflow, WorkflowValidationResult } from '@/lib/proposal-workflow';
import Button from '@/components/ui/Button';

interface WorkflowActionsProps {
  proposal: Proposal;
  currentStatus: ProposalStatus;
  onTransition: (to: ProposalStatus, notes?: string) => Promise<boolean>;
  isTransitioning?: boolean;
  className?: string;
}

interface ActionConfig {
  status: ProposalStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
  requiresConfirmation: boolean;
  confirmationMessage: string;
}

const actionConfigs: Record<ProposalStatus, ActionConfig> = {
  [ProposalStatus.DRAFT]: {
    status: ProposalStatus.DRAFT,
    label: 'Draft',
    description: 'Proposal is being created',
    icon: '📝',
    color: 'bg-gray-600 hover:bg-gray-700 text-white',
    requiresConfirmation: false,
    confirmationMessage: ''
  },
  [ProposalStatus.REVIEW]: {
    status: ProposalStatus.REVIEW,
    label: 'Send to Review',
    description: 'Submit proposal for review',
    icon: '👀',
    color: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to send this proposal for review? This will lock editing until review is complete.'
  },
  [ProposalStatus.READY_TO_SEND]: {
    status: ProposalStatus.READY_TO_SEND,
    label: 'Mark Ready to Send',
    description: 'Mark proposal as ready for client',
    icon: '✅',
    color: 'bg-green-600 hover:bg-green-700 text-white',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to mark this proposal as ready to send? This indicates the proposal is complete and ready for client review.'
  },
  [ProposalStatus.SENT]: {
    status: ProposalStatus.SENT,
    label: 'Mark as Sent',
    description: 'Mark proposal as sent to client',
    icon: '📤',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to mark this proposal as sent? This action cannot be undone.'
  }
};

export default function WorkflowActions({ 
  proposal, 
  currentStatus, 
  onTransition, 
  isTransitioning = false,
  className = ''
}: WorkflowActionsProps) {
  const [showConfirmation, setShowConfirmation] = useState<ProposalStatus | null>(null);
  const [notes, setNotes] = useState('');
  const [validationResult, setValidationResult] = useState<WorkflowValidationResult | null>(null);

  const nextPossibleStates = ProposalWorkflow.getNextPossibleStates(proposal);
  const availableActions = nextPossibleStates.map(status => actionConfigs[status]);

  const handleActionClick = (targetStatus: ProposalStatus) => {
    const config = actionConfigs[targetStatus];
    
    // Validate the transition
    const validation = ProposalWorkflow.validateTransition(currentStatus, targetStatus, proposal);
    setValidationResult(validation);

    if (!validation.isValid) {
      // Don't proceed if validation fails
      return;
    }

    if (config.requiresConfirmation) {
      setShowConfirmation(targetStatus);
    } else {
      executeTransition(targetStatus);
    }
  };

  const executeTransition = async (targetStatus: ProposalStatus) => {
    const success = await onTransition(targetStatus, notes.trim() || undefined);
    
    if (success) {
      setShowConfirmation(null);
      setNotes('');
      setValidationResult(null);
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(null);
    setNotes('');
    setValidationResult(null);
  };

  if (availableActions.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border ${className}`}>
        <div className="text-center text-gray-600">
          <p className="font-medium">No actions available</p>
          <p className="text-sm">This proposal has reached its final state.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Validation Errors */}
      {validationResult && !validationResult.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Cannot proceed:</h4>
          <ul className="list-disc list-inside space-y-1 text-red-700">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Available Actions */}
      <div className="space-y-3">
        {availableActions.map((action) => {
          const validation = ProposalWorkflow.validateTransition(currentStatus, action.status, proposal);
          const isDisabled = !validation.isValid || isTransitioning;

          return (
            <div key={action.status} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.label}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleActionClick(action.status)}
                  disabled={isDisabled}
                  className={action.color}
                >
                  {isTransitioning ? 'Processing...' : action.label}
                </Button>
              </div>

              {/* Requirements */}
              {validation.warnings.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Suggestions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-xs">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {actionConfigs[showConfirmation].confirmationMessage}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about this transition..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => executeTransition(showConfirmation)}
                  disabled={isTransitioning}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {isTransitioning ? 'Processing...' : 'Confirm'}
                </Button>
                <Button
                  onClick={cancelConfirmation}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Status Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
        <div className="flex items-center gap-3">
          <span className="text-lg">{actionConfigs[currentStatus]?.icon || '📄'}</span>
          <div>
            <p className="font-medium text-gray-900">{actionConfigs[currentStatus]?.label || currentStatus}</p>
            <p className="text-sm text-gray-600">
              {actionConfigs[currentStatus]?.description || 'Proposal status'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 