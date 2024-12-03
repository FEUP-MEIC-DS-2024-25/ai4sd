import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';
import showdown from 'showdown';
import * as analysisJson from './analysisType';

export async function execute(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'markdown.preview',
        'ArchiDetect Information',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );
  
      try {
        // Fetch GET request
        const apiResponse = await fetch('http://127.0.0.1:8000/api/analyze_repo/fs-feup/autonomous-systems');
        if (!apiResponse.ok) {
          throw new Error('Failed to fetch API response: ' + apiResponse.statusText);
        }
        const apiData = await apiResponse.json();
        console.log('GET response data:', apiData);
  
        // Read markdown content from the info.md file
        const markdownPath = path.join(context.extensionPath, 'src', 'superheroes', 'ArchiDetect', 'info.md');
        if (!fs.existsSync(markdownPath)) {
          throw new Error('Markdown file not found at: ' + markdownPath);
        }
        const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  
        // Convert Markdown to HTML using Showdown.js
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(markdownContent);
  
        // Generate HTML with API data included
        const apiDataHtml = converter.makeHtml(JSON.stringify(apiData, null, 2).replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>')
                    .replace(/  /g, '&nbsp;&nbsp;'));
  
        // Inject both markdown and API data into the webview
        panel.webview.html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1, h2, h3 { color: #fffff; }
              pre { background: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>ArchiDetect Information</h1>
            ${htmlContent}
            ${apiDataHtml}
          </body>
          </html>
        `;
      } catch (error) {
        console.error('Error occurred:', error);
        vscode.window.showErrorMessage('Failed to load ArchiDetect information. Check the console for details.');
      }
}