package github

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/yuin/goldmark"
)

// Issue represents a GitHub issue
type Issue struct {
	Number int       `json:"number"`
	Title  string    `json:"title"`
	Body   string    `json:"body"`
	URL    string    `json:"html_url"`
	PR     *struct{} `json:"pull_request,omitempty"`
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
func FetchIssues(owner, repo string) ([]*Issue, error) {
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/issues", owner, repo)

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch issues: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch issues: %s", resp.Status)
	}

	var issues []*Issue
	if err := json.NewDecoder(resp.Body).Decode(&issues); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	var filtered []*Issue
	for _, issue := range issues {
		if issue.PR == nil {
			issue.Body, err = filterMarkdown(issue.Body)
			if err != nil {
				return nil, err
			}
			filtered = append(filtered, issue)
		}
	}

	return filtered, nil
}

// FetchIssue fetches a GitHub issue
func FetchIssue(owner, repo string, number int) (*Issue, error) {
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/issues/%d", owner, repo, number)

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch issue: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch issue: %s", resp.Status)
	}

	var issue *Issue
	if err := json.NewDecoder(resp.Body).Decode(&issue); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
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

// filterMarkdown filters the Markdown content of an issue
func filterMarkdown(body string) (string, error) {
	var buf bytes.Buffer
	if err := goldmark.Convert([]byte(body), &buf); err != nil {
		return "", fmt.Errorf("body Markdown conversion failed: %w", err)
	}
	return buf.String(), nil
}
