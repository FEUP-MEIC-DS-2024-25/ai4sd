import styles from "@/app/page.module.css";
import "./gerald.css";
export default function Assistant() {
    return (
        <div className={`${styles.assistantInteraction} assistantInteraction`}>
            <h1 className="">gerald.</h1>
            <p className="">not your average assistant</p>
            <div className="input">
                <input type="text"></input>
            </div>
        </div>
    )
}