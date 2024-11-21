import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/app/page.module.css";
import AssistantLogo from './assistantLogo';

export default function AssistantPicker() {

    return (
        <div className={styles.assistantPicker}>
            <AssistantPickerItems />
        </div>


    )
}

function getAssistantList() {
    // ADD YOUR ASSISTANTS HERE
    const assistantList = [
        { name: "ai1", type: "refact", link: "#" },
        { name: "ai2", type: "req", link: "#" },
        { name: "req2test", type: "verif", link: "/assistants/req2test" },
        { name: "toopai", type: "verif", link: "/assistants/toopai" },
        { name: "ai5", type: "arch", link: "#" },
        { name: "ai6", type: "arch", link: "#" }
    ];
    return assistantList;
}

function AssistantPickerItems() {
    const items = getAssistantList();

    return (
        <ul className="nav flex-column mb-auto text-center">
            {items.map((item, index) => (
                <li className="nav-item" key={index}>
                    <AssistantLogo name={item.name} type={item.type} link={item.link} />
                </li>
            ))}
        </ul>
    );


}