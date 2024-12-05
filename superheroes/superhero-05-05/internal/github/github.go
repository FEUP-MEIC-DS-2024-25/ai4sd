package github

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-git/go-git/v5"
)

// Issue represents a GitHub issue
type Issue struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	URL    string `json:"html_url"`
}

// String returns a string representation of an Issue
func (i Issue) String() string {
	return fmt.Sprintf("#%d %s: %s", i.Number, i.Title, i.Body)
}

// GetOwner returns the owner of the repository of the issue
func (i Issue) GetOwner() string {
	split := strings.Split(i.URL, "/")
	return split[3]
}

// GetRepo returns the repository of the issue
func (i Issue) GetRepo() string {
	split := strings.Split(i.URL, "/")
	return split[4]
}

// FetchIssues fetches the issues of a GitHub repository
func FetchIssues(owner, repo string) ([]Issue, error) {
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/issues", owner, repo)

	resp, err := http.Get(apiURL)
	if err != nil {
		return []Issue{}, fmt.Errorf("failed to fetch issues: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return []Issue{}, fmt.Errorf("failed to fetch issues: %s", resp.Status)
	}

	var issues []Issue
	if err := json.NewDecoder(resp.Body).Decode(&issues); err != nil {
		return []Issue{}, fmt.Errorf("failed to decode response: %w", err)
	}

	return issues, nil
}

// FetchIssue fetches a GitHub issue
func FetchIssue(owner, repo string, number int) (Issue, error) {
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/issues/%d", owner, repo, number)

	resp, err := http.Get(apiURL)
	if err != nil {
		return Issue{}, fmt.Errorf("failed to fetch issue: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Issue{}, fmt.Errorf("failed to fetch issue: %s", resp.Status)
	}

	var issue Issue
	if err := json.NewDecoder(resp.Body).Decode(&issue); err != nil {
		return Issue{}, fmt.Errorf("failed to decode response: %w", err)
	}

	return issue, nil
}

// CloneRepository clones a GitHub repository
func CloneRepository(owner, repo, path string) error {
	repoURL := fmt.Sprintf("https://github.com/%s/%s", owner, repo)

	_, err := git.PlainClone(path, false, &git.CloneOptions{
		URL: repoURL,
	})

	return err
}
