const Product = require('../models/Product');
const Service = require('../models/Service');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');

// @desc    Get all products
// @route   GET /api/marketplace/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, query, location } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    let products = await Product.find(filter).populate({
      path: 'entrepreneur',
      populate: { path: 'user', select: 'name' }
    });

    if (location) {
      products = products.filter(p => p.entrepreneur && p.entrepreneur.location && p.entrepreneur.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/marketplace/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, query, location } = req.query;
    
    let filter = {};
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    let services = await Service.find(filter).populate({
      path: 'entrepreneur',
      populate: { path: 'user', select: 'name' }
    });
    
    if (category) {
      services = services.filter(s => s.entrepreneur && s.entrepreneur.category === category);
    }
    if (location) {
      services = services.filter(s => s.entrepreneur && s.entrepreneur.location && s.entrepreneur.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/marketplace/products
// @access  Private/Entrepreneur
exports.createProduct = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Entrepreneur profile not found' });

    const product = new Product({
      entrepreneur: profile._id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/marketplace/services
// @access  Private/Entrepreneur
exports.createService = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Entrepreneur profile not found' });

    const service = new Service({
      entrepreneur: profile._id,
      name: req.body.name,
      description: req.body.description,
      basePrice: req.body.basePrice,
      duration: req.body.duration,
      imageUrl: req.body.imageUrl
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
