import 'bootstrap/dist/css/bootstrap.css';
import styles from "../page.module.css";
import { getAccentColor } from "../utils/utils";

export default function AssistantHistory({ name, type, interactions }) {

    return (
        <div className={styles.assistantHistory}>
            <HistoryHeader name={name} type={type} />
            <HistoryList interactions={interactions}  />
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
        <ul className="nav flex-column mb-auto text-left gap-3 px-3 mt-3">
            {interactions.map((interaction, index) => (
                <a href={interaction.link} style={{textDecoration:"none"}}>
                <li className="nav-item w-100" key={index} >
                    <HistoryItem text={interaction.text} />
                </li>
                </a>
            ))}
        </ul>
    )
}

function HistoryItem({ text }) {
    return (
        <div className={styles.historyItem}>
            {text}
        </div>
    )
}