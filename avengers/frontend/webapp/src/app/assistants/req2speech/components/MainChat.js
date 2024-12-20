"use client"

// Extra components
import  ExpandingTextarea  from "./ui/expanding-textarea";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import SpeechToText from "./SpeechToText";
import { Mic } from "lucide-react"; 

//Previous Messages
import axios from "axios";
import { ChatList } from "./ChatList";
 
//Notifications 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainChat({ chatID }) {
    
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const disableTimerMult = useRef(5); 
    const disabeTimerCntr = useRef(0); 

    //Detect if the browser is Brave
    const isBrave = (window.navigator.brave != undefined && window.navigator.brave.isBrave.name == "isBrave") 
    const [isBraveBrowser, setIsBraveBrowser] = useState(isBrave);

    //Text To Speech Dialog Trigger
    const [activeDialog, setActiveDialog] = useState(false);
    const [showSpeechDialog, setShowSpeechDialog] = useState(false);

    //On page load, load chat messages from the backend
    
    useEffect(() => {

        const fetchConversations = async () => {

            try {

                const backendUrl = "https://superhero-03-03-150699885662.europe-west1.run.app";
                const response = await axios.get(`${backendUrl}/req2speech/chat/${chatID}`);
                const data = response.data;

                if (data) {
                    data.map((chat) => {    
                        setConversations((prevConversations) => [
                            ...prevConversations,
                            { query: chat.msg, answer: chat.reply }
                        ]);
                    });
                }

            } catch (error) {
                console.error("Error fetching conversations:", error);
            }

        };

        fetchConversations();

    }, []);


    //Show Speech Dialog
    useEffect(() => {

        if (activeDialog) {

            // Delay showing the dialog to ensure state has updated
            const timer = setTimeout(() => setShowSpeechDialog(true), 0);
            return () => clearTimeout(timer);

        } else {
            setShowSpeechDialog(false);
        }

    }, [activeDialog]);

    const handleSubmit = async () => {

        try {
            
            const backendUrl = "https://superhero-03-03-150699885662.europe-west1.run.app";
            const response = await fetch(`${backendUrl}/api/prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: message,
                }),
            });

            if (!response.ok) {

                if(disabeTimerCntr.current === 3){
                    toast.error('Error sending prompt to backend. Please try again later.');
                    setDisabled(true); 
                } 
                else{
                    toast.error('Error sending prompt to backend. Retrying in ' + (disableTimerMult.current) + ' seconds.', {
                        autoClose: disableTimerMult.current * 1000
                    });

                    //Set the button to disabled for X seconds
                    setDisabled(true);

                    //Reenable the button after X seconds
                    setTimeout(() => {
                        setDisabled(false);
                    }
                    , disableTimerMult.current * 1000);

                    disabeTimerCntr.current += 1;
                    disableTimerMult.current += 5;
                }
                
                return;
            }

            const data = await response.json();

            if (data) {

                //New Chat Message - Generate a chatID
                conversations.length === 0 ? (chatID =  Math.random().toString(36).substring(7)) : chatID

                //Post the new message to the backend
                try{

                    const response = await axios.post(`${backendUrl}/req2speech/chat/${chatID}`, {
                        msg: message,
                        reply: data
                    });

                    //Append new conversation pair (user query and answer)
                    setConversations((prevConversations) => [
                        ...prevConversations,
                        { query: message, answer: data }
                    ]);
                    
                } catch (error){
                    console.error("Error submitting prompt to backend:", error);
                }

                // Append new conversation pair (user query and answer)
                setConversations((prevConversations) => [
                    ...prevConversations,
                    { query: message, answer: data }
                ]);

            } else {
                console.error("No answer in response:", data);
                setConversations((prevConversations) => [
                    ...prevConversations,
                    { query: message, answer: "No answer received." }
                ]);
            }

            setMessage(""); // Clear the message after sending
        } catch (error) {
            console.error("Error submitting prompt to backend:", error);
        }
    };

    return (
        <div className="flex flex-col h-full w-full mx-auto justify-center items-center">
            
            {/* Header and Input Area */}
            <div className={`flex flex-col items-center justify-center ${conversations.length === 0 ? 'my-12' : 'my-4'}`}>
                {conversations.length === 0 && (
                    <>
                        <h1 className="mb-2 text-5xl dark:text-gray-200 text-gray-800 font-extrabold uppercase">Speech2Req</h1>
                        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200 text-gray-800">What can I help you with?</h2>
                    </>
                )}
            </div>

            {/* Stack of Answers */}
            <div className="container max-w-4xl py-6">
                <ChatList conversations={conversations} />
            </div>

            {/* Input Bar */}
            <div className={`relative px-12 w-[80%] ${conversations.length === 0 ? 'flex justify-center flex-col items-center' : ''}`}>
                <div className="w-full">
                    <ExpandingTextarea
                        handleSubmit={handleSubmit}
                        message={message}
                        setMessage={setMessage}
                        placeholder = {"Type a message..."}
                    />
                </div>
                <div className="flex justify-center mt-8">
                    {showSpeechDialog && <SpeechToText setMessage={setMessage} isBraveBrowser={isBraveBrowser} dialogOpen={activeDialog} setDialogOpen={setActiveDialog}/>}
                    <Button
                        type="button"
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => {
                            if(isBraveBrowser){
                                toast.error('Speech-to-text is not supported in Brave browser. Please use a different browser.');
                            }
                            setActiveDialog(true);
                        }}
                    >
                        <span className={`p-2`}>
                            <Mic size={16} />
                        </span>
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={disabled}
                        //If it is disabled, change the color to gray
                        className={`h-10 ml-2 bg-neutral-950 dark:bg-gray-200 dark:text-gray-800 text-gray-200 dark:hover:bg-gray-400 ${disabled ? "bg-gray-300" : ""}`}
                    >
                        Send message
                    </Button>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            </div>
        </div>
    );
}
