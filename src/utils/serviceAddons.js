export const serviceAddons = [
  {
    id: "addon1",
    name: "Premium Floral Arrangements",
    description: "Exotic flowers and custom bouquets.",
    price: 8000,
    image: "💐",
    duration: "Full Event",
    popular: true,
    tags: ["wedding", "home"],
  },
  {
    id: "addon2",
    name: "Advanced LED Lighting",
    description: "Programmable mood lighting and effects.",
    price: 12000,
    image: "💡",
    duration: "Full Event",
    popular: true,
    tags: ["wedding", "corporate"],
  },
  {
    id: "addon3",
    name: "Professional Photography",
    description: "A dedicated photographer for 4 hours.",
    price: 15000,
    image: "📸",
    duration: "4 Hours",
    popular: false,
    tags: ["wedding", "corporate", "seminar"],
  },
];

export const getRecommendedAddons = (serviceType, budget) => {
  return serviceAddons.filter((addon) => addon.tags.includes(serviceType));
};

export const calculateAddonTotal = (selectedAddonIds) => {
  return selectedAddonIds.reduce((total, addonId) => {
    const addon = serviceAddons.find((a) => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
};
