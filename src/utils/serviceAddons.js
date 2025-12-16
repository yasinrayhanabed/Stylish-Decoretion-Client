// Service Add-ons System
export const serviceAddons = [
  {
    id: 'lighting',
    name: 'Premium Lighting',
    description: 'Professional LED lighting setup with color themes',
    price: 1500,
    category: 'lighting',
    duration: '2 hours',
    image: '💡',
    popular: true
  },
  {
    id: 'floral',
    name: 'Floral Arrangements',
    description: 'Fresh flower decorations and bouquets',
    price: 2000,
    category: 'floral',
    duration: '1.5 hours',
    image: '🌸',
    popular: true
  },
  {
    id: 'theme',
    name: 'Theme Enhancement',
    description: 'Custom theme props and decorative elements',
    price: 1200,
    category: 'theme',
    duration: '1 hour',
    image: '🎭',
    popular: false
  },
  {
    id: 'photography',
    name: 'Photography Setup',
    description: 'Professional photo booth and backdrop setup',
    price: 1800,
    category: 'photography',
    duration: '1 hour',
    image: '📸',
    popular: true
  },
  {
    id: 'sound',
    name: 'Sound System',
    description: 'Audio equipment and ambient music setup',
    price: 1000,
    category: 'audio',
    duration: '30 minutes',
    image: '🔊',
    popular: false
  },
  {
    id: 'catering_decor',
    name: 'Catering Area Decor',
    description: 'Special decoration for food and beverage areas',
    price: 800,
    category: 'catering',
    duration: '45 minutes',
    image: '🍽️',
    popular: false
  }
];

export const getRecommendedAddons = (serviceType, budget) => {
  let recommended = [];
  
  switch (serviceType) {
    case 'wedding':
      recommended = ['lighting', 'floral', 'photography'];
      break;
    case 'birthday':
      recommended = ['theme', 'photography', 'sound'];
      break;
    case 'corporate':
      recommended = ['lighting', 'sound', 'catering_decor'];
      break;
    case 'home':
      recommended = ['lighting', 'floral'];
      break;
    default:
      recommended = ['lighting', 'theme'];
  }
  
  return serviceAddons
    .filter(addon => recommended.includes(addon.id))
    .filter(addon => budget === 'high' || addon.price <= 1500)
    .sort((a, b) => b.popular - a.popular);
};

export const calculateAddonTotal = (selectedAddons) => {
  return selectedAddons.reduce((total, addonId) => {
    const addon = serviceAddons.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
};

export const getAddonsByCategory = () => {
  const categories = {};
  serviceAddons.forEach(addon => {
    if (!categories[addon.category]) {
      categories[addon.category] = [];
    }
    categories[addon.category].push(addon);
  });
  return categories;
};