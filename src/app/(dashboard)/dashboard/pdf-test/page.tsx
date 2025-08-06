'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { usePDFGeneration, usePDFValidation } from '@/hooks/use-pdf-generation';
import PDFPreview from '@/components/proposals/pdf-preview';
import { ProjectType, ProposalStatus, LineItemCategory } from '@/types/proposal';

// Sample proposal data for testing
const sampleProposal = {
  id: 'PROP-20241206-001',
  contractor_id: 'contractor-123',
  project_type: ProjectType.CUSTOM_INSTALLATION,
  status: ProposalStatus.DRAFT,
  
  // Client information
  client_name: 'John Smith',
  client_contact_name: 'John Smith',
  client_email: 'john.smith@example.com',
  client_phone: '555-123-4567',
  client_address: '123 Main Street, Anytown, ST 12345',
  
  // Project information
  project_name: 'Kitchen and Bathroom Renovation',
  project_address: '456 Oak Avenue, Anytown, ST 12345',
  project_description: 'Complete kitchen and bathroom renovation including new cabinets, countertops, fixtures, and flooring. Project includes demolition, electrical work, plumbing, and final finishing.',
  
  // Pricing totals
  subtotal: 25000,
  tax_rate: 8.5,
  tax_amount: 2125,
  total_amount: 27125,
  
  // Workflow tracking
  internal_notes: 'Sample proposal for testing',
  review_notes: '',
  
  // Timestamps
  created_at: '2024-12-06T10:00:00Z',
  updated_at: '2024-12-06T10:00:00Z',
  reviewed_at: undefined,
  sent_at: undefined,
  
  // Line items (this would normally come from a separate query)
  line_items: [
    {
      id: 'item-1',
      proposal_id: 'PROP-20241206-001',
      category: LineItemCategory.MATERIAL,
      description: 'Kitchen Cabinets - Custom maple cabinets with soft-close hinges',
      quantity: 1,
      unit: 'set',
      unit_price: 8500,
      total: 8500,
      is_manual_override: false,
      material_id: undefined,
      order_index: 1,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
    {
      id: 'item-2',
      proposal_id: 'PROP-20241206-001',
      category: LineItemCategory.MATERIAL,
      description: 'Granite Countertops - Premium granite countertops with 4-inch backsplash',
      quantity: 1,
      unit: 'set',
      unit_price: 3200,
      total: 3200,
      is_manual_override: false,
      material_id: undefined,
      order_index: 2,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
    {
      id: 'item-3',
      proposal_id: 'PROP-20241206-001',
      category: LineItemCategory.MATERIAL,
      description: 'Kitchen Sink & Faucet - Stainless steel farmhouse sink with pull-down faucet',
      quantity: 1,
      unit: 'set',
      unit_price: 450,
      total: 450,
      is_manual_override: false,
      material_id: undefined,
      order_index: 3,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
    {
      id: 'item-4',
      proposal_id: 'PROP-20241206-001',
      category: LineItemCategory.LABOR,
      description: 'Installation Labor - Professional installation of all fixtures and materials',
      quantity: 40,
      unit: 'hour',
      unit_price: 75,
      total: 3000,
      is_manual_override: false,
      material_id: undefined,
      order_index: 4,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
    {
      id: 'item-5',
      proposal_id: 'PROP-20241206-001',
      category: LineItemCategory.OVERHEAD,
      description: 'Project Management - Coordination, scheduling, and quality control',
      quantity: 1,
      unit: 'project',
      unit_price: 2500,
      total: 2500,
      is_manual_override: false,
      material_id: undefined,
      order_index: 5,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
  ],
};

export default function PDFTestPage() {
  const { state, generatePDF, downloadPDF, clearError, reset } = usePDFGeneration();
  const { validateProposalForPDF } = usePDFValidation();
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneratePDF = async () => {
    await generatePDF(sampleProposal);
  };

  const handlePreviewPDF = () => {
    setShowPreview(true);
  };

  const validation = validateProposalForPDF(sampleProposal);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">PDF Generation Test</h1>
          
          {/* Validation Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Validation Status</h2>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                    {validation.isValid ? 'Proposal is valid for PDF generation' : 'Proposal has validation errors'}
                  </span>
                </div>
              </div>
              
              {validation.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 mb-2">Errors:</h3>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Warnings:</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* PDF Generation Controls */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PDF Generation</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleGeneratePDF}
                disabled={state.isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {state.isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
              
              <Button
                onClick={handlePreviewPDF}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Preview PDF
              </Button>
              
              <Button
                onClick={downloadPDF}
                disabled={!state.blob}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Download PDF
              </Button>
              
              <Button
                onClick={reset}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Generation Status */}
          {state.isGenerating && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generation Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{state.progress}% complete</p>
            </div>
          )}

          {/* Error Display */}
          {state.error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-red-800">Generation Error</h3>
                    <p className="text-red-700 mt-1">{state.error}</p>
                  </div>
                  <Button
                    onClick={clearError}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Success Status */}
          {state.pdfUrl && !state.isGenerating && !state.error && (
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-medium text-green-800">PDF Generated Successfully</h3>
                    <p className="text-green-700 text-sm">The PDF is ready for download or preview.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Proposal Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Proposal Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
                  <p className="text-sm text-gray-600">Name: {sampleProposal.client_name}</p>
                  <p className="text-sm text-gray-600">Email: {sampleProposal.client_email}</p>
                  <p className="text-sm text-gray-600">Phone: {sampleProposal.client_phone}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project Information</h3>
                  <p className="text-sm text-gray-600">Type: {sampleProposal.project_type}</p>
                  <p className="text-sm text-gray-600">Name: {sampleProposal.project_name}</p>
                  <p className="text-sm text-gray-600">Status: {sampleProposal.status}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Line Items</h3>
                <p className="text-sm text-gray-600">{sampleProposal.line_items.length} items totaling ${sampleProposal.total_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <PDFPreview
          proposal={sampleProposal}
          onClose={() => setShowPreview(false)}
          onDownload={(blob) => {
            console.log('PDF downloaded:', blob);
            setShowPreview(false);
          }}
        />
      )}
    </div>
  );
} 