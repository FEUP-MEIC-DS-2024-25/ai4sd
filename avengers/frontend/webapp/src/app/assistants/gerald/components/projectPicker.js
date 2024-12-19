import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./gerald.css";
import '@/app/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function ProjectPicker() {
    return(
        <div className={`${styles.assistantInteraction} assistantInteraction `}>
            <header>
                <h2 className="logo"> Gerald AI </h2>
                <a className="aboutus" href="">
                    <h2>About us</h2>
                </a>
            </header>
            <div className="project">
                <a href="chat">
                    <div className="card">  
                        <h2>This is a project name</h2>
                        <p>This is a project description which has more info than the title</p>
                    </div>
                </a>
                <a href="">
                    <div className="card">  
                        <h2>This is a project name</h2>
                        <p>This is a project description which has more info than the title</p>
                    </div>
                </a>
                <a href="">
                    <div className="card">  
                        <h2>This is a project name</h2>
                        <p>This is a project description which has more info than the title</p>
                    </div>
                </a>
                <a href="">
                    <div className="card">  
                        <h2>This is a project name</h2>
                        <p>This is a project description which has more info than the title</p>
                    </div>
                </a>
                <a href="">
                    <div className="card">  
                        <h2>This is a project name</h2>
                        <p>This is a project description which has more info than the title</p>
                    </div>
                </a>
                <a href="">
                    <div className="card new">  
                        <i className="fas fa-circle-plus"></i>
                    </div>
                </a>
            </div>

        </div>
    )
}
