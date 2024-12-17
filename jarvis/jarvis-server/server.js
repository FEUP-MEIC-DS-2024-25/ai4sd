import express from "express";
import bodyParser from "body-parser";
import { uploadRepo } from "../jarvis-writer/writer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook", async (req, res) => {
    try {
        const event = req.headers["x-github-event"];
        if (event === "push") {
            const { repository, ref } = req.body;
            console.log(`Push event received for ${repository.full_name} on branch ${ref}`);

            // Trigger `uploadRepo` for the repository
            const org = repository.owner.name || repository.owner.login;
            const repo = repository.name;

            try {
                await uploadRepo(octokit, org, repo);
                console.log(`Successfully processed repository ${repo}`);
            } catch (err) {
                console.error(`Error processing repository ${repo}:`, err.message);
            }
        }

        res.status(200).send("Webhook processed");
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(500).send("Internal server error");
    }
});

app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});
