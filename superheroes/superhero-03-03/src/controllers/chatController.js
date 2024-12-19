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
