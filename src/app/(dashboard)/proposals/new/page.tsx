'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ProjectType, ProposalStatus, CreateProposalInput } from '@/types/proposal';
import ProjectTypeSelector from '@/components/proposals/project-type-selector';
import ClientInfoForm from '@/components/proposals/client-info-form';
import ProjectDetailsForm from '@/components/proposals/project-details-form';
import Button from '@/components/ui/Button';

interface FormData {
  project_type: ProjectType | '';
  client_name: string;
  client_contact_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  project_name: string;
  project_address: string;
  project_description: string;
  square_footage: string;
  timeline: string;
  special_requirements: string;
}

const initialFormData: FormData = {
  project_type: '',
  client_name: '',
  client_contact_name: '',
  client_email: '',
  client_phone: '',
  client_address: '',
  project_name: '',
  project_address: '',
  project_description: '',
  square_footage: '',
  timeline: '',
  special_requirements: ''
};

const steps = [
  { id: 1, name: 'Project Type', description: 'Select the type of glazing project' },
  { id: 2, name: 'Client Information', description: 'Enter client and company details' },
  { id: 3, name: 'Project Details', description: 'Define project specifications' }
];

export default function NewProposalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const supabase = createClient();

  const handleAutoSave = useCallback(async () => {
    if (!formData.project_type || !formData.client_name || !formData.project_name) {
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const proposalData: CreateProposalInput = {
        project_type: formData.project_type as ProjectType,
        client_name: formData.client_name,
        client_contact_name: formData.client_contact_name || undefined,
        client_email: formData.client_email || undefined,
        client_phone: formData.client_phone || undefined,
        client_address: formData.client_address || undefined,
        project_name: formData.project_name,
        project_address: formData.project_address || undefined,
        project_description: formData.project_description || undefined,
        tax_rate: 0
      };

      const { error } = await supabase
        .from('proposals')
        .insert({
          ...proposalData,
          contractor_id: user.id,
          status: ProposalStatus.DRAFT,
          subtotal: 0,
          tax_amount: 0,
          total_amount: 0
        });

      if (error) {
        throw error;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, [formData, supabase]);

  // Auto-save functionality
  useEffect(() => {
    if (formData.project_type && formData.client_name && formData.project_name) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData, handleAutoSave]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.project_type) {
          newErrors.project_type = 'Please select a project type';
        }
        break;
      case 2:
        if (!formData.client_name.trim()) {
          newErrors.client_name = 'Client name is required';
        }
        if (!formData.project_name.trim()) {
          newErrors.project_name = 'Project name is required';
        }
        if (formData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
          newErrors.client_email = 'Please enter a valid email address';
        }
        break;
      case 3:
        if (formData.square_footage && isNaN(Number(formData.square_footage))) {
          newErrors.square_footage = 'Please enter a valid number';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormDataChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const proposalData: CreateProposalInput = {
        project_type: formData.project_type as ProjectType,
        client_name: formData.client_name,
        client_contact_name: formData.client_contact_name || undefined,
        client_email: formData.client_email || undefined,
        client_phone: formData.client_phone || undefined,
        client_address: formData.client_address || undefined,
        project_name: formData.project_name,
        project_address: formData.project_address || undefined,
        project_description: formData.project_description || undefined,
        tax_rate: 0
      };

      const { data, error } = await supabase
        .from('proposals')
        .insert({
          ...proposalData,
          contractor_id: user.id,
          status: ProposalStatus.DRAFT,
          subtotal: 0,
          tax_amount: 0,
          total_amount: 0
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Redirect to the new proposal
      router.push(`/proposals/${data.id}/edit`);
    } catch (error) {
      console.error('Error creating proposal:', error);
      setErrors({ project_name: 'Failed to create proposal. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Proposal</h1>
              <p className="mt-2 text-gray-600">
                Set up a new construction proposal with project details and client information
              </p>
            </div>
            
            {/* Save Status Indicator */}
            <div className="flex items-center space-x-2">
              {saveStatus === 'saving' && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Saving...
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center text-sm text-green-600">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center text-sm text-red-600">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Save failed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${stepIdx < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  </div>
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id < currentStep ? 'bg-primary-600' : 
                    step.id === currentStep ? 'bg-primary-600' : 'bg-white border-2 border-gray-300'
                  }`}>
                    {step.id < currentStep ? (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className={`text-sm font-medium ${
                        step.id === currentStep ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                    <span className={`text-xs font-medium ${
                      step.id === currentStep ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === 1 && (
            <ProjectTypeSelector
              selectedType={formData.project_type}
              onSelect={(type) => handleFormDataChange('project_type', type)}
              error={errors.project_type}
            />
          )}

          {currentStep === 2 && (
            <ClientInfoForm
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <ProjectDetailsForm
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/proposals')}
              >
                Cancel
              </Button>

              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {loading ? 'Creating...' : 'Create Proposal'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 