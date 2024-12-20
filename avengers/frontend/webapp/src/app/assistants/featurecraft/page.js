"use client"
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import FeaturecraftLayout from "@/app/assistants/featurecraft/components/assistantLayout";

export default function Interactor() {
    const assistName = "FeatureCraft";
    const assistType = "req";
    const newConversationId = "";

    return (
        <FeaturecraftLayout
            assistName={assistName}
            assistType={assistType}
            initialConversationId={newConversationId}
            isNewConversation={true}
        />
    );
}