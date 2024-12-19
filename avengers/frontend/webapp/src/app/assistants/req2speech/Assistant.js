"use client"

import styles from "@/app/page.module.css";

//Custom Components
import LandingPage from "./components/LandingPage"
import Header from "./components/Header"

//Contexts 
import { ThemeProvider } from "./components/contexts/ThemeContext"

export default function Assistant({ chat=[] }) {

    //Static Mock data 
    const user = {
        name: "Teste",
        avatar: "https://picsum.photos/200/300"
    }

    return (
        <div className={`${styles.assistantInteraction} dark:bg-neutral-950 bg-gray-200`}>
            <ThemeProvider className="flex flex-col items-center">
                <Header user={user}/>
                <LandingPage chat={chat}/>
            </ThemeProvider>
        </div>
    )
}