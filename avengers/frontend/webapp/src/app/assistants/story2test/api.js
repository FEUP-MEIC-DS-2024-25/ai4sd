export const getConversations = () => {
    const storedConversations = JSON.parse(localStorage.getItem("story2test_conversations"));
    if (!storedConversations || storedConversations.length === 0) {
        const defaultConversation = [
            {
                id: "1", name: "Chat 1", messages: [{
                    content: "Welcome! I am here to help you convert your user stories into acceptance tests. How can I assist you today?",
                    sender: "bot"
                }]
            }
        ];
        localStorage.setItem("story2test_conversations", JSON.stringify(defaultConversation));
        localStorage.setItem("story2test_conversation_id", "1");
        return defaultConversation;
    }
    localStorage.setItem("story2test_conversation_id", storedConversations[0].id);
    return storedConversations;
};
