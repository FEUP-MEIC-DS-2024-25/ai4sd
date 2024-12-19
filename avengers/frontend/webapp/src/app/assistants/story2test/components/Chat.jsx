"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, {useState, useEffect, useRef} from 'react'
import {Avatar, AvatarFallback} from "@/app/components/ui/avatar";
import {Card, CardContent, CardFooter, CardHeader} from "@/app/components/ui/card";
import {ScrollArea} from "@/app/components/ui/scroll-area";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";
import {Send} from "lucide-react";
import Previewer, {PreviewerDark} from "@/app/assistants/req2test/components/Previewer";

import req2TestLogo from "@/app/assistants/req2test/assets/logo.png";
import story2TestLogoName from "../assets/story2testLogoName.png"
import story2TestLogo from "../assets/story2testLogoWhite.png"

const BotAvatar = () => (<Avatar className='border-1 border-neutral-700'>
    <AvatarFallback className="!bg-black !text-white">
        <div className={"rounded-full p-1.5"}>
            <Image src={story2TestLogo} alt='Story2Test Logo Miniature'/>
        </div>
    </AvatarFallback>
</Avatar>);

const UserAvatar = () => (<Avatar className='border-1 border-neutral-700'>
    <AvatarFallback className="!bg-black !text-white">U</AvatarFallback>
</Avatar>);

const Req2TestLink = () => (
    <Link href={mergedAssistants[0].link} title='Try Req2Test'>
        <Avatar className='border border-neutral-700 h-14 w-14'>
            <AvatarFallback className="!bg-black hover:!bg-indigo-600 transition-all duration-300 ease-in-out">
                <div className={"rounded-full p-2.5 "}>
                    <Image src={req2TestLogo} alt='Req2Test Logo'/>
                </div>
            </AvatarFallback>
        </Avatar>
    </Link>
);

const mergedAssistants = {
    0: {name: "Req2Test", link: "/assistants/req2test"}
};

export const Chatbot = ({conversation, setConversation}) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const addMessageToConversation = (conversationId, message) => {
        const storedConversations = JSON.parse(localStorage.getItem("story2test_conversations"));
        const conversationIndex = storedConversations.findIndex(convo => convo.id === conversation.id);
        storedConversations[conversationIndex].messages.push(message);
        localStorage.setItem("story2test_conversations", JSON.stringify(storedConversations));
    };

    const convertUserStoryToText = async (userStory) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch('http://localhost:8000/api/gemini/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user_story: userStory})
                })
                    .then(response => {
                        if (!response.ok) {
                            reject(new Error('Server error: ' + response.statusText));
                        }
                        return response.json();
                    })
                    .then(data => {
                        if ("answer" in data) {
                            resolve(data.answer);
                        } else {
                            resolve(data.message);
                        }
                    })
                    .catch(error => {
                        reject(new Error('Error: ' + error.message));
                    });
            }, 250);
        });
    };


    const handleSend = () => {
        if (input.trim()) {
            const newMessage = {content: input, sender: "user"};
            const updatedConversation = {
                ...conversation,
                messages: [...conversation.messages, newMessage],
            };
            setConversation(updatedConversation);
            addMessageToConversation(conversation.id, newMessage)

            convertUserStoryToText(input).then(response => {
                const botResponse = {content: "", sender: "bot"}; // Começa vazio
                const chatWithBotResponse = {
                    ...updatedConversation,
                    messages: [...updatedConversation.messages, botResponse],
                };
                setConversation(chatWithBotResponse);

                //Para simular o escrever
                const batchSize = 6;
                const typingSpeed = 20;

                let index = 0;

                const typingInterval = setInterval(() => {
                    if (index < response.length) {
                        const nextBatch = response.slice(index, index + batchSize);
                        botResponse.content += nextBatch;

                        const updatedChatWithTyping = {
                            ...chatWithBotResponse,
                            messages: [...chatWithBotResponse.messages.slice(0, -1), botResponse],
                        };

                        setConversation(updatedChatWithTyping);

                        index += batchSize;
                    } else {
                        clearInterval(typingInterval);
                    }
                }, typingSpeed);

                addMessageToConversation(conversation.id, {content: response, sender: "bot"})
            });
            setInput("");
        }
    };

    return (
        <div className="flex border-neutral-800 text-neutral-50 bg-neutral-925">
            <Card
                className="flex flex-col w-full justify-between m-4 bg-neutral-800 shadow-[0_4px_6px_rgba(255,255,255,0.2)]">
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex-1">
                        <div className="w-1/5 flex justify-center p-2.5 rounded-md bg-white">
                            <Image src={story2TestLogoName} alt='Story2Test Logo'/>
                        </div>
                        <h2 className="pl-2 text-xl font-medium text-neutral-100 mt-1.5">{conversation.name || "..."}</h2>
                    </div>
                    <div>
                        <Req2TestLink/>
                    </div>
                </CardHeader>
                <CardContent className="!p-3 md:p-6">
                    <ScrollArea className="h-[calc(100vh-320px)]">
                        {conversation.messages.map((message, index) => (
                            <div key={index}
                                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} p-2 md:p-4 mb-4`}>
                                <div
                                    className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {message.sender === 'bot' ? <BotAvatar className="w-8 h-8"/> : <UserAvatar/>}
                                    <div id='chat-message'
                                         className={`mx-2 py-2 px-3 rounded-lg ${message.sender === 'user' ? 'bg-neutral-950 text-white' : 'text-white'}`}>
                                        <PreviewerDark {...message} />
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
        </div>
    )
}
