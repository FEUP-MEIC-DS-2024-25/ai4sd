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
    //creating mock data
    let ai1 = { name: "ai1", type: "refact", link: "#" };
    let ai2 = { name: "Req2Test", type: "req", link: "/assistants/req2test" };
    let ai3 = { name: "ai3", type: "verif", link: "#" };
    let ai4 = { name: "ai4", type: "req", link: "#" };
    let ai5 = { name: "ai5", type: "arch", link: "#" };
    let ai6 = { name: "ai6", type: "arch", link: "#" };

    return [ai1, ai2, ai3, ai4, ai5, ai6]
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