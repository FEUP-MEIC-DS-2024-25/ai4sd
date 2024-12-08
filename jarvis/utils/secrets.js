import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { encryptData, decryptData } from "./encryption.js";
import { readFileContents } from "../jarvis-fetcher/utils.js";
import { GITHUB_APP_PRIVATE_KEY_PATH, PASSPHRASE, SERVICE_ACCOUNT_KEY_PATH } from "../consts.js";
import fs from "fs/promises";


initializeApp({
  credential: cert(SERVICE_ACCOUNT_KEY_PATH),
  databaseURL: "https://hero-alliance-feup-ds-24-25.firebaseio.com"
});

const db = getFirestore();

export async function createEncryptedDocument(passphrase) {
  try {
    const githubAppKey = await readFileContents(GITHUB_APP_PRIVATE_KEY_PATH);

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

export async function fetchAndDecryptDocument(passphrase) {
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

    await fs.writeFile(GITHUB_APP_PRIVATE_KEY_PATH, decryptedData.github_app_key);

    console.log("Decrypted files written to disk.");
  } catch (error) {
    console.error("Error fetching or decrypting document:", error);
  }
}

