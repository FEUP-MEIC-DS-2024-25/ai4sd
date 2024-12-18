import React, { useState } from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { useSaveData } from "../../context/SaveDataContext";


function FormsComponent({ setActiveView  }) {
  
  const { setAnalysisResults } = useAnalysis();
  const saveData = useSaveData()

  const [response, setResponse] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [selectedOption, setSelectedOption] = useState("mvc");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTestClick = async () => {
    /* Input Validation */
    if (!repoUrl) {
      setResponse("A repository URL is required.");
      return;
    }

    try {
      new URL(repoUrl);
    } catch (error) {
      setResponse("Invalid repository URL.");
      return;
    }

    if (isPrivate && !authToken) {
      setResponse("Authentication token is required for private repositories.");
      return;
    }

    /* Spinning Button */
    setLoading(true);

    
    /* Response */
    try {
      console.log("Trying to fetch a response")
      const response = await fetch(
        "https://superhero-06-03-150699885662.europe-west1.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo_url: repoUrl,
            token: authToken || null,
            architecture: selectedOption,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setResponse(data.message);

      await saveData(data)
      setAnalysisResults(data);
      setActiveView("Reports");
    } catch (error) {
      console.error("Error:", error);
      setResponse(error.message);
    } finally {
      setLoading(false);
    }
      
  };

  return (
    <div className="pt-10 max-w-lg ml-0 text-left">

      {/* Repository Link */}
      <div className="mb-2">
        <label className="block text-lg font-rubik mb-2" htmlFor="repo-url">
          Repository Link
        </label>
        <textarea
          id="repo-url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter the repository link"
          className="w-full h-12 bg-ivory px-3 pt-2.5 border-1.5 border-zinc-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 no-resize overflow-y-hidden overflow-x-auto whitespace-nowrap"
        />
      </div>

      {/* Private Assignment */}
      <div className="mb-7">
        <div>
          <label>
            Private?
            <input
              className="text-rubik ml-2 custom-checkbox"
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />{" "}
          </label>
        </div>
      </div>

      {/* Repository Token */}
      {isPrivate && (
        <div className="mb-4">
          <label
            className="block text-lg font-rubik mb-2"
            htmlFor="auth-token"
          >
            Access Token
          </label>
          <textarea
            id="auth-token"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Enter the access token"
            className="w-full h-12 bg-ivory px-3 pt-2.5 border-zinc-800 border-1.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 no-resize overflow-y-hidden overflow-x-auto whitespace-nowrap"
          />
        </div>
      )}

      {/* Architecture Options */}
      <div className="mb-4">
        <label className="block text-lg font-rubik mb-2" htmlFor="dropdown">
          Architectural Pattern
        </label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full px-3 p-2 border-zinc-800 border-1.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="mvc">Model-View-Controller</option>
          <option value="monolithic">Monolithic Pattern</option>
          <option value="distributed">Distributed Pattern</option>
          <option value="eventDriven">Event-Driven Architecture</option>
          <option value="layered">Layered (N-Tier) Architecture</option>
          <option value="clientServer">Client-Server Architecture</option>
          <option value="microservice">Microservices Architecture</option>
          <option value="serviceOriented">Service-Oriented Architecture</option>
          <option value="serverless">Serverless Architecture</option>
          <option value="component">Component-Based Architecture</option>
          <option value="peerToPeer">Peer-to-Peer (P2P) Architecture</option>
          <option value="pipeFilter">Pipe-and-Filter Architecture</option>
          <option value="domainDriven">Domain-Driven Design</option>
          <option value="hexagonal">Hexagonal Architecture</option>
          <option value="CQRS">Command Query Responsibility Segregation</option>
          <option value="microkernel">Microkernel Architecture</option>
        </select>
      </div>

      {/* Button */}
      <div className="mt-10 mb-4">
        <button
          onClick={handleTestClick}
          className={`px-10 py-0.5 text-rubik text-lg bg-zinc-800 border-zinc-800 border-1.5 text-white rounded-sm transition duration-300 hover:bg-white hover:border-1.5 hover:border-zinc-800 hover:text-zinc-800 ${
            loading
              ? "bg-zinc-800 cursor-not-allowed"
              : "bg-zinc-800 hover:bg-white"
          }`}
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : "Submit"}
        </button>
      </div>

    
      {response && (
        <p className="mt-4 h-10 px-3 py-2 text-white bg-zinc-800 rounded-sm">
          <span className="font-sans ">{response}</span>
        </p>
      )}
    </div>
    
  );
}

export default FormsComponent;
