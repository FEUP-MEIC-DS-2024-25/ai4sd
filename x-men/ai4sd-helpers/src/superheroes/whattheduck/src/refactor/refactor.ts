import * as vscode from 'vscode';
import { MyProvider } from './provider';
import * as db from '../components/databaseManager';
import * as settings from '../components/settings';
import * as path from "path";

export async function refactor(filters: string[]) {
  if (
    filters.length === 0 ||
    (filters.length === 1 && filters[0] === "refactorMultipleFiles")
  ) {
    vscode.window.showErrorMessage("No filters selected.");
    return;
  }


  let customInput: string | undefined = undefined;
  if (filters.includes('customInput')) {
      customInput = await vscode.window.showInputBox({
          placeHolder: 'Enter your custom input',
      });
  }

  if (!filters.includes("refactorMultipleFiles")) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    const languageSettings = settings.getSettings().getLanguageSettings();
    const language = editor.document.uri.path.split('.').pop() || '';

    if (!languageSettings[language]) {
        vscode.window.showErrorMessage('Language not supported. Please enable it in the settings, if possible.');
        return;
    }

    const document = editor.document;
    let code = "";
    let selection = null;
    let selected = false;

    // Get the selected text or the entire document
    if (editor.selection.isEmpty) {
      code = document.getText();
    } else {
      code = document.getText(editor.selection);
      selection = editor.selection;
      selected = true;
    }

    await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: getProgressMessage(),
      cancellable: false
    },
    async () => {
      let response: { code: string | null, explanation: string | null } | null = null;
      try {
          response = await fetchRefactorResponse(code, language, filters, customInput);
      } catch (error) {
          vscode.window.showErrorMessage('An error occurred while fetching response.');
          await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, true, '', false);
          return null;
      }

      if (!response || response.code === null) {
          vscode.window.showErrorMessage('Failed to refactor code.');
          await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, true, '', false);
          return null;
      }

      return response;
    }).then(async (response) => {
      if (!response) {
          return;
      }

      const { code: newText, explanation } = response;

      if (explanation) {
          await showExplanation(explanation);
      }

      if (!newText) {
          return;
      }

      const refactoredCode = getRefactoredCode(editor, newText, selection);

      const provider = new MyProvider();
      vscode.workspace.registerTextDocumentContentProvider('refactor', provider);

      const uri = vscode.Uri.parse(`refactor://authority/refactor.${language}`);

      provider.updateContent(uri, refactoredCode);

      await showDiff(editor.document.uri, uri);
      const acceptedChanges: boolean = await showQuickPick(editor, newText, filters, selection, customInput);
      await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, false, newText, acceptedChanges);
    });
  } else {
    const editors = vscode.window.visibleTextEditors;
    if (editors.length === 0) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    let bigExplanation = "";

    const changes: { originalUri: vscode.Uri; refactorUri: vscode.Uri }[] = [];

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: getProgressMessage(),
        cancellable: false,
      },
      async () => {
        const provider = new MyProvider();
        vscode.workspace.registerTextDocumentContentProvider(
          "refactor",
          provider
        );

        for (const editor of editors) {
          const document = editor.document;
          const code = document.getText();
          const language2 = editor.document.uri.path.split(".").pop() || "";
          let response: { code: string | null, explanation: string | null } | null = null;
          try {
            response = await fetchRefactorResponse(code, language2, filters, customInput);
          } catch (error) {
            vscode.window.showErrorMessage(
              "An error occurred while fetching response."
            );
            await db
            .getDatabaseManager()
            .insertRecord(code, filters.join(", "), false, true, "", false);
            return;
          }

          if (response === null || response.code === null) {
            vscode.window.showErrorMessage("Failed to refactor code.");
            await db
              .getDatabaseManager()
              .insertRecord(code, filters.join(", "), false, true, "", false);
            return;
          }
          const {code:newText, explanation} = response;

          if(explanation) {
            bigExplanation += explanation + "\n";
          }

          if(!newText) {
            return;
          }

          const language = editor.document.uri.path.split(".").pop();
          const fileName = path.parse(document.fileName).name;
          const uri = vscode.Uri.parse(
            `refactor://authority/refactor_${fileName}.${language}`
          );
          provider.updateContent(uri, newText);

          // Store the changes for later application
          changes.push({ originalUri: document.uri, refactorUri: uri });

          // POR ALGUMA RAZÃO SEM ESTE LOG O CÓDIGO NÃO FUNCIONA :)
          console.log(
            "nText: ",
            (await vscode.workspace.openTextDocument(uri)).getText()
          );
        }

        await showMultipleDiffs(changes);
        const acceptedChanges:boolean = await showQuickPickMultiple(changes);
        await showExplanation(bigExplanation);

        for (const change of changes) {
            const code = (await vscode.workspace.openTextDocument(change.originalUri)).getText();
            const newText = (await vscode.workspace.openTextDocument(change.refactorUri)).getText();
            await db
                .getDatabaseManager()
                .insertRecord(
                    code,
                    filters.join(", "),
                    false,
                    false,
                    newText,
                    acceptedChanges
                );
        }

      }
    );
  }
}


function getProgressMessage() {
    const progressMsgs = [
        'Floating through a bath of refactorings... hold tight!',
        "Loading... waddling as fast as we can!",
        "Bubbling up your results... almost there!",
        "Patience is floating! Just a few more bubbles...",
    ];

    return progressMsgs[Math.floor(Math.random() * progressMsgs.length)];
}

async function showQuickPickMultiple(
  changes: { originalUri: vscode.Uri; refactorUri: vscode.Uri }[]
): Promise<boolean> {
  const quickPick = vscode.window.showQuickPick(["Accept All", "Reject All"], {
    placeHolder: "Do you want to accept all the changes?",
  });

  let pick = false;
  quickPick.then(async (value) => {
    const editorGroups = vscode.window.tabGroups.all;

    if (value === "Accept All") {
      for (const change of changes) {
        const document = await vscode.workspace.openTextDocument(
          change.refactorUri
        );
        const edit = await vscode.window.showTextDocument(change.originalUri, {
          preview: false,
        });

        await edit.edit((editBuilder) => {
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          );
          editBuilder.replace(fullRange, document.getText());
        });
      }
      pick = true;
    }
  });
  return pick;
}
async function showMultipleDiffs(
  diffs: { originalUri: vscode.Uri; refactorUri: vscode.Uri }[]
) {
  if (diffs.length === 0) {
    vscode.window.showErrorMessage("No diffs to display.");
    return;
  }

  // Open remaining diffs in split view
  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];
    const diffName = path.parse(diff.originalUri.fsPath).name + " Refactor";

    // Open the diff in the newly created group
    await vscode.commands.executeCommand(
      "vscode.diff",
      diff.originalUri,
      diff.refactorUri,
      diffName
    );

    // Focus the newly created editor group
    await vscode.commands.executeCommand(`workbench.action.focusNextGroup`);
  }
}


async function fetchRefactorResponse(code: string, language: string, filters: string[], customInput: string | undefined): Promise<{ code: string | null, explanation: string | null }> {
  const response = await fetch('http://localhost:3200/refactor', {
      method: 'POST',
      body: JSON.stringify({ code, language, filters, customInput }),
      headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
      throw new Error(`Backend returned error: ${response.statusText}`);
  }

  const result: any = await response.json();
  if (!result.response) {
      return { code: null, explanation: null };
  }

  let newText = result.response;
  let newTextSplitted = newText.split("```");

  let explanation = "";

  if (!filters.some(f => ['analyseTimeComplexity', 'analyseSpaceComplexity', 'highExpensiveOperations'].includes(f))) {
      if (newTextSplitted.length !== 1) {
          newText = newTextSplitted[1];
          newText = newText.split("\n").slice(1).join("\n");
      }
  }
  else {
      if (newTextSplitted.length > 1) {
          explanation = newTextSplitted[2].trim();  // First part before the code block contains the explanation
          newText = newTextSplitted[1].split("\n").slice(1).join("\n"); // The actual refactored code
      }
  }

  return { code: newText, explanation: explanation };
} 

function getRefactoredCode(
  editor: vscode.TextEditor,
  newText: string,
  selection: vscode.Selection | null
) {
  const document = editor.document;

  if (selection) {
    const fullText = document.getText();
    const startOffset = document.offsetAt(selection.start);
    const endOffset = document.offsetAt(selection.end);

    return fullText.slice(0, startOffset) + newText + fullText.slice(endOffset);
  }

  return newText;
}

async function showDiff(originalUri: vscode.Uri, refactorUri: vscode.Uri) {
  await vscode.commands.executeCommand(
    "vscode.diff",
    originalUri,
    refactorUri,
    "Refactor Preview"
  );
}

async function showQuickPick(editor: vscode.TextEditor, newText: string, filters: string[], selection: vscode.Selection | null, customInput: string | undefined = undefined): Promise<boolean> {
    const value = await vscode.window.showQuickPick(['Accept', 'Reject', 'Re-generate'], {
        placeHolder: 'What do you want to do?',
    });

    vscode.commands.executeCommand('workbench.action.closeActiveEditor');

  if (value === "Accept") {
    const document = await vscode.workspace.openTextDocument(
      editor.document.uri
    );
    const edit = await vscode.window.showTextDocument(document, {
      preview: false,
    });

    await edit.edit((editBuilder) => {
      if (selection) {
        // Replace only the selected text
        editBuilder.replace(selection, newText);
      } else {
        // Replace the entire document
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        );
        editBuilder.replace(fullRange, newText);
      }
    });

        return true;
    }
    else if (value === 'Re-generate') {
        return await regenerate(editor, newText, filters, selection, customInput);
    }

    return false;
}

async function regenerate(editor: vscode.TextEditor, newText: string, filters: string[], selection: vscode.Selection | null, customInput: string | undefined = undefined): Promise<boolean> {
    
    const document = await vscode.workspace.openTextDocument(editor.document.uri);
    const newDocument = editor.document;

    let code = "";
    let refactoredCode = "";
    let selected = false;

    if (selection) {
        code = document.getText(selection);
        refactoredCode = newText;
        selected = true;
    } else {
        code = document.getText();
        refactoredCode = newDocument.getText();
    }

    const language = editor.document.uri.path.split('.').pop() || 'txt';

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: getProgressMessage(),
            cancellable: false
        },
        async () => {
            let newText: string | null = null;
            try {
                newText = await fetchRegenerateResponse(code, language, refactoredCode, filters, customInput);
            } catch (error) {
                vscode.window.showErrorMessage('An error occurred while fetching response.');
                await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, true, '', false);
                return;
            }
            
            if (newText === null) {
                vscode.window.showErrorMessage('Failed to refactor code.');
                await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, true, '', false);
                return;
            }

            return newText;
        
        }).then(async (newText) => {
            if (!newText) {
                return;
            }
        
            const newRefactoredCode = getRefactoredCode(editor, newText, selection);

            const provider = new MyProvider();
            vscode.workspace.registerTextDocumentContentProvider('regenerate', provider);

            const language = editor.document.uri.path.split('.').pop() || 'txt';
            const uri = vscode.Uri.parse(`regenerate://authority/regenerate.${language}`);
            provider.updateContent(uri, newRefactoredCode);

            await showDiff(editor.document.uri, uri);
            const accepetedChanges: boolean = await showQuickPick(editor, newText, filters, selection);
            await db.getDatabaseManager().insertRecord(code, filters.join(', '), selected, false, newText, accepetedChanges);
            return accepetedChanges;
        });
        return false;
}

async function fetchRegenerateResponse(code: string, language: string, refactoredCode: string, filters: string[], customInput: string | undefined = undefined): Promise<string | null> {
    const response = await fetch('http://localhost:3200/regenerate', {
        method: 'POST',
        body: JSON.stringify({ code: code, language: language, refactoredCode: refactoredCode, filters: filters, customInput: customInput }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Backend returned error: ${response.statusText}`);
    }

    const result: any = await response.json();
    if (!result.response) {
        return null;
    }

    let newText = result.response;
    let newTextSplitted = newText.split("```");

    if (newTextSplitted.length !== 1) {
        newText = newTextSplitted[1];
        newText = newText.split("\n").slice(1).join("\n");
    }
    return newText;
}

async function showExplanation(explanation: string) {
    // Create an output channel for the explanation
    const explanationChannel = vscode.window.createOutputChannel('Refactor Explanation');
    explanationChannel.clear();
    explanationChannel.appendLine('### Refactor Explanation ###');
    explanationChannel.appendLine('');
    explanationChannel.appendLine(explanation);
    explanationChannel.show(true); // Show the output channel at the bottom
}
