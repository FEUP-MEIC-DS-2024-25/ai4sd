import styles from "@/app/page.module.css";
import WireframeGenerator from './WireframeGenerator';

export default function Assistant() {
    return (
        <div className={styles.assistantInteraction}>
            <WireframeGenerator />
        </div>
    )
}