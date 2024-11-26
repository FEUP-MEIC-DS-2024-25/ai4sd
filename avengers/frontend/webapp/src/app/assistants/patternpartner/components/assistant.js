import styles from "@/app/page.module.css";
import App from './app.js';

export default function Assistant() {
    return (
        <div className={styles.assistantInteraction}>
            <App />
        </div>
    )
}
