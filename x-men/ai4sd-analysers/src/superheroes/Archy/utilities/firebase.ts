import * as admin from "firebase-admin";
import * as vscode from "vscode";

let firestore: admin.firestore.Firestore | null = null;

// Initialize Firebase Admin SDK
export function getFirestore(extensionUri: vscode.Uri): admin.firestore.Firestore {
    if (!firestore) {
        const serviceAccountPath = vscode.Uri.file(extensionUri.fsPath + "/superhero-02-04.json").fsPath;
        admin.initializeApp({
            credential: admin.credential.cert(require(serviceAccountPath)),
        });
        firestore = admin.firestore();
    }
    return firestore;
}

export async function fetchRecentRequests(firestore: admin.firestore.Firestore): Promise<{ id: string, mode: string }[]> {
    try {
        const snapshot = await firestore.collection("superhero-02-04")
            .orderBy("timestamp", "desc") 
            .limit(5) 
            .get();

            return snapshot.docs.map(doc => ({ id: doc.id, mode: doc.data().mode as string }));
        
        } catch (error) {
        console.error("Error fetching recent requests:", error);
        vscode.window.showErrorMessage("Failed to fetch recent requests from Firestore.");
        return []; 
    }
}

