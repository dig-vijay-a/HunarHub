const express = require('express');
const router = express.Router();
const { createReview, getEntrepreneurReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/entrepreneur/:id', getEntrepreneurReviews);

module.exports = router;
