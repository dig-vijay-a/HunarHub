const express = require('express');
const router = express.Router();
const { getProducts, getServices, createProduct, createService } = require('../controllers/marketplaceController');
const { protect, isEntrepreneur } = require('../middleware/authMiddleware');

router.route('/products')
  .get(getProducts)
  .post(protect, isEntrepreneur, createProduct);

router.route('/services')
  .get(getServices)
  .post(protect, isEntrepreneur, createService);

module.exports = router;
