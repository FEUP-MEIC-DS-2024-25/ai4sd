import Image from "next/image";

// Pictures
import logo from "@/app/pictures/logo.svg";

export default function HeroBar() {
  return (
    <div
      className="container"
      style={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background:
          "linear-gradient(180deg, rgba(20,20,20,1) 8%, rgba(44,44,44,1) 100%);",
      }}
    >
      <Image
        src={logo}
        alt="Logo"
        height={215}
        width={600}
        style={{ marginTop: 7.5 + "px" }}
      />
      <div className="row" style={{ marginBottom: 30 + "px" }}>
        <span
          style={{ fontSize: 28 + "px", textAlign: "center", color: "white" }}
        >
          Artificial Intelligence for <br /> Software Development
        </span>
      </div>
    </div>
  );
}
