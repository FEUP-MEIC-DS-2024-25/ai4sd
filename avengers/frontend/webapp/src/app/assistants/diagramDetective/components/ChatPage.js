"use client"
import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import Chat from './Chat';
import Input from './Input';
import Sidebar from './Sidebar';
import { Card } from '@/app/components/ui/card';
import Image from 'next/image';
import logo from '../assets/logo.png';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

const BASE_URL = 'https://superhero-06-02-150699885662.europe-west1.run.app/';

function ChatPage() {
    const [sharedVariable, setSharedVariable] = useState(false);
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        const fetchMostRecentSession = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/app/get_sessions/`);
            console.log("API Response:", response.data); // Log the response
            const sessions = response.data;
            // sort sessions by most recent activity first
            sessions.sort(
              (a, b) => new Date(b.last_activity) - new Date(a.last_activity)
            );
    
            if (sessions.length > 0) {
              // Set the most recent session as the chatId
              setChatId(sessions[0].session_id);
            }
          } catch (error) {
            console.error("Error fetching or creating session:", error);
          }
        };
        fetchMostRecentSession();
      }, []);


      
    const openChat = (id) => {
        //opens a chat session on click, by default set open most recent when page loads
        setChatId(id);
    };
    return (
        <ChatContext.Provider value={{ sharedVariable, setSharedVariable, chatId }} >
             
            <Card >
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