import Image from "next/image"

// Pictures
import logo from "@/app/pictures/logo.svg";

export default function NavBar() {
    return (
    <nav id="mainNav" className="navbar navbar-expand-md sticky-top navbar-dark" style={{ borderBottom: "1px solid #EFEFEF", padding: 0 + "px" }}>
        <div className="container">
            <Image src={logo} alt="Logo" height={60} width={"100"} />
            <a className="navbar-brand d-flex align-items-center" href="/"></a>
            <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1">
                <span className="visually-hidden">Toggle navigation</span>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navcol-1" className="collapse navbar-collapse">
                <ul className="navbar-nav mx-auto"></ul>
            </div>
            <div className="ul" style={{ display: "inline-grid", gridGap: 30 + "px", gridTemplateColumns: "repeat(3, 1fr)" }}>
                <a href="#" >Home</a>
                <a href="#" >About</a>
                <a href="#" >Contact</a>
            </div>
        </div>
    </nav>)
}