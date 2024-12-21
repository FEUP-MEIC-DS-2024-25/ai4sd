const axios = require('axios'); 

const admin = require("firebase-admin");

require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
});

const db = admin.firestore();

exports.getChatInteraction = async (chatId) => {
    try{
        // Query messages in the specified chatId
        const messagesSnapshot = await db
        .collection('superhero-03-03') // Main collection
        .doc(chatId) // Specific chat document
        .collection('messages') // Subcollection of messages
        .orderBy('timestamp', 'asc') // Order by timestamp ascending
        .get();

        // Check if there are any messages
        if (messagesSnapshot.empty) {
            return [];
        }

        // Extract messages from snapshot
        const messages = messagesSnapshot.docs.map((doc) => doc.data());	
        
        return messages
    } catch (error) {
        console.log(error)
        throw new Error('Error getting chat interaction: ' + error.message);
    }
}; 

exports.getChatInteractions = async () => {

    try {

        // Query all chat documents
        const chatSnapshot = await db
            .collection('superhero-03-03').limit(20)
            .get();

        // Check if there are any chat documents
        if (chatSnapshot.empty) {
            return [];
        }

        // Extract chat documents from snapshot
        const chats = chatSnapshot.docs.map((doc) => doc.id);

        return chats;
        
    } catch (error) {
        throw new Error('Error getting chat interactions: ' + error.message);
    }

};

exports.postChatInteraction = async (chatId, msg, reply) => {
    try {
        await db.collection('superhero-03-03')
            .doc(chatId)
            .set({}, { merge: true });

        await db.collection('superhero-03-03')
            .doc(chatId)
            .collection('messages')
            .add({
                msg: msg,
                reply: reply,
                timestamp: admin.firestore.Timestamp.now()
        });

        return { success: true };
    } catch (error) {
        throw new Error('Error posting chat interaction: ' + error.message);
    }
};