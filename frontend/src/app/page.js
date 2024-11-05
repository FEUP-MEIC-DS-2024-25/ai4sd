"use client"

//import React from "react";
import styles from "./page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import Home from "./pages/home.js";
import Interactor from "./pages/interactor";
import React, {useState} from "react";

export default function Page() {
    const [currentPage, setCurrentPage] = useState("home");
    
    const renderPage = () => {
        if (currentPage === "home") {
            return <Home />;
        } else if (currentPage === "interactor") {
            return <Interactor />;
        }

        return <Page404 />;
    }

    return (
        <div>
            {renderPage()}
        </div>)

}

function Page404(){
    return(
        <div>
            <h1>404</h1>
            <h2>Page not found!</h2>
        </div>
    )
}