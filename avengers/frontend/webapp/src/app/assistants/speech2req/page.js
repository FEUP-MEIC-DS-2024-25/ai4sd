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
    <div className="container-fluid vh-100 p-0">
      <div className="row flex-grow-1 vh-100 m-0">
        <div className="col-auto p-0 d-flex flex-column bg-dark">
          <AssistantPicker />
        </div>
        <div className="col-auto p-0 d-flex flex-column">
          <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
        </div>
        <div className="col p-0 overflow-auto vh-100 bg-white">
          <RequirementsAssistant />
        </div>
      </div>
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
