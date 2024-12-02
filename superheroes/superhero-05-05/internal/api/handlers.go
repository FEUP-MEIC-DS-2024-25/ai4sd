package api

import (
	"net/http"
	"strconv"

	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/assistant"
	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/github"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API routes
func SetupRoutes(r *gin.Engine) {
	r.GET("/issues", getIssues)
	r.GET("/issues/:number", getIssue)

	r.GET("/ask", ask)
}

// getIssues is a handler that returns the issues of a GitHub repository
func getIssues(c *gin.Context) {
	owner := c.Query("owner")
	repo := c.Query("repo")

	issues, err := github.FetchIssues(owner, repo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, issues)
}

// getIssue is a handler that returns a GitHub issue
func getIssue(c *gin.Context) {
	owner := c.Query("owner")
	repo := c.Query("repo")

	number, err := strconv.Atoi(c.Param("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid issue number"})
		return
	}

	issue, err := github.FetchIssue(owner, repo, number)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, issue)
}

// ask is a handler that asks the assistant for help with a GitHub issue
func ask(c *gin.Context) {
	owner := c.Query("owner")
	repo := c.Query("repo")
	
	number, err := strconv.Atoi(c.Query("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid issue number"})
		return
	}

	issue, err := github.FetchIssue(owner, repo, number)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	assistant, err := assistant.NewAssistant()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer assistant.Close()

	resp, err := assistant.Ask(issue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": resp})
}
