const Review = require('../models/Review');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');

exports.createReview = async (req, res) => {
  try {
    const { entrepreneurId, rating, comment } = req.body;
    
    const profile = await EntrepreneurProfile.findById(entrepreneurId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const existing = await Review.findOne({ customer: req.user._id, entrepreneur: entrepreneurId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this entrepreneur' });
    }

    const review = new Review({
      customer: req.user._id,
      entrepreneur: entrepreneurId,
      rating: Number(rating),
      comment
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEntrepreneurReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ entrepreneur: req.params.id })
                                .populate('customer', 'name')
                                .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
