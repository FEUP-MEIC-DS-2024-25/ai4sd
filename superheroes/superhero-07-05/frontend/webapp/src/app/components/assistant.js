import Image from "next/image";
import logo from "@/app/pictures/logo.svg";
import { getAccentColor, getShadowColor } from "@/app/utils/utils.js";

export default function Assistant(props) {
  return (
    <div
      className="featured-card"
      style={{
        backgroundColor: "#D9D9D9",
        color: "black",
        borderRadius: "40px",
        height: "260px",
        minWidth: "1fr",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxShadow: "2px 4px 5px 0px " + getShadowColor(props.area),
      }}
    >
      <Image
        src={logo}
        alt="Logo"
        height={110}
        width={110}
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: -55 + "px",
          marginRight: -55 + "px",
          borderRadius: "100%",
          backgroundColor: getAccentColor(props.area),
          marginLeft: "auto",
        }}
      />
      <div
        className="header"
        style={{
          marginTop: -62.5 + "px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          padding: "20px 20px 0px 20px",
        }}
      >
        <h4
          className="card-title"
          style={{ padding: "0px", margin: 0 + "px", marginRight: 5 + "px" }}
        >
          {props.name}
        </h4>
      </div>
      <div
        className="featured-body"
        style={{
          fontSize: "18px",
          padding: "0px 20px 10px 20px",
          paddingTop: "0px",
          paddingBottom: "0px",
          margin: "10px 0px 0px 0px",
        }}
      >
        <p
          className="card-text"
          style={{ textAlign: "justify", color: "#636363" }}
        >
          {props.description}
        </p>
      </div>
      <div
        className="featured-footer"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "end",
          padding: "10px 20px 0px 20px",
        }}
      >
        <button
          className="btn btn-primary"
          type="button"
          style={{
            display: "flex",
            borderRadius: "25px",
            justifyContent: "center",
            alignContent: "center",
            height: "60px",
            width: "100%",
            marginBottom: "15px",
            border: "1.5px solid rgba(196,196,196, 0.75)",
            backgroundColor: getAccentColor(props.area),
            boxShadow: "0px 0px 10px 1px rgba(196,196,196,1)",
            fontSize: "32px",
            color: "#000000",
            fontWeight: "600",
          }}
        >
          ACCESS
        </button>
      </div>
    </div>
  );
}
