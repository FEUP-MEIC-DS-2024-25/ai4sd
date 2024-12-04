"use client";

import { Button } from "@/app/components/ui/shad/button";
import { ChatInput } from "@/app/components/ui/shad/chat/chat-input";
import { ChatMessageList } from "@/app/components/ui/shad/chat/chat-message-list";
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
import {ChatMessage} from './ChatMessage';
import axios from 'axios';

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      avatar: "",
      name: "ChatBot",
      role: "ai",
      message: "Hello! How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const getMessageVariant = (role) => (role === "ai" ? "received" : "sent");

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendToBackend = async (payload) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/assistant/superhero-01-01/evaluate-code', payload);
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          avatar: "",
          name: "ChatBot",
          role: "ai",
          message: response.data.message || "Analysis complete.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          avatar: "",
          name: "ChatBot",
          role: "ai",
          message: "An error occurred during processing.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        avatar: "",
        name: "User",
        role: "user",
        message: input,
      },
    ]);

    sendToBackend({
      key: "code", 
      value: input
    });

    setInput("");
    formRef.current?.reset();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            avatar: "",
            name: "User",
            role: "user",
            message: `File uploaded: ${file.name}`,
          },
        ]);

        sendToBackend({
          key: "file",
          value: fileContent
        });
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full w-full">
      <div className="relative flex h-full flex-col">
        <ChatMessageList ref={messagesContainerRef}>
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(message.role);
              return (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  variant={variant} 
                  isLoading={isLoading}
                />
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
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon" onClick={triggerFileInput}>
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

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
};