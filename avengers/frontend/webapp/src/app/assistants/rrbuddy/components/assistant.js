"use client"
import styles from "@/app/page.module.css";

import React from "react";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";
import AssistantTitleBar from "./assistantTitleBar";
import rrbuddy_logo from "../assets/rrbuddy_logo.png"
import Application from "./application";

export default function Assistant() {
    return (
        <div className={styles.assistantInteraction + " p-0"}>
            <AssistantTitleBar name={"RRBuddy"} logoFile={rrbuddy_logo}
                className={"p-4 mb-5 bg-gray-100 shadow-md text-xl font-bold text-center w-full flex gap-6 items-center justify-center"}
            />
            <Application />
        </div>
    );
}
