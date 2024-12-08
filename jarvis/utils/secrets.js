import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs/promises";

// Initialize Firebase Admin SDK using service account JSON
const serviceAccountPath = "jarvis-key-02-02.json";

initializeApp({
  credential: cert(serviceAccountPath), // Load credentials from JSON
  databaseURL: "https://hero-alliance-feup-ds-24-25.firebaseio.com"
});

const db = getFirestore();

async function createEncryptedDocument(passphrase) {
  try {
    // Paths to files
    const githubAppKeyPath = "jarvis-fetcher/keys/github_app_private.pem";

    // Read file contents
    const githubAppKey = await readFileContents(githubAppKeyPath);

    // Sensitive data to encrypt
    const sensitiveData = {
      github_app_key: githubAppKey,
    };

    // Encrypt the sensitive data
    const { iv, salt, encryptedData } = encryptData(sensitiveData, passphrase);

    // Write the encrypted data to Firestore
    const docRef = db.collection("jarvis").doc("secrets");
    await docRef.set({
      iv, // Store the IV for decryption
      salt, // Store the salt for key derivation
      encrypted_message: encryptedData,
      timestamp: new Date().toISOString(),
    });

    console.log("Encrypted document created successfully in jarvis/secrets.");
  } catch (error) {
    console.error("Error creating document:", error);
  }
}

async function fetchAndDecryptDocument(passphrase) {
  try {
    const docRef = db.collection("jarvis").doc("secrets");
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log("No such document!");
      return;
    }

    const { iv, salt, encrypted_message } = doc.data();

    // Decrypt the message
    const decryptedData = decryptData(encrypted_message, iv, salt, passphrase);

    console.log("Decrypted data:", decryptedData);

    // Optionally, write the decrypted data back to files
    await fs.writeFile('./decrypted_github_app_key.txt', decryptedData.github_app_key);

    console.log("Decrypted files written to disk.");
  } catch (error) {
    console.error("Error fetching or decrypting document:", error);
  }
}

(async () => {
  const passphrase = "jarvis-secrets";
  //await createEncryptedDocument(passphrase);
  await fetchAndDecryptDocument(passphrase);
})();
