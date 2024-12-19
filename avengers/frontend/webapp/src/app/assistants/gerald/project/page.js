import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';


import ProjectPicker from "../components/projectPicker";

export default function Projects() {
    return(
        <div>
            <ProjectPicker></ProjectPicker>
        </div>
    )
}
