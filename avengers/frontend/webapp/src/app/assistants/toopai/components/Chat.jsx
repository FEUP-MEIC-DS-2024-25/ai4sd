'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import "./index.css";
import paperclip from '../assets/images/paperclip.png';
import searchicon from '../assets/images/search.png';

const ChatArea = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null); // État pour gérer le fichier joint
  const endOfMessagesRef = useRef(null);

  // Fonction pour gérer l'ajout du fichier
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Stocke le fichier dans l'état
    }
  };

  // Fonction d'envoi de message
  const sendMessage = async () => {
    if (userMessage.trim() === "") return; // Ne pas envoyer si le message est vide

    // Ajout du message de l'utilisateur à la liste
    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setUserMessage(""); // Réinitialiser l'input
    setIsLoading(true); // Indiquer que l'API est en train de répondre

    const formData = new FormData();
    formData.append("prompt", userMessage); // Ajouter le prompt

    if (file) {
      formData.append("file", file); // Ajouter le fichier s'il existe
    }

    try {
      // Appel à l'API pour obtenir la réponse du chatbot
      const response = await fetch("https://superhero-01-02-150699885662.europe-west1.run.app/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API Error: Unable to fetch response.");
      }

      const data = await response.json();

      // Ajout de la réponse du chatbot à la liste des messages
      setMessages([
        ...newMessages,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);

      // Ajout d'un message d'erreur si l'API échoue
      setMessages([
        ...newMessages,
        { text: "API Error: Unable to get a response.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  // Effectuer un défilement vers le bas chaque fois que les messages changent
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
            {msg.text}
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
          onChange={handleFileChange} // Gérer le fichier sélectionné
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
          onClick={sendMessage} // Envoie le message avec ou sans fichier
        />
      </div>
    </div>
  );
};

export default ChatArea;
