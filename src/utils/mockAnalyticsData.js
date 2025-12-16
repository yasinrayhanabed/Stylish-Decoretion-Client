// Mock Analytics Data for Development
export const mockAnalytics = {
  totalRevenue: 125000,
  totalBookings: 85,
  completedBookings: 78,
  activeDecorators: 12,
  monthlyRevenue: 35000,
  weeklyRevenue: 8500,
  dailyRevenue: 1200
};

export const mockServiceDemand = [
  { name: 'Wedding Decoration', bookings: 25 },
  { name: 'Birthday Party', bookings: 18 },
  { name: 'Corporate Event', bookings: 15 },
  { name: 'Home Decoration', bookings: 12 },
  { name: 'Anniversary', bookings: 8 },
  { name: 'Baby Shower', bookings: 7 }
];

export const mockUserBookings = [
  { name: 'Ahmed Hassan', bookings: 5 },
  { name: 'Fatima Rahman', bookings: 4 },
  { name: 'Karim Ahmed', bookings: 3 },
  { name: 'Rashida Begum', bookings: 3 },
  { name: 'Mohammad Ali', bookings: 2 }
];

export const mockRevenueData = [
  { month: 'Jan', revenue: 18000, bookings: 12 },
  { month: 'Feb', revenue: 22000, bookings: 15 },
  { month: 'Mar', revenue: 25000, bookings: 18 },
  { month: 'Apr', revenue: 28000, bookings: 20 },
  { month: 'May', revenue: 32000, bookings: 22 },
  { month: 'Jun', revenue: 35000, bookings: 25 }
];

export const simulateApiDelay = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const generateDynamicServiceDemand = () => {
  const services = [
    'Wedding Decoration', 'Birthday Party', 'Corporate Event', 
    'Home Decoration', 'Anniversary', 'Baby Shower', 'Engagement',
    'Graduation Party', 'Festival Decoration', 'Office Setup'
  ];
  
  return services.map(name => ({
    name,
    bookings: Math.floor(Math.random() * 30) + 5
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 6);
};