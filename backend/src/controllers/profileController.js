const EntrepreneurProfile = require('../models/EntrepreneurProfile');

exports.getProfile = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { skills, category, bio, location, imageUrl, isAvailable } = req.body;
    
    let profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (skills) profile.skills = skills;
    if (category) profile.category = category;
    if (bio) profile.bio = bio;
    if (location) profile.location = location;
    if (imageUrl) profile.imageUrl = imageUrl;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
