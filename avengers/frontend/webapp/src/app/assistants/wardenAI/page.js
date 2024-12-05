"use client";

// Assets
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "@/app/globals.css";

// Components
import NavBar from "@/app/components/navbar";
import UploadFile from "@/app/assistants/wardenAI/components/uploadFile";
import Footer from "@/app/components/footer"

export default function WardenAI() {
    return (
        <main className={styles.main} style={{ color: "none" }}>
            <NavBar />
            <UploadFile />
            <Footer />
        </main>
    );
}