"use client"

import Image from 'next/image'
import React, {useState, useEffect, useRef} from 'react'
import {Avatar, AvatarFallback} from "@/app/components/ui/avatar";
import {Card, CardContent, CardFooter, CardHeader} from "@/app/components/ui/card";
import {ScrollArea} from "@/app/components/ui/scroll-area";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";
import {Send} from "lucide-react";
import Previewer from "@/app/assistants/req2test/components/Previewer";

import req2TestLogo from "@/app/assistants/req2test/assets/logo.png";
import story2TestLogoName from "../assets/story2testLogoName.png"
import story2TestLogo from "../assets/story2testLogoWhite.png"

const BotAvatar = () => (<Avatar className='border-1 border-neutral-700'>
    <AvatarFallback className="!bg-black !text-white">
        <div className={"rounded-full p-1.5"}>
            <Image src={story2TestLogo} alt='Story2Test Logo Miniature' />
        </div>
    </AvatarFallback>
</Avatar>);

const UserAvatar = () => (<Avatar className='border-1 border-neutral-700'>
    <AvatarFallback className="!bg-black !text-white">U</AvatarFallback>
</Avatar>);

const Req2TestLink = () => (<a href={mergedAssistants[0].link}>
    <Avatar className='border border-neutral-700 h-14 w-14'>
        <AvatarFallback className="!bg-black">
            <div className={"rounded-full p-1.5 "}>
                <Image src={req2TestLogo} alt='Req2Test Logo'/>
            </div>
        </AvatarFallback>
    </Avatar>
</a>);

const mergedAssistants = {
    0: {name: "Req2Test", link: "/assistants/req2test"}
};

export const Chatbot = () => {
    const [chats, setChats] = useState([{
        id: 1, name: "Chat 1", messages: [{
            content: "Welcome! I am here to help you convert your user stories into acceptance tests. How can I assist you today?",
            sender: "bot"
        }]
    },])
    const [selectedChat, setSelectedChat] = useState(chats[0])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef(null)
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedChats = localStorage.getItem('s2t-chats')
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats)
            setChats(parsedChats)
            const savedSelectedChat = localStorage.getItem('s2t-selectedChat')
            setSelectedChat(savedSelectedChat ? JSON.parse(savedSelectedChat) : parsedChats[0])
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('s2t-chats', JSON.stringify(chats))
            localStorage.setItem('s2t-selectedChat', JSON.stringify(selectedChat))

        }
    }, [chats, selectedChat, isClient])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [selectedChat.messages])

    const convertUserStoryToText = async (userStory) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`User Story: ${userStory}`)
            }, 1000)
        })
    }

    const handleSend = () => {
        if (input.trim()) {
            const newMessage = {content: input, sender: "user"}
            const updatedChat = {
                ...selectedChat, messages: [...selectedChat.messages, newMessage]
            }
            setSelectedChat(updatedChat)
            setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat))
            const allMessages = [...selectedChat.messages, {content: input}]
                .map(msg => msg.content)
                .join(' ');
            convertUserStoryToText(allMessages).then((response) => {
                const botResponse = {content: response.toString(), sender: "bot"}
                const chatWithBotResponse = {
                    ...updatedChat, messages: [...updatedChat.messages, botResponse]
                }
                setSelectedChat(chatWithBotResponse)
                setChats(chats.map(chat => chat.id === selectedChat.id ? chatWithBotResponse : chat))
            })

            setInput("")
        }
    }

    return (<div className="flex border-neutral-800 text-neutral-50">
        <Card
            className="flex flex-col w-full justify-between m-4 bg-neutral-800 shadow-[0_4px_6px_rgba(255,255,255,0.2)]">
            <CardHeader className="flex flex-row justify-between">
                <div className="flex-1">
                    <div className="w-1/5 flex justify-center p-2.5 rounded-md bg-white">
                        <Image src={story2TestLogoName} alt='Story2Test Logo'/>
                    </div>
                    <h2 className="pl-2 text-xl font-medium text-neutral-100 mt-1.5">Chat ...</h2>
                </div>
                <div>
                    <Req2TestLink/>
                </div>
            </CardHeader>
            <CardContent className="!p-3 md:p-6 mt-4">
                <ScrollArea className="h-[calc(100vh-340px)]">
                    {selectedChat.messages.map((message, index) => (<div key={index}
                                                                         className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} p-2 md:p-4 mb-4`}>
                        <div
                            className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {message.sender === 'bot' ? <BotAvatar className="w-8 h-8"/> : <UserAvatar/>}
                            <div id='chat-message'
                                 className={`mx-2 py-2 px-3 rounded-lg ${message.sender === 'user' ? 'bg-neutral-950 text-white' : 'text-white'}`}>
                                <Previewer {...message} />
                            </div>
                        </div>
                    </div>))}
                    <div ref={messagesEndRef}/>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }} className="flex w-full items-center space-x-2">
                    <Input
                        className="text-white bg-neutral-950 placeholder:text-neutral-400 border-0 focus-visible:outline-neutral-300"
                        type="text"
                        placeholder="Message Story2Test"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}/>
                    <Button type="submit" size="icon"
                            className='bg-neutral-50 text-neutral-950 hover:bg-indigo-600 hover:text-white'>
                        <Send className="h-4 w-4"/>
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    </div>)
}
