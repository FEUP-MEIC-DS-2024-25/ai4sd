const express = require('express');
const chatController = require('../controllers/chatController'); 

const router = express.Router();

//Chat API
router.post('/', chatController.sendChat);
router.get('/:id', chatController.getChat);


module.exports = router;
