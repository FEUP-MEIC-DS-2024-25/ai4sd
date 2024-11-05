import 'bootstrap/dist/css/bootstrap.css';
import styles from "../page.module.css";
import { getAccentColor } from "../utils/utils";

export default function AssistantHistory({ name, type, interactions }) {

    return (
        <div className={styles.assistantHistory}>
            <HistoryHeader name={name} type={type} />
            <HistoryList interactions={interactions} />
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
        <ul className="nav flex-column mb-auto text-left gap-2 px-3">
            {interactions.map((interaction, index) => (
                <li className="nav-item" key={index} >
                    <HistoryItem text={interaction.text} link={interaction.link}/>
                </li>
            ))}
        </ul>
    )
}

function HistoryItem({ text, link }) {
    return (
        <div className={styles.historyItem} href={link}>
            {text}
        </div>
    )
}