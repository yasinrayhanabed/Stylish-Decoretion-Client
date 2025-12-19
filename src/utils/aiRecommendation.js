// Mock data for decorators
const mockDecorators = [
  {
    id: "dec1",
    name: "Alice Rahman",
    rating: 4.9,
    experience: 5,
    specialties: ["wedding", "modern"],
    photo: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "dec2",
    name: "Bob Chowdhury",
    rating: 4.7,
    experience: 3,
    specialties: ["corporate", "minimalist"],
    photo: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "dec3",
    name: "Catherine Islam",
    rating: 4.8,
    experience: 7,
    specialties: ["home", "traditional"],
    photo: "https://i.pravatar.cc/150?img=3",
  },
];

// Mock AI recommendation function
export const getDecoratorRecommendations = (criteria) => {
  // In a real app, this would involve a complex algorithm or an API call
  const recommendations = mockDecorators
    .map((decorator) => {
      let score = 70;
      if (decorator.specialties.includes(criteria.serviceType)) score += 15;
      if (decorator.experience > 4) score += 10;
      if (decorator.rating > 4.7) score += 5;
      return { ...decorator, aiScore: Math.min(99, score) };
    })
    .sort((a, b) => b.aiScore - a.aiScore);

  return {
    recommendations,
    reasoning: `Based on your request for a ${criteria.style} ${criteria.serviceType} event, we've prioritized decorators with relevant experience and high ratings.`,
    confidence: "high",
  };
};

export const getMultipleDecoratorsForEvent = (guestCount) => {
  return guestCount > 100;
};
