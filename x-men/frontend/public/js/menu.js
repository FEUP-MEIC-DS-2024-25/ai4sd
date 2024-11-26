const vscode = acquireVsCodeApi();

document.getElementById('submit').addEventListener('click', () => {
    const loc = document.getElementById('location');
    const locOption = loc.options[loc.selectedIndex].innerHTML;

    document.getElementById('submit').addEventListener('click', () => {
        vscode.postMessage({ command: 'location', text: locOption });
    });
});