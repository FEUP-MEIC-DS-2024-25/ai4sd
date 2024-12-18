// Assets
import styles from "@/app/userHistory.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "@/app/globals.css";

export default function UserHistory() {
    return (
        <div className={styles.assistantInteraction}>
            <div class="container">
        <header>
            <h1>TwisterAI</h1>
            {/* esta opção nao devia estar no history */}
            <nav>
                <select>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
            </nav>
        </header>
        <section id="history">
            <h2>History:</h2>
            <ul>
                <li>
                <span class="date">2024/10/20</span>
                <span class="code">code3.py</span>
                <span class="test">test3.py</span>
                </li>
                <li>
                <span class="date">2024/10/20</span>
                <span class="code">code2.py</span>
                <span class="test">test2.py</span>
                </li>
                <li>
                <span class="date">2024/10/20</span>
                <span class="code">code1.py</span>
                <span class="test">test1.py</span>
                </li>
            </ul>
        </section>
    </div>

        </div>
    )
}