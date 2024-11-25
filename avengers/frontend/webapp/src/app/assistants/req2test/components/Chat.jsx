"use client"

import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import Previewer from "./Previewer"

import { Send } from "lucide-react"

import logo from '../assets/logo.png'

const BotAvatar = ({ className }) => (
  <Avatar className='border border-neutral-700'>
    <AvatarFallback className="!bg-black">
      <div className={"rounded-full p-1.5 " + className}>
        <Image src={logo} alt='Req2Test Logo' />
      </div>
    </AvatarFallback>
  </Avatar>
);

const UserAvatar = () => (
  <Avatar className='border border-neutral-700'>
    <AvatarFallback className="!bg-black !text-white">
      U
    </AvatarFallback>
  </Avatar>
);

export const Chatbot = () => {
  const [chats, setChats] = useState([
    { id: 1, name: "Chat 1", messages: [{ content: "Welcome! I am here to help you convert your requirements into Gherkin tests. How can I assist you today?", sender: "bot" }] },
  ])
  const [selectedChat, setSelectedChat] = useState(chats[0])
  const [input, setInput] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const messagesEndRef = useRef(null)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      const savedSelectedChat = localStorage.getItem('selectedChat')
      setSelectedChat(savedSelectedChat ? JSON.parse(savedSelectedChat) : parsedChats[0])
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('chats', JSON.stringify(chats))
      localStorage.setItem('selectedChat', JSON.stringify(selectedChat))

    }
  }, [chats, selectedChat, isClient])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat.messages])

  // Mock API call
  const convertRequirementToText = async (req) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Feature: ${req}`)
        }, 1000)
        }
    )
}

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { content: input, sender: "user" }
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      }
      setSelectedChat(updatedChat)
      setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat))
      const allMessages = [...selectedChat.messages, { content: input }]
        .map(msg => msg.content)
        .join(' ');
      convertRequirementToText(allMessages).then((response) => {
        const botResponse = { content: response.toString(), sender: "bot" }
        const chatWithBotResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, botResponse]
        }
        setSelectedChat(chatWithBotResponse)
        setChats(chats.map(chat => chat.id === selectedChat.id ? chatWithBotResponse : chat))
      })

      setInput("")
    }
  }

  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated)
  }

  const startNewChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
    const newChat = {
      id: newChatId,
      name: `Chat ${newChatId}`,
      messages: [{ content: "Welcome! I am here to help you convert your requirements into Gherkin tests. How can I assist you today?", sender: "bot" }]
    }
    setChats([...chats, newChat])
    setSelectedChat(newChat)
  }


  const setChatName = (chatId, newName) => {
    const updatedChats = chats.map(chat => chat.id === chatId ? { ...chat, name: newName } : chat)
    setChats(updatedChats)
    if (selectedChat.id === chatId) {
      setSelectedChat({ ...selectedChat, name: newName })
    }
  }

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    if (selectedChat.id === chatId) {
      setSelectedChat(updatedChats[0] || { id: 0, name: '', messages: [] })
    }
  }

  
  return (
    <div className="flex bg-white dark:bg-neutral-950">

      <Card className="flex flex-col w-full justify-between m-4">
        <CardContent className="!p-3 md:p-6 mt-4">
          <ScrollArea className="h-[calc(100vh-180px)]">
            {selectedChat.messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} p-2 md:p-4 mb-4`}>
                <div className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.sender === 'bot' ? <BotAvatar className="w-8 h-8" /> : <UserAvatar />}
                  <div 
                    id='chat-message'
                    className={`mx-2 py-2 px-3 rounded-lg ${message.sender === 'user' ? 'bg-neutral-200 dark:bg-neutral-950 text-black dark:text-white' : ''}`}
                  >
                    <Previewer {...message} />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Message Req2Test" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" className='bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white'>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

