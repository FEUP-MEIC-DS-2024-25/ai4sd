import Image from "next/image";
import userImg from "../assets/user.png";

function UserMessage({ message, index }) {
  return (
    <li key={index} className="w-full flex justify-end">
      <div
        className="py-2 px-4 bg-white rounded-lg shadow-sm max-w-xs md:max-w-sm lg:max-w-md"
        style={{
          borderRight: "7px solid #02040F",
          color: "#292929CC",
          textAlign: "left",
        }}
      >
        <p>{message.body}</p>
        {message.isDeleted && (
          <p className="text-red-500">This message has been deleted</p>
        )}
      </div>
      <Image
        src={userImg}
        alt="User"
        width={30}
        height={30}
        className="object-contain"
        style={{ marginLeft: "10px" }}
      />
    </li>
  );
}

export default UserMessage;
