import React from 'react';
import { formatAmountDisplay, formatAmountFull } from '../utils/formatCurrency';

// Test component to verify amount formatting
export default function AmountTest() {
  const testAmounts = [
    1000,
    50000,
    100000,
    500000,
    1000000,
    2500000,
    10000000,
    100000000,
    1000000000,
    2500000000
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Amount Formatting Test</h3>
      <div className="space-y-2">
        {testAmounts.map((amount, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-mono text-sm">Original: {amount}</span>
            <span className="font-bold">{formatAmountDisplay(amount)}</span>
            <span className="text-sm text-gray-600" title={formatAmountFull(amount)}>
              (Hover for full)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}