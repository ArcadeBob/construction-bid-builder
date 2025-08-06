'use client';

interface FormData {
  square_footage: string;
  timeline: string;
  special_requirements: string;
}

interface ProjectDetailsFormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

const timelineOptions = [
  { value: 'immediate', label: 'Immediate (1-2 weeks)' },
  { value: 'urgent', label: 'Urgent (1 month)' },
  { value: 'standard', label: 'Standard (2-3 months)' },
  { value: 'flexible', label: 'Flexible (3-6 months)' },
  { value: 'long_term', label: 'Long-term (6+ months)' },
  { value: 'custom', label: 'Custom timeline' }
];

export default function ProjectDetailsForm({
  formData,
  onChange,
  errors
}: ProjectDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Project Specifications
        </h2>
        <p className="text-gray-600">
          Define the technical specifications and requirements for your glazing project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Project Specifications
          </h3>

          {/* Square Footage */}
          <div>
            <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Square Footage
            </label>
            <div className="relative">
              <input
                type="number"
                id="square_footage"
                value={formData.square_footage}
                onChange={(e) => onChange('square_footage', e.target.value)}
                min="0"
                step="0.01"
                className={`
                  w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${errors.square_footage ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="Enter square footage"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">sq ft</span>
              </div>
            </div>
            {errors.square_footage && (
              <p className="mt-1 text-sm text-red-600">{errors.square_footage}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter the total square footage of glass to be installed
            </p>
          </div>

          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Timeline
            </label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => onChange('timeline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select timeline</option>
              {timelineOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose the preferred project completion timeline
            </p>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Special Requirements
          </h3>

          {/* Special Requirements */}
          <div>
            <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements & Considerations
            </label>
            <textarea
              id="special_requirements"
              value={formData.special_requirements}
              onChange={(e) => onChange('special_requirements', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe any special requirements, site conditions, access limitations, weather considerations, or other important factors that may affect the project..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Include any factors that may affect installation, materials, or timeline
            </p>
          </div>
        </div>
      </div>

      {/* Project Type Specific Considerations */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Considerations</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Site access and parking for delivery vehicles</li>
                <li>Weather conditions and seasonal considerations</li>
                <li>Existing building conditions and structural requirements</li>
                <li>Permit requirements and building code compliance</li>
                <li>Utility access and power requirements for installation</li>
                <li>Safety considerations and site-specific hazards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Specification Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Square footage helps estimate material quantities and costs</li>
                <li>Timeline affects material availability and scheduling</li>
                <li>Special requirements help identify potential challenges early</li>
                <li>Detailed specifications lead to more accurate proposals</li>
                <li>Site conditions can significantly impact installation methods</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 