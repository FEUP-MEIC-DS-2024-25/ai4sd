import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import Footer from "@/app/components/footer";
import NavBar from "@/app/components/navbar";
import { ChatBubble } from "./AI_assistant/components/chat/chat-bubble";



export default function AI_assistant() {

    const assistName = "AI_assitant"
    const assitType = "verif"

    return (
        <main className={styles.main} style={{ color: "none" }}>
            <NavBar />
            <ChatBubble />
            <Footer />
        </main>
    );

}