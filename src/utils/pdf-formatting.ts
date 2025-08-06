/**
 * PDF Formatting Utilities
 * Provides consistent formatting functions for PDF generation
 */

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'full' = 'long'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  if (format === 'full') {
    options.weekday = 'long';
  }

  return dateObj.toLocaleDateString('en-US', options);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};

export const formatAddress = (address: string): string => {
  // Simple address formatting - can be enhanced based on needs
  return address.trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const wrapText = (text: string, maxWidth: number, fontSize: number = 10): string[] => {
  // Simple text wrapping - approximate characters per line
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= charsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  
  return lines;
};

export const calculateTableRowHeight = (content: string, cellWidth: number, fontSize: number = 10): number => {
  const lines = wrapText(content, cellWidth, fontSize);
  const lineHeight = fontSize * 1.2;
  const padding = 16; // 8px top + 8px bottom
  return Math.max(lines.length * lineHeight + padding, 40); // Minimum height of 40px
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateProposalNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `PROP-${year}${month}${day}-${random}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeText = (text: string): string => {
  // Remove potentially problematic characters for PDF generation
  return text
    .replace(/[^\w\s\-.,!?@#$%&*()]/g, '') // Remove special characters except common ones
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

export const calculateTotal = (subtotal: number, tax: number, discount: number = 0): number => {
  return subtotal + tax - discount;
};

export const formatDuration = (days: number): string => {
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    let result = `${weeks} week${weeks !== 1 ? 's' : ''}`;
    if (remainingDays > 0) {
      result += `, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }
    return result;
  } else {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    let result = `${months} month${months !== 1 ? 's' : ''}`;
    if (remainingDays > 0) {
      result += `, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }
    return result;
  }
}; 