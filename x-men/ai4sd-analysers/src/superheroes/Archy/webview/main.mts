import { provideVSCodeDesignSystem, vsCodeButton, vsCodeCheckbox, Button  } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeCheckbox());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const saveOutputButton = document.getElementById('saveOutputButton');

  // Check if the element exists and is an HTMLButtonElement
  if (saveOutputButton && saveOutputButton instanceof HTMLButtonElement) {
    saveOutputButton.addEventListener("click", handleSaveOutputClick);
  } else {
    console.error("Button not found or is not a button element.");
  }
}


function handleSaveOutputClick() {

  const resultText = document.getElementById('outputText')?.textContent; // get the text content stored in the pre tag of the panel html
  vscode.postMessage({
    command: 'saveOutput',
  });
}
