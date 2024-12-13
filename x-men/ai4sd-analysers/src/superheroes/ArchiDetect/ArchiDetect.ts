import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';
import showdown from 'showdown';
import * as analysisJson from './analysisType';
import * as repoInfo from "./repoInfo";


async function getSelectedServiceName() : Promise<string> {
  const options: vscode.QuickPickItem[] = [
    { label: "Full Analysis", description: "Analyses all the contents of the repository" },
    { label: "Analyse Issues", description: "Analysis based on Repository's Issues" },
    { label: "Analyse User Stories", description: "Analysis based on Repository's User Stories" },
    { label: "Analyse Commits", description: "Analysis based on Repository's commits" },
    { label: "Analyse Commit Sizes", description: "Analysis based on Repository's commit sizes" },
    { label: "Analyse Contributor Activity", description: "Analysis based on Repository's contributor activity" },
    { label: "Analyse Architetural Trends", description: "Analysis based on Repository's architetural trends" }
    ];
  
    // Show dropdown and await user's choice
    const selectedOption = await vscode.window.showQuickPick(options, {
    placeHolder: "Select a scope for the analysis",
    canPickMany: false
    });

    if (selectedOption) {
      switch (selectedOption.label) {
        case "Full Analysis":
          return "analyze_full_repo";
        case "Analyse Issues":
          return "analyze_repo_issues";
        case "Analyse User Stories":
          return "analyze_user_stories";
        case "Analyse Commits":
          return "analyze_commit";
        case "Analyse Commit Sizes":
          return "analyze_commit_sizes";
        case "Analyse Contributor Activity":
          return "analyze_contributor_activity";
        case "Analyse Architetural Trends":
          return "analyze_architeture_trends";
        default:
          vscode.window.showWarningMessage("Unknown analysis' type option selected");
          return "";
      }
    }
    else {
      vscode.window.showInformationMessage("No analysis' type option selected");
      return "";
    }
}

export async function execute(context: vscode.ExtensionContext) {
    const { repoOwner, repoName } = await repoInfo.getRepositoryInfo();
    const serviceName = await getSelectedServiceName();

    //vscode.window.showInformationMessage(`Analyzing repository: ${repoOwner}/${repoName} with service: ${serviceName}`);

    if (serviceName === "" || repoOwner === "" || repoName === "") {
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'markdown.preview',
      'ArchiDetect Information',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );
  
    try {
      // Fetch GET request
      const apiResponse = await fetch(`https://superhero-06-01-150699885662.europe-west1.run.app/api/${serviceName}/${repoOwner}/${repoName}`);
      
      // if (!apiResponse.ok) {
      //   throw new Error('Failed to fetch API response: ' + apiResponse.statusText);
      // }
      // const apiData = await apiResponse.json();
      // console.log('GET response data:', apiData);

      //stub
      //const apiResponse = 
      //`{
      //  "repositoryAnalysis": {
      //    "repoName": "SampleRepo",
      //    "lastCommitHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      //    "analysisDate": "2024-12-04T14:00:00Z",
      //    "predictedDesignPatterns": [
      //      {
      //        "patternName": "Singleton",
      //        "confidence": 0.92,
      //        "evidence": [
      //          {
      //            "type": "file",
      //            "path": "src/main/java/com/example/ConfigManager.java",
      //            "reason": "Contains a private constructor and a static instance method, typical of Singleton pattern."
      //          },
      //          {
      //            "type": "commit",
      //            "path": "commit_hash_12345",
      //            "reason": "Commit message mentions 'refactored to singleton for global config access'."
      //          }
      //        ]
      //      },
      //      {
      //        "patternName": "Factory Method",
      //        "confidence": 0.87,
      //        "evidence": [
      //          {
      //            "type": "file",
      //            "path": "src/main/java/com/example/shapes/ShapeFactory.java",
      //            "reason": "Defines a method returning different Shape subclasses based on input type."
      //          },
      //          {
      //            "type": "branch",
      //            "path": "feature/shape-factory",
      //            "reason": "Branch name explicitly refers to 'shape-factory', indicating development focus on this pattern."
      //          }
      //        ]
      //      }
      //    ],
      //    "unusualPatterns": [
      //      {
      //        "description": "Custom variation of Singleton with thread-local storage.",
      //        "confidence": 0.78,
      //        "evidence": [
      //          {
      //            "type": "file",
      //            "path": "src/main/java/com/example/ThreadLocalConfigManager.java",
      //            "reason": "Uses thread-local variables to implement instance storage, diverging from traditional Singleton."
      //          }
      //        ]
      //      },
      //      {
      //        "description": "Potential anti-pattern: Overuse of static methods.",
      //        "confidence": 0.65,
      //        "evidence": [
      //          {
      //            "type": "file",
      //            "path": "src/main/java/com/example/Utility.java",
      //            "reason": "Class consists entirely of static methods, which may lead to tight coupling."
      //          }
      //        ]
      //      }
      //    ]
      //  },
      //  "meta": {
      //    "analyzedCommits": 325,
      //    "analyzedBranches": 12,
      //    "linesOfCode": 48237,
      //    "toolVersion": "1.0.0"
      //  }
      //}`;

      let apiString = await apiResponse.text();

      if (!apiResponse.ok){
        const errorjson = JSON.parse(apiString);
        vscode.window.showErrorMessage(errorjson.error);
        return;
      }

      console.log('GET response full data:', apiString);
      apiString = apiString.substring(10, apiString.length - 8);
      apiString = apiString.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\/g, '');
      console.log('GET response data:', apiString);
      
      const jsonData : analysisJson.AnalysisJson = JSON.parse(apiString);
      console.log("JSON: ", jsonData);
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
    } catch (error) {
      console.error('Error occurred:', error);
      vscode.window.showErrorMessage('Failed to load ArchiDetect information. Check the console for details.');
    }
}