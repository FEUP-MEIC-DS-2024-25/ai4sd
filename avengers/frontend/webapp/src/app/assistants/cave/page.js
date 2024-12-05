"use client";

import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import { useRouter } from "next/navigation";

export default function Interactor() {

    const router = useRouter();

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <div className="p-4 bg-gray-200 rounded">
                <h2 className="text-xl font-bold">CAVE Overview</h2>
                <p>Welcome to the CAVE assistant. Use the options below to get started.</p>
                <ul className="list-disc pl-6 mt-2">
                    <li>
                        <button
                            onClick={() => router.push("/assistants/cave/create")}
                            className="text-blue-500 hover:underline"
                        >
                            Create new architectural projects
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => router.push("/assistants/cave/projects")}
                            className="text-blue-500 hover:underline"
                        >
                            View and manage existing projects
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}