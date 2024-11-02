import Image from "next/image";

export default function Featured(props) {
    return (
        <div className="card" style={{backgroundColor: "#EFEFEF", height: "225px", minWidth: "1fr", display: "flex", flexDirection: "column"}}>
            <div className="header" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start", padding: "20px", paddingBottom: "10px"}}>
                <h4 className="card-title" style={{padding: "0px", margin: 0 + "px", marginRight: 5 + "px"}}>{props.name}</h4>
                <p className="card-text" style={{padding: 0 + "px", color: "#C4C4C4"}}>by {props.teamId}</p>
            </div>
            <div className="card-body" style={{padding: "20px", paddingTop: "0px", paddingBottom: "0px", margin: "0px"}}>
                <p className="card-text" style={{textAlign: "justify"}}>{props.description}</p>
            </div>
            <Image src="/pictures/logo.svg" alt="Logo" height={60} width={"100"} />
            <a className="navbar-brand d-flex align-items-center" href="/"></a>
        </div>

    );
}