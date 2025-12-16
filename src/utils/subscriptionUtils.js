// Subscription Packages for Regular Clients
export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 5000,
    duration: 30,
    services: 2,
    discount: 10,
    features: ['2 services per month', '10% discount', 'Priority booking'],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 12000,
    duration: 30,
    services: 5,
    discount: 15,
    features: ['5 services per month', '15% discount', 'Free consultation', 'Priority support'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 25000,
    duration: 30,
    services: 12,
    discount: 20,
    features: ['12 services per month', '20% discount', 'Dedicated decorator', 'Free add-ons'],
    popular: false
  }
];

export const calculateSubscriptionSavings = (planId, regularPrice) => {
  const plan = subscriptionPlans.find(p => p.id === planId);
  if (!plan) return 0;
  
  const discountAmount = (regularPrice * plan.discount) / 100;
  return discountAmount;
};

export const getActiveSubscription = (userId) => {
  // Mock subscription data
  return {
    id: 'sub_123',
    userId,
    planId: 'premium',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    servicesUsed: 3,
    servicesRemaining: 2,
    status: 'active'
  };
};

export const canUseSubscription = (subscription) => {
  if (!subscription || subscription.status !== 'active') return false;
  
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  
  return now <= endDate && subscription.servicesRemaining > 0;
};