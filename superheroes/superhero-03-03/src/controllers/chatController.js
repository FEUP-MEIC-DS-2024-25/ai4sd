const admin = require("firebase-admin");

require('dotenv').config();

console.log("Project ID: ", process.env.FIREBASE_PROJ_ID);
console.log("Client Email: ", process.env.FIREBASE_CLIENT_EMAIL);
console.log("Private Key: ", process.env.FIREBASE_PRIVATE_K);

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJ_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_K.replace(/\\n/g, '\n'),
    }),
});

// Initialize Firestore database
const db = admin.firestore();

exports.getChat = async (req, res) => {

    res.send('getChat');
}

exports.sendChat = async (req, res) => {
    res.send('sendChat');
}

exports.getMessagesByChatId = async (req, res) => {
    try {
        const { chatId } = req.params; // Extract chatId from the route parameter

        if (!chatId) {
            return res.status(400).json({ message: "chatId is required" });
        }

        // Query messages in the specified chatId
        const messagesSnapshot = await db
            .collection('superhero-03-03') // Main collection
            .doc(chatId) // Specific chat document
            .collection('messages') // Subcollection for messages
            .orderBy('timestamp', 'asc') // Order by timestamp ascending
            .get();

        // Map Firestore documents to a response array
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id, // Include document ID
            ...doc.data() // Spread the document data
        }));

        res.status(200).json(messages); // Send the messages as a response
    } catch (error) {
        console.error("Error retrieving messages:", error.message);
        res.status(500).json({ message: "Error retrieving messages", error: error.message });
    }
};

module.exports = { admin, db };