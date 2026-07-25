const express = require('express');
const router = express.Router();
const { createDispute, getDisputes, resolveDispute } = require('../controllers/disputeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createDispute);
router.get('/', protect, isAdmin, getDisputes);
router.put('/:id/resolve', protect, isAdmin, resolveDispute);

module.exports = router;
