import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import Warden from "./components/warden";

export default function Interactor() {
    //preparing mock data
    const assistName = "Warden AI";
    const assistType = "refact"; // change according to the assistant type (req, arch, refact, verif)
    return (
        <div className={styles.interactorLayout + " bg-light"}>
            <AssistantPicker />
            <Warden />
        </div>
    )
}

