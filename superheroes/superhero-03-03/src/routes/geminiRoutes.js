const express = require('express');
const promptController = require('../controllers/geminiController');

const router = express.Router();

// Define the route
router.post('/prompt', promptController.sendPrompt);

module.exports = router;
