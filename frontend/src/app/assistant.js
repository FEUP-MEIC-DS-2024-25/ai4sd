import Image from "next/image";

function getAccentColor(area) {
    switch (area) {
        case "arch":
            return "#FFE354";
        case "refact":
            return "#2D75D4";
        case "verif":
            return "#A74DE3";
        case "req":
            return "#E94646";
        default:
            return "#C4C4C4";
    }
}

function getShadowColor(area) {
    switch (area) {
        case "arch":
            return "rgba(255,227,84, 0.5)";
        case "refact":
            return "rgba(45,117,212, 0.5)";
        case "verif":
            return "rgba(167,77,227, 0.5)";
        case "req":
            return "rgba(233,70,70, 0.5)";
        default:
            return "#C4C4C4";
    }
}

export default function Assistant(props) {
    return (
        <div className="featured-card" style={{backgroundColor: "#EFEFEF", color: "black", borderRadius: "40px", height: "260px", minWidth: "1fr", display: "flex", flexDirection: "column", padding: "10px", boxShadow: "2px 4px 5px 0px " + getShadowColor(props.area)}}>
            <Image src="/pictures/logo.svg" alt="LOGO" height={125} width={125} style={{position: "relative", zIndex: 1, marginTop: -62.5 + "px", marginRight: -62.5 + "px", borderRadius: "100%", backgroundColor: getAccentColor(props.area), marginLeft: "auto"}} />
            <div className="header" style={{marginTop: -62.5 + "px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start", padding: "20px 20px 10px 20px"}}>
                <h4 className="card-title" style={{padding: "0px", margin: 0 + "px", marginRight: 5 + "px"}}>{props.name}</h4>
                <p className="card-text" style={{padding: 0 + "px", color: "#C4C4C4"}}>by {props.teamId}</p>
                
            </div>
            <div className="featured-body" style={{fontSize: "18px", padding: "0px 20px 10px 20px", paddingTop: "0px", paddingBottom: "0px", margin: "10px 0px 0px 0px"}}>
                <p className="card-text" style={{textAlign: "justify", color: "#636363"}}>{props.description}</p>
            </div>
            <div className="featured-footer" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "end", padding: "10px 20px 0px 20px"}}>
                <button className="btn btn-primary" type="button" style={{display: "flex", justifyContent: "center", alignContent: "center", height: "60px", width: "100%", border: "1.5px solid rgba(196,196,196, 0.75)", backgroundColor: getAccentColor(props.area), boxShadow: "0px 0px 10px 1px rgba(196,196,196,1)", fontSize: "32px", color: "#000000", fontWeight: "600"}}>ACCESS</button>
            </div>
        </div>

    );
}