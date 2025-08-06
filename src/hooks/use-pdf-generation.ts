import { useState, useCallback } from 'react';
import { Proposal, ProposalLineItem } from '@/types/proposal';
import { PDFGenerator } from '@/lib/pdf-generator';

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

interface PDFGenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  pdfUrl: string | null;
  blob: Blob | null;
}

interface UsePDFGenerationReturn {
  state: PDFGenerationState;
  generatePDF: (proposal: ProposalWithLineItems) => Promise<void>;
  downloadPDF: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function usePDFGeneration(): UsePDFGenerationReturn {
  const [state, setState] = useState<PDFGenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    pdfUrl: null,
    blob: null,
  });

  const generatePDF = useCallback(async (proposal: ProposalWithLineItems) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null,
      pdfUrl: null,
      blob: null,
    }));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      // Generate PDF
      const blob = await PDFGenerator.generateProposalPDFAsBlob(proposal);
      
      clearInterval(progressInterval);
      
      // Create URL for preview
      const url = URL.createObjectURL(blob);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        pdfUrl: url,
        blob,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF',
      }));
    }
  }, []);

  const downloadPDF = useCallback(async () => {
    if (!state.blob) {
      setState(prev => ({
        ...prev,
        error: 'No PDF available for download',
      }));
      return;
    }

    try {
      // Create download link
      const downloadUrl = URL.createObjectURL(state.blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `proposal-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to download PDF',
      }));
    }
  }, [state.blob]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    // Clean up URL if it exists
    if (state.pdfUrl) {
      URL.revokeObjectURL(state.pdfUrl);
    }
    
    setState({
      isGenerating: false,
      progress: 0,
      error: null,
      pdfUrl: null,
      blob: null,
    });
  }, [state.pdfUrl]);

  return {
    state,
    generatePDF,
    downloadPDF,
    clearError,
    reset,
  };
}

// Hook for batch PDF generation
export function useBatchPDFGeneration() {
  const [batchState, setBatchState] = useState<{
    isGenerating: boolean;
    completed: number;
    total: number;
    errors: string[];
  }>({
    isGenerating: false,
    completed: 0,
    total: 0,
    errors: [],
  });

  const generateBatchPDFs = useCallback(async (proposals: ProposalWithLineItems[]) => {
    setBatchState({
      isGenerating: true,
      completed: 0,
      total: proposals.length,
      errors: [],
    });

    const results: { proposal: ProposalWithLineItems; blob: Blob | null; error: string | null }[] = [];

    for (let i = 0; i < proposals.length; i++) {
      try {
        const blob = await PDFGenerator.generateProposalPDFAsBlob(proposals[i]);
        results.push({ proposal: proposals[i], blob, error: null });
      } catch (error) {
        results.push({ 
          proposal: proposals[i], 
          blob: null, 
          error: error instanceof Error ? error.message : 'Failed to generate PDF' 
        });
      }

      setBatchState(prev => ({
        ...prev,
        completed: i + 1,
        errors: results.filter(r => r.error).map(r => r.error!),
      }));
    }

    setBatchState(prev => ({
      ...prev,
      isGenerating: false,
    }));

    return results;
  }, []);

  return {
    batchState,
    generateBatchPDFs,
  };
}

// Hook for PDF validation
export function usePDFValidation() {
  const validateProposalForPDF = useCallback((proposal: ProposalWithLineItems): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!proposal.client_name?.trim()) {
      errors.push('Client name is required');
    }

    if (!proposal.client_email?.trim()) {
      errors.push('Client email is required');
    }

    if (!proposal.project_description?.trim()) {
      errors.push('Project description is required');
    }

    if (!proposal.line_items || proposal.line_items.length === 0) {
      errors.push('At least one line item is required');
    }

    // Warning checks
    if (!proposal.client_phone?.trim()) {
      warnings.push('Client phone number is missing');
    }

    if (!proposal.client_address?.trim()) {
      warnings.push('Client address is missing');
    }

    if (!proposal.project_address?.trim()) {
      warnings.push('Project address is missing');
    }

    // Line items validation
    proposal.line_items?.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Line item ${index + 1}: Description is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unit_price <= 0) {
        errors.push(`Line item ${index + 1}: Unit price must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, []);

  return {
    validateProposalForPDF,
  };
} 