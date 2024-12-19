'use client';
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./gerald.css";
import '@/app/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getUserRepos, refreshUserToken, getUserToken, getUsername } from "../services/gerald";
import React, {  useEffect, useState } from "react";

export default function ProjectPicker() {

    const [repos, setRepos] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserToken();
        async function fetchRepos() {
            let response = await getUserRepos();
            let username = await getUsername();
            console.log(response);
            if (response === "401") {
                refreshUserToken();
            } else {
                setUsername(username);
                setRepos(response);
                setLoading(false);
            }
        }
        fetchRepos();
    }, []);

    return( loading ? <div>Loading...</div> :
        <div className={`${styles.assistantInteraction} assistantInteraction `}>
            <header>
                <h2 className="logo"> Gerald AI </h2>
                <a className="aboutus" href="">
                    <h2>About us</h2>
                </a>
            </header>
            <div className="project">
                {repos.map((repo) => (
                    <a href={"gerald/chat?owner=" + repo.owner.login + "&repo=" + repo.name + "&branch=" + repo.default_branch + "&username=" + username} key={repo.id}>
                        <div className="card">  
                            <h2>{repo.name}</h2>
                            <p>{repo.description}</p>
                        </div>
                    </a>
                ))}
            </div>

        </div>
    )
}
