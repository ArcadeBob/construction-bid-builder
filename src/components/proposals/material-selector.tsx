'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/ui/Button';

interface Material {
  id: string;
  name: string;
  description?: string;
  unit: string;
  suggested_price: number;
  category?: string;
  supplier?: string;
}

interface MaterialSelectorProps {
  onSelect: (material: Material) => void;
  onClose: () => void;
}

export default function MaterialSelector({ onSelect, onClose }: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const supabase = createClient();

  // Mock materials data - in a real implementation, this would come from the database
  const mockMaterials: Material[] = [
    {
      id: '1',
      name: 'Tempered Glass 1/4"',
      description: 'Clear tempered safety glass',
      unit: 'sq ft',
      suggested_price: 12.50,
      category: 'Glass',
      supplier: 'GlassCo'
    },
    {
      id: '2',
      name: 'Aluminum Frame System',
      description: 'Standard aluminum framing system',
      unit: 'lin ft',
      suggested_price: 45.00,
      category: 'Framing',
      supplier: 'FrameTech'
    },
    {
      id: '3',
      name: 'Silicone Sealant',
      description: 'High-performance structural silicone',
      unit: 'tube',
      suggested_price: 8.75,
      category: 'Sealants',
      supplier: 'SealPro'
    },
    {
      id: '4',
      name: 'Glass Door Hardware',
      description: 'Complete door hardware set',
      unit: 'set',
      suggested_price: 125.00,
      category: 'Hardware',
      supplier: 'HardwareCo'
    },
    {
      id: '5',
      name: 'Insulated Glass Unit',
      description: 'Double-pane insulated glass',
      unit: 'sq ft',
      suggested_price: 28.00,
      category: 'Glass',
      supplier: 'GlassCo'
    },
    {
      id: '6',
      name: 'Stainless Steel Railings',
      description: 'Premium stainless steel railing system',
      unit: 'lin ft',
      suggested_price: 85.00,
      category: 'Railings',
      supplier: 'RailingPro'
    }
  ];

  useEffect(() => {
    // Simulate loading materials from database
    const loadMaterials = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be a database query
        // const { data, error } = await supabase
        //   .from('materials')
        //   .select('*')
        //   .order('name');
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setMaterials(mockMaterials);
        setFilteredMaterials(mockMaterials);
      } catch (error) {
        console.error('Error loading materials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  useEffect(() => {
    // Filter materials based on search term and category
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedCategory, materials]);

  const categories = ['all', ...Array.from(new Set(materials.map(m => m.category).filter(Boolean))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleMaterialSelect = (material: Material) => {
    onSelect(material);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select Material</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 space-y-3">
            <div>
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Materials List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading materials...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No materials found matching your search.</p>
                <p className="text-sm">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMaterialSelect(material)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{material.name}</h4>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Unit: {material.unit}</span>
                          {material.category && (
                            <span>Category: {material.category}</span>
                          )}
                          {material.supplier && (
                            <span>Supplier: {material.supplier}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(material.suggested_price)}
                        </div>
                        <div className="text-xs text-gray-500">per {material.unit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 