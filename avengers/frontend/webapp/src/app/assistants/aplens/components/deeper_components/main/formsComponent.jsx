import React, { useState } from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { useSaveData } from "../../context/SaveDataContext";

import {Input} from "@nextui-org/react";
import {Checkbox} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import {Button} from "@nextui-org/button";

function FormsComponent({ setActiveView  }) {
  
  const { setAnalysisResults } = useAnalysis();
  const saveData = useSaveData()

  const [response, setResponse] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
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
      const response = await fetch(
        "http://localhost:8000/api/get-review/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo_url: repoUrl,
            token: authToken || null,
            architecture: (Array.from(selectedOption)[0]),
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

  const architecturesDict = [
    {key: "mvc", label: "Model-View-Controller"},
    {key: "monolithic", label: "Monolithic Pattern"},
    {key: "distributed", label: "Distributed Pattern"},
    {key: "eventDriven", label: "Event-Driven Architecture"},
    {key: "layered", label: "Layered (N-Tier) Architecture"},
    {key: "clientServer", label: "Client-Server Architecture"},
    {key: "microservice", label: "Microservices Architecture"},
    {key: "serviceOriented", label: "Service-Oriented Architecture"},
    {key: "serverless", label: "Serverless Architecture"},
    {key: "component", label: "Component-Based Architecture"},
    {key: "peerToPeer", label: "Peer-to-Peer (P2P) Architecture"},
    {key: "pipeFilter", label: "Pipe-and-Filter Architecture"},
    {key: "domainDriven", label: "Domain-Driven Design"},
    {key: "hexagonal", label: "Hexagonal Architecture"},
    {key: "CQRS", label: "Command Query Responsibility Segregation"},
    {key: "microkernel", label: "Microkernel Architecture"}
  ];

  return (
    <div className="pt-10 max-w-lg ml-0 text-left">

      {/* Repository Link */}
      <Input
        isRequired
        label="Repository Link"
        labelPlacement="outside"
        placeholder="Enter the repository link"
        radius="sm"
        size="lg"
        variant="bordered"
        value={repoUrl}
        onValueChange={setRepoUrl}
        classNames={{
          mainWrapper: "pb-2",
          label: "block text-lg text-black pb-20 mb-2",
          inputWrapper: "bg-ivory border-1.5 border-zinc-800 duration-0 group-hover:border-1.5 group-hover:border-zinc-800 group-hover:duration-0"
        }}
      />

      {/* Private Assignment */}
      <Checkbox 
        defaultSelected 
        radius="full"
        color="default"
        isSelected={isPrivate}
        onValueChange={setIsPrivate}>Private?</Checkbox>

      {/* Repository Token */}
      {isPrivate && (
        <Input
          label="Access Token"
          labelPlacement="outside"
          placeholder="Enter the access token"
          radius="sm"
          size="lg"
          variant="bordered"
          value={authToken}
          onValueChange={setAuthToken}
          classNames={{
            mainWrapper: "pt-4",
            label: "block text-lg text-black pb-20 mb-2",
            inputWrapper: "bg-ivory border-1.5 border-zinc-800 duration-0 group-hover:border-1.5 group-hover:border-zinc-800 group-hover:duration-0"
          }}
        />
      )}

      {/* Architecture Options */}
      <Select
        isRequired
        items={architecturesDict}
        label="Architectural Pattern"
        labelPlacement="outside"
        placeholder="Select an architectural pattern"
        radius="sm"
        size="lg"
        selectedKeys={selectedOption}
        onSelectionChange={setSelectedOption}
        classNames={{
          mainWrapper: "py-8",
          label: "block text-lg text-black ml-3 mb-2",
          trigger: "bg-ivory border-1.5 border-zinc-800 group-hover:bg-ivory",
          listbox: "text-black"
        }}
      >
        {(arch) => <SelectItem>{arch.label}</SelectItem>}
      </Select>

      {/* Button */}
      <Button 
        radius="sm"
        size="md"
        onClick={handleTestClick}
        className={`px-10 text-lg bg-zinc-800 border-zinc-800 border-1.5 hover:text-zinc-800 transition duration-300 ${
          loading
            ? "bg-zinc-800 cursor-not-allowed"
            : "text-white hover:bg-white"
        }`}
        disabled={loading}
      >
        {loading ? <div className="loader"></div> : "Submit"}
      </Button>

    
      {response && (
        <p className="mt-4 h-10 px-3 py-2 text-white bg-zinc-800 rounded-sm">
          <span className="font-sans ">{response}</span>
        </p>
      )}
    </div>
    
  );
}

export default FormsComponent;
