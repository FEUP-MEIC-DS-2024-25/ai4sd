import styles from "@/app/page.module.css";
import {OptiReq} from './main';

export default function Assistant() {
    return (
        <div className={styles.assistantInteraction}>
            <OptiReq />
        </div>
    )
}