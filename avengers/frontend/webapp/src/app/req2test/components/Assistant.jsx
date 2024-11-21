import styles from "@/app/page.module.css";
import { Chatbot } from './Chat';

export default function Req2Test() {
    return (
        <div className={styles.assistantInteraction}>
            <Chatbot />
        </div>
    )
}