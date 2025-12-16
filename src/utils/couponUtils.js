// Coupon/Offer Code System
export const couponTypes = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_ADDON: 'free_addon'
};

export const mockCoupons = [
  {
    code: 'WELCOME20',
    type: couponTypes.PERCENTAGE,
    value: 20,
    description: '20% off on first booking',
    minAmount: 5000,
    maxDiscount: 2000,
    validUntil: '2024-12-31',
    usageLimit: 100,
    usedCount: 15,
    active: true
  },
  {
    code: 'FESTIVAL50',
    type: couponTypes.FIXED,
    value: 1500,
    description: '৳1500 off on festival decorations',
    minAmount: 8000,
    validUntil: '2024-12-25',
    usageLimit: 50,
    usedCount: 8,
    active: true
  },
  {
    code: 'FREELIGHTS',
    type: couponTypes.FREE_ADDON,
    value: 'lighting',
    description: 'Free lighting addon',
    minAmount: 10000,
    validUntil: '2024-11-30',
    usageLimit: 25,
    usedCount: 3,
    active: true
  }
];

export const validateCoupon = (couponCode, orderAmount) => {
  const coupon = mockCoupons.find(c => 
    c.code.toLowerCase() === couponCode.toLowerCase() && 
    c.active &&
    new Date(c.validUntil) > new Date() &&
    c.usedCount < c.usageLimit
  );

  if (!coupon) {
    return { valid: false, error: 'Invalid or expired coupon code' };
  }

  if (orderAmount < coupon.minAmount) {
    return { 
      valid: false, 
      error: `Minimum order amount ৳${coupon.minAmount} required` 
    };
  }

  let discount = 0;
  if (coupon.type === couponTypes.PERCENTAGE) {
    discount = Math.min(
      (orderAmount * coupon.value) / 100,
      coupon.maxDiscount || orderAmount
    );
  } else if (coupon.type === couponTypes.FIXED) {
    discount = Math.min(coupon.value, orderAmount);
  }

  return {
    valid: true,
    coupon,
    discount,
    finalAmount: orderAmount - discount
  };
};

export const applyCoupon = async (couponCode, orderAmount) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = validateCoupon(couponCode, orderAmount);
      resolve(result);
    }, 500);
  });
};

export const getAvailableCoupons = () => {
  return mockCoupons.filter(coupon => coupon.active).map(coupon => ({
    ...coupon,
    title: coupon.description,
    expiry: new Date(coupon.validUntil).toLocaleDateString()
  }));
};