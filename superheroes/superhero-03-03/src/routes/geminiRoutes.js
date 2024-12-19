const express = require('express');
const promptController = require('../controllers/geminiController');
const chatController = require('../controllers/chatController'); 

const router = express.Router();

// Define the route
router.post('/prompt', promptController.sendPrompt);

module.exports = router;
