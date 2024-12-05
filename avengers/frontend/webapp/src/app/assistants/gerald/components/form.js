import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function AssistantForm(props) {
    const handleSubmit = (event) => {
        event.preventDefault();  

        const fileInput = document.getElementById('fileInput');
        const textInput = document.querySelector('input[type="text"]');
        

        props.callback(textInput.value)

        
        event.target.reset();  
    };
    return (
        <form className="input" onSubmit={handleSubmit}>
            <input type="file"  id="fileInput" ></input>
            <label htmlFor="fileInput" className="custom-file-label file">
                <i className="fas fa-paperclip"></i>
            </label>
            
            <input type="text"></input>

            <input type="submit"  id="submit" ></input>
            <label htmlFor="submit" className="custom-file-label">
                <i className="fas fa-paper-plane"></i> 
            </label>
        </form>
    )
}