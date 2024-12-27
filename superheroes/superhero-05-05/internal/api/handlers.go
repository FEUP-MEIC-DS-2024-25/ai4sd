package api

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/assistant"
	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/github"
	"github.com/gin-gonic/gin"
)

var (
	chats = make(map[string]*assistant.Assistant)
	mu    sync.Mutex
)

// SetupRoutes configures the API routes
func SetupRoutes(r *gin.Engine) {
	r.GET("/issues", getIssues)
	r.GET("/issues/:number", getIssue)

	r.POST("/chat", chat)
	r.POST("/chat/:id", ask)
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

	issueNumber, err := strconv.Atoi(c.Param("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid issue number"})
		return
	}

	issue, err := github.FetchIssue(owner, repo, issueNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, issue)
}

// chat is a handler that starts a chat with an AI assistant
func chat(c *gin.Context) {
	owner := c.Query("owner")
	repo := c.Query("repo")

	issueNumber, err := strconv.Atoi(c.Query("issue"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid issue number"})
		return
	}

	issue, err := github.FetchIssue(owner, repo, issueNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	assistant, err := assistant.New()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	mu.Lock()
	id := strconv.Itoa(len(chats))
	chats[id] = assistant
	mu.Unlock()

	content, err := assistant.Init(issue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id, "content": content})
}

// ask is a handler that asks the AI assistant a question
func ask(c *gin.Context) {
	id := c.Param("id")
	assistant, ok := chats[id]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid chat ID"})
		return
	}

	var req struct {
		Message string `json:"message"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	resp, err := assistant.Ask(req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"content": resp})
}
