"use client";

const url = "https://superhero-02-01-150699885662.europe-west1.run.app";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import caveLogo from "../assets/cave-logo-name.png";
import AssistantPicker from "@/app/components/assistantPicker";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch(`${url}/api/projects/`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched projects:", data); // Debugging
                setProjects(data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-1/8 bg-gray-900 text-white">
                <AssistantPicker />
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center flex-grow">
                {/* Top-Right Logo */}
                <div className="absolute top-4 right-4">
                    <Image src={caveLogo} alt="CAVE Logo" width={150} />
                </div>

                {/* Project List Section */}
                <div className="w-full max-w-4xl bg-white shadow-md rounded p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Existing Projects</h1>
                    {projects.length > 0 ? (
                        <ul className="space-y-4">
                            {projects.map((project) => (
                                <li
                                    key={project.id}
                                    className="flex justify-between items-center border-b pb-4 mb-4"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {project.name}
                                        </h2>
                                        <a
                                            href={project.github_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {project.github_link}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/assistants/cave/projects/${project.id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
                                    >
                                        View Repo
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-600">No projects found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}