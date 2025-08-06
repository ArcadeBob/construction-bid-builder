'use client';

interface FormData {
  client_name: string;
  client_contact_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  project_name: string;
  project_address: string;
  project_description: string;
}

interface ClientInfoFormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

export default function ClientInfoForm({
  formData,
  onChange,
  errors
}: ClientInfoFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Client & Project Information
        </h2>
        <p className="text-gray-600">
          Enter the client&apos;s company information and project details. This information will be used in the proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Client Information
          </h3>

          {/* Company Name */}
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="client_name"
              value={formData.client_name}
              onChange={(e) => onChange('client_name', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.client_name ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter company name"
            />
            {errors.client_name && (
              <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
            )}
          </div>

          {/* Contact Name */}
          <div>
            <label htmlFor="client_contact_name" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="client_contact_name"
              value={formData.client_contact_name}
              onChange={(e) => onChange('client_contact_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter contact person's name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="client_email"
              value={formData.client_email}
              onChange={(e) => onChange('client_email', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.client_email ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter email address"
            />
            {errors.client_email && (
              <p className="mt-1 text-sm text-red-600">{errors.client_email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) => onChange('client_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Billing Address */}
          <div>
            <label htmlFor="client_address" className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <textarea
              id="client_address"
              value={formData.client_address}
              onChange={(e) => onChange('client_address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter billing address"
            />
          </div>
        </div>

        {/* Project Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Project Information
          </h3>

          {/* Project Name */}
          <div>
            <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="project_name"
              value={formData.project_name}
              onChange={(e) => onChange('project_name', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.project_name ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter project name"
            />
            {errors.project_name && (
              <p className="mt-1 text-sm text-red-600">{errors.project_name}</p>
            )}
          </div>

          {/* Project Address */}
          <div>
            <label htmlFor="project_address" className="block text-sm font-medium text-gray-700 mb-1">
              Project Address
            </label>
            <textarea
              id="project_address"
              value={formData.project_address}
              onChange={(e) => onChange('project_address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project location address"
            />
          </div>

          {/* Additional Project Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="project_description"
                value={formData.project_description}
                onChange={(e) => onChange('project_description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the project scope, requirements, and any special considerations"
              />
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
            <h3 className="text-sm font-medium text-blue-800">Information Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Company name and project name are required fields</li>
                <li>Email addresses will be validated automatically</li>
                <li>Project address can be different from billing address</li>
                <li>Detailed project descriptions help create more accurate proposals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 