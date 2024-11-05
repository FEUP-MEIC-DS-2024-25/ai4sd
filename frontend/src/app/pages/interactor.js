import styles from "../page.module.css";
import Image from "next/image";

import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';

import logo from "../pictures/logo.svg";
import AssistantPicker from "../components/assistantPicker";
import AssistantHistory from "../components/assistantHistory";
import AssistantInteraction from "../components/AssistantInteraction";

export default function Home() {
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory />
            <AssistantInteraction />
        </div>
    )
}