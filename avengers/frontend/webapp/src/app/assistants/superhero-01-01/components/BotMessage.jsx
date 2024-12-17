import React from 'react';
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import {
    ChatBubble,
    ChatBubbleAction,
    ChatBubbleAvatar,
    ChatBubbleMessage,
  } from "@/app/components/ui/shad/chat/chat-bubble";
  import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/shad/avatar";
  import {
    CopyIcon,
    CornerDownLeft,
    Mic,
    Paperclip,
    RefreshCcw,
    Volume2,
  } from "lucide-react";

  const ChatAiIcons = [
    {
      icon: CopyIcon,
      label: "Copy",
    },
    {
      icon: RefreshCcw,
      label: "Refresh",
    },
    {
      icon: Volume2,
      label: "Volume",
    },
  ];

import { CodeIssuesViewer } from './CodeIssuesViewer';

export const BotMessage = ({ message, isLoading = false,index}) => {
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
      case 'json':
        return <CodeIssuesViewer data={message.value} />;
      default:
        return null;
    }
  };

  return (
    <ChatBubble key={index} 
      variant="received">
      <Avatar>
        <AvatarImage
          src=""
          alt="Avatar"
          className={message.role === "ai" ? "dark:invert" : ""}
        />
        <AvatarFallback>
           🤖 
        </AvatarFallback>
      </Avatar>
      <ChatBubbleMessage isLoading={isLoading}
      className="bg-blue-100">
        {renderMessageContent()}
      </ChatBubbleMessage>
    </ChatBubble>
  );
};