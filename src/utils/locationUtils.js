// Multi-location Business Support
export const supportedLocations = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    areas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Wari'],
    serviceRadius: 25,
    baseDeliveryFee: 200,
    coordinates: { lat: 23.8103, lng: 90.4125 }
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    areas: ['Agrabad', 'Nasirabad', 'Khulshi', 'Panchlaish'],
    serviceRadius: 20,
    baseDeliveryFee: 300,
    coordinates: { lat: 22.3569, lng: 91.7832 }
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    areas: ['Zindabazar', 'Amberkhana', 'Subhanighat'],
    serviceRadius: 15,
    baseDeliveryFee: 250,
    coordinates: { lat: 24.8949, lng: 91.8687 }
  }
];

export const getLocationByArea = (area) => {
  return supportedLocations.find(location => 
    location.areas.some(a => a.toLowerCase().includes(area.toLowerCase()))
  );
};

export const calculateDeliveryFee = (location, distance = 0) => {
  const loc = supportedLocations.find(l => l.id === location);
  if (!loc) return 0;
  
  const extraDistance = Math.max(0, distance - 5);
  return loc.baseDeliveryFee + (extraDistance * 20);
};

export const isServiceAvailable = (area) => {
  return supportedLocations.some(location => 
    location.areas.some(a => a.toLowerCase().includes(area.toLowerCase()))
  );
};