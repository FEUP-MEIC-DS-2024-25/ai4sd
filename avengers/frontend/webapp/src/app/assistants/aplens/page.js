"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import Assistant from "./components/assistant";

import React, {useEffect, useState, useCallback, useRef} from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth"; 
import { doc, collection, setDoc, getDocs } from "firebase/firestore"
import {v4 as uuidv4} from 'uuid';

export default function Interactor() {
    const name = "APlens";

    const reports = useRef([])
    const [user, setUser] = useState(null)
    const [activeView, setActiveView] = useState("Forms");
    //const [retrievedData] = useState(reports)

    /*
    const loadUserData = useCallback(async (uid) => {
        reports.current = [];

        const userCollectionRef = collection(db, "users", uid, "documentsCollection");
        const querySnapshot = await getDocs(userCollectionRef);

        querySnapshot.forEach((doc) => {
            reports.current.push(doc.data());
        });

    }, []);

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
            setUser(currentUser);
            loadUserData(currentUser.uid);
            } else {
            signInAnonymously(auth)
                .then((userCredential) => setUser(userCredential.user))
                .catch((error) => console.error("Authentication error:", error));
            }
        });

        return () => unsubscribe();
    }, [loadUserData]);
    */

    const saveData = async (jsonResponse) => {
        if (!user) return;
        let doc_uuid = uuidv4();

        const docRef = doc(db, "users", user.uid, "documentsCollection", doc_uuid);
        await setDoc(docRef, {
            retrievedData: jsonResponse,
        });
        await loadUserData(user.uid)
    };
    

    // Stubb info for demo purposes
    const retrievedData = useRef([{retrievedData: {name: "Stub", id: 1, timestamp: "teste", pattern: "MVC", percentage: "95", explanation: "Very nice, good programming here", improvements: [{Improve1: "This"}, {Improve2: "Then"}, {Improve3: "That"}], strenghts: [{Stregth1: "This"}, {Stregth2: "Then"}, {Stregth3: "That"}]}}])

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <Assistant name = {name} saveData = {saveData} activeView = {activeView} setActiveView = {setActiveView} retrievedData = {retrievedData} />
        </div>
    );
}