"use client";

import styles from "@/app/page.module.css";
import "./assistant.css";
import { useState } from "react";
import { uploadFile, saveContext, downloadMutations } from "../api/api";

export default function Assistant() {
  const [codeFile, setCodeFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState("java");
  const [testsGenerated, setTestsGenerated] = useState(false); 

  const handleFileChange = (e, type) => {
    if (type === 'code') {
      setCodeFile(e.target.files[0]);
    } else if (type === 'test') {
      setTestFile(e.target.files[0]);
    }
  };

  const handleGenerateMutants = async () => {
    try {
      if (codeFile) await uploadFile(codeFile, 'code');
      if (testFile) await uploadFile(testFile, 'test');
      await saveContext(context, language);
      setTestsGenerated(true);
      console.log("Mutant tests generated successfully");
    } catch (error) {
      console.error("Error generating mutant tests:", error);
    }
  };

  const handleDownloadMutations = async () => {
    try {
      await downloadMutations();
      console.log("Mutations file downloaded successfully");
    } catch (error) {
      console.error("Error downloading mutations file:", error);
    }
  };

  return (
    <div className="TwisterAI">
      <header>
        <div>
          <h1 className="title">TwisterAI</h1>
        </div>
        <div>
          <nav>
            <label>Select the language:</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </nav>
        </div>
      </header>
      <main>
        <section className="upload_section">
          <div>
            <label className="upload" htmlFor="code_file">
              Upload code file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
              id="code_file"
              className="upload_btn"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'code')}
            />
          </div>
          <div>
            <label className="upload" htmlFor="tests_file">
              Upload tests file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
              id="tests_file"
              className="upload_btn"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'test')}
            />
          </div>
        </section>

        <section>
          <label htmlFor="context">Give me some context about your code:</label>
          <textarea
            id="context"
            placeholder="Insert context here."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>
        </section>

        <section className="action_section">
          <button onClick={handleGenerateMutants}>Generate mutant tests</button>
          <button onClick={handleDownloadMutations} disabled={!testsGenerated}>Download mutant tests</button>
        </section>
      </main>
    </div>
  );
}