import Image from "next/image";
import aiImg from "../assets/ai.png";

function AiMessage({ message, index }) {
  return (
    <li key={index} className="w-full flex justify-start">
        <Image
        src={aiImg}
        alt="Ai"
        width={30}
        height={30}
        className="object-contain"
        style={{ marginLeft: "15px" }}
      />
      <div
        className="py-2 px-4 bg-white rounded-lg shadow-sm max-w-sm md:max-w-sm lg:max-w-xl"
        style={{
          borderLeft: "7px solid #02040F",
          color: "#292929CC",
          textAlign: "left",
          marginLeft: "10px",
        }}
      >
        <img src={message.body} alt="UML Diagram" />
        {message.isDeleted && (
          <p className="text-red-500">This message has been deleted</p>
        )}
      </div>
    </li>
  );
}

export default AiMessage;
