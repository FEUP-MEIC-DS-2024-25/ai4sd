import Link from "next/link";
import Image from "next/image";

import logo from "@/app/pictures/logo.svg";

export default function Footer() {
  return (
    <footer
      className="footer footer-dark"
      style={{ borderTop: "1px solid #EFEFEF" }}
    >
      <div
        className=""
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "450px 20px 300px 300px",
          backgroundColor: "#141414",
          minHeight: "325px",
          fontSize: "20px",
          placeContent: "center"
        }}
      >
        <div
          className="col"
          style={{
            display: "grid",
            gridTemplateRows: "100px 75px",
            placeContent: "center",
          }}
        >
          <Image src={logo} alt="logo" height={100} />
          <span
              style={{
                fontSize: 24 + "px",
                textAlign: "center",
                color: "white",
                marginTop: "10px",
                marginBottom: 30 + "px"
              }}
            >
              Artificial Intelligence for <br /> Software Development
            </span>
        </div>

        <div style={{maxWidth: "2px", background: "white"}}></div>

        <div
          className="col"
          style={{minHeight: "275px", display: "flex", flexDirection: "column", justifyContent: "start" }}
        >
            <span
              style={{
                fontSize: 24 + "px",
                textAlign: "left",
                color: "#636363",
                marginTop: "10px",
                marginBottom: 20 + "px",
                fontVariant: "small-caps",
                fontWeight: "bold",
                width: "65px",
                padding: "0px"
              }}
            >
              <div style={{borderBottom: "2px solid white"}}>
                Links
                </div>
            </span>
          <Link href={""} style={{ color: "white" }}>
            Home
          </Link>
          <Link href={""} style={{ color: "white" }}>
            About
          </Link>
          <Link href={""} style={{ color: "white" }}>
            Contact
          </Link>
        </div>
        <div
          className="col"
          style={{ minHeight: "275px", display: "flex", flexDirection: "column", justifyContent: "start" }}
        >
             <span
              style={{
                fontSize: 24 + "px",
                textAlign: "left",
                color: "#636363",
                marginTop: "10px",
                marginBottom: 20 + "px",
                fontVariant: "small-caps",
                fontWeight: "bold",
                width: "69px",
                padding: "0px"
              }}
            >
              <div style={{borderBottom: "2px solid white"}}>
                AI<sup>4</sup>SD
                </div>
            </span>
            <span style={{color: "white", fontWeight: "normal"}}>
                AI<sup>4</sup>SD is an integrated set of minimal AI assistants and tools that may help developers along the SDLC, to make software development better and faster.
            </span>
        </div>
      
      </div>

      
    </footer>
  );
}
