const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const auth = require('../middleware/auth');

// @route   POST /api/predictions
router.post('/',auth, predictionController.getPrediction);

// @route   GET /api/predictions/history
router.get('/history', auth, predictionController.getHistory);

module.exports = router;
