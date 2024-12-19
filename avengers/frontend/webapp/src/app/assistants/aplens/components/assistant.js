import "./App.css";

import React, {useEffect, useState, useCallback, useRef} from "react";
import FormsComponent from "./deeper_components/main/formsComponent";
import Results from "./pages/results.jsx";
import SearchComponent from "./pages/searchComponent.jsx";
import { AnalysisProvider } from "./context/AnalysisContext";
import { SaveDataProvider } from "./context/SaveDataContext";
import gradientImage from './assets/gradient.png';

export default function Assistant({ name, saveData, activeView, setActiveView, retrievedData, clientId}) {

    return (
        <div className="bg-white text-[var(--bs-body-color)] flex-1 flex-grow flex-shrink basis-0 p-0">
            <div className="absolute inset-0 pointer-events-none h-auto overflow-hidden z-0">
                <img
                src={gradientImage.src}
                alt="Decorative Gradient"
                className="absolute top-40 left-96 overflow-hidden"
                />
            </div>
            <header className="bg-zinc-800 text-white flex justify-end">
                <h1 className="my-2 mr-10 text-4xl font-extrabold font-rubik">{name}</h1>
            </header>
            <main className="flex h-screen relative z-10">
                <AnalysisProvider>
                    <SaveDataProvider saveData={saveData}>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeView === "Forms" 
                            ? <FormsComponent setActiveView={setActiveView} clientId={clientId}/>
                            : activeView === "Reports" 
                            ? <Results /> 
                            : null}
                        </div>
                        <div className="w-1/4 p-6">
                            <SearchComponent activeView={activeView} setActiveView={setActiveView} reports={retrievedData} clientId={clientId} />
                        </div>
                    </SaveDataProvider>
                </AnalysisProvider>
            </main>
        </div>
    );
}