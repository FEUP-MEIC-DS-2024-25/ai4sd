"use client"

import React, { useState } from "react";
import Filters from "./filters";
import InputSubmission from "./inputSubmission";
import Loading from "./loading";
import DownloadOutput from "./downloadOutput";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";

export default function Application() {
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
            const response = await fetch("https://superhero-04-01-150699885662.europe-west1.run.app/api/process", {
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
                case "text/plain":
                    filename = "report.txt";
                    break;
                default:
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

    return (
        <>
            <div className="p-2 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
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
