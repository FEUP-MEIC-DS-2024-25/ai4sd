import axios from "axios";
import React, { useState } from "react";
import { useChatContext } from './ChatPage';
import paperclip from '../assets/paperclip.png';
import Image from "next/image";
import { Input as UIInput } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

const BASE_URL = 'https://superhero-06-02-150699885662.europe-west1.run.app/';

function Input() {
    const { sharedVariable, setSharedVariable, chatId } = useChatContext();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible); // Toggle menu visibility
    };



    // const postContent = async (event) => {
    //     event.preventDefault();
    //     const form = document.querySelector('form');
    //     const formData = new FormData(form);
    //     console.log(BASE_URL);
    //     console.log(formData);
    //     const response = await axios.post(BASE_URL + '/app/get_content/', formData);
    //     setSharedVariable(!sharedVariable); 
    //     console.log(response);
    // };
    const postContent = async (event) => {
        event.preventDefault();
        const form = document.querySelector('form');
        const formData = new FormData(form);
        // if (chatId === null || chatId === undefined) {
        //     // create a new session if chatId is null
        //     const response = await axios.post(BASE_URL + '/app/create_session/');
        //     //set chatId
        //     const newChatId = response.data.session.session_id;
                    // };
        formData.append("session_id", chatId);
        console.log(BASE_URL);
        console.log(formData);
        const response = await axios.post(BASE_URL + '/app/get_content/', formData);
        setSharedVariable(!sharedVariable); 
        console.log(response);
    };

    return (
        <form onSubmit={postContent} encType="multipart/form-data">
            <div className="mb-3 mt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggleMenu}
                >
                    {isMenuVisible ? "Hide Prompt Options" : "Show Suggested Prompt Options"}
                </Button>
            </div>
            {isMenuVisible && (
                <div className="mb-3 d-flex gap-3">
                    <div className="form-check">
                        <input
                            className="form-check-input" type="radio" name="options"
                            value="NoExtra" id="NoExtra"
                            defaultChecked
                        />
                        <label className="form-check-label" htmlFor="NoExtra">
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
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="options"
                            value="realExamples" id="realExamples" />
                        <label className="form-check-label" htmlFor="realExamples">
                            Explore real examples
                        </label>
                    </div>
                </div>)}
            <div className="input-group">
                <UIInput type="url" className="form-control bg-white text-black border-gray-300" style={{ height: '35px' }} name="repo_url" placeholder="Insert your repository's URL here" aria-label="Insert your repository's URL here" aria-describedby="button-input" />
                <label 
                    htmlFor="formFileMultiple" 
                    className="input-group-text cursor-pointer flex items-center"
                    style={{height: '35px'}}
                >
                    <Image src={paperclip} style={{height: '25px', width:'20px'}} alt='Upload file image'  />
                </label>
                <UIInput 
                    type="file" 
                    className="hidden" 
                    name="image"
                    id="formFileMultiple" 
                    multiple 
                />
                <Button variant="secondary" type="submit" id="button-input" style={{ height: '35px' }}>Send</Button>
            </div>
        </form>
    );
}

export default Input;