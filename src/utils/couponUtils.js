// Mock data for available coupons
const availableCoupons = [
  {
    code: "STYLE10",
    type: "percentage",
    value: 10,
    minAmount: 5000,
    title: "10% Off Your First Booking",
    description: "Get 10% off on orders over ৳5,000.",
    expiry: "2024-12-31",
  },
  {
    code: "DECOR200",
    type: "fixed",
    value: 200,
    minAmount: 2000,
    title: "Flat ৳200 Discount",
    description: "Enjoy a flat ৳200 discount on any service.",
    expiry: "2024-10-31",
  },
];

export const getAvailableCoupons = () => {
  return availableCoupons;
};

export const applyCoupon = async (code, subtotal) => {
  const coupon = availableCoupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code." };
  }

  if (subtotal < coupon.minAmount) {
    return {
      valid: false,
      error: `Minimum order of ৳${coupon.minAmount} required.`,
    };
  }

  const discount =
    coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value;

  return { valid: true, discount: Math.round(discount), coupon };
};
