import { provideVSCodeDesignSystem, vsCodeButton, vsCodeCheckbox, Button  } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeCheckbox());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function execute() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  const saveOutputButton = document.getElementById('saveOutputButton') as Button;
  saveOutputButton?.addEventListener("click", handleSaveOutputClick);
}

function handleSaveOutputClick() {

  const resultText = document.getElementById('outputText')?.textContent; // get the text content stored in the pre tag of the panel html
  vscode.postMessage({
    command: 'saveOutput',
  });
}
