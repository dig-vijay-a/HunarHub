const express = require('express');
const router = express.Router();
const { getChatHistory, getChatContacts } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/contacts', protect, getChatContacts);
router.get('/:userId', protect, getChatHistory);

module.exports = router;
