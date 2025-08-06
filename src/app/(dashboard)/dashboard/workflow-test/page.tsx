'use client';

import { useState } from 'react';
import { ProjectType, ProposalStatus, LineItemCategory } from '@/types/proposal';
import WorkflowManager from '@/components/proposals/workflow-manager';

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
  
  // Line items
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
      category: LineItemCategory.LABOR,
      description: 'Installation Labor - Professional installation of all fixtures and materials',
      quantity: 40,
      unit: 'hour',
      unit_price: 75,
      total: 3000,
      is_manual_override: false,
      material_id: undefined,
      order_index: 3,
      created_at: '2024-12-06T10:00:00Z',
      updated_at: '2024-12-06T10:00:00Z',
    },
  ],
};

export default function WorkflowTestPage() {
  const [proposal, setProposal] = useState(sampleProposal);
  const [statusHistory, setStatusHistory] = useState<string[]>([]);

  const handleStatusChange = (newStatus: ProposalStatus) => {
    setProposal(prev => ({
      ...prev,
      status: newStatus,
      updated_at: new Date().toISOString()
    }));
    
    setStatusHistory(prev => [...prev, `Status changed to ${newStatus} at ${new Date().toLocaleString()}`]);
  };

  const resetProposal = () => {
    setProposal(sampleProposal);
    setStatusHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Workflow Management Test</h1>
          <p className="text-gray-600 mb-6">
            Test the proposal workflow management system with state transitions, validation, and review processes.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={resetProposal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Reset to Draft
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Current Status:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {proposal.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Workflow Manager */}
          <div className="lg:col-span-2">
            <WorkflowManager
              proposal={proposal}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Proposal Info */}
            <div className="bg-white rounded-lg shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="ml-2 text-gray-900">{proposal.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Client:</span>
                  <span className="ml-2 text-gray-900">{proposal.client_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Project:</span>
                  <span className="ml-2 text-gray-900">{proposal.project_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="ml-2 text-gray-900">${proposal.total_amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
              {statusHistory.length > 0 ? (
                <div className="space-y-2">
                  {statusHistory.map((entry, index) => (
                    <div key={index} className="text-sm text-gray-600 border-l-2 border-blue-200 pl-3">
                      {entry}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No status changes yet</p>
              )}
            </div>

            {/* Test Instructions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Test Instructions</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>1. <strong>Draft → In Review:</strong> Requires client name, email, project name, and description</p>
                <p>2. <strong>In Review → Ready to Send:</strong> Requires review completion and valid pricing</p>
                <p>3. <strong>Ready to Send → Sent:</strong> Final validation before marking as sent</p>
                <p>4. <strong>Review Checklist:</strong> Comprehensive validation of all proposal sections</p>
                <p>5. <strong>Workflow Actions:</strong> State transition buttons with confirmation dialogs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 