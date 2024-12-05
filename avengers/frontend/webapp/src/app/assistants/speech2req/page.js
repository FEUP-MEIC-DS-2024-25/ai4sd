import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import UploadAudio from './components/UploadAudio';
import DisplayTranscription from './components/DisplayTranscription';
import ShowSummary from './components/ShowSummary';
import DownloadSRS from './components/DownloadSRS';
import RecordLiveAudio from './components/RecordLiveAudio';

export default function Interactor() {
  //preparing mock data
  const assistName = "Speech2Req";
  const assistType = "req"; // change according to the assistant type (req, arch, refact, verif)
  const assistHistory = prepareMockHistory();
  return (
    <div className={styles.interactorLayout}>
        <AssistantPicker />
        <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
        <h1>AI Assistant for Requirements</h1>
        <UploadAudio />
        <RecordLiveAudio />
        <DisplayTranscription />
        <ShowSummary />
        <DownloadSRS />
    </div>
)
}

function prepareMockHistory() {
  const history = [];
  for (let i = 1; i <= 20; i++) {
      const chat = { text: `Chat ${i}`, link: "#" };
      history.push(chat);
  }
  return history;
}
