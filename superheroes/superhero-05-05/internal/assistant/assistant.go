package assistant

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"

	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/github"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

const modelName = "gemini-1.5-flash"

// Assistant represents an AI coding assistant
type Assistant struct {
	context context.Context
	client  *genai.Client
	model   *genai.GenerativeModel
	chat    *genai.ChatSession
}

// New creates a new AI coding assistant
func New() (*Assistant, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load environment variables: %w", err)
	}

	ctx := context.Background()
	client, err := genai.NewClient(
		ctx,
		option.WithAPIKey(os.Getenv("GEMINI_API_KEY")),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	model := client.GenerativeModel(modelName)
	chat := model.StartChat()

	_, err = chat.SendMessage(ctx, genai.Text(`
		Your name is Sam. You will make the role of an AI coding assistant. In this specific case,
		you will be given the file tree of a git repository and then the contents of each file.
		Then the user will ask you for help implementing certain 'issues' that exist in their github repository,
		but initially they only want a natural language description on how to implement these changes.
		You should answer concisely, generating a 'list' of steps, where 
		you first write the name of the file that needs changes and then
		instructions (in natural language) of what they need to add/change in that file.
	`))
	if err != nil {
		return nil, fmt.Errorf("failed to send message: %w", err)
	}

	return &Assistant{
		context: ctx,
		client:  client,
		model:   model,
		chat:    chat,
	}, nil
}

// Init initializes the AI coding assistant with an issue
func (a *Assistant) Init(issue *github.Issue) (string, error) {
	_, err := a.chat.SendMessage(a.context, genai.Text(fmt.Sprintf(`
		You have been asked for help with the following issue:
		%s
		%s

        Please remember to only use natural language to describe the steps to implement this issue.
	`, issue.Title, issue.Body)))
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}

	if err := a.feedContext(issue.GetOwner(), issue.GetRepo()); err != nil {
		return "", err
	}

	resp, err := a.chat.SendMessage(
		a.context,
		genai.Text("What are the steps to implement this issue?"),
	)
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}

	for _, candidate := range resp.Candidates {
		if candidate.Content != nil {
			for _, part := range candidate.Content.Parts {
				return fmt.Sprintf("```%s```", part), nil
			}
		}
	}

	return "", fmt.Errorf("no response from assistant")
}

// Ask asks the AI coding assistant a question
func (a *Assistant) Ask(message string) (string, error) {
	resp, err := a.chat.SendMessage(a.context, genai.Text(message))
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}

	for _, candidate := range resp.Candidates {
		if candidate.Content != nil {
			for _, part := range candidate.Content.Parts {
				return fmt.Sprintf("```%s```", part), nil
			}
		}
	}

	return "", fmt.Errorf("no response from assistant")
}

// readFile reads the contents of a file
func readFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	return string(content), nil
}

// feedContext feeds the AI coding assistant with the contents of a git repository
func (a *Assistant) feedContext(owner, repo string) error {
	path := fmt.Sprintf("%s/%s/%s", os.TempDir(), owner, repo)
	supportedLangs := []string{".rs", ".go", ".py", ".js", ".ts", ".c", ".cpp", ".java", ".scala", ".cs", ".dart", ".html", ".rb", ".swift"}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := github.CloneRepository(owner, repo, path); err != nil {
			return fmt.Errorf("failed to clone repository: %w", err)
		}
	}

	var files []string
	if err := filepath.Walk(path, func(file string, info os.FileInfo, err error) error {
		if info.IsDir() || strings.HasPrefix(file, ".") {
			return nil
		}

		for _, lang := range supportedLangs {
			if strings.HasSuffix(file, lang) {
				files = append(files, file)
			}
		}

		return nil
	}); err != nil {
		return fmt.Errorf("failed to walk directory: %w", err)
	}

	var content []string
	for _, file := range files {
		fileContent, err := readFile(file)
		if err != nil {
			return err
		}

		content = append(content, fmt.Sprintf("```%s\n%s\n```", file, fileContent))
	}

	content = append(content, `Please remember to only use natural language to describe the steps to implement this issue.`)

	_, err := a.chat.SendMessage(a.context, genai.Text(strings.Join(content, "\n")))

	return err
}
