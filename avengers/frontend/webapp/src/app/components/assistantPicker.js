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
    let ai1 = { name: "CAVE", type: "arch", link: "/assistants/cave" };
    let ai2 = { name: "2Test", type: "req", link: "/assistants/req2test" };
    let ai3 = { name: "TOOPAI", type: "verif", link: "/assistants/toopai" };
    let ai4 = { name: "UTA", type: "verif", link: "/assistants/uta" };
    let ai5 = { name: "ai5", type: "arch", link: "#" };
    let ai7 = { name: "RRBuddy", type: "req", link: "/assistants/rrbuddy" };
    let ai6 = { name: "FeatureCraft", type: "req", link: "/assistants/featurecraft" };
    let ai8 = { name: "APLens", type: "req", link: "/assistants/aplens"};
    let ai9 = { name: "Req2Speech", type: "req", link: "/assistants/req2speech" };
    let ai10 = { name: "ReqToStory", type: "req", link: "/assistants/reqtostory" };
    let ai11 = { name: "Diagram Detective", type: "req", link: "/assistants/diagramDetective" };
    let ai12 = { name: "Warden AI", type: "refact", link: "/assistants/wardenAI" };
    let ai13 = { name: "TeXes", type:"verif", link: "/assistants/texes"};
    let ai14 = { name: "DiagramIt", type: "req", link: "/assistants/diagramit" };
    let ai15 = { name: "SPARK", type: "req", link: "/assistants/spark" };
    let ai16 = { name: "RefactorRocket", type:"verif", link: "/assistants/superhero-01-01" };
    let ai17 = { name: "BANANAI", type: "req", link: "/assistants/bananai" };
    let ai18 = { name: "TwisterAI", type: "verif", link: "/assistants/twisterAI" };
  
    return [ai1, ai2, ai3, ai4, ai5, ai6, ai7, ai8, ai9, ai10, ai11, ai12, ai13, ai14, ai15, ai16, ai17,ai18];
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
