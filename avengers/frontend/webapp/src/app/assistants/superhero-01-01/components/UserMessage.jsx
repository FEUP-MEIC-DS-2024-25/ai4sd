import React from 'react';
import { cn } from "@/app/lib/utils";

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

export const UserMessage = ({ message, isLoading = false, index }) => {
  if (isLoading) return null;

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return message.value;
      case 'file':
        return <p className="text-sm">Uploaded file: {message.value.name}</p>;
      default:
        return null;
    }
  };

  return (
      <ChatBubble key={index} variant="sent">
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/9.x/pixel-art/svg"
            alt="Avatar"
            className=""
          />
          <AvatarFallback>
            "GG"
          </AvatarFallback>
        </Avatar>
        <ChatBubbleMessage isLoading={isLoading}
        className='p-3 font-normal text-sm bg-gray-100 text-gray-800'>
          {renderMessageContent()}
        </ChatBubbleMessage>
      </ChatBubble>
  );
};