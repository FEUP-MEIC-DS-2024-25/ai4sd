import sendIcon from "../assets/Send.svg";
import Image from "next/image";

function MessageInput({handleMessageSubmit, handleInputChange, newMessage}) {
    return(
        <footer className="mb-5 w-100">
            <form onSubmit={handleMessageSubmit} className="bg-white rounded-3 flex g-3 p-2 w-100" style={{border: "2px solid #02040F"}}>
                <input
                    type="text"
                    placeholder="Type a new message here"
                    value={newMessage} // Bind input field value to newMessage state
                    onChange={handleInputChange} // Update state on input change
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleMessageSubmit(e); // Trigger message submit on Enter
                        }
                    }}
                    className="w-full px-4 py-2 text-black bg-transparent focus:outline-none" // Add text-black for black text
                />
                <button type="submit" className="text-black px-2"><Image src={sendIcon} alt={"Send"} width={40} height={40}/></button>
            </form>
        </footer>
    );
}

export default MessageInput;