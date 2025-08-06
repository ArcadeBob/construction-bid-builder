'use client';

import { useState } from 'react';
import { ProposalLineItem, LineItemCategory, DEFAULT_UNITS } from '@/types/proposal';
import Button from '@/components/ui/Button';

interface LineItemsTableProps {
  lineItems: ProposalLineItem[];
  onUpdate: (id: string, updates: Partial<ProposalLineItem>) => void;
  onDelete: (id: string) => void;
  category: LineItemCategory;
}

export default function LineItemsTable({
  lineItems,
  onUpdate,
  onDelete,
  category
}: LineItemsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ProposalLineItem>>({});

  const handleEdit = (item: ProposalLineItem) => {
    setEditingId(item.id);
    setEditData({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      is_manual_override: item.is_manual_override
    });
  };

  const handleSave = (id: string) => {
    const total = (editData.quantity || 0) * (editData.unit_price || 0);
    onUpdate(id, { ...editData, total });
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof ProposalLineItem, value: string | number | boolean) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (lineItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {category.toLowerCase()} items added yet.</p>
        <p className="text-sm">Click &quot;Add Item&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Override
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lineItems.map((item) => {
            const isEditing = editingId === item.id;
            const currentData = isEditing ? editData : item;
            const total = calculateTotal(currentData.quantity || 0, currentData.unit_price || 0);

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Item description"
                    />
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {item.description}
                      </span>
                      {item.is_manual_override && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Override
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentData.quantity || ''}
                      onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{item.quantity}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={currentData.unit || ''}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {DEFAULT_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{item.unit}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentData.unit_price || ''}
                      onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">
                      {formatCurrency(item.unit_price)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={currentData.is_manual_override || false}
                      onChange={(e) => handleInputChange('is_manual_override', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={item.is_manual_override}
                      disabled
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isEditing ? (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(item.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
              Subtotal:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {formatCurrency(lineItems.reduce((sum, item) => sum + item.total, 0))}
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
} 