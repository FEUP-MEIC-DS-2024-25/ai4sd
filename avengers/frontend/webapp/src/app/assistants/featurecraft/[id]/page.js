"use client"
import { useParams } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import FeaturecraftLayout from "@/app/assistants/featurecraft/components/assistantLayout";

export default function FeaturecraftConversationPage() {
    const { id } = useParams();
    const assistName = "FeatureCraft";
    const assistType = "req";

    return (
        <FeaturecraftLayout
            assistName={assistName}
            assistType={assistType}
            initialConversationId={id}
            isNewConversation={false}
        />
    )
}