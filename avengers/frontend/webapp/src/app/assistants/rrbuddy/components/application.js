"use client"

import React, { useState, useEffect } from "react";
import Filters from "./filters";
import InputSubmission from "./inputSubmission";
import Loading from "./loading";
import DownloadOutput from "./downloadOutput";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";
import { Button } from "@/app/components/ui/button";

export default function Application({setHistoryData}) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [downloadFilename, setDownloadFilename] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [feedbackInfo, setFeedbackInfo] = useState("");
    const [outputType, setOutputType] = useState("pdf");
    const [outputLanguage, setOutputLanguage] = useState("english");


    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const deleteFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const normalizeText = (file) => {
        const [name, extension] = file.name.split(".");
        const shortName = name.length > 15 ? name.substring(0, 15) : name;
        return `${shortName}.${extension}`;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFiles.length) return;
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));
        formData.append("additionalInfo", additionalInfo);
        formData.append("outputType", outputType);
        formData.append("outputLanguage", outputLanguage);

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/process", {
           // const response = await fetch("https://superhero-04-01-150699885662.europe-west1.run.app/api/process", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            let filename;
            switch (blob.type) {
                case "application/pdf":
                    filename = "report.pdf";
                    break;
                case "text/plain; charset=utf-8":
                    filename = "report.txt";
                    break;
                default:
                    console.error("Unknown file type:", blob.type);
                    filename = "report";
            }
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setDownloadFilename(filename);
        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/history");
            if (!response.ok) {
                throw new Error(`Error fetching history: ${response.statusText}`);
            }
            const data = await response.json();
            const formattedHistory = data.history.map(entry => ({
                text: entry.title || entry.file_name || "Untitled",
                link: entry.response_file_url || "#",
            }));
            setHistoryData(formattedHistory);
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistoryData([]);
        }
    };

    const resetHistory = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/api/reset", {
            //const response = await fetch("https://superhero-04-01-150699885662.europe-west1.run.app/api/reset", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setFeedbackInfo("History reset successfully");

        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setTimeout(() => setFeedbackInfo(""), 5000);
        }
    }

    return (
        <>
            <div className="p-2 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
                <div className="p-2 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
                    <Button className="m-2" onClick={() => setSelectedFiles([])}>
                        Clear
                    </Button>
                    <Button className="m-2" onClick={resetHistory}>
                        Reset history
                    </Button>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <Filters onOutputTypeChange={setOutputType} onOutputLanguageChange={setOutputLanguage} />
                    <InputSubmission
                        selectedFiles={selectedFiles}
                        handleFileChange={handleFileChange}
                        deleteFile={deleteFile}
                        normalizeText={normalizeText}
                        additionalInfo={additionalInfo}
                        setAdditionalInfo={setAdditionalInfo}
                    />
                </form>
            </div>
            {loading && <Loading />}
            {
                downloadUrl && (
                    <DownloadOutput
                        downloadUrl={downloadUrl}
                        downloadFilename={downloadFilename}
                        feedbackInfo={feedbackInfo}
                        setFeedbackInfo={setFeedbackInfo}
                    />
                )
            }
        </>
    );
}