import { useEffect, useState } from "react";
import axios from "axios";

export default function useAssistHistory(initialId) {
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState(initialId);
    const [conversationExists, setConversationExists] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/history")
            .then(response => {
                if (response.status === 200) {
                    if (response.data && response.data.length > 0) {
                        const MAX_DESC_LENGTH = 130;
                        
                        // Organize the data
                        response.data.forEach((item) => {
                            // Truncate description if too long
                            const truncated = item.description.length > MAX_DESC_LENGTH 
                                ? item.description.substring(0, MAX_DESC_LENGTH) + ' ...'
                                : item.description;
                                
                            item.text = truncated;
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
            })
            .finally(() => {
                setLoading(false);
            });

    }, [initialId]);

    return { assistHistory, setAssistHistory, conversationId, setConversationId, conversationExists, error, loading, setError };
}