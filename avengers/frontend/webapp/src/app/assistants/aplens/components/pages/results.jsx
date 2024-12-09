import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import IntroductionComponent from '../deeper_components/results/introductionComp';
import PercentageBarComponent from '../deeper_components/results/percentBarComp';
import FeedbackComponent from '../deeper_components/results/feedbackComp';

const Results = () => {

  const {analysisResults} = useAnalysis();

  if(!analysisResults){ return null }

  console.log(analysisResults)

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-screen p-6 bg-gray-50">
      
      <IntroductionComponent pattern={analysisResults.pattern} explanation={analysisResults.explanation}/>

      <PercentageBarComponent results={analysisResults} />

      <FeedbackComponent feedback={analysisResults.improvements} improvements={true}/>

      <FeedbackComponent feedback={analysisResults.strenghts} improvements={false}/>

    </div>
  );
};

export default Results;
