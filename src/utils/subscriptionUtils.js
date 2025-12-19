export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 1000,
    duration: "month",
    services: 2,
    features: ["2 services per month", "Standard support"],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 2500,
    duration: "month",
    services: 5,
    features: ["5 services per month", "Priority support", "10% off add-ons"],
    popular: true,
  },
  {
    id: "corporate",
    name: "Corporate Plan",
    price: 10000,
    duration: "year",
    services: 12,
    features: [
      "12 services per year",
      "Dedicated account manager",
      "Custom pricing",
    ],
    popular: false,
  },
];
