// AI-based Recommended Decorator Feature
export const decoratorProfiles = [
  {
    id: 'dec_001',
    name: 'Ahmed Hassan',
    specialties: ['wedding', 'traditional', 'luxury'],
    rating: 4.9,
    experience: 8,
    completedProjects: 150,
    location: 'dhaka',
    priceRange: 'premium',
    availability: 'high',
    portfolio: ['wedding1.jpg', 'traditional1.jpg']
  },
  {
    id: 'dec_002',
    name: 'Fatima Rahman',
    specialties: ['modern', 'minimalist', 'corporate'],
    rating: 4.8,
    experience: 6,
    completedProjects: 120,
    location: 'dhaka',
    priceRange: 'mid',
    availability: 'medium',
    portfolio: ['modern1.jpg', 'corporate1.jpg']
  },
  {
    id: 'dec_003',
    name: 'Karim Ahmed',
    specialties: ['birthday', 'kids', 'colorful'],
    rating: 4.7,
    experience: 5,
    completedProjects: 90,
    location: 'chittagong',
    priceRange: 'budget',
    availability: 'high',
    portfolio: ['birthday1.jpg', 'kids1.jpg']
  }
];

export const getRecommendedDecorators = (preferences) => {
  const {
    serviceType,
    budget,
    location,
    style,
    urgency = 'normal'
  } = preferences;

  let scores = decoratorProfiles.map(decorator => {
    let score = 0;

    // Specialty match (40% weight)
    if (decorator.specialties.some(spec => 
      spec.toLowerCase().includes(serviceType?.toLowerCase() || '') ||
      spec.toLowerCase().includes(style?.toLowerCase() || '')
    )) {
      score += 40;
    }

    // Location match (25% weight)
    if (decorator.location === location) {
      score += 25;
    }

    // Budget compatibility (20% weight)
    const budgetMatch = {
      'budget': ['budget', 'mid'],
      'mid': ['budget', 'mid', 'premium'],
      'premium': ['mid', 'premium']
    };
    if (budgetMatch[budget]?.includes(decorator.priceRange)) {
      score += 20;
    }

    // Rating (10% weight)
    score += decorator.rating * 2;

    // Availability bonus (5% weight)
    if (urgency === 'urgent' && decorator.availability === 'high') {
      score += 5;
    }

    return { ...decorator, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

export const getDecoratorRecommendation = async (serviceId, userPreferences) => {
  // Mock AI processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const recommendations = getRecommendedDecorators(userPreferences);
      resolve({
        recommendations,
        confidence: 0.85,
        reasoning: 'Based on service type, location, budget, and decorator ratings'
      });
    }, 1500);
  });
};

export const getDecoratorRecommendations = (preferences) => {
  const recommendations = getRecommendedDecorators(preferences);
  return {
    recommendations: recommendations.map(decorator => ({
      ...decorator,
      photo: `/images/decorators/${decorator.id}.jpg`,
      aiScore: Math.round(decorator.score)
    })),
    confidence: 0.85
  };
};

export const getMultipleDecoratorsForEvent = (guestCount, preferences) => {
  const allDecorators = getRecommendedDecorators(preferences);
  const decoratorsNeeded = Math.ceil(guestCount / 50);
  return allDecorators.slice(0, decoratorsNeeded);
};