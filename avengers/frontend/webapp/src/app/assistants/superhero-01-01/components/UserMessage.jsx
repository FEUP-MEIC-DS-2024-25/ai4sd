import React from 'react';
import { cn } from "@/app/lib/utils";

export const UserMessage = ({ message, isLoading = false }) => {
  if (isLoading) return null;

  const renderMessageContent = () => {
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
        "bg-primary text-primary-foreground"
      )}
    >
      {renderMessageContent()}
    </div>
  );
};