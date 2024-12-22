import React, { useState } from "react";
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SUPPORTED_EXTENSIONS, MAX_FILE_SIZE } from '../constants/fileTypes';

export default function AssistantForm(props) {
    const [inputValue, setInputValue] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Capture current values
        const messageTosend = inputValue;
        const filesToSend = [...selectedFiles];
        
        // Reset form immediately
        setInputValue("");
        setSelectedFiles([]);
        event.target.reset();
        
        // Send data after reset
        await props.callback(messageTosend, filesToSend);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const unsupportedFiles = files.filter(file => 
            !SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
        );
        
        if (unsupportedFiles.length > 0) {
            alert(`Only ${SUPPORTED_EXTENSIONS.join(', ')} files are supported.`);
            return;
        }
            const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
        alert(`Files must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
    }
        
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="selected-files">
                {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
            </div>
            
            <form className="input" onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    id="fileInput" 
                    multiple
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                    disabled={props.isLoading}
                />
                <label htmlFor="fileInput" className="custom-file-label file">
                    <i className="fas fa-paperclip"></i>
                </label>
                
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    disabled={props.isLoading}
                />

                <input 
                    type="submit" 
                    id="submit" 
                    disabled={(!inputValue && selectedFiles.length === 0) || props.isLoading}
                />
                <label htmlFor="submit" className="custom-file-label">
                    <i className="fas fa-paper-plane"></i> 
                </label>
            </form>
        </div>
    );
}