'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import "./index.css";
import paperclip from '../assets/images/paperclip.png';
import searchicon from '../assets/images/search.png';
import '../assets/prism.css'; 
import '../assets/prism.js';  
const ChatArea = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null); 
  const endOfMessagesRef = useRef(null);

  
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); 
    }
  };

  
  const sendMessage = async () => {
    if (userMessage.trim() === "") return; 

    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setUserMessage(""); 
    setIsLoading(true); 

    const formData = new FormData();
    formData.append("prompt", userMessage); 
    if (file) {
      formData.append("file", file); 
    }

    try {
      
      const response = await fetch("http://127.0.0.1:8000/api/chat-with-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API Error: Unable to fetch response.");
      }

      const data = await response.json();

      
      setMessages([
        ...newMessages,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);

      
      setMessages([
        ...newMessages,
        { text: "API Error: Unable to get a response.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false); 
    }
  };

  
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="chat-title">TOOP AI</div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "sent" : "received"}`}
          >
            
            {msg.sender === "bot" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: msg.text,
                }}
                ref={(el) => {
                  if (el) {
                    
                    const codeElements = el.querySelectorAll("pre code");
                    codeElements.forEach((el) => {
                      Prism.highlightElement(el); 
                    });
                  }
                }}
              />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message received">
            <span>Loading...</span>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="chat-input">
        <Image
          src={paperclip}
          alt="Send"
          onClick={() => document.getElementById("folderInput").click()}
        />

        <input
          type="file"
          id="folderInput"
          style={{ display: "none" }}
          onChange={handleFileChange} 
        />

        <input
          type="text"
          placeholder="Type Something..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />

        <Image
          className="test"
          src={searchicon}
          alt="Send"
          onClick={sendMessage} 
        />
      </div>
    </div>
  );
};

export default ChatArea;
