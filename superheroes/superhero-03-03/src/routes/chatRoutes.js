const express = require('express');
const chatController = require('../controllers/chatController'); 

const router = express.Router();

//Chat API
router.get('/', chatController.getChats);
router.get('/:id', chatController.getChat);
router.post('/:id', chatController.sendChat);


module.exports = router;
