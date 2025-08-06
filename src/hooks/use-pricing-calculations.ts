import { useState, useEffect, useCallback } from 'react';
import { ProposalLineItem } from '@/types/proposal';
import { PricingEngine, PricingCalculation } from '@/lib/pricing-engine';

interface UsePricingCalculationsProps {
  lineItems: ProposalLineItem[];
  taxRate: number;
  onPricingUpdate?: (subtotal: number, taxAmount: number, total: number) => void;
}

interface UsePricingCalculationsReturn {
  calculation: PricingCalculation;
  updateTaxRate: (taxRate: number) => void;
  addLineItem: (item: ProposalLineItem) => void;
  updateLineItem: (id: string, updates: Partial<ProposalLineItem>) => void;
  removeLineItem: (id: string) => void;
  isValid: boolean;
  hasWarnings: boolean;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

export function usePricingCalculations({
  lineItems,
  taxRate,
  onPricingUpdate
}: UsePricingCalculationsProps): UsePricingCalculationsReturn {
  const [calculation, setCalculation] = useState<PricingCalculation>({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    categoryBreakdown: [],
    validationErrors: [],
    warnings: []
  });

  // Recalculate pricing whenever line items or tax rate changes
  useEffect(() => {
    const newCalculation = PricingEngine.calculatePricing(lineItems, taxRate);
    setCalculation(newCalculation);

    // Notify parent component of pricing changes
    if (onPricingUpdate) {
      onPricingUpdate(newCalculation.subtotal, newCalculation.taxAmount, newCalculation.total);
    }
  }, [lineItems, taxRate, onPricingUpdate]);

  const updateTaxRate = useCallback((newTaxRate: number) => {
    // This would typically be handled by the parent component
    // The hook just recalculates based on the new tax rate
  }, []);

  const addLineItem = useCallback((item: ProposalLineItem) => {
    // This would typically be handled by the parent component
    // The hook just recalculates based on the updated line items
  }, []);

  const updateLineItem = useCallback((id: string, updates: Partial<ProposalLineItem>) => {
    // This would typically be handled by the parent component
    // The hook just recalculates based on the updated line items
  }, []);

  const removeLineItem = useCallback((id: string) => {
    // This would typically be handled by the parent component
    // The hook just recalculates based on the updated line items
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return PricingEngine.formatCurrency(amount);
  }, []);

  const formatPercentage = useCallback((value: number): string => {
    return PricingEngine.formatPercentage(value);
  }, []);

  return {
    calculation,
    updateTaxRate,
    addLineItem,
    updateLineItem,
    removeLineItem,
    isValid: calculation.validationErrors.length === 0,
    hasWarnings: calculation.warnings.length > 0,
    formatCurrency,
    formatPercentage
  };
}

// Additional utility hooks for specific pricing scenarios

export function useMaterialPricing() {
  const getSuggestedPrice = useCallback((materialName: string, unit: string): number => {
    return PricingEngine.getSuggestedPricing(materialName, unit);
  }, []);

  const calculateSquareFootagePricing = useCallback((
    squareFootage: number,
    baseRate: number,
    complexityMultiplier: number = 1.0
  ): number => {
    return PricingEngine.calculateSquareFootagePricing(squareFootage, baseRate, complexityMultiplier);
  }, []);

  return {
    getSuggestedPrice,
    calculateSquareFootagePricing
  };
}

export function useLaborPricing() {
  const calculateLaborHours = useCallback((squareFootage: number, projectType: string): number => {
    return PricingEngine.calculateLaborHours(squareFootage, projectType);
  }, []);

  const calculateLaborCost = useCallback((
    squareFootage: number,
    projectType: string,
    hourlyRate: number
  ): number => {
    const hours = PricingEngine.calculateLaborHours(squareFootage, projectType);
    return hours * hourlyRate;
  }, []);

  return {
    calculateLaborHours,
    calculateLaborCost
  };
}

export function useEquipmentPricing() {
  const calculateEquipmentCosts = useCallback((
    projectDuration: number,
    equipmentType: string
  ): number => {
    return PricingEngine.calculateEquipmentCosts(projectDuration, equipmentType);
  }, []);

  return {
    calculateEquipmentCosts
  };
}

export function usePricingValidation() {
  const validateLineItem = useCallback((item: ProposalLineItem): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!item.description || item.description.trim() === '') {
      errors.push('Description is required');
    }

    if (item.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (item.unit_price < 0.01) {
      errors.push('Unit price must be at least $0.01');
    }

    const expectedTotal = item.quantity * item.unit_price;
    if (Math.abs(item.total - expectedTotal) > 0.01) {
      errors.push('Total calculation mismatch');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validatePricing = useCallback((lineItems: ProposalLineItem[], total: number) => {
    return PricingEngine.validatePricing(lineItems, total);
  }, []);

  return {
    validateLineItem,
    validatePricing
  };
} 