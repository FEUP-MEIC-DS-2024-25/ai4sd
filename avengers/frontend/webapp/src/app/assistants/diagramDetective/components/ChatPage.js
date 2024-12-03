"use client"
import React, { createContext, useState, useContext } from 'react';
import Chat from './Chat';
import Input from './Input';
import { Card } from '@/app/components/ui/card';
import Image from 'next/image';
import logo from '../assets/logo.png';
const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

function ChatPage() {
    const [sharedVariable, setSharedVariable] = useState(false);

    return (
        <ChatContext.Provider value={{ sharedVariable, setSharedVariable }} >
            <Card style={{
                backgroundColor: '#2f2f2f',
                minHeight: '90vh',
            }}>
                <div className="p-10 d-flex flex-column justify-content-center align-items-center" >
                    <div className="flex-grow-1 w-100">
                        <Chat />
                    </div>
                    <div className="pt-5 w-100">
                        <Input />
                    </div>
                </div>  
            </Card> 
        </ChatContext.Provider>
    );
}

export default ChatPage;