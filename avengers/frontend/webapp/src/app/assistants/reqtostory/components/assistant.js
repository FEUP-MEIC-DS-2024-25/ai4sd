import React, { useState, useEffect } from "react";
import UserInputSection from "./userInputSection";
import GeneratedStoriesSection from "./generateStoriesSection";
import styles from "@/app/page.module.css";

export default function Assistant() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [file, setFile] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [error, setError] = useState("");
  const [editingStory, setEditingStory] = useState(null);
  const [tempContent, setTempContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/projects");
      if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);
      const data = await response.json();
      setProjects(data.response);
    } catch (error) {
      console.error(error);
      setError("Failed to load projects.");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let content = userInput.trim();
      if (file) content = await file.text();
      if (!content) {
        setError("Input cannot be empty.");
        return;
      }

      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: content, language: selectedLanguage }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const parsedStories = JSON.parse(data.response.replace("```json", "").replace("```", ""));
      setUserStories(parsedStories);
    } catch (error) {
      setError("Failed to generate user stories.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectContent = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectId}/content`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Project Content:", data.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${styles.assistantInteraction} bg-[#e1e1e1] text-[#171717] overflow-y-scroll m-0`}>
      <h1 className="text-3xl font-bold text-center">ReqToStory</h1>
      <div className="selectors-container">
          <div id="divProject" className="relative min-w-[200px]">
            <select
              id="project-dropdown" className="w-full py-3 bg-[rgba(47,47,47,0.5)] border border-[rgba(225,225,225,0.1)] rounded-lg text-[var(--header-text-color)] text-[0.95rem] cursor-pointer transition-all ease-in-out duration-300 appearance-none backdrop-blur-sm shadow-md hover:bg-[rgba(47,47,47,0.8)] hover:border-[rgba(225,225,225,0.3)] hover:transform hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:border-[rgba(225,225,225,0.5)] focus:shadow-[0_0_0_2px_rgba(225,225,225,0.1)]"
              value={selectedProjectId || ""}
              onChange={(e) => {
                const projectId = e.target.value;
                setSelectedProjectId(projectId);
                if (projectId) {
                  fetchProjectContent(projectId);
                }
              }}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--header-text-color)] text-sm pointer-events-none">▼</span>
          </div>
        </div>
      <UserInputSection
        userInput={userInput}
        setUserInput={setUserInput}
        file={file}
        setFile={setFile}
        error={error}
        setError={setError}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <GeneratedStoriesSection
        userStories={userStories}
        setUserStories={setUserStories}
        editingStory={editingStory}
        setEditingStory={setEditingStory}
        tempContent={tempContent}
        setTempContent={setTempContent}
      />
    </div>
  );
}
