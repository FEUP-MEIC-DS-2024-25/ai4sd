
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactMarkdown from 'react-markdown';

export default function Message(props) {
    return (
        <div className={`${props.index % 2 === 0 ? "user" : ""} msg`}>
            <ReactMarkdown>{props.children}</ReactMarkdown>
        </div>
    )
}