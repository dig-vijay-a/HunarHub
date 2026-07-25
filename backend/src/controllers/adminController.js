const User = require('../models/User');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });
    const totalOrders = await Order.countDocuments();
    const totalServiceRequests = await ServiceRequest.countDocuments();

    // Calculate platform revenue (completed orders)
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      totalUsers,
      totalEntrepreneurs,
      totalOrders,
      totalServiceRequests,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingEntrepreneurs = async (req, res) => {
  try {
    // Fetch all entrepreneurs
    const profiles = await EntrepreneurProfile.find({}).populate('user', 'name email');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEntrepreneur = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    profile.isVerified = true;
    await profile.save();
    
    res.json({ message: 'Entrepreneur verified successfully', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeEntrepreneur = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Remove the user account as well
    await User.findByIdAndDelete(profile.user);
    await EntrepreneurProfile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Entrepreneur removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
