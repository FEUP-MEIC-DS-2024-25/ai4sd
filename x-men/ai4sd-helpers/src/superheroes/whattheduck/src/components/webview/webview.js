const vscode = acquireVsCodeApi();

document.getElementById('refactorButton').addEventListener('click', () => {
    // Get all checked filters
    const filters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id);

    // Send the selected filters to the VS Code extension
    vscode.postMessage({ command: 'refactor', filters });
});

document.getElementById('saveButton').addEventListener('click', () => {
    // Save the checked filters to a json file
    const filters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.id);
    const json = JSON.stringify(filters);

    // Send the save command to the VS Code extension
        vscode.postMessage({ command: 'save', filters: json });
    });

document.getElementById('loadButton').addEventListener('click', () => {
    // Send the load command to the VS Code extension
    vscode.postMessage({ command: 'promptLoad' });
});

// Load the saved configuration
window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'load') {
        try {
            const filters = JSON.parse(message.filters);

            // Clear previously checked checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;  // Uncheck all checkboxes
            });

            // Make sure filters are not empty and load the checkbox states
            filters.forEach(filter => {
                const checkbox = document.getElementById(filter);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        } catch (error) {
            console.error('Error parsing filters:', error);
        }
    }
});