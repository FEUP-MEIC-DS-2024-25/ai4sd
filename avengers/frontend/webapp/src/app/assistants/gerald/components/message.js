
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Message(props) {
    return (
        <div className={`${props.index % 2 === 0 ? "user" : ""} msg`}>
            {props.children}
        </div>
    )
}