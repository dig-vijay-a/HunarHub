const express = require('express');
const router = express.Router();
const { getStats, getPendingEntrepreneurs, verifyEntrepreneur, removeEntrepreneur } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protect, isAdmin, getStats);
router.get('/entrepreneurs', protect, isAdmin, getPendingEntrepreneurs);
router.put('/entrepreneurs/:id/verify', protect, isAdmin, verifyEntrepreneur);
router.delete('/entrepreneurs/:id', protect, isAdmin, removeEntrepreneur);

module.exports = router;
