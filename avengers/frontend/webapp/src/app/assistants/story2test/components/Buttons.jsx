import {useRouter} from "next/navigation";

const CreateNewConversationButton = () => {
    const router = useRouter();

    const handleCreateNewConversation = () => {
        let conversations = JSON.parse(localStorage.getItem("story2test_conversations")) || [];

        const lastId = conversations.length > 0 ? Math.max(...conversations.map(conv => parseInt(conv.id))) : 0;
        const newId = lastId + 1;

        const newConversation = {
            id: `${newId}`,
            name: `Chat ${newId}`,
            messages: [
                {
                    content: "Welcome! I am here to help you convert your user stories into acceptance tests. How can I assist you today?",
                    sender: "bot"
                }
            ]
        };

        conversations.push(newConversation);

        localStorage.setItem("story2test_conversations", JSON.stringify(conversations));

        router.push(`/assistants/story2test/${newConversation.id}`);
    };

    return (
        <button
            onClick={handleCreateNewConversation}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
            New Chat
        </button>
    );
};

const DeleteConversationButton = ({conversation}) => {
    const router = useRouter();

    const handleDeleteConversation = () => {
        let conversations = JSON.parse(localStorage.getItem("story2test_conversations")) || [];
        let conversationId = conversation.id

        conversations = conversations.filter(conv => conv.id !== conversationId);

        localStorage.setItem("story2test_conversations", JSON.stringify(conversations));

        router.push("/assistants/story2test");
    };

    return (
        <button
            onClick={handleDeleteConversation}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        >
            Delete Chat
        </button>
    );
};

const ButtonContainer = ({conversation}) => {
    return (
        <div className="w-full">
            <div className="flex w-full justify-between">
                <CreateNewConversationButton className="w-full"/>
                <DeleteConversationButton className="w-full" conversation={conversation}/>
            </div>
        </div>
    );
};

export default ButtonContainer;
