import React, { useState } from 'react';
import { vscode } from "../utilities/vscode";
import { GitHubIssue, SearchScreenProps } from "../utilities/types";



function SearchPage({setIssues} : SearchScreenProps): React.JSX.Element {
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');

  const handleSubmit = () => {
    const handleMessage = (event: MessageEvent) => {
      console.log("HERE");
      const message = event.data;
      console.log(message);
      setIssues(message.filter((issue: GitHubIssue) => !issue.pull_request));
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "issues", data: {owner: owner, repo: repo} });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Search Repository</h1>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="owner" style={{ display: 'block', marginBottom: '5px' }}>
          Owner:
        </label>
        <input
          type="text"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Enter owner name"
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="repo" style={{ display: 'block', marginBottom: '5px' }}>
          Repo:
        </label>
        <input
          type="text"
          id="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="Enter repo name"
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <button
        type="submit"
        style={{
          backgroundColor: '#006010',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
        }}
        onClick={handleSubmit}
      >
        Fetch
      </button>
    </div>
  );
}

export default SearchPage;
