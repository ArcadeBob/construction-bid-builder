'use client';

import { useState } from 'react';
import { Proposal, ProposalLineItem } from '@/types/proposal';
import { WorkflowValidationResult } from '@/lib/proposal-workflow';

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

interface ReviewChecklistProps {
  proposal: ProposalWithLineItems;
  onValidationChange?: (result: WorkflowValidationResult) => void;
  className?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  category: 'client' | 'project' | 'pricing' | 'content';
  isRequired: boolean;
  validator: (proposal: ProposalWithLineItems) => { isValid: boolean; message?: string };
}

const checklistItems: ChecklistItem[] = [
  // Client Information
  {
    id: 'client-name',
    label: 'Client Name',
    category: 'client',
    isRequired: true,
    validator: (proposal) => ({
      isValid: !!proposal.client_name?.trim(),
      message: 'Client name is required'
    })
  },
  {
    id: 'client-email',
    label: 'Client Email',
    category: 'client',
    isRequired: true,
    validator: (proposal) => ({
      isValid: !!proposal.client_email?.trim() && proposal.client_email.includes('@'),
      message: 'Valid client email is required'
    })
  },
  {
    id: 'client-phone',
    label: 'Client Phone',
    category: 'client',
    isRequired: false,
    validator: (proposal) => ({
      isValid: !proposal.client_phone || proposal.client_phone.trim().length >= 10,
      message: 'Phone number should be at least 10 digits'
    })
  },
  {
    id: 'client-address',
    label: 'Client Address',
    category: 'client',
    isRequired: false,
    validator: (proposal) => ({
      isValid: !proposal.client_address || proposal.client_address.trim().length > 0,
      message: 'Address should not be empty if provided'
    })
  },

  // Project Information
  {
    id: 'project-name',
    label: 'Project Name',
    category: 'project',
    isRequired: true,
    validator: (proposal) => ({
      isValid: !!proposal.project_name?.trim(),
      message: 'Project name is required'
    })
  },
  {
    id: 'project-description',
    label: 'Project Description',
    category: 'project',
    isRequired: true,
    validator: (proposal) => ({
      isValid: !!proposal.project_description?.trim() && proposal.project_description.length >= 20,
      message: 'Project description should be at least 20 characters'
    })
  },
  {
    id: 'project-address',
    label: 'Project Address',
    category: 'project',
    isRequired: false,
    validator: (proposal) => ({
      isValid: !proposal.project_address || proposal.project_address.trim().length > 0,
      message: 'Project address should not be empty if provided'
    })
  },

  // Pricing Information
  {
    id: 'line-items',
    label: 'Line Items',
    category: 'pricing',
    isRequired: true,
    validator: (proposal) => ({
      isValid: proposal.line_items && proposal.line_items.length > 0,
      message: 'At least one line item is required'
    })
  },
  {
    id: 'pricing-totals',
    label: 'Pricing Totals',
    category: 'pricing',
    isRequired: true,
    validator: (proposal) => ({
      isValid: proposal.total_amount > 0,
      message: 'Total amount must be greater than 0'
    })
  },
  {
    id: 'tax-calculation',
    label: 'Tax Calculation',
    category: 'pricing',
    isRequired: false,
    validator: (proposal) => ({
      isValid: proposal.tax_amount >= 0,
      message: 'Tax amount should be non-negative'
    })
  },

  // Content Quality
  {
    id: 'professional-tone',
    label: 'Professional Tone',
    category: 'content',
    isRequired: false,
    validator: (_proposal) => ({
      isValid: true, // This would need more sophisticated validation
      message: 'Content should be professional and clear'
    })
  },
  {
    id: 'spelling-grammar',
    label: 'Spelling & Grammar',
    category: 'content',
    isRequired: false,
    validator: (_proposal) => ({
      isValid: true, // This would need more sophisticated validation
      message: 'Check for spelling and grammar errors'
    })
  }
];

export default function ReviewChecklist({ 
  proposal, 
  onValidationChange,
  className = ''
}: ReviewChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['client', 'project']));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const validateAll = (): WorkflowValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    checklistItems.forEach(item => {
      const validation = item.validator(proposal);
      if (!validation.isValid) {
        if (item.isRequired) {
          errors.push(validation.message || `${item.label} is invalid`);
        } else {
          warnings.push(validation.message || `${item.label} could be improved`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const validationResult = validateAll();

  // Notify parent component of validation changes
  if (onValidationChange) {
    onValidationChange(validationResult);
  }

  const getCategoryItems = (category: string) => {
    return checklistItems.filter(item => item.category === category);
  };

  const getCategoryStatus = (category: string) => {
    const items = getCategoryItems(category);
    const requiredItems = items.filter(item => item.isRequired);
    const validRequiredItems = requiredItems.filter(item => item.validator(proposal).isValid);
    
    if (validRequiredItems.length === requiredItems.length) {
      return 'complete';
    } else if (validRequiredItems.length > 0) {
      return 'partial';
    } else {
      return 'incomplete';
    }
  };

  const getStatusIcon = (status: 'complete' | 'partial' | 'incomplete') => {
    switch (status) {
      case 'complete':
        return '✅';
      case 'partial':
        return '⚠️';
      case 'incomplete':
        return '❌';
    }
  };

  const categories = [
    { id: 'client', label: 'Client Information', icon: '👤' },
    { id: 'project', label: 'Project Details', icon: '🏗️' },
    { id: 'pricing', label: 'Pricing & Line Items', icon: '💰' },
    { id: 'content', label: 'Content Quality', icon: '📝' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Review Checklist</h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            validationResult.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validationResult.isValid ? 'Ready to Send' : 'Needs Attention'}
          </span>
          <span className="text-sm text-gray-500">
            ({validationResult.errors.length} errors, {validationResult.warnings.length} warnings)
          </span>
        </div>
      </div>

      {/* Summary */}
      {validationResult.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Required Fixes:</h4>
          <ul className="list-disc list-inside space-y-1 text-red-700">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validationResult.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Suggestions:</h4>
          <ul className="list-disc list-inside space-y-1 text-yellow-700">
            {validationResult.warnings.map((warning, index) => (
              <li key={index} className="text-sm">{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {categories.map(category => {
          const items = getCategoryItems(category.id);
          const status = getCategoryStatus(category.id);
          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.label}</span>
                  <span className="text-sm">{getStatusIcon(status)}</span>
                </div>
                <span className="text-gray-500">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  {items.map(item => {
                    const validation = item.validator(proposal);
                    const isValid = validation.isValid;

                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <span className={`text-sm mt-0.5 ${
                          isValid ? 'text-green-500' : item.isRequired ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {isValid ? '✓' : item.isRequired ? '✗' : '⚠'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              isValid ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {item.label}
                            </span>
                            {item.isRequired && (
                              <span className="text-xs text-red-500 font-medium">Required</span>
                            )}
                          </div>
                          {!isValid && validation.message && (
                            <p className="text-xs text-gray-600 mt-1">{validation.message}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg border ${
        validationResult.isValid 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {validationResult.isValid ? '✅' : '❌'}
          </span>
          <div>
            <h4 className={`font-medium ${
              validationResult.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResult.isValid ? 'Proposal is ready to send' : 'Proposal needs attention'}
            </h4>
            <p className={`text-sm ${
              validationResult.isValid ? 'text-green-700' : 'text-red-700'
            }`}>
              {validationResult.isValid 
                ? 'All required fields are complete and the proposal is ready for review.'
                : `Please address ${validationResult.errors.length} required issue(s) before proceeding.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 