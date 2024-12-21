"use client";

const url = "https://superhero-02-01-150699885662.europe-west1.run.app";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import caveLogo from "../../assets/cave-logo-name.png";
import AssistantPicker from "@/app/components/assistantPicker";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ViewProject() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedPlantUml, setUpdatedPlantUml] = useState("");

    useEffect(() => {
        fetch(`${url}/api/projects/${id}/`)
            .then((response) => response.json())
            .then((data) => {
                setProject(data);
                setUpdatedName(data.name || "");
                setUpdatedPlantUml(data.plantuml_code || "");
            })
            .catch((error) => console.error("Error fetching project:", error));
    }, [id]);

    const handleSaveChanges = () => {
        const formData = new FormData();
        formData.append("name", updatedName);
        formData.append("plantuml_code", updatedPlantUml);

        fetch(`${url}/api/projects/${id}/edit_project/`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    alert("Changes saved successfully!");
                    setIsEditing(false);
                    setProject((prevProject) => ({
                        ...prevProject,
                        name: updatedName,
                        plantuml_code: updatedPlantUml,
                    }));
                } else {
                    alert("Failed to save changes.");
                }
            })
            .catch((error) => console.error("Error saving changes:", error));
    };

    if (!project) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-1/8 bg-gray-900 text-gray-800">
                <AssistantPicker />
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col flex-grow p-6">
                {/* Top-Right Logo */}
                <div className="absolute top-4 right-4">
                    <Image src={caveLogo} alt="CAVE Logo" width={150} />
                </div>

                {/* Project Details */}
                <div className="container mx-auto">
                    {isEditing ? (
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="text-center text-3xl font-bold mb-6 text-gray-700 w-full p-2 border rounded"
                        />
                    ) : (
                        <h1 className="text-center text-3xl font-bold mb-6 text-gray-700">{project.name}</h1>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Project Info */}
                        <div className="bg-white shadow-md rounded text-gray-700 p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-700">Project Details</h2>
                            <p>
                                <strong>ID:</strong> {project.id}
                            </p>
                            <p>
                                <strong>GitHub Link:</strong>{" "}
                                <a
                                    href={project.github_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {project.github_link}
                                </a>
                            </p>
                            <div className="mb-4">
                                <h3 className="font-bold mb-2">Response:</h3>
                                {project.response ? (
                                    <ReactMarkdown className="prose">
                                        {project.response}
                                    </ReactMarkdown>
                                ) : (
                                    <span>No response available.</span>
                                )}
                            </div>
                        </div>

                        {/* PlantUML Details */}
                        <div className="bg-white shadow-md rounded p-6">
                            <h2 className="text-xl font-bold mb-4">PlantUML Diagram</h2>
                            {isEditing ? (
                                <div>
                                    <textarea
                                        className="w-full h-64 p-2 text-gray-800 border rounded"
                                        value={updatedPlantUml}
                                        onChange={(e) => setUpdatedPlantUml(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {project.plantuml_image ? (
                                        <img
                                            src={project.plantuml_image}
                                            alt="PlantUML Diagram"
                                            className="w-full max-h-96 object-contain mb-4"
                                        />
                                    ) : (
                                        <p>No PlantUML diagram available.</p>
                                    )}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
                                    >
                                        Edit Project
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}