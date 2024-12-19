import React, { useState } from "react";
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function AssistantForm(props) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();  

        const fileInput = document.getElementById('fileInput');
        const textInput = document.querySelector('input[type="text"]');
        
        props.callback(textInput.value);
        
        event.target.reset();
        setInputValue("");
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <form className="input" onSubmit={handleSubmit}>
            <input type="file" id="fileInput"></input>
            <label htmlFor="fileInput" className="custom-file-label file">
                <i className="fas fa-paperclip"></i>
            </label>
            
            <input type="text" value={inputValue} onChange={handleInputChange}></input>

            <input type="submit" id="submit" disabled={!inputValue}></input>
            <label htmlFor="submit" className="custom-file-label">
                <i className="fas fa-paper-plane"></i> 
            </label>
        </form>
    );
}