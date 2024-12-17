import axios from "axios";

export default function useAssistChatReceive(
    conversationId,
    setConversationId,
    setAssistHistory,
    members,
    setMembers,
    description,
    setDescription,
    messages,
    setMessages,
    pinnedMessages,
    setPinnedMessages,
    totalMessages,
    setTotalMessages,
    error,
    setError
) {
    const handleReceiveMessage = (response) => {
        if (response.status === 200) {
            setMessages((prevMessages) => [
                ...prevMessages,
                response.data
            ]);
        } else if (response.status === 201) {
            setConversationId(response.data.id);
            setMembers(response.data.members);
            setDescription(response.data.description);
            const assistantResponse = response.data.messages[response.data.messages.length - 1];
            setMessages((prevMessages) => [
                ...prevMessages,
                assistantResponse
            ]);
            setPinnedMessages(response.data.pinnedMessages);
            setTotalMessages(response.data.totalMessages);

            setAssistHistory((prevHistory) => [
                {
                    text: response.data.description,
                    link: `/assistants/featurecraft/${response.data.id}`
                },
                ...prevHistory
            ]);
        } else {
            console.error(response);
        }
    };

    return {
        handleReceiveMessage
    };
}