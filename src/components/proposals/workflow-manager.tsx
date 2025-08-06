'use client';

import { useState } from 'react';
import { Proposal, ProposalLineItem, ProposalStatus } from '@/types/proposal';
import { ProposalWorkflow } from '@/lib/proposal-workflow';
import { useWorkflowState } from '@/hooks/use-workflow-state';
import StatusBadge from './status-badge';
import ReviewChecklist from './review-checklist';
import WorkflowActions from './workflow-actions';

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

interface WorkflowManagerProps {
  proposal: ProposalWithLineItems;
  onStatusChange?: (newStatus: ProposalStatus) => void;
  className?: string;
}

export default function WorkflowManager({ 
  proposal, 
  onStatusChange,
  className = ''
}: WorkflowManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'actions' | 'history'>('overview');
  
  const {
    state,
    nextPossibleStates,
    transitionTo,
    resetValidation,
    getProgressPercentage,
    isComplete
  } = useWorkflowState(proposal);

  const workflowHistory = ProposalWorkflow.getWorkflowHistory(proposal);
  const progressPercentage = getProgressPercentage();

  const handleTransition = async (to: ProposalStatus, notes?: string): Promise<boolean> => {
    const success = await transitionTo(to, notes);
    if (success && onStatusChange) {
      onStatusChange(to);
    }
    return success;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'checklist', label: 'Review Checklist', icon: '✅' },
    { id: 'actions', label: 'Actions', icon: '⚡' },
    { id: 'history', label: 'History', icon: '📜' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proposal Workflow</h2>
            <p className="text-sm text-gray-600">Manage proposal status and progression</p>
          </div>
          <StatusBadge status={state.currentStatus} size="lg" />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status Steps */}
        <div className="flex items-center justify-between">
          {[
            { status: ProposalStatus.DRAFT, label: 'Draft', icon: '📝' },
            { status: ProposalStatus.REVIEW, label: 'In Review', icon: '👀' },
            { status: ProposalStatus.READY_TO_SEND, label: 'Ready', icon: '✅' },
            { status: ProposalStatus.SENT, label: 'Sent', icon: '📤' }
                     ].map((step) => {
            const isActive = step.status === state.currentStatus;
            const isCompleted = workflowHistory.some(h => h.status === step.status);
            const isNext = nextPossibleStates.includes(step.status);

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    isNext ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-gray-400'}
                `}>
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  isActive ? 'text-blue-600 font-medium' : 
                  isCompleted ? 'text-green-600' : 
                  isNext ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
                             onClick={() => setActiveTab(tab.id as 'overview' | 'checklist' | 'actions' | 'history')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
              <div className="flex items-center gap-3">
                <StatusBadge status={state.currentStatus} />
                <span className="text-sm text-gray-600">
                  {isComplete() ? 'Proposal workflow complete' : 'Proposal in progress'}
                </span>
              </div>
            </div>

            {/* Next Actions */}
            {nextPossibleStates.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">Available Actions</h3>
                <div className="space-y-2">
                  {nextPossibleStates.map(status => (
                    <div key={status} className="flex items-center gap-2">
                      <span className="text-blue-600">→</span>
                      <span className="text-sm text-blue-800">
                        Move to {status.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Status */}
            {state.validationResult && (
              <div className={`rounded-lg p-4 ${
                state.validationResult.isValid 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  state.validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  Validation Status
                </h3>
                <div className="text-sm">
                  {state.validationResult.isValid ? (
                    <p className="text-green-700">All requirements met</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      {state.validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('checklist')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Review Checklist
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Workflow Actions
              </button>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <ReviewChecklist 
            proposal={proposal}
                       onValidationChange={() => {
             // Handle validation changes if needed
           }}
          />
        )}

        {activeTab === 'actions' && (
          <WorkflowActions
            proposal={proposal}
            currentStatus={state.currentStatus}
            onTransition={handleTransition}
            isTransitioning={state.isTransitioning}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 mb-4">Workflow History</h3>
            {workflowHistory.length > 0 ? (
              <div className="space-y-3">
                {workflowHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <StatusBadge status={entry.status} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{entry.notes}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No workflow history available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="p-6 border-t border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <span className="text-red-500">⚠️</span>
            <div>
              <h4 className="font-medium text-red-800">Workflow Error</h4>
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
            <button
              onClick={resetValidation}
              className="ml-auto text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 