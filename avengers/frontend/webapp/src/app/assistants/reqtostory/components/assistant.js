import React, { useState } from "react";
import ModalInfo from "./modalInfo";
import { useRouter } from "next/navigation";
import LanguageSelector from "./languageSelector";
import styles from "@/app/page.module.css";

const Assistant = () => {
  const [reqInput, setReqInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            return;
        }

        const validExtensions = ["txt", "md", "csv"];
        const extension = selectedFile.name.split(".").pop().toLowerCase();
        const validMIMETypes = ["text/plain", "text/markdown", "text/csv"];
        const isValidExtension = validExtensions.includes(extension);
        const isValidMIMEType = validMIMETypes.includes(selectedFile.type);

        if (!isValidExtension || !isValidMIMEType) {
            setError("Only text files (.txt, .md, .csv) are supported.");
            return;
        }

        setFile(selectedFile);
        setError("");
    }
};

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      let name = nameInput.trim();
      let content = reqInput.trim();
      if (file) {
        const fileContent = await file.text();
        content = fileContent;
      }

      if (!name) {
        throw new Error("Name cannot be null or an empty string.");
      }
      if (!content) {
        throw new Error("Content cannot be null or an empty string.");
      }

      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, query: content, language: selectedLanguage}),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const projectId = parseInt(data.response.project_id)
      const userStories = data.response.user_stories.replace("```json", "").replace("```", "")
      const version = createVersion(projectId, content, userStories)

      //setUpdate(true);

      router.push(`assistant/reqtostory/project/${projectId}?name=${encodeURIComponent(name)}`);

      navigate(`/project/${projectId}`, {
        state: { name:name},
      });
      
    } catch (error) {
      setError(`Failed to generate user stories:  ${error}.`);
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
    
  };

  const createVersion = (requirements, user_stories) => {
    const userStories = {
      "version": 1,
      "user_stories": user_stories
    }
    const version1 = {
      "version": 1,
      "content": requirements,
      "user_stories": [userStories]
    }
    const versions = [version1]
    return versions
  }

  return (
    <div className={`${styles.assistantInteraction} bg-[#e1e1e1] text-[#171717] overflow-y-scroll m-0`}>
      <section className="bg-[#171717] text-[#e1e1e1] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 m-8 flex flex-col items-center gap-6">
        <h2>User Story Generator</h2>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        <ModalInfo/>
        <input
          className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] block mx-auto p-4 w-[40%]"
          id="nameInput"
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Project name"
          maxLength={255}
        />
        <textarea
          className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] block mx-auto p-8 w-[80%] resize-none"
          id="userInput"
          value={reqInput}
          onChange={(e) => setReqInput(e.target.value)}
          placeholder="Enter text or leave empty to upload a file."
          rows={5}
        />
        <div id="fileControlsContainer">
          <input
            id="uploadButton"
            type="file"
            accept=".txt,.md,.csv"
            onChange={handleFileChange}
          />
          {file && (
            <button
              id="deleteButton"
              className="btn hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4"
              onClick={() => setFile(null)}
            >
              <i className="fa fa-trash"></i> Remove File
            </button>
          )}
        </div>
        {error && (
          <div
            id="fileError"
            className="text-[#ff4444] my-2 text-sm text-left"
          >
            {error}
          </div>
        )}
        {isLoading ? (
          <button className="btn hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Generating...
          </button>
        ) : (
          <button
            className="btn  hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4"
            id="submitButton"
            onClick={handleSubmit}
          >
            Generate User Stories
          </button>
        )}
      </section>
    </div>
  );
};

export default Assistant;