// AI-based Decorator Recommendation System
export const getDecoratorRecommendations = (preferences = {}) => {
  const {
    serviceType = 'home',
    budget = 'medium',
    style = 'modern',
    location = 'dhaka',
    eventSize = 'small'
  } = preferences;

  // Mock AI recommendation logic
  const decorators = [
    {
      id: 'dec001',
      name: 'Sarah Ahmed',
      rating: 4.9,
      specialties: ['modern', 'minimalist', 'home'],
      experience: 8,
      completedProjects: 150,
      priceRange: 'medium',
      location: 'dhaka',
      matchScore: 95,
      photo: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'dec002', 
      name: 'Rafiq Hassan',
      rating: 4.8,
      specialties: ['traditional', 'wedding', 'event'],
      experience: 12,
      completedProjects: 200,
      priceRange: 'high',
      location: 'dhaka',
      matchScore: 88,
      photo: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'dec003',
      name: 'Fatima Khan',
      rating: 4.7,
      specialties: ['contemporary', 'office', 'corporate'],
      experience: 6,
      completedProjects: 120,
      priceRange: 'medium',
      location: 'dhaka',
      matchScore: 82,
      photo: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  // AI matching algorithm (simplified)
  const recommendations = decorators
    .map(decorator => {
      let score = decorator.matchScore;
      
      // Adjust score based on preferences
      if (decorator.specialties.includes(serviceType)) score += 10;
      if (decorator.specialties.includes(style)) score += 8;
      if (decorator.priceRange === budget) score += 5;
      if (decorator.location === location) score += 3;
      
      return { ...decorator, aiScore: Math.min(score, 100) };
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);

  return {
    recommendations,
    confidence: 'high',
    reasoning: `Based on your preference for ${style} ${serviceType} decoration with ${budget} budget, these decorators are the best match.`
  };
};

export const getMultipleDecoratorsForEvent = (eventDetails) => {
  const { eventSize, budget, duration, services } = eventDetails;
  
  if (eventSize === 'large' || services?.length > 3) {
    return {
      recommended: true,
      decoratorCount: eventSize === 'large' ? 3 : 2,
      benefits: [
        'Faster setup and completion',
        'Specialized expertise for different areas',
        'Better coordination for large events',
        'Backup support if needed'
      ],
      estimatedTimeReduction: '40%',
      additionalCost: eventSize === 'large' ? 1500 : 800
    };
  }
  
  return {
    recommended: false,
    reason: 'Single decorator sufficient for this event size'
  };
};