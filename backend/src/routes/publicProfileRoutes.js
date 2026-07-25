const express = require('express');
const router = express.Router();
const { getEntrepreneurById } = require('../controllers/publicProfileController');

router.get('/:id', getEntrepreneurById);

module.exports = router;
