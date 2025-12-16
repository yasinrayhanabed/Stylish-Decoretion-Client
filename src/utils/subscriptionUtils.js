// Subscription Packages System
export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 2999,
    duration: 'monthly',
    services: 2,
    discount: 10,
    features: [
      '2 decoration services per month',
      '10% discount on all services',
      'Priority booking',
      'Basic consultation'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 4999,
    duration: 'monthly',
    services: 4,
    discount: 15,
    features: [
      '4 decoration services per month',
      '15% discount on all services',
      'Priority booking & support',
      'Free consultation',
      'Service add-ons included'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 8999,
    duration: 'monthly',
    services: 8,
    discount: 20,
    features: [
      '8 decoration services per month',
      '20% discount on all services',
      'Dedicated account manager',
      'Free consultation & planning',
      'All service add-ons included',
      'Multi-location support'
    ],
    popular: false
  }
];

export const calculateSubscriptionBenefit = (planId, serviceAmount) => {
  const plan = subscriptionPlans.find(p => p.id === planId);
  if (!plan) return { discount: 0, savings: 0 };
  
  const discount = (serviceAmount * plan.discount) / 100;
  return {
    discount: plan.discount,
    discountAmount: discount,
    finalAmount: serviceAmount - discount,
    savings: discount
  };
};

export const checkSubscriptionEligibility = (userId, planId) => {
  // Mock subscription check - integrate with backend
  return {
    eligible: true,
    remainingServices: 3,
    nextBillingDate: '2024-02-15',
    status: 'active'
  };
};