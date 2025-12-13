// Backend API endpoint example for top-rated decorators
// This should be implemented in your backend server

// GET /api/decorators/top-rated
app.get('/decorators/top-rated', async (req, res) => {
  try {
    // Fetch decorators with their ratings and reviews
    const decorators = await Decorator.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'decoratorId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          totalReviews: { $size: '$reviews' },
          completedProjects: { $size: '$completedBookings' }
        }
      },
      {
        $match: {
          isActive: true,
          averageRating: { $gte: 4.0 } // Only decorators with 4+ rating
        }
      },
      {
        $sort: { averageRating: -1, totalReviews: -1 }
      },
      {
        $limit: 8
      },
      {
        $project: {
          name: 1,
          photo: 1,
          specialty: 1,
          averageRating: 1,
          totalReviews: 1,
          completedProjects: 1,
          isVerified: 1
        }
      }
    ]);

    res.json(decorators);
  } catch (error) {
    console.error('Error fetching top decorators:', error);
    res.status(500).json({ message: 'Failed to fetch top decorators' });
  }
});

// Example decorator schema with rating fields
const decoratorSchema = {
  name: String,
  email: String,
  photo: String,
  specialty: String,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  completedBookings: [{ type: ObjectId, ref: 'Booking' }],
  // Add these fields for rating system
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
};

// Example review schema
const reviewSchema = {
  decoratorId: { type: ObjectId, ref: 'Decorator', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  bookingId: { type: ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
};