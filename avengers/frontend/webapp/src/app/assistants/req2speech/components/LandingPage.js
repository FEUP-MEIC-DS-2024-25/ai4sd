"use client"

// Extra components
import  ExpandingTextarea  from "./ui/expanding-textarea";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import SpeechToText from "./SpeechToText";
import ReactMarkdown from "react-markdown";
import { Mic } from "lucide-react"; 
 
//Notifications 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage({ chat }) {
    
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState(chat || []);
    const [disabled, setDisabled] = useState(false);
    const disableTimerMult = useRef(5); 
    const disabeTimerCntr = useRef(0); 

    //Detect if the browser is Brave
    const isBrave = (window.navigator.brave != undefined && window.navigator.brave.isBrave.name == "isBrave") 
    const [isBraveBrowser, setIsBraveBrowser] = useState(isBrave);

    //Text To Speech Dialog Trigger
    const [activeDialog, setActiveDialog] = useState(false);
    const [showSpeechDialog, setShowSpeechDialog] = useState(false);

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
            
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
            console.log(data); 

            if (data) {
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
            <div className={`flex-grow p-4 border border-gray-300 rounded bg-gray-100 overflow-auto my-12 ${conversations.length === 0 ? 'hidden' : ''}`}>
                {conversations.length > 0 && (
                    <div className="flex flex-col space-y-2">
                        {conversations.map((conv, index) => (
                            <div key={index} className="p-2 border-b border-gray-300">
                                <p className="font-bold">You: {conv.query}</p>
                                <p className="ml-4">Bot:</p>
                                <ReactMarkdown className="markdown">{conv.answer}</ReactMarkdown>
                            </div>
                        ))}
                    </div>
                )}
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
