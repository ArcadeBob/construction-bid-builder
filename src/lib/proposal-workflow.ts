import { Proposal, ProposalStatus } from '@/types/proposal';

export interface WorkflowState {
  status: ProposalStatus;
  timestamp: string;
  user_id?: string;
  notes?: string;
}

export interface WorkflowTransition {
  from: ProposalStatus;
  to: ProposalStatus;
  validation: (proposal: Proposal) => { isValid: boolean; errors: string[] };
  requiresApproval?: boolean;
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ProposalWorkflow {
  private static readonly transitions: WorkflowTransition[] = [
    {
      from: ProposalStatus.DRAFT,
      to: ProposalStatus.REVIEW,
      validation: (proposal: Proposal) => {
        const errors: string[] = [];
        
        if (!proposal.client_name?.trim()) {
          errors.push('Client name is required');
        }
        if (!proposal.client_email?.trim()) {
          errors.push('Client email is required');
        }
        if (!proposal.project_name?.trim()) {
          errors.push('Project name is required');
        }
        if (!proposal.project_description?.trim()) {
          errors.push('Project description is required');
        }
        
        return { isValid: errors.length === 0, errors };
      }
    },
    {
      from: ProposalStatus.REVIEW,
      to: ProposalStatus.READY_TO_SEND,
      validation: (proposal: Proposal) => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check if proposal has been reviewed
        if (!proposal.reviewed_at) {
          errors.push('Proposal must be reviewed before sending');
        }
        
        // Check for required client information
        if (!proposal.client_phone?.trim()) {
          warnings.push('Client phone number is missing');
        }
        if (!proposal.client_address?.trim()) {
          warnings.push('Client address is missing');
        }
        
        // Check pricing
        if (proposal.total_amount <= 0) {
          errors.push('Total amount must be greater than 0');
        }
        
        return { isValid: errors.length === 0, errors };
      },
      requiresApproval: true
    },
    {
      from: ProposalStatus.READY_TO_SEND,
      to: ProposalStatus.SENT,
      validation: (proposal: Proposal) => {
        const errors: string[] = [];
        
        // Final validation before sending
        if (!proposal.client_email?.trim()) {
          errors.push('Client email is required for sending');
        }
        
        return { isValid: errors.length === 0, errors };
      }
    }
  ];

  static getValidTransitions(currentStatus: ProposalStatus): ProposalStatus[] {
    return this.transitions
      .filter(transition => transition.from === currentStatus)
      .map(transition => transition.to);
  }

  static canTransition(from: ProposalStatus, to: ProposalStatus): boolean {
    return this.transitions.some(
      transition => transition.from === from && transition.to === to
    );
  }

  static validateTransition(
    from: ProposalStatus,
    to: ProposalStatus,
    proposal: Proposal
  ): WorkflowValidationResult {
    const transition = this.transitions.find(
      t => t.from === from && t.to === to
    );

    if (!transition) {
      return {
        isValid: false,
        errors: [`Invalid transition from ${from} to ${to}`],
        warnings: []
      };
    }

    const validation = transition.validation(proposal);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: []
    };
  }

  static getTransitionRequirements(from: ProposalStatus, to: ProposalStatus): {
    requiresApproval: boolean;
    validationRules: string[];
  } {
    const transition = this.transitions.find(
      t => t.from === from && t.to === to
    );

    if (!transition) {
      return { requiresApproval: false, validationRules: [] };
    }

    const validationRules = this.getValidationRules(transition.validation);
    
    return {
      requiresApproval: transition.requiresApproval || false,
      validationRules
    };
  }

  private static getValidationRules(validation: (proposal: Proposal) => { isValid: boolean; errors: string[] }): string[] {
    // This is a simplified version - in a real implementation, you might want to
    // extract validation rules from the validation function or define them separately
    return [
      'All required fields must be completed',
      'Client information must be accurate',
      'Project details must be comprehensive',
      'Pricing must be calculated correctly'
    ];
  }

  static getWorkflowHistory(proposal: Proposal): WorkflowState[] {
    const history: WorkflowState[] = [];
    
    // Add created state
    if (proposal.created_at) {
      history.push({
        status: ProposalStatus.DRAFT,
        timestamp: proposal.created_at,
        notes: 'Proposal created'
      });
    }

    // Add reviewed state
    if (proposal.reviewed_at) {
      history.push({
        status: ProposalStatus.REVIEW,
        timestamp: proposal.reviewed_at,
        notes: proposal.review_notes || 'Proposal reviewed'
      });
    }

    // Add sent state
    if (proposal.sent_at) {
      history.push({
        status: ProposalStatus.SENT,
        timestamp: proposal.sent_at,
        notes: 'Proposal sent to client'
      });
    }

    return history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static getCurrentState(proposal: Proposal): ProposalStatus {
    return proposal.status;
  }

  static getNextPossibleStates(proposal: Proposal): ProposalStatus[] {
    return this.getValidTransitions(proposal.status);
  }

  static isComplete(proposal: Proposal): boolean {
    return proposal.status === ProposalStatus.SENT;
  }

  static getProgressPercentage(proposal: Proposal): number {
    const states = [ProposalStatus.DRAFT, ProposalStatus.REVIEW, ProposalStatus.READY_TO_SEND, ProposalStatus.SENT];
    const currentIndex = states.indexOf(proposal.status);
    return Math.max(0, Math.min(100, (currentIndex / (states.length - 1)) * 100));
  }
} 