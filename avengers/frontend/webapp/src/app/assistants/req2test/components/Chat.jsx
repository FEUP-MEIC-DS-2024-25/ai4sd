"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import Previewer from "./Previewer"

import { Send } from "lucide-react"

import logo from '../assets/logo.png'
import logoName from '../assets/logoName.png'
import story2TestLogo from "../assets/story2testLogoWhite.png"

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

const Story2TestLink = () => (
  <Link href="/assistants/story2test" title='Try Story2Test'>
    <Avatar className='border border-neutral-700 h-14 w-14'>
        <AvatarFallback className="!bg-black hover:!bg-indigo-600 transition-all duration-300 ease-in-out">
            <div className={"rounded-full p-1.5 "}>
                <Image src={story2TestLogo} alt='Story2Test Logo'/>
            </div>
        </AvatarFallback>
    </Avatar>
  </Link>
);

export const Chatbot = ({ chat, setChat }) => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [chat.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        ...chat,
        messages: [...chat.messages, newMessage]
      }
      setChat(updatedChat)
      const allMessages = [...chat.messages, { content: input }]
        .map(msg => msg.content)
        .join(' ');
      convertRequirementToText(allMessages).then((response) => {
        const botResponse = { content: response.toString(), sender: "bot" }
        const chatWithBotResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, botResponse]
        }
        setChat(chatWithBotResponse)
      })

      setInput("")
    }
  }

  return (
    <div className="flex bg-white dark:bg-neutral-950">
      <Card className="flex flex-col w-full justify-between">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <div className="w-1/5 flex justify-center p-2.5 rounded-md bg-black">
              <Image src={logoName} alt='Req2Test Logo'/>
            </div>
            <h2 className="pl-2 text-xl font-medium text-neutral-900 dark:text-white">{chat.name}</h2>
          </div>
           <Story2TestLink/>
        </CardHeader>
        <CardContent className="!p-3 md:p-6 mt-4">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {chat.messages.map((message, index) => (
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
