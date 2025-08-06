'use client';

import { useState, useEffect } from 'react';
import { Proposal, ProposalLineItem } from '@/types/proposal';
import { PDFGenerator } from '@/lib/pdf-generator';
import Button from '@/components/ui/Button';

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

interface PDFPreviewProps {
  proposal: ProposalWithLineItems;
  onDownload?: (blob: Blob) => void;
  onClose?: () => void;
}

export default function PDFPreview({ proposal, onDownload, onClose }: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePDF();
  }, [proposal]);

  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const blob = await PDFGenerator.generateProposalPDFAsBlob(proposal);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF preview');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `proposal-${proposal.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      onDownload?.(blob);
    } catch (err) {
      setError('Failed to download PDF');
      console.error('Download error:', err);
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    onClose?.();
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">PDF Preview</h2>
            <p className="text-sm text-gray-600">Review your proposal before downloading</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleDownload}
              disabled={isGenerating || !pdfUrl}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {isGenerating && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating PDF preview...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium mb-2">PDF Generation Failed</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  onClick={generatePDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {pdfUrl && !isGenerating && !error && (
            <div className="h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border border-gray-200 rounded"
                title="PDF Preview"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">Proposal #{proposal.id}</span>
              <span className="mx-2">•</span>
              <span>{proposal.client_name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Generated: {new Date().toLocaleString()}</span>
              <span>•</span>
              <span>Created: {new Date(proposal.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 