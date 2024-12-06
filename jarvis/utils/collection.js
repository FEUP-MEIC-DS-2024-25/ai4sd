import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS env var
  databaseURL: "https://hero-alliance-feup-ds-24-25.firebaseio.com"
});

const db = getFirestore();

async function createDocument() {
  try {
    const docRef = db.collection("jarvis").doc("secrets");
    await docRef.set({
      service_account: "test",
      github_app_key: "test",
    });
    console.log("Document created successfully in jarvis/secrets.");
  } catch (error) {
    console.error("Error creating document:", error);
  }
}

createDocument();
