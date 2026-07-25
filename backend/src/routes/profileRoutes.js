const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect, isEntrepreneur } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, isEntrepreneur, getProfile)
  .put(protect, isEntrepreneur, updateProfile);

module.exports = router;
