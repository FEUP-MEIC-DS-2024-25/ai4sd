import React, { useState, useEffect, useRef} from "react";
import { useParams, useSearchParams } from 'next/navigation';

import LanguageSelector from "./../../../components/languageSelector";
import UserStoryTable from "./userStoryTable"

import 'bootstrap/dist/css/bootstrap.css';

const Assistant = () => {

  const [error, setError] = useState("");
  

  const [versions, setVersions] = useState([]);
  const [requirements, setRequirements] = useState({});
  const [userStories, setUserStories] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0); 
  const [userStoryIndex, setUserStoryIndex] = useState(0);
  const numberVersion = useRef(0);

  const { projectId } = useParams();

  const searchParams = useSearchParams();
  const name = searchParams.get('name'); 
  const version = null

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(requirements.content);

  const [editingStory, setEditingStory] = useState(null);
  const [tempContent, setTempContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("Teste")
    console.log(projectId)
    if(!version){
      fetchProjectContent(projectId);
    }
    else {
      setVersions(version)
    }
    setCurrentIndex(0)
    setUserStoryIndex(0)
  }, [projectId, version]);


  useEffect(() => {
    if(versions.length === 0) return
    setRequirements({content: versions[currentIndex].content, version:versions[currentIndex].version});
    numberVersion.current = versions[currentIndex].user_stories.length
    setEditContent(versions[currentIndex].content)
  }, [currentIndex, versions]); 


  useEffect(() => {
    if (versions.length === 0 || !versions[currentIndex] || !versions[currentIndex].user_stories) return;
    const userStories = versions[currentIndex].user_stories[userStoryIndex].user_stories;
    setUserStories(JSON.parse(userStories));
  }, [currentIndex, versions, userStoryIndex]);



  const fetchProjectContent = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectId}/content`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }
      const data = await response.json();
      const content = data.response
      setVersions(content)
    } catch (error) {
      console.error(error);
    }
  };


  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserStoryIndex(0);
    }
  };

  
  const goForward = () => {
    if (currentIndex < versions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserStoryIndex(0);
    }
  };


  const goBackUS = () => {
    if (userStoryIndex > 0) {
        setUserStoryIndex(userStoryIndex - 1);
    }
  };

  
  const goForwardUS = () => {
    if (userStoryIndex < numberVersion.current - 1) {
        setUserStoryIndex(userStoryIndex + 1);
    }
  };


  const handleSubmit = async (projId, reqVersion, newContent) => {
    try {
      setIsLoading(true);
      let content = editContent;

      if(!newContent){
        content = requirements.content
      }

      if (!content.trim()) {
        throw new Error("Content cannot be null or an empty string.");
      }

      const response = await fetch("http://localhost:8080/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projId, query: content, req_version:reqVersion, newContent: newContent , language: selectedLanguage}),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
  
      const userStories = data.response.replace("```json", "").replace("```", "")
      
      updateVersion(content, userStories, newContent)
      
    } catch (error) {
      setError(`Failed to generate user stories:  ${error}.`);
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  };


  const updateVersion = (req, user_stories, newContent) => {
    const updatedVersions = [...versions];
  
    if (newContent) {
      const lastVersion = Math.max(...updatedVersions.map(v => v.version), 0);
      const newReqVersion = {
        version: lastVersion + 1,
        content: req,
        user_stories: [{ version: 1, user_stories }]
      };
      updatedVersions.push(newReqVersion);
    } else {
      const currentVersion = updatedVersions.find(v => v.version === requirements.version);
      if (currentVersion) {
        const lastUSVersion = Math.max(...currentVersion.user_stories.map(us => us.version), 0);
        currentVersion.user_stories.push({ version: lastUSVersion + 1, user_stories });
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
    handleSubmit(projectId, requirements.version, true)
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditContent(requirements.content)
  };

  return (
    <>
      <div id="sectionContent" className="flex-1">
        <div id="projectContent" className="text-center p-8 m-8 flex flex-col items-center gap-6">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
            <div id="sectionRequirements" className="bg-[#171717] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 m-8 flex flex-col items-center gap-6 w-[90%]">
                <h3 id="projectName">{name}</h3>
                {isEditing ? (
                  <div className="editReq">
                    <textarea id="reqInput" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    < div className="versionSelect">
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={handleCancelClick}>Cancel</button>
                    </div>
                  </div>
                  ) : (
                  <div>
                    <p>{requirements.content}</p>
                    < div className="versionSelect">
                    <button onClick={handleEditClickReq}>Edit</button>
                    <button onClick={goBack} disabled={currentIndex === 0}>⮜ </button>
                    <span>{currentIndex + 1}/{versions.length}</span>
                    <button onClick={goForward} disabled={currentIndex === versions.length - 1}> ⮞</button>
                    </div>
                  </div>
                 )}

            </div>
            <div id="sectionUserStories" className="bg-[#171717] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 m-8 flex flex-col items-center gap-6 w-[90%]">
              <h2 className="text-[#171717]" >Generated User Stories</h2>
              <div id="tableContainer">
                <UserStoryTable
                  userStories={userStories}
                  setUserStories={setUserStories}
                  editingStory={editingStory}
                  setEditingStory={setEditingStory}
                  tempContent={tempContent}
                  setTempContent={setTempContent}
                />
              </div>
              <div className="versionSelect">
                    <button onClick={goBackUS} disabled={userStoryIndex === 0}>⮜ </button>
                    <span>{userStoryIndex + 1}/{numberVersion.current}</span>
                    <button onClick={goForwardUS} disabled={userStoryIndex === numberVersion.current - 1}> ⮞</button>
              </div>
              <div id="buttonContainer" className="text-[#171717]">
                <button id="exportButton" className="btn hover:bg-[#e1e1e1] submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2" onClick={downloadUserStories}>
                  Download Stories
                </button>
                {isLoading ? (
                  <button className="btn submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4  hover:bg-[#e1e1e1] hover:text-[#2f2f2f]" type="button" disabled>
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
                    className="btn submitButton bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4 hover:bg-[#e1e1e1] hover:text-[#2f2f2f]"
                    onClick={() => handleSubmit(projectId, requirements.version, false)}
                  >
                    Regenerate User Stories
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>
    </>
  );
};
export default Assistant;
