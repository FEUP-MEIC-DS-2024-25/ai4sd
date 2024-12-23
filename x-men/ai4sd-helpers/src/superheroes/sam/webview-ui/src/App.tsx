import { useEffect, useState } from "react";
import IssuesListPage from "./screens/IssuesList";
import IssueDetailsPage from "./screens/IssueDetails";
import { GitHubIssue } from "./utilities/types";
import HeaderComponent from "./components/HeaderComponent";
import { vscode } from "./utilities/vscode";
import ReactLoading from "react-loading";

function App() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("loading");
  const [owner, setOwner] = useState<string>();
  const [repo, setRepo] = useState<string>();

  useEffect(() => {
    if (issues.length != 0) {
      setCurrentPage("issues");
    }
  }, [issues]);

  useEffect(() => {
    if (selectedIssue) setCurrentPage("issue-details");
  }, [selectedIssue]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data[0];
      const owner = event.data[1];
      const repo = event.data[2];
      console.log("Message received:", message, owner, repo);
      setOwner(owner);
      setRepo(repo);
      setIssues(message.filter((issue: GitHubIssue) => !issue.pull_request));
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "issues" });
  }, []);

  return (
    <div>
      {currentPage === "loading" && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Sam is fetching your issues
          </span>
          <ReactLoading type={"bubbles"} height={100} width={100} />
        </div>
      )}
      {currentPage === "issues" && (
        <div>
          <HeaderComponent
            numberIssues={issues.length}
            backButton={null}
            backPage={null}
          />
          <IssuesListPage issues={issues} setSelectedIssue={setSelectedIssue} />
        </div>
      )}
      {currentPage === "issue-details" && (
        <div>
          <HeaderComponent
            backButton={setCurrentPage}
            backPage={"issues"}
            numberIssues={issues.length}
          />
          <IssueDetailsPage
            selectedIssue={selectedIssue!}
            owner={owner!}
            repo={repo!}
          />
        </div>
      )}
    </div>
  );
}

export default App;
