"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProjectsHome() {
    const router = useRouter();

    return (
        <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-8">View and Manage Projects</h1>
            <p className="mb-4">Browse your existing architectural projects and make updates as needed.</p>
            <button
                onClick={() => router.push("/assistants/cave")}
                className="bg-green-500 text-white px-6 py-3 rounded shadow-md hover:bg-green-600"
            >
                Back to CAVE Home
            </button>
        </div>
    );
}