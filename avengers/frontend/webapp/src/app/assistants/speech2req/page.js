import UploadAudio from './components/UploadAudio';
import DisplayTranscription from './components/DisplayTranscription';
import ShowSummary from './components/ShowSummary';
import DownloadSRS from './components/DownloadSRS';

const Assistant = () => {
  return (
    <div>
      <h1>AI Assistant for Requirements</h1>
      <DisplayTranscription />
      <ShowSummary />
      <DownloadSRS />
    </div>
  );
};

export default Assistant;
