import { ProposalLineItem, LineItemCategory } from '@/types/proposal';

export interface PricingCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  categoryBreakdown: CategoryBreakdown[];
  validationErrors: string[];
  warnings: string[];
}

export interface CategoryBreakdown {
  category: LineItemCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface PricingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class PricingEngine {
  private static readonly MAX_TOTAL = 10000000; // $10M maximum
  private static readonly MAX_UNIT_PRICE = 10000; // $10K maximum unit price
  private static readonly MIN_UNIT_PRICE = 0.01; // $0.01 minimum unit price
  private static readonly MAX_QUANTITY = 100000; // 100K maximum quantity

  /**
   * Calculate complete pricing breakdown for a proposal
   */
  static calculatePricing(
    lineItems: ProposalLineItem[],
    taxRate: number
  ): PricingCalculation {
    const subtotal = this.calculateSubtotal(lineItems);
    const taxAmount = this.calculateTaxAmount(subtotal, taxRate);
    const total = subtotal + taxAmount;
    const categoryBreakdown = this.calculateCategoryBreakdown(lineItems, subtotal);
    const validation = this.validatePricing(lineItems, total);

    return {
      subtotal,
      taxAmount,
      total,
      categoryBreakdown,
      validationErrors: validation.errors,
      warnings: validation.warnings
    };
  }

  /**
   * Calculate subtotal from all line items
   */
  static calculateSubtotal(lineItems: ProposalLineItem[]): number {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  }

  /**
   * Calculate tax amount based on subtotal and tax rate
   */
  static calculateTaxAmount(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
  }

  /**
   * Calculate category breakdown with percentages
   */
  static calculateCategoryBreakdown(
    lineItems: ProposalLineItem[],
    subtotal: number
  ): CategoryBreakdown[] {
    const categories = Object.values(LineItemCategory);
    const breakdowns: CategoryBreakdown[] = [];

    categories.forEach(category => {
      const categoryItems = lineItems.filter(item => item.category === category);
      const categoryTotal = categoryItems.reduce((sum, item) => sum + item.total, 0);
      const percentage = subtotal > 0 ? categoryTotal / subtotal : 0;

      if (categoryItems.length > 0) {
        breakdowns.push({
          category,
          total: categoryTotal,
          count: categoryItems.length,
          percentage
        });
      }
    });

    return breakdowns;
  }

  /**
   * Validate pricing data and return errors/warnings
   */
  static validatePricing(
    lineItems: ProposalLineItem[],
    total: number
  ): PricingValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for empty line items
    if (lineItems.length === 0) {
      warnings.push('No line items added. Add items to calculate pricing.');
    }

    // Validate individual line items
    lineItems.forEach((item, index) => {
      // Check for missing descriptions
      if (!item.description || item.description.trim() === '') {
        errors.push(`Line item ${index + 1}: Description is required`);
      }

      // Check for invalid quantities
      if (item.quantity <= 0) {
        errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      }

      if (item.quantity > this.MAX_QUANTITY) {
        errors.push(`Line item ${index + 1}: Quantity exceeds maximum limit of ${this.MAX_QUANTITY.toLocaleString()}`);
      }

      // Check for invalid unit prices
      if (item.unit_price < this.MIN_UNIT_PRICE) {
        errors.push(`Line item ${index + 1}: Unit price must be at least ${this.formatCurrency(this.MIN_UNIT_PRICE)}`);
      }

      if (item.unit_price > this.MAX_UNIT_PRICE) {
        errors.push(`Line item ${index + 1}: Unit price exceeds maximum limit of ${this.formatCurrency(this.MAX_UNIT_PRICE)}`);
      }

      // Check for calculation discrepancies
      const expectedTotal = item.quantity * item.unit_price;
      if (Math.abs(item.total - expectedTotal) > 0.01) {
        errors.push(`Line item ${index + 1}: Total calculation mismatch. Expected ${this.formatCurrency(expectedTotal)}, got ${this.formatCurrency(item.total)}`);
      }

      // Check for zero totals
      if (item.total === 0 && item.quantity > 0 && item.unit_price > 0) {
        warnings.push(`Line item ${index + 1}: Total is zero despite having quantity and unit price`);
      }
    });

    // Check total amount
    if (total > this.MAX_TOTAL) {
      errors.push(`Total amount exceeds maximum limit of ${this.formatCurrency(this.MAX_TOTAL)}`);
    }

    // Check for reasonable pricing distribution
    const breakdown = this.calculateCategoryBreakdown(lineItems, this.calculateSubtotal(lineItems));
    const materialItems = lineItems.filter(item => item.category === LineItemCategory.MATERIAL);
    const laborItems = lineItems.filter(item => item.category === LineItemCategory.LABOR);

    if (materialItems.length > 0 && laborItems.length > 0) {
      const materialTotal = materialItems.reduce((sum, item) => sum + item.total, 0);
      const laborTotal = laborItems.reduce((sum, item) => sum + item.total, 0);
      const ratio = materialTotal / laborTotal;

      if (ratio > 10) {
        warnings.push('Material costs are significantly higher than labor costs. Consider reviewing pricing.');
      } else if (ratio < 0.1) {
        warnings.push('Labor costs are significantly higher than material costs. Consider reviewing pricing.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate line item total
   */
  static calculateLineItemTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  /**
   * Apply overhead percentage to subtotal
   */
  static applyOverhead(subtotal: number, overheadPercentage: number): number {
    return subtotal * (overheadPercentage / 100);
  }

  /**
   * Apply profit margin to subtotal
   */
  static applyProfitMargin(subtotal: number, profitPercentage: number): number {
    return subtotal * (profitPercentage / 100);
  }

  /**
   * Calculate markup percentage
   */
  static calculateMarkup(cost: number, sellingPrice: number): number {
    if (cost === 0) return 0;
    return ((sellingPrice - cost) / cost) * 100;
  }

  /**
   * Calculate profit margin percentage
   */
  static calculateProfitMargin(cost: number, sellingPrice: number): number {
    if (sellingPrice === 0) return 0;
    return ((sellingPrice - cost) / sellingPrice) * 100;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Format percentage for display
   */
  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Get suggested pricing for common materials
   */
  static getSuggestedPricing(materialName: string, unit: string): number {
    const suggestions: Record<string, Record<string, number>> = {
      'Tempered Glass 1/4"': { 'sq ft': 12.50 },
      'Insulated Glass Unit': { 'sq ft': 28.00 },
      'Aluminum Frame System': { 'lin ft': 45.00 },
      'Silicone Sealant': { 'tube': 8.75 },
      'Glass Door Hardware': { 'set': 125.00 },
      'Stainless Steel Railings': { 'lin ft': 85.00 }
    };

    return suggestions[materialName]?.[unit] || 0;
  }

  /**
   * Calculate square footage based pricing
   */
  static calculateSquareFootagePricing(
    squareFootage: number,
    baseRate: number,
    complexityMultiplier: number = 1.0
  ): number {
    return squareFootage * baseRate * complexityMultiplier;
  }

  /**
   * Calculate labor hours based on square footage
   */
  static calculateLaborHours(squareFootage: number, projectType: string): number {
    const rates: Record<string, number> = {
      'storefront_installation': 0.5, // hours per sq ft
      'curtain_wall': 0.8,
      'glass_doors': 0.3,
      'glass_railings': 0.4,
      'showers': 0.6,
      'glass_canopies': 1.0,
      'custom_installation': 1.2
    };

    const rate = rates[projectType] || 0.5;
    return squareFootage * rate;
  }

  /**
   * Calculate equipment costs
   */
  static calculateEquipmentCosts(
    projectDuration: number, // in days
    equipmentType: string
  ): number {
    const dailyRates: Record<string, number> = {
      'scaffolding': 150,
      'crane': 800,
      'lift': 300,
      'specialty_tools': 75
    };

    const rate = dailyRates[equipmentType] || 100;
    return projectDuration * rate;
  }
} 