import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';


export default function AssistantMenu({ buttons }) {

    return (
        <div className="btn-group w-100 p-3" role="group" aria-label="Basic example">
            {buttons.map((button, index) => (
                <button
                    type="button" data-placement="top" data-toggle="tooltip" key={index}
                    title={button.name} className="btn btn-secondary">
                    <i className={`bi bi-${button.icon}`}></i>
                </button>
            ))}

        </div>
    )

}

