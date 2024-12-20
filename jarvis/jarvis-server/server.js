import express from "express";
import bodyParser from "body-parser";
import { processChanges } from "./payload_processer.js";
import { getAuthOctokit } from "../jarvis-fetcher/auth.js";
import { config } from "../config.js";
import { handleWebhookEvent } from "../jarvis-publisher/webhook-handler.js";

const app = express();
const PORT = process.env.PORT || 3000;
const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance

app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook", async (req, res) => {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    console.log(`Received GitHub webhook event: ${event}`);

    if (!event || !payload) {
        console.error("Missing event or payload data.");
        return res.status(400).send("Bad Request: Missing event or payload.");
    }

    if (event === "push") {
        const { repository, ref } = payload;
        const repo = repository?.name;
        const branch = ref?.split("/").pop();

        if (!repo || !branch) {
            console.error("Missing repository or branch information.");
            return res.status(400).send("Bad Request: Missing repository or branch info.");
        }

        console.log(`Push event received for ${repository.full_name} on branch ${branch}`);

        try {
            // Process the repository changes
            await processChanges(octokit, payload);
            console.log(`Successfully processed repository ${repo}`);
        } catch (err) {
            console.error(`Error processing repository ${repo}: ${err.message}`);
            return res.status(500).send("Internal Server Error: Failed to process changes.");
        }

        try {
            // Publish the webhook event to echo-jarvis
            await handleWebhookEvent(event, payload);
            console.log(`Successfully handled and published the event for ${repo}`);
            return res.status(200).send("Event received and processed.");
        } catch (err) {
            console.error("Error handling webhook event:", err);
            return res.status(500).send("Internal Server Error: Failed to handle event.");
        }
    }

    // Handle unsupported event types
    console.log(`Event type ${event} is not supported.`);
    return res.status(400).send(`Bad Request: Unsupported event type ${event}`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Webhook listener running on port ${PORT}`);
});
