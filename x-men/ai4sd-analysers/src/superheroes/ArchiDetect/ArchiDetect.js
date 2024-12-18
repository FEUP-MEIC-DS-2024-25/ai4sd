import * as vscode from "vscode";
import showdown from 'showdown';
import * as analysisJson from './analysisType';
export async function execute(context) {
    const panel = vscode.window.createWebviewPanel('markdown.preview', 'ArchiDetect Information', vscode.ViewColumn.Two, { enableScripts: true });
    try {
        // Fetch GET request
        // const apiResponse = await fetch('http://127.0.0.1:8080/api/analyze_repo/fs-feup/autonomous-systems');
        //future request?
        // const apiResponse = await fetch("https://superhero-06-01-150699885662.europe-west1.run.app/${repoOwner}/${repoName}");
        // if (!apiResponse.ok) {
        //   throw new Error('Failed to fetch API response: ' + apiResponse.statusText);
        // }
        // const apiData = await apiResponse.json();
        // console.log('GET response data:', apiData);
        //stub
        const apiResponse = `{
          "repositoryAnalysis": {
            "repoName": "SampleRepo",
            "lastCommitHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
            "analysisDate": "2024-12-04T14:00:00Z",
            "predictedDesignPatterns": [
              {
                "patternName": "Singleton",
                "confidence": 0.92,
                "evidence": [
                  {
                    "type": "file",
                    "path": "src/main/java/com/example/ConfigManager.java",
                    "reason": "Contains a private constructor and a static instance method, typical of Singleton pattern."
                  },
                  {
                    "type": "commit",
                    "path": "commit_hash_12345",
                    "reason": "Commit message mentions 'refactored to singleton for global config access'."
                  }
                ]
              },
              {
                "patternName": "Factory Method",
                "confidence": 0.87,
                "evidence": [
                  {
                    "type": "file",
                    "path": "src/main/java/com/example/shapes/ShapeFactory.java",
                    "reason": "Defines a method returning different Shape subclasses based on input type."
                  },
                  {
                    "type": "branch",
                    "path": "feature/shape-factory",
                    "reason": "Branch name explicitly refers to 'shape-factory', indicating development focus on this pattern."
                  }
                ]
              }
            ],
            "unusualPatterns": [
              {
                "description": "Custom variation of Singleton with thread-local storage.",
                "confidence": 0.78,
                "evidence": [
                  {
                    "type": "file",
                    "path": "src/main/java/com/example/ThreadLocalConfigManager.java",
                    "reason": "Uses thread-local variables to implement instance storage, diverging from traditional Singleton."
                  }
                ]
              },
              {
                "description": "Potential anti-pattern: Overuse of static methods.",
                "confidence": 0.65,
                "evidence": [
                  {
                    "type": "file",
                    "path": "src/main/java/com/example/Utility.java",
                    "reason": "Class consists entirely of static methods, which may lead to tight coupling."
                  }
                ]
              }
            ]
          },
          "meta": {
            "analyzedCommits": 325,
            "analyzedBranches": 12,
            "linesOfCode": 48237,
            "toolVersion": "1.0.0"
          }
        }`;
        const jsonData = JSON.parse(apiResponse);
        const markdownData = analysisJson.transformToMarkdown(jsonData);
        // Convert Markdown to HTML using Showdown.js
        const converter = new showdown.Converter();
        const responseContent = converter.makeHtml(markdownData);
        // Generate HTML with API data included
        // const apiDataHtml = converter.makeHtml(JSON.stringify(apiData, null, 2).replace(/</g, '&lt;')
        //             .replace(/>/g, '&gt;')
        //             .replace(/\n/g, '<br>')
        //             .replace(/  /g, '&nbsp;&nbsp;'));
        // Inject both markdown and API data into the webview
        panel.webview.html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ArchiDetect Information</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1, h2, h3 { color: #fffff; }
              pre { background: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            </style>
          </head>
          <body>
            ${responseContent}
          </body>
          </html>
        `;
    }
    catch (error) {
        console.error('Error occurred:', error);
        vscode.window.showErrorMessage('Failed to load ArchiDetect information. Check the console for details.');
    }
}
