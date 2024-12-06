import { useState, useEffect, useRef } from "react";

import { Mic, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

export default function SpeechToText({ setMessage, isBraveBrowser, dialogOpen, setDialogOpen }) {

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [language, setLanguage] = useState('en-US'); // Default language


  // Speech-to-text functionality
  const startRecording = () => {

        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = language; // Set the recognition language to the selected one

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            setMessage((prevMessage) => prevMessage + transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start(); // Start recording automatically
    };

    const stopRecording = () => {

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setDialogOpen(false); // Close the dialog when stopping recording
        }
    };

    //Stop the recording when the dialog is closed
    useEffect(() => {
        if(!dialogOpen){
            stopRecording();
        }
    }, [dialogOpen]);

  return (

    <Dialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
    >
        <DialogTrigger>
    
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Speech-to-Text</DialogTitle>
                <DialogDescription>
                    {isRecording ? (
                        <Button
                            onClick={stopRecording}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            <span className="flex flex-row items-center space-x-2">
                                <span>Stop Listening</span>
                                <span><StopCircle size={16} className="mr-2" /></span>
                            </span>
                        </Button>
                    ) : (
                        <Button
                            onClick={startRecording}
                            disabled={isBraveBrowser}
                            className={`bg-black text-white hover:bg-red-500 hover:text-black ${isBraveBrowser ? 'bg-gray-400' : ''}`}
                        >
                            <span className="flex flex-row items-center space-x-2">
                                <span>Start Listening</span>
                                <span><Mic size={16} className="mr-2" /></span>
                            </span>
                        </Button>
                    )}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">Select Language</label>
                <select
                    id="language-select"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en-US">English</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="pt-PT">Portuguese</option>
                    {/* Add more languages as needed */}
                </select>
            </div>
        </DialogContent>
    </Dialog>

  )
}
