"use client";

import React, { useState } from "react";
import UploadAudio from "./UploadAudio";
import RecordLiveAudio from "./RecordLiveAudio";
import DisplayTranscription from "./DisplayTranscription";
import ShowSummary from "./ShowSummary";
import DownloadSRS from "./DownloadSRS";

const RequirementsAssistant = () => {
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");

  return (
    <div className="p-4 bg-light rounded shadow hv-100 d-flex flex-column">
      <h1 className="text-center text-primary mb-4">
        Speech2Req
      </h1>
      <div className="d-flex flex-column gap-3 hv-100">
        <UploadAudio setTranscription={setTranscription} setSummary={setSummary} />
        <RecordLiveAudio setTranscription={setTranscription} setSummary={setSummary} />
        <DisplayTranscription transcription={transcription} />
        <ShowSummary summary={summary} />
        <DownloadSRS transcription={transcription} summary={summary} />
      </div>
    </div>
  );
};

export default RequirementsAssistant;