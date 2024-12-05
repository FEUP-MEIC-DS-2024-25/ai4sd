import { useEffect, useState } from "react";
import axios from "axios";

export default function useAssistHistory(initialId) {
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState(initialId);
    const [conversationExists, setConversationExists] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/history")
            .then(response => {
                if (response.status === 200) {
                    if (response.data && response.data.length > 0) {
                        // Organize the data
                        response.data.forEach((item) => {
                            item.text = item.description;
                            item.link = `/assistants/featurecraft/${item.id}`;
                        });
                        // Check if the conversation ID exists
                        const conversation = response.data.find(item => item.id === initialId);
                        if (!conversation) {
                            setConversationExists(false);
                        } else {
                            setConversationExists(true);
                        }
                        return response.data;
                    }
                    return [{ text: "Nothing to show yet.", link: "" }];
                } else {
                    throw new Error("Unexpected response status");
                }
            })
            .then(data => setAssistHistory(data))
            .catch(error => {
                setError("Error connecting to the backend.\n" + error);
            });

    }, [initialId]);

    return { assistHistory, setAssistHistory, conversationId, setConversationId, conversationExists, error, setError };
}