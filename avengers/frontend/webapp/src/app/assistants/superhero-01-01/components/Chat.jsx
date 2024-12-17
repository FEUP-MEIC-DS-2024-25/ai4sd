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
import TextareaAutosize from 'react-textarea-autosize';


export const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      avatar: "",
      name: "ChatBot",
      role: "ai",
      message: {
        type: "text",
        value: "Hello! Start writing code which I will evaluate for possible mistakes."
      },
      loading: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const message = {
    role: "ai",
    message: "Hello! How can I help you today?",
    isLoading: false,
  }

  const [formData, setFormData] = useState({
  type: '', 
  data: null 
});

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

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/export-evaluation');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:',  
   error);
    }
  };

  const sendToBackend = async (payload, messageId) => {
    let response;
    try {
      if (payload.type === 'file'){
        const formDataToSend = new FormData();
        formDataToSend.append('file', payload.value);
        response = await axios.post('http://localhost:8000/api/prompt', formDataToSend, {});
      } else if (payload.type === 'code'){
        response = await axios.post('http://localhost:8000/api/prompt', {
          code:payload.value
        },{
          headers: {
            'Content-Type':'multipart/form-data'
          },
        })
      }

      if (response.status !== 200) {
        throw new Error(response.data.error || "An error occurred. Please try again later.");
      }
      
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > messageId) {

          newMessages[messageId].message = {
            type: "json",
            value: response.data
          }
          newMessages[messageId].loading = false;
        }
        return newMessages;
      });
    } catch (error) {
      console.log(error);
      const newMessage ={
        type: "text",
        value: error.response? error.response.data.error : error.message
      }
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > messageId) {
          newMessages[messageId].message = newMessage;
          newMessages[messageId].loading = false;
        }
        return newMessages;
      });
    } finally {
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > messageId) {
          newMessages[messageId].loading = false;
        }
        return newMessages;
      });
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
        message: {
          type: "text",
          value: input,
        },
        loading: false,
      },
    ]);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        avatar: "",
        name: "ChatBot",
        role: "ai",
        message: {
          type: "text",
          value: "Thinking...",
        },
        loading: true,
      },
    ]);

    sendToBackend({
      type : "code",
      value : input
    }, messages.length+1);

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
            message: {
              type: "text",
              value: `File uploaded: ${file.name}`},
          },
        ]);

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            avatar: "",
            name: "ChatBot",
            role: "ai",
            message: {
              type: "text",
              value: "Thinking...",
            },
            loading: true,
          },
        ]);

        sendToBackend({
          type: "file",
          value: file
        }, messages.length+1);
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
        <ChatMessageList ref={messagesContainerRef}
        className="
        overflow-y-auto 
        scrollbar 
        scrollbar-thin 
        scrollbar-track-transparent 
        scrollbar-thumb-gray-200 
        hover:scrollbar-thumb-gray-300
      ">
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(message.role);
              return (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  variant={variant} 
                  isLoading={message.loading}
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
          <TextareaAutosize
            ref={inputRef}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your code here..."
            minRows={1}
            maxRows={5}
            className="
              w-full 
              bg-background 
              border-0 
              p-3 
              shadow-none 
              resize-none 
              rounded-lg 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500
              text-sm
            "
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
              disabled={!formData || isLoading}
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