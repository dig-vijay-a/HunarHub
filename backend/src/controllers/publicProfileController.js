const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const Product = require('../models/Product');
const Service = require('../models/Service');

exports.getEntrepreneurById = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findById(req.params.id).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Entrepreneur not found' });

    const products = await Product.find({ entrepreneur: profile._id });
    const services = await Service.find({ entrepreneur: profile._id });

    res.json({
      profile,
      products,
      services
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
