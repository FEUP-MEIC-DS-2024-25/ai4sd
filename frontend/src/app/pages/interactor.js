import styles from "../page.module.css";
import Image from "next/image";

import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';

import logo from "../pictures/logo.svg";
import AssistantPicker from "../components/assistantPicker";

export default function Home() {
    return(
        <div>
            <AssistantPicker/>
            <h1>Interactor page!</h1>

        </div>
    )
}