"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateHome() {
    const router = useRouter();

    return (
        <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-8">Create a New Architectural Project</h1>
            <p className="mb-4">Use this section to start a new project. Provide the necessary details and submit your project.</p>
            <button
                onClick={() => router.push("/assistants/cave")}
                className="bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600"
            >
                Back to CAVE Home
            </button>
        </div>
    );
}