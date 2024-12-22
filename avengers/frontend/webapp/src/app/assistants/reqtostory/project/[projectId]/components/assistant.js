import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

import LanguageSelector from "./../../../components/languageSelector";
import UserStoryTable from "./userStoryTable";
import styles from "@/app/page.module.css";
import Header from "./../../../components/header";

import "bootstrap/dist/css/bootstrap.css";

const Assistant = () => {
    const [error, setError] = useState("");

    const [versions, setVersions] = useState([]); // all project content
    const [requirements, setRequirements] = useState({}); // all requirements
    const [userStories, setUserStories] = useState([]); // all current user stories
    const [feedbackQueries, setFeedbackQueries] = useState([]);

    const [reqVersion, setReqVersion] = useState(0); // current selected requirement version
    const [userStoriesVersion, setUserStoriesVersion] = useState(0); // current selected user stories version
    const numberVersion = useRef(0);

    const { projectId } = useParams(); // project id

    const searchParams = useSearchParams();
    const name = searchParams.get("name"); // project name
    const version = null;

    const [isEditing, setIsEditing] = useState(false);
    const [editReq, setEditReq] = useState(requirements.content);

    const [editingStory, setEditingStory] = useState(null);
    const [tempContent, setTempContent] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!version) {
            fetchProjectContent(projectId);
        } else {
            setVersions(version);
        }
        setReqVersion(0);
        setUserStoriesVersion(0);
    }, [projectId, version]);

    useEffect(() => {
        if (versions.length === 0) return;
        setRequirements({
            content: versions[reqVersion].content,
            version: versions[reqVersion].version,
        });
        if (!versions[reqVersion].user_stories) return;
        numberVersion.current = versions[reqVersion].user_stories.length;
        setEditReq(versions[reqVersion].content);
    }, [reqVersion, versions]);

    useEffect(() => {
        if (
            versions.length === 0 ||
            !versions[reqVersion] ||
            !versions[reqVersion].user_stories
        )
            return;
        const userStories =
            versions[reqVersion].user_stories[userStoriesVersion].user_stories;
        setUserStories(userStories);
    }, [reqVersion, versions, userStoriesVersion]);


    //http://localhost:8080/project/${projectId}/content
    const fetchProjectContent = async (projectId) => {
        try {
            const response = await fetch(
                `https://superhero-04-02-150699885662.europe-west1.run.app/project/${projectId}/content`
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch project: ${response.statusText}`
                );
            }
            const data = await response.json();
            const content = data.response;
            setVersions(content);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFeedback = (feedbackType, storyIndex) => {
        const story = userStories[storyIndex];
        
        let newQuery = null;
        if (feedbackType === "like") {
            newQuery = {
                storyIndex,
                query: `"${story.user_story}" was liked - generate more stories with similar structure and content`
            };
        } else if (feedbackType === "dislike") {
            newQuery = {
                storyIndex,
                query: `"${story.user_story}" was disliked - avoid generating similar stories and try different approaches`
            };
        }
    
        setFeedbackQueries(prevQueries => {
            const filteredQueries = prevQueries.filter(q => q.storyIndex !== storyIndex);
            
            const updatedQueries = newQuery ? [...filteredQueries, newQuery] : filteredQueries;
    
            if (feedbackType === "like" || feedbackType === "dislike") {
                submitWithQueries(updatedQueries);
            }
    
            return updatedQueries;
        });
    };

    const submitWithQueries = (queries) => {
        try {
            let content = requirements.content;
            const feedbackContext = queries.length > 0 ? queries.map(fq => fq.query).join(". ") : "";
    
            const enhancedContent = feedbackContext ? `${content}\n\nFeedback context:\n${feedbackContext}` : content;
    
            handleSubmit(projectId, requirements.version, false, enhancedContent);
        } catch (error) {
            console.error("Error in submitWithQueries:", error);
        }
    };

    const goBack = () => {
        if (reqVersion > 0) {
            setReqVersion(reqVersion - 1);
            setUserStoriesVersion(0);
        }
    };

    const goForward = () => {
        if (reqVersion < versions.length - 1) {
            setReqVersion(reqVersion + 1);
            setUserStoriesVersion(0);
        }
    };

    const goBackUS = () => {
        if (userStoriesVersion > 0) {
            setUserStoriesVersion(userStoriesVersion - 1);
        }
    };

    const goForwardUS = () => {
        if (userStoriesVersion < numberVersion.current - 1) {
            setUserStoriesVersion(userStoriesVersion + 1);
        }
    };


    //http://localhost:8080/regenerate
    
    const handleSubmit = async (projId, reqVersion, newContent, submittedContent = null) => {
        try {
            setIsLoading(true);
            let content = editReq || submittedContent

            if (!newContent) {
                content = submittedContent || requirements.content;
            }

            if (!content.trim()) {
                throw new Error("Content cannot be null or an empty string.");
            }

            const response = await fetch("https://superhero-04-02-150699885662.europe-west1.run.app/regenerate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: projId,
                    query: content,
                    req_version: reqVersion,
                    newContent: newContent,
                    language: selectedLanguage,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            const userStoriesSring = data.response
                .replace("```json", "")
                .replace("```", "");

            const userStories = JSON.parse(userStoriesSring)
            updateVersion(content, userStories, newContent);

            setTimeout(() => {
                const buttons = document.querySelectorAll('.filled');
                buttons.forEach(button => {
                    const icon = button.children[0];
                    button.classList.remove('filled');
                    button.classList.add('not-filled');
                    
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                });
            }, 100);
            
        } catch (error) {
            setError(`Failed to generate user stories:  ${error}.`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateVersion = (req, user_stories, newContent) => {
        const updatedVersions = [...versions];
    
        if (newContent) {
            const lastVersion = Math.max(
                ...updatedVersions.map((v) => v.version),
                0
            );
            console.log(user_stories);
            const newReqVersion = {
                version: lastVersion + 1,
                content: req,
                user_stories: [{ version: 1, user_stories: user_stories }],
            };
            updatedVersions.push(newReqVersion);
            setReqVersion(updatedVersions.length - 1);
        } else {
            const currentVersion = updatedVersions.find(
                (v) => v.version === requirements.version
            );
            if (currentVersion) {
                const lastUSVersion = Math.max(
                    ...currentVersion.user_stories.map((us) => us.version),
                    0
                );
                currentVersion.user_stories.push({
                    version: lastUSVersion + 1,
                    user_stories: user_stories,
                });
                setUserStoriesVersion(currentVersion.user_stories.length - 1);
            }
        }
        setVersions(updatedVersions);
    };

    const downloadUserStories = () => {
        const blob = new Blob([JSON.stringify(userStories, null, 2)], {
            type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "user_stories.json";
        link.click();
    };

    const handleEditClickReq = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        handleSubmit(projectId, requirements.version, true);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditReq(requirements.content);
    };

    return (
        <>
            <div
                id="sectionContent"
                className={`${styles.assistantInteraction} bg-[#e1e1e1] text-[#171717] overflow-y-scroll m-0`}
            >
                <Header />
                <section className="bg-[#171717] text-[#e1e1e1] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 mx-auto my-8 flex flex-col items-center gap-6  w-[90%]">
                    <div className="flex flex-rows items-start justify-start w-[90%] ">
                        <a className="btn flex items-center justify-center hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] w-12 h-12 dull border-[#2f2f2f] hover:border-[#e1e1e1] rounded-full" href="/assistants/reqtostory">
                            <i className="bi bi-plus text-3xl hover:text-[#2f2f2f]"></i>
                        </a>
                    </div>
                    <LanguageSelector
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={setSelectedLanguage}
                    />
                    <div className="w-[100%]">
                        <p>Project's Name</p>
                        <input
                            className="bg-[#e1e1e1] text-[#2f2f2f] border-4 border-[#e1e1e1] rounded-[20px] mx-auto p-2 w-[80%]"
                            type="text"
                            placeholder={name}
                            disabled
                        />
                    </div>
                    {isEditing ? (
                        <div className="w-[100%]">
                            <p>Project's Requirements</p>
                            <textarea
                                className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] mx-auto p-2 w-[80%]"
                                value={editReq}
                                onChange={(e) => setEditReq(e.target.value)}
                            />
                            <div className="flex justify-end items-center mx-auto my-2 w-[80%]">
                                <button
                                    className="hover:bg-[#e1e1e1] hover:text-[#2f2f2f] hover:border-[#e1e1e1] bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] p-2 m-2"
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </button>
                                <button
                                    className="hover:bg-[#e1e1e1] hover:text-[#2f2f2f] hover:border-[#e1e1e1] bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] p-2 m-2"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-[100%]">
                            <p>Project's Requirements</p>
                            <textarea
                                className="bg-[#e1e1e1] text-[#2f2f2f] border-4 border-[#e1e1e1] rounded-[20px] mx-auto p-2 w-[80%]"
                                placeholder={requirements.content}
                                disabled
                            />

                            <div className="flex justify-end items-center mx-auto my-2 w-[80%]">
                                <button
                                    className="hover:bg-[#e1e1e1] hover:text-[#2f2f2f] hover:border-[#e1e1e1] bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] p-2 m-2"
                                    onClick={handleEditClickReq}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={goBack}
                                    disabled={reqVersion === 0}
                                >
                                    ⮜{" "}
                                </button>
                                <span>
                                    {reqVersion + 1}/{versions.length}
                                </span>
                                <button
                                    onClick={goForward}
                                    disabled={
                                        reqVersion === versions.length - 1
                                    }
                                >
                                    {" "}
                                    ⮞
                                </button>
                            </div>
                        </div>
                    )}
                </section>
                <div
                    id="sectionUserStories"
                    className="bg-[#171717] text-[#e1e1e1] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 mx-auto my-8 flex flex-col items-center gap-6  w-[90%]"
                >
                    <h2 className="text-[#171717]">Generated User Stories</h2>
                    <div id="buttonContainer" className="text-[#171717]">
                        <button
                            id="exportButton"
                            className="btn hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 hover:border-[#e1e1e1]"
                            onClick={downloadUserStories}
                        >
                            Download Stories
                        </button>
                        {isLoading ? (
                            <button
                                className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4 hover:bg-[#e1e1e1] hover:text-[#2f2f2f] hover:border-[#e1e1e1]"
                                type="button"
                                disabled
                            >
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Regenerating...
                            </button>
                        ) : (
                            <button
                                id="regenerateButton"
                                className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4 hover:bg-[#e1e1e1] hover:text-[#2f2f2f] hover:border-[#e1e1e1]"
                                onClick={() =>
                                    handleSubmit(
                                        projectId,
                                        requirements.version,
                                        false
                                    )
                                }
                            >
                                Regenerate User Stories
                            </button>
                        )}
                    </div>
                    <div id="tableContainer">
                        <UserStoryTable
                            userStories={userStories}
                            setUserStories={setUserStories}
                            editingStory={editingStory}
                            setEditingStory={setEditingStory}
                            tempContent={tempContent}
                            setTempContent={setTempContent}
                            queryAdders={handleFeedback}
                            projectId = {projectId}
                            reqVersion =  {reqVersion}
                            userStoriesVersion = {userStoriesVersion}
                        />
                    </div>
                    <div className="versionSelect">
                        <button
                            onClick={goBackUS}
                            disabled={userStoriesVersion === 0}
                        >
                            ⮜{" "}
                        </button>
                        <span>
                            {userStoriesVersion + 1}/{numberVersion.current}
                        </span>
                        <button
                            onClick={goForwardUS}
                            disabled={
                                userStoriesVersion === numberVersion.current - 1
                            }
                        >
                            {" "}
                            ⮞
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Assistant;