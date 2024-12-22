import { provideVSCodeDesignSystem, vsCodeButton, vsCodeCheckbox } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeCheckbox());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
    console.log("Webview loaded.");
    const saveOutputButton = document.getElementById('saveOutputButton');

    if (saveOutputButton) {
        console.log("Button found:", saveOutputButton);
        saveOutputButton.addEventListener("click", handleSaveOutputClick);
        console.log("Event listener added.");
    } else {
        console.error("saveOutputButton not found.");
    }
}

function handleSaveOutputClick() {
    console.log("Button clicked.");
    const resultText = document.getElementById('outputText')?.textContent;
    console.log("Result Text:", resultText);

    vscode.postMessage({
        command: 'saveOutput',
    });
}
