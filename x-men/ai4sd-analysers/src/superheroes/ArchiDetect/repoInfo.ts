import * as vscode from "vscode";

export async function getCurrentRepositoryInfo() : Promise<{repoOwner: string, repoName: string}> {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) {
        vscode.window.showErrorMessage("Git extension not found.");
        return { repoOwner: "", repoName: "" };
    }

    const api = gitExtension.getAPI(1);
    const repositories = api.repositories;

    if (repositories.length === 0) {
        vscode.window.showErrorMessage("No repositories found.");
        return { repoOwner: "", repoName: "" };
    }

    // Get the first repository's remote URL
    const remoteUrl = repositories[0].state.remotes[0]?.fetchUrl;
    if (!remoteUrl) {
        vscode.window.showErrorMessage("No remote URL found.");
        return { repoOwner: "", repoName: "" };
    }

    // Extract owner and repository name
    const match = remoteUrl.match(/github\.com[:\/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
        const repoOwner = match[1];
        const repoName = match[2];
        vscode.window.showInformationMessage(`Repository: ${repoOwner}/${repoName}`);
        return { repoOwner, repoName };
    } else {
        vscode.window.showErrorMessage("Not a GitHub repository.");
        return { repoOwner: "", repoName: "" };
    }
}

export async function getRepositoryInfo() : Promise<{repoOwner: string, repoName: string}> {
    const options: vscode.QuickPickItem[] = [
        { label: "Current Repository", description: "Use the current repository" },
        { label: "Other Repository", description: "Manually input the repository information" }
    ];

    const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select a repository",
        canPickMany: false
    });

    if (selectedOption) {
        switch (selectedOption.label) {
            case "Current Repository":
                return getCurrentRepositoryInfo();
            case "Other Repository":
                const repoOwner = await vscode.window.showInputBox({
                    placeHolder: "Owner of the repository"
                });
                const repoName = await vscode.window.showInputBox({
                    placeHolder: "Name of the repository"
                });
                return {repoOwner: repoOwner || "", repoName: repoName || ""};
            default:
                vscode.window.showWarningMessage("Unknown repository option selected");
        }
    }
    vscode.window.showInformationMessage("No repository option selected");
    return {repoOwner: "", repoName: ""};
}