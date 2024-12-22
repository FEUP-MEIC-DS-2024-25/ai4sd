const chatService = require('../services/chatService');

exports.getChat = async (req, res) => {
    const chatId = req.params.id;

    try {
        const chat = await chatService.getChatInteraction(chatId);
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).send('Error getting chat interaction');
    }
}

exports.getChats = async (req, res) => {
    try {
        const chats = await chatService.getChatInteractions();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).send('Error getting chat interactions');
    }
}

exports.sendChat = async (req, res) => {
    const chatId = req.params.id;
    const msg = req.body.msg;
    const reply = req.body.reply;

    try {
        const response  = await chatService.postChatInteraction(chatId, msg, reply);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).send('Error posting chat interaction');
    }
};