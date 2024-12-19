// Assets
import styles from "@/app/register.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "@/app/globals.css";

export default function Register() {
    return (
        <div className={styles.assistantInteraction}>
            <div class="container">
        <header>
            <h1>TwisterAI</h1>
            <nav>
                <select>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
            </nav>
        </header>

        <main>
            <div className={styles.username} >
                <label for="username">Username:</label>
                <input type="text" required/>
            </div>

            <div className={styles.password} >
                <label for="password">Password:</label>
                <input type="text" required/>
            </div>
        </main>
        
    </div>

        </div>
    )
}