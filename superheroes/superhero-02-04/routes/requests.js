var express = require('express');

const admin = require('firebase-admin');
var router = express.Router();
// Initialize Firebase Admin SDK
let firestore = null;

function getFirestore() {
  if (!firestore) {
    if (!admin.apps.length) {
      // In Cloud, this uses the default service account automatically
      admin.initializeApp();
    }
    firestore = admin.firestore();
  }
  return firestore;
}

// Route to fetch recent requests
router.get('/', async (req, res) => {
  try {
    const firestore = getFirestore(); // Initialize Firestore
    const snapshot = await firestore.collection("superhero-02-04")
      .orderBy("timestamp", "desc")
      .limit(5)
      .get();

    const recentRequests = snapshot.docs.map(doc => ({
      id: doc.id,
      mode: doc.data().mode
    }));

    res.json(recentRequests);
  } catch (error) {
    console.error("Error fetching recent requests:", error);
    res.status(500).json({ error: "Failed to fetch recent requests from Firestore." });
  }
});

// Route to fetch the recent request by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Get the request ID from the URL parameters

  try {
    // Retrieve the document from Firestore by its ID
    const docSnapshot = await firestore.collection("superhero-02-04").doc(id).get();

    if (!docSnapshot.exists) {
      return res.status(404).json({ error: "Request not found" }); // Handle if the request doesn't exist
    }

    const data = docSnapshot.data();
    const resultMarkdown = data?.resultMarkdown || "No content available for this request."; // Default if no markdown content is found

    res.json({ resultMarkdown }); // Send the document's resultMarkdown as a response
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch the request" }); // Handle any server error
  }
});

// POST route to save markdown data
router.post('/save-markdown', async (req, res) => {
  const { resultMarkdown, mode } = req.body;

  // Validate the request body to ensure it contains the necessary data
  if (!resultMarkdown || !mode) {
      return res.status(400).send("Missing required data (resultMarkdown or mode).");
  }

  try {
      // Create a new document in the "superhero-02-04" collection
      const docRef = firestore.collection("superhero-02-04").doc();  // Creates a new document with a random ID

      // Save the resultMarkdown and mode to Firestore
      await docRef.set({
          mode: mode,
          resultMarkdown: resultMarkdown,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Respond with success
      res.status(200).send({ message: 'Markdown saved to Firestore!' });
  } catch (error) {
      // Handle any errors that occur while saving to Firestore
      console.error("Error saving to Firestore:", error);
      res.status(500).send("Failed to save the markdown to Firestore.");
  }
});


module.exports = router;