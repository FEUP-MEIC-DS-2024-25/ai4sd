import styles from "@/app/page.module.css";
import ChatPage from "./ChatPage";
export default function Assistant() {
    return (
        <div className={styles.assistantInteraction}>
            <ChatPage />
        </div>
    )
}