import styles from "@/app/page.module.css";
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Assistant() {
    return (
        <div className={`${styles.assistantInteraction} assistantInteraction`}>
            <h1 className="">gerald.</h1>
            <p className="">not your average assistant</p>
            <form className="input">
                <input type="file"  id="fileInput" ></input>
                <label for="fileInput" class="custom-file-label file">
                    <i class="fas fa-paperclip"></i>
                </label>
                
                <input type="text"></input>

                <input type="submit"  id="submit" ></input>
                <label for="submit" class="custom-file-label">
                    <i className="fas fa-paper-plane"></i> 
                </label>
            </form>
        </div>
    )
}