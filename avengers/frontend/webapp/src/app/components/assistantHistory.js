import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/app/page.module.css";
import { getAccentColor } from "@/app/utils/utils";
import AssistantMenu from './assistantMenu';

export default function AssistantHistory({ name, type, interactions }) {
    /*mock buttons*/
    const icons = prepareMockButtons();

    return (
        <div className={styles.assistantHistory}>
            <HistoryHeader name={name} type={type} />
            <HistoryList interactions={interactions} />
            <AssistantMenu buttons={icons} />
        </div>

    )
}

function HistoryHeader({ name, type }) {
    const bg = getAccentColor(type);

    return (
        <div style={{ backgroundColor: bg, padding: 1.2 + "em" }}>
            <h1>{name}</h1>
            <h5>Interaction History</h5>
        </div>
    )
}

function HistoryList({ interactions }) {

    return (
        <div className={styles.historyList}>
            <ul className="nav flex-column mb-auto text-left gap-3 px-3 mt-3">
                {interactions.map((interaction, index) => (
                    <a href={interaction.link} style={{ textDecoration: "none" }} key={index}>
                        <li className="nav-item w-100" key={index} >
                            <HistoryItem text={interaction.text} />
                        </li>
                    </a>
                ))}
            </ul>
        </div>
    )
}

function HistoryItem({ text }) {
    return (
        <div className={styles.historyItem}>
            {text}
        </div>
    )
}

function prepareMockButtons(){
    let b1 = {name: "New Interaction", icon:"plus", link:"#"}
    let b2 = {name: "Download Report", icon: "download", link: "#"}
    let b3 = {name: "Button3", icon: "border", link: "#"}
    let b4 = {name: "Settings", icon: "gear", link: "#"}

    return [b1, b2, b3, b4]
}