// Coupon Code System
export const generateCouponCode = (prefix = 'STYLE') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const validateCoupon = (code, orderAmount = 0) => {
  const coupons = {
    'STYLE2024': { discount: 15, minAmount: 1000, maxDiscount: 500, active: true },
    'WELCOME10': { discount: 10, minAmount: 500, maxDiscount: 200, active: true },
    'FESTIVE25': { discount: 25, minAmount: 2000, maxDiscount: 1000, active: true },
    'NEWUSER': { discount: 20, minAmount: 800, maxDiscount: 300, active: true }
  };
  
  const coupon = coupons[code.toUpperCase()];
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  
  if (!coupon.active) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (orderAmount < coupon.minAmount) {
    return { 
      valid: false, 
      message: `Minimum order amount ৳${coupon.minAmount} required` 
    };
  }
  
  const discountAmount = Math.min(
    (orderAmount * coupon.discount) / 100,
    coupon.maxDiscount
  );
  
  return {
    valid: true,
    discount: coupon.discount,
    discountAmount,
    finalAmount: orderAmount - discountAmount,
    message: `${coupon.discount}% discount applied!`
  };
};

export const getAvailableCoupons = () => [
  {
    code: 'STYLE2024',
    title: 'New Year Special',
    discount: 15,
    description: 'Get 15% off on all services',
    minAmount: 1000,
    expiry: '2024-12-31'
  },
  {
    code: 'WELCOME10',
    title: 'Welcome Offer',
    discount: 10,
    description: 'First-time customer discount',
    minAmount: 500,
    expiry: '2024-12-31'
  },
  {
    code: 'FESTIVE25',
    title: 'Festival Bonanza',
    discount: 25,
    description: 'Biggest discount of the year',
    minAmount: 2000,
    expiry: '2024-12-31'
  }
];