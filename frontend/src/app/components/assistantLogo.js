function getAccentColor(area) {
    switch (area) {
        case "refact":
            return "#FFE354";
        case "arch":
            return "#2D75D4";
        case "verif":
            return "#A74DE3";
        case "req":
            return "#E94646";
        default:
            return "#C4C4C4";
    }
}

export default function AssistantLogo({ name, type, link }) {
    return (
        <a href={link} style={{ textDecoration: "none" }}>
            <div
                style={{
                    borderRadius: "100%",
                    width: 70 + "px",
                    height: 70 + "px",
                    backgroundColor: getAccentColor(type),
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <h3
                    style={{
                        color: "white",
                        padding: 0 + "px",
                        margin: 0 + "px",
                        textDecoration: "none",
                    }
                    }>{name}</h3>
            </div>
        </a>
    )

}