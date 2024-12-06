import styles from "@/app/page.module.css";

export default function ConversationNotFound() {
    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-3xl font-bold text-[#212529]">Conversation Not Found</h1>
                </div>
            </div>
        </div>
        
    );
}