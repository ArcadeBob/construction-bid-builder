'use client';

import { useEffect, useState } from 'react';
import { ProposalLineItem, LineItemCategory } from '@/types/proposal';

interface PricingCalculatorProps {
  lineItems: ProposalLineItem[];
  taxRate: number;
  onTaxRateChange: (taxRate: number) => void;
  onPricingUpdate: (subtotal: number, taxAmount: number, total: number) => void;
}

interface CategorySummary {
  category: LineItemCategory;
  total: number;
  count: number;
  percentage: number;
}

export default function PricingCalculator({
  lineItems,
  taxRate,
  onTaxRateChange,
  onPricingUpdate
}: PricingCalculatorProps) {
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const calculatePricing = () => {
    // Calculate subtotal from all line items
    const newSubtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate tax amount
    const newTaxAmount = newSubtotal * (taxRate / 100);
    
    // Calculate total
    const newTotal = newSubtotal + newTaxAmount;

    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);

    // Calculate category summaries
    const categories = Object.values(LineItemCategory);
    const summaries: CategorySummary[] = categories.map(category => {
      const categoryItems = lineItems.filter(item => item.category === category);
      const categoryTotal = categoryItems.reduce((sum, item) => sum + item.total, 0);
      const percentage = newSubtotal > 0 ? categoryTotal / newSubtotal : 0;
      
      return {
        category,
        total: categoryTotal,
        count: categoryItems.length,
        percentage
      };
    }).filter(summary => summary.count > 0);

    setCategorySummaries(summaries);

    // Update parent component
    onPricingUpdate(newSubtotal, newTaxAmount, newTotal);
  };

  useEffect(() => {
    calculatePricing();
  }, [lineItems, taxRate]);

  const getCategoryLabel = (category: LineItemCategory) => {
    const labels: Record<LineItemCategory, string> = {
      [LineItemCategory.MATERIAL]: 'Materials',
      [LineItemCategory.LABOR]: 'Labor',
      [LineItemCategory.EQUIPMENT]: 'Equipment',
      [LineItemCategory.OVERHEAD]: 'Overhead',
      [LineItemCategory.PROFIT]: 'Profit',
      [LineItemCategory.CUSTOM]: 'Custom'
    };
    return labels[category];
  };

  const getCategoryColor = (category: LineItemCategory) => {
    const colors: Record<LineItemCategory, string> = {
      [LineItemCategory.MATERIAL]: 'bg-blue-100 text-blue-800',
      [LineItemCategory.LABOR]: 'bg-green-100 text-green-800',
      [LineItemCategory.EQUIPMENT]: 'bg-purple-100 text-purple-800',
      [LineItemCategory.OVERHEAD]: 'bg-yellow-100 text-yellow-800',
      [LineItemCategory.PROFIT]: 'bg-indigo-100 text-indigo-800',
      [LineItemCategory.CUSTOM]: 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      {/* Tax Rate Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Tax Configuration</h3>
            <p className="text-sm text-gray-600">Set the tax rate for this proposal</p>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="taxRate" className="text-sm font-medium text-gray-700">
              Tax Rate:
            </label>
            <input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
          <p className="text-sm text-gray-600">Summary of costs by category</p>
        </div>
        <div className="divide-y divide-gray-200">
          {categorySummaries.map((summary) => (
            <div key={summary.category} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(summary.category)}`}>
                    {getCategoryLabel(summary.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {summary.count} item{summary.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(summary.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(summary.percentage)} of total
                  </div>
                </div>
              </div>
            </div>
          ))}
          {categorySummaries.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No line items added yet.</p>
              <p className="text-sm">Add items in the other tabs to see the breakdown here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pricing Summary</h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Subtotal:</span>
            <span className="text-sm font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Tax ({taxRate}%):</span>
            <span className="text-sm font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {lineItems.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No line items added</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Add line items in the other tabs to calculate pricing for this proposal.
              </p>
            </div>
          </div>
        </div>
      )}

      {lineItems.length > 0 && subtotal === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Zero total detected</h3>
              <p className="text-sm text-blue-700 mt-1">
                Some line items have zero unit prices. Review and update pricing in the other tabs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 