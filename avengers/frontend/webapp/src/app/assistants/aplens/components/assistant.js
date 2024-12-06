import styles from "@/app/page.module.css";

import React, {useEffect, useState, useCallback, useRef} from "react";
import FormsComponent from "./deeper_components/main/formsComponent";
import Results from "./pages/results.jsx";
import SearchComponent from "./pages/searchComponent.jsx";
import { AnalysisProvider } from "./context/AnalysisContext";
import { SaveDataProvider } from "./context/SaveDataContext";

export default function Assistant({ name, saveData, activeView, setActiveView, retrievedData}) {
    return (
        <div className="bg-white text-[var(--bs-body-color)] flex-1 flex-grow flex-shrink basis-0 p-0">
            <header className="bg-zinc-800 text-white flex justify-end">
                <h1 className="my-2 mr-10 text-4xl font-extrabold font-rubik">{name}</h1>
            </header>
            <main className="flex h-screen">
                <AnalysisProvider>
                    <SaveDataProvider saveData={saveData}>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeView === "Forms" 
                            ? <FormsComponent setActiveView={setActiveView} />
                            : activeView === "Reports" 
                            ? <Results /> 
                            : null}
                        </div>
                        <div className="w-1/4 p-6">
                            <SearchComponent activeView={activeView} setActiveView={setActiveView} reports={retrievedData} />
                        </div>
                    </SaveDataProvider>
                </AnalysisProvider>
            </main>
        </div>
    );
}