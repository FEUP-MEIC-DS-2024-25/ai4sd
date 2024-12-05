import UploadAudio from './components/UploadAudio';
import DisplayTranscription from './components/DisplayTranscription';
import ShowSummary from './components/ShowSummary';
import DownloadSRS from './components/DownloadSRS';
import RecordLiveAudio from './components/RecordLiveAudio';

const Assistant = () => {
  return (
    <div>
      <h1>AI Assistant for Requirements</h1>
      <DisplayTranscription />
      <ShowSummary />
      <DownloadSRS />
      <UploadAudio />
      <RecordLiveAudio />
    </div>
  );
};

export default Assistant;
