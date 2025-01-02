import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactMarkdown from 'react-markdown';

export default function Message(props) {
    return (
        <div className={`${props.index % 2 === 0 ? "user" : ""} msg`}>
            <ReactMarkdown>{props.children}</ReactMarkdown>
            {props.attachments && props.attachments.length > 0 && (
                <div className="attachments" title={props.attachments.map(file => file.name).join(', ')}>
                    <i className="fas fa-paperclip"></i> {props.attachments.length} file(s) attached
                </div>
            )}
        </div>
    );
}