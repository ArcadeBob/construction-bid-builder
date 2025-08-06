'use client';

import { useState } from 'react';
import { ProposalLineItem, LineItemCategory, CreateLineItemInput } from '@/types/proposal';
import PricingSection from '@/components/proposals/pricing-section';
import Button from '@/components/ui/Button';

export default function TestPricingPage() {
  const [lineItems, setLineItems] = useState<ProposalLineItem[]>([]);
  const [taxRate, setTaxRate] = useState(8.5);
  const [pricingSummary, setPricingSummary] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  const handleLineItemsChange = (newLineItems: ProposalLineItem[]) => {
    setLineItems(newLineItems);
  };

  const handlePricingUpdate = (subtotal: number, taxAmount: number, total: number) => {
    setPricingSummary({ subtotal, taxAmount, total });
  };

  const handleTaxRateChange = (newTaxRate: number) => {
    setTaxRate(newTaxRate);
  };

  const addSampleData = () => {
    const sampleItems: CreateLineItemInput[] = [
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.MATERIAL,
        description: 'Tempered Glass 1/4"',
        quantity: 100,
        unit: 'sq ft',
        unit_price: 12.50,
        is_manual_override: false,
        order_index: 0
      },
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.MATERIAL,
        description: 'Aluminum Frame System',
        quantity: 50,
        unit: 'lin ft',
        unit_price: 45.00,
        is_manual_override: false,
        order_index: 1
      },
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.LABOR,
        description: 'Installation Labor',
        quantity: 40,
        unit: 'hour',
        unit_price: 65.00,
        is_manual_override: false,
        order_index: 2
      },
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.EQUIPMENT,
        description: 'Scaffolding Rental',
        quantity: 5,
        unit: 'day',
        unit_price: 150.00,
        is_manual_override: false,
        order_index: 3
      },
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.OVERHEAD,
        description: 'Project Management',
        quantity: 1,
        unit: 'lump',
        unit_price: 2500.00,
        is_manual_override: false,
        order_index: 4
      },
      {
        proposal_id: 'test-proposal',
        category: LineItemCategory.PROFIT,
        description: 'Profit Margin',
        quantity: 1,
        unit: 'lump',
        unit_price: 3500.00,
        is_manual_override: false,
        order_index: 5
      }
    ];

    const newLineItems: ProposalLineItem[] = sampleItems.map((item, index) => ({
      ...item,
      id: `sample-${index}`,
      total: item.quantity * item.unit_price,
      is_manual_override: item.is_manual_override ?? false,
      order_index: item.order_index ?? index,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    setLineItems(newLineItems);
  };

  const clearData = () => {
    setLineItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pricing System Test</h1>
              <p className="mt-2 text-gray-600">
                Test the hybrid pricing system with line item management
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={addSampleData}
              >
                Add Sample Data
              </Button>
              <Button
                variant="outline"
                onClick={clearData}
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${pricingSummary.subtotal.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Subtotal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${pricingSummary.taxAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Tax ({taxRate}%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ${pricingSummary.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <PricingSection
            proposalId="test-proposal"
            lineItems={lineItems}
            onLineItemsChange={handleLineItemsChange}
            onPricingUpdate={handlePricingUpdate}
            taxRate={taxRate}
            onTaxRateChange={handleTaxRateChange}
          />
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Information</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Line Items Count: {lineItems.length}</div>
            <div>Tax Rate: {taxRate}%</div>
            <div>Categories: {Array.from(new Set(lineItems.map(item => item.category))).join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 