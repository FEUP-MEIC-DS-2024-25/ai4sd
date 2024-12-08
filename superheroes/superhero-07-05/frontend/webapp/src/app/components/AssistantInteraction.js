import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/app/twister_ai.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Pictures
import Image from 'next/image';
import user from "@/app/pictures/user.png";
import twister_ai from "@/app/pictures/twister_ai.png";

export default function AssistantInteraction() {
    return (
        <div className={styles.twister_ai}>
                <header>
                    <div>
                        <a><Image src={twister_ai} alt="Logo TwisterAl" width={"70"}/></a>
                        <h1>TwisterAI</h1>
                    </div>
                    <div>
                        <a><Image src={user} alt="User" width={"70"}/></a>
                        <nav>
                            <label>Select the language:</label>
                            <select className={styles.language}>
                                <option value="java">Java</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                            </select>
                        </nav>
                    </div>
                    
                </header>
                <main>
                    <section className={styles.upload_section}>
                        <div>
                            <label class="upload" for="code-file">Upload code file<i class="fa-solid fa-paperclip"></i></label>{/* código para trocar icon */}
                            <input className="upload_btn" type="file"/>
                        </div>
                        <div>
                            <label class="upload" for="tests-file">Upload tests file<i class="fa-solid fa-paperclip"></i></label>{/* código para trocar icon */}
                            <input className="upload_btn" type="file"/>
                        </div>
                    </section>

                    <section className={styles.context_section} >
                        <label for="context">Give me some context about your code:</label>
                        <textarea id="context" placeholder="Insert here the context."></textarea>
                    </section>

                    <section className={styles.action_section}>
                        <button>Generate mutant tests</button>
                        <button>Download mutant tests</button> {/* acrescentar icon */}
                    </section>
                </main>
            
        </div>
    )
}