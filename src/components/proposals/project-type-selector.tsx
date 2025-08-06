'use client';

import { ProjectType } from '@/types/proposal';

interface ProjectTypeSelectorProps {
  selectedType: ProjectType | '';
  onSelect: (type: ProjectType) => void;
  error?: string;
}

const projectTypeData = [
  {
    type: ProjectType.STOREFRONT_INSTALLATION,
    title: 'Storefront Installation',
    description: 'Commercial storefront systems with aluminum framing and glass panels',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    features: ['Aluminum framing', 'Tempered glass', 'Commercial grade', 'Weather resistant']
  },
  {
    type: ProjectType.CURTAIN_WALL,
    title: 'Curtain Wall',
    description: 'Exterior building envelope systems with structural glazing',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    features: ['Structural glazing', 'High-rise systems', 'Thermal performance', 'Wind load rated']
  },
  {
    type: ProjectType.GLASS_DOORS,
    title: 'Glass Doors',
    description: 'Interior and exterior glass door systems with hardware',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    features: ['Frameless systems', 'Sliding doors', 'Pivot doors', 'Hardware included']
  },
  {
    type: ProjectType.GLASS_RAILINGS,
    title: 'Glass Railings',
    description: 'Safety railings with tempered glass panels and metal framing',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    features: ['Tempered safety glass', 'Metal framing', 'Code compliant', 'Outdoor/indoor use']
  },
  {
    type: ProjectType.SHOWERS,
    title: 'Showers',
    description: 'Custom glass shower enclosures and doors',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    features: ['Custom sizing', 'Frameless design', 'Hardware options', 'Easy cleaning']
  },
  {
    type: ProjectType.GLASS_CANOPIES,
    title: 'Glass Canopies',
    description: 'Overhead glass structures for weather protection',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    features: ['Weather protection', 'Structural support', 'UV resistant', 'Custom design']
  },
  {
    type: ProjectType.CUSTOM_INSTALLATION,
    title: 'Custom Installation',
    description: 'Specialized glass installations and custom projects',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    features: ['Custom design', 'Specialized glass', 'Unique applications', 'Consultation required']
  }
];

export default function ProjectTypeSelector({
  selectedType,
  onSelect,
  error
}: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select Project Type
        </h2>
        <p className="text-gray-600">
          Choose the type of glazing project you&apos;re working on. This will help us customize the proposal for your specific needs.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTypeData.map((projectType) => (
          <div
            key={projectType.type}
            onClick={() => onSelect(projectType.type)}
            className={`
              relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${selectedType === projectType.type
                ? 'border-primary-600 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            {/* Selection indicator */}
            {selectedType === projectType.type && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}

            {/* Icon */}
            <div className={`mb-4 ${selectedType === projectType.type ? 'text-primary-600' : 'text-gray-400'}`}>
              {projectType.icon}
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedType === projectType.type ? 'text-primary-900' : 'text-gray-900'
            }`}>
              {projectType.title}
            </h3>

            {/* Description */}
            <p className={`text-sm mb-4 ${
              selectedType === projectType.type ? 'text-primary-700' : 'text-gray-600'
            }`}>
              {projectType.description}
            </p>

            {/* Features */}
            <div className="space-y-1">
              {projectType.features.map((feature, index) => (
                <div key={index} className="flex items-center text-xs">
                  <svg className={`w-3 h-3 mr-2 flex-shrink-0 ${
                    selectedType === projectType.type ? 'text-primary-500' : 'text-gray-400'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={selectedType === projectType.type ? 'text-primary-700' : 'text-gray-500'}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Need help choosing?</h3>
                           <p className="mt-1 text-sm text-blue-700">
                 Each project type has specific requirements and considerations. If you&apos;re unsure, 
                 select &quot;Custom Installation&quot; and we can work with you to determine the best approach.
               </p>
          </div>
        </div>
      </div>
    </div>
  );
} 