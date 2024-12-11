import React from 'react';
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

export const BotMessage = ({ message, isLoading = false }) => {
  const renderMessageContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      );
    }

    switch (message.type) {
      case 'text':
        return <p className="text-sm">{message.value}</p>;
      case 'file':
        return <p className="text-sm">Uploaded file: {message.value.name}</p>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-3 max-w-[75%]",
        "bg-muted text-muted-foreground"
      )}
    >
      {renderMessageContent()}
    </div>
  );
};