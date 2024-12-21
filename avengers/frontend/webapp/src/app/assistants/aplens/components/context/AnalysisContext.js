import React, { createContext, useState, useContext } from 'react';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState(null);

  return (
    <AnalysisContext.Provider value={{ analysisResults, setAnalysisResults }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);

