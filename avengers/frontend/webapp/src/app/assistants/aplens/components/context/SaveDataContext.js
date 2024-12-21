import React, { createContext, useContext } from "react";

const SaveDataContext = createContext();

export const SaveDataProvider = ({ children, saveData }) => {
  return (
    <SaveDataContext.Provider value={saveData}>
      {children}
    </SaveDataContext.Provider>
  );
};

export const useSaveData = () => {
  const context = useContext(SaveDataContext);
  if (!context) {
    throw new Error("useSaveData must be used within a SaveDataProvider");
  }
  return context;
};
