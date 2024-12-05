import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import RequirementsAssistant from "./components/RequirementsAssistant";

export default function Interactor() {
  // Prepare mock data
  const assistName = "Speech2Req";
  const assistType = "req"; // Change according to the assistant type (req, arch, refact, verif)
  const assistHistory = prepareMockHistory();

  return (
    <div className={styles.interactorLayout}>
      <AssistantPicker />
      <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
      <RequirementsAssistant />
    </div>
  );
}

function prepareMockHistory() {
  const history = [];
  for (let i = 1; i <= 20; i++) {
    const chat = { text: `Chat ${i}`, link: "#" };
    history.push(chat);
  }
  return history;
}
