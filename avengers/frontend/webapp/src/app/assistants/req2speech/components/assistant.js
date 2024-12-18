"use client"

import styles from "@/app/page.module.css";

//Custom Components
import LandingPage from "./LandingPage"
import Header from "./Header"

//Contexts 
import { ThemeProvider } from "./contexts/ThemeContext"

export default function Assistant() {

    //Static Mock data 
    const user = {
        name: "Teste",
        avatar: "https://picsum.photos/200/300"
    }

    return (
        <div className={styles.assistantInteraction}>
            <ThemeProvider className="flex flex-col items-center">
                <Header user={user}/>
                <LandingPage />
            </ThemeProvider>
        </div>
    )
}