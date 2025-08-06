import { useState, useCallback } from 'react';
import { Proposal, ProposalStatus } from '@/types/proposal';
import { ProposalWorkflow, WorkflowValidationResult } from '@/lib/proposal-workflow';

interface WorkflowState {
  currentStatus: ProposalStatus;
  isTransitioning: boolean;
  validationResult: WorkflowValidationResult | null;
  error: string | null;
  progress: number;
}

interface UseWorkflowStateReturn {
  state: WorkflowState;
  nextPossibleStates: ProposalStatus[];
  canTransition: (to: ProposalStatus) => boolean;
  validateTransition: (to: ProposalStatus) => WorkflowValidationResult;
  transitionTo: (to: ProposalStatus, notes?: string) => Promise<boolean>;
  resetValidation: () => void;
  getProgressPercentage: () => number;
  isComplete: () => boolean;
}

export function useWorkflowState(proposal: Proposal): UseWorkflowStateReturn {
  const [state, setState] = useState<WorkflowState>({
    currentStatus: proposal.status,
    isTransitioning: false,
    validationResult: null,
    error: null,
    progress: ProposalWorkflow.getProgressPercentage(proposal),
  });

  const nextPossibleStates = ProposalWorkflow.getNextPossibleStates(proposal);

  const canTransition = useCallback((to: ProposalStatus): boolean => {
    return ProposalWorkflow.canTransition(state.currentStatus, to);
  }, [state.currentStatus]);

  const validateTransition = useCallback((to: ProposalStatus): WorkflowValidationResult => {
    const validation = ProposalWorkflow.validateTransition(state.currentStatus, to, proposal);
    setState(prev => ({ ...prev, validationResult: validation }));
    return validation;
  }, [state.currentStatus, proposal]);

  const transitionTo = useCallback(async (to: ProposalStatus, _notes?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isTransitioning: true, error: null }));

    try {
      // Validate the transition
      const validation = validateTransition(to);
      
      if (!validation.isValid) {
        setState(prev => ({ 
          ...prev, 
          isTransitioning: false, 
          error: validation.errors.join(', '),
          validationResult: validation
        }));
        return false;
      }

      // Simulate API call to update proposal status
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setState(prev => ({
        ...prev,
        currentStatus: to,
        isTransitioning: false,
        progress: ProposalWorkflow.getProgressPercentage({ ...proposal, status: to }),
        validationResult: null,
        error: null,
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        error: error instanceof Error ? error.message : 'Failed to transition proposal status',
      }));
      return false;
    }
  }, [state.currentStatus, proposal, validateTransition]);

  const resetValidation = useCallback(() => {
    setState(prev => ({ ...prev, validationResult: null, error: null }));
  }, []);

  const getProgressPercentage = useCallback((): number => {
    return state.progress;
  }, [state.progress]);

  const isComplete = useCallback((): boolean => {
    return ProposalWorkflow.isComplete({ ...proposal, status: state.currentStatus });
  }, [proposal, state.currentStatus]);

  return {
    state,
    nextPossibleStates,
    canTransition,
    validateTransition,
    transitionTo,
    resetValidation,
    getProgressPercentage,
    isComplete,
  };
}

// Hook for batch workflow operations
export function useBatchWorkflowState() {
  const [batchState, setBatchState] = useState<{
    isProcessing: boolean;
    completed: number;
    total: number;
    errors: string[];
  }>({
    isProcessing: false,
    completed: 0,
    total: 0,
    errors: [],
  });

  const processBatchTransition = useCallback(async (
    proposals: Proposal[],
    targetStatus: ProposalStatus,
    _notes?: string
  ) => {
    setBatchState({
      isProcessing: true,
      completed: 0,
      total: proposals.length,
      errors: [],
    });

    const results: { proposal: Proposal; success: boolean; error?: string }[] = [];

    for (let i = 0; i < proposals.length; i++) {
      const proposal = proposals[i];
      
      try {
        const validation = ProposalWorkflow.validateTransition(proposal.status, targetStatus, proposal);
        
        if (!validation.isValid) {
          results.push({
            proposal,
            success: false,
            error: validation.errors.join(', '),
          });
        } else {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          results.push({ proposal, success: true });
        }
      } catch (error) {
        results.push({
          proposal,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      setBatchState(prev => ({
        ...prev,
        completed: i + 1,
        errors: results.filter(r => !r.success).map(r => r.error!),
      }));
    }

    setBatchState(prev => ({ ...prev, isProcessing: false }));
    return results;
  }, []);

  return {
    batchState,
    processBatchTransition,
  };
} 