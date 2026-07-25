const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const Product = require('../models/Product');
const Service = require('../models/Service');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const order = new Order({
      customer: req.user._id,
      entrepreneur: product.entrepreneur,
      product: productId,
      quantity: quantity || 1,
      totalPrice: product.price * (quantity || 1)
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    const { serviceId, details } = req.body;
    const service = await Service.findById(serviceId);
    
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const serviceRequest = new ServiceRequest({
      customer: req.user._id,
      entrepreneur: service.entrepreneur,
      service: serviceId,
      details
    });

    const createdRequest = await serviceRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Customer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('product');
    const requests = await ServiceRequest.find({ customer: req.user._id }).populate('service');
    res.json({ orders, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Entrepreneur
exports.getEntrepreneurOrders = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const orders = await Order.find({ entrepreneur: profile._id }).populate('product').populate('customer', 'name email').sort('-createdAt');
    const requests = await ServiceRequest.find({ entrepreneur: profile._id }).populate('service').populate('customer', 'name email').sort('-createdAt');
    res.json({ orders, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    if (!profile || order.entrepreneur.toString() !== profile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateServiceRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    const profile = await EntrepreneurProfile.findOne({ user: req.user._id });
    if (!profile || request.entrepreneur.toString() !== profile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
