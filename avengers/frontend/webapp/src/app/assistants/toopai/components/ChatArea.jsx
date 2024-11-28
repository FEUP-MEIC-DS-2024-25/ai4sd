import React from "react";
import "./index.css";

const ChatArea = () => {
  return (
    <div className="chat-area">
      {/* Título do Chat */}
      <div className="chat-title">TOOP AI</div>

      {/* Área de Mensagens */}
      <div className="messages"></div>

      {/* Input de Mensagem */}
      <div className="chat-input">
        <img src="paperclip.png" alt="Enviar" />
        <input type="file" id="folderInput" webkitdirectory="true" mozdirectory="true" style={{ display: "none" }} />
        <input type="text" placeholder="Type Something..." id="userMessage" />
        <img className="test" src="search.png" alt="Enviar" />
      </div>
    </div>
  );
};

export default ChatArea;
