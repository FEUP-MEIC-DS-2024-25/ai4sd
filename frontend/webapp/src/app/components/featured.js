import { getAccentColor, getShadowColor } from "@/app/utils/utils";

export default function Featured(props) {
    return (
        <div className="featured-card" style={{backgroundColor: "#EFEFEF", color: "black", borderRadius: "40px", height: "200px", minWidth: "1fr", display: "flex", flexDirection: "column", padding: "10px", boxShadow: "2px 4px 5px 0px " + getShadowColor(props.area)}}>
            <div className="header" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyItems: "start", padding: "20px 20px 10px 20px"}}>
                <h4 className="card-title" style={{padding: "0px", margin: 0 + "px", marginRight: 5 + "px"}}>{props.name}</h4>
                <p className="card-text" style={{padding: 0 + "px", color: "#C4C4C4"}}>by {props.teamId}</p>

            </div>
            <div className="featured-body" style={{padding: "20px", paddingTop: "0px", paddingBottom: "0px", margin: "0px 0px 10px 0px"}}>
                <p className="card-text" style={{textAlign: "justify", color: "#636363"}}>{props.description}</p>
            </div>
            <div className="featured-footer" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "end", padding: "10px 20px 10px 20px"}}>
                <button className="btn btn-primary" type="button" style={{display: "flex", justifyContent: "center", alignContent: "center", height: "38px", width: "135px", border: "1.5px solid rgba(196,196,196, 0.75)", backgroundColor: getAccentColor(props.area), boxShadow: "0px 0px 10px 1px rgba(196,196,196,1)", color: "#000000", fontWeight: "600"}}>USE IT</button>
            </div>
        </div>

    );
}