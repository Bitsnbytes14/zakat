const express = require('express');
const { calculateZakat } = require('../controllers/zakatController');

const router = express.Router();

// POST /calculate-zakat
router.post('/calculate-zakat', calculateZakat);

module.exports = router;
