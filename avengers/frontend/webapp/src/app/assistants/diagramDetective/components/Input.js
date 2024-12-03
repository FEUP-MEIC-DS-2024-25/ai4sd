import axios from "axios";
import React, { useState } from "react";
import { useChatContext } from './ChatPage';
import paperclip from '../assets/paperclip.png';
import Image from "next/image";
const BASE_URL = process.env.REACT_APP_API_URL;

function Input() {
    const { sharedVariable, setSharedVariable } = useChatContext();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible); // Toggle menu visibility
    };

    

    const postContent = async (event) => {
        event.preventDefault();
        const form = document.querySelector('form');
        const formData = new FormData(form);
        console.log(BASE_URL);
        console.log(formData);
        const response = await axios.post(BASE_URL + '/app/get_content/', formData);
        setSharedVariable(!sharedVariable); 
        console.log(response);
    };


    return (
        <form onSubmit={postContent} encType="multipart/form-data">
            <div className="mb-3 mt-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleMenu}
                >
                    {isMenuVisible ? "Hide Prompt Options" : "Show Suggested Prompt Options"}
                </button>
            </div>
            {isMenuVisible && (
                <div className="mb-3 d-flex gap-3">
                    <div className="form-check">
                        <input
                            className="form-check-input" type="radio" name="options"
                            value="NoExtra" id="NoExtra"
                            defaultChecked
                        />
                        <label className="form-check-label" htmlFor="noExtra">
                            Send the content without special requests
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input" type="radio" name="options"
                            value="literature" id="literature" />
                        <label className="form-check-label" htmlFor="literature">
                            Receive literature
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input" type="radio" name="options"
                            value="ExplainReasoning" id="ExplainReasoning" />
                        <label className="form-check-label" htmlFor="ExplainReasoning">
                            Explain Reasoning
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="options"
                            value="recommendations" id="recommendations" />
                        <label className="form-check-label" htmlFor="recommendations">
                            Get improvement recommendations
                        </label>
                    </div>
                </div>)}
            <div className="input-group">
                <input type="url" className="form-control bg-white text-black border-gray-300"  name="repo_url" placeholder="Insert your repository's URL here" aria-label="Insert your repository's URL here" aria-describedby="button-input" />
                <label 
                    htmlFor="formFileMultiple" 
                    className="input-group-text cursor-pointer flex items-center"
                >
                    <Image src={paperclip} alt='Upload file image' style={{
                        width: '30px',
                        height: '30px',
                        objectFit: 'contain',
                    }} />
                </label>
                <input 
                    type="file" 
                    className="hidden" 
                    name="image"
                    id="formFileMultiple" 
                    multiple 
                />
                <button className="btn btn-secondary" type="submit" id="button-input">Send</button>
            </div>

            
        </form >
    );

}

export default Input;