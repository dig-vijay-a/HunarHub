const User = require('../models/User');
const Review = require('../models/Review');

exports.getPublicStats = async (req, res) => {
  try {
    // 1. Get total entrepreneurs
    const entrepreneurCount = await User.countDocuments({ role: 'entrepreneur' });

    // 2. Calculate satisfaction rate based on average review rating
    const reviews = await Review.find({});
    let satisfactionPercentage = 100; // Default if no reviews exist

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      // Convert 5-star rating to a percentage
      satisfactionPercentage = Math.round((averageRating / 5) * 100);
    }

    res.json({
      entrepreneurCount,
      satisfactionPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
