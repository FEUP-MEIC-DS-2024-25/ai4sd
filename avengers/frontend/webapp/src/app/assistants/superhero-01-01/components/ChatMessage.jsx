import React from 'react';
import { cn } from "@/app/lib/utils";
import { BotMessage } from './BotMessage';
import { UserMessage } from './UserMessage';
import { AnimatePresence, motion } from "framer-motion";

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
            index={index}
          />
        );
      case 'user':
        return (
          <UserMessage 
            message={message.message} 
            isLoading={isLoading} 
            index={index}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
          key={index}
          layout
          initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.1 },
            layout: {
              type: "spring",
              bounce: 0.3,
              duration: index * 0.05 + 0.2,
            },
          }}
          style={{ originX: 0.5, originY: 0.5 }}
          className="flex flex-col gap-2 p-4"
        >
    <div 
      className={cn(
        "flex items-start gap-3 max-w-full",
        variant === 'sent' ? "flex-row-reverse" : "flex-row"
      )}
    >
      {renderMessageContent()}
    </div>
    </motion.div>
  );
};