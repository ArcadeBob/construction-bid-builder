'use client';

import { useState } from 'react';
import { LineItemCategory, ProposalLineItem, CreateLineItemInput } from '@/types/proposal';
import LineItemsTable from './line-items-table';
import PricingCalculator from './pricing-calculator';
import MaterialSelector from './material-selector';
import Button from '@/components/ui/Button';

interface PricingSectionProps {
  proposalId: string;
  lineItems: ProposalLineItem[];
  onLineItemsChange: (lineItems: ProposalLineItem[]) => void;
  onPricingUpdate: (subtotal: number, taxAmount: number, total: number) => void;
  taxRate: number;
  onTaxRateChange: (taxRate: number) => void;
}

const tabs = [
  { id: 'materials', label: 'Materials', category: LineItemCategory.MATERIAL },
  { id: 'labor', label: 'Labor', category: LineItemCategory.LABOR },
  { id: 'equipment', label: 'Equipment', category: LineItemCategory.EQUIPMENT },
  { id: 'overhead', label: 'Overhead', category: LineItemCategory.OVERHEAD },
  { id: 'profit', label: 'Profit', category: LineItemCategory.PROFIT },
  { id: 'summary', label: 'Summary', category: null }
];

export default function PricingSection({
  proposalId,
  lineItems,
  onLineItemsChange,
  onPricingUpdate,
  taxRate,
  onTaxRateChange
}: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState('materials');
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);

  const currentCategory = tabs.find(tab => tab.id === activeTab)?.category;
  const currentLineItems = currentCategory 
    ? lineItems.filter(item => item.category === currentCategory)
    : [];

  const handleAddLineItem = (category: LineItemCategory) => {
    const newLineItem: CreateLineItemInput = {
      proposal_id: proposalId,
      category,
      description: '',
      quantity: 1,
      unit: 'each',
      unit_price: 0,
      is_manual_override: false,
      order_index: lineItems.filter(item => item.category === category).length
    };

    // Create a temporary ID for the new item
    const tempItem: ProposalLineItem = {
      ...newLineItem,
      id: `temp-${Date.now()}`,
      total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onLineItemsChange([...lineItems, tempItem]);
  };

  const handleUpdateLineItem = (id: string, updates: Partial<ProposalLineItem>) => {
    const updatedItems = lineItems.map(item => 
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    );
    onLineItemsChange(updatedItems);
  };

  const handleDeleteLineItem = (id: string) => {
    const updatedItems = lineItems.filter(item => item.id !== id);
    onLineItemsChange(updatedItems);
  };

  const handleMaterialSelect = (material: any) => {
    if (currentCategory) {
      const newLineItem: CreateLineItemInput = {
        proposal_id: proposalId,
        category: currentCategory,
        description: material.name,
        quantity: 1,
        unit: material.unit || 'each',
        unit_price: material.suggested_price || 0,
        is_manual_override: false,
        material_id: material.id,
        order_index: lineItems.filter(item => item.category === currentCategory).length
      };

      const tempItem: ProposalLineItem = {
        ...newLineItem,
        id: `temp-${Date.now()}`,
        total: newLineItem.quantity * newLineItem.unit_price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onLineItemsChange([...lineItems, tempItem]);
    }
    setShowMaterialSelector(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab !== 'summary' && currentCategory && (
          <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-sm text-gray-500">
                  Manage {activeTab} line items for your proposal
                </p>
              </div>
              <div className="flex space-x-2">
                {activeTab === 'materials' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowMaterialSelector(true)}
                  >
                    Add from Catalog
                  </Button>
                )}
                <Button
                  onClick={() => handleAddLineItem(currentCategory)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Add Item
                </Button>
              </div>
            </div>

            {/* Line Items Table */}
            <LineItemsTable
              lineItems={currentLineItems}
              onUpdate={handleUpdateLineItem}
              onDelete={handleDeleteLineItem}
              category={currentCategory}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <PricingCalculator
            lineItems={lineItems}
            taxRate={taxRate}
            onTaxRateChange={onTaxRateChange}
            onPricingUpdate={onPricingUpdate}
          />
        )}
      </div>

      {/* Material Selector Modal */}
      {showMaterialSelector && (
        <MaterialSelector
          onSelect={handleMaterialSelect}
          onClose={() => setShowMaterialSelector(false)}
        />
      )}
    </div>
  );
} 