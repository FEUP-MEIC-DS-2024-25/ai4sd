import React, { useEffect, useState } from 'react';
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { useChatContext } from './ChatPage';
import { Card } from '@/app/components/ui/card';
import logo from '../assets/logo.png';
const BASE_URL = process.env.REACT_APP_API_URL;

function Chat() {
    const { sharedVariable, setSharedVariable } = useChatContext();

    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/app/get_chat_history/`)
            .then(response => {
                setChatHistory(response.data);
            })
            .catch(error => {
                console.error("Error fetching chat history:", error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/app/get_chat_history/`)
            .then(response => {
                setChatHistory(response.data);
            })
            .catch(error => {
                console.error("Error fetching chat history:", error);
            });
    }, [sharedVariable]);

    const [expertise, setExpertise] = useState(""); // State to track selected expertise

    const handleExpertiseChange = async (event) => {
        // event.preventDefault();
        // setExpertise(event.target.value);
        // const response = await axios.post(BASE_URL + '/app/change_expertise/', {"expertise": event.target.value});
        // setSharedVariable(!sharedVariable);
        // console.log(response);

        setChatHistory([...chatHistory, {sender: 'app', chat_content: 'APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP APP '}, {sender: 'user', chat_content: 'USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER '}]);
    };

    return (
            <Card className="flex flex-col w-full" style={{
                    height: '65vh',
                    overflowY: 'auto',
                    backgroundColor: '#f9f9f9',
                    position: 'relative'
                }}>
                <div style={{
                        position: 'sticky',
                        width: '180px',
                        top: '10px',
                        left: '85%',
                        zIndex: 1,
                    }}>
                    <select 
                        className="form-control bg-white text-black" 
                        name="option"
                        id="optionSelect"
                        value={expertise}
                        onChange={handleExpertiseChange}
                    >
                        <option value="" disabled hidden>Select your expertise</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
                {chatHistory.map((message, index) => (
                    <div
                        key={index}
                        className={`d-flex ${
                            message.sender === 'user' ? 'flex-row-reverse' : 'justify-content-start'
                        }`}
                        style={{
                            alignItems: 'flex-start',
                            margin: '10px 0',
                        }}
                    >
                        <strong
                            className="p-2 m-2 h-100 rounded-circle text-center"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: message.sender === 'user' ? 'rgb(240, 240, 240)' : 'rgb(34, 34, 34)',
                                color: message.sender === 'user' ? 'black' : 'white',
                                width: '60px',
                            }}
                        >
                            {message.sender}
                        </strong>
                        <div
                            style={{
                                maxWidth: '50%',
                                textAlign: 'left',
                                backgroundColor:'#e6f7ff',
                                color: 'black',
                                padding: '10px',
                                borderRadius: '10px',
                            }}
                        >
                            {message.chat_content ? (
                                <div>
                                    <ReactMarkdown>{message.chat_content}</ReactMarkdown>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={message.chat_image.url}
                                        alt="Uploaded diagram"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
            </Card>
    );
    
}

export default Chat;