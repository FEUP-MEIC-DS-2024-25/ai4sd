import styles from "@/app/page.module.css";
import NewMessageBlock from "@/app/featurecraft/components/newMessageBlock";
import MessageBlock from "@/app/featurecraft/components/messageBlock";

export default function FeaturecraftAssistant() {
    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg">
                <MessageBlock />
                <NewMessageBlock />
            </div>
        </div>
    )
}