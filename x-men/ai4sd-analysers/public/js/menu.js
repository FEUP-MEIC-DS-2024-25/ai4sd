"use strict";

const vscode = acquireVsCodeApi();

document.getElementById('submit').addEventListener('click', () => {
    const locationElement = document.getElementById('location');
    const location = locationElement.value;

    const llmElement = document.getElementById('llm');
    const llm = llmElement.value;

    vscode.postMessage({
        location: location,
        llm: llm
    });
});