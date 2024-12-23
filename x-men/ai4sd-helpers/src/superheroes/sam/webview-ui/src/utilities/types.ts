export type SearchScreenProps = {
  setIssues: React.Dispatch<React.SetStateAction<GitHubIssue[]>>;
};

export type IssuesListScreenProps = {
  issues: GitHubIssue[];
  setSelectedIssue: React.Dispatch<React.SetStateAction<GitHubIssue | null>>;
};

export type IssueDetailsScreenProps = {
  owner: string;
  repo: string;
  selectedIssue: GitHubIssue;
};

export type HeaderScreenProps = {
  backButton: React.Dispatch<React.SetStateAction<string>> | null;
  numberIssues: number;
  backPage: string | null;
};

export type GitHubIssue = {
  title: string;
  number: number;
  url: string;
  body: string;
  pull_request?: object;
};
