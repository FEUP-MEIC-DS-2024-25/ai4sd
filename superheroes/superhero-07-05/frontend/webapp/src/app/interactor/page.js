import styles from "@/app/page.module.css";
import Image from "next/image";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import AssistantInteraction from "@/app/components/AssistantInteraction";
import UserHistory from "../components/userHistory";


export default function Interactor() {
    //preparing mock data
    const assistName = "ACME Pal";
    const assistType = "req";
    const assistHistory = prepareMockHistory();


    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            <AssistantInteraction />
            {/* <UserHistory /> */}
        </div>
    )
}

function prepareMockHistory(){
    let h1 = {text: "Lorem ipsum odor amet, consectetuer adipiscing elit ipsum", link: "#"}
    let h2 = {text: "Nisi dis faucibus aptent sagittis montes vivamus cubilia.", link: "#"}
    let h3 = {text: "Feugiat habitant magnis cubilia tempus egestas ornare quis mattis.", link: "#"}
    let h4 = {text: "Luctus praesent dapibus natoque hac euismod risus eget suspendisse", link: "#"}
    let h5 = {text: "Varius urna suscipit blandit aenean blandit odio efficitur sit", link: "#"}
    let h6 = {text: "Curabitur dictum gravida dui potenti mattis fames", link: "#"}
    


    return [h1, h2, h3, h4, h5, h6, h1, h2, h3, h4, h5, h6, h1, h2, h3, h4, h5, h6, h1, h2, h3,h4, h5, h6]
}
