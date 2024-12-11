import React from 'react';
import { cn } from "@/app/lib/utils";
import { BotMessage } from './BotMessage';
import { UserMessage } from './UserMessage';

export const ChatMessage = ({ 
  message, 
  variant = 'sent', 
  index, 
  isLoading = false 
}) => {
  // Determine message type (text or file)
  const messageType = message.message.type;

  // Render different message components based on role and type
  const renderMessageContent = () => {
    switch (message.role) {
      case 'ai':
        return (
          <BotMessage 
            message={message.message} 
            isLoading={isLoading} 
          />
        );
      case 'user':
        return (
          <UserMessage 
            message={message.message} 
            isLoading={isLoading} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 max-w-full",
        variant === 'sent' ? "flex-row-reverse" : "flex-row"
      )}
    >
      {renderMessageContent()}
    </div>
  );
};