import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import Assistant from "./components/assistant";

export default function Interactor() {
    //preparing mock data
    const assistName = "TwisterAI";
    const assistType = "verif"; // change according to the assistant type (req, arch, refact, verif)/
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <Assistant />
        </div>
    )
}