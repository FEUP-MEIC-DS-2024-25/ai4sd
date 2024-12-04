"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleMessage,
} from "@/app/components/ui/chat/chat-bubble";
import { ChatInput } from "@/app/components/ui/chat/chat-input";
import { ChatMessageList } from "@/app/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { React } from "react";

export const Chatbot = () => {

  const message = {
    role: "ai",
    message: "Hello! How can I help you today?",
    isLoading: false,
  }

  const [input, setInput] = useState("");

  const [file, setFile] = useState(null);

  const handleSendMessage = (e) => {
    // prevent form submission
    e.preventDefault();
    // print in th econsole the message
    console.log(input);
    // clear the input field
    setInput("");
  }

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }

  return (
    <div className="flex bg-white dark:bg-neutral-950 h-full w-full flex-col">
      <ChatMessageList >
      <ChatBubble key={"0"} layout="ai">
        <Avatar className="size-8 border">
          <AvatarImage
            src={"https://api.dicebear.com/9.x/pixel-art/svg"}
            alt="Avatar"
            className={message.role === "ai" ? "dark:invert" : ""}
          />
          <AvatarFallback>
            {message.role === "ai" ? "🤖" : ""}
          </AvatarFallback>
        </Avatar>
        <ChatBubbleMessage isLoading={message.isLoading}>
          "{message.message}"
        </ChatBubbleMessage>
      </ChatBubble>
      </ChatMessageList>

      <form
          onSubmit={handleSendMessage}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              disabled={!input || isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
    </div>
  );
  /*
  return (
    <div className="h-full w-full">
      <div className="relative flex h-full flex-col rounded-xl bg-muted/40 p-4 lg:col-span-2">
        <ChatMessageList ref={messagesContainerRef}>
          {/* Chat messages *//*}
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(message.role!);
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
                  className="flex flex-col gap-2"
                >
                  <ChatBubble key={index} layout="ai">
                    <Avatar className="size-8 border">
                      <AvatarImage
                        src={message.role === "ai" ? "" : message.avatar}
                        alt="Avatar"
                        className={message.role === "ai" ? "dark:invert" : ""}
                      />
                      <AvatarFallback>
                        {message.role === "ai" ? "🤖" : ""}
                      </AvatarFallback>
                    </Avatar>
                    <ChatBubbleMessage isLoading={message.isLoading}>
                      {message.message}
                      {message.role === "ai" && (
                        <div className="flex items-center mt-1.5 gap-1">
                          {!message.isLoading && (
                            <>
                              {ChatAiIcons.map((icon, index) => {
                                const Icon = icon.icon;
                                return (
                                  <ChatBubbleAction
                                    className="size-6"
                                    key={index}
                                    icon={<Icon className="size-3" />}
                                  />
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ChatMessageList>
        <div className="flex-1" />
        <form
          ref={formRef}
          onSubmit={handleSendMessage}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              disabled={!input || isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
  */
}

