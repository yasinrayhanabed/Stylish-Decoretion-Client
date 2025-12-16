// Currency formatting utility for Bangladeshi Taka (BDT)
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'BDT',
    showCurrency = true,
    compact = false,
    locale = 'en-BD'
  } = options;

  if (!amount || isNaN(amount)) return showCurrency ? `${currency} 0` : '0';
  
  const num = parseFloat(amount);
  
  if (compact) {
    // For compact display (millions/billions)
    if (num >= 1000000000) {
      const formatted = (num / 1000000000).toFixed(2);
      return showCurrency ? `${currency} ${formatted}B` : `${formatted}B`;
    } else if (num >= 1000000) {
      const formatted = (num / 1000000).toFixed(2);
      return showCurrency ? `${currency} ${formatted}M` : `${formatted}M`;
    } else if (num >= 100000) {
      const formatted = (num / 100000).toFixed(1);
      return showCurrency ? `${currency} ${formatted}L` : `${formatted}L`;
    }
  }
  
  // Regular formatting with commas
  const formatted = num.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showCurrency ? `${currency} ${formatted}` : formatted;
};

// Format amount for display in tables/cards
export const formatAmountDisplay = (amount) => {
  return formatCurrency(amount, { compact: true });
};

// Format amount for tooltips (full amount)
export const formatAmountFull = (amount) => {
  return formatCurrency(amount, { compact: false });
};

// Parse amount from string (remove currency symbols and convert to number)
export const parseAmount = (amountString) => {
  if (typeof amountString === 'number') return amountString;
  if (!amountString) return 0;
  
  // Remove currency symbols and letters, keep only numbers and decimal points
  const cleaned = amountString.toString().replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};