const axios = require("axios");

async function fetchPythonFiles(repoUrl) {
    const repoPath = repoUrl.replace("https://github.com/", "");
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents`;

    try {
        const response = await axios.get(apiUrl);
        const files = response.data;

        const pythonFiles = files.filter(file => file.name.endsWith(".py"));

        for (const file of pythonFiles) {
            const fileResponse = await axios.get(file.download_url);
            console.log(`File: ${file.name}`);
            console.log(fileResponse.data);
        }
    } catch (error) {
        console.error("Error fetching files:", error.message);
    }
}

fetchPythonFiles("https://github.com/dbarnett/python-helloworld");
