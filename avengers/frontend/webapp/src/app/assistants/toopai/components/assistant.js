import styles from "@/app/page.module.css";
import ChatArea from './Chat';

export default function Assistant() {
    return (
        <div className={styles.assistantInteraction}>
            <ChatArea/>
        </div>
    )
}