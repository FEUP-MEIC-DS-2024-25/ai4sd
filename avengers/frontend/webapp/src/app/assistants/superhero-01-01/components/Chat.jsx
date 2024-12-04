"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "@/app/components/ui/chat/chat-bubble";
import { ChatInput } from "@/app/components/ui/chat/chat-input";
import { ChatMessageList } from "@/app/components/ui/chat/chat-message-list";
//import { AnimatePresence, motion } from "framer-motion";
import {

  CornerDownLeft,
  Paperclip,

} from "lucide-react";
import { useState } from "react";
import { React } from "react";
import axios from 'axios';


  

export const Chatbot = () => {

  const message = {
    role: "ai",
    message: "Hello! How can I help you today?",
    isLoading: false,
  }

  const [formData, setFormData] = useState({
  type: '', 
  data: null 
});
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/export-evaluation');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:',  
   error);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (formData.type === 'file') {
        // Handle file upload, e.g., using FormData
        console.log(formData)
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.data);
        console.log(formDataToSend)
  
        const response = await axios.post('https://localhost:8000/api/prompt', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Data submitted successfully:', response.data);
  
        // ... handle response
      } else if (formData.type === 'code') {
        // Handle text input
        console.log(formData)
        const response = await axios.post('https://localhost:8000/api/prompt', {
          code: formData.data
        });
  
        console.log('Data submitted successfully:', response.data);
        // ... handle response
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
    finally{
      setIsLoading(false);
    }
  //   try {
  //     const response = await axios.post('https://localhost:8000/api/prompt',  
  //  formData);
  //   console.log('Data submitted successfully:', response.data);
  //   setFormData('')
  //     // Handle success or error based on response
  //   } catch (error) {
  //     console.error('Error submitting data:', error);
  //   }
  //   finally{
  //     setIsLoading(false);
  //   }
  };
  

  const handleInputChange = (e) => {
    if (e.target.files) {
      
      setFormData({
        type: 'file',
        data: e.target.files[0]
      });
    } else {
      // Text input case
      setFormData({
        type: 'code',
        data: e.target.value
      });
    }
  };

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
          onSubmit={handleSubmit}
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
  );
 
}

