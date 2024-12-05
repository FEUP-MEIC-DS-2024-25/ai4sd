import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import IntroductionComponent from '../deeper_components/results/introductionComp';
import PercentageBarComponent from '../deeper_components/results/percentBarComp';
import FeedbackComponent from '../deeper_components/results/feedbackComp';
import DownloadComponent from '../deeper_components/results/downloadComp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

const Results = () => {

  const {analysisResults} = useAnalysis();

  if(!analysisResults){ return null }

  return (
    <div className="flex flex-col">
      <div className="w-full p-2 pl-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl pr-2">
             <ArrowBackIcon/>
          </span>
          <h2 className="text-2xl font-bold">{analysisResults.name}</h2>
          <span className="text-xl pl-2">
            <EditIcon/>
          </span>
        </div>
        <DownloadComponent results={analysisResults} />
      </div>


      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-auto">
        <IntroductionComponent results={analysisResults} />
        <PercentageBarComponent results={analysisResults} />
        <FeedbackComponent feedback={analysisResults.improvements} improvements={true} />
        <FeedbackComponent feedback={analysisResults.strenghts} improvements={false} />
      </div>
    </div>
  );
};

export default Results;
