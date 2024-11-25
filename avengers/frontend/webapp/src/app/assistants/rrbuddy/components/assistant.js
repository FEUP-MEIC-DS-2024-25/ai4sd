"use client"
import styles from "@/app/page.module.css";

import React, { useState } from "react";
import Filters from "./filters";
import InputSubmission from "./inputSubmission";
import Loading from "./loading";
import DownloadOutput from "./downloadOutput";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";
import AssistantTitleBar from "./assistantTitleBar";
import rrbuddy_logo from "../assets/rrbuddy_logo.png"

export default function Assistant() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [downloadFilename, setDownloadFilename] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [feedbackInfo, setFeedbackInfo] = useState("");

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

        setLoading(true);
        try {
            // TEMP
            const response = await fetch("http://172.21.0.3:5001/api/process", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get("content-disposition");
            const filename = contentDisposition
                ?.split("filename=")[1]
                ?.split(";")[0]
                ?.replace(/"/g, "") || "Classification.txt";

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
        <div className={styles.assistantInteraction}>
            <AssistantTitleBar name={"RRBuddy"} logoFile={rrbuddy_logo}
                className={"p-4 mb-5 bg-gray-100 shadow-md text-xl font-bold text-center w-full flex gap-6 items-center justify-center"}
            />

            <div className="p-2 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
                <form onSubmit={handleFormSubmit}>
                    <Filters />
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
            {downloadUrl && (
                <DownloadOutput
                    downloadUrl={downloadUrl}
                    downloadFilename={downloadFilename}
                    feedbackInfo={feedbackInfo}
                    setFeedbackInfo={setFeedbackInfo}
                />
            )}
        </div>
    );
}
