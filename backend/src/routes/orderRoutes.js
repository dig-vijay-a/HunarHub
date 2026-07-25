const express = require('express');
const router = express.Router();
const { createOrder, createServiceRequest, getMyOrders, getEntrepreneurOrders, updateOrderStatus, updateServiceRequestStatus } = require('../controllers/orderController');
const { protect, isEntrepreneur } = require('../middleware/authMiddleware');

router.post('/products', protect, createOrder);
router.post('/services', protect, createServiceRequest);
router.get('/myorders', protect, getMyOrders);
router.get('/entrepreneur', protect, isEntrepreneur, getEntrepreneurOrders);
router.put('/:id/status', protect, isEntrepreneur, updateOrderStatus);
router.put('/requests/:id/status', protect, isEntrepreneur, updateServiceRequestStatus);

module.exports = router;
