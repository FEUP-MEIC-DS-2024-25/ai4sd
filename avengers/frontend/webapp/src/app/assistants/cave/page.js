"use client";

const url = "https://superhero-02-01-150699885662.europe-west1.run.app";

import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import { useRouter } from "next/navigation";
import Image from "next/image";
import caveLogo from "./assets/cave-logo.png";

export default function Interactor() {
    const router = useRouter();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-1/8 bg-gray-900 text-white">
                <AssistantPicker />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="mb-6">
                    <Image src={caveLogo} alt="CAVE Logo" width={80} height={80} />
                </div>
                <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl text-center">
                    <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome to CAVE</h2>
                    <p className="text-gray-600 text-lg mb-6">
                        Explore the world of architectural visualizations with CAVE.
                        Use the options below to begin:
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push("/assistants/cave/create")}
                            className="bg-blue-600 text-white px-6 py-3 rounded shadow-md hover:bg-blue-700"
                        >
                            Create New Projects
                        </button>
                        <button
                            onClick={() => router.push("/assistants/cave/projects")}
                            className="bg-green-600 text-white px-6 py-3 rounded shadow-md hover:bg-green-700"
                        >
                            View Existing Projects
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}